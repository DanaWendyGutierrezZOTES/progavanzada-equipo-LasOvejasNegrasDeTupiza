import uuid
from django.db import models, transaction
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .ticket_model import TipoTicket


class Compra(models.Model):
    """
    [CAPA MODELO - MVC]
    Entidad Compra: Representa la transacción de venta de entradas, generación de código QR único
    y control transaccional de stock disponible.
    """
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='compras', verbose_name="Comprador")
    tipo_ticket = models.ForeignKey(TipoTicket, on_delete=models.CASCADE, related_name='compras', verbose_name="Tipo de Ticket")
    cantidad = models.PositiveIntegerField(default=1, verbose_name="Cantidad")
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio Unitario (Bs.)")
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total (Bs.)")
    fecha_compra = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Compra")
    codigo_ticket = models.CharField(max_length=64, unique=True, editable=False, verbose_name="Código Único de Ticket")

    class Meta:
        app_label = 'eventos'
        ordering = ['-fecha_compra']
        verbose_name = "Compra de Ticket"
        verbose_name_plural = "Compras de Tickets"

    def __str__(self):
        return f"Ticket {self.codigo_ticket} - {self.tipo_ticket.evento.nombre} ({self.usuario.username})"

    def save(self, *args, **kwargs):
        if not self.codigo_ticket:
            codigo_aleatorio = uuid.uuid4().hex[:10].upper()
            self.codigo_ticket = f"TKT-{codigo_aleatorio}"
        if not self.precio_unitario:
            self.precio_unitario = self.tipo_ticket.precio
        if not self.total:
            self.total = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)

    # ==========================================================
    # Métodos de Dominio / Reglas de Negocio (Modelo MVC)
    # ==========================================================

    @classmethod
    def listar_compras(cls, usuario_actual=None, usuario_id=None):
        """Retorna el historial de compras filtrado por usuario."""
        compras = cls.objects.all().select_related('tipo_ticket', 'tipo_ticket__evento', 'usuario')
        if usuario_id:
            compras = compras.filter(usuario_id=usuario_id)
        elif usuario_actual and usuario_actual.is_authenticated:
            compras = compras.filter(usuario=usuario_actual)
        return compras

    @classmethod
    def resolver_comprador(cls, data, usuario_actual=None):
        """Identifica al usuario comprador desde la sesión, payload o fallback de demo."""
        usuario = None
        if usuario_actual and usuario_actual.is_authenticated:
            usuario = usuario_actual
        elif data.get('usuario_id'):
            usuario = User.objects.filter(pk=data.get('usuario_id')).first()
        elif data.get('usuario') and isinstance(data.get('usuario'), dict):
            u_id = data['usuario'].get('id')
            if u_id:
                usuario = User.objects.filter(pk=u_id).first()

        if not usuario:
            usuario = User.objects.filter(perfil__rol='comprador').first() or User.objects.first()
        return usuario

    @classmethod
    def realizar_compra_atomica(cls, tipo_ticket_id, cantidad, usuario):
        """
        Ejecuta la compra de forma transaccional (ACID), bloqueando la fila del ticket
        para evitar sobreventa concurrente y descontando el cupo disponible.
        """
        cantidad = int(cantidad or 1)
        with transaction.atomic():
            tipo_ticket = get_object_or_404(TipoTicket.objects.select_for_update(), pk=tipo_ticket_id)

            if tipo_ticket.evento.estado == 'cancelado':
                raise ValueError("Este evento ha sido cancelado. No se pueden comprar tickets.")

            if tipo_ticket.evento.estado == 'finalizado':
                raise ValueError("Este evento ya finalizó. No se pueden comprar tickets.")

            if tipo_ticket.cantidad_disponible < cantidad:
                raise ValueError(f"Solo quedan {tipo_ticket.cantidad_disponible} entradas disponibles")

            tipo_ticket.cantidad_disponible -= cantidad
            tipo_ticket.save()

            precio_unitario = tipo_ticket.precio
            total = precio_unitario * cantidad
            compra = cls.objects.create(
                usuario=usuario,
                tipo_ticket=tipo_ticket,
                cantidad=cantidad,
                precio_unitario=precio_unitario,
                total=total
            )
            return compra

    @classmethod
    def obtener_historial_ventas(cls, evento_id=None, organizador_id=None, fecha_desde=None, fecha_hasta=None):
        """Consulta el historial completo de ventas con filtros opcionales de auditoría."""
        from django.db.models import Sum

        compras = cls.objects.all().select_related(
            'usuario',
            'tipo_ticket',
            'tipo_ticket__evento',
            'tipo_ticket__evento__organizador'
        ).order_by('-fecha_compra')

        if evento_id:
            compras = compras.filter(tipo_ticket__evento_id=evento_id)
        if organizador_id:
            compras = compras.filter(tipo_ticket__evento__organizador_id=organizador_id)
        if fecha_desde:
            compras = compras.filter(fecha_compra__date__gte=fecha_desde)
        if fecha_hasta:
            compras = compras.filter(fecha_compra__date__lte=fecha_hasta)

        totales = compras.aggregate(
            total_tickets=Sum('cantidad'),
            total_ingresos=Sum('total')
        )

        return {
            'resumen': {
                'total_ventas': compras.count(),
                'total_tickets_vendidos': totales['total_tickets'] or 0,
                'total_ingresos_bs': float(totales['total_ingresos'] or 0),
            },
            'ventas_qs': compras
        }

