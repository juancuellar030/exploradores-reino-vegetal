// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');

// --- INITIAL GAME STATE ---
let estadoJuego = {
    saludEcosistema: 100,
    puntosAccion: 10,
    rondaActual: 1,
    rondasTotales: 10,
    gameStarted: false
};

// --- EVENT DATABASE (FULLY COMPLETED) ---
const eventos = {
    urban: {
        titulo: "¡Expansión Urbana!",
        descripcion: "Una constructora quiere construir casas nuevas junto al bosque. Ofrecen dinero, pero destruirán parte del hábitat.",
        opciones: [
            { texto: "Negociar un límite (-2 Puntos, +5 Salud)", consecuencias: { salud: 5, puntos: -2 } },
            { texto: "Rechazar la construcción (+10 Salud, -5 Puntos)", consecuencias: { salud: 10, puntos: -5 } },
            { texto: "Permitir sin límites (+10 Puntos, -30 Salud)", consecuencias: { salud: -30, puntos: 10 } }
        ]
    },
    river: {
        titulo: "Contaminación del Río",
        descripcion: "Se ha detectado un vertido químico río arriba. ¡Debes actuar rápido para limpiarlo!",
        opciones: [
            { texto: "Organizar limpieza (-6 Puntos, +20 Salud)", consecuencias: { salud: 20, puntos: -6 } },
            { texto: "Ignorar el problema (-25 Salud)", consecuencias: { salud: -25, puntos: 0 } }
        ]
    },
    prairie: {
        titulo: "Especie Invasora en la Pradera",
        descripcion: "Una planta no nativa está creciendo sin control en la pradera, amenazando a las flores silvestres. Eliminarla costará puntos de acción.",
        opciones: [
            { texto: "Controlar la plaga (-4 Puntos, +15 Salud)", consecuencias: { salud: 15, puntos: -4 } },
            { texto: "Dejar que la naturaleza siga su curso (-15 Salud)", consecuencias: { salud: -15, puntos: 0 } }
        ]
    },
    quarry: {
        titulo: "Propuesta de Reforestación",
        descripcion: "Un grupo ecologista propone un plan para reforestar la cantera abandonada. Apoyar el proyecto mejorará la salud del ecosistema pero requiere recursos.",
        opciones: [
            { texto: "Apoyar con recursos (-5 Puntos, +20 Salud)", consecuencias: { salud: 20, puntos: -5 } },
            { texto: "Declinar la propuesta", consecuencias: { salud: 0, puntos: 0 } }
        ]
    },
    forest: {
        titulo: "Incendio Forestal Menor",
        descripcion: "Un rayo ha provocado un pequeño incendio en el corazón del bosque. Debes decidir qué tan agresivamente combatirlo.",
        opciones: [
            { texto: "Intervención total (-7 Puntos, +10 Salud)", consecuencias: { salud: 10, puntos: -7 } },
            { texto: "Contenerlo y dejar que se queme lo mínimo (-3 Puntos, -5 Salud)", consecuencias: { salud: -5, puntos: -3 } }
        ]
    }
};

// --- MAIN GAME FUNCTIONS ---
window.onload = function() {
    document.querySelector('header.game-header').classList.add('hidden-for-anim');
    document.querySelector('.sidebar-left').classList.add('hidden-for-anim');
    document.querySelector('.sidebar-right').classList.add('hidden-for-anim');
    document.getElementById('interactive-map-container').classList.add('hidden-for-anim');
    loadHotspots(); // We change the function name for clarity
};

// This function now only loads the HOTSPOTS SVG
async function loadHotspots() {
    try {
        const response = await fetch('assets/mapa_bosque_hotspots.svg'); // <<<< KEY CHANGE
        const svgText = await response.text();
        document.getElementById('hotspot-svg-container').innerHTML = svgText; // <<<< KEY CHANGE
        console.log("Hotspots SVG loaded successfully.");
    } catch (error) {
        console.error("Error loading hotspots SVG:", error);
    }
}

// --- TOOLTIP AND HOTSPOT LOGIC ---
const tooltip = document.getElementById('map-tooltip');

function showTooltip(zoneId) {
    if (eventos[zoneId] && estadoJuego.gameStarted) {
        tooltip.textContent = eventos[zoneId].name;
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }
}

