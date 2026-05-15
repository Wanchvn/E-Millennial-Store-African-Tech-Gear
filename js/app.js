// js/app.js
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  updateCartCountUI();
  displayProducts();
  attachCartModalEvents();
  attachValidationEvents();
  updateCartUI();
  mobileNavToggle();
});

function displayProducts() {
  const container = document.getElementById("productsContainer");
  if (!container) return;
  container.innerHTML = "";
  productsArray.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    const isInCart = cartItems.some(item => item.id === product.id);
    const btnText = isInCart ? "Remove from Cart" : "Add to Cart";
    const extraClass = isInCart ? "remove-mode" : "";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-name">${product.name}</div>
      <div class="product-price">GH₵${product.price.toLocaleString()}</div>
      <button class="add-to-cart ${extraClass}" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.image}">${btnText}</button>
    `;
    container.appendChild(card);
  });
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const product = productsArray.find(p => p.id === id);
      const isCurrentlyRemove = btn.classList.contains("remove-mode");
      if (isCurrentlyRemove) {
        removeFromCart(id);
        btn.innerText = "Add to Cart";
        btn.classList.remove("remove-mode");
      } else {
        addToCart(product);
        btn.innerText = "Remove from Cart";
        btn.classList.add("remove-mode");
      }
      updateCartUI();
      updateCartCountUI();
      updateAllProductButtonsState();
    });
  });
}
function updateAllProductButtonsState() {
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    const id = btn.dataset.id;
    const exists = cartItems.some(item => item.id === id);
    if (exists) {
      btn.innerText = "Remove from Cart";
      btn.classList.add("remove-mode");
    } else {
      btn.innerText = "Add to Cart";
      btn.classList.remove("remove-mode");
    }
  });
}
function updateCartUI() {
  const cartListContainer = document.getElementById("cartItemsList");
  if (!cartListContainer) return;
  if (cartItems.length === 0) {
    cartListContainer.innerHTML = `<div class="empty-cart">Your cart is empty ✨</div>`;
  } else {
    cartListContainer.innerHTML = "";
    cartItems.forEach(item => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="item-info"><h4>${item.product.name}</h4><div>GH₵${item.product.price.toLocaleString()}</div></div>
        <div class="item-controls">
          <button class="qty-decr" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-incr" data-id="${item.id}">+</button>
          <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="item-price">GH₵${(item.product.price * item.quantity).toLocaleString()}</div>
      `;
      cartListContainer.appendChild(div);
    });
    document.querySelectorAll(".qty-decr").forEach(btn => btn.addEventListener("click", (e) => {
      const id = btn.dataset.id; updateQuantity(id, -1);
      updateCartUI(); updateCartCountUI(); updateAllProductButtonsState();
    }));
    document.querySelectorAll(".qty-incr").forEach(btn => btn.addEventListener("click", (e) => {
      const id = btn.dataset.id; updateQuantity(id, 1);
      updateCartUI(); updateCartCountUI(); updateAllProductButtonsState();
    }));
    document.querySelectorAll(".remove-item").forEach(btn => btn.addEventListener("click", (e) => {
      const id = btn.dataset.id; removeFromCart(id);
      updateCartUI(); updateCartCountUI(); updateAllProductButtonsState();
    }));
  }
  const totalSpan = document.getElementById("cartTotalAmount");
  if (totalSpan) totalSpan.innerText = `GH₵${getCartTotal().toLocaleString()}`;
}
let cartModal = document.getElementById("cartModal");
let summaryModal = document.getElementById("summaryModal");

function attachCartModalEvents() {
  const cartBtn = document.getElementById("cartBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const continueBtn = document.getElementById("continueShoppingBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  cartBtn.addEventListener("click", () => { updateCartUI(); toggleCartModal(true); });
  if(closeModalBtn) closeModalBtn.addEventListener("click", () => toggleCartModal(false));
  if(continueBtn) continueBtn.addEventListener("click", () => toggleCartModal(false));
  window.addEventListener("click", (e) => { if(e.target === cartModal) toggleCartModal(false); });
  checkoutBtn.addEventListener("click", async () => {
    if(cartItems.length === 0) { showToast("Cart empty", "error"); return; }
    if(!validateFormFields()) { showToast("Fix form errors", "error"); return; }
    const total = getCartTotal();
    const email = document.getElementById("email").value;
    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    payWithPaystack(total, email, name, phone, (success) => {
      if(success) {
        toggleCartModal(false);
        showSummaryModalWithData(name, [...cartItems]);
        clearCart();
        updateCartUI();
        updateCartCountUI();
        updateAllProductButtonsState();
        document.getElementById("fullName").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
      }
    });
  });
}
function toggleCartModal(show) {
  if(show) cartModal.classList.add("active");
  else cartModal.classList.remove("active");
}
function showSummaryModalWithData(customerName, purchasedItems) {
  const summaryBody = document.getElementById("summaryContent");
  let itemsHtml = `<p class="success-msg">🎉 Thank you, ${customerName}! Your order is confirmed.</p><ul style="margin-top:12px;">`;
  purchasedItems.forEach(item => {
    itemsHtml += `<li>${item.product.name} x ${item.quantity} — GH₵${(item.product.price * item.quantity).toLocaleString()}</li>`;
  });
  itemsHtml += `</ul>`;
  summaryBody.innerHTML = itemsHtml;
  summaryModal.classList.add("active");
  document.getElementById("summaryOkBtn").addEventListener("click", () => {
    summaryModal.classList.remove("active");
    location.reload(); // clear all, reset store
  }, { once: true });
}
function mobileNavToggle() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");
  if(menuBtn) menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("mobile-open");
  });
}