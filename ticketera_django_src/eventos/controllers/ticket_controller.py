"""
[CAPA CONTROLADOR - MVC]
Controlador de Tipos de Ticket:
Gestiona las peticiones HTTP para listar, crear y eliminar categorías de tickets,
comunicando el Modelo (TipoTicket, Evento) con la Vista (TicketApiView).
"""

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from ..models import Evento, TipoTicket
from ..views import TicketApiView


@api_view(['GET'])
@permission_classes([AllowAny])
def api_tickets_lista(request):
    """Controlador: Lista todos los tipos de tickets o filtra por ?evento_id=X."""
    evento_id = request.GET.get('evento_id')
    tickets = TipoTicket.listar_tickets(evento_id=evento_id)
    return TicketApiView.lista_tickets(tickets)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_crear_tipo_ticket(request, evento_id):
    """Controlador: Crea una nueva categoría de ticket para un evento específico."""
    evento = get_object_or_404(Evento, pk=evento_id)
    ticket = TipoTicket.crear_para_evento(evento=evento, data=request.data)
    return TicketApiView.ticket_creado(ticket)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def api_eliminar_tipo_ticket(request, pk):
    """Controlador: Elimina un tipo de ticket validando que no tenga compras."""
    ticket = get_object_or_404(TipoTicket, pk=pk)
    try:
        ticket.eliminar_si_no_tiene_compras()
        return TicketApiView.ticket_eliminado()
    except ValueError as e:
        return TicketApiView.error(str(e))
