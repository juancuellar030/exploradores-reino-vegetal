// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');
const earnedInsigniaSound = new Audio('assets/sounds/earned_insignia.mp3');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// --- INITIAL GAME STATE ---
let estadoJuego = {
    saludEcosistema: 100,
    puntosAccion: 10,
    rondaActual: 1,
    rondasTotales: 10,
    gameStarted: false
};

// --- EVENT DATABASE (with icons) ---
const eventos = {
    urban: {
        name: "Frontera Urbana",
        icon: "assets/icons/icon_urban.png",
        titulo: "¡Expansión Urbana!",
        descripcion: "Una constructora quiere construir casas nuevas junto al bosque...",
        opciones: [{ texto: "Negociar (-2P, +5S)", consecuencias: { salud: 5, puntos: -2 } }, { texto: "Rechazar (+10S, -5P)", consecuencias: { salud: 10, puntos: -5 } }, { texto: "Permitir (-30S, +10P)", consecuencias: { salud: -30, puntos: 10 } }]
    },
    river: {
        name: "Río Serpenteante",
        icon: "assets/icons/icon_river.png",
        titulo: "Contaminación del Río",
        descripcion: "Se ha detectado un vertido químico río arriba...",
        opciones: [{ texto: "Organizar limpieza (-6P, +20S)", consecuencias: { salud: 20, puntos: -6 } }, { texto: "Ignorar (-25S)", consecuencias: { salud: -25, puntos: 0 } }]
    },
    prairie: {
        name: "Pradera de Flores",
        icon: "assets/icons/icon_prairie.png",
        titulo: "Especie Invasora",
        descripcion: "Una planta no nativa está creciendo sin control en la pradera...",
        opciones: [{ texto: "Controlar la plaga (-4P, +15S)", consecuencias: { salud: 15, puntos: -4 } }, { texto: "No hacer nada (-15S)", consecuencias: { salud: -15, puntos: 0 } }]
    },
    quarry: {
        name: "Colinas Rocosas",
        icon: "assets/icons/icon_quarry.png",
        titulo: "Propuesta de Reforestación",
        descripcion: "Un grupo ecologista propone un plan para reforestar la cantera...",
        opciones: [{ texto: "Apoyar (-5P, +20S)", consecuencias: { salud: 20, puntos: -5 } }, { texto: "Declinar", consecuencias: { salud: 0, puntos: 0 } }]
    },
    forest: {
        name: "Corazón del Bosque",
        icon: "assets/icons/icon_forest.png",
        titulo: "Incendio Forestal Menor",
        descripcion: "Un rayo ha provocado un pequeño incendio...",
        opciones: [{ texto: "Intervención total (-7P, +10S)", consecuencias: { salud: 10, puntos: -7 } }, { texto: "Contener (-3P, -5S)", consecuencias: { salud: -5, puntos: -3 } }]
    }
};

// --- MAIN GAME FUNCTIONS ---
window.onload = function() {
    document.querySelector('header.game-header').classList.add('hidden-for-anim');
    document.querySelector('.sidebar-left').classList.add('hidden-for-anim');
    document.querySelector('.sidebar-right').classList.add('hidden-for-anim');
    document.getElementById('interactive-map-container').classList.add('hidden-for-anim');
    loadHotspots();
};

async function loadHotspots() {
    try {
        const response = await fetch('assets/mapa_bosque_hotspots.svg');
        const svgText = await response.text();
        document.getElementById('hotspot-svg-container').innerHTML = svgText;
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
    tooltip.style.left = `${event.clientX + 15}px`;
    tooltip.style.top = `${event.clientY + 15}px`;
}

function setupHotspots() {
    window.addEventListener('mousemove', moveTooltip); // Track mouse for tooltip
    for (const zoneId in eventos) {
        const hotspot = document.getElementById(zoneId);
        if (hotspot) {
            hotspot.classList.add('hotspot');
            hotspot.addEventListener('mouseover', () => showTooltip(zoneId));
            hotspot.addEventListener('mouseout', hideTooltip);
            hotspot.addEventListener('click', () => {
                if (estadoJuego.gameStarted) {
                    showEvent(zoneId);
                }
            });
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
    // <<<< THIS WAS THE MISSING CALL >>>>
    addSoundEffectsToButtons(document.querySelectorAll('.back-button, .cta-button'));
}

// --- EVENT AND DECISION LOGIC (MODIFIED) ---
function showEvent(zoneId) {
    playSound(clickSound);
    const eventoModal = document.getElementById('evento-modal');
    const evento = eventos[zoneId];
    if (!evento) return;

    const eventTitle = document.getElementById('evento-titulo');
    // <<<< KEY CHANGE: Add the icon to the title >>>>
    eventTitle.innerHTML = `<img src="${evento.icon}" alt="${evento.name}" width="50"> ${evento.titulo}`;
    
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
    addSoundEffectsToButtons(opcionesContainer.querySelectorAll('.cta-button'));
}

function takeDecision(consecuencias) {
    playSound(clickSound);
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

// --- UI UPDATE FUNCTION (MODIFIED) ---
function actualizarHUD() {
    const healthFill = document.getElementById('vertical-progress-fill-game');
    const healthText = document.getElementById('health-percentage');
    
    healthFill.style.height = `${estadoJuego.saludEcosistema}%`;
    healthText.textContent = `${estadoJuego.saludEcosistema}%`;
    
    // <<<< KEY CHANGE: Logic for color-changing health bar >>>>
    healthFill.classList.remove('warning', 'critical');
    if (estadoJuego.saludEcosistema <= 50 && estadoJuego.saludEcosistema > 25) {
        healthFill.classList.add('warning');
    } else if (estadoJuego.saludEcosistema <= 25) {
        healthFill.classList.add('critical');
    }
    
    document.getElementById('puntos-accion').textContent = estadoJuego.puntosAccion;
    document.getElementById('numero-ronda').textContent = `${estadoJuego.rondaActual} / ${estadoJuego.rondasTotales}`;
}

// --- END GAME LOGIC (COMPLETELY REWRITTEN) ---
function endGame() {
    const modal = document.getElementById('end-game-modal');
    const title = document.getElementById('end-game-title');
    const message = document.getElementById('end-game-message');
    const image = document.getElementById('end-game-image');
    
    if (estadoJuego.saludEcosistema > 0) {
        // Success State
        playSound(earnedInsigniaSound); // <<<< KEY CHANGE: Play success sound
        modal.classList.add('success');
        image.src = 'assets/insignias/insignia_jardinero.png'; // Show the mastery badge
        title.textContent = "¡Misión Cumplida, Guardabosques!";
        message.textContent = `¡Felicidades! Han mantenido el equilibrio del bosque durante ${estadoJuego.rondasTotales} temporadas. El ecosistema está a salvo gracias a ustedes.`;
    } else {
        // Failure State
        modal.classList.remove('success');
        image.src = 'assets/icons/icon_failure.png'; // You'll need to create a "failure" icon
        title.textContent = "El Ecosistema ha Colapsado";
        message.textContent = "Aunque no lo lograron esta vez, han aprendido valiosas lecciones sobre la gestión ambiental. ¡El bosque necesita que lo intenten de nuevo!";
    }
    
    modal.style.display = 'flex';
}

function restartGame() {
    // Reload the page to start over
    window.location.reload();
}
