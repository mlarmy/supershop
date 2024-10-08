let currentImageIndex = 0;
let imageElements = [];
let startTouchX = 0;  // Track the start position of the touch

function addClickListenersToImages() {
    imageElements = Array.from(document.querySelectorAll('.product-image'));
    console.log("Images selected for click events:", imageElements);

    imageElements.forEach((image, index) => {
        image.addEventListener('click', function() {
            console.log('Clicked on image:', this.id);

            // Set current image index
            currentImageIndex = index;

            // Show fullscreen container
            document.getElementById("fullscreen-container").style.display = "flex";

            // Set the clicked image src in fullscreen image
            document.getElementById("fullscreen-image").src = image.src;

            // Update the button states
            updateNavigationButtons();
        });
    });
}

// Update button states (disable/enable based on current image index)
function updateNavigationButtons() {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    // Disable previous button if it's the first image
    if (currentImageIndex === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    // Disable next button if it's the last image
    if (currentImageIndex === imageElements.length - 1) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }

    // Update button opacity based on whether they are enabled or disabled
    prevBtn.style.opacity = prevBtn.disabled ? 0.3 : 1;
    nextBtn.style.opacity = nextBtn.disabled ? 0.3 : 1;
}

// Close the fullscreen image when the close button is clicked
document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("fullscreen-container").style.display = "none";
});

// Show the previous image
document.getElementById("prev-btn").addEventListener("click", function() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
    }
    document.getElementById("fullscreen-image").src = imageElements[currentImageIndex].src;
    updateNavigationButtons();
});

// Show the next image
document.getElementById("next-btn").addEventListener("click", function() {
    if (currentImageIndex < imageElements.length - 1) {
        currentImageIndex++;
    }
    document.getElementById("fullscreen-image").src = imageElements[currentImageIndex].src;
    updateNavigationButtons();
});

// Swipe functionality for touch devices
function handleTouchStart(e) {
    const touch = e.touches[0];
    startTouchX = touch.clientX;  // Record the starting X position of the touch
}

function handleTouchMove(e) {
    // Prevent any default behavior while swiping (like scrolling)
    e.preventDefault();
}

function handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    const endTouchX = touch.clientX;
    const swipeDistance = endTouchX - startTouchX;  // Calculate the swipe distance

    if (Math.abs(swipeDistance) > 50) {  // Only handle swipe if distance is enough
        if (swipeDistance > 0) {
            // Swiped right, move to the previous image
            if (currentImageIndex > 0) {
                currentImageIndex--;
            }
        } else {
            // Swiped left, move to the next image
            if (currentImageIndex < imageElements.length - 1) {
                currentImageIndex++;
            }
        }
        // Update the fullscreen image and navigation buttons
        document.getElementById("fullscreen-image").src = imageElements[currentImageIndex].src;
        updateNavigationButtons();
    }
}

// Attach swipe event listeners to the fullscreen image container
const fullscreenContainer = document.getElementById("fullscreen-container");
fullscreenContainer.addEventListener("touchstart", handleTouchStart);
fullscreenContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
fullscreenContainer.addEventListener("touchend", handleTouchEnd);

// Mutation observer to detect dynamically added images
const imageContainer = document.getElementById("product-image-container");
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.addedNodes.length > 0) {
            addClickListenersToImages();
        }
    }
});

observer.observe(imageContainer, {
    childList: true,
    subtree: false
});

// Add initial click listeners if images are already present
addClickListenersToImages();
