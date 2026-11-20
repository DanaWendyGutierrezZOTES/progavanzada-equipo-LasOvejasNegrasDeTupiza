"""
==========================================================
CAPA DE CONTROLADOR (C - Controller en Arquitectura MVC)
==========================================================
Recibe las peticiones HTTP entrantes, coordina la lógica de negocio con la
Capa de Modelo (eventos/models/) y delega la presentación a la Capa de Vista (eventos/views/):
- auth_controller.py
- evento_controller.py
- ticket_controller.py
- compra_controller.py
- web_controller.py
"""

from .auth_controller import (
    api_login,
    api_logout,
    api_registro,
    api_usuario_actual,
    api_usuarios_lista,
)
from .evento_controller import (
    api_eventos_lista,
    api_evento_detalle,
    api_organizador_dashboard,
    api_cancelar_evento,
)
from .ticket_controller import (
    api_tickets_lista,
    api_crear_tipo_ticket,
    api_eliminar_tipo_ticket,
)
from .compra_controller import (
    api_compras_lista,
    api_compra_detalle,
    api_historial_ventas,
)
from .recinto_controller import (
    api_recintos_lista,
    api_recinto_detalle,
)
from .web_controller import (
    lista_eventos,
    detalle_evento,
    crear_evento,
    editar_evento,
    eliminar_evento,
    gestionar_tickets,
    eliminar_ticket,
    comprar_ticket,
    detalle_compra,
    mis_tickets,
    panel_organizador,
    registro_usuario,
    iniciar_sesion,
    cerrar_sesion,
)

__all__ = [
    'api_login',
    'api_logout',
    'api_registro',
    'api_usuario_actual',
    'api_usuarios_lista',
    'api_eventos_lista',
    'api_evento_detalle',
    'api_organizador_dashboard',
    'api_cancelar_evento',
    'api_tickets_lista',
    'api_crear_tipo_ticket',
    'api_eliminar_tipo_ticket',
    'api_compras_lista',
    'api_compra_detalle',
    'api_historial_ventas',
    'api_recintos_lista',
    'api_recinto_detalle',
    'lista_eventos',
    'detalle_evento',
    'crear_evento',
    'editar_evento',
    'eliminar_evento',
    'gestionar_tickets',
    'eliminar_ticket',
    'comprar_ticket',
    'detalle_compra',
    'mis_tickets',
    'panel_organizador',
    'registro_usuario',
    'iniciar_sesion',
    'cerrar_sesion',
]
