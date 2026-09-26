from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from eventos.models import PerfilUsuario, Evento, TipoTicket, Compra


class Command(BaseCommand):
    help = "Carga datos de prueba (usuarios, eventos, tipos de tickets y compras) para el prototipo."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Iniciando carga de datos de prueba ==="))

        # 1. Crear Superusuario / Admin
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@ticketera.local',
                'first_name': 'Admin',
                'last_name': 'Principal',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            admin_user.perfil.rol = 'organizador'
            admin_user.perfil.save()
            self.stdout.write(self.style.SUCCESS("[OK] Superusuario creado: admin / admin123"))
        else:
            self.stdout.write("  Superusuario 'admin' ya existe.")

        # 2. Crear Organizador de prueba
        organizador_user, created = User.objects.get_or_create(
            username='organizador',
            defaults={
                'email': 'organizador@ticketera.local',
                'first_name': 'Carlos',
                'last_name': 'Mendoza',
            }
        )
        if created:
            organizador_user.set_password('organizador123')
            organizador_user.save()
            organizador_user.perfil.rol = 'organizador'
            organizador_user.perfil.telefono = '+56 9 8765 4321'
            organizador_user.perfil.save()
            self.stdout.write(self.style.SUCCESS("[OK] Usuario Organizador creado: organizador / organizador123"))
        else:
            self.stdout.write("  Usuario Organizador 'organizador' ya existe.")

        # 3. Crear Comprador de prueba
        comprador_user, created = User.objects.get_or_create(
            username='comprador',
            defaults={
                'email': 'comprador@ticketera.local',
                'first_name': 'Valeria',
                'last_name': 'Rojas',
            }
        )
        if created:
            comprador_user.set_password('comprador123')
            comprador_user.save()
            comprador_user.perfil.rol = 'comprador'
            comprador_user.perfil.telefono = '+56 9 1234 5678'
            comprador_user.perfil.save()
            self.stdout.write(self.style.SUCCESS("[OK] Usuario Comprador creado: comprador / comprador123"))
        else:
            self.stdout.write("  Usuario Comprador 'comprador' ya existe.")

        # Fecha base para los eventos
        hoy = date.today()

        # 4. Crear Eventos con tipos de ticket
        eventos_data = [
            {
                'nombre': 'Rock Stadium Fest 2026',
                'descripcion': 'El festival de rock mas potente y esperado del ano. Reune a las bandas mas influyentes del rock latino y alternativo en un escenario monumental con sonido de alta definicion, efectos pirotecnicos y areas gastronomicas exclusivas.\n\n¡No te quedes fuera de esta noche historica!',
                'fecha': hoy + timedelta(days=20),
                'hora': time(19, 0),
                'lugar': 'Estadio Nacional, Santiago',
                'imagen_url': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 25000.00,
                'cupo_total': 8000,
                'tickets': [
                    {'nombre': 'Cancha General', 'precio': 25000.00, 'cupo': 5000},
                    {'nombre': 'Platea Alta Numerada', 'precio': 42000.00, 'cupo': 2500},
                    {'nombre': 'VIP Front Stage + Merch', 'precio': 89000.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Sunset Electronic Festival',
                'descripcion': 'Baila al atardecer con los mejores DJs internacionales de House, Melodic Techno y Progressive. Dos escenarios al aire libre, visuales inmersivas, zona de descanso chill-out y barras premium.\n\nVen a vivir una experiencia sensorial unica desde las 16:00 horas.',
                'fecha': hoy + timedelta(days=35),
                'hora': time(16, 30),
                'lugar': 'Espacio Riesco Outdoor, Santiago',
                'imagen_url': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 18000.00,
                'cupo_total': 4000,
                'tickets': [
                    {'nombre': 'Early Bird (Preventa)', 'precio': 18000.00, 'cupo': 800},
                    {'nombre': 'Pase General Sunset', 'precio': 30000.00, 'cupo': 2700},
                    {'nombre': 'VIP Lounge Open Bar', 'precio': 68000.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Noche de Jazz & Blues Acustico',
                'descripcion': 'Una velada intima e inolvidable con maestros del jazz internacional y vocalistas de soul. Concierto en formato de teatro con acustica excepcional, copa de vino de bienvenida y ambiente elegante.\n\nCupos estrictamente limitados para garantizar una cercania inigualable con los artistas.',
                'fecha': hoy + timedelta(days=12),
                'hora': time(20, 30),
                'lugar': 'Teatro Municipal de Las Condes',
                'imagen_url': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 35000.00,
                'cupo_total': 650,
                'tickets': [
                    {'nombre': 'Balcon Superior', 'precio': 35000.00, 'cupo': 200},
                    {'nombre': 'Platea Baja Central', 'precio': 55000.00, 'cupo': 350},
                    {'nombre': 'Palco de Honor con Degustacion', 'precio': 85000.00, 'cupo': 100},
                ]
            },
            {
                'nombre': 'Indie Vibes Open Air',
                'descripcion': 'El festival que celebra la escena independiente y pop alternativo. Bandas en vivo, feria de diseno independiente, food trucks gourmet y actividades al aire libre para disfrutar toda la tarde con amigos.',
                'fecha': hoy + timedelta(days=50),
                'hora': time(15, 0),
                'lugar': 'Parque Bicentenario de Cerrillos',
                'imagen_url': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 22000.00,
                'cupo_total': 3000,
                'tickets': [
                    {'nombre': 'Acceso General', 'precio': 22000.00, 'cupo': 2400},
                    {'nombre': 'Pase VIP + Acceso Preferente', 'precio': 45000.00, 'cupo': 600},
                ]
            }
        ]

        ticket_comprable = None

        for e_info in eventos_data:
            evento, created = Evento.objects.get_or_create(
                nombre=e_info['nombre'],
                defaults={
                    'descripcion': e_info['descripcion'],
                    'fecha': e_info['fecha'],
                    'hora': e_info['hora'],
                    'lugar': e_info['lugar'],
                    'imagen_url': e_info['imagen_url'],
                    'precio_base': e_info['precio_base'],
                    'cupo_total': e_info['cupo_total'],
                    'organizador': organizador_user,
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"[OK] Evento creado: {evento.nombre}"))
                for t_info in e_info['tickets']:
                    ticket = TipoTicket.objects.create(
                        evento=evento,
                        nombre=t_info['nombre'],
                        precio=t_info['precio'],
                        cantidad_total=t_info['cupo'],
                        cantidad_disponible=t_info['cupo']
                    )
                    if not ticket_comprable:
                        ticket_comprable = ticket
            else:
                self.stdout.write(f"  Evento '{evento.nombre}' ya existe.")
                if not ticket_comprable and evento.tipos_ticket.exists():
                    ticket_comprable = evento.tipos_ticket.first()

        # 5. Crear Compras de prueba para simular datos en el dashboard y tickets del comprador
        if ticket_comprable and not Compra.objects.filter(usuario=comprador_user).exists():
            # Compra 1: 2 tickets
            cant1 = 2
            ticket_comprable.cantidad_disponible -= cant1
            ticket_comprable.save()
            compra1 = Compra.objects.create(
                usuario=comprador_user,
                tipo_ticket=ticket_comprable,
                cantidad=cant1,
                precio_unitario=ticket_comprable.precio,
                total=ticket_comprable.precio * cant1
            )
            self.stdout.write(self.style.SUCCESS(f"[OK] Compra de prueba 1 creada: {compra1.codigo_ticket} ({cant1} tickets)"))

            # Compra 2: Para otro evento
            otro_ticket = TipoTicket.objects.exclude(evento=ticket_comprable.evento).first()
            if otro_ticket:
                cant2 = 1
                otro_ticket.cantidad_disponible -= cant2
                otro_ticket.save()
                compra2 = Compra.objects.create(
                    usuario=comprador_user,
                    tipo_ticket=otro_ticket,
                    cantidad=cant2,
                    precio_unitario=otro_ticket.precio,
                    total=otro_ticket.precio * cant2
                )
                self.stdout.write(self.style.SUCCESS(f"[OK] Compra de prueba 2 creada: {compra2.codigo_ticket} ({cant2} ticket)"))

        self.stdout.write(self.style.SUCCESS("\n=== Carga de datos de prueba completada exitosamente! ==="))
        self.stdout.write(self.style.NOTICE("Credenciales disponibles:"))
        self.stdout.write("  - Admin:       admin / admin123 (Rol Organizador + Django Admin)")
        self.stdout.write("  - Organizador: organizador / organizador123")
        self.stdout.write("  - Comprador:   comprador / comprador123")

