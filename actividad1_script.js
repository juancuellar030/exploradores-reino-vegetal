// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');

// Helper function to play sounds reliably
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// --- PLAYER STATE ---
let jugador = {
    nombre: "Explorador Novato",
    pe: 0,
    nivel: 1,
    insignias: [],
    progresoGeneral: 0
};

// --- GAME CONFIG CONSTANTS ---
const PE_POR_DESAFIO = 50;
const PE_PARA_NIVEL_2 = 300; // As per the project PDF
// Add more PE thresholds here...

// --- GAME LOGIC FUNCTIONS ---
function ganarPE(cantidad) {
    jugador.pe += cantidad;
    console.log(`Has ganado ${cantidad} PE. Total: ${jugador.pe}`);
    guardarProgreso();
    actualizarUI();
    verificarDesbloqueos();
}

// (Add other game logic functions here: ganarInsignia, etc.)

// --- UI UPDATE FUNCTIONS ---
function actualizarUI() {
    document.getElementById('nombre-jugador').textContent = jugador.nombre;
    document.getElementById('pe-jugador').textContent = jugador.pe;
    // (Add other UI updates here: progress bar, badges, etc.)
}

function cargarAvatar() {
    const savedAvatar = localStorage.getItem('exploradorAvatar');
    if (savedAvatar) {
        const avatar = JSON.parse(savedAvatar);
        const avatarDisplay = document.getElementById('avatar-display');
        avatarDisplay.innerHTML = ''; // Clear previous

        // This is a simplified version; you might have more layers
        if(avatar.base) avatarDisplay.innerHTML += `<img src="${avatar.base}" class="avatar-layer">`;
        if(avatar.clothing) avatarDisplay.innerHTML += `<img src="${avatar.clothing}" class="avatar-layer">`;
        // ... and so on for other layers ...
    }
}

function verificarDesbloqueos() {
    // Logic to unlock new biomes based on PE
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

// (Add your question/challenge functions here, e.g., verificarCuestionario)
function verificarCuestionario(questionId, isCorrect) {
    // Your logic for checking answers...
}

// --- NEW FUNCTION TO ADD SOUNDS TO ALL INTERACTIVE ELEMENTS ---
function addSoundEffectsToActivity() {
    // Select all buttons on the page that should have sound
    const interactiveElements = document.querySelectorAll(
        '.back-button, .cuestionario button'
        // Add other selectors here if you add more interactive elements
    );

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(hoverSound));
        element.addEventListener('click', () => playSound(clickSound));
    });
}


// --- MAIN FUNCTION that runs when the page is fully loaded ---
window.onload = function() {
    cargarProgreso();
    cargarAvatar();
    verificarDesbloqueos();
    actualizarUI();
    
    // Activate all the sounds
    addSoundEffectsToActivity();
};
