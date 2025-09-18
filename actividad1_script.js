// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// --- PLAYER STATE ---
let jugador = {
    nombre: "Explorador Novato",
    pe: 0,
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
    guardarProgreso();
    actualizarUI();
}

function completeWordwallChallenge(challengeId, points) {
    ganarPE(points);
    const button = document.getElementById(`claim-reward-${challengeId}`);
    if (button) {
        button.disabled = true;
        button.textContent = "¡PE Reclamados!";
        button.style.backgroundColor = '#aaa';
    }
}

// --- UI UPDATE FUNCTIONS ---
function actualizarUI() {
    document.getElementById('nombre-jugador').textContent = jugador.nombre;
    document.getElementById('hud-player-name').textContent = jugador.nombre; // Update HUD name
    document.getElementById('pe-jugador').textContent = jugador.pe;
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

// --- MAIN FUNCTION that runs when the page is fully loaded ---
window.onload = function() {
    cargarProgreso();
    cargarAvatar(); // Run the new async avatar loader
    actualizarUI();
    addSoundEffectsToActivity();
};
