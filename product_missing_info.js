function productCardProcessing() {
    // Select all product cards
    const productCards = document.querySelectorAll('.product_card');
    
    // Loop through each product card
    productCards.forEach(function (card) {
        // Find the discount container and the discount amount inside the card
        const discountContainer = card.querySelector('.discount_container');
        const discountAmount = card.querySelector('.product_discount_percentage');

        // Check if the discount amount exists and is equal to 0
        if (discountAmount && discountAmount.textContent.trim() === '-0%') {
            // Hide the discount container
            discountContainer.style.display = 'none';
        }
    });
}

// Handle onclick card 
function handleProductClick(productId) {
    window.location.href = `/templates/show_product_details.html?productId=${productId}`;
}

// Share button click from card
function shareButtonClick(productId) {
    if (navigator.share) {
        navigator.share({
            title: 'SuperShop Product!',
            url: `/templates/show_product_details.html?productId=${productId}`,
            text: 'Share this amazing product on your social media!'
        })
        .then(() => {
            console.log('Product shared successfully!');
        })
        .catch((error) => {
            console.error('Error sharing:', error);
        });
    } else {
        const shareUrl = `${window.location.origin}/templates/show_product_details.html?productId=${productId}`;
        const tempInput = document.createElement('textarea');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
}