function hideTooltip() {
    tooltip.style.opacity = '0';
    tooltip.style.transform = 'translateY(10px)';
}

function moveTooltip(event) {
    // Position the tooltip slightly below and to the right of the cursor
    tooltip.style.left = `${event.clientX + 15}px`;
    tooltip.style.top = `${event.clientY + 15}px`;
}

function setupHotspots() {
    console.log("Attempting to set up hotspots...");
    for (const zoneId in eventos) {
        const hotspot = document.getElementById(zoneId);
        if (hotspot) {
            console.log(`SUCCESS: Found hotspot '${zoneId}'.`);
            hotspot.classList.add('hotspot');
            hotspot.onclick = () => {
                if (estadoJuego.gameStarted) {
                    showEvent(zoneId);
                }
            };
        } else {
            console.warn(`FAILURE: Hotspot with ID '${zoneId}' was not found in the SVG.`);
        }
    }
}

// --- SOUND LOGIC ---
function addSoundEffectsToButtons(buttons) {
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => playSound(hoverSound));
        button.addEventListener('click', () => playSound(clickSound));
    });
}

// --- INSTRUCTIONS AND ANIMATION LOGIC ---
function closeInstructions() {
    playSound(clickSound);
    document.getElementById('instructions-modal').style.display = 'none';
    startGame();
}

function startGame() {
    estadoJuego.gameStarted = true;
    document.querySelector('header.game-header').classList.remove('hidden-for-anim');
    document.querySelector('.sidebar-left').classList.remove('hidden-for-anim');
    document.querySelector('.sidebar-right').classList.remove('hidden-for-anim');
    document.getElementById('interactive-map-container').classList.remove('hidden-for-anim');
    setTimeout(setupHotspots, 100);
    actualizarHUD();
}

function showEvent(zoneId) {
    const eventoModal = document.getElementById('evento-modal');
    const evento = eventos[zoneId];
    if (!evento) return;

    document.getElementById('evento-titulo').textContent = evento.titulo;
    document.getElementById('evento-descripcion').textContent = evento.descripcion;
    
    const opcionesContainer = document.getElementById('evento-opciones');
    opcionesContainer.innerHTML = '';

    evento.opciones.forEach(opcion => {
        const boton = document.createElement('button');
        boton.className = 'cta-button';
        boton.textContent = opcion.texto;
        boton.onclick = () => takeDecision(opcion.consecuencias);
        opcionesContainer.appendChild(boton);
    });

    eventoModal.style.display = 'flex';

    // After creating buttons, add sound effects to them
    const optionButtons = opcionesContainer.querySelectorAll('.cta-button');
    addSoundEffectsToButtons(optionButtons);
}

function takeDecision(consecuencias) {
    estadoJuego.saludEcosistema += consecuencias.salud;
    estadoJuego.puntosAccion += consecuencias.puntos;

    if (estadoJuego.saludEcosistema > 100) estadoJuego.saludEcosistema = 100;
    if (estadoJuego.saludEcosistema < 0) estadoJuego.saludEcosistema = 0;
    
    estadoJuego.rondaActual++;
    
    actualizarHUD();
    
    document.getElementById('evento-modal').style.display = 'none';

    if (estadoJuego.rondaActual > estadoJuego.rondasTotales || estadoJuego.saludEcosistema <= 0) {
        endGame();
    }
}

function actualizarHUD() {
    const healthFill = document.getElementById('vertical-progress-fill-game');
    const healthText = document.getElementById('health-percentage');
    
    healthFill.style.height = `${estadoJuego.saludEcosistema}%`;
    healthText.textContent = `${estadoJuego.saludEcosistema}%`;
    
    document.getElementById('puntos-accion').textContent = estadoJuego.puntosAccion;
    document.getElementById('numero-ronda').textContent = `${estadoJuego.rondaActual} / ${estadoJuego.rondasTotales}`;
}

function endGame() {
    let message = estadoJuego.saludEcosistema > 0 ? "¡Felicidades, Guardabosques! Han protegido el bosque." : "El ecosistema ha colapsado. ¡Intenten de nuevo!";
    alert(message);
    // You could add logic here to restart the game
}
