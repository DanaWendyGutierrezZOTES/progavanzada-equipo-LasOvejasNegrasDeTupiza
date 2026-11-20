"""
[CAPA CONTROLADOR - MVC]
Controlador Web Tradicional:
Gestiona las rutas web de respaldo con formularios de Django y delega el renderizado HTML a WebTemplateView.
"""

from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Sum
from django.core.exceptions import PermissionDenied

from ..models import Evento, TipoTicket, Compra
from ..views import WebTemplateView
from ..forms import (
    RegistroUsuarioForm,
    CustomLoginForm,
    EventoForm,
    TipoTicketForm,
    CompraTicketForm,
)


def lista_eventos(request):
    query = request.GET.get('q', '').strip()
    fecha_filtro = request.GET.get('fecha', '').strip()
    eventos = Evento.filtrar_eventos(query=query, fecha=fecha_filtro).order_by('fecha', 'hora')
    context = {
        'eventos': eventos,
        'query': query,
        'fecha_filtro': fecha_filtro,
    }
    return WebTemplateView.render_lista_eventos(request, context)


def detalle_evento(request, pk):
    evento = get_object_or_404(Evento.objects.prefetch_related('tipos_ticket'), pk=pk)
    es_dueno = request.user.is_authenticated and (evento.organizador == request.user or request.user.is_superuser)
    context = {
        'evento': evento,
        'tipos_ticket': evento.tipos_ticket.all(),
        'es_dueno': es_dueno,
    }
    return WebTemplateView.render_detalle_evento(request, context)


@login_required
def crear_evento(request):
    if not request.user.perfil.es_organizador:
        messages.error(request, "Acceso restringido: necesitas una cuenta de Organizador para publicar eventos.")
        return redirect('lista_eventos')

    if request.method == 'POST':
        form = EventoForm(request.POST, request.FILES)
        nombre_ticket = request.POST.get('nombre_ticket', 'General')
        precio_ticket = request.POST.get('precio_ticket', '')
        cupo_ticket = request.POST.get('cupo_ticket', '')

        if form.is_valid():
            evento = form.save(commit=False)
            evento.organizador = request.user
            evento.save()

            if precio_ticket and cupo_ticket:
                try:
                    TipoTicket.objects.create(
                        evento=evento,
                        nombre=nombre_ticket or 'General',
                        precio=float(precio_ticket),
                        cantidad_disponible=int(cupo_ticket),
                        cantidad_total=int(cupo_ticket)
                    )
                except ValueError:
                    pass
            elif evento.cupo_total > 0:
                TipoTicket.objects.create(
                    evento=evento,
                    nombre='General',
                    precio=evento.precio_base,
                    cantidad_disponible=evento.cupo_total,
                    cantidad_total=evento.cupo_total
                )

            messages.success(request, f"¡El evento '{evento.nombre}' ha sido creado exitosamente!")
            return redirect('gestionar_tickets', pk=evento.pk)
    else:
        form = EventoForm()

    return WebTemplateView.render_formulario_evento(request, {'form': form, 'titulo': 'Crear Nuevo Evento'})


@login_required
def editar_evento(request, pk):
    evento = get_object_or_404(Evento, pk=pk)
    if evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para editar este evento.")
        return redirect('detalle_evento', pk=pk)

    if request.method == 'POST':
        form = EventoForm(request.POST, request.FILES, instance=evento)
        if form.is_valid():
            form.save()
            messages.success(request, "El evento ha sido actualizado con éxito.")
            return redirect('detalle_evento', pk=evento.pk)
    else:
        form = EventoForm(instance=evento)

    return WebTemplateView.render_formulario_evento(request, {
        'form': form,
        'evento': evento,
        'titulo': f"Editar Evento: {evento.nombre}"
    })


@login_required
def eliminar_evento(request, pk):
    evento = get_object_or_404(Evento, pk=pk)
    if evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para eliminar este evento.")
        return redirect('detalle_evento', pk=pk)

    if request.method == 'POST':
        nombre = evento.nombre
        evento.delete()
        messages.success(request, f"El evento '{nombre}' ha sido eliminado correctamente.")
        return redirect('panel_organizador')

    return WebTemplateView.render_confirmar_eliminar(request, {'evento': evento})


@login_required
def gestionar_tickets(request, pk):
    evento = get_object_or_404(Evento, pk=pk)
    if evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para gestionar los tickets de este evento.")
        return redirect('detalle_evento', pk=pk)

    if request.method == 'POST':
        form = TipoTicketForm(request.POST)
        if form.is_valid():
            ticket = form.save(commit=False)
            ticket.evento = evento
            ticket.cantidad_total = ticket.cantidad_disponible
            ticket.save()
            messages.success(request, f"Tipo de ticket '{ticket.nombre}' agregado con éxito.")
            return redirect('gestionar_tickets', pk=evento.pk)
    else:
        form = TipoTicketForm()

    return WebTemplateView.render_gestionar_tickets(request, {
        'evento': evento,
        'tipos_ticket': evento.tipos_ticket.all(),
        'form': form
    })


