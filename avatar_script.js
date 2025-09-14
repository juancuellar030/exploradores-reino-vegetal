// In avatar_script.js

// This object will hold the chosen avatar parts, including colors
let avatar = {
    base: 'assets/avatar_base/base_01.svg',
    clothing: 'assets/avatar_clothing/shirt_vest_explorer.svg',
    headwear: '',
    eyewear: '',
    accessory: '',
    colors: { // New object to store color choices
        'vest-color': '#A0522D' // Default color
    }
};

// --- NEW FUNCTION to load an SVG file and display it ---
async function selectSvg(layer, svgPath) {
    if (!svgPath) {
        document.getElementById(`${layer}-preview`).innerHTML = '';
        avatar[layer] = '';
        return;
    }

    try {
        // Fetch the content of the SVG file
        const response = await fetch(svgPath);
        const svgText = await response.text();
        
        // Put the SVG content into the correct preview div
        document.getElementById(`${layer}-preview`).innerHTML = svgText;
        avatar[layer] = svgPath; // Save the path
        
        // Re-apply any custom colors when we change the item
        applyAllColors();

    } catch (error) {
        console.error('Error loading SVG:', error);
    }
}

// --- NEW AND IMPROVED FUNCTION to change the color of a group of SVG parts ---
function changeColor(groupId, color) {
    // Save the color choice first
    avatar.colors[groupId] = color;

    // Find the group element in the preview area (e.g., the <g id="skin-parts"> tag)
    const groupElement = document.querySelector(`#${groupId}`);
    
    if (groupElement) {
        // Find ALL the visible shapes (paths, circles, etc.) inside that group
        const partsToColor = groupElement.querySelectorAll('path, circle, ellipse, rect');
        
        // Loop through each part and apply the new color
        partsToColor.forEach(part => {
            part.style.fill = color;
        });
    }
}

// --- NEW FUNCTION to apply all saved colors ---
// This is useful when loading an item, to make sure it has the selected color
function applyAllColors() {
    for (const partId in avatar.colors) {
        const color = avatar.colors[partId];
        const svgElement = document.querySelector(`#${partId}`);
        if (svgElement) {
            svgElement.style.fill = color;
        }
    }
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

// Load existing avatar and initialize the view
window.onload = async function() {
    const savedAvatar = localStorage.getItem('exploradorAvatar');
    if (savedAvatar) {
        avatar = JSON.parse(savedAvatar);
    }
    
    // Load all the selected SVG parts and apply colors
    await selectSvg('base', avatar.base);
    await selectSvg('clothing', avatar.clothing);
    await selectSvg('headwear', avatar.headwear);
    await selectSvg('eyewear', avatar.eyewear);
    await selectSvg('accessory', avatar.accessory);

    applyAllColors(); // Make sure the colors are correct on load
};
