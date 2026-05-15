// js/cart.js
let cartItems = []; // { id, quantity, product }

function loadCartFromStorage() {
  const stored = localStorage.getItem("millennial_cart");
  if (stored) {
    try {
      cartItems = JSON.parse(stored);
    } catch(e) { cartItems = []; }
  } else cartItems = [];
}
function saveCartToStorage() {
  localStorage.setItem("millennial_cart", JSON.stringify(cartItems));
}
function addToCart(product) {
  const existing = cartItems.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ id: product.id, quantity: 1, product: product });
  }
  saveCartToStorage();
  updateCartCountUI();
  showToast("Added to cart", "success");
  if (typeof updateCartUI === "function") updateCartUI();
}
function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartCountUI();
  if (typeof updateCartUI === "function") updateCartUI();
  showToast("Item removed", "info");
}
function updateQuantity(productId, delta) {
  const idx = cartItems.findIndex(i => i.id === productId);
  if (idx !== -1) {
    let newQty = cartItems[idx].quantity + delta;
    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      cartItems[idx].quantity = newQty;
      saveCartToStorage();
      updateCartCountUI();
      if (typeof updateCartUI === "function") updateCartUI();
    }
  }
}
function getCartTotal() {
  return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}
function updateCartCountUI() {
  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const countSpan = document.getElementById("cartCount");
  if (countSpan) countSpan.innerText = totalItems;
}
function clearCart() {
  cartItems = [];
  saveCartToStorage();
  updateCartCountUI();
  if (typeof updateCartUI === "function") updateCartUI();
}
function showToast(msg, type = "default") {
  const toastEl = document.getElementById("toast");
  toastEl.innerText = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2000);
}