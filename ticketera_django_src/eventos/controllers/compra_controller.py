"""
[CAPA CONTROLADOR - MVC]
Controlador de Compras y Emisión de Tickets Digitales:
Procesa las peticiones HTTP de compra de entradas y consulta de tickets,
invocando la lógica transaccional del Modelo (Compra) y respondiendo mediante CompraApiView.
"""

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from ..models import Compra
from ..views import CompraApiView


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_compras_lista(request):
    """
    Controlador de compras:
    - GET: Retorna el historial de tickets comprados.
    - POST: Ejecuta la compra atómica, descuenta stock y genera código único de ticket.
    """
    if request.method == 'GET':
        compras = Compra.listar_compras(
            usuario_actual=request.user,
            usuario_id=request.GET.get('usuario_id')
        )
        return CompraApiView.lista_compras(compras)

    elif request.method == 'POST':
        data = request.data
        tipo_ticket_id = data.get('tipoTicketId') or data.get('tipo_ticket_id')
        if not tipo_ticket_id:
            return CompraApiView.error('El campo tipoTicketId o tipo_ticket_id es requerido')
        cantidad = int(data.get('cantidad', 1))
        usuario = Compra.resolver_comprador(data=data, usuario_actual=request.user)

        try:
            compra = Compra.realizar_compra_atomica(
                tipo_ticket_id=tipo_ticket_id,
                cantidad=cantidad,
                usuario=usuario
            )
            return CompraApiView.detalle_compra(compra, creada=True)
        except ValueError as e:
            return CompraApiView.error(str(e))


@api_view(['GET'])
@permission_classes([AllowAny])
def api_compra_detalle(request, pk):
    """Controlador: Obtiene el detalle de un ticket comprado por su ID."""
    compra = get_object_or_404(
        Compra.objects.select_related('tipo_ticket', 'tipo_ticket__evento', 'usuario'),
        pk=pk
    )
    return CompraApiView.detalle_compra(compra)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_historial_ventas(request):
    """Controlador: Historial completo de ventas con filtros de auditoría."""
    datos_historial = Compra.obtener_historial_ventas(
        evento_id=request.GET.get('evento_id'),
        organizador_id=request.GET.get('organizador_id'),
        fecha_desde=request.GET.get('fecha_desde'),
        fecha_hasta=request.GET.get('fecha_hasta')
    )
    return CompraApiView.historial_ventas(datos_historial)
