from django.db import models


class Recinto(models.Model):
    """
    [CAPA MODELO - MVC]
    Entidad Recinto: Representa un estadio, teatro, arena, campo ferial o coliseo en Bolivia.
    Permite su gestión completa (CRUD) y eliminación desde la API REST / Postman.
    """
    nombre = models.CharField(max_length=200, verbose_name="Nombre del Recinto")
    tipo = models.CharField(max_length=50, default='estadio', verbose_name="Tipo (estadio, teatro, arena, ferial, coliseo)")
    ciudad = models.CharField(max_length=100, default='La Paz', verbose_name="Ciudad")
    departamento = models.CharField(max_length=100, default='La Paz', verbose_name="Departamento")
    lugar = models.CharField(max_length=255, verbose_name="Ubicación / Dirección")
    capacidad = models.PositiveIntegerField(default=10000, verbose_name="Capacidad Máxima / Aforo")
    lat = models.FloatField(blank=True, null=True, verbose_name="Latitud")
    lng = models.FloatField(blank=True, null=True, verbose_name="Longitud")
    descripcion = models.TextField(blank=True, default='', verbose_name="Descripción del Recinto")
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'eventos'
        ordering = ['id']
        verbose_name = "Recinto"
        verbose_name_plural = "Recintos"

    def __str__(self):
        return f"{self.nombre} ({self.ciudad})"

    @classmethod
    def listar_recintos(cls, ciudad=None, tipo=None):
        qs = cls.objects.all()
        if ciudad:
            qs = qs.filter(ciudad__iexact=ciudad)
        if tipo:
            qs = qs.filter(tipo__iexact=tipo)
        return qs

    @classmethod
    def crear_recinto(cls, data):
        return cls.objects.create(
            nombre=data.get('nombre', 'Nuevo Recinto'),
            tipo=data.get('tipo', 'estadio'),
            ciudad=data.get('ciudad', 'La Paz'),
            departamento=data.get('departamento', data.get('ciudad', 'La Paz')),
            lugar=data.get('lugar', data.get('direccion', '')),
            capacidad=int(data.get('capacidad', 10000)),
            lat=data.get('lat'),
            lng=data.get('lng'),
            descripcion=data.get('descripcion', '')
        )
