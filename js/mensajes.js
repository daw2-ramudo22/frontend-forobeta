const API_URL = 'https://backend-forobeta.onrender.com';

// Función global para enviar un mensaje
window.enviarMensaje = async function () {
  const token = localStorage.getItem('token');
  const texto = document.getElementById('mensaje-input').value;
  const params = new URLSearchParams(window.location.search);
  const hiloId = params.get('id');

  if (!texto.trim()) {
    alert("El mensaje no puede estar vacío.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/mensajes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ texto, hilo: hiloId })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al enviar mensaje');
    }

    document.getElementById('mensaje-input').value = '';
    await cargarMensajes(hiloId);
  } catch (error) {
    console.error("Error al enviar:", error);
    alert("Debe de crear una cuenta o iniciar sesion para enviar mensajes.");
  }
};

// Función para cargar los mensajes de un hilo
async function cargarMensajes(hiloId) {
  try {
    const res = await fetch(`${API_URL}/mensajes/hilo/${hiloId}`);
    const mensajes = await res.json();
    const contenedor = document.getElementById('mensajes');
    contenedor.innerHTML = '';

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (mensajes.length === 0) {
      contenedor.innerHTML = '<div class="no-hilos">Este hilo no tiene mensajes aún.</div>';
      return;
    }

    mensajes.forEach(mensaje => {
      const esPropio = mensaje.autor?._id === usuario?.id;

      const div = document.createElement('div');
      div.classList.add('mensaje');
      div.innerHTML = `
        <p>${mensaje.texto}</p>
        <small>Por: ${mensaje.autor?.nombre || 'Usuario'} | ${new Date(mensaje.fecha).toLocaleString('es-ES')}</small>
        ${esPropio ? `
          <button class="btn-editar" onclick="editarMensaje('${mensaje._id}', '${mensaje.texto.replace(/'/g, "\\'")}')">Editar</button>
          <button class="btn-editar" onclick="eliminarMensaje('${mensaje._id}')">Eliminar</button>
        ` : ''}
      `;
      contenedor.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
  }
}

// Función para editar mensaje
window.editarMensaje = async function (id, textoActual) {
  const nuevoTexto = prompt("Editar tu mensaje:", textoActual);
  if (!nuevoTexto || nuevoTexto.trim() === '') return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_URL}/mensajes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ texto: nuevoTexto })
    });

    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      await cargarMensajes(params.get('id'));
    } else {
      alert("No se pudo editar el mensaje");
    }
  } catch (err) {
    console.error("Error al editar mensaje:", err);
  }
};

// Función para eliminar mensaje
window.eliminarMensaje = async function (id) {
  if (!confirm("¿Seguro que quieres eliminar este mensaje?")) return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_URL}/mensajes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      await cargarMensajes(params.get('id'));
    } else {
      alert("No se pudo eliminar el mensaje");
    }
  } catch (err) {
    console.error("Error al eliminar mensaje:", err);
  }
};

// Cargar mensajes al iniciar
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const hiloId = params.get('id');
  cargarMensajes(hiloId);
});

async function cargarTituloHilo(hiloId) {
  try {
    const res = await fetch(`${API_URL}/hilos/${hiloId}`);
    if (!res.ok) throw new Error("No se encontró el hilo");

    const hilo = await res.json();
    document.getElementById('titulo-hilo').textContent = hilo.titulo || "Hilo sin título";

  } catch (err) {
    console.error("Error al cargar título del hilo:", err);
    document.getElementById('titulo-hilo').textContent = "Hilo no encontrado";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const hiloId = params.get('id');

  cargarTituloHilo(hiloId);   // 👈 carga el título
  cargarMensajes(hiloId);     // 👈 carga los mensajes
});