@login_required
def eliminar_ticket(request, pk):
    ticket = get_object_or_404(TipoTicket, pk=pk)
    evento_id = ticket.evento.pk
    if ticket.evento.organizador != request.user and not request.user.is_superuser:
        messages.error(request, "No tienes permiso para realizar esta acción.")
        return redirect('detalle_evento', pk=evento_id)

    try:
        ticket.eliminar_si_no_tiene_compras()
        messages.success(request, "Tipo de ticket eliminado exitosamente.")
    except ValueError as e:
        messages.error(request, str(e))

    return redirect('gestionar_tickets', pk=evento_id)


@login_required
def comprar_ticket(request, tipo_id):
    tipo_ticket = get_object_or_404(
        TipoTicket.objects.select_related('evento', 'evento__organizador'),
        pk=tipo_id
    )
    evento = tipo_ticket.evento

    if tipo_ticket.cantidad_disponible <= 0:
        messages.warning(request, "Lo sentimos, este tipo de ticket se encuentra agotado.")
        return redirect('detalle_evento', pk=evento.pk)

    if request.method == 'POST':
        form = CompraTicketForm(tipo_ticket=tipo_ticket, data=request.POST)
        if form.is_valid():
            cantidad = form.cleaned_data['cantidad']
            try:
                compra = Compra.realizar_compra_atomica(
                    tipo_ticket_id=tipo_id,
                    cantidad=cantidad,
                    usuario=request.user
                )
                messages.success(request, "¡Compra realizada con éxito! Tu ticket ha sido generado.")
                return redirect('detalle_compra', pk=compra.pk)
            except ValueError as e:
                messages.error(request, str(e))
                return redirect('comprar_ticket', tipo_id=tipo_id)
    else:
        form = CompraTicketForm(tipo_ticket=tipo_ticket)

    return WebTemplateView.render_comprar_ticket(request, {
        'tipo_ticket': tipo_ticket,
        'evento': evento,
        'form': form,
    })


@login_required
def detalle_compra(request, pk):
    compra = get_object_or_404(
        Compra.objects.select_related('usuario', 'tipo_ticket', 'tipo_ticket__evento'),
        pk=pk
    )
    es_comprador = compra.usuario == request.user
    es_organizador = compra.tipo_ticket.evento.organizador == request.user
    if not (es_comprador or es_organizador or request.user.is_superuser):
        raise PermissionDenied("No tienes permiso para ver este ticket.")

    return WebTemplateView.render_detalle_compra(request, {'compra': compra})


@login_required
def mis_tickets(request):
    compras = Compra.listar_compras(usuario_actual=request.user)
    return WebTemplateView.render_mis_tickets(request, {'compras': compras})


@login_required
def panel_organizador(request):
    if not request.user.perfil.es_organizador:
        messages.warning(request, "Debes ser Organizador para acceder a este panel.")
        return redirect('lista_eventos')

    eventos = Evento.objects.filter(organizador=request.user).prefetch_related('tipos_ticket', 'tipos_ticket__compras').order_by('-fecha')
    total_eventos = eventos.count()
    compras_organizador = Compra.objects.filter(tipo_ticket__evento__organizador=request.user)
    total_tickets_vendidos = compras_organizador.aggregate(total=Sum('cantidad'))['total'] or 0
    total_recaudacion = compras_organizador.aggregate(total=Sum('total'))['total'] or 0.00

    return WebTemplateView.render_panel_organizador(request, {
        'eventos': eventos,
        'total_eventos': total_eventos,
        'total_tickets_vendidos': total_tickets_vendidos,
        'total_recaudacion': total_recaudacion,
    })


def registro_usuario(request):
    if request.user.is_authenticated:
        return redirect('lista_eventos')

    if request.method == 'POST':
        form = RegistroUsuarioForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f"¡Bienvenido a TicketEventos, {user.first_name or user.username}! Tu cuenta ha sido creada.")
            if user.perfil.es_organizador:
                return redirect('panel_organizador')
            return redirect('lista_eventos')
    else:
        form = RegistroUsuarioForm()

    return WebTemplateView.render_registro(request, {'form': form})


def iniciar_sesion(request):
    if request.user.is_authenticated:
        return redirect('lista_eventos')

    if request.method == 'POST':
        form = CustomLoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"¡Hola de nuevo, {user.first_name or user.username}!")
            next_url = request.GET.get('next')
            if next_url:
                return redirect(next_url)
            if user.perfil.es_organizador:
                return redirect('panel_organizador')
            return redirect('lista_eventos')
    else:
        form = CustomLoginForm()

    return WebTemplateView.render_login(request, {'form': form})


def cerrar_sesion(request):
    logout(request)
    messages.info(request, "Has cerrado sesión correctamente. ¡Hasta pronto!")
    return redirect('lista_eventos')
