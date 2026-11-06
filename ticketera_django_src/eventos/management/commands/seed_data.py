from datetime import date, time, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from eventos.models import PerfilUsuario, Evento, TipoTicket, Compra


class Command(BaseCommand):
    help = "Carga datos de prueba de Bolivia con metadatos completos para React API."

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

        # 4. Crear Eventos icónicos de Bolivia con precios en Bolivianos (Bs.) y estadios
        eventos_data = [
            {
                'nombre': 'Los Kjarkas - 50 Años Sinfónico',
                'subtitulo': 'Cinco décadas de folklore inmortal junto a la Orquesta Sinfónica',
                'categoria': 'Festivales',
                'ciudad': 'La Paz',
                'descripcion': 'El concierto de música folklórica más esperado de Bolivia. Los Kjarkas se presentan junto a la Orquesta Sinfónica en una velada monumental repasando cinco décadas de himnos inolvidables en una noche mágica bajo el Illimani.\n\nSonido acústico de alta fidelidad, iluminación cinematográfica y el orgullo de nuestra música.',
                'fecha': hoy + timedelta(days=15),
                'hora': time(19, 30),
                'lugar': 'Teatro al Aire Libre Jaime Laredo, La Paz',
                'estadio_nombre': 'Teatro al Aire Libre Jaime Laredo',
                'capacidad_estadio': '9.000 espectadores',
                'ubicacion_mapa': 'Teatro al Aire Libre Jaime Laredo, La Paz, Bolivia',
                'lat': -16.5055,
                'lng': -68.1285,
                'imagen_url': 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 70.00,
                'cupo_total': 5000,
                'sectores_geograficos': [
                    {'id': 'vip', 'nombre': 'VIP Oro Front Stage', 'ubicacion_estadio': 'Frente al Escenario', 'puerta': 'Puerta 1 - Preferencial', 'color': '#f59e0b', 'precio': 280, 'capacidad': 500, 'disponibles': 500},
                    {'id': 'preferencia', 'nombre': 'Preferencia Central', 'ubicacion_estadio': 'Graderías Medias', 'puerta': 'Puerta 2 - Av. del Ejército', 'color': '#38bdf8', 'precio': 140, 'capacidad': 1500, 'disponibles': 1500},
                    {'id': 'general', 'nombre': 'General Illimani', 'ubicacion_estadio': 'Graderías Altas', 'puerta': 'Puerta 3 - Rampa Norte', 'color': '#10b981', 'precio': 70, 'capacidad': 3000, 'disponibles': 3000}
                ],
                'tickets': [
                    {'nombre': 'General Illimani', 'sector': 'Graderías Altas', 'puerta': 'Puerta 3 - Rampa Norte', 'color_zona': '#10b981', 'precio': 70.00, 'cupo': 3000},
                    {'nombre': 'Preferencia Central', 'sector': 'Graderías Medias', 'puerta': 'Puerta 2 - Av. del Ejército', 'color_zona': '#38bdf8', 'precio': 140.00, 'cupo': 1500},
                    {'nombre': 'VIP Oro + Disco Conmemorativo', 'sector': 'Frente al Escenario', 'puerta': 'Puerta 1 - Preferencial', 'color_zona': '#f59e0b', 'precio': 280.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Rock Fest Bolivia 2026',
                'subtitulo': 'La cumbre del rock nacional con Octavia, Alcoholika y Llegas',
                'categoria': 'Rock',
                'ciudad': 'Santa Cruz',
                'descripcion': 'El festival de rock nacional más potente de Bolivia. Reúne a leyendas como Octavia, Alcoholika La Christo, Llegas y Animal de Ciudad en un escenario monumental con sonido envolvente y área gastronómica típica cruceña.\n\n¡La gran cumbre del rock boliviano!',
                'fecha': hoy + timedelta(days=28),
                'hora': time(18, 0),
                'lugar': 'Estadio Real Santa Cruz, Santa Cruz de la Sierra',
                'estadio_nombre': 'Estadio Real Santa Cruz',
                'capacidad_estadio': '25.000 espectadores',
                'ubicacion_mapa': 'Estadio Real Santa Cruz, Santa Cruz, Bolivia',
                'lat': -17.7833,
                'lng': -63.1667,
                'imagen_url': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 80.00,
                'cupo_total': 8000,
                'sectores_geograficos': [
                    {'id': 'vip', 'nombre': 'VIP Front Stage Experience', 'ubicacion_estadio': 'Frente al Escenario', 'puerta': 'Puerta 1 - VIP', 'color': '#f59e0b', 'precio': 320, 'capacidad': 500, 'disponibles': 500},
                    {'id': 'cancha', 'nombre': 'Cancha Rockera', 'ubicacion_estadio': 'Césped Central', 'puerta': 'Puerta 2 - Rampa', 'color': '#6366f1', 'precio': 150, 'capacidad': 3000, 'disponibles': 3000},
                    {'id': 'curva', 'nombre': 'Curva General', 'ubicacion_estadio': 'Tribuna General', 'puerta': 'Puerta 4', 'color': '#ec4899', 'precio': 80, 'capacidad': 4500, 'disponibles': 4500}
                ],
                'tickets': [
                    {'nombre': 'Curva General', 'sector': 'Tribuna General', 'puerta': 'Puerta 4', 'color_zona': '#ec4899', 'precio': 80.00, 'cupo': 4500},
                    {'nombre': 'Cancha Rockera', 'sector': 'Césped Central', 'puerta': 'Puerta 2', 'color_zona': '#6366f1', 'precio': 150.00, 'cupo': 3000},
                    {'nombre': 'VIP Front Stage Experience', 'sector': 'Frente al Escenario', 'puerta': 'Puerta 1', 'color_zona': '#f59e0b', 'precio': 320.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Sunset Electro Samaipata',
                'subtitulo': 'DJs internacionales de Melodic House & Techno en los valles',
                'categoria': 'Electrónica',
                'ciudad': 'Santa Cruz',
                'descripcion': 'Festival de música electrónica y artes visuales en los valles cruceños. Los mejores DJs nacionales e internacionales de Melodic House, Deep y Progressive en dos escenarios al aire libre, zona de camping bajo las estrellas y barras premium.\n\nVive una experiencia sensorial única en la magia de Samaipata.',
                'fecha': hoy + timedelta(days=40),
                'hora': time(16, 0),
                'lugar': 'Valle de Samaipata, Santa Cruz',
                'estadio_nombre': 'Valle de Samaipata Open Air',
                'capacidad_estadio': '5.000 asistentes',
                'ubicacion_mapa': 'Samaipata, Santa Cruz, Bolivia',
                'lat': -18.1800,
                'lng': -63.8756,
                'imagen_url': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 90.00,
                'cupo_total': 3500,
                'sectores_geograficos': [
                    {'id': 'early', 'nombre': 'Early Bird (Preventa)', 'ubicacion_estadio': 'Acceso General Pista', 'puerta': 'Entrada Principal', 'color': '#10b981', 'precio': 90, 'capacidad': 700, 'disponibles': 700},
                    {'id': 'sunset', 'nombre': 'Pase Sunset General', 'ubicacion_estadio': 'Pista Central', 'puerta': 'Entrada General', 'color': '#6366f1', 'precio': 160, 'capacidad': 2300, 'disponibles': 2300},
                    {'id': 'vip', 'nombre': 'VIP Lounge + Zona Camping', 'ubicacion_estadio': 'Deck Elevado y Camping', 'puerta': 'Puerta VIP Camping', 'color': '#f59e0b', 'precio': 300, 'capacidad': 500, 'disponibles': 500}
                ],
                'tickets': [
                    {'nombre': 'Early Bird (Preventa)', 'sector': 'Pista General', 'puerta': 'Entrada Principal', 'color_zona': '#10b981', 'precio': 90.00, 'cupo': 700},
                    {'nombre': 'Pase Sunset General', 'sector': 'Pista Central', 'puerta': 'Entrada General', 'color_zona': '#6366f1', 'precio': 160.00, 'cupo': 2300},
                    {'nombre': 'VIP Lounge + Zona Camping', 'sector': 'Deck Elevado', 'puerta': 'Puerta VIP Camping', 'color_zona': '#f59e0b', 'precio': 300.00, 'cupo': 500},
                ]
            },
            {
                'nombre': 'Noche de Jazz & Fusión Andina',
                'subtitulo': 'Gala acústica de charangos, zampoñas y vientos con swing contemporáneo',
                'categoria': 'Jazz',
                'ciudad': 'La Paz',
                'descripcion': 'Gala acústica donde se entrelazan vientos andinos (zampoñas y quenas) y charangos con los acordes del jazz tradicional y swing. Concierto en formato de teatro histórico con butacas numeradas y brindis de altura de cortesía.',
                'fecha': hoy + timedelta(days=10),
                'hora': time(20, 0),
                'lugar': 'Teatro Municipal Alberto Saavedra Pérez, La Paz',
                'estadio_nombre': 'Teatro Municipal Alberto Saavedra Pérez',
                'capacidad_estadio': '650 butacas',
                'ubicacion_mapa': 'Teatro Municipal Alberto Saavedra Perez, La Paz, Bolivia',
                'lat': -16.4950,
                'lng': -68.1360,
                'imagen_url': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 60.00,
                'cupo_total': 600,
                'sectores_geograficos': [
                    {'id': 'palco', 'nombre': 'Palco de Honor con Brindis', 'ubicacion_estadio': 'Planta 1 Palcos', 'puerta': 'Acceso A', 'color': '#f59e0b', 'precio': 220, 'capacidad': 100, 'disponibles': 100},
                    {'id': 'platea', 'nombre': 'Platea Central', 'ubicacion_estadio': 'Planta Baja', 'puerta': 'Acceso Central', 'color': '#38bdf8', 'precio': 110, 'capacidad': 300, 'disponibles': 300},
                    {'id': 'galeria', 'nombre': 'Galería Alta', 'ubicacion_estadio': 'Segundo Piso', 'puerta': 'Acceso Escaleras', 'color': '#10b981', 'precio': 60, 'capacidad': 200, 'disponibles': 200}
                ],
                'tickets': [
                    {'nombre': 'Galería Alta', 'sector': 'Segundo Piso', 'puerta': 'Acceso Escaleras', 'color_zona': '#10b981', 'precio': 60.00, 'cupo': 200},
                    {'nombre': 'Platea Central', 'sector': 'Planta Baja', 'puerta': 'Acceso Central', 'color_zona': '#38bdf8', 'precio': 110.00, 'cupo': 300},
                    {'nombre': 'Palco de Honor con Brindis', 'sector': 'Planta 1 Palcos', 'puerta': 'Acceso A', 'color_zona': '#f59e0b', 'precio': 220.00, 'cupo': 100},
                ]
            },
            {
                'nombre': 'Gran Cumbia Fest Cochabamba 2026',
                'subtitulo': 'La fiesta más grande de la cumbia y huayño en el valle',
                'categoria': 'Festivales',
                'ciudad': 'Cochabamba',
                'descripcion': '¡La fiesta de cumbia más grande de Cochabamba! Las agrupaciones tropicales más populares de Bolivia en vivo, escenario 360 grados, pista de baile gigante y la mejor gastronomía cochabambina.',
                'fecha': hoy + timedelta(days=55),
                'hora': time(17, 30),
                'lugar': 'Recinto Ferial FEXCO, Laguna Alalay, Cochabamba',
                'estadio_nombre': 'Recinto Ferial FEXCO Cochabamba',
                'capacidad_estadio': '15.000 asistentes',
                'ubicacion_mapa': 'FEXCO, Laguna Alalay, Cochabamba, Bolivia',
                'lat': -17.4100,
                'lng': -66.1400,
                'imagen_url': 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80',
                'precio_base': 50.00,
                'cupo_total': 6000,
                'sectores_geograficos': [
                    {'id': 'vip', 'nombre': 'VIP Valle Hermoso', 'ubicacion_estadio': 'Área Preferencial Escenario', 'puerta': 'Puerta 1 FEXCO', 'color': '#f59e0b', 'precio': 130, 'capacidad': 1500, 'disponibles': 1500},
                    {'id': 'general', 'nombre': 'General Pista', 'ubicacion_estadio': 'Pista Central Gigante', 'puerta': 'Puerta 2 y 3', 'color': '#6366f1', 'precio': 50, 'capacidad': 4500, 'disponibles': 4500}
                ],
                'tickets': [
                    {'nombre': 'General Pista', 'sector': 'Pista Central Gigante', 'puerta': 'Puertas 2 y 3', 'color_zona': '#6366f1', 'precio': 50.00, 'cupo': 4500},
                    {'nombre': 'VIP Valle Hermoso', 'sector': 'Área Preferencial', 'puerta': 'Puerta 1 FEXCO', 'color_zona': '#f59e0b', 'precio': 130.00, 'cupo': 1500},
                ]
            }
        ]

        ticket_comprable = None

        for e_info in eventos_data:
            evento, created = Evento.objects.get_or_create(
                nombre=e_info['nombre'],
                defaults={
                    'subtitulo': e_info.get('subtitulo', ''),
                    'categoria': e_info.get('categoria', 'General'),
                    'ciudad': e_info.get('ciudad', 'La Paz'),
                    'descripcion': e_info['descripcion'],
                    'fecha': e_info['fecha'],
                    'hora': e_info['hora'],
                    'lugar': e_info['lugar'],
                    'estadio_nombre': e_info.get('estadio_nombre', ''),
                    'capacidad_estadio': e_info.get('capacidad_estadio', ''),
                    'ubicacion_mapa': e_info.get('ubicacion_mapa', ''),
                    'lat': e_info.get('lat'),
                    'lng': e_info.get('lng'),
                    'sectores_geograficos': e_info.get('sectores_geograficos', []),
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
                        sector=t_info.get('sector', ''),
                        puerta=t_info.get('puerta', ''),
                        color_zona=t_info.get('color_zona', '#6366f1'),
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
