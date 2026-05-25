/* =======================
   CONFIGURATION
======================= */
const WHATSAPP_PHONE = "03346976292";

/* =======================
   GLOBAL STATE
======================= */
let cart = {};
let discount = 0;

/* =======================
   ADD TO CART FUNCTION
======================= */
function order(itemName, price, id) {
    if (cart[id]) {
        cart[id].qty++;
    } else {
        const originalItem = items.find(i => i.id === id);
        cart[id] = {
            id,
            name: itemName,
            price,
            qty: 1,
            img: originalItem ? originalItem.img : ""
        };
    }

    showToast(itemName + " added 🍰");
    renderItems();
    updateCartUI();
}

/* =======================
   CONFIRM ORDER (FIXED)
======================= */
function confirmOrder() {

    const name = document.getElementById('dlvName').value.trim();
    const phone = document.getElementById('dlvPhone').value.trim();
    const address = document.getElementById('dlvAddress').value.trim();
    const city = document.getElementById('dlvCity').value;
    const payment = document.getElementById('dlvPayment').value;
    const notes = document.getElementById('dlvNotes').value.trim();

    let valid = true;

    if (!name) {
        document.getElementById('errName').classList.add('show');
        valid = false;
    }
    if (!phone) {
        document.getElementById('errPhone').classList.add('show');
        valid = false;
    }
    if (!address) {
        document.getElementById('errAddress').classList.add('show');
        valid = false;
    }
    if (!city) {
        document.getElementById('errCity').classList.add('show');
        valid = false;
    }

    if (!valid) return;

    /* =======================
       SEND TO BACKEND
    ======================= */
    fetch("https://caketime-backend-production.up.railway.app/orders") {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customer: name,
            phone,
            address,
            city,
            payment,
            notes,
            cart
        })
    });

    /* =======================
       BUILD WHATSAPP MESSAGE
    ======================= */
    let subtotal = 0;

    let message = `*NEW ORDER - CakeTime PRO*%0A`;
    message += `--------------------------%0A`;
    message += `*Customer:* ${name}%0A`;
    message += `*Phone:* ${phone}%0A`;
    message += `*Address:* ${address}, ${city}%0A`;
    message += `--------------------------%0A`;

    for (let id in cart) {
        let item = cart[id];
        let itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        message += `• ${item.name} x${item.qty} = Rs ${itemTotal.toLocaleString()}%0A`;
    }

    const finalTotal = Math.round(subtotal * (1 - discount));

    if (discount > 0) {
        message += `%0A*Discount Applied!*%0A`;
    }

    message += `%0A*TOTAL: Rs ${finalTotal.toLocaleString()}*%0A`;
    message += `--------------------------%0A`;
    message += `*Notes:* ${notes || "None"}`;

    /* =======================
       OPEN WHATSAPP
    ======================= */
    const url = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + message;
    window.open(url, "_blank");

    /* =======================
       RESET & UI UPDATE
    ======================= */
    closeDeliveryModal();

    cart = {};
    discount = 0;

    renderItems();
    updateCartUI();

    showTracking(name, address, city, payment, notes);
    showToast("🎉 Order placed successfully!");
}

/* =======================
   RENDER PRODUCTS
======================= */
function renderItems() {

    const q = (document.getElementById('searchInput').value || '').toLowerCase();

    const filtered = items.filter(it =>
        (currentCat === 'all' || it.cat === currentCat) &&
        it.name.toLowerCase().includes(q)
    );

    document.getElementById('itemGrid').innerHTML = filtered.map(it => {
        const inCart = !!cart[it.id];

        return `
        <div class="card">
            ${it.badge ? `<div class="card-badge">${it.badge === 'popular' ? '🔥 Popular' : '✨ New'}</div>` : ''}
            <img src="${it.img}" alt="${it.name}" />
            <div class="card-info">
                <div class="card-name">${it.name}</div>
                <div class="card-bottom">
                    <span class="price">Rs ${it.price.toLocaleString()}</span>
                    <button class="add-btn ${inCart ? 'added' : ''}"
                        onclick="order('${it.name}', ${it.price}, ${it.id})">
                        <i class="fas ${inCart ? 'fa-check' : 'fa-plus'}"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

/* =======================
   TOAST MESSAGE
======================= */
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
