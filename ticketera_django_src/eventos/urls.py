"""
==========================================================
ENRUTADOR (Router -> Controladores MVC)
==========================================================
Conecta las rutas HTTP (REST API para React y Web) con sus respectivos Controladores
en `eventos/controllers/`.
"""

from django.urls import path
from .controllers import (
    auth_controller,
    evento_controller,
    ticket_controller,
    compra_controller,
    web_controller,
)

urlpatterns = [
    # ======================================================
    # API REST (Endpoints para React Frontend y Postman)
    # ======================================================
    # 1. Controlador de Autenticación y Usuarios
    path('api/auth/login/', auth_controller.api_login, name='api_login'),
    path('api/auth/logout/', auth_controller.api_logout, name='api_logout'),
    path('api/auth/registro/', auth_controller.api_registro, name='api_registro'),
    path('api/auth/me/', auth_controller.api_usuario_actual, name='api_usuario_actual'),
    path('api/auth/usuarios/', auth_controller.api_usuarios_lista, name='api_usuarios_lista'),

    # 2. Controlador de Eventos
    path('api/eventos/', evento_controller.api_eventos_lista, name='api_eventos_lista'),
    path('api/eventos/<int:pk>/', evento_controller.api_evento_detalle, name='api_evento_detalle'),
    path('api/eventos/<int:pk>/cancelar/', evento_controller.api_cancelar_evento, name='api_cancelar_evento'),

    # 3. Controlador de Tipos de Ticket
    path('api/eventos/<int:evento_id>/tickets/', ticket_controller.api_crear_tipo_ticket, name='api_crear_tipo_ticket'),
    path('api/tickets/', ticket_controller.api_tickets_lista, name='api_tickets_lista'),
    path('api/tickets/<int:pk>/', ticket_controller.api_eliminar_tipo_ticket, name='api_eliminar_tipo_ticket'),

    # 4. Controlador de Compras y Emisión de Tickets
    path('api/compras/', compra_controller.api_compras_lista, name='api_compras_lista'),
    path('api/compras/<int:pk>/', compra_controller.api_compra_detalle, name='api_compra_detalle'),
    path('api/ventas/historial/', compra_controller.api_historial_ventas, name='api_historial_ventas'),

    # 5. Controlador de Dashboard / Panel Organizador
    path('api/organizador/dashboard/', evento_controller.api_organizador_dashboard, name='api_organizador_dashboard'),
    path('api/panel-organizador/', evento_controller.api_organizador_dashboard, name='api_panel_organizador'),

    # ======================================================
    # Rutas Web Tradicionales (Controlador Web MVC)
    # ======================================================
    path('', web_controller.lista_eventos, name='lista_eventos'),
    path('evento/<int:pk>/', web_controller.detalle_evento, name='detalle_evento'),
    path('evento/crear/', web_controller.crear_evento, name='crear_evento'),
    path('evento/<int:pk>/editar/', web_controller.editar_evento, name='editar_evento'),
    path('evento/<int:pk>/eliminar/', web_controller.eliminar_evento, name='eliminar_evento'),
    path('evento/<int:pk>/tickets/', web_controller.gestionar_tickets, name='gestionar_tickets'),
    path('ticket/<int:pk>/eliminar/', web_controller.eliminar_ticket, name='eliminar_ticket'),
    path('ticket/<int:tipo_id>/comprar/', web_controller.comprar_ticket, name='comprar_ticket'),
    path('compra/<int:pk>/', web_controller.detalle_compra, name='detalle_compra'),
    path('mis-tickets/', web_controller.mis_tickets, name='mis_tickets'),
    path('organizador/panel/', web_controller.panel_organizador, name='panel_organizador'),
    path('registro/', web_controller.registro_usuario, name='registro'),
    path('login/', web_controller.iniciar_sesion, name='login'),
    path('logout/', web_controller.cerrar_sesion, name='logout'),
]
