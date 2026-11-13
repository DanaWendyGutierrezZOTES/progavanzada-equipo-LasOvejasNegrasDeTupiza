"""
🆕 CAMBIO 2: Comando para cargar datos de prueba en la base de datos.

Uso:
    python manage.py cargar_datos_prueba

Esto crea automáticamente:
    - 1 usuario administrador (admin / admin123)
    - 1 usuario organizador (organizador / org123)
    - 2 usuarios compradores (comprador1, comprador2)
    - 3 eventos con tipos de tickets variados
    - Varias compras simuladas para el historial de ventas
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from eventos.models import PerfilUsuario, Evento, TipoTicket, Compra
from datetime import date, time
from decimal import Decimal


class Command(BaseCommand):
    help = 'Carga datos de prueba para demostración y presentación'

    def handle(self, *args, **kwargs):
        self.stdout.write('🔄 Cargando datos de prueba...\n')

        # =============================================
        # 1. CREAR USUARIOS
        # =============================================

        # Administrador (superusuario - puede cancelar eventos)
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'first_name': 'Administrador',
                'last_name': 'Principal',
                'email': 'admin@ticketeventos.bo',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('✅ Admin creado: admin / admin123'))
        else:
            self.stdout.write('⚠️  Admin ya existía')

        # Organizador (puede crear y gestionar eventos)
        org, created = User.objects.get_or_create(
            username='organizador',
            defaults={
                'first_name': 'Carlos',
                'last_name': 'Mendoza',
                'email': 'carlos@ticketeventos.bo',
            }
        )
        if created:
            org.set_password('org123')
            org.save()
            perfil = org.perfil
            perfil.rol = 'organizador'
            perfil.telefono = '+591 71234567'
            perfil.save()
            self.stdout.write(self.style.SUCCESS('✅ Organizador creado: organizador / org123'))
        else:
            self.stdout.write('⚠️  Organizador ya existía')

        # Comprador 1
        comp1, created = User.objects.get_or_create(
            username='comprador1',
            defaults={
                'first_name': 'Valeria',
                'last_name': 'Rojas',
                'email': 'valeria@correo.com',
            }
        )
        if created:
            comp1.set_password('comp123')
            comp1.save()
            perfil = comp1.perfil
            perfil.telefono = '+591 79876543'
            perfil.save()
            self.stdout.write(self.style.SUCCESS('✅ Comprador 1 creado: comprador1 / comp123'))
        else:
            self.stdout.write('⚠️  Comprador 1 ya existía')

        # Comprador 2
        comp2, created = User.objects.get_or_create(
            username='comprador2',
            defaults={
                'first_name': 'Miguel',
                'last_name': 'Torres',
                'email': 'miguel@correo.com',
            }
        )
        if created:
            comp2.set_password('comp123')
            comp2.save()
            perfil = comp2.perfil
            perfil.telefono = '+591 76543210'
            perfil.save()
            self.stdout.write(self.style.SUCCESS('✅ Comprador 2 creado: comprador2 / comp123'))
        else:
            self.stdout.write('⚠️  Comprador 2 ya existía')

        # =============================================
        # 2. CREAR EVENTOS
        # =============================================

        evento1, created = Evento.objects.get_or_create(
            nombre='Festival Rock Bolivia 2026',
            defaults={
                'subtitulo': 'La noche más épica del rock nacional',
                'categoria': 'Concierto',
                'ciudad': 'La Paz',
                'descripcion': 'Gran festival con las mejores bandas de rock boliviano. '
                               'Incluye Octavia, Atajo, Alcohol Etílico y artistas invitados internacionales.',
                'fecha': date(2026, 12, 15),
                'hora': time(19, 0),
                'lugar': 'Estadio Hernando Siles, Miraflores',
                'estadio_nombre': 'Estadio Hernando Siles',
                'capacidad_estadio': '42.000',
                'capacidad_maxima': 42000,
                'lat': -16.5000,
                'lng': -68.1193,
                'precio_base': Decimal('80.00'),
                'cupo_total': 5000,
                'estado': 'activo',
                'organizador': org,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✅ Evento 1 creado: Festival Rock Bolivia'))
            TipoTicket.objects.create(evento=evento1, nombre='General', sector='Campo', puerta='Puerta Norte',
                                     color_zona='#22c55e', precio=Decimal('80.00'),
                                     cantidad_total=3000, cantidad_disponible=2850)
            TipoTicket.objects.create(evento=evento1, nombre='VIP', sector='Platea', puerta='Puerta Este',
                                     color_zona='#a855f7', precio=Decimal('200.00'),
                                     cantidad_total=1500, cantidad_disponible=1400)
            TipoTicket.objects.create(evento=evento1, nombre='Backstage', sector='Backstage', puerta='Puerta Privada',
                                     color_zona='#f59e0b', precio=Decimal('500.00'),
                                     cantidad_total=500, cantidad_disponible=480)

        evento2, created = Evento.objects.get_or_create(
            nombre='Feria Internacional del Libro 2026',
            defaults={
                'subtitulo': 'Cultura y conocimiento para todos',
                'categoria': 'Cultural',
                'ciudad': 'Cochabamba',
                'descripcion': 'Feria del libro con más de 200 expositores, charlas con autores bolivianos '
                               'y talleres de escritura creativa para todas las edades.',
                'fecha': date(2026, 11, 25),
                'hora': time(10, 0),
                'lugar': 'Campo Ferial Chuquiago Marka',
                'estadio_nombre': 'Campo Ferial Chuquiago Marka',
                'capacidad_estadio': '15.000',
                'capacidad_maxima': 15000,
                'lat': -17.3935,
                'lng': -66.1570,
                'precio_base': Decimal('15.00'),
                'cupo_total': 2000,
                'estado': 'activo',
                'organizador': org,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✅ Evento 2 creado: Feria del Libro'))
            TipoTicket.objects.create(evento=evento2, nombre='Entrada General', sector='General', puerta='Entrada Principal',
                                     color_zona='#3b82f6', precio=Decimal('15.00'),
                                     cantidad_total=1500, cantidad_disponible=1350)
            TipoTicket.objects.create(evento=evento2, nombre='Entrada VIP', sector='VIP', puerta='Entrada VIP',
                                     color_zona='#ef4444', precio=Decimal('50.00'),
                                     cantidad_total=500, cantidad_disponible=460)

        evento3, created = Evento.objects.get_or_create(
            nombre='Carnaval de Oruro - Tribuna Especial',
            defaults={
                'subtitulo': 'Patrimonio Cultural de la Humanidad',
                'categoria': 'Festival',
                'ciudad': 'Oruro',
                'descripcion': 'Vive el Carnaval de Oruro desde la mejor tribuna. '
                               'Acceso exclusivo con asiento numerado y servicio de comida.',
                'fecha': date(2027, 2, 14),
                'hora': time(8, 0),
                'lugar': 'Ruta del Carnaval, Av. Cívica',
                'estadio_nombre': 'Tribuna Central Carnaval',
                'capacidad_estadio': '25.000',
                'capacidad_maxima': 25000,
                'lat': -17.9647,
                'lng': -67.1142,
                'precio_base': Decimal('120.00'),
                'cupo_total': 3000,
                'estado': 'activo',
                'organizador': org,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✅ Evento 3 creado: Carnaval de Oruro'))
            TipoTicket.objects.create(evento=evento3, nombre='Tribuna Sol', sector='Sol', puerta='Acceso A',
                                     color_zona='#f97316', precio=Decimal('120.00'),
                                     cantidad_total=2000, cantidad_disponible=1800)
            TipoTicket.objects.create(evento=evento3, nombre='Tribuna Sombra', sector='Sombra', puerta='Acceso B',
                                     color_zona='#6366f1', precio=Decimal('180.00'),
                                     cantidad_total=1000, cantidad_disponible=920)

        # =============================================
        # 3. CREAR COMPRAS SIMULADAS (historial de ventas)
        # =============================================

        tickets_evento1 = TipoTicket.objects.filter(evento=evento1)
        tickets_evento2 = TipoTicket.objects.filter(evento=evento2)

        compras_creadas = 0

        if tickets_evento1.exists() and Compra.objects.filter(tipo_ticket__evento=evento1).count() == 0:
            # Compra de Valeria: 3 tickets General del Festival Rock
            t_general = tickets_evento1.filter(nombre='General').first()
            if t_general:
                Compra.objects.create(usuario=comp1, tipo_ticket=t_general,
                                     cantidad=3, precio_unitario=t_general.precio,
                                     total=t_general.precio * 3)
                compras_creadas += 1

            # Compra de Valeria: 1 ticket VIP del Festival Rock
            t_vip = tickets_evento1.filter(nombre='VIP').first()
            if t_vip:
                Compra.objects.create(usuario=comp1, tipo_ticket=t_vip,
                                     cantidad=1, precio_unitario=t_vip.precio,
                                     total=t_vip.precio * 1)
                compras_creadas += 1

            # Compra de Miguel: 2 tickets General del Festival Rock
            if t_general:
                Compra.objects.create(usuario=comp2, tipo_ticket=t_general,
                                     cantidad=2, precio_unitario=t_general.precio,
                                     total=t_general.precio * 2)
                compras_creadas += 1

        if tickets_evento2.exists() and Compra.objects.filter(tipo_ticket__evento=evento2).count() == 0:
            # Compra de Miguel: 4 tickets para la Feria del Libro
            t_feria = tickets_evento2.filter(nombre='Entrada General').first()
            if t_feria:
                Compra.objects.create(usuario=comp2, tipo_ticket=t_feria,
                                     cantidad=4, precio_unitario=t_feria.precio,
                                     total=t_feria.precio * 4)
                compras_creadas += 1

            # Compra de Valeria: 2 tickets VIP de la Feria
            t_feria_vip = tickets_evento2.filter(nombre='Entrada VIP').first()
            if t_feria_vip:
                Compra.objects.create(usuario=comp1, tipo_ticket=t_feria_vip,
                                     cantidad=2, precio_unitario=t_feria_vip.precio,
                                     total=t_feria_vip.precio * 2)
                compras_creadas += 1

        if compras_creadas > 0:
            self.stdout.write(self.style.SUCCESS(f'✅ {compras_creadas} compras simuladas creadas'))
        else:
            self.stdout.write('⚠️  Las compras ya existían')

        # =============================================
        # RESUMEN FINAL
        # =============================================
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(self.style.SUCCESS('🎉 DATOS DE PRUEBA CARGADOS EXITOSAMENTE'))
        self.stdout.write('=' * 50)
        self.stdout.write(f'👤 Usuarios: {User.objects.count()}')
        self.stdout.write(f'🎪 Eventos: {Evento.objects.count()}')
        self.stdout.write(f'🎫 Tipos de Ticket: {TipoTicket.objects.count()}')
        self.stdout.write(f'🛒 Compras: {Compra.objects.count()}')
        self.stdout.write('\n📌 Credenciales de acceso:')
        self.stdout.write('   Admin:       admin / admin123')
        self.stdout.write('   Organizador: organizador / org123')
        self.stdout.write('   Comprador 1: comprador1 / comp123')
        self.stdout.write('   Comprador 2: comprador2 / comp123')
        self.stdout.write('')
