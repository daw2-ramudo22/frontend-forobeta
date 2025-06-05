//Este archivo js es el princpial de todos y es el que muestra toda la info recogida en otros componentes
import { auth } from './auth.js';
import { cargarHilos } from './hilos.js';


// Esto es lo que estaba en el document.addEventListener('DOMContentLoaded')
document.addEventListener('DOMContentLoaded', function() {
  setupThemeToggle(); // Configura el listener del botón de tema

  // Verificar sesión y mostrar saludo
  auth.verificarSesion();

  // Cargar hilos
  cargarHilos();
});

// Opcional: Recargar hilos cada 30 segundos
setInterval(cargarHilos, 30000);
