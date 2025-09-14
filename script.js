// This script is specifically for the Welcome Page (index.html)

// Wait until all the HTML content is loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTION ---
    // Find the important elements on the page we want to interact with
    const welcomeContainer = document.querySelector('.welcome-container');
    const activityCard1 = document.querySelector('a.activity-card');
    const disabledCard = document.querySelector('.activity-card.disabled');

    // --- ENTRY ANIMATION ---
    // Trigger the fade-in animation for the main container
    if (welcomeContainer) {
        // We add the 'loaded' class after a very short delay (100ms)
        // This ensures the browser applies the initial styles before starting the transition
        setTimeout(() => {
            welcomeContainer.classList.add('loaded');
        }, 100);
    }

    // --- INTERACTIVITY FOR DISABLED CARD ---
    // If the disabled card exists, add a click listener to it
    if (disabledCard) {
        disabledCard.addEventListener('click', () => {
            // Show a friendly pop-up message explaining that the activity is not ready yet
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
