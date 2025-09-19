// --- ESTADO INICIAL DEL JUEGO ---
let estadoJuego = {
    saludEcosistema: 100,
    puntosAccion: 10,
    rondaActual: 1,
    rondasTotales: 10
};

// --- BASE DE DATOS DE EVENTOS ---
const eventos = [
    {
        titulo: "¡Propuesta de Tala!",
        descripcion: "Una compañía maderera ofrece pagar bien por talar una pequeña sección del bosque. Aportará recursos, pero dañará el ecosistema.",
        opciones: [
            { texto: "Aceptar (+5 Puntos, -15 Salud)", consecuencias: { salud: -15, puntos: 5 } },
            { texto: "Rechazar (-2 Puntos, +5 Salud)", consecuencias: { salud: 5, puntos: -2 } }
        ]
    },
    {
        titulo: "Sequía Inesperada",
        descripcion: "Una ola de calor amenaza con secar el río. Debes usar Puntos de Acción para implementar un sistema de riego de emergencia.",
        opciones: [
            { texto: "Invertir en riego (-5 Puntos, +10 Salud)", consecuencias: { salud: 10, puntos: -5 } },
            { texto: "Arriesgarse y no hacer nada (+0 Puntos, -20 Salud)", consecuencias: { salud: -20, puntos: 0 } }
        ]
    },
    // Añade más eventos aquí...
];

// --- FUNCIONES PRINCIPALES DEL JUEGO ---

// Se ejecuta cuando la página carga
window.onload = function() {
    iniciarJuego();
};

function iniciarJuego() {
    actualizarHUD();
    mostrarSiguienteEvento();
}

// Muestra un nuevo evento al azar
function mostrarSiguienteEvento() {
    const eventoModal = document.getElementById('evento-modal');
    // Elige un evento al azar de la lista
    const evento = eventos[Math.floor(Math.random() * eventos.length)];

    // Rellena el modal con la información del evento
    document.getElementById('evento-titulo').textContent = evento.titulo;
    document.getElementById('evento-descripcion').textContent = evento.descripcion;
    
    const opcionesContainer = document.getElementById('evento-opciones');
    opcionesContainer.innerHTML = ''; // Limpia las opciones anteriores

    // Crea los botones para cada opción
    evento.opciones.forEach(opcion => {
        const boton = document.createElement('button');
        boton.className = 'cta-button';
        boton.textContent = opcion.texto;
        boton.onclick = () => tomarDecision(opcion.consecuencias);
        opcionesContainer.appendChild(boton);
    });

    eventoModal.style.display = 'flex'; // Muestra el modal
}

// Se ejecuta cuando el equipo hace clic en una decisión
function tomarDecision(consecuencias) {
    // Aplica las consecuencias al estado del juego
    estadoJuego.saludEcosistema += consecuencias.salud;
    estadoJuego.puntosAccion += consecuencias.puntos;

    // Asegúrate de que la salud no pase de 100 ni baje de 0
    if (estadoJuego.saludEcosistema > 100) estadoJuego.saludEcosistema = 100;
    if (estadoJuego.saludEcosistema < 0) estadoJuego.saludEcosistema = 0;
    
    estadoJuego.rondaActual++;
    
    actualizarHUD();
    
    const eventoModal = document.getElementById('evento-modal');
    eventoModal.style.display = 'none'; // Oculta el modal

    // Comprueba si el juego ha terminado
    if (estadoJuego.rondaActual > estadoJuego.rondasTotales || estadoJuego.saludEcosistema <= 0) {
        terminarJuego();
    } else {
        // Muestra el siguiente evento después de un breve retraso
        setTimeout(mostrarSiguienteEvento, 1000);
    }
}

// Actualiza la interfaz de usuario con el estado actual
function actualizarHUD() {
    document.getElementById('barra-salud').style.width = `${estadoJuego.saludEcosistema}%`;
    document.getElementById('barra-salud').textContent = `${estadoJuego.saludEcosistema}%`;
    document.getElementById('puntos-accion').textContent = estadoJuego.puntosAccion;
    document.getElementById('numero-ronda').textContent = `${estadoJuego.rondaActual} / ${estadoJuego.rondasTotales}`;
}

function terminarJuego() {
    let mensajeFinal = "";
    if (estadoJuego.saludEcosistema > 0) {
        mensajeFinal = `¡Felicidades, Guardabosques! Han mantenido el equilibrio del bosque durante ${estadoJuego.rondasTotales} temporadas. ¡Misión cumplida!`;
    } else {
        mensajeFinal = "El ecosistema ha colapsado. Aunque no lo lograron esta vez, han aprendido valiosas lecciones sobre la gestión ambiental. ¡Intenten de nuevo!";
    }
    // Muestra un simple alert, o puedes crear un modal más elegante para el final
    alert(mensajeFinal);
    // Podrías añadir un botón para reiniciar el juego
}
