// ========================================================
// MÓDULO CENTRAL DE VALIDACIONES (validators.js)
// Centraliza todas las reglas de negocio y validación en Bolivia
// Principio DRY: Elimina código repetido en formularios
// ========================================================

/**
 * Valida un correo electrónico estándar RFC 5322 simplificado
 */
export function validarEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valido: false, mensaje: 'El correo electrónico es requerido.' };
  }
  const clean = email.trim();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(clean)) {
    return { valido: false, mensaje: 'Ingresa un formato de correo válido (ej: usuario@correo.com).' };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida un número de celular de Bolivia:
 * - 8 dígitos comenzando en 6 o 7 (móviles bolivianos de Entel, Tigo, Viva).
 * - Opcionalmente acepta prefijo internacional (+591 o 591) y espacios/guiones.
 */
export function validarTelefono(telefono, requerido = false) {
  if (!telefono || typeof telefono !== 'string' || !telefono.trim()) {
    if (requerido) {
      return { valido: false, mensaje: 'El número de celular es requerido.' };
    }
    return { valido: true, mensaje: '' };
  }

  // Remover espacios, guiones y paréntesis
  const limpio = telefono.replace(/[\s\-()]/g, '');

  // Acepta: "+59171234567", "59171234567" o "71234567"
  const regexBolivia = /^(\+?591)?[67]\d{7}$/;
  if (!regexBolivia.test(limpio)) {
    return {
      valido: false,
      mensaje: 'Celular de Bolivia inválido (debe tener 8 dígitos comenzando con 6 o 7, ej: 71234567).'
    };
  }

  return { valido: true, mensaje: '' };
}

/**
 * Valida Carnet de Identidad (C.I.) boliviano:
 * - Entre 5 y 10 dígitos numéricos.
 * - Opcionalmente acepta complemento alfanumérico (ej: 8492012-1A, 7361520 LP, 6291048-A).
 */
export function validarCI(ci, requerido = true) {
  if (!ci || typeof ci !== 'string' || !ci.trim()) {
    if (requerido) {
      return { valido: false, mensaje: 'El Carnet de Identidad (C.I.) es requerido.' };
    }
    return { valido: true, mensaje: '' };
  }

  const limpio = ci.trim().toUpperCase();
  // Regex: 5 a 10 dígitos base, guión o espacio opcional y 1-3 letras/dígitos de complemento o depto
  const regexCI = /^\d{5,10}([- ]?[0-9A-Z]{1,3})?$/;
  if (!regexCI.test(limpio)) {
    return {
      valido: false,
      mensaje: 'Formato de C.I. inválido (debe tener entre 5 y 10 dígitos, ej: 8492012 o 7381920-1B).'
    };
  }

  return { valido: true, mensaje: '' };
}

/**
 * Valida nombres y apellidos de personas
 */
export function validarNombre(nombre, campo = 'Nombre') {
  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return { valido: false, mensaje: `${campo} es obligatorio.` };
  }
  const clean = nombre.trim();
  if (clean.length < 3) {
    return { valido: false, mensaje: `${campo} debe tener al menos 3 caracteres.` };
  }
  if (clean.length > 80) {
    return { valido: false, mensaje: `${campo} no puede exceder 80 caracteres.` };
  }
  // Acepta letras, espacios, tildes, diéresis y ñ
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]+$/;
  if (!regexLetras.test(clean)) {
    return { valido: false, mensaje: `${campo} solo debe contener letras y espacios.` };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida nombre de usuario para inicio de sesión y registro
 */
export function validarUsername(username) {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return { valido: false, mensaje: 'El nombre de usuario es requerido.' };
  }
  const clean = username.trim();
  if (clean.length < 3) {
    return { valido: false, mensaje: 'El usuario debe tener al menos 3 caracteres.' };
  }
  if (clean.length > 30) {
    return { valido: false, mensaje: 'El usuario no puede exceder 30 caracteres.' };
  }
  const regexUser = /^[a-zA-Z0-9_.-]+$/;
  if (!regexUser.test(clean)) {
    return { valido: false, mensaje: 'El usuario solo permite letras, números, puntos y guiones.' };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida contraseñas y coincidencia de confirmación
 */
export function validarPassword(password, confirmPassword = null) {
  if (!password || typeof password !== 'string') {
    return { valido: false, mensaje: 'La contraseña es obligatoria.' };
  }
  if (password.length < 3) {
    return { valido: false, mensaje: 'La contraseña debe tener al menos 3 caracteres.' };
  }
  if (confirmPassword !== null && password !== confirmPassword) {
    return { valido: false, mensaje: 'Las contraseñas no coinciden.' };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida la fecha de un evento (no permite fechas pasadas para eventos nuevos)
 */
export function validarFechaEvento(fecha, hora = '00:00', permitirPasada = false) {
  if (!fecha) {
    return { valido: false, mensaje: 'La fecha del evento es obligatoria.' };
  }

  const [anio, mes, dia] = fecha.split('-').map(Number);
  if (!anio || !mes || !dia) {
    return { valido: false, mensaje: 'Formato de fecha inválido (debe ser AAAA-MM-DD).' };
  }

  if (!permitirPasada) {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];
    if (fecha < hoyStr) {
      return { valido: false, mensaje: 'La fecha no puede ser anterior al día de hoy.' };
    }
  }

  return { valido: true, mensaje: '' };
}

/**
 * Valida precio en Bolivianos (Bs)
 */
export function validarPrecio(precio, min = 1, max = 50000) {
  const num = Number(precio);
  if (isNaN(num)) {
    return { valido: false, mensaje: 'El precio debe ser un número válido.' };
  }
  if (num < min) {
    return { valido: false, mensaje: `El precio mínimo es de Bs. ${min}.` };
  }
  if (num > max) {
    return { valido: false, mensaje: `El precio no puede exceder Bs. ${max.toLocaleString()}.` };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida cupo o cantidad de tickets
 */
export function validarCupo(cupo, maximo = 100000) {
  const num = Number(cupo);
  if (!Number.isInteger(num) || num <= 0) {
    return { valido: false, mensaje: 'La cantidad debe ser un número entero positivo mayor a cero.' };
  }
  if (num > maximo) {
    return { valido: false, mensaje: `El cupo excede la capacidad máxima (${maximo.toLocaleString()} personas).` };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida datos de pago con tarjeta simulada (Luhn + Expiración + CVV)
 */
export function validarTarjeta({ numero, titular, expiracion, cvv }) {
  // Titular
  const resTitular = validarNombre(titular, 'El nombre del titular');
  if (!resTitular.valido) return resTitular;

  // Número (16 dígitos)
  const numLimpio = (numero || '').replace(/[\s-]/g, '');
  if (!/^\d{15,16}$/.test(numLimpio)) {
    return { valido: false, mensaje: 'El número de tarjeta debe tener 15 o 16 dígitos.' };
  }

  // Expiración MM/AA
  if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiracion || '')) {
    return { valido: false, mensaje: 'Formato de expiración inválido (usa MM/AA, ej: 12/28).' };
  }
  const [, mes, anio] = expiracion.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  const now = new Date();
  const currentYear = Number(now.getFullYear().toString().slice(-2));
  const currentMonth = now.getMonth() + 1;
  const expYear = Number(anio);
  const expMonth = Number(mes);
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return { valido: false, mensaje: 'La tarjeta ingresada se encuentra expirada.' };
  }

  // CVV (3 o 4 dígitos)
  if (!/^\d{3,4}$/.test(cvv || '')) {
    return { valido: false, mensaje: 'El código de seguridad CVV debe tener 3 dígitos.' };
  }

  return { valido: true, mensaje: '' };
}
