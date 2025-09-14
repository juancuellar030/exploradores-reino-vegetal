// --- ESTADO DEL JUGADOR ---
// Este objeto guardará todo el progreso.
// Usaremos Local Storage para que no se borre al recargar la página.
let jugador = {
    nombre: "Explorador Novato",
    pe: 0,
    nivel: 1,
    insignias: [],
    progresoGeneral: 0 // en porcentaje
};

// --- CONSTANTES DE CONFIGURACIÓN DEL JUEGO ---
const PE_POR_DESAFIO = 50;
const PE_PARA_NIVEL_2 = 50;
const PROGRESO_TOTAL = 4; // 4 biomas en total para el 100%

// --- LÓGICA DEL JUEGO ---

// Función para añadir Puntos de Experiencia (PE)
function ganarPE(cantidad) {
    jugador.pe += cantidad;
    console.log(`Has ganado ${cantidad} PE. Total: ${jugador.pe}`);
    
    // Cada vez que ganas puntos, actualizamos el progreso y comprobamos si se desbloquea algo
    actualizarProgreso();
    verificarDesbloqueos();
    guardarProgreso(); // Guardamos en Local Storage
    actualizarUI();   // Actualizamos la pantalla
}

// Función para añadir una insignia
function ganarInsignia(nombreInsignia) {
    if (!jugador.insignias.includes(nombreInsignia)) {
        jugador.insignias.push(nombreInsignia);
        console.log(`¡Insignia obtenida: ${nombreInsignia}!`);
    }
}

function actualizarProgreso() {
    // Suponiendo que cada bioma completado es un paso en el progreso
    const biomasCompletados = jugador.insignias.length;
    jugador.progresoGeneral = (biomasCompletados / PROGRESO_TOTAL) * 100;
}

// Función para comprobar si se desbloquean nuevos niveles o biomas
function verificarDesbloqueos() {
    if (jugador.pe >= PE_PARA_NIVEL_2) {
        const biomaCrecimiento = document.getElementById('bioma-crecimiento');
        if (biomaCrecimiento.classList.contains('bloqueado')) {
            biomaCrecimiento.classList.remove('bloqueado');
            biomaCrecimiento.innerHTML = `
                <h4>Nivel 2: El Bioma del Crecimiento</h4>
                <p>¡Felicidades! Has desbloqueado el siguiente bioma. Nuevos desafíos te esperan.</p>
                <!-- Aquí añadirías el siguiente desafío -->
            `;
        }
    }
}

// Función del desafío 1
function verificarRespuesta(respuesta, esCorrecta) {
    const feedback = document.getElementById('feedback-1');
    const desafioDiv = document.getElementById('desafio-1');

    if (esCorrecta) {
        feedback.textContent = "¡Correcto! Has ganado 50 PE.";
        feedback.style.color = "green";
        ganarPE(PE_POR_DESAFIO);
        ganarInsignia("Semilla Germinada");
        
        // Deshabilitamos los botones para que no se pueda volver a contestar
        desafioDiv.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });
    } else {
        feedback.textContent = "Respuesta incorrecta. ¡Inténtalo de nuevo!";
        feedback.style.color = "red";
    }
}

// --- ACTUALIZACIÓN DE LA INTERFAZ (UI) ---
// Esta función se encarga de que la página web muestre el progreso actual del jugador
function actualizarUI() {
    document.getElementById('nombre-jugador').textContent = jugador.nombre;
    document.getElementById('pe-jugador').textContent = jugador.pe;
    
    // Actualizar barra de progreso
    const barraProgreso = document.getElementById('barra-progreso');
    barraProgreso.style.width = jugador.progresoGeneral + '%';
    barraProgreso.textContent = Math.round(jugador.progresoGeneral) + '%';
    
    // Actualizar insignias
    const contenedorInsignias = document.getElementById('contenedor-insignias');
    contenedorInsignias.innerHTML = ''; // Limpiamos antes de añadir las nuevas
    
    // Creamos un placeholder para la insignia para que siempre sea visible
    const imgInsignia = document.createElement('img');
    imgInsignia.src = 'https://i.imgur.com/2s36F6s.png'; // URL de una imagen de insignia de semilla
    imgInsignia.alt = 'Insignia Semilla Germinada';
    imgInsignia.classList.add('insignia');
    
    if (jugador.insignias.includes('Semilla Germinada')) {
        imgInsignia.classList.add('obtenida');
    }
    contenedorInsignias.appendChild(imgInsignia);
}

// --- GESTIÓN DE DATOS (LOCAL STORAGE) ---

// Función para guardar el progreso en el navegador
function guardarProgreso() {
    localStorage.setItem('progresoExplorador', JSON.stringify(jugador));
}

// Función para cargar el progreso guardado
function cargarProgreso() {
    const progresoGuardado = localStorage.getItem('progresoExplorador');
    if (progresoGuardado) {
        jugador = JSON.parse(progresoGuardado);
        console.log("Progreso cargado:", jugador);
    } else {
        // Si no hay progreso guardado, pedimos un nombre al jugador
        jugador.nombre = prompt("¡Bienvenido, Explorador! Por favor, introduce tu nombre:", "Explorador Novato") || "Explorador Novato";
    }
}

// --- INICIO DEL JUEGO ---
// Esto se ejecuta en cuanto la página se carga
window.onload = function() {
    cargarProgreso();
    verificarDesbloqueos(); // Comprobamos por si ya tenía suficiente PE de antes
    actualizarUI();
};
