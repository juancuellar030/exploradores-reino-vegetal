// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// --- GAME DATA (UPDATED) ---
const INSIGNIAS = {
    // <<<< KEY CHANGE: Updated image paths to your new PNG files >>>>
    germinacion: { name: "Semilla Germinada", image: "assets/insignias/insignia_semilla.png" },
    crecimiento: { name: "Tallo Fuerte", image: "assets/insignias/insignia_tallo.png" },
    reproduccion: { name: "Flor Eclosionada", image: "assets/insignias/insignia_flor.png" },
    dispersion: { name: "Fruto Maduró", image: "assets/insignias/insignia_fruto.png" },
    // <<<< KEY CHANGE: Added the final mastery insignia >>>>
    jardinero: { name: "Jardinero Mayor", image: "assets/insignias/insignia_jardinero.png" }
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

// <<<< NEW FUNCTION to check if the final insignia should be awarded >>>>
function checkJardineroMayor() {
    // Check if the player has earned all four biome insignias
    const hasAllBiomeInsignias = BIOME_ORDER.every(id => jugador.insignias.includes(id));
    
    if (hasAllBiomeInsignias) {
        ganarInsignia('jardinero');
        console.log("¡Felicidades! Has obtenido la insignia de Jardinero Mayor.");
    }
}

function completeWordwallChallenge(challengeId, points) {
    jugador.pe += points;
    ganarInsignia(challengeId);
    
    // <<<< KEY CHANGE: Check for the final award after every challenge >>>>
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

// --- UI UPDATE FUNCTION ---
function actualizarUI() {
    document.getElementById('hud-player-name').textContent = jugador.nombre;
    document.getElementById('hud-pe-points').textContent = jugador.pe;

    const progressPercent = (jugador.insignias.filter(id => id !== 'jardinero').length / BIOME_ORDER.length) * 100;
    document.getElementById('vertical-progress-fill').style.height = `${progressPercent}%`;

    const insigniasContainer = document.getElementById('hud-insignias-container');
    insigniasContainer.innerHTML = '';
    
    // <<<< KEY CHANGE: Loop through ALL insignias, not just the biome ones >>>>
    for (const id in INSIGNIAS) {
        const insignia = INSIGNIAS[id];
        const img = document.createElement('img');
        img.src = insignia.image;
        img.title = insignia.name;
        img.className = 'insignia';
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

// --- MAIN FUNCTION (CORRECTED) ---
window.onload = function() {
    cargarProgreso();
    cargarAvatar(); // <<<< KEY FIX: This function call is now back!
    actualizarUI();
    addSoundEffectsToActivity();
};
