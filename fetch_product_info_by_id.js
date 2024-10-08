import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
let isUser = false;
let userEmail;

// Firebase authentication state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    isUser = true;
    userEmail = user.email;
  } else {
    isUser = false;
  }
});

// Function to get the productId from the URL
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("productId");
}

// On page load, retrieve the productId and display product details
window.onload = function () {
  const productId = getProductIdFromURL();
  if (productId) {
    fetchProductDetails(productId);
  } else {
    console.error("Product ID not found in the URL");
  }
};

// Function to fetch product details (replace with your actual implementation)
function fetchProductDetails(productId) {
    const productRef = ref(db, `products/${productId}`);
    
    // Using onValue to fetch data
    onValue(productRef, (snapshot) => {
      const product = snapshot.val();
      
      if (product) {
        // Check if product.images exists and is an array
        if (product.images) {
          const imageContainer = document.getElementById("product-image-container");
          
          // Clear previous images
          imageContainer.innerHTML = ''; // Clear the container before adding new images
          for (const imgId in product.images) {
            const imgUri = product.images[imgId];
            const imageCreated = document.createElement("img"); // Corrected this line
            
            imageCreated.src = imgUri;
            imageCreated.classList.add("product-image");
            imageContainer.appendChild(imageCreated);
          }
        }
  
        // Set product details
        document.getElementById("product-title").textContent = product.title;
        document.getElementById("product-description").textContent = product.description;
        document.getElementById("product-price").innerText = `${product.currency} ${product.price.toLocaleString()}`;

        if(product.return_policy && product.return_days != 0 && product.return_days > 0){
          document.getElementById("day-of-return").textContent = product.return_days;
          document.getElementById("return-policy-content-p").textContent = `${product.return_policy}`;
          document.getElementById("return-policy").style.display = "block";
        }else{
          document.getElementById("return-policy").style.display = "none";
        }

        if(product.delivery_price){
          document.getElementById("standard-delivery-option-place-charge").textContent = `৳ ${product.delivery_price}`;
        }else{
          document.getElementById("standard-delivery-option-place-charge").textContent = `Free`;
        }
        if(product.delivery_days && product.delivery_days > 0){
          document.getElementById("delivery-days").textContent = `${product.delivery_days}`;
        }else{
          document.getElementById("delivery-days").textContent = `3`;
        }

        if(product.free_delivery_place){
          document.getElementById("free-delivery-place-ocntainer").style.display = "flex";
          document.getElementById("delivery-option-place").textContent = `${product.free_delivery_place}`;
        }else{
          document.getElementById("free-delivery-place-ocntainer").style.display = "none";
          document.getElementById("delivery-option-place").textContent = `No free delivery places`;
        }

        if(product.stock && product.stock != 0){
          document.getElementById("product-stock").style.display = "flex";
          document.getElementById("stock-status-p").style.display = "flex";
          document.getElementById("out-of-stock").style.display = "none";
        }else{
          document.getElementById("product-stock").style.display = "flex";
          document.getElementById("stock-status-p").style.display = "none";
          document.getElementById("out-of-stock").style.display = "flex";
        }

        if(product.seller_id){
          const sellerRef = ref(db, `users/${product.seller_id}`);
          onValue(sellerRef, (value) => {
            const seller = value.val();
            document.getElementById("uploader-name").textContent = seller.name;
            document.getElementById("product-uploader").style.display = "flex";
          });
        }

        if(product.ratings){
          document.getElementById("ratings-container").style.display = "flex";
          document.getElementById("product-ratings-container").style.display = "block";
          extractRatings(productId);
        }else{
          document.getElementById("product-ratings-container").style.display = "none";
        }

        if(product.discount_percentage != 0 && product.discount_amount != 0){
            document.getElementById("product-discouint-percentage").textContent = `-${product.discount_percentage}%`;
            document.getElementById("product-discount-amount").textContent = `${product.discount_amount.toLocaleString()}`;
        }
      } else {
        console.error("Product not found");
      }
    }, (error) => {
      console.error("Error fetching product details:", error);
    });
  }  


// Extract ratings
function extractRatings(product_id) {
  const ratingsRef = ref(db, `products/${product_id}/ratings/comments_star`);
  
  onValue(ratingsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      let totalStars = 0;
      let totalRatings = 0;

      // Separate variables for each star rating
      let oneStarCount = 0;
      let twoStarCount = 0;
      let threeStarCount = 0;
      let fourStarCount = 0;
      let fiveStarCount = 0;

      for (let key in data) {
        const rating = data[key];
        const star = rating.star;
        
        // Update total stars and count
        totalStars += star;
        totalRatings += 1;
        
        // Count how many times each star appears
        if (star === 1) oneStarCount++;
        if (star === 2) twoStarCount++;
        if (star === 3) threeStarCount++;
        if (star === 4) fourStarCount++;
        if (star === 5) fiveStarCount++;
      }

      // Calculate the average rating
      const averageRating = totalStars / totalRatings;
      updateStarRating(averageRating)
      document.getElementById("average-rating").textContent = averageRating.toFixed(1);

      document.getElementById("ratings-count").textContent = `(${totalRatings})`;  
      document.getElementById("reviews-ratings-count").textContent = `${totalRatings} Ratings`;    
      

    } else {
      console.log("No ratings found.");
    }
  });
}
// Ratings star color based on average rating
function updateStarRating(averageRating) {
  // Round the average rating to the nearest half or whole number
  const roundedRating = Math.round(averageRating * 2) / 2;
  
  
}