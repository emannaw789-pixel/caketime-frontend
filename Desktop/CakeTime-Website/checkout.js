function confirmOrder() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let address = document.getElementById("address").value;

  let cake = document.getElementById("cake").value;
  let qty = document.getElementById("qty").value;

  let pricePerCake = 1200;
  let total = pricePerCake * qty;

  let orderID = "CT" + Math.floor(Math.random() * 100000);
  let deliveryTime = "45–60 minutes";

  // MESSAGE TO BUSINESS (YOU)
  let businessMsg = `
🧾 NEW ORDER - CakeTime

Order ID: ${orderID}

Name: ${name}
Phone: ${phone}
Address: ${address}

Cake: ${cake}
Qty: ${qty}
Total: ${total} PKR

Delivery: ${deliveryTime}
`;

  // MESSAGE TO CUSTOMER
  let customerMsg = `
🎉 Order Confirmed - CakeTime

Hi ${name}! Your order is confirmed ✅

Order ID: ${orderID}

Cake: ${cake}
Qty: ${qty}
Total: ${total} PKR

🚚 Delivery Time: ${deliveryTime}

Thank you for ordering from CakeTime 🍰
`;

  let businessNumber = "92XXXXXXXXXX";

  let customerNumber = phone.replace(/^0/, "92");

  let businessURL = `https://wa.me/${businessNumber}?text=${encodeURIComponent(businessMsg)}`;

  let customerURL = `https://wa.me/${customerNumber}?text=${encodeURIComponent(customerMsg)}`;

  window.open(businessURL, "_blank");

  setTimeout(() => {
    window.open(customerURL, "_blank");
  }, 1500);
}