from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from eventos.models import PerfilUsuario, Evento, TipoTicket, Compra


class Command(BaseCommand):
    help = "Carga datos de prueba de Bolivia (usuarios, eventos en La Paz, Santa Cruz y Cbba, tickets en Bs. y compras)."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Iniciando carga de datos de prueba para Bolivia (Bs.) ==="))

        # 1. Crear Superusuario / Admin
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@ticketera.bo',
                'first_name': 'Admin',
                'last_name': 'Bolivia',
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

        # 2. Crear Organizador de prueba (Bolivia)
        organizador_user, created = User.objects.get_or_create(
            username='organizador',
            defaults={
                'email': 'organizador@ticketera.bo',
                'first_name': 'Carlos',
                'last_name': 'Mamani',
            }
        )
        if created:
            organizador_user.set_password('organizador123')
            organizador_user.save()
            organizador_user.perfil.rol = 'organizador'
            organizador_user.perfil.telefono = '+591 71234567'
            organizador_user.perfil.save()
            self.stdout.write(self.style.SUCCESS("[OK] Usuario Organizador creado: organizador / organizador123"))
        else:
            self.stdout.write("  Usuario Organizador 'organizador' ya existe.")

        # 3. Crear Comprador de prueba (Bolivia)
        comprador_user, created = User.objects.get_or_create(
            username='comprador',
            defaults={
                'email': 'comprador@ticketera.bo',
                'first_name': 'Valeria',
                'last_name': 'Choque',
            }
        )
        if created:
            comprador_user.set_password('comprador123')
            comprador_user.save()
            comprador_user.perfil.rol = 'comprador'
            comprador_user.perfil.telefono = '+591 76543210'
            comprador_user.perfil.save()
            self.stdout.write(self.style.SUCCESS("[OK] Usuario Comprador creado: comprador / comprador123"))
        else:
            self.stdout.write("  Usuario Comprador 'comprador' ya existe.")

        hoy = date.today()

        # 4. Crear Eventos icónicos de Bolivia con precios en Bolivianos (Bs.)
        eventos_data = [
            {
                'nombre': 'Los Kjarkas - 50 Años Sinfónico',
                'descripcion': 'El concierto de música folklórica más esperado de Bolivia. Los Kjarkas se presentan junto a la Orquesta Sinfónica en una velada monumental repasando cinco décadas de himnos inolvidables en una noche mágica bajo el Illimani.\n\nSonido acústico de alta fidelidad, iluminación cinematográfica y el orgullo de nuestra música.',
                'fecha': hoy + timedelta(days=15),
                'hora': time(19, 30),
                'lugar': 'Teatro al Aire Libre Jaime Laredo, La Paz',
                'imagen_url': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 70.00,
                'cupo_total': 5000,
                'tickets': [
                    {'nombre': 'General Illimani', 'precio': 70.00, 'cupo': 3000},
                    {'nombre': 'Preferencia Central', 'precio': 140.00, 'cupo': 1500},
                    {'nombre': 'VIP Oro + Disco Conmemorativo', 'precio': 280.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Rock Fest Bolivia 2026',
                'descripcion': 'El festival de rock nacional más potente de Bolivia. Reúne a leyendas como Octavia, Alcoholika La Christo, Llegas y Animal de Ciudad en un escenario monumental con sonido envolvente y área gastronómica típica cruceña.\n\n¡La gran cumbre del rock boliviano!',
                'fecha': hoy + timedelta(days=28),
                'hora': time(18, 0),
                'lugar': 'Estadio Real Santa Cruz, Santa Cruz de la Sierra',
                'imagen_url': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 80.00,
                'cupo_total': 8000,
                'tickets': [
                    {'nombre': 'Curva General', 'precio': 80.00, 'cupo': 4500},
                    {'nombre': 'Cancha Rockera', 'precio': 150.00, 'cupo': 3000},
                    {'nombre': 'VIP Front Stage Experience', 'precio': 320.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Sunset Electro Samaipata',
                'descripcion': 'Festival de música electrónica y artes visuales en los valles cruceños. Los mejores DJs nacionales e internacionales de Melodic House, Deep y Progressive en dos escenarios al aire libre, zona de camping bajo las estrellas y barras premium.\n\nVive una experiencia sensorial única en la magia de Samaipata.',
                'fecha': hoy + timedelta(days=40),
                'hora': time(16, 0),
                'lugar': 'Valle de Samaipata, Santa Cruz',
                'imagen_url': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 90.00,
                'cupo_total': 3500,
                'tickets': [
                    {'nombre': 'Early Bird (Preventa)', 'precio': 90.00, 'cupo': 700},
                    {'nombre': 'Pase Sunset General', 'precio': 160.00, 'cupo': 2300},
                    {'nombre': 'VIP Lounge + Zona Camping', 'precio': 300.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Noche de Jazz & Fusión Andina',
                'descripcion': 'Gala acústica donde se entrelazan vientos andinos (zampoñas y quenas) y charangos con los acordes del jazz tradicional y swing. Concierto en formato de teatro histórico con butacas numeradas y brindis de altura de cortesía.',
                'fecha': hoy + timedelta(days=10),
                'hora': time(20, 0),
                'lugar': 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
                'imagen_url': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 60.00,
                'cupo_total': 600,
                'tickets': [
                    {'nombre': 'Galería Alta', 'precio': 60.00, 'cupo': 200},
                    {'nombre': 'Platea Central', 'precio': 110.00, 'cupo': 300},
                    {'nombre': 'Palco de Honor con Brindis', 'precio': 220.00, 'cupo': 100},
                ]
            },
            {
                'nombre': 'Gran Cumbia Fest Cochabamba 2026',
                'descripcion': '¡La fiesta de cumbia más grande de Cochabamba! Las agrupaciones tropicales más populares de Bolivia en vivo, escenario 360 grados, pista de baile gigante y la mejor gastronomía cochabambina.',
                'fecha': hoy + timedelta(days=55),
                'hora': time(17, 30),
                'lugar': 'Recinto Ferial FEXCO, Laguna Alalay, Cochabamba',
                'imagen_url': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 50.00,
                'cupo_total': 6000,
                'tickets': [
                    {'nombre': 'General Pista', 'precio': 50.00, 'cupo': 4500},
                    {'nombre': 'VIP Valle Hermoso', 'precio': 130.00, 'cupo': 1500},
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
                self.stdout.write(self.style.SUCCESS(f"[OK] Evento creado: {evento.nombre} ({evento.lugar})"))
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

        # 5. Crear Compras de prueba en Bolivianos (Bs.) para simular tickets y panel
        if ticket_comprable and not Compra.objects.filter(usuario=comprador_user).exists():
            # Compra 1: 2 tickets para el primer evento
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
            self.stdout.write(self.style.SUCCESS(f"[OK] Compra de prueba 1 creada: {compra1.codigo_ticket} ({cant1} tickets - Bs. {compra1.total})"))

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
                self.stdout.write(self.style.SUCCESS(f"[OK] Compra de prueba 2 creada: {compra2.codigo_ticket} ({cant2} ticket - Bs. {compra2.total})"))

        self.stdout.write(self.style.SUCCESS("\n=== Carga de datos de Bolivia completada exitosamente! ==="))
        self.stdout.write(self.style.NOTICE("Credenciales disponibles (Bolivia):"))
        self.stdout.write("  - Admin:       admin / admin123 (Rol Organizador + Django Admin)")
        self.stdout.write("  - Organizador: organizador / organizador123 (Carlos Mamani)")
        self.stdout.write("  - Comprador:   comprador / comprador123 (Valeria Choque)")
