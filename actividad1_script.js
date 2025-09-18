// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// --- GAME DATA ---
const INSIGNIAS = {
    germinacion: { name: "Semilla Germinada", image: "assets/insignias/semilla.svg" },
    crecimiento: { name: "Tallo Fuerte", image: "assets/insignias/tallo.svg" },
    reproduccion: { name: "Flor Eclosionada", image: "assets/insignias/flor.svg" },
    dispersion: { name: "Fruto Maduró", image: "assets/insignias/fruto.svg" }
};
const BIOME_ORDER = ['germinacion', 'crecimiento', 'reproduccion', 'dispersion'];

// --- PLAYER STATE ---
let jugador = {
    nombre: "Explorador Novato",
    pe: 0,
    insignias: []
};

// --- GAME LOGIC ---
function ganarInsignia(insigniaId) {
    if (!jugador.insignias.includes(insigniaId)) {
        jugador.insignias.push(insigniaId);
    }
}

function completeWordwallChallenge(challengeId, points) {
    jugador.pe += points;
    ganarInsignia(challengeId);
    guardarProgreso();
    actualizarUI();
    const button = document.getElementById(`claim-reward-${challengeId}`);
    if (button) {
        button.disabled = true;
        button.textContent = "¡Recompensa Obtenida!";
        button.style.backgroundColor = '#aaa';
    }
}

// --- UI UPDATE FUNCTION (COMPLETELY REWRITTEN) ---
function actualizarUI() {
    // 1. Update HUD Info
    document.getElementById('hud-player-name').textContent = jugador.nombre;
    document.getElementById('hud-pe-points').textContent = jugador.pe;

    // 2. Update Vertical Progress Bar
    const progressPercent = (jugador.insignias.length / BIOME_ORDER.length) * 100;
    document.getElementById('vertical-progress-fill').style.height = `${progressPercent}%`;

    // 3. Update HUD Insignias
    const insigniasContainer = document.getElementById('hud-insignias-container');
    insigniasContainer.innerHTML = '';
    BIOME_ORDER.forEach(id => {
        const insignia = INSIGNIAS[id];
        const img = document.createElement('img');
        img.src = insignia.image;
        img.title = insignia.name;
        img.className = 'insignia';
        if (jugador.insignias.includes(id)) {
            img.classList.add('obtenida');
        }
        insigniasContainer.appendChild(img);
    });

    // 4. SEQUENTIAL UNLOCKING LOGIC
    const biomasContainer = document.getElementById('biomas-container');
    biomasContainer.innerHTML = ''; // Clear existing biomes
    let lastInsigniaEarned = true;

    for (const biomeId of BIOME_ORDER) {
        if (lastInsigniaEarned) {
            const template = document.getElementById(`template-${biomeId}`);
            if (template) {
                biomasContainer.appendChild(template.content.cloneNode(true));
            }
        }
        // Check if the current biome's insignia has been earned for the next loop iteration
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
    actualizarUI(); // This will now set up the initial biome and HUD state
    addSoundEffectsToActivity();
};
