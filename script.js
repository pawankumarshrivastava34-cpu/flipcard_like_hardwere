let cart = [];

// 🔄 LOADER SAFE FIX
window.onload = function () {

    let loader = document.getElementById("loader");

    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.transition = "0.4s ease";

            setTimeout(() => {
                loader.style.display = "none";
            }, 400);
        }, 600);
    }

    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartUI();
};

// ➕ ADD TO CART
function addToCart(name, price, qtyId, btn) {

    let qtyInput = document.getElementById(qtyId);
    let qty = Number(qtyInput ? qtyInput.value : 1);

    if (!Number.isFinite(qty) || qty < 1) {
        showToast("❌ Invalid quantity", "error");
        return;
    }

    qty = Math.floor(qty);

    let existing = cart.find(i => i.name === name);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    saveCart();
    updateCartUI();

    showToast("✅ " + name + " added", "success");
    showCenterMsg("🛒 Added!");

    if (btn) flyToCart(btn);
}

// ❌ REMOVE ITEM (FIX EMPTY CART BUG)
function removeItem(index) {

    let name = cart[index].name;

    cart.splice(index, 1);

    saveCart();
    updateCartUI();

    showToast("⚠️ Removed " + name, "warning");
    showCenterMsg("🗑️ Removed!");

    if (cart.length === 0) {
        setTimeout(() => {
            showToast("🛒 Cart Empty", "error");
            showCenterMsg("Cart Empty!");
        }, 300);
    }
}

// 🔄 CART UPDATE
function updateCartUI() {

    let list = document.getElementById("cart-list");
    if (!list) return;

    list.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach((item, i) => {

        let li = document.createElement("li");

        li.innerHTML = `
            ${item.name} x ${item.qty} = ₹${item.price * item.qty}
            <button onclick="removeItem(${i})">❌</button>
        `;

        list.appendChild(li);

        total += item.price * item.qty;
        count += item.qty;
    });

    document.getElementById("cart-count").innerText = count;
    document.getElementById("total").innerText = "Total: ₹" + total;
}

// 💾 SAVE CART
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 💳 CHECKOUT
function checkout() {
    if (cart.length === 0) {
        showToast("❌ Cart Empty", "error");
        showCenterMsg("Cart Empty!");
        return;
    }
    window.location = "checkout.html";
}

// 🔔 TOAST
function showToast(msg, type) {

    let toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = msg;
    toast.className = "show toast-" + type;

    setTimeout(() => {
        toast.className = "";
    }, 2000);
}

// 🟢 CENTER MESSAGE
function showCenterMsg(text) {

    let box = document.getElementById("centerMsg");
    if (!box) return;

    box.innerText = text;
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 1200);
}

// 🔍 SEARCH
document.addEventListener("DOMContentLoaded", () => {

    let search = document.getElementById("searchInput");

    if (search) {
        search.addEventListener("keyup", function () {

            let value = this.value.toLowerCase();

            document.querySelectorAll(".card").forEach(card => {
                let text = card.innerText.toLowerCase();
                card.style.display = text.includes(value) ? "" : "none";
            });
        });
    }
});

// 🎤 VOICE SEARCH
function startVoiceSearch() {

    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = function (event) {
        document.getElementById("searchInput").value =
            event.results[0][0].transcript;
    };
}

// ⭐ RATING FIX SAFE
document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".rating").forEach(rating => {

        let product = rating.dataset.product;
        let saved = localStorage.getItem("rating_" + product) || 0;

        for (let i = 1; i <= 5; i++) {

            let star = document.createElement("span");
            star.innerHTML = "★";

            if (i <= saved) star.classList.add("active");

            star.addEventListener("click", () => {
                localStorage.setItem("rating_" + product, i);
                location.reload();
            });

            rating.appendChild(star);
        }
    });
});

// ✨ FLY ANIMATION
function flyToCart(btn) {

    let cartIcon = document.querySelector(".cart");
    let fly = document.getElementById("flyCart");

    if (!cartIcon || !fly) return;

    let r1 = btn.getBoundingClientRect();
    let r2 = cartIcon.getBoundingClientRect();

    fly.style.display = "block";
    fly.style.left = r1.left + "px";
    fly.style.top = r1.top + "px";

    setTimeout(() => {
        fly.style.left = r2.left + "px";
        fly.style.top = r2.top + "px";
        fly.style.opacity = "0";
    }, 50);

    setTimeout(() => {
        fly.style.display = "none";
        fly.style.opacity = "1";
    }, 800);
}
