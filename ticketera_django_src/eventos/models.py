import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Sum


class PerfilUsuario(models.Model):
    ROLES = (
        ('comprador', 'Comprador'),
        ('organizador', 'Organizador'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    rol = models.CharField(max_length=20, choices=ROLES, default='comprador')
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")

    class Meta:
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"

    def __str__(self):
        return f"{self.user.username} - {self.get_rol_display()}"

    @property
    def es_organizador(self):
        return self.rol == 'organizador' or self.user.is_staff or self.user.is_superuser


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        PerfilUsuario.objects.get_or_create(user=instance)
    else:
        if hasattr(instance, 'perfil'):
            instance.perfil.save()


class Evento(models.Model):
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

    # 🆕 CAMBIO 1: capacidad_maxima - cuántas personas caben físicamente en el recinto
    # Es distinto al cupo_total (tickets vendibles). Ejemplo: estadio con 40.000 personas
    # pero solo se venden 20.000 tickets (cupo_total).
    capacidad_maxima = models.PositiveIntegerField(
        default=0,
        verbose_name="Capacidad Máxima del Recinto",
        help_text="Aforo máximo físico del recinto. Puede ser mayor al cupo de tickets en venta."
    )

    # 🆕 CAMBIO 2: estado del evento - solo el administrador (is_superuser) puede cancelar
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
        total = Compra.objects.filter(tipo_ticket__evento=self).aggregate(total=Sum('cantidad'))['total']
        return total if total is not None else 0

    @property
    def ingresos_totales(self):
        ingresos = Compra.objects.filter(tipo_ticket__evento=self).aggregate(total=Sum('total'))['total']
        return ingresos if ingresos is not None else 0.00


class TipoTicket(models.Model):
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='tipos_ticket', verbose_name="Evento")
    nombre = models.CharField(max_length=100, verbose_name="Nombre del Ticket", help_text="Ej: General, VIP, Platea")
    sector = models.CharField(max_length=100, blank=True, default='', verbose_name="Sector")
    puerta = models.CharField(max_length=100, blank=True, default='', verbose_name="Puerta de Acceso")
    color_zona = models.CharField(max_length=30, blank=True, default='#6366f1', verbose_name="Color de Zona")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio (Bs.)")
    cantidad_total = models.PositiveIntegerField(default=0, verbose_name="Cupo Asignado")
    cantidad_disponible = models.PositiveIntegerField(verbose_name="Cantidad Disponible")

    class Meta:
        verbose_name = "Tipo de Ticket"
        verbose_name_plural = "Tipos de Ticket"
        ordering = ['precio']

    def __str__(self):
        return f"{self.nombre} - Bs. {self.precio} ({self.evento.nombre})"

    def save(self, *args, **kwargs):
        if not self.pk and self.cantidad_total == 0:
            self.cantidad_total = self.cantidad_disponible
        super().save(*args, **kwargs)

    @property
    def cantidad_vendida(self):
        total = self.compras.aggregate(total=Sum('cantidad'))['total']
        return total if total is not None else 0


class Compra(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compras', verbose_name="Comprador")
    tipo_ticket = models.ForeignKey(TipoTicket, on_delete=models.CASCADE, related_name='compras', verbose_name="Tipo de Ticket")
    cantidad = models.PositiveIntegerField(default=1, verbose_name="Cantidad")
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio Unitario (Bs.)")
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total (Bs.)")
    fecha_compra = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Compra")
    codigo_ticket = models.CharField(max_length=64, unique=True, editable=False, verbose_name="Código Único de Ticket")

    class Meta:
        ordering = ['-fecha_compra']
        verbose_name = "Compra de Ticket"
        verbose_name_plural = "Compras de Tickets"

    def __str__(self):
        return f"Ticket {self.codigo_ticket} - {self.tipo_ticket.evento.nombre} ({self.usuario.username})"

    def save(self, *args, **kwargs):
        if not self.codigo_ticket:
            # Generar código único identificador tipo TKT-XXXXXXXX
            codigo_aleatorio = uuid.uuid4().hex[:10].upper()
            self.codigo_ticket = f"TKT-{codigo_aleatorio}"
        if not self.precio_unitario:
            self.precio_unitario = self.tipo_ticket.precio
        if not self.total:
            self.total = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)
