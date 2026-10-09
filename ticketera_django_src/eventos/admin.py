from django.contrib import admin
from .models import PerfilUsuario, Evento, TipoTicket, Compra


@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ('user', 'rol', 'telefono')
    list_filter = ('rol',)
    search_fields = ('user__username', 'user__email')


class TipoTicketInline(admin.TabularInline):
    model = TipoTicket
    extra = 1


@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'fecha', 'hora', 'lugar', 'organizador', 'cupo_total', 'precio_base')
    list_filter = ('fecha', 'organizador')
    search_fields = ('nombre', 'lugar', 'descripcion')
    inlines = [TipoTicketInline]


@admin.register(TipoTicket)
class TipoTicketAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'evento', 'precio', 'cantidad_disponible', 'cantidad_total')
    list_filter = ('evento',)
    search_fields = ('nombre', 'evento__nombre')


@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ('codigo_ticket', 'usuario', 'tipo_ticket', 'cantidad', 'total', 'fecha_compra')
    list_filter = ('fecha_compra', 'tipo_ticket__evento')
    search_fields = ('codigo_ticket', 'usuario__username', 'tipo_ticket__nombre', 'tipo_ticket__evento__nombre')
    readonly_fields = ('codigo_ticket', 'fecha_compra', 'precio_unitario', 'total')
