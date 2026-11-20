"""
[CAPA CONTROLADOR - MVC]
Controlador de Eventos y Dashboard del Organizador:
Orquesta las peticiones HTTP de eventos (GET, POST, PUT, PATCH, DELETE),
invoca la lógica de dominio en el Modelo (Evento) y retorna la Vista (EventoApiView).
"""

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from ..models import Evento
from ..views import EventoApiView


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_eventos_lista(request):
    """
    Controlador de colección de eventos:
    - GET: Filtra eventos a través del Modelo y presenta con EventoApiView.
    - POST: Crea un nuevo evento con sus tickets en el Modelo y presenta con EventoApiView.
    """
    if request.method == 'GET':
        eventos = Evento.filtrar_eventos(
            query=request.GET.get('q', '').strip(),
            ciudad=request.GET.get('ciudad', '').strip(),
            categoria=request.GET.get('categoria', '').strip(),
            fecha=request.GET.get('fecha', '').strip()
        )
        return EventoApiView.lista_eventos(eventos)

    elif request.method == 'POST':
        evento = Evento.crear_con_tickets(data=request.data, usuario_actual=request.user)
        return EventoApiView.detalle_evento(evento, creado=True)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def api_evento_detalle(request, pk):
    """
    Controlador de recurso individual de evento:
    - GET: Obtiene el detalle del evento.
    - PUT/PATCH: Actualiza datos del evento y sus tipos de ticket.
    - DELETE: Elimina el evento.
    """
    evento = get_object_or_404(Evento.objects.prefetch_related('tipos_ticket'), pk=pk)

    if request.method == 'GET':
        return EventoApiView.detalle_evento(evento)

    elif request.method in ['PUT', 'PATCH']:
        evento.actualizar_datos(request.data)
        return EventoApiView.detalle_evento(evento)

    elif request.method == 'DELETE':
        evento.delete()
        return EventoApiView.evento_eliminado()


@api_view(['POST'])
@permission_classes([AllowAny])
def api_cancelar_evento(request, pk):
    """Controlador: Permite cancelar un evento (regla de negocio: solo administrador)."""
    evento = get_object_or_404(Evento, pk=pk)
    try:
        evento.cancelar_por_admin(request.user)
        return EventoApiView.evento_cancelado(evento)
    except PermissionError as e:
        status_code = 401 if not request.user.is_authenticated else 403
        return EventoApiView.error(str(e), http_status=status_code)
    except ValueError as e:
        return EventoApiView.error(str(e))



@api_view(['GET'])
@permission_classes([AllowAny])
def api_organizador_dashboard(request):
    """Controlador: Obtiene las métricas en Bolivianos (Bs.) del organizador."""
    metricas = Evento.obtener_metricas_dashboard(
        usuario_actual=request.user,
        organizador_id=request.GET.get('organizador_id')
    )
    return EventoApiView.dashboard_organizador(metricas)
