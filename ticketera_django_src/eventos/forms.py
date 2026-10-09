from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import PerfilUsuario, Evento, TipoTicket, Compra


class RegistroUsuarioForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True, label="Nombre")
    last_name = forms.CharField(max_length=30, required=True, label="Apellido")
    email = forms.EmailField(required=True, label="Correo Electrónico")
    rol = forms.ChoiceField(
        choices=PerfilUsuario.ROLES,
        initial='comprador',
        label="Tipo de Cuenta / Rol",
        help_text="Selecciona 'Organizador' si deseas crear y gestionar tus propios eventos."
    )
    telefono = forms.CharField(max_length=20, required=False, label="Teléfono de Contacto")

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            perfil, _ = PerfilUsuario.objects.get_or_create(user=user)
            perfil.rol = self.cleaned_data['rol']
            perfil.telefono = self.cleaned_data['telefono']
            perfil.save()
        return user


class CustomLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Usuario o email'})
        self.fields['password'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Contraseña'})


class EventoForm(forms.ModelForm):
    class Meta:
        model = Evento
        fields = ['nombre', 'descripcion', 'fecha', 'hora', 'lugar', 'imagen', 'imagen_url', 'precio_base', 'cupo_total']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej. Festival Rock en el Parque 2026'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Describe el evento, artistas invitados, información importante...'}),
            'fecha': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'hora': forms.TimeInput(attrs={'class': 'form-control', 'type': 'time'}),
            'lugar': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej. Estadio Nacional, Santiago'}),
            'imagen': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'imagen_url': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://ejemplo.com/poster.jpg'}),
            'precio_base': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'min': '0'}),
            'cupo_total': forms.NumberInput(attrs={'class': 'form-control', 'min': '1', 'placeholder': 'Ej. 500'}),
        }
        help_texts = {
            'imagen': 'Sube un archivo de imagen desde tu computador.',
            'imagen_url': 'O si prefieres, pega la URL directa de una imagen web.',
        }


class TipoTicketForm(forms.ModelForm):
    class Meta:
        model = TipoTicket
        fields = ['nombre', 'precio', 'cantidad_disponible']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej. General / VIP / Preventa'}),
            'precio': forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'min': '0'}),
            'cantidad_disponible': forms.NumberInput(attrs={'class': 'form-control', 'min': '1', 'placeholder': 'Cantidad total de tickets'}),
        }


class CompraTicketForm(forms.Form):
    cantidad = forms.IntegerField(
        min_value=1,
        initial=1,
        label="Cantidad de Tickets",
        widget=forms.NumberInput(attrs={'class': 'form-control form-control-lg text-center', 'min': '1'})
    )

    def __init__(self, tipo_ticket=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tipo_ticket = tipo_ticket
        if tipo_ticket:
            max_disponible = tipo_ticket.cantidad_disponible
            self.fields['cantidad'].widget.attrs['max'] = max_disponible
            self.fields['cantidad'].help_text = f"Máximo disponible: {max_disponible} ticket(s)"

    def clean_cantidad(self):
        cantidad = self.cleaned_data['cantidad']
        if self.tipo_ticket and cantidad > self.tipo_ticket.cantidad_disponible:
            raise forms.ValidationError(
                f"No hay suficientes tickets disponibles. Quedan solo {self.tipo_ticket.cantidad_disponible}."
            )
        return cantidad
