from datetime import date, time, timedelta
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Evento, TipoTicket, Compra, PerfilUsuario


class TicketeraFlujoCompletoTests(TestCase):
    def setUp(self):
        self.client = Client()

        # 1. Crear usuario organizador
        self.organizador = User.objects.create_user(
            username='org_test',
            email='org@test.com',
            password='password123'
        )
        self.organizador.perfil.rol = 'organizador'
        self.organizador.perfil.save()

        # 2. Crear usuario comprador
        self.comprador = User.objects.create_user(
            username='buyer_test',
            email='buyer@test.com',
            password='password123'
        )
        self.comprador.perfil.rol = 'comprador'
        self.comprador.perfil.save()

        # 3. Crear evento de prueba
        self.evento = Evento.objects.create(
            nombre='Concierto Test 2026',
            descripcion='Descripcion de prueba para el evento',
            fecha=date.today() + timedelta(days=10),
            hora=time(20, 0),
            lugar='Teatro Caupolican',
            precio_base=15000.00,
            organizador=self.organizador,
            cupo_total=100
        )

        # 4. Crear tipos de tickets
        self.ticket_general = TipoTicket.objects.create(
            evento=self.evento,
            nombre='General',
            precio=15000.00,
            cantidad_total=50,
            cantidad_disponible=50
        )
        self.ticket_vip = TipoTicket.objects.create(
            evento=self.evento,
            nombre='VIP',
            precio=35000.00,
            cantidad_total=20,
            cantidad_disponible=20
        )

    def test_listado_publico_eventos(self):
        """Verifica que el listado público muestra el evento y responde HTTP 200"""
        response = self.client.get(reverse('lista_eventos'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Concierto Test 2026')
        self.assertContains(response, 'Teatro Caupolican')

    def test_busqueda_y_filtro_eventos(self):
        """Verifica que el filtro de búsqueda por nombre funciona"""
        response = self.client.get(reverse('lista_eventos'), {'q': 'Caupolican'})
        self.assertContains(response, 'Concierto Test 2026')

        response_vacio = self.client.get(reverse('lista_eventos'), {'q': 'NoExiste12345'})
        self.assertNotContains(response_vacio, 'Concierto Test 2026')

    def test_detalle_evento_muestra_tipos_ticket(self):
        """Verifica que la página de detalle muestra la información del evento y sus entradas"""
        response = self.client.get(reverse('detalle_evento', args=[self.evento.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Concierto Test 2026')
        self.assertContains(response, 'General')
        self.assertContains(response, 'VIP')

    def test_comprador_no_puede_crear_evento(self):
        """Verifica que un usuario comprador no puede acceder a la creación de eventos"""
        self.client.login(username='buyer_test', password='password123')
        response = self.client.get(reverse('crear_evento'), follow=True)
        # Debe redirigir a lista_eventos con mensaje de advertencia
        self.assertRedirects(response, reverse('lista_eventos'))
        self.assertContains(response, 'Acceso restringido')

    def test_organizador_puede_crear_evento(self):
        """Verifica que el organizador sí puede crear un evento nuevo"""
        self.client.login(username='org_test', password='password123')
        data = {
            'nombre': 'Festival Indie Primavera',
            'descripcion': 'Festival con bandas emergentes',
            'fecha': (date.today() + timedelta(days=25)).isoformat(),
            'hora': '18:00',
            'lugar': 'Parque Forestal',
            'precio_base': '12000.00',
            'cupo_total': 300,
            'nombre_ticket': 'General Preventa',
            'precio_ticket': '12000.00',
            'cupo_ticket': '200'
        }
        response = self.client.post(reverse('crear_evento'), data=data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Evento.objects.filter(nombre='Festival Indie Primavera').exists())

    def test_flujo_compra_simulada(self):
        """Verifica el flujo completo de compra: descuento de stock y generación de código"""
        self.client.login(username='buyer_test', password='password123')

        stock_inicial = self.ticket_vip.cantidad_disponible
        cantidad_a_comprar = 2

        response = self.client.post(
            reverse('comprar_ticket', args=[self.ticket_vip.pk]),
            data={'cantidad': cantidad_a_comprar},
            follow=True
        )

        self.assertEqual(response.status_code, 200)
        
        # Verificar que el stock se descontó correctamente
        self.ticket_vip.refresh_from_db()
        self.assertEqual(self.ticket_vip.cantidad_disponible, stock_inicial - cantidad_a_comprar)

        # Verificar que se creó el objeto Compra
        compra = Compra.objects.filter(usuario=self.comprador, tipo_ticket=self.ticket_vip).first()
        self.assertIsNotNone(compra)
        self.assertEqual(compra.cantidad, 2)
        self.assertEqual(compra.total, 35000.00 * 2)
        self.assertTrue(compra.codigo_ticket.startswith('TKT-'))

        # Verificar que la compra aparece en 'mis tickets'
        response_mis_tickets = self.client.get(reverse('mis_tickets'))
        self.assertContains(response_mis_tickets, compra.codigo_ticket)

    def test_panel_organizador_estadisticas(self):
        """Verifica que el panel del organizador muestra las métricas y ventas del evento"""
        # Registrar una compra previa
        Compra.objects.create(
            usuario=self.comprador,
            tipo_ticket=self.ticket_general,
            cantidad=3,
            precio_unitario=15000.00,
            total=45000.00
        )

        self.client.login(username='org_test', password='password123')
        response = self.client.get(reverse('panel_organizador'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Concierto Test 2026')
        # Verificar que aparecen tickets vendidos
        self.assertContains(response, '3')
