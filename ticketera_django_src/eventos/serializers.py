from rest_framework import serializers
from django.contrib.auth.models import User
from .models import PerfilUsuario, Evento, TipoTicket, Compra


class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ['rol', 'telefono']


class UserSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(source='perfil.rol', read_only=True)
    telefono = serializers.CharField(source='perfil.telefono', read_only=True)
    nombre = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'nombre', 'rol', 'telefono']

    def get_nombre(self, obj):
        full = f"{obj.first_name} {obj.last_name}".strip()
        return full if full else obj.username


class TipoTicketSerializer(serializers.ModelSerializer):
    cantidad_vendida = serializers.ReadOnlyField()

    class Meta:
        model = TipoTicket
        fields = [
            'id', 'evento', 'nombre', 'sector', 'puerta', 'color_zona',
            'precio', 'cantidad_total', 'cantidad_disponible', 'cantidad_vendida'
        ]
        read_only_fields = ['evento', 'cantidad_vendida']


class EventoSerializer(serializers.ModelSerializer):
    tipos_ticket = TipoTicketSerializer(many=True, read_only=True)
    organizador_id = serializers.ReadOnlyField(source='organizador.id')
    organizador_nombre = serializers.SerializerMethodField()
    imagen_url = serializers.CharField(source='imagen_display', read_only=True)
    cupos_disponibles = serializers.ReadOnlyField()
    total_vendidos = serializers.ReadOnlyField()
    ingresos_totales = serializers.ReadOnlyField()

    class Meta:
        model = Evento
        fields = [
            'id', 'nombre', 'subtitulo', 'categoria', 'ciudad', 'descripcion',
            'fecha', 'hora', 'lugar', 'estadio_nombre', 'capacidad_estadio',
            'ubicacion_mapa', 'lat', 'lng', 'sectores_geograficos',
            'imagen_url', 'precio_base', 'cupo_total', 'organizador_id',
            'organizador_nombre', 'cupos_disponibles', 'total_vendidos',
            'ingresos_totales', 'tipos_ticket'
        ]

    def get_organizador_nombre(self, obj):
        if obj.organizador:
            full = f"{obj.organizador.first_name} {obj.organizador.last_name}".strip()
            return full if full else obj.organizador.username
        return 'Organizador'


class CompraSerializer(serializers.ModelSerializer):
    usuario_id = serializers.ReadOnlyField(source='usuario.id')
    usuario_nombre = serializers.SerializerMethodField()
    evento_id = serializers.ReadOnlyField(source='tipo_ticket.evento.id')
    evento_nombre = serializers.ReadOnlyField(source='tipo_ticket.evento.nombre')
    evento_fecha = serializers.ReadOnlyField(source='tipo_ticket.evento.fecha')
    evento_hora = serializers.ReadOnlyField(source='tipo_ticket.evento.hora')
    evento_lugar = serializers.ReadOnlyField(source='tipo_ticket.evento.lugar')
    tipo_ticket_id = serializers.ReadOnlyField(source='tipo_ticket.id')
    tipo_ticket_nombre = serializers.ReadOnlyField(source='tipo_ticket.nombre')

    class Meta:
        model = Compra
        fields = [
            'id', 'codigo_ticket', 'usuario_id', 'usuario_nombre',
            'evento_id', 'evento_nombre', 'evento_fecha', 'evento_hora',
            'evento_lugar', 'tipo_ticket_id', 'tipo_ticket_nombre',
            'cantidad', 'precio_unitario', 'total', 'fecha_compra'
        ]
        read_only_fields = ['codigo_ticket', 'precio_unitario', 'total', 'fecha_compra']

    def get_usuario_nombre(self, obj):
        if obj.usuario:
            full = f"{obj.usuario.first_name} {obj.usuario.last_name}".strip()
            return full if full else obj.usuario.username
        return 'Usuario'
