// En este archivo js controlamos la autenticacion del usuario, mostrando un saludo y botones según el estado de la sesión.
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('token');
    this.usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  }

  verificarSesion() {
    if (this.token && this.usuario) {
      this.mostrarSaludo();
      this.mostrarBotonesLogueado();
      return true;
    } else {
      this.mostrarBotonesNoLogueado();
      return false;
    }
  }

  mostrarSaludo() {
  if (this.usuario && this.usuario.nombre) {
    const saludoElement = document.getElementById('saludo-usuario');
    const hora = new Date().getHours();
    let saludo = '¡Buenas';

    if (hora >= 6 && hora < 12) {
      saludo = '¡Buenos días';
    } else if (hora >= 12 && hora < 18) {
      saludo = '¡Buenas tardes';
    } else {
      saludo = '¡Buenas noches';
    }

    saludoElement.innerHTML = `${saludo} ${this.usuario.nombre}! 👋✨`;
    saludoElement.style.display = 'block';
    saludoElement.style.cursor = 'pointer'; // opcional visual

    //Redirigir al perfil del usuario para poder ver sus datos y editar o eliminar su perfil
    saludoElement.onclick = () => {
      window.location.href = 'perfil.html';
    };

    setTimeout(() => {
      saludoElement.style.transform = 'scale(1.05)';
      setTimeout(() => {
        saludoElement.style.transform = 'scale(1)';
      }, 200);
    }, 300);
  }
}


  mostrarBotonesLogueado() {
    document.getElementById('accionesLogueado').style.display = 'block';
    document.getElementById('accionesNoLogueado').style.display = 'none';
  }

  mostrarBotonesNoLogueado() {
    document.getElementById('accionesLogueado').style.display = 'none';
    document.getElementById('accionesNoLogueado').style.display = 'block';
  }

  cerrarSesion() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      this.token = null;
      this.usuario = null;

      const saludoElement = document.getElementById('saludo-usuario');
      saludoElement.style.animation = 'slideOut 0.3s ease-in';

      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  }
}

// Exporta la instancia para que otros scripts puedan usarla
export const auth = new AuthManager();

// Hace la función cerrarSesion global para el onclick en el HTML
window.cerrarSesion = () => auth.cerrarSesion();