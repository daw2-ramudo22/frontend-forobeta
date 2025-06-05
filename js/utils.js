// Este js sirve para formatear fechas en un formato legible para el usuario.
export function formatearFecha(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
