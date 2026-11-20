"""
[CAPA CONTROLADOR - MVC]
Controlador de Recintos y Estadios:
Gestiona las peticiones HTTP (GET, POST, PUT, DELETE) para recintos y estadios,
permitiendo consultar, crear y eliminar un recinto desde Postman o la API.
"""

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from ..models import Recinto
from ..views import RecintoApiView


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def api_recintos_lista(request):
    """
    Controlador de colección de recintos:
    - GET: Lista todos los recintos deportivos, teatros y campos feriales. Filtros: ?ciudad=X&tipo=Y
    - POST: Crea un nuevo recinto en el catálogo.
    """
    if request.method == 'GET':
        ciudad = request.GET.get('ciudad', '').strip()
        tipo = request.GET.get('tipo', '').strip()
        recintos = Recinto.listar_recintos(ciudad=ciudad, tipo=tipo)
        return RecintoApiView.lista_recintos(recintos)

    elif request.method == 'POST':
        recinto = Recinto.crear_recinto(request.data)
        return RecintoApiView.detalle_recinto(recinto, creado=True)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def api_recinto_detalle(request, pk):
    """
    Controlador de recurso individual de recinto:
    - GET: Obtiene la información detallada de un recinto.
    - PUT/PATCH: Actualiza los datos del recinto.
    - DELETE: Elimina el recinto desde Postman o API REST.
    """
    recinto = get_object_or_404(Recinto, pk=pk)

    if request.method == 'GET':
        return RecintoApiView.detalle_recinto(recinto)

    elif request.method in ['PUT', 'PATCH']:
        data = request.data
        for field in ['nombre', 'tipo', 'ciudad', 'departamento', 'lugar', 'capacidad', 'lat', 'lng', 'descripcion']:
            if field in data:
                setattr(recinto, field, data[field])
        recinto.save()
        return RecintoApiView.detalle_recinto(recinto)

    elif request.method == 'DELETE':
        nombre = recinto.nombre
        recinto.delete()
        return RecintoApiView.recinto_eliminado(nombre, pk)
