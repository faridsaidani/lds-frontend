class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
    this.total = 0;
    this.init();
  }

  init() {
    this.updateCartCount();
    this.loadProducts();
    this.setupCartModal();
    this.setupCartIcon();
    this.calculateTotal();
  }

  loadProducts() {
    const productsGrid = document.querySelector(".products-grid");
    if (!productsGrid) return;

    // Display loading message
    productsGrid.innerHTML = "<p>Chargement des produits...</p>";

    // Get products from the database
    getProducts()
      .then((products) => {
        // Clear products container
        productsGrid.innerHTML = "";

        // Add each product to the grid
        products.forEach((product) => {
          const productCard = this.createProductCard(product);
          productsGrid.appendChild(productCard);
        });

        // Setup filter buttons
        this.setupFilterButtons();
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        productsGrid.innerHTML =
          "<p>Impossible de charger les produits. Veuillez réessayer plus tard.</p>";
      });
  }

  createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-category", product.category);

    card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price.toFixed(2)} €</div>
                <div class="product-sizes">
                    ${this.getSizesHTML(product.sizes)}
                </div>
                <div class="product-description">${product.description}</div>
                <button class="add-to-cart" data-id="${
                  product.id
                }">Ajouter au panier</button>
            </div>
        `;

    // Add event listener to add to cart button
    const addToCartBtn = card.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", () => {
      const selectedSize = card.querySelector(
        ".size-option.selected"
      )?.textContent;
      if (!selectedSize && product.sizes.length > 0) {
        alert("Veuillez sélectionner une taille");
        return;
      }

      this.addToCart(product, selectedSize);
    });

    // Add event listeners to size options
    const sizeOptions = card.querySelectorAll(".size-option");
    sizeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        // Remove selected class from all options
        sizeOptions.forEach((opt) => opt.classList.remove("selected"));
        // Add selected class to clicked option
        option.classList.add("selected");
      });
    });

    return card;
  }

  getSizesHTML(sizes) {
    if (!sizes || sizes.length === 0) {
      return "";
    }

    return sizes
      .map(
        (size) => `
            <div class="size-option">${size}</div>
        `
      )
      .join("");
  }

  setupFilterButtons() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (!filterBtns.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterBtns.forEach((b) => b.classList.remove("active"));
        // Add active class to clicked button
        btn.classList.add("active");

        // Get filter value
        const filter = btn.getAttribute("data-filter");

        // Filter products
        this.filterProducts(filter);
      });
    });
  }

  filterProducts(category) {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      if (
        category === "all" ||
        card.getAttribute("data-category") === category
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  addToCart(product, selectedSize) {
    // Check if product already exists in cart with same size
    const existingItemIndex = this.items.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingItemIndex !== -1) {
      // Update quantity
      this.items[existingItemIndex].quantity++;
    } else {
      // Add new item
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: 1,
      });
    }

    // Save cart to localStorage
    this.saveCart();

    // Update cart UI
    this.updateCartCount();
    this.updateCartItems();
    this.calculateTotal();

    // Show confirmation
    alert(
      `"${product.name}"${
        selectedSize ? ` (Taille: ${selectedSize})` : ""
      } a été ajouté au panier.`
    );
  }

  removeFromCart(index) {
    this.items.splice(index, 1);
    this.saveCart();
    this.updateCartCount();
    this.updateCartItems();
    this.calculateTotal();
  }

  updateQuantity(index, delta) {
    this.items[index].quantity += delta;

    // Remove item if quantity is 0
    if (this.items[index].quantity <= 0) {
      this.removeFromCart(index);
      return;
    }

    this.saveCart();
    this.updateCartCount();
    this.updateCartItems();
    this.calculateTotal();
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  updateCartCount() {
    const cartCount = document.querySelector(".cart-count");
    if (!cartCount) return;

    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
  }

  setupCartIcon() {
    const cartIcon = document.querySelector(".cart-icon");
    if (!cartIcon) return;

    cartIcon.addEventListener("click", () => {
      this.updateCartItems();
      this.calculateTotal();
      const cartModal = document.getElementById("cart-modal");
      cartModal.style.display = "block";
    });
  }

  setupCartModal() {
    const cartModal = document.getElementById("cart-modal");
    if (!cartModal) return;

    // Close modal when clicking on X
    const closeBtn = cartModal.querySelector(".close-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        cartModal.style.display = "none";
      });
    }

    // Close modal when clicking outside
    window.addEventListener("click", (event) => {
      if (event.target === cartModal) {
        cartModal.style.display = "none";
      }
    });

    // Empty cart button
    const emptyCartBtn = document.getElementById("empty-cart");
    if (emptyCartBtn) {
      emptyCartBtn.addEventListener("click", () => {
        this.emptyCart();
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById("checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        this.checkout();
      });
    }
  }

  updateCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) return;

    // Clear container
    cartItemsContainer.innerHTML = "";

    // If cart is empty
    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = "<p>Votre panier est vide.</p>";
      return;
    }

    // Add each item to the cart
    this.items.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    ${
                      item.size
                        ? `<div class="cart-item-size">Taille: ${item.size}</div>`
                        : ""
                    }
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="cart-item-price">${(
                  item.price * item.quantity
                ).toFixed(2)} €</div>
                <button class="cart-item-remove">X</button>
            `;

      cartItemsContainer.appendChild(cartItem);

      // Add event listeners to buttons
      const decreaseBtn = cartItem.querySelector(".decrease");
      decreaseBtn.addEventListener("click", () => {
        this.updateQuantity(index, -1);
      });

      const increaseBtn = cartItem.querySelector(".increase");
      increaseBtn.addEventListener("click", () => {
        this.updateQuantity(index, 1);
      });

      const removeBtn = cartItem.querySelector(".cart-item-remove");
      removeBtn.addEventListener("click", () => {
        this.removeFromCart(index);
      });
    });
  }

  calculateTotal() {
    this.total = this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const totalElement = document.querySelector("#cart-total span");
    if (totalElement) {
      totalElement.textContent = `${this.total.toFixed(2)} €`;
    }
  }

  emptyCart() {
    this.items = [];
    this.saveCart();
    this.updateCartCount();
    this.updateCartItems();
    this.calculateTotal();
  }

  checkout() {
    if (this.items.length === 0) {
      alert("Votre panier est vide.");
      return;
    }
    
    // Check if Stripe is available
    if (window.stripePayment) {
      // Show Stripe payment modal with the cart items and total
      window.stripePayment.showPaymentModal(this.items, this.total);
      
      // Hide cart modal
      const cartModal = document.getElementById("cart-modal");
      if (cartModal) {
        cartModal.style.display = "none";
      }
    } else {
      // Fallback to the old checkout method if Stripe is not available
      this.legacyCheckout();
    }
  }
  
  // Rename the old checkout method to legacyCheckout
  legacyCheckout() {
    // Get customer information
    const customerName = prompt("Votre nom:") || "Anonymous";
    const customerEmail = prompt("Votre email:") || "anonymous@example.com";

    // Create order object
    const order = {
      customer_name: customerName,
      customer_email: customerEmail,
      total: this.total,
      items: this.items,
    };

    // Show loading message
    alert("Traitement de votre commande...");

    // Check if saveOrder function is available
    if (typeof saveOrder === "function") {
      // Submit order to backend
      saveOrder(order)
        .then((response) => {
          alert(
            `Merci pour votre commande ! Total: ${this.total.toFixed(2)} €`
          );
          this.emptyCart();

          // Hide cart modal
          const cartModal = document.getElementById("cart-modal");
          if (cartModal) {
            cartModal.style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Error processing order:", error);
          alert(
            "Erreur lors du traitement de votre commande. Veuillez réessayer plus tard."
          );
        });
    } else {
      // Fallback if database API not available
      console.log("API not available, saving order to localStorage");
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push({
        ...order,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("orders", JSON.stringify(orders));

      alert(
        `Merci pour votre commande ! Total: ${this.total.toFixed(
          2
        )} € (Mode hors ligne)`
      );
      this.emptyCart();

      // Hide cart modal
      const cartModal = document.getElementById("cart-modal");
      if (cartModal) {
        cartModal.style.display = "none";
      }
    }
  }
}

// Initialize the shopping cart
document.addEventListener("DOMContentLoaded", () => {
  const cart = new ShoppingCart();
});

// Global cart instance for external access
let globalCart;

// Initialize the shopping cart
document.addEventListener("DOMContentLoaded", () => {
  globalCart = new ShoppingCart();
});

// Function to get cart items for external use (like Stripe)
function getCartItems() {
  return globalCart ? globalCart.items : 
    JSON.parse(localStorage.getItem("cart")) || [];
}

// Function to update cart icon
function updateCartIcon() {
  const cartCount = document.querySelector(".cart-count");
  if (!cartCount) return;
  
  const items = JSON.parse(localStorage.getItem("cart")) || [];
  const count = items.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
}

// Global checkout function for the button
function checkout() {
  if (globalCart) {
    globalCart.checkout();
  } else {
    // Fallback if cart not initialized
    const items = getCartItems();
    
    if (items.length === 0) {
      alert('Votre panier est vide.');
      return;
    }
    
    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity, 
      0
    );
    
    if (window.stripePayment) {
      window.stripePayment.showPaymentModal(items, totalPrice);
    } else {
      alert('Le système de paiement n\'est pas disponible actuellement.');
    }
  }
}

// Clear cart after successful payment
function clearCart() {
  if (globalCart) {
    globalCart.emptyCart();
  } else {
    localStorage.removeItem('cart');
    updateCartIcon();
  }
}

// Expose functions to global scope
window.checkout = checkout;
window.clearCart = clearCart;
window.getCartItems = getCartItems;