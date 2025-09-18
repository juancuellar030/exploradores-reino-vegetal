// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// === NEW: DATA FOR ALL INSIGNIAS ===
const INSIGNIAS = {
    germinacion: { name: "Semilla Germinada", image: "assets/insignias/semilla.svg" },
    crecimiento: { name: "Tallo Fuerte", image: "assets/insignias/tallo.svg" },
    reproduccion: { name: "Flor Eclosionada", image: "assets/insignias/flor.svg" },
    dispersion: { name: "Fruto Maduró", image: "assets/insignias/fruto.svg" }
};
const TOTAL_BIOMAS = Object.keys(INSIGNIAS).length;

// --- PLAYER STATE ---
let jugador = {
    nombre: "Explorador Novato",
    pe: 0,
    insignias: [] // Will store IDs like 'germinacion'
};

// --- HELPER FUNCTION to apply saved colors ---
function applyAllColors(container, colors) {
    for (const groupId in colors) {
        const color = colors[groupId];
        const groupElement = container.querySelector(`#${groupId}`);
        if (groupElement) {
            const partsToColor = groupElement.querySelectorAll('path, circle, ellipse, rect');
            partsToColor.forEach(part => {
                part.style.fill = color;
            });
        }
    }
}

// --- NEW, POWERFUL FUNCTION TO LOAD THE CUSTOM AVATAR ---
async function cargarAvatar() {
    const savedAvatarData = localStorage.getItem('exploradorAvatar');
    if (!savedAvatarData) return;

    const avatar = JSON.parse(savedAvatarData);
    const hudDisplay = document.getElementById('hud-avatar-display');
    hudDisplay.innerHTML = ''; // Clear previous

    const layers = ['base', 'clothing', 'headwear', 'eyewear', 'accessory'];

    for (const layer of layers) {
        if (avatar[layer]) {
            try {
                const response = await fetch(avatar[layer]);
                const svgText = await response.text();
                const layerDiv = document.createElement('div');
                layerDiv.className = 'avatar-layer';
                layerDiv.innerHTML = svgText;
                hudDisplay.appendChild(layerDiv);
            } catch (error) {
                console.error(`Error loading SVG for layer ${layer}:`, error);
            }
        }
    }
    
    // After all SVGs are loaded, apply the saved colors
    applyAllColors(hudDisplay, avatar.colors);
}

// --- GAME LOGIC FUNCTIONS ---
function ganarPE(cantidad) {
    jugador.pe += cantidad;
    // We don't call guardarProgreso or actualizarUI here to prevent multiple updates.
}

// === NEW: FUNCTION TO AWARD INSIGNIAS ===
function ganarInsignia(insigniaId) {
    if (!jugador.insignias.includes(insigniaId)) {
        jugador.insignias.push(insigniaId);
        console.log(`¡Insignia obtenida: ${INSIGNIAS[insigniaId].name}!`);
    }
}

function completeWordwallChallenge(challengeId, points) {
    ganarPE(points);
    ganarInsignia(challengeId); // <<<< KEY CHANGE: Award the insignia
    
    // After all changes, save and update the entire UI once.
    guardarProgreso();
    actualizarUI();
    
    const button = document.getElementById(`claim-reward-${challengeId}`);
    if (button) {
        button.disabled = true;
        button.textContent = "¡PE Reclamados!";
        button.style.backgroundColor = '#aaa';
    }
}

// --- UI UPDATE FUNCTIONS ---
function actualizarUI() {
    // Update player name and PE
    document.getElementById('nombre-jugador').textContent = jugador.nombre;
    document.getElementById('hud-player-name').textContent = jugador.nombre;
    document.getElementById('pe-jugador').textContent = jugador.pe;

    // === NEW: UPDATE PROGRESS BAR ===
    const progreso = (jugador.insignias.length / TOTAL_BIOMAS) * 100;
    const progressBar = document.getElementById('barra-progreso-general');
    if (progressBar) {
        progressBar.style.width = `${progreso}%`;
        progressBar.textContent = `${Math.round(progreso)}%`;
    }

    // === NEW: UPDATE INSIGNIAS DISPLAY ===
    const insigniasContainer = document.getElementById('contenedor-insignias');
    if (insigniasContainer) {
        insigniasContainer.innerHTML = ''; // Clear old insignias
        for (const id in INSIGNIAS) {
            const insignia = INSIGNIAS[id];
            const img = document.createElement('img');
            img.src = insignia.image;
            img.alt = insignia.name;
            img.title = insignia.name; // Tooltip on hover
            img.className = 'insignia';
            if (jugador.insignias.includes(id)) {
                img.classList.add('obtenida');
            }
            insigniasContainer.appendChild(img);
        }
    }
}

// --- DATA MANAGEMENT ---
function guardarProgreso() {
    localStorage.setItem('progresoExplorador', JSON.stringify(jugador));
}

function cargarProgreso() {
    const progresoGuardado = localStorage.getItem('progresoExplorador');
    if (progresoGuardado) {
        jugador = JSON.parse(progresoGuardado);
    }
    jugador.nombre = localStorage.getItem('exploradorNombre') || "Explorador Novato";
}

// --- FUNCTION TO ADD SOUNDS ---
function addSoundEffectsToActivity() {
    const interactiveElements = document.querySelectorAll(
        '.back-button, .cta-button, .cuestionario button'
    );
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(hoverSound));
        element.addEventListener('click', () => playSound(clickSound));
    });
}

// --- MAIN FUNCTION ---
window.onload = function() {
    cargarProgreso();
    cargarAvatar();
    actualizarUI(); // Run this once on load to show initial state
    addSoundEffectsToActivity();
};
