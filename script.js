let cart = [];

// 🔄 LOADER
window.onload = function () {
    let loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.display = "none";
    }, 1000);

    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartUI();
};

// ➕ ADD TO CART
function addToCart(name, price, qtyId) {

    let qtyInput = document.getElementById(qtyId).value;
    let qty = Number(qtyInput);

    // ❌ HARD VALIDATION
    if (!Number.isFinite(qty) || qty < 1) {
        showToast("❌ Quantity must be 1 or more", "error");
        return;
    }

    qty = Math.floor(qty); // remove decimals

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    saveCart();
    updateCartUI();

    showToast(`✅ ${name} added`, "success");
}

// ❌ REMOVE ITEM
function removeItem(index) {
    let removedItem = cart[index].name;

    cart.splice(index, 1);
    saveCart();
    updateCartUI();

    showToast(`⚠️ ${removedItem} removed`, "warning");
}

// 🔄 UPDATE UI
function updateCartUI() {
    let list = document.getElementById("cart-list");
    list.innerHTML = "";

    let total = 0;
    let totalQty = 0;

    cart.forEach((item, index) => {
        let li = document.createElement("li");

        li.innerHTML = `
        ${item.name} x ${item.qty} = ₹${item.price * item.qty}
        <button class="remove" onclick="removeItem(${index})">❌</button>
        `;

        list.appendChild(li);

        total += item.price * item.qty;
        totalQty += item.qty;
    });

    document.getElementById("cart-count").innerText = totalQty;
    document.getElementById("total").innerText = "Total: ₹" + total;
}

// 💾 SAVE
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 💳 CHECKOUT
function checkout() {
    if (cart.length === 0) {
        showToast("❌ Cart empty!", "error");
        return;
    }
    window.location = "checkout.html";
}

// 🔔 TOAST
function showToast(message, type) {
    let toast = document.getElementById("toast");

    toast.innerText = message;
    toast.className = "show toast-" + type;

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 2500);
}

// 🔍 SEARCH FUNCTION
document.getElementById("searchInput").addEventListener("keyup", function(){

    let value = this.value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let text = card.innerText.toLowerCase();

        if(text.includes(value)){
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });

});

// voice

function startVoiceSearch() {

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = function(event) {

        let text = event.results[0][0].transcript;
        document.getElementById("searchInput").value = text;

        filterProducts(text);
    };

    recognition.onerror = function() {
        alert("Voice not supported or permission denied");
    };
}

function filterProducts(value){

    value = value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        let text = card.innerText.toLowerCase();

        if(text.includes(value)){
            card.style.display = "";
        }else{
            card.style.display = "none";
        }

    });
}

// typing search connect
document.getElementById("searchInput").addEventListener("keyup", function(){
    filterProducts(this.value);
});