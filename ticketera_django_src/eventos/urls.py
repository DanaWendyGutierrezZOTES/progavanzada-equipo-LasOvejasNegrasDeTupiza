from django.urls import path
from . import views

urlpatterns = [
    # Eventos (Público)
    path('', views.lista_eventos, name='lista_eventos'),
    path('evento/<int:pk>/', views.detalle_evento, name='detalle_evento'),

    # Eventos (CRUD Organizador)
    path('evento/crear/', views.crear_evento, name='crear_evento'),
    path('evento/<int:pk>/editar/', views.editar_evento, name='editar_evento'),
    path('evento/<int:pk>/eliminar/', views.eliminar_evento, name='eliminar_evento'),
    path('evento/<int:pk>/tickets/', views.gestionar_tickets, name='gestionar_tickets'),
    path('ticket/<int:pk>/eliminar/', views.eliminar_ticket, name='eliminar_ticket'),

    # Compra de Tickets
    path('ticket/<int:tipo_id>/comprar/', views.comprar_ticket, name='comprar_ticket'),
    path('compra/<int:pk>/', views.detalle_compra, name='detalle_compra'),
    path('mis-tickets/', views.mis_tickets, name='mis_tickets'),

    # Panel del Organizador
    path('organizador/panel/', views.panel_organizador, name='panel_organizador'),

    # Autenticación
    path('registro/', views.registro_usuario, name='registro'),
    path('login/', views.iniciar_sesion, name='login'),
    path('logout/', views.cerrar_sesion, name='logout'),
]
