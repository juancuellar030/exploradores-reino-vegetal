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
    germinacion: { 
        name: "Semilla Germinada", 
        image: "assets/insignias/insignia_semilla.png",
        description: "Representa el primer paso y el despertar de una nueva vida. ¡El viaje ha comenzado!" 
    },
    crecimiento: { 
        name: "Tallo Fuerte", 
        image: "assets/insignias/insignia_tallo.png",
        description: "Simboliza la fuerza y el crecimiento, buscando la luz para volverse más fuerte."
    },
    reproduccion: { 
        name: "Flor Eclosionada", 
        image: "assets/insignias/insignia_flor.png",
        description: "La belleza de la madurez y el comienzo de la reproducción, atrayendo a los polinizadores."
    },
    dispersion: { 
        name: "Fruto Maduró", 
        image: "assets/insignias/insignia_fruto.png",
        description: "El éxito del ciclo, un fruto que protege a la siguiente generación de semillas."
    },
    jardinero: { 
        name: "Jardinero Mayor", 
        image: "assets/insignias/insignia_jardinero.png",
        description: "¡Maestría total! Demuestra un conocimiento completo del ciclo de vida de las plantas."
    }
};
const BIOME_ORDER = ['germinacion', 'crecimiento', 'reproduccion', 'dispersion'];

// --- PLAYER STATE ---
let jugador = {
    nombre: "Explorador Novato",
    pe: 0,
    insignias: []
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

// --- RESTORED FUNCTION TO LOAD THE CUSTOM AVATAR ---
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
    jugador.pe += points;
    ganarInsignia(challengeId);
    checkJardineroMayor();
    guardarProgreso();
    actualizarUI();
    const button = document.getElementById(`claim-reward-${challengeId}`);
    if (button) {
        button.disabled = true;
        button.textContent = "¡Recompensa Obtenida!";
        button.style.backgroundColor = '#aaa';
    }
}

// --- MODAL LOGIC FUNCTIONS ---
function showInsigniaDetails(insigniaId) {
    const insigniaData = INSIGNIAS[insigniaId];
    if (!insigniaData) return;

    // Populate the modal with the correct data
    document.getElementById('modal-insignia-image').src = insigniaData.image;
    document.getElementById('modal-insignia-name').textContent = insigniaData.name;
    document.getElementById('modal-insignia-description').textContent = insigniaData.description;

    // Show the modal
    document.getElementById('insignia-modal').classList.add('visible');
}

function hideInsigniaDetails() {
    document.getElementById('insignia-modal').classList.remove('visible');
}

// --- UI UPDATE FUNCTION (For the RIGHT-SIDE HUD and Biomes) ---
function actualizarUI() {
    document.getElementById('hud-player-name').textContent = jugador.nombre;
    document.getElementById('hud-pe-points').textContent = jugador.pe;
    const progressPercent = (jugador.insignias.filter(id => id !== 'jardinero').length / BIOME_ORDER.length) * 100;
    document.getElementById('vertical-progress-fill').style.height = `${progressPercent}%`;
    const insigniasContainer = document.getElementById('hud-insignias-container');
    insigniasContainer.innerHTML = '';
    for (const id in INSIGNIAS) {
        const insignia = INSIGNIAS[id];
        const img = document.createElement('img');
        img.src = insignia.image;
        img.title = insignia.name;
        img.className = 'insignia';
        img.onclick = () => showInsigniaDetails(id);
        if (jugador.insignias.includes(id)) {
            img.classList.add('obtenida');
        }
        insigniasContainer.appendChild(img);
    }
    const biomasContainer = document.getElementById('biomas-container');
    biomasContainer.innerHTML = '';
    let lastInsigniaEarned = true;
    for (const biomeId of BIOME_ORDER) {
        if (lastInsigniaEarned) {
            const template = document.getElementById(`template-${biomeId}`);
            if (template) {
                biomasContainer.appendChild(template.content.cloneNode(true));
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
    }
    jugador.nombre = localStorage.getItem('exploradorNombre') || "Explorador Novato";
}

// --- SOUNDS ---
function addSoundEffectsToActivity() {
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
    cargarAvatar(); // This call now works because the function is defined
    actualizarUI();
    addSoundEffectsToActivity();
};
