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

const firebaseConfig = {
    apiKey: "AIzaSyDXl_4DpPjg_W-Kxly8dFFFwb53irmOntE",
    authDomain: "supershop-26b35.firebaseapp.com",
    databaseURL: "https://supershop-26b35-default-rtdb.firebaseio.com",
    projectId: "supershop-26b35",
    storageBucket: "supershop-26b35.appspot.com",
    messagingSenderId: "848422254720",
    appId: "1:848422254720:web:c1dfced4d1525d2e7cce65",
    measurementId: "G-576GF34SFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let isUser = false;
let uid;

// Authentication state observer
onAuthStateChanged(auth, authStateChanged => {
  if (authStateChanged) {
    isUser = true;
    console.log("User signed in:", auth.currentUser.email);
    uid = auth.currentUser.uid;
  } else {
    isUser = false;
    console.log("User signed out");
  }
});

// js/save_product.js
function saveButtonClick(product_id) {
    if (!isUser) {
        window.location.href = "login.html";
        return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
        alert("User ID not available. Please sign in again.");
        return;
    }

    const productSaveRef = ref(db, `users/${uid}/saved_products/${product_id}`);
    const saveProductIcon = document.querySelector(`#saveProduct_${product_id} i`);

    // Check if the product is already saved
    get(productSaveRef).then((snapshot) => {
        if (snapshot.exists()) {
            // Product is saved, so remove it (unsave it)
            set(productSaveRef, null)
                .then(() => {
                    // Update the icon to regular (unsaved) and remove the rose color
                    saveProductIcon.classList.remove("fa-solid", "saved-icon");
                    saveProductIcon.classList.add("fa-regular");
                    alert("Product unsaved.");
                })
                .catch((error) => {
                    console.error("Error unsaving product: ", error);
                    alert("Failed to unsave the product.");
                });
        } else {
            // Product is not saved, so save it
            set(productSaveRef, {
                saved_at: new Date().toISOString(),
                product_id: product_id,
            })
                .then(() => {
                    // Update the icon to solid (saved) and add the rose color
                    saveProductIcon.classList.remove("fa-regular");
                    saveProductIcon.classList.add("fa-solid", "saved-icon");
                    alert("Product saved successfully!");
                })
                .catch((error) => {
                    console.error("Error saving product: ", error);
                    alert("Failed to save the product.");
                });
        }
    });
}


function updateSaveIcons() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const savedProductsRef = ref(db, `users/${uid}/saved_products/`);

    // Retrieve saved products from the database
    onValue(savedProductsRef, (snapshot) => {
        const savedProducts = snapshot.val() || {};

        // Iterate over each product and update the icon based on whether it's saved
        for (const product_id in savedProducts) {
            const saveProductIcon = document.querySelector(`#saveProduct_${product_id} i`);

            if (saveProductIcon) {
                // If product is saved, show the solid bookmark icon
                saveProductIcon.classList.remove("fa-regular");
                saveProductIcon.classList.add("fa-solid");
            }
        }
    });
}


// Attach to the window object to make it accessible globally
window.saveButtonClick = saveButtonClick;
window.updateSaveIcons = updateSaveIcons;
