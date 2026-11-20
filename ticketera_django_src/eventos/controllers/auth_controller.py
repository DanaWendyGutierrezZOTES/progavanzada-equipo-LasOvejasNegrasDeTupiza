"""
[CAPA CONTROLADOR - MVC]
Controlador de Autenticación y Usuarios:
Recibe las peticiones HTTP de login/registro, interactúa con el Modelo (PerfilUsuario)
y delega la respuesta JSON a la Vista (AuthApiView).
"""

from django.contrib.auth import login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from ..models import PerfilUsuario
from ..views import AuthApiView


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """Controlador: Inicia sesión validando credenciales con el Modelo."""
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '').strip()

    user = PerfilUsuario.autenticar_usuario(request, username, password)
    if user:
        login(request, user)
        return AuthApiView.login_exitoso(user)

    return AuthApiView.error('Usuario o contraseña incorrectos')


@api_view(['POST'])
@permission_classes([AllowAny])
def api_logout(request):
    """Controlador: Cierra la sesión activa del usuario."""
    logout(request)
    return AuthApiView.logout_exitoso()


@api_view(['POST'])
@permission_classes([AllowAny])
def api_registro(request):
    """Controlador: Registra un nuevo usuario (Comprador u Organizador)."""
    data = request.data
    try:
        user = PerfilUsuario.registrar_nuevo_usuario(
            username=data.get('username', '').strip(),
            password=data.get('password', '').strip(),
            email=data.get('email', '').strip(),
            nombre=data.get('nombre', '').strip(),
            rol=data.get('rol', 'comprador'),
            telefono=data.get('telefono', '').strip()
        )
        login(request, user)
        return AuthApiView.registro_exitoso(user)
    except ValueError as e:
        return AuthApiView.error(str(e))


@api_view(['GET'])
@permission_classes([AllowAny])
def api_usuario_actual(request):
    """Controlador: Retorna los datos del usuario autenticado en la sesión."""
    return AuthApiView.usuario_actual(request.user)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_usuarios_lista(request):
    """Controlador: Lista todos los usuarios registrados."""
    usuarios = PerfilUsuario.obtener_todos_los_usuarios()
    return AuthApiView.lista_usuarios(usuarios)
