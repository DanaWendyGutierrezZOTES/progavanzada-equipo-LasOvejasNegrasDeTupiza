from django.urls import path
from . import views
from . import api_views

urlpatterns = [
    # ======================================================
    # API REST (Endpoints para React Frontend)
    # ======================================================
    # Autenticación
    path('api/auth/login/', api_views.api_login, name='api_login'),
    path('api/auth/logout/', api_views.api_logout, name='api_logout'),
    path('api/auth/registro/', api_views.api_registro, name='api_registro'),
    path('api/auth/me/', api_views.api_usuario_actual, name='api_usuario_actual'),
    path('api/auth/usuarios/', api_views.api_usuarios_lista, name='api_usuarios_lista'),

    # Eventos
    path('api/eventos/', api_views.api_eventos_lista, name='api_eventos_lista'),
    path('api/eventos/<int:pk>/', api_views.api_evento_detalle, name='api_evento_detalle'),
    path('api/eventos/<int:evento_id>/tickets/', api_views.api_crear_tipo_ticket, name='api_crear_tipo_ticket'),
    path('api/tickets/<int:pk>/', api_views.api_eliminar_tipo_ticket, name='api_eliminar_tipo_ticket'),

    # Compras / Tickets
    path('api/compras/', api_views.api_compras_lista, name='api_compras_lista'),
    path('api/compras/<int:pk>/', api_views.api_compra_detalle, name='api_compra_detalle'),

    # Dashboard Organizador
    path('api/organizador/dashboard/', api_views.api_organizador_dashboard, name='api_organizador_dashboard'),

    # ======================================================
    # Rutas Tradicionales Django (Templates de respaldo)
    # ======================================================
    path('', views.lista_eventos, name='lista_eventos'),
    path('evento/<int:pk>/', views.detalle_evento, name='detalle_evento'),
    path('evento/crear/', views.crear_evento, name='crear_evento'),
    path('evento/<int:pk>/editar/', views.editar_evento, name='editar_evento'),
    path('evento/<int:pk>/eliminar/', views.eliminar_evento, name='eliminar_evento'),
    path('evento/<int:pk>/tickets/', views.gestionar_tickets, name='gestionar_tickets'),
    path('ticket/<int:pk>/eliminar/', views.eliminar_ticket, name='eliminar_ticket'),
    path('ticket/<int:tipo_id>/comprar/', views.comprar_ticket, name='comprar_ticket'),
    path('compra/<int:pk>/', views.detalle_compra, name='detalle_compra'),
    path('mis-tickets/', views.mis_tickets, name='mis_tickets'),
    path('organizador/panel/', views.panel_organizador, name='panel_organizador'),
    path('registro/', views.registro_usuario, name='registro'),
    path('login/', views.iniciar_sesion, name='login'),
    path('logout/', views.cerrar_sesion, name='logout'),
]
