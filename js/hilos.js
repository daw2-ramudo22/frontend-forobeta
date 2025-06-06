//En este archivo js controlamos los hilos del foro, mostrando un listado de todos ellos
import { formatearFecha } from './utils.js';
const API_URL = 'https://backend-forobeta.onrender.com';

export async function cargarHilos() {
  try {
    const response = await fetch(`${API_URL}/hilos`);

    if (response.ok) {
      const hilos = await response.json();
      mostrarHilos(hilos);
    } else {
      throw new Error('Error al cargar hilos');
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('hilos-lista').innerHTML =
      '<div class="no-hilos">Error al cargar los hilos. Inténtalo más tarde.</div>';
  }
}

function mostrarHilos(hilos) {
  const container = document.getElementById('hilos-lista');

  if (hilos.length === 0) {
    container.innerHTML = '<div class="no-hilos">No hay hilos creados aún.</div>';
    return;
  }

  const token = localStorage.getItem('token');
  let usuarioId = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      usuarioId = payload.id;
    } catch (e) {
      console.warn("Token inválido");
    }
  }

  let html = '';
  hilos.forEach(hilo => {
    const autorNombre = hilo.owner ? hilo.owner.nombre : (hilo.autor || 'Usuario desconocido');
    let botones = '';
    if (usuarioId && (hilo.owner?._id === usuarioId || hilo.owner === usuarioId)) {
      botones = `
        <button onclick="borrarHilo(event, '${hilo._id}')">🗑️</button>
        <button onclick="editarHilo(event, '${hilo._id}', '${hilo.titulo}', \`${hilo.mensaje_del_hilo || ''}\`)">✏️</button>
      `;
    }

    html += `
      <div class="hilo-item">
        <div class="hilo-titulo" onclick="abrirHilo('${hilo._id}')">${hilo.titulo}</div>
        <div class="hilo-info">
          Por: ${autorNombre} | Creado: ${formatearFecha(hilo.fecha_publicacion)} | Mensajes: ${hilo.cantidadMensajes || 0}
          ${botones}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

window.abrirHilo = (hiloId) => {
  window.location.href = `hilo.html?id=${hiloId}`;
};

//Función para borrar un hilo
window.borrarHilo = async (event, hiloId) => {
  event.stopPropagation();

  if (!confirm('¿Estás seguro de que quieres borrar este hilo?')) return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_URL}/hilos/${hiloId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert('Hilo eliminado correctamente.');
      cargarHilos();
    } else {
      const data = await res.json();
      alert('Error: ' + (data.error || 'No se pudo eliminar el hilo.'));
    }
  } catch (error) {
    console.error('Error al borrar el hilo:', error);
    alert('Error de conexión al intentar borrar el hilo.');
  }
};

//Función para editar un hilo
window.editarHilo = (event, hiloId, tituloActual, mensajeActual) => {
  event.stopPropagation();

  const nuevoTitulo = prompt('Editar título:', tituloActual);
  const nuevoMensaje = prompt('Editar mensaje:', mensajeActual);

  if (!nuevoTitulo || !nuevoMensaje) return;

  const token = localStorage.getItem('token');

  fetch(`${API_URL}/hilos/${hiloId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      titulo: nuevoTitulo,
      mensaje_del_hilo: nuevoMensaje,
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje) {
        alert('Hilo actualizado correctamente.');
        cargarHilos();
      } else {
        alert('Error al actualizar: ' + (data.error || ''));
      }
    })
    .catch(error => {
      console.error('Error al editar el hilo:', error);
      alert('Error al actualizar el hilo.');
    });
};
