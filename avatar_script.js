// --- SOUND EFFECT SETUP ---
const hoverSound = new Audio('assets/sounds/ui-hover-sound.mp3');
hoverSound.volume = 0.4;

const clickSound = new Audio('assets/sounds/ui-click-sound.mp3');

const slotMachineSound = new Audio('assets/sounds/slot_machine.mp3');

// Helper function to play sounds reliably
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// --- AVATAR DATA OBJECT ---
let avatar = {
    base: 'assets/avatar_base/base_01.svg',
    clothing: 'assets/avatar_clothing/shirt_vest_explorer.svg',
    headwear: '',
    eyewear: '',
    accessory: '',
    colors: {
        'skin-parts': '#D1FFB6',
        'vest-color': '#BC7D64',
        'blouse-color': '#E91E63',
        'hair-color': '#262626',
        'lens-color': 'rgba(184, 134, 11, 0.7)', // Default lens color is now a semi-transparent brown
        'frame-color': '#C0C0C0'
    }
};

// --- UI HELPER FUNCTION (THIS WAS THE MISSING PIECE) ---
function manageColorPickers(activePickerId) {
    const allPickers = document.querySelectorAll('.color-picker-group');
    allPickers.forEach(picker => picker.classList.add('hidden'));
    if (activePickerId) {
        const activePicker = document.getElementById(activePickerId);
        if (activePicker) {
            activePicker.classList.remove('hidden');
        }
    }
}

// --- SVG AND COLOR FUNCTIONS ---
async function selectSvg(layer, svgPath) {
    if (!svgPath) {
        document.getElementById(`${layer}-preview`).innerHTML = '';
        avatar[layer] = '';
        return;
    }
    try {
        const response = await fetch(svgPath);
        if (!response.ok) { throw new Error(`File not found: ${svgPath}`); }
        const svgText = await response.text();
        document.getElementById(`${layer}-preview`).innerHTML = svgText;
        avatar[layer] = svgPath;
        applyAllColors(); // Apply colors every time a new SVG is loaded
    } catch (error) {
        console.error('Error loading SVG:', error);
    }
}

// --- MASTER SELECTION FUNCTIONS (with fix for remove) ---
function selectClothing(fileName) {
    // <<<< KEY FIX 2: Construct the full path OR an empty string >>>>
    const fullPath = fileName ? `assets/avatar_clothing/${fileName}` : '';
    selectSvg('clothing', fullPath);

    if (fileName === 'shirt_vest_explorer.svg') {
        manageColorPickers('picker-vest');
    } else if (fileName === 'blouse.svg') {
        manageColorPickers('picker-blouse');
    } else {
        manageColorPickers(null); // Hide for military shirt or when removed
    }
}

function selectHeadwear(fileName) {
    const fullPath = fileName ? `assets/avatar_headwear/${fileName}` : '';
    selectSvg('headwear', fullPath);

    if (fileName === 'beanie_hat.svg') {
        manageColorPickers('picker-beanie');
    } else if (fileName === 'hair_long_wavy.svg' || fileName === 'hair_short_curly.svg') {
        manageColorPickers('picker-hair');
    } else {
        manageColorPickers(null);
    }
}

// <<<< NEW Master Selection Function for Eyewear >>>>
function selectEyewear(fileName) {
    const fullPath = fileName ? `assets/avatar_eyewear/${fileName}` : '';
    selectSvg('eyewear', fullPath);

    // Manage visibility of the color pickers
    if (fileName === 'glasses_round.svg') {
        manageColorPickers('picker-glasses');
    } else {
        // Hide for any other type of glasses or when removed
        manageColorPickers(null);
    }
}

// --- ROBUST COLOR FUNCTIONS ---
function applyColorToElement(element, colorString) {
    if (colorString.startsWith('rgba')) {
        const parts = colorString.replace(/[rgba()]/g, '').split(',');
        const r = parts[0].trim();
        const g = parts[1].trim();
        const b = parts[2].trim();
        const a = parts[3].trim();
        element.setAttribute('fill', `rgb(${r},${g},${b})`);
        element.setAttribute('fill-opacity', a);
    } else {
        element.setAttribute('fill', colorString);
        element.removeAttribute('fill-opacity');
    }
}

// --- NEW HELPER FUNCTION for applying color precisely ---
function applyColorByGroupId(groupId, color) {
    const allPreviewDivs = document.querySelectorAll('.avatar-layer');
    for (const div of allPreviewDivs) {
        const groupElement = div.querySelector(`#${groupId}`);
        if (groupElement) {
            const partsToColor = groupElement.querySelectorAll('path, circle, ellipse, rect');
            partsToColor.forEach(part => {
                applyColorToElement(part, color);
            });
            // Once found and colored, exit the loop
            return;
        }
    }
}

