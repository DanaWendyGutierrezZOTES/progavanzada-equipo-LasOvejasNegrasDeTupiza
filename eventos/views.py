from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from django.db.models import Q, Sum, F
from django.core.exceptions import PermissionDenied
from django.utils import timezone

from .models import Evento, TipoTicket, Compra, PerfilUsuario
from .forms import (
    RegistroUsuarioForm,
    CustomLoginForm,
    EventoForm,
    TipoTicketForm,
    CompraTicketForm,
)


def lista_eventos(request):
    """Listado público de eventos con búsqueda y filtros simples"""
    query = request.GET.get('q', '').strip()
    fecha_filtro = request.GET.get('fecha', '').strip()

    eventos = Evento.objects.all().select_related('organizador').prefetch_related('tipos_ticket')

    if query:
        eventos = eventos.filter(
            Q(nombre__icontains=query) |
            Q(descripcion__icontains=query) |
            Q(lugar__icontains=query)
        )

    if fecha_filtro:
        eventos = eventos.filter(fecha__gte=fecha_filtro)

    # Ordenar por fecha próxima
    eventos = eventos.order_by('fecha', 'hora')

    context = {
        'eventos': eventos,
        'query': query,
        'fecha_filtro': fecha_filtro,
    }
    return render(request, 'eventos/lista_eventos.html', context)


def detalle_evento(request, pk):
    """Vista de detalle de un evento con sus tipos de ticket disponibles"""
    evento = get_object_or_404(
        Evento.objects.prefetch_related('tipos_ticket'),
        pk=pk
    )
    es_dueno = request.user.is_authenticated and (evento.organizador == request.user or request.user.is_superuser)
    
    context = {
        'evento': evento,
        'tipos_ticket': evento.tipos_ticket.all(),
        'es_dueno': es_dueno,
    }
    return render(request, 'eventos/detalle_evento.html', context)


@login_required
def crear_evento(request):
    """Creación de eventos: solo para usuarios con rol organizador"""
    if not request.user.perfil.es_organizador:
        messages.error(request, "Acceso restringido: necesitas una cuenta de Organizador para publicar eventos.")
        return redirect('lista_eventos')

    if request.method == 'POST':
        form = EventoForm(request.POST, request.FILES)
        nombre_ticket = request.POST.get('nombre_ticket', 'General')
        precio_ticket = request.POST.get('precio_ticket', '')
        cupo_ticket = request.POST.get('cupo_ticket', '')

        if form.is_valid():
            evento = form.save(commit=False)
            evento.organizador = request.user
            evento.save()

            # Crear tipo de ticket inicial automáticamente si se completaron los campos
            if precio_ticket and cupo_ticket:
                try:
                    TipoTicket.objects.create(
                        evento=evento,
                        nombre=nombre_ticket or 'General',
                        precio=float(precio_ticket),
                        cantidad_disponible=int(cupo_ticket),
                        cantidad_total=int(cupo_ticket)
                    )
                except ValueError:
                    pass
            elif evento.cupo_total > 0:
                # Si no especificó ticket inicial pero sí cupo total, creamos un General por defecto
                TipoTicket.objects.create(
                    evento=evento,
                    nombre='General',
                    precio=evento.precio_base,
                    cantidad_disponible=evento.cupo_total,
                    cantidad_total=evento.cupo_total
                )

            messages.success(request, f"¡El evento '{evento.nombre}' ha sido creado exitosamente!")
            return redirect('gestionar_tickets', pk=evento.pk)
    else:
        form = EventoForm()

    return render(request, 'eventos/crear_evento.html', {'form': form, 'titulo': 'Crear Nuevo Evento'})


@login_required
def editar_evento(request, pk):
    """Edición de evento: solo el organizador del evento"""
    evento = get_object_or_404(Evento, pk=pk)

    if evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para editar este evento.")
        return redirect('detalle_evento', pk=pk)

    if request.method == 'POST':
        form = EventoForm(request.POST, request.FILES, instance=evento)
        if form.is_valid():
            form.save()
            messages.success(request, "El evento ha sido actualizado con éxito.")
            return redirect('detalle_evento', pk=evento.pk)
    else:
        form = EventoForm(instance=evento)

    return render(request, 'eventos/crear_evento.html', {
        'form': form,
        'evento': evento,
        'titulo': f"Editar Evento: {evento.nombre}"
    })


