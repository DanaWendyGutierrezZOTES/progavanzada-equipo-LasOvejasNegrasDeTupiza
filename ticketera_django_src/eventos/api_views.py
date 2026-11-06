from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import PerfilUsuario, Evento, TipoTicket, Compra
from .serializers import (
    UserSerializer,
    EventoSerializer,
    TipoTicketSerializer,
    CompraSerializer
)


# ==========================================================
# 1. AUTENTICACIÓN Y USUARIOS
# ==========================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """Inicia sesión y retorna los datos del usuario autenticado"""
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()

    user = authenticate(request, username=username, password=password)
    if not user:
        # Búsqueda secundaria por email o insensitiva para mayor tolerancia en demos
        u = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).first()
        if u and u.check_password(password):
            user = u

    if user:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'mensaje': 'Inicio de sesión exitoso',
            'usuario': serializer.data
        }, status=status.HTTP_200_OK)

    return Response({
        'error': 'Usuario o contraseña incorrectos'
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_logout(request):
    """Cierra la sesión del usuario"""
    logout(request)
    return Response({'mensaje': 'Sesión cerrada correctamente'})


@api_view(['POST'])
@permission_classes([AllowAny])
def api_registro(request):
    """Registra un nuevo usuario (Comprador u Organizador)"""
    data = request.data
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    email = data.get('email', '').strip()
    nombre = data.get('nombre', '').strip()
    rol = data.get('rol', 'comprador')
    telefono = data.get('telefono', '').strip()

    if not username or not password:
        return Response({'error': 'Nombre de usuario y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username__iexact=username).exists():
        return Response({'error': 'El nombre de usuario ya está en uso'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=nombre
    )
    perfil, _ = PerfilUsuario.objects.get_or_create(user=user)
    perfil.rol = rol if rol in ['comprador', 'organizador'] else 'comprador'
    perfil.telefono = telefono
    perfil.save()

    login(request, user)
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_usuario_actual(request):
    """Retorna el usuario de la sesión actual"""
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    return Response(None)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_usuarios_lista(request):
    """Lista usuarios para cambios rápidos de sesión en demo"""
    usuarios = User.objects.all().select_related('perfil')
    return Response(UserSerializer(usuarios, many=True).data)


# ==========================================================
# 2. EVENTOS
# ==========================================================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_eventos_lista(request):
    """
    GET: Listado público con filtros (q, ciudad, categoria, fecha)
    POST: Crea un nuevo evento (con tipos de tickets iniciales opcionales)
    """
    if request.method == 'GET':
        query = request.GET.get('q', '').strip()
        ciudad = request.GET.get('ciudad', '').strip()
        categoria = request.GET.get('categoria', '').strip()
        fecha = request.GET.get('fecha', '').strip()

        eventos = Evento.objects.all().prefetch_related('tipos_ticket').select_related('organizador')

        if query:
            eventos = eventos.filter(
                Q(nombre__icontains=query) |
                Q(descripcion__icontains=query) |
                Q(lugar__icontains=query) |
                Q(estadio_nombre__icontains=query)
            )
        if ciudad and ciudad.lower() != 'todas':
            eventos = eventos.filter(Q(ciudad__iexact=ciudad) | Q(lugar__icontains=ciudad))
        if categoria and categoria.lower() != 'todos':
            eventos = eventos.filter(Q(categoria__iexact=categoria) | Q(nombre__icontains=categoria))
        if fecha:
            eventos = eventos.filter(fecha__gte=fecha)

        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        # Asignar organizador (usuario autenticado o el primero con rol organizador para demo)
        organizador = request.user if request.user.is_authenticated else User.objects.filter(perfil__rol='organizador').first()
        if not organizador:
            organizador = User.objects.first()

        evento = Evento.objects.create(
            nombre=data.get('nombre', 'Evento Nuevo'),
            subtitulo=data.get('subtitulo', ''),
            categoria=data.get('categoria', 'General'),
            ciudad=data.get('ciudad', 'La Paz'),
            descripcion=data.get('descripcion', ''),
            fecha=data.get('fecha'),
            hora=data.get('hora', '20:00'),
            lugar=data.get('lugar', ''),
            estadio_nombre=data.get('estadio_nombre', ''),
            capacidad_estadio=data.get('capacidad_estadio', ''),
            ubicacion_mapa=data.get('ubicacion_mapa', ''),
            lat=data.get('lat'),
            lng=data.get('lng'),
            sectores_geograficos=data.get('sectores_geograficos', []),
            imagen_url=data.get('imagen_url', ''),
            precio_base=data.get('precio_base', 0),
            cupo_total=data.get('cupo_total', 100),
            # 🆕 CAMBIO 1: Se acepta capacidad_maxima al crear el evento
            capacidad_maxima=data.get('capacidad_maxima', 0),
            organizador=organizador
        )

        # Crear tipos de ticket si vienen incluidos
        tipos_ticket_data = data.get('tipos_ticket', [])
        for t in tipos_ticket_data:
            cupo = int(t.get('cantidad_total') or t.get('cantidad_disponible') or 100)
            TipoTicket.objects.create(
                evento=evento,
                nombre=t.get('nombre', 'General'),
                sector=t.get('sector', ''),
                puerta=t.get('puerta', ''),
                color_zona=t.get('color_zona', '#6366f1'),
                precio=t.get('precio', evento.precio_base),
                cantidad_total=cupo,
                cantidad_disponible=cupo
            )

        return Response(EventoSerializer(evento).data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def api_evento_detalle(request, pk):
    """Detalle, actualización y eliminación de un evento específico"""
    evento = get_object_or_404(Evento.objects.prefetch_related('tipos_ticket'), pk=pk)

    if request.method == 'GET':
        return Response(EventoSerializer(evento).data)

    elif request.method in ['PUT', 'PATCH']:
        data = request.data
        for field in ['nombre', 'subtitulo', 'categoria', 'ciudad', 'descripcion', 'fecha', 'hora',
                      'lugar', 'estadio_nombre', 'capacidad_estadio', 'ubicacion_mapa', 'lat', 'lng',
                      'sectores_geograficos', 'imagen_url', 'precio_base', 'cupo_total', 'capacidad_maxima']:
            if field in data:
                setattr(evento, field, data[field])
        evento.save()

        # Si vienen tipos de ticket para sincronizar
        if 'tipos_ticket' in data:
            for t_data in data['tipos_ticket']:
                if 'id' in t_data and str(t_data['id']).isdigit():
                    t_obj = TipoTicket.objects.filter(pk=t_data['id'], evento=evento).first()
                    if t_obj:
                        t_obj.nombre = t_data.get('nombre', t_obj.nombre)
                        t_obj.precio = t_data.get('precio', t_obj.precio)
                        t_obj.cantidad_disponible = t_data.get('cantidad_disponible', t_obj.cantidad_disponible)
                        t_obj.save()

        return Response(EventoSerializer(evento).data)

    elif request.method == 'DELETE':
        evento.delete()
        return Response({'mensaje': 'Evento eliminado exitosamente'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_cancelar_evento(request, pk):
    """
    🆕 CAMBIO 2 - Regla de negocio: SOLO el administrador (is_superuser) puede cancelar un evento.
    El organizador NO tiene este permiso; solo puede crear, editar o eliminar sus propios eventos.

    Ejemplo de uso:
        POST /api/eventos/5/cancelar/
        Headers: Cookie con sesión de admin activa
    """
    evento = get_object_or_404(Evento, pk=pk)

    # El usuario debe estar autenticado
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Debes iniciar sesion para realizar esta accion.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Solo el administrador (superusuario) puede cancelar
    if not request.user.is_superuser:
        return Response(
            {'error': 'Solo el administrador puede cancelar eventos. Los organizadores no tienen este permiso.'},
            status=status.HTTP_403_FORBIDDEN
        )

    # No cancelar algo que ya esta cancelado
    if evento.estado == 'cancelado':
        return Response(
            {'error': 'Este evento ya se encuentra cancelado.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    evento.estado = 'cancelado'
    evento.save()

    return Response({
        'mensaje': f"El evento '{evento.nombre}' ha sido cancelado correctamente.",
        'evento': EventoSerializer(evento).data
    }, status=status.HTTP_200_OK)


# ==========================================================
# 3. GESTIÓN DE TICKETS
# ==========================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def api_crear_tipo_ticket(request, evento_id):
    """Agrega una nueva categoría de ticket a un evento"""
    evento = get_object_or_404(Evento, pk=evento_id)
    data = request.data

    cupo = int(data.get('cantidad_total') or data.get('cantidad_disponible') or 100)
    ticket = TipoTicket.objects.create(
        evento=evento,
        nombre=data.get('nombre', 'General'),
        sector=data.get('sector', ''),
        puerta=data.get('puerta', ''),
        color_zona=data.get('color_zona', '#6366f1'),
        precio=data.get('precio', 0),
        cantidad_total=cupo,
        cantidad_disponible=cupo
    )
    return Response(TipoTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def api_eliminar_tipo_ticket(request, pk):
    """Elimina una categoría de ticket si no tiene compras registradas"""
    ticket = get_object_or_404(TipoTicket, pk=pk)
    if ticket.compras.exists():
        return Response({
            'error': 'No se puede eliminar porque ya tiene compras registradas'
        }, status=status.HTTP_400_BAD_REQUEST)

    ticket.delete()
    return Response({'mensaje': 'Ticket eliminado correctamente'}, status=status.HTTP_200_OK)


# ==========================================================
# 4. COMPRAS Y TICKETS DIGITALES
# ==========================================================

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_compras_lista(request):
    """
    GET: Historial de compras (filtrado por usuario si está autenticado)
    POST: Simulación de compra con transacción atómica y descuento de cupo
    """
    if request.method == 'GET':
        compras = Compra.objects.all().select_related('tipo_ticket', 'tipo_ticket__evento', 'usuario')

        usuario_id = request.GET.get('usuario_id')
        if usuario_id:
            compras = compras.filter(usuario_id=usuario_id)
        elif request.user.is_authenticated:
            compras = compras.filter(usuario=request.user)

        serializer = CompraSerializer(compras, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        evento_id = data.get('eventoId') or data.get('evento_id')
        tipo_ticket_id = data.get('tipoTicketId') or data.get('tipo_ticket_id')
        cantidad = int(data.get('cantidad', 1))

        # Determinar usuario de la compra
        usuario = None
        if request.user.is_authenticated:
            usuario = request.user
        elif data.get('usuario_id'):
            usuario = User.objects.filter(pk=data.get('usuario_id')).first()
        elif data.get('usuario') and isinstance(data.get('usuario'), dict):
            u_id = data['usuario'].get('id')
            if u_id:
                usuario = User.objects.filter(pk=u_id).first()

        if not usuario:
            # Fallback a usuario comprador de demo
            usuario = User.objects.filter(perfil__rol='comprador').first() or User.objects.first()

        with transaction.atomic():
            # Bloqueo select_for_update para evitar sobreventa concurrente
            tipo_ticket = get_object_or_404(TipoTicket.objects.select_for_update(), pk=tipo_ticket_id)

            if tipo_ticket.cantidad_disponible < cantidad:
                return Response({
                    'error': f'Solo quedan {tipo_ticket.cantidad_disponible} entradas disponibles'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Descontar cupo
            tipo_ticket.cantidad_disponible -= cantidad
            tipo_ticket.save()

            # Crear compra con código único
            precio_unitario = tipo_ticket.precio
            total = precio_unitario * cantidad
            compra = Compra.objects.create(
                usuario=usuario,
                tipo_ticket=tipo_ticket,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                total=total
            )

        return Response(CompraSerializer(compra).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_compra_detalle(request, pk):
    """Retorna los datos de un ticket o compra específica"""
    compra = get_object_or_404(
        Compra.objects.select_related('tipo_ticket', 'tipo_ticket__evento', 'usuario'),
        pk=pk
    )
    return Response(CompraSerializer(compra).data)


# ==========================================================
# 5. DASHBOARD ORGANIZADOR
# ==========================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def api_organizador_dashboard(request):
    """Métricas en Bolivianos (Bs.) y resumen de ventas por evento"""
    # Si hay organizador en sesión o parámetro
    organizador = None
    if request.user.is_authenticated and request.user.perfil.es_organizador:
        organizador = request.user
    elif request.GET.get('organizador_id'):
        organizador = User.objects.filter(pk=request.GET.get('organizador_id')).first()

    eventos = Evento.objects.all().prefetch_related('tipos_ticket')
    if organizador and not organizador.is_superuser:
        eventos = eventos.filter(organizador=organizador)

    total_eventos = eventos.count()
    compras_qs = Compra.objects.filter(tipo_ticket__evento__in=eventos)
    total_tickets_vendidos = compras_qs.aggregate(total=Sum('cantidad'))['total'] or 0
    total_recaudacion = compras_qs.aggregate(total=Sum('total'))['total'] or 0.00

    return Response({
        'total_eventos': total_eventos,
        'total_tickets_vendidos': total_tickets_vendidos,
        'total_recaudacion': total_recaudacion,
        'eventos': EventoSerializer(eventos, many=True).data
    })


# ==========================================================
# 6. 🆕 CAMBIO 3: HISTORIAL DE VENTAS
# ==========================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def api_historial_ventas(request):
    """
    🆕 CAMBIO 3 - Endpoint: Historial completo de ventas con filtros opcionales.

    Parámetros GET opcionales:
        - evento_id: Filtrar ventas de un evento específico
        - organizador_id: Filtrar ventas de los eventos de un organizador
        - fecha_desde: Fecha de inicio (YYYY-MM-DD)
        - fecha_hasta: Fecha de fin (YYYY-MM-DD)

    Ejemplo de uso:
        GET /api/ventas/historial/
        GET /api/ventas/historial/?evento_id=3
        GET /api/ventas/historial/?fecha_desde=2026-01-01&fecha_hasta=2026-12-31
    """
    compras = Compra.objects.all().select_related(
        'usuario',
        'tipo_ticket',
        'tipo_ticket__evento',
        'tipo_ticket__evento__organizador'
    ).order_by('-fecha_compra')

    # Filtro por evento específico
    evento_id = request.GET.get('evento_id')
    if evento_id:
        compras = compras.filter(tipo_ticket__evento_id=evento_id)

    # Filtro por organizador
    organizador_id = request.GET.get('organizador_id')
    if organizador_id:
        compras = compras.filter(tipo_ticket__evento__organizador_id=organizador_id)

    # Filtro por rango de fechas
    fecha_desde = request.GET.get('fecha_desde')
    if fecha_desde:
        compras = compras.filter(fecha_compra__date__gte=fecha_desde)

    fecha_hasta = request.GET.get('fecha_hasta')
    if fecha_hasta:
        compras = compras.filter(fecha_compra__date__lte=fecha_hasta)

    # Calcular totales del resultado filtrado
    totales = compras.aggregate(
        total_tickets=Sum('cantidad'),
        total_ingresos=Sum('total')
    )

    return Response({
        'resumen': {
            'total_ventas': compras.count(),
            'total_tickets_vendidos': totales['total_tickets'] or 0,
            'total_ingresos_bs': float(totales['total_ingresos'] or 0),
        },
        'ventas': CompraSerializer(compras, many=True).data
    })
