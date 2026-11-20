"""
[CAPA VISTA - MVC]
Vistas Web Tradicionales: Encargadas de renderizar plantillas HTML (Bootstrap) como respaldo web.
"""

from django.shortcuts import render


class WebTemplateView:
    """Renderiza las plantillas HTML tradicionales con el contexto preparado por el Controlador."""

    @staticmethod
    def render_lista_eventos(request, context):
        return render(request, 'eventos/lista_eventos.html', context)

    @staticmethod
    def render_detalle_evento(request, context):
        return render(request, 'eventos/detalle_evento.html', context)

    @staticmethod
    def render_formulario_evento(request, context):
        return render(request, 'eventos/crear_evento.html', context)

    @staticmethod
    def render_confirmar_eliminar(request, context):
        return render(request, 'eventos/confirmar_eliminar.html', context)

    @staticmethod
    def render_gestionar_tickets(request, context):
        return render(request, 'eventos/gestionar_tickets.html', context)

    @staticmethod
    def render_comprar_ticket(request, context):
        return render(request, 'eventos/comprar_ticket.html', context)

    @staticmethod
    def render_detalle_compra(request, context):
        return render(request, 'eventos/detalle_compra.html', context)

    @staticmethod
    def render_mis_tickets(request, context):
        return render(request, 'eventos/mis_tickets.html', context)

    @staticmethod
    def render_panel_organizador(request, context):
        return render(request, 'eventos/panel_organizador.html', context)

    @staticmethod
    def render_registro(request, context):
        return render(request, 'eventos/registro.html', context)

    @staticmethod
    def render_login(request, context):
        return render(request, 'eventos/login.html', context)