@login_required
def eliminar_evento(request, pk):
    """Eliminación de evento: solo el organizador del evento"""
    evento = get_object_or_404(Evento, pk=pk)

    if evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para eliminar este evento.")
        return redirect('detalle_evento', pk=pk)

    if request.method == 'POST':
        nombre = evento.nombre
        evento.delete()
        messages.success(request, f"El evento '{nombre}' ha sido eliminado correctamente.")
        return redirect('panel_organizador')

    return render(request, 'eventos/confirmar_eliminar.html', {'evento': evento})


@login_required
def gestionar_tickets(request, pk):
    """Gestión de tipos de tickets para un evento específico"""
    evento = get_object_or_404(Evento, pk=pk)

    if evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para gestionar los tickets de este evento.")
        return redirect('detalle_evento', pk=pk)

    if request.method == 'POST':
        form = TipoTicketForm(request.POST)
        if form.is_valid():
            ticket = form.save(commit=False)
            ticket.evento = evento
            ticket.cantidad_total = ticket.cantidad_disponible
            ticket.save()
            messages.success(request, f"Tipo de ticket '{ticket.nombre}' agregado con éxito.")
            return redirect('gestionar_tickets', pk=evento.pk)
    else:
        form = TipoTicketForm()

    tipos_ticket = evento.tipos_ticket.all()
    return render(request, 'eventos/gestionar_tickets.html', {
        'evento': evento,
        'tipos_ticket': tipos_ticket,
        'form': form
    })


@login_required
def eliminar_ticket(request, pk):
    """Eliminar un tipo de ticket si no tiene compras asociadas"""
    ticket = get_object_or_404(TipoTicket, pk=pk)
    evento_id = ticket.evento.pk

    if ticket.evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para realizar esta acción.")
        return redirect('detalle_evento', pk=evento_id)

    if ticket.compras.exists():
        messages.error(request, "No se puede eliminar este tipo de ticket porque ya tiene compras registradas.")
    else:
        ticket.delete()
        messages.success(request, "Tipo de ticket eliminado exitosamente.")

    return redirect('gestionar_tickets', pk=evento_id)


@login_required
def comprar_ticket(request, tipo_id):
    """Flujo de compra de ticket: selección de cantidad, confirmación y generación de código"""
    tipo_ticket = get_object_or_404(
        TipoTicket.objects.select_related('evento', 'evento__organizador'),
        pk=tipo_id
    )
    evento = tipo_ticket.evento

    if tipo_ticket.cantidad_disponible <= 0:
        messages.warning(request, "Lo sentimos, este tipo de ticket se encuentra agotado.")
        return redirect('detalle_evento', pk=evento.pk)

    if request.method == 'POST':
        form = CompraTicketForm(tipo_ticket=tipo_ticket, data=request.POST)
        if form.is_valid():
            cantidad = form.cleaned_data['cantidad']
            
            with transaction.atomic():
                # Bloqueo select_for_update para evitar condiciones de carrera en compras concurrentes
                tipo_ticket_lock = TipoTicket.objects.select_for_update().get(pk=tipo_id)

                if tipo_ticket_lock.cantidad_disponible < cantidad:
                    messages.error(
                        request,
                        f"Solo quedan {tipo_ticket_lock.cantidad_disponible} tickets disponibles. Intenta con una cantidad menor."
                    )
                    return redirect('comprar_ticket', tipo_id=tipo_id)

                # Descontar stock disponible
                tipo_ticket_lock.cantidad_disponible -= cantidad
                tipo_ticket_lock.save()

                # Crear registro de compra con código único
                precio_unitario = tipo_ticket_lock.precio
                total = precio_unitario * cantidad
                compra = Compra.objects.create(
                    usuario=request.user,
                    tipo_ticket=tipo_ticket_lock,
                    cantidad=cantidad,
                    precio_unitario=precio_unitario,
                    total=total
                )

            messages.success(request, "¡Compra realizada con éxito! Tu ticket ha sido generado.")
            return redirect('detalle_compra', pk=compra.pk)
    else:
        form = CompraTicketForm(tipo_ticket=tipo_ticket)

    context = {
        'tipo_ticket': tipo_ticket,
        'evento': evento,
        'form': form,
    }
    return render(request, 'eventos/comprar_ticket.html', context)


