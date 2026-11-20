"""
==========================================================
CAPA DE MODELO (M - Model en Arquitectura MVC)
==========================================================
Contiene las entidades de base de datos, relaciones ORM y reglas de negocio del dominio:
- PerfilUsuario (usuario_model.py)
- Evento (evento_model.py)
- TipoTicket (ticket_model.py)
- Compra (compra_model.py)
"""

from .usuario_model import PerfilUsuario, create_or_update_user_profile
from .evento_model import Evento
from .ticket_model import TipoTicket
from .compra_model import Compra
from .recinto_model import Recinto

__all__ = [
    'PerfilUsuario',
    'Evento',
    'TipoTicket',
    'Compra',
    'Recinto',
    'create_or_update_user_profile',
]
