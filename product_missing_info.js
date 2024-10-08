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

// Function to handle the product click (redirect to the product details page)
function handleProductClick(productId) {
    window.location.href = `/templates/show_product_details.html?productId=${productId}`;
}

// Handle onclick card 
function shareButtonClick(productId, productTitle) {
    if (navigator.share) {
        // Mobile share functionality using the Web Share API
        navigator.share({
            title: `✨ Check out ${productTitle}! ✨`,
            url: `/templates/show_product_details.html?productId=${productId}`,
            text: `
            🚀 I found this amazing product: 
            📦 **${productTitle}**  
            🎉 You should check it out!  
            🔗 [View Product](/templates/show_product_details.html?productId=${productId})
            `
        })
        .then(() => {
            console.log('Product shared successfully!');
        })
        .catch((error) => {
            console.error('Error sharing:', error);
        });
    } else {
        // Fallback for non-supporting browsers (copy to clipboard)
        const shareUrl = `${window.location.origin}/templates/show_product_details.html?productId=${productId}`;
        const tempInput = document.createElement('textarea');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
}

// Handle save button click
function saveButtonClick(product_id){
    alert("Save button clicked!");
}
