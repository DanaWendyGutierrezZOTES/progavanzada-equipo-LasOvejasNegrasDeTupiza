from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q, Sum


class Evento(models.Model):
    """
    [CAPA MODELO - MVC]
    Entidad Evento: Representa un concierto o espectáculo y encapsula las consultas,
    creación, actualización y cálculo de métricas del organizador.
    """
    nombre = models.CharField(max_length=200, verbose_name="Nombre del Evento")
    subtitulo = models.CharField(max_length=255, blank=True, default='', verbose_name="Subtítulo")
    categoria = models.CharField(max_length=100, blank=True, default='General', verbose_name="Categoría")
    ciudad = models.CharField(max_length=100, blank=True, default='La Paz', verbose_name="Ciudad")
    descripcion = models.TextField(verbose_name="Descripción")
    fecha = models.DateField(verbose_name="Fecha del Evento")
    hora = models.TimeField(verbose_name="Hora del Evento")
    lugar = models.CharField(max_length=255, verbose_name="Lugar / Recinto")
    estadio_nombre = models.CharField(max_length=200, blank=True, default='', verbose_name="Nombre del Estadio / Recinto")
    capacidad_estadio = models.CharField(max_length=100, blank=True, default='', verbose_name="Capacidad del Recinto")
    ubicacion_mapa = models.CharField(max_length=255, blank=True, default='', verbose_name="Ubicación Mapa")
    lat = models.FloatField(blank=True, null=True, verbose_name="Latitud")
    lng = models.FloatField(blank=True, null=True, verbose_name="Longitud")
    sectores_geograficos = models.JSONField(blank=True, default=list, verbose_name="Sectores Geográficos")
    imagen = models.ImageField(upload_to='eventos/', blank=True, null=True, verbose_name="Imagen (archivo)")
    imagen_url = models.URLField(blank=True, null=True, verbose_name="URL de Imagen (opcional)", help_text="Enlace a imagen externa si no subes un archivo")
    precio_base = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Precio Base (Bs.)")
    organizador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='eventos', verbose_name="Organizador")
    cupo_total = models.PositiveIntegerField(verbose_name="Cupo Total")

    # Capacidad máxima física del recinto (aforo)
    capacidad_maxima = models.PositiveIntegerField(
        default=0,
        verbose_name="Capacidad Máxima del Recinto",
        help_text="Aforo máximo físico del recinto. Puede ser mayor al cupo de tickets en venta."
    )

    # Estado del evento (activo, cancelado, finalizado)
    ESTADO_CHOICES = (
        ('activo', 'Activo'),
        ('cancelado', 'Cancelado'),
        ('finalizado', 'Finalizado'),
    )
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='activo',
        verbose_name="Estado del Evento",
        help_text="Solo el administrador puede cambiar el estado a 'cancelado'."
    )

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = 'eventos'
        ordering = ['fecha', 'hora']
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"

    def __str__(self):
        return f"{self.nombre} ({self.fecha})"

    @property
    def imagen_display(self):
        if self.imagen:
            return self.imagen.url
        if self.imagen_url:
            return self.imagen_url
        return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=80"

    @property
    def cupos_disponibles(self):
        total_disp = self.tipos_ticket.aggregate(total=Sum('cantidad_disponible'))['total']
        return total_disp if total_disp is not None else 0

    @property
    def total_vendidos(self):
        from .compra_model import Compra
        total = Compra.objects.filter(tipo_ticket__evento=self).aggregate(total=Sum('cantidad'))['total']
        return total if total is not None else 0

    @property
    def ingresos_totales(self):
        from .compra_model import Compra
        ingresos = Compra.objects.filter(tipo_ticket__evento=self).aggregate(total=Sum('total'))['total']
        return ingresos if ingresos is not None else 0.00

    # ==========================================================
    # Métodos de Dominio / Reglas de Negocio (Modelo MVC)
    # ==========================================================

    @classmethod
    def filtrar_eventos(cls, query='', ciudad='', categoria='', fecha=''):
        """Consulta y filtra el catálogo de eventos por texto, ciudad, categoría o fecha."""
        eventos = cls.objects.all().prefetch_related('tipos_ticket').select_related('organizador')

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

        return eventos

    @classmethod
    def crear_con_tickets(cls, data, usuario_actual=None):
        """Crea un nuevo evento en la base de datos junto con sus tipos de ticket iniciales."""
        from .ticket_model import TipoTicket

        organizador = usuario_actual if (usuario_actual and usuario_actual.is_authenticated) else User.objects.filter(perfil__rol='organizador').first()
        if not organizador:
            organizador = User.objects.first()

        evento = cls.objects.create(
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
            capacidad_maxima=data.get('capacidad_maxima', 0),
            organizador=organizador
        )

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

        return evento

    def actualizar_datos(self, data):
        """Actualiza los campos del evento y sincroniza sus tipos de ticket."""
        from .ticket_model import TipoTicket

        campos_editables = [
            'nombre', 'subtitulo', 'categoria', 'ciudad', 'descripcion',
            'fecha', 'hora', 'lugar', 'estadio_nombre', 'capacidad_estadio',
            'ubicacion_mapa', 'lat', 'lng', 'sectores_geograficos',
            'imagen_url', 'precio_base', 'cupo_total', 'capacidad_maxima'
        ]
        for field in campos_editables:
            if field in data:
                setattr(self, field, data[field])
        self.save()

        if 'tipos_ticket' in data:
            for t_data in data['tipos_ticket']:
                if 'id' in t_data and str(t_data['id']).isdigit():
                    t_obj = TipoTicket.objects.filter(pk=t_data['id'], evento=self).first()
                    if t_obj:
                        t_obj.nombre = t_data.get('nombre', t_obj.nombre)
                        t_obj.precio = t_data.get('precio', t_obj.precio)
                        t_obj.cantidad_disponible = t_data.get('cantidad_disponible', t_obj.cantidad_disponible)
                        t_obj.save()
        return self

    def cancelar_por_admin(self, usuario):
        """Cancela el evento validando que el usuario sea administrador/superusuario."""
        if not usuario or not usuario.is_authenticated:
            raise PermissionError("Debes iniciar sesión para realizar esta acción.")
        if not usuario.is_superuser:
            raise PermissionError("Solo el administrador puede cancelar eventos. Los organizadores no tienen este permiso.")
        if self.estado == 'cancelado':
            raise ValueError("Este evento ya se encuentra cancelado.")
        self.estado = 'cancelado'
        self.save()
        return self

    @classmethod
    def obtener_metricas_dashboard(cls, usuario_actual=None, organizador_id=None):
        """Calcula las métricas financieras en Bs. y de ventas para el panel del organizador."""
        from .compra_model import Compra

        organizador = None
        if usuario_actual and usuario_actual.is_authenticated and hasattr(usuario_actual, 'perfil') and usuario_actual.perfil.es_organizador:
            organizador = usuario_actual
        elif organizador_id:
            organizador = User.objects.filter(pk=organizador_id).first()

        eventos = cls.objects.all().prefetch_related('tipos_ticket')
        if organizador and not organizador.is_superuser:
            eventos = eventos.filter(organizador=organizador)

        total_eventos = eventos.count()
        compras_qs = Compra.objects.filter(tipo_ticket__evento__in=eventos)
        total_tickets_vendidos = compras_qs.aggregate(total=Sum('cantidad'))['total'] or 0
        total_recaudacion = compras_qs.aggregate(total=Sum('total'))['total'] or 0.00

        return {
            'total_eventos': total_eventos,
            'total_tickets_vendidos': total_tickets_vendidos,
            'total_recaudacion': total_recaudacion,
            'eventos_qs': eventos
        }