@login_required
def detalle_compra(request, pk):
    """Vista del ticket digital con código único simulando QR"""
    compra = get_object_or_404(
        Compra.objects.select_related('usuario', 'tipo_ticket', 'tipo_ticket__evento'),
        pk=pk
    )

    # Solo el comprador, el organizador del evento o el admin pueden ver el ticket
    es_comprador = compra.usuario == request.user
    es_organizador = compra.tipo_ticket.evento.organizador == request.user
    if not (es_comprador or es_organizador or request.user.is_superuser):
        raise PermissionDenied("No tienes permiso para ver este ticket.")

    return render(request, 'eventos/detalle_compra.html', {'compra': compra})


@login_required
def mis_tickets(request):
    """Vista de 'mis tickets comprados' para el usuario actual"""
    compras = Compra.objects.filter(usuario=request.user).select_related(
        'tipo_ticket',
        'tipo_ticket__evento'
    ).order_by('-fecha_compra')

    return render(request, 'eventos/mis_tickets.html', {'compras': compras})


@login_required
def panel_organizador(request):
    """Panel para el organizador con estadísticas y lista de sus eventos y tickets vendidos"""
    if not request.user.perfil.es_organizador:
        messages.warning(request, "Debes ser Organizador para acceder a este panel.")
        return redirect('lista_eventos')

    eventos = Evento.objects.filter(organizador=request.user).prefetch_related('tipos_ticket', 'tipos_ticket__compras').order_by('-fecha')

    # Métricas generales del organizador
    total_eventos = eventos.count()
    
    # Total de tickets vendidos e ingresos simulados
    compras_organizador = Compra.objects.filter(tipo_ticket__evento__organizador=request.user)
    total_tickets_vendidos = compras_organizador.aggregate(total=Sum('cantidad'))['total'] or 0
    total_recaudacion = compras_organizador.aggregate(total=Sum('total'))['total'] or 0.00

    context = {
        'eventos': eventos,
        'total_eventos': total_eventos,
        'total_tickets_vendidos': total_tickets_vendidos,
        'total_recaudacion': total_recaudacion,
    }
    return render(request, 'eventos/panel_organizador.html', context)


def registro_usuario(request):
    """Registro de nuevos usuarios con rol opcional (Comprador u Organizador)"""
    if request.user.is_authenticated:
        return redirect('lista_eventos')

    if request.method == 'POST':
        form = RegistroUsuarioForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"¡Bienvenido a TicketEventos, {user.first_name or user.username}! Tu cuenta ha sido creada.")
            if user.perfil.es_organizador:
                return redirect('panel_organizador')
            return redirect('lista_eventos')
    else:
        form = RegistroUsuarioForm()

    return render(request, 'eventos/registro.html', {'form': form})


def iniciar_sesion(request):
    """Inicio de sesión con Bootstrap"""
    if request.user.is_authenticated:
        return redirect('lista_eventos')

    if request.method == 'POST':
        form = CustomLoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"¡Hola de nuevo, {user.first_name or user.username}!")
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            if user.perfil.es_organizador:
                return redirect('panel_organizador')
            return redirect('lista_eventos')
    else:
        form = CustomLoginForm()

    return render(request, 'eventos/login.html', {'form': form})


def cerrar_sesion(request):
    """Cierre de sesión seguro"""
    logout(request)
    messages.info(request, "Has cerrado sesión correctamente. ¡Hasta pronto!")
    return redirect('lista_eventos')
