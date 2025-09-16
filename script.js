// This script is specifically for the Welcome Page (index.html)
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTION (UPDATED) ---
    const bannerContainer = document.querySelector('.banner-container'); // Changed this line
    const activityCard1 = document.querySelector('a.activity-card');
    const disabledCard = document.querySelector('.activity-card.disabled');
    const backLayer = document.querySelector('#back-layer');   // <-- ADD THIS
    const frontLayer = document.querySelector('#front-layer'); // <-- ADD THIS

     // --- ENTRY ANIMATION ---
    if (bannerContainer) {
        setTimeout(() => {
            // Trigger the banner animation
            bannerContainer.classList.add('loaded');
            
            // Trigger the background animation
            if (backLayer && frontLayer) {
                backLayer.classList.add('visible');   // <-- ADD THIS
                frontLayer.classList.add('visible'); // <-- ADD THIS
            }
        }, 100);
    }
    
    // --- INTERACTIVITY FOR DISABLED CARD ---
    if (disabledCard) {
        disabledCard.addEventListener('click', () => {
            alert('¡Esta aventura estará disponible muy pronto!');
        });
    }

    // --- SOUND EFFECTS FOR ACTIVE CARD (Optional but fun!) ---
    // You will need to create an 'assets/sounds/' folder and add these audio files.
    // You can find free sound effects on websites like Pixabay or Freesound.
    if (activityCard1) {
        try {
            // Create new Audio objects. The browser will load these files.
            const hoverSound = new Audio('assets/sounds/ui-hover.mp3'); // A soft "swoosh" sound
            const clickSound = new Audio('assets/sounds/ui-click.mp3'); // A positive "confirm" sound

            // Play a sound when the user's mouse enters the card area
            activityCard1.addEventListener('mouseenter', () => {
                hoverSound.currentTime = 0; // Rewind the sound to the start
                hoverSound.play();
            });

            // Play a sound when the user clicks the card
            activityCard1.addEventListener('click', () => {
                clickSound.play();
            });

        } catch (error) {
            console.warn("Could not load sound files. Make sure they are in the correct 'assets/sounds/' folder.", error);
        }
    }
});
