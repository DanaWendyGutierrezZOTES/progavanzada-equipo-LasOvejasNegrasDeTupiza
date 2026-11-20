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
    list_display = ('nombre', 'fecha', 'hora', 'lugar', 'estado', 'organizador', 'cupo_total', 'capacidad_maxima', 'precio_base')
    list_filter = ('estado', 'fecha', 'ciudad', 'organizador')
    search_fields = ('nombre', 'lugar', 'descripcion', 'ciudad')
    list_editable = ('estado',)
    inlines = [TipoTicketInline]

    fieldsets = (
        ('Información General', {
            'fields': ('nombre', 'subtitulo', 'categoria', 'descripcion')
        }),
        ('Fecha y Lugar', {
            'fields': ('fecha', 'hora', 'lugar', 'ciudad', 'estadio_nombre')
        }),
        ('Capacidad y Precios', {
            'fields': ('cupo_total', 'capacidad_maxima', 'capacidad_estadio', 'precio_base')
        }),
        ('Estado del Evento', {
            'fields': ('estado',),
            'description': '⚠️ Solo el administrador puede cambiar el estado a "cancelado".'
        }),
        ('Ubicación Geográfica', {
            'fields': ('ubicacion_mapa', 'lat', 'lng', 'sectores_geograficos'),
            'classes': ('collapse',),
        }),
        ('Imágenes', {
            'fields': ('imagen', 'imagen_url'),
            'classes': ('collapse',),
        }),
        ('Organizador', {
            'fields': ('organizador',),
        }),
    )


@admin.register(TipoTicket)
class TipoTicketAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'evento', 'precio', 'cantidad_disponible', 'cantidad_total', 'cantidad_vendida')
    list_filter = ('evento',)
    search_fields = ('nombre', 'evento__nombre')


@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ('codigo_ticket', 'usuario', 'tipo_ticket', 'cantidad', 'total', 'fecha_compra')
    list_filter = ('fecha_compra', 'tipo_ticket__evento')
    search_fields = ('codigo_ticket', 'usuario__username', 'tipo_ticket__nombre', 'tipo_ticket__evento__nombre')
    readonly_fields = ('codigo_ticket', 'fecha_compra', 'precio_unitario', 'total')
