from django.db import models
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver


class PerfilUsuario(models.Model):
    """
    [CAPA MODELO - MVC]
    Entidad PerfilUsuario: Gestiona los datos extendidos del usuario, roles y reglas de negocio de autenticación.
    """
    ROLES = (
        ('comprador', 'Comprador'),
        ('organizador', 'Organizador'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    rol = models.CharField(max_length=20, choices=ROLES, default='comprador')
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name="Teléfono")

    class Meta:
        app_label = 'eventos'
        verbose_name = "Perfil de Usuario"
        verbose_name_plural = "Perfiles de Usuarios"

    def __str__(self):
        return f"{self.user.username} - {self.get_rol_display()}"

    @property
    def es_organizador(self):
        return self.rol == 'organizador' or self.user.is_staff or self.user.is_superuser

    # ==========================================================
    # Métodos de Dominio / Reglas de Negocio (Modelo MVC)
    # ==========================================================

    @classmethod
    def autenticar_usuario(cls, request, username, password):
        """Valida credenciales por username o email y retorna el usuario si es válido."""
        user = authenticate(request, username=username, password=password)
        if not user and username:
            u = User.objects.filter(Q(username__iexact=username) | Q(email__iexact=username)).first()
            if u and u.check_password(password):
                user = u
        return user

    @classmethod
    def registrar_nuevo_usuario(cls, username, password, email='', nombre='', rol='comprador', telefono=''):
        """Crea un usuario con su respectivo perfil y valida unicidad."""
        if not username or not password:
            raise ValueError("Nombre de usuario y contraseña son requeridos")

        if User.objects.filter(username__iexact=username).exists():
            raise ValueError("El nombre de usuario ya está en uso")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=nombre
        )
        perfil, _ = cls.objects.get_or_create(user=user)
        perfil.rol = rol if rol in ['comprador', 'organizador'] else 'comprador'
        perfil.telefono = telefono
        perfil.save()
        return user

    @classmethod
    def obtener_todos_los_usuarios(cls):
        """Retorna todos los usuarios con su perfil asociado."""
        return User.objects.all().select_related('perfil')


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        PerfilUsuario.objects.get_or_create(user=instance)
    else:
        if hasattr(instance, 'perfil'):
            instance.perfil.save()
