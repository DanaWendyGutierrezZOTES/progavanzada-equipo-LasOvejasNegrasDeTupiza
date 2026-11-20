"""
==========================================================
CAPA DE VISTA (V - View en Arquitectura MVC)
==========================================================
Encargada de la presentación y serialización de datos:
- Serializadores JSON (serializers_view.py)
- Formateadores de Respuestas REST API (api_view.py)
- Renderizadores de Plantillas HTML (web_view.py)
"""

from .serializers_view import (
    PerfilUsuarioSerializer,
    UserSerializer,
    TipoTicketSerializer,
    EventoSerializer,
    CompraSerializer,
)
from .api_view import (
    AuthApiView,
    EventoApiView,
    TicketApiView,
    CompraApiView,
)
from .web_view import WebTemplateView

__all__ = [
    'PerfilUsuarioSerializer',
    'UserSerializer',
    'TipoTicketSerializer',
    'EventoSerializer',
    'CompraSerializer',
    'AuthApiView',
    'EventoApiView',
    'TicketApiView',
    'CompraApiView',
    'WebTemplateView',
]
