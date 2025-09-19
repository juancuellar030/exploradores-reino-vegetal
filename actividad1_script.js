// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');
const earnedInsigniaSound = new Audio('assets/sounds/earned_insignia.mp3');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// --- GAME DATA ---
const INSIGNIAS = {
    germinacion: { name: "Semilla Germinada", image: "assets/insignias/insignia_semilla.png", description: "Representa el primer paso y el despertar de una nueva vida. ¡El viaje ha comenzado!" },
    crecimiento: { name: "Tallo Fuerte", image: "assets/insignias/insignia_tallo.png", description: "Simboliza la fuerza y el crecimiento, buscando la luz para volverse más fuerte." },
    reproduccion: { name: "Flor Eclosionada", image: "assets/insignias/insignia_flor.png", description: "La belleza de la madurez y el comienzo de la reproducción, atrayendo a los polinizadores." },
    dispersion: { name: "Fruto Maduró", image: "assets/insignias/insignia_fruto.png", description: "El éxito del ciclo, un fruto que protege a la siguiente generación de semillas." },
    jardinero: { name: "Jardinero Mayor", image: "assets/insignias/insignia_jardinero.png", description: "¡Maestría total! Demuestra un conocimiento completo del ciclo de vida de las plantas." }
};
const BIOME_ORDER = ['germinacion', 'crecimiento', 'reproduccion', 'dispersion'];

// --- PLAYER STATE ---
let jugador = {
    nombre: "Explorador Novato",
    pe: 0,
    insignias: [],
    completedChallenges: [] // Tracks completed Wordwall activities by ID
};

// --- MODAL LOGIC ---
function showInsigniaDetails(insigniaId) {
    playSound(clickSound);
    const insigniaData = INSIGNIAS[insigniaId];
    if (!insigniaData) return;
    document.getElementById('modal-insignia-image').src = insigniaData.image;
    document.getElementById('modal-insignia-name').textContent = insigniaData.name;
    document.getElementById('modal-insignia-description').textContent = insigniaData.description;
    document.getElementById('insignia-modal').classList.add('visible');
}

function hideInsigniaDetails() {
    document.getElementById('insignia-modal').classList.remove('visible');
}

// --- AVATAR & COLOR LOGIC ---
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

async function cargarAvatar() {
    const savedAvatarData = localStorage.getItem('exploradorAvatar');
    if (!savedAvatarData) return;
    const avatar = JSON.parse(savedAvatarData);
    const hudDisplay = document.getElementById('hud-avatar-display-left');
    if (!hudDisplay) return;
    hudDisplay.innerHTML = '';
    const layers = ['base', 'clothing', 'headwear', 'eyewear', 'accessory'];
    for (const layer of layers) {
        if (avatar[layer]) {
            try {
                const response = await fetch(avatar[layer]);
                if (response.ok) {
                    const svgText = await response.text();
                    const layerDiv = document.createElement('div');
                    layerDiv.className = 'avatar-layer';
                    layerDiv.innerHTML = svgText;
                    hudDisplay.appendChild(layerDiv);
                }
            } catch (error) {
                console.error(`Error loading SVG for layer ${layer}:`, error);
            }
        }
    }
    applyAllColors(hudDisplay, avatar.colors);
}

// --- GAME LOGIC ---
function ganarInsignia(insigniaId) {
    if (!jugador.insignias.includes(insigniaId)) {
        jugador.insignias.push(insigniaId);
        playSound(earnedInsigniaSound);
    }
}

function checkJardineroMayor() {
    const hasAllBiomeInsignias = BIOME_ORDER.every(id => jugador.insignias.includes(id));
    if (hasAllBiomeInsignias) {
        ganarInsignia('jardinero');
    }
}

function completeWordwallChallenge(challengeId, points) {
    if (jugador.completedChallenges.includes(challengeId)) {
        console.warn(`Challenge '${challengeId}' already completed. No points awarded.`);
        return; // Stop the function if the challenge is already complete
    }
    jugador.pe += points;
    ganarInsignia(challengeId);
    jugador.completedChallenges.push(challengeId); // Log the completion
    checkJardineroMayor();
    guardarProgreso();
    actualizarUI(); // This will redraw the UI and disable the button permanently
}

// --- UI UPDATE FUNCTION ---
function actualizarUI() {
    // Update HUDs
    document.getElementById('hud-avatar-name').textContent = jugador.nombre;
    document.getElementById('hud-pe-points').textContent = jugador.pe;
    const progressPercent = (jugador.insignias.filter(id => id !== 'jardinero').length / BIOME_ORDER.length) * 100;
    document.getElementById('vertical-progress-fill').style.height = `${progressPercent}%`;

    // Update Insignias Display
    const insigniasContainer = document.getElementById('hud-insignias-container');
    insigniasContainer.innerHTML = '';
    for (const id in INSIGNIAS) {
        const insignia = INSIGNIAS[id];
        const img = document.createElement('img');
        img.src = insignia.image;
        img.title = insignia.name;
        img.className = 'insignia';
        if (jugador.insignias.includes(id)) {
            img.classList.add('obtenida');
            img.onclick = () => showInsigniaDetails(id);
        }
        insigniasContainer.appendChild(img);
    }

    // Update Biome Cards (Sequential Unlocking)
    const biomasContainer = document.getElementById('biomas-container');
    biomasContainer.innerHTML = '';
    let lastInsigniaEarned = true;
    for (const biomeId of BIOME_ORDER) {
        if (lastInsigniaEarned) {
            const template = document.getElementById(`template-${biomeId}`);
            if (template) {
                biomasContainer.appendChild(template.content.cloneNode(true));
                // After adding the biome, check if its button should be disabled
                if (jugador.completedChallenges.includes(biomeId)) {
                    const button = biomasContainer.querySelector(`#claim-reward-${biomeId}`);
                    if (button) {
                        button.disabled = true;
                        button.textContent = "¡Recompensa Obtenida!";
                        button.style.backgroundColor = '#aaa';
                    }
                }
            }
        }
        lastInsigniaEarned = jugador.insignias.includes(biomeId);
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
        // Ensure the completedChallenges array exists for older save data
        if (!jugador.completedChallenges) {
            jugador.completedChallenges = [];
        }
    }
    jugador.nombre = localStorage.getItem('exploradorNombre') || "Explorador Novato";
}

// --- SOUNDS ---
function addSoundEffectsToActivity() {
    // Sounds are added dynamically now with the buttons
    const interactiveElements = document.querySelectorAll(
        '.back-button, .cta-button'
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
    actualizarUI();
    addSoundEffectsToActivity();
};