// --- UPDATED changeColor FUNCTION ---
function changeColor(groupId, color) {
    avatar.colors[groupId] = color;
    applyColorByGroupId(groupId, color); // Use the new helper
}

// --- UPDATED applyAllColors FUNCTION ---
function applyAllColors() {
    for (const groupId in avatar.colors) {
        const color = avatar.colors[groupId];
        applyColorByGroupId(groupId, color); // Use the new helper
    }
}

// --- FUNCTION to switch tabs ---
function openTab(categoryName) {
    const allContent = document.querySelectorAll('.tab-content');
    allContent.forEach(content => content.classList.remove('active'));
    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(button => button.classList.remove('active'));
    const targetContent = document.getElementById('content-' + categoryName);
    if (targetContent) { targetContent.classList.add('active'); }
    const targetButton = document.getElementById('btn-' + categoryName);
    if (targetButton) { targetButton.classList.add('active'); }
}

// --- NAME GENERATOR SETUP AND FUNCTIONS ---
const nameAdjectives = ["Valiente", "Audaz", "Curioso", "Intrépido", "Sabio", "Rápido", "Sigiloso"];
const nameNouns = ["Explorador", "Botánico", "Guardián", "Aventurero", "Científico", "Rastreador"];
let currentGeneratedName = "Explorador Valiente";
let spinInterval;

function generateRandomName() {
    const adj = nameAdjectives[Math.floor(Math.random() * nameAdjectives.length)];
    const noun = nameNouns[Math.floor(Math.random() * nameNouns.length)];
    return `${adj} ${noun}`;
}

function spinNameGenerator() {
    playSound(slotMachineSound);
    
    const nameSpinner = document.getElementById('name-spinner');
    clearInterval(spinInterval); // Stop any previous spin

    // Spin for 1.5 seconds for a snappy feel
    spinInterval = setInterval(() => {
        nameSpinner.textContent = generateRandomName();
    }, 60); // Change name every 60ms

    setTimeout(() => {
        clearInterval(spinInterval);
        currentGeneratedName = generateRandomName();
        nameSpinner.textContent = currentGeneratedName;
    }, 1500); // Stop after 1.5 seconds
}

function confirmName() {
    localStorage.setItem('exploradorNombre', currentGeneratedName);
    document.getElementById('name-generator-modal').style.display = 'none';
    window.location.href = 'actividad1.html'; // Proceed to the activity
}

// --- REPLACED saveAndStart FUNCTION ---
// This function now opens the name generator modal if needed
function saveAndStart() {
    localStorage.setItem('exploradorAvatar', JSON.stringify(avatar));
    
    let playerName = localStorage.getItem('exploradorNombre');
    if (!playerName) {
        // If no name is saved, show the name generator instead of the prompt
        document.getElementById('name-generator-modal').style.display = 'flex';
        spinNameGenerator(); // Start with a spin
    } else {
        // If a name already exists, go straight to the activity
        window.location.href = 'actividad1.html';
    }
}

// --- FUNCTION TO ADD SOUNDS TO ALL INTERACTIVE ELEMENTS ---
function addSoundEffects() {
    const interactiveElements = document.querySelectorAll(
        '.back-button, .tab-button, .option-grid img, .color-swatch, .remove-btn, .cta-button'
    );
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => playSound(hoverSound));
        element.addEventListener('click', () => playSound(clickSound));
    });
}

// --- MAIN ONLOAD FUNCTION (FINAL CORRECTED LOGIC) ---
window.onload = async function() {
    const savedAvatar = localStorage.getItem('exploradorAvatar');
    if (savedAvatar) {
        avatar = JSON.parse(savedAvatar);
    }
    
    // 1. Load ALL SVG content first from the avatar object
    await selectSvg('base', avatar.base);
    await selectSvg('clothing', avatar.clothing);
    await selectSvg('headwear', avatar.headwear);
    await selectSvg('eyewear', avatar.eyewear);
    await selectSvg('accessory', avatar.accessory);
    
    // 2. NOW, with all SVGs loaded, apply the saved colors to them
    applyAllColors();
    
    // 3. FINALLY, set the correct UI state (active tab and visible color pickers)
    const initialClothing = avatar.clothing ? avatar.clothing.split('/').pop() : '';
    const initialHeadwear = avatar.headwear ? avatar.headwear.split('/').pop() : '';
    const initialEyewear = avatar.eyewear ? avatar.eyewear.split('/').pop() : '';

    selectClothing(initialClothing);
    selectHeadwear(initialHeadwear);
    selectEyewear(initialEyewear);

    openTab('base');
    addSoundEffects();
};
