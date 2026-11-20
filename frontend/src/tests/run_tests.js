// ========================================================
// SUITE DE PRUEBAS AUTOMATIZADAS (run_tests.js)
// Ejecución de pruebas unitarias y de integración para frontend:
// Validaciones de Bolivia (CI, Celular, Email, Tarjetas, Fechas, Precios)
// y verificación de integridad de datos y formato monetario en Bs.
// ========================================================

import {
  validarEmail,
  validarTelefono,
  validarCI,
  validarNombre,
  validarUsername,
  validarPassword,
  validarFechaEvento,
  validarPrecio,
  validarCupo,
  validarTarjeta
} from '../utils/validators.js';

import { formatBs } from '../utils/formatters.js';
import { EVENTOS_INICIALES, COMPRAS_INICIALES } from '../data/mockData.js';
import { ESTADIOS_BOLIVIA } from '../data/estadios.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condicion, descripcion) {
  totalTests++;
  if (condicion) {
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m [PASS] ${descripcion}`);
  } else {
    failedTests++;
    console.error(`  \x1b[31m✖\x1b[0m [FAIL] ${descripcion}`);
  }
}

function seccion(titulo) {
  console.log(`\n\x1b[36m====================================================\x1b[0m`);
  console.log(`\x1b[1m\x1b[33m▶ ${titulo}\x1b[0m`);
  console.log(`\x1b[36m====================================================\x1b[0m`);
}

// --------------------------------------------------------
// 1. PRUEBAS DE VALIDACIÓN DE CARNET DE IDENTIDAD (C.I.)
// --------------------------------------------------------
seccion('1. Pruebas de Carnet de Identidad (C.I. Bolivia)');

assert(validarCI('8492012').valido === true, 'CI numérico estándar (8492012) debe ser válido');
assert(validarCI('7381920-1B').valido === true, 'CI con complemento alfanumérico (7381920-1B) debe ser válido');
assert(validarCI('6120492 LP').valido === true, 'CI con departamento (6120492 LP) debe ser válido');
assert(validarCI('10293845').valido === true, 'CI de 8 dígitos debe ser válido');
assert(validarCI('').valido === false, 'CI vacío debe ser rechazado');
assert(validarCI('abc').valido === false, 'CI con solo letras debe ser rechazado');
assert(validarCI('123').valido === false, 'CI con menos de 5 dígitos debe ser rechazado');

// --------------------------------------------------------
// 2. PRUEBAS DE CELULARES DE BOLIVIA (+591, 6 o 7)
// --------------------------------------------------------
seccion('2. Pruebas de Celulares de Bolivia (Entel / Tigo / Viva)');

assert(validarTelefono('71234567').valido === true, 'Celular que inicia con 7 (71234567) es válido');
assert(validarTelefono('60123456').valido === true, 'Celular que inicia con 6 (60123456) es válido');
assert(validarTelefono('+591 71234567').valido === true, 'Celular con código de país (+591 71234567) es válido');
assert(validarTelefono('59169876543').valido === true, 'Celular con 591 sin signo + es válido');
assert(validarTelefono('22441234').valido === false, 'Número fijo (inicia con 2) no debe ser aceptado como celular');
assert(validarTelefono('712345').valido === false, 'Número con menos de 8 dígitos debe ser rechazado');
assert(validarTelefono('91234567').valido === false, 'Número que inicia con 9 no existe en Bolivia y se rechaza');

// --------------------------------------------------------
// 3. PRUEBAS DE CORREO ELECTRÓNICO
// --------------------------------------------------------
seccion('3. Pruebas de Correo Electrónico');

assert(validarEmail('comprador@ticketera.local').valido === true, 'Correo corporativo local es válido');
assert(validarEmail('dana.gutierrez@gmail.com').valido === true, 'Correo Gmail estándar es válido');
assert(validarEmail('sin_arroba.com').valido === false, 'Correo sin arroba es rechazado');
assert(validarEmail('usuario@').valido === false, 'Correo incompleto es rechazado');
assert(validarEmail('').valido === false, 'Correo vacío es rechazado');

// --------------------------------------------------------
// 4. PRUEBAS DE NOMBRES Y USUARIOS
// --------------------------------------------------------
seccion('4. Pruebas de Nombres y Usuarios');

assert(validarNombre('Carlos Mendoza').valido === true, 'Nombre válido');
assert(validarNombre('Dana Wendy Gutierrez Zotes').valido === true, 'Nombre completo de integrante de equipo es válido');
assert(validarNombre('Al').valido === false, 'Nombre muy corto (<3 letras) es rechazado');
assert(validarUsername('organizador').valido === true, 'Usuario alfanumérico es válido');
assert(validarUsername('a').valido === false, 'Usuario de 1 letra es rechazado');
assert(validarPassword('123', '123').valido === true, 'Contraseñas coincidentes válidas');
assert(validarPassword('123', '456').valido === false, 'Contraseñas dispares son rechazadas');

// --------------------------------------------------------
// 5. PRUEBAS DE FECHAS, PRECIOS Y CUPOS DE CONCIERTOS
// --------------------------------------------------------
seccion('5. Pruebas de Reglas de Negocio (Fechas, Precios en Bs y Cupos)');

assert(validarFechaEvento('2026-12-25', '19:00').valido === true, 'Fecha futura 2026-12-25 es válida');
assert(validarFechaEvento('2020-01-01', '19:00').valido === false, 'Fecha pasada 2020 es rechazada');
assert(validarPrecio(150, 10, 5000).valido === true, 'Precio Bs. 150 es válido');
assert(validarPrecio(5, 10, 5000).valido === false, 'Precio inferior al mínimo es rechazado');
assert(validarPrecio(-20).valido === false, 'Precio negativo es rechazado');
assert(validarCupo(500, 20000).valido === true, 'Cupo 500 es válido');
assert(validarCupo(0).valido === false, 'Cupo cero es rechazado');
assert(validarCupo(150000, 100000).valido === false, 'Cupo que supera el aforo es rechazado');

// --------------------------------------------------------
// 6. PRUEBAS DE PASARELA Y TARJETA SIMULADA
// --------------------------------------------------------
seccion('6. Pruebas de Tarjetas (Pasarela Red Enlace Bolivia)');

assert(validarTarjeta({
  titular: 'Valeria Rojas',
  numero: '4500123456789012',
  expiracion: '12/29',
  cvv: '789'
}).valido === true, 'Tarjeta con datos correctos es válida');

assert(validarTarjeta({
  titular: 'Valeria Rojas',
  numero: '1234',
  expiracion: '12/29',
  cvv: '789'
}).valido === false, 'Tarjeta con número corto es rechazada');

assert(validarTarjeta({
  titular: 'Valeria Rojas',
  numero: '4500123456789012',
  expiracion: '01/20',
  cvv: '789'
}).valido === false, 'Tarjeta vencida es rechazada');

assert(validarTarjeta({
  titular: 'Valeria Rojas',
  numero: '4500123456789012',
  expiracion: '12/29',
  cvv: '1'
}).valido === false, 'CVV con menos de 3 dígitos es rechazado');

// --------------------------------------------------------
// 7. PRUEBAS DE FORMATEADORES EN BOLIVIANOS (Bs)
// --------------------------------------------------------
seccion('7. Pruebas de Formato de Moneda Oficial Boliviana');

const formato100 = formatBs(100);
assert(formato100.includes('Bs') && formato100.includes('100'), `formatBs(100) contiene "Bs" y "100" -> "${formato100}"`);

const formatoZero = formatBs(0);
assert(formatoZero.includes('Bs'), `formatBs(0) formatea correctamente -> "${formatoZero}"`);

// --------------------------------------------------------
// 8. PRUEBAS DE INTEGRIDAD DE DATOS (MOCKDATA & ESTADIOS)
// --------------------------------------------------------
seccion('8. Pruebas de Integridad de Datos de Bolivia');

assert(EVENTOS_INICIALES.length >= 20, `El sistema contiene ${EVENTOS_INICIALES.length} eventos iniciales (mínimo 20)`);
assert(ESTADIOS_BOLIVIA.length >= 23, `El catálogo nacional cubre ${ESTADIOS_BOLIVIA.length} recintos de Bolivia`);
assert(COMPRAS_INICIALES.length >= 4, `Existen ${COMPRAS_INICIALES.length} compras de prueba iniciales`);

// Verificar que Tupiza esté debidamente representado
const eventoTupiza = EVENTOS_INICIALES.find(e => e.ciudad === 'Tupiza' || e.nombre.includes('Tupiza'));
assert(Boolean(eventoTupiza), 'Existe el concierto/festival representativo de Tupiza en cartelera');

// Verificar que cada evento tenga sectores configurados con precios y puertas
const todosConSectores = EVENTOS_INICIALES.every(e => Array.isArray(e.sectores_geograficos) && e.sectores_geograficos.length > 0);
assert(todosConSectores, 'Todos los eventos tienen sectores geográficos configurados con puertas');

// --------------------------------------------------------
// RESUMEN FINAL
// --------------------------------------------------------
console.log(`\n\x1b[36m====================================================\x1b[0m`);
console.log(`\x1b[1mRESUMEN DE PRUEBAS:\x1b[0m`);
console.log(`Total Pruebas: ${totalTests}`);
console.log(`\x1b[32mExitosas:     ${passedTests}\x1b[0m`);
console.log(`\x1b[31mFallidas:     ${failedTests}\x1b[0m`);
console.log(`\x1b[36m====================================================\x1b[0m`);

if (failedTests > 0) {
  console.error('\x1b[31m❌ Algunas pruebas fallaron.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32m✔ ¡Todas las pruebas pasaron satisfactoriamente al 100%!\x1b[0m\n');
  process.exit(0);
}
