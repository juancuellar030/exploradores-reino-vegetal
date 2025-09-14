// --- NEW FUNCTION TO LOAD AVATAR ---
function cargarAvatar() {
    const savedAvatar = localStorage.getItem('exploradorAvatar');
    if (savedAvatar) {
        const avatar = JSON.parse(savedAvatar);
        const avatarDisplay = document.getElementById('avatar-display');
        avatarDisplay.innerHTML = ''; // Clear previous

        // Create image layers
        const baseImg = document.createElement('img');
        baseImg.src = avatar.base;
        baseImg.classList.add('avatar-layer');

        avatarDisplay.appendChild(baseImg);

        if (avatar.accesorio) {
            const accesorioImg = document.createElement('img');
            accesorioImg.src = avatar.accesorio;
            accesorioImg.classList.add('avatar-layer');
            avatarDisplay.appendChild(accesorioImg);
        }
    }
}

// --- UPDATE THE ONLOAD FUNCTION ---
window.onload = function() {
    cargarProgreso();
    cargarAvatar(); // <-- Add this line
    verificarDesbloqueos();
    actualizarUI();
};

// --- UPDATE THE cargarProgreso FUNCTION ---
// We change how the name is loaded. It's now set on the avatar page.
function cargarProgreso() {
    const progresoGuardado = localStorage.getItem('progresoExplorador');
    if (progresoGuardado) {
        jugador = JSON.parse(progresoGuardado);
        console.log("Progreso cargado:", jugador);
    }
    // Load name from where we saved it
    jugador.nombre = localStorage.getItem('exploradorNombre') || "Explorador Novato";
}
