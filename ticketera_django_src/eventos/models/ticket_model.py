from django.db import models
from django.db.models import Sum
from .evento_model import Evento


class TipoTicket(models.Model):
    """
    [CAPA MODELO - MVC]
    Entidad TipoTicket: Representa las categorías o sectores de entrada para un evento (VIP, General, Curva, etc.).
    """
    evento = models.ForeignKey(Evento, on_delete=models.CASCADE, related_name='tipos_ticket', verbose_name="Evento")
    nombre = models.CharField(max_length=100, verbose_name="Nombre del Ticket", help_text="Ej: General, VIP, Platea")
    sector = models.CharField(max_length=100, blank=True, default='', verbose_name="Sector")
    puerta = models.CharField(max_length=100, blank=True, default='', verbose_name="Puerta de Acceso")
    color_zona = models.CharField(max_length=30, blank=True, default='#6366f1', verbose_name="Color de Zona")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio (Bs.)")
    cantidad_total = models.PositiveIntegerField(default=0, verbose_name="Cupo Asignado")
    cantidad_disponible = models.PositiveIntegerField(verbose_name="Cantidad Disponible")

    class Meta:
        app_label = 'eventos'
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

    # ==========================================================
    # Métodos de Dominio / Reglas de Negocio (Modelo MVC)
    # ==========================================================

    @classmethod
    def listar_tickets(cls, evento_id=None):
        """Retorna la lista de tipos de tickets, opcionalmente filtrada por evento."""
        tickets = cls.objects.all().select_related('evento')
        if evento_id:
            tickets = tickets.filter(evento_id=evento_id)
        return tickets

    @classmethod
    def crear_para_evento(cls, evento, data):
        """Crea un nuevo tipo de ticket asociado a un evento."""
        cupo = int(data.get('cantidad_total') or data.get('cantidad_disponible') or 100)
        return cls.objects.create(
            evento=evento,
            nombre=data.get('nombre', 'General'),
            sector=data.get('sector', ''),
            puerta=data.get('puerta', ''),
            color_zona=data.get('color_zona', '#6366f1'),
            precio=data.get('precio', 0),
            cantidad_total=cupo,
            cantidad_disponible=cupo
        )

    def eliminar_si_no_tiene_compras(self):
        """Elimina la categoría de ticket únicamente si no tiene compras asociadas."""
        if self.compras.exists():
            raise ValueError("No se puede eliminar porque ya tiene compras registradas")
        self.delete()
