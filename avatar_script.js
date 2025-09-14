// This object will hold the chosen avatar parts
let avatar = {
    base: 'assets/avatar_base/base1.png', // Default base
    accesorio: ''
};

// Function to update the preview when an option is clicked
function selectOption(layer, imagePath) {
    document.getElementById(`${layer}-preview`).src = imagePath;
    avatar[layer] = imagePath;
    console.log(`Selected ${layer}: ${imagePath}`);
}

// Function to save the avatar and proceed to the activity
function saveAndStart() {
    // Save the avatar object to localStorage
    localStorage.setItem('exploradorAvatar', JSON.stringify(avatar));
    
    // Ask for the player's name if it's not already set
    let playerName = localStorage.getItem('exploradorNombre');
    if (!playerName) {
        playerName = prompt("¿Cuál es tu nombre, explorador(a)?", "Explorador Valiente");
        localStorage.setItem('exploradorNombre', playerName);
    }
    
    // Redirect to Activity 1
    window.location.href = 'actividad1.html';
}

// Load existing avatar if the player returns to this page
window.onload = function() {
    const savedAvatar = localStorage.getItem('exploradorAvatar');
    if (savedAvatar) {
        avatar = JSON.parse(savedAvatar);
        selectOption('base', avatar.base);
        selectOption('accesorio', avatar.accesorio);
    }
};
