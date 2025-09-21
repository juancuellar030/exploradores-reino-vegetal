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
        'lens-color': 'rgba(50, 50, 50, 0.5)'
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

// --- SVG AND COLOR FUNCTIONS (with fix for remove) ---
async function selectSvg(layer, svgPath) {
    // <<<< KEY FIX 1: Handle the "remove" case gracefully >>>>
    if (!svgPath) {
        document.getElementById(`${layer}-preview`).innerHTML = '';
        avatar[layer] = '';
        return; // Exit the function cleanly
    }
    try {
        const response = await fetch(svgPath);
        if (!response.ok) { throw new Error(`File not found: ${svgPath}`); }
        const svgText = await response.text();
        document.getElementById(`${layer}-preview`).innerHTML = svgText;
        avatar[layer] = svgPath;
        applyAllColors();
    } catch (error) {
        console.error('Error loading SVG:', error);
        const previewBox = document.getElementById(`${layer}-preview`);
        if (previewBox) {
            const fileName = svgPath.split('/').pop();
            previewBox.innerHTML = `<p style="font-size:12px; color:red; text-align:center; margin-top: 80px;">Error al cargar:<br>${fileName}</p>`;
        }
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

function changeColor(groupId, color) {
    avatar.colors[groupId] = color;
    const groupElement = document.querySelector(`#${groupId}`);
    if (groupElement) {
        const partsToColor = groupElement.querySelectorAll('path, circle, ellipse, rect');
        partsToColor.forEach(part => {
            part.style.fill = color;
        });
    }
}

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

// --- MAIN ONLOAD FUNCTION ---
window.onload = async function() {
    const savedAvatar = localStorage.getItem('exploradorAvatar');
    if (savedAvatar) {
        avatar = JSON.parse(savedAvatar);
    }
    
    // Load all the selected SVG parts from memory
    await selectSvg('base', avatar.base);
    await selectSvg('clothing', avatar.clothing);
    await selectSvg('headwear', avatar.headwear);
    await selectSvg('eyewear', avatar.eyewear);
    await selectSvg('accessory', avatar.accessory);
    
    applyAllColors();
    openTab('base');
    addSoundEffects();

    // Set the initial state of the color pickers
    // This is a more robust way to set the initial state
    const initialClothing = avatar.clothing.split('/').pop();
    const initialHeadwear = avatar.headwear.split('/').pop();
    selectClothing(initialClothing);
    selectHeadwear(initialHeadwear);
};
