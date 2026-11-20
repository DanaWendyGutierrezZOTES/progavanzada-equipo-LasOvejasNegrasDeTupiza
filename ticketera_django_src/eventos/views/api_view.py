"""
[CAPA VISTA - MVC]
Vistas de Respuesta REST/JSON: Se encargan exclusivamente de la capa de presentación
y construcción de respuestas HTTP JSON para el Frontend React y clientes API.
"""

from rest_framework import status
from rest_framework.response import Response
from .serializers_view import (
    UserSerializer,
    EventoSerializer,
    TipoTicketSerializer,
    CompraSerializer,
)


class AuthApiView:
    """Vista encargada de formatear las respuestas JSON de autenticación y usuarios."""

    @staticmethod
    def login_exitoso(user):
        return Response({
            'mensaje': 'Inicio de sesión exitoso',
            'usuario': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    @staticmethod
    def logout_exitoso():
        return Response({
            'mensaje': 'Sesión cerrada correctamente'
        }, status=status.HTTP_200_OK)

    @staticmethod
    def registro_exitoso(user):
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def usuario_actual(user):
        if user and user.is_authenticated:
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_200_OK)

    @staticmethod
    def lista_usuarios(usuarios):
        return Response(UserSerializer(usuarios, many=True).data, status=status.HTTP_200_OK)

    @staticmethod
    def error(mensaje, http_status=status.HTTP_400_BAD_REQUEST):
        return Response({'error': mensaje}, status=http_status)


class EventoApiView:
    """Vista encargada de formatear las respuestas JSON de eventos y métricas del organizador."""

    @staticmethod
    def lista_eventos(eventos):
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def detalle_evento(evento, creado=False):
        http_status = status.HTTP_201_CREATED if creado else status.HTTP_200_OK
        return Response(EventoSerializer(evento).data, status=http_status)

    @staticmethod
    def evento_eliminado():
        return Response({'mensaje': 'Evento eliminado exitosamente'}, status=status.HTTP_200_OK)

    @staticmethod
    def evento_cancelado(evento):
        return Response({
            'mensaje': f"El evento '{evento.nombre}' ha sido cancelado correctamente.",
            'evento': EventoSerializer(evento).data
        }, status=status.HTTP_200_OK)

    @staticmethod
    def error(mensaje, http_status=status.HTTP_400_BAD_REQUEST):
        return Response({'error': mensaje}, status=http_status)

    @staticmethod
    def dashboard_organizador(metricas):
        return Response({
            'total_eventos': metricas['total_eventos'],
            'total_tickets_vendidos': metricas['total_tickets_vendidos'],
            'total_recaudacion': metricas['total_recaudacion'],
            'eventos': EventoSerializer(metricas['eventos_qs'], many=True).data
        }, status=status.HTTP_200_OK)


class TicketApiView:
    """Vista encargada de formatear las respuestas JSON de tipos de tickets."""

    @staticmethod
    def lista_tickets(tickets):
        serializer = TipoTicketSerializer(tickets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def ticket_creado(ticket):
        return Response(TipoTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)

    @staticmethod
    def ticket_eliminado():
        return Response({'mensaje': 'Ticket eliminado correctamente'}, status=status.HTTP_200_OK)

    @staticmethod
    def error(mensaje, http_status=status.HTTP_400_BAD_REQUEST):
        return Response({'error': mensaje}, status=http_status)


class CompraApiView:
    """Vista encargada de formatear las respuestas JSON de compras y tickets emitidos."""

    @staticmethod
    def lista_compras(compras):
        serializer = CompraSerializer(compras, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def detalle_compra(compra, creada=False):
        http_status = status.HTTP_201_CREATED if creada else status.HTTP_200_OK
        return Response(CompraSerializer(compra).data, http_status)

    @staticmethod
    def historial_ventas(datos_historial):
        return Response({
            'resumen': datos_historial['resumen'],
            'ventas': CompraSerializer(datos_historial['ventas_qs'], many=True).data
        }, status=status.HTTP_200_OK)

    @staticmethod
    def error(mensaje, http_status=status.HTTP_400_BAD_REQUEST):
        return Response({'error': mensaje}, status=http_status)
