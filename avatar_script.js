// This object will hold the chosen avatar parts, including colors
let avatar = {
    base: 'assets/avatar_base/base_01.svg',
    clothing: 'assets/avatar_clothing/shirt_vest_explorer.svg',
    headwear: '',
    eyewear: '',
    accessory: '',
    colors: { // New object to store color choices
        'skin-parts': '#D1FFB6', // Default skin color
        'vest-color': '#A0522D'  // Default vest color
    }
};

// --- FUNCTION to load an SVG file and display it ---
async function selectSvg(layer, svgPath) {
    if (!svgPath) {
        document.getElementById(`${layer}-preview`).innerHTML = '';
        avatar[layer] = '';
        return;
    }

    try {
        const response = await fetch(svgPath);
        if (!response.ok) {
            throw new Error(`File not found: ${svgPath}`);
        }
        const svgText = await response.text();
        
        document.getElementById(`${layer}-preview`).innerHTML = svgText;
        avatar[layer] = svgPath;
        
        applyAllColors(); // Re-apply colors when we change an item

    } catch (error) {
        console.error('Error loading SVG:', error);
        const previewBox = document.getElementById(`${layer}-preview`);
        if (previewBox) {
            const fileName = svgPath.split('/').pop();
            previewBox.innerHTML = `<p style="font-size:12px; color:red; text-align:center; margin-top: 80px;">Error al cargar:<br>${fileName}</p>`;
        }
    }
}

// --- NEW AND IMPROVED FUNCTION to change the color of a group of SVG parts ---
function changeColor(groupId, color) {
    avatar.colors[groupId] = color; // Save the color choice

    const groupElement = document.querySelector(`#${groupId}`);
    
    if (groupElement) {
        const partsToColor = groupElement.querySelectorAll('path, circle, ellipse, rect');
        partsToColor.forEach(part => {
            part.style.fill = color;
        });
    }
}

// --- CORRECTED FUNCTION to apply all saved colors ---
// This now uses the correct group-finding logic
function applyAllColors() {
    for (const groupId in avatar.colors) {
        const color = avatar.colors[groupId];
        const groupElement = document.querySelector(`#${groupId}`);
        
        if (groupElement) {
            const partsToColor = groupElement.querySelectorAll('path, circle, ellipse, rect');
            partsToColor.forEach(part => {
                part.style.fill = color;
            });
        }
    }
}


// Function to save the avatar and proceed to the activity
function saveAndStart() {
    localStorage.setItem('exploradorAvatar', JSON.stringify(avatar));
    
    let playerName = localStorage.getItem('exploradorNombre');
    if (!playerName) {
        playerName = prompt("¿Cuál es tu nombre, explorador(a)?", "Explorador Valiente");
        localStorage.setItem('exploradorNombre', playerName);
    }
    
    window.location.href = 'actividad1.html';
}

// Load existing avatar and initialize the view
window.onload = async function() {
    const savedAvatar = localStorage.getItem('exploradorAvatar');
    if (savedAvatar) {
        avatar = JSON.parse(savedAvatar);
    }
    
    await selectSvg('clothing', avatar.clothing);
    await selectSvg('base', avatar.base);
    await selectSvg('headwear', avatar.headwear);
    await selectSvg('eyewear', avatar.eyewear);
    await selectSvg('accessory', avatar.accessory);

    applyAllColors();
};
