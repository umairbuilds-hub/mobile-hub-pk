const products = [
  { id: 1, name: "Mobile Cover", category: "Covers", price: 500, icon: "📱" },
  {
    id: 2,
    name: "Fast Charger",
    category: "Chargers",
    price: 1200,
    icon: "🔌",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    category: "Earbuds",
    price: 2200,
    icon: "🎧",
  },
  {
    id: 4,
    name: "Power Bank 10000mAh",
    category: "Power Banks",
    price: 3000,
    icon: "🔋",
  },
  { id: 5, name: "USB-C Cable", category: "Cables", price: 350, icon: "🔗" },
  {
    id: 6,
    name: "Smart Watch",
    category: "Wearables",
    price: 2500,
    icon: "⌚",
  },
];

let cart = [];

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");

function showProducts(searchText = "") {
  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.category.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (filtered.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  productList.innerHTML = filtered
    .map(
      (product) => `
    <article class="product-card">
      <div class="product-image">${product.icon}</div>
      <h3>${product.name}</h3>
      <p class="muted">${product.category}</p>
      <p class="price">Rs. ${product.price.toLocaleString("en-PK")}</p>
      <button class="add-button" data-product-id="${product.id}">
        Add to Cart
      </button>
    </article>
  `,
    )
    .join("");
}

function addToCart(id) {
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id, quantity: 1 });
  }

  showCart();
}

function changeQuantity(id, amount) {
  const item = cart.find((item) => item.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id !== id);
  }

  showCart();
}

function showCart() {
  const cartItems = document.getElementById("cart-items");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cart.reduce((sum, item) => {
    const product = products.find((product) => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent =
    total.toLocaleString("en-PK");

  cartItems.innerHTML = cart
    .map((item) => {
      const product = products.find((product) => product.id === item.id);

      return `
      <div class="cart-row">
        <span>${product.name} × ${item.quantity}</span>
        <span>
          Rs. ${(product.price * item.quantity).toLocaleString("en-PK")}
          <button data-change-id="${item.id}" data-amount="-1">−</button>
          <button data-change-id="${item.id}" data-amount="1">+</button>
        </span>
      </div>
    `;
    })
    .join("");

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  }
}

productList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (button) addToCart(Number(button.dataset.productId));
});

document.getElementById("cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-change-id]");
  if (button) {
    changeQuantity(
      Number(button.dataset.changeId),
      Number(button.dataset.amount),
    );
  }
});

searchInput.addEventListener("input", () => {
  showProducts(searchInput.value);
});

document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please add a product to your cart first.");
    return;
  }

  const orderLines = cart.map((item) => {
    const product = products.find((product) => product.id === item.id);
    return `${product.name} x ${item.quantity} = Rs. ${product.price * item.quantity}`;
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find((product) => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  const message = [
    "Assalam-o-Alaikum! I want to place an order:",
    "",
    ...orderLines,
    "",
    `Total: Rs. ${total}`,
    "",
    "Please confirm availability and delivery charges.",
  ].join("\n");

  // Replace this example with your own WhatsApp number.
  const whatsappNumber = "923001234567";

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank",
  );
});

showProducts();
showCart();
