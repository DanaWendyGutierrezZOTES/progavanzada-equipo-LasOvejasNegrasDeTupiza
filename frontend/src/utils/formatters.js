// ========================================================
// UTILIDADES: FORMATTERS (Formateadores compartidos)
// Evita código duplicado en precios, monedas y fechas
// ========================================================

/**
 * Formatea un número como moneda oficial en Bolivianos (Bs.)
 * Ejemplo: 150 -> "Bs. 150"
 */
export function formatBs(valor) {
  return `Bs. ${Number(valor || 0).toLocaleString('es-ES')}`;
}

/**
 * Formatea una fecha ISO/String a formato legible en español
 * Ejemplo: "2026-11-15" -> "15 nov 2026"
 */
export function formatDate(fechaStr) {
  if (!fechaStr) return '';
  try {
    const fecha = new Date(fechaStr + (fechaStr.includes('T') ? '' : 'T00:00:00'));
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return fechaStr;
  }
}

/**
 * Extrae día numérico y mes en mayúsculas para las tarjetas de concierto
 * Ejemplo: "2026-11-15" -> { dia: 15, mes: "NOV" }
 */
export function formatCalendarBadge(fechaStr) {
  if (!fechaStr) return { dia: '15', mes: 'NOV' };
  try {
    const fecha = new Date(fechaStr + (fechaStr.includes('T') ? '' : 'T00:00:00'));
    return {
      dia: fecha.getDate(),
      mes: fecha.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', '')
    };
  } catch {
    return { dia: '15', mes: 'NOV' };
  }
}
