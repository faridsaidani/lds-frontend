// Stripe payment integration for shopping cart

const stripePayment = (function() {
  // Stripe configuration
  const stripePublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Replace with your actual test key
  let stripe;
  let elements;
  let card;
  let paymentModal;
  let closeModalButton;
  let paymentForm;
  let cartItems = [];
  let totalAmount = 0;
  
  // Initialize Stripe
  function init() {
    try {
      stripe = Stripe(stripePublicKey);
      elements = stripe.elements();
      
      // Create payment modal if not exists
      createPaymentModal();
      
      console.log('Stripe payment initialized successfully');
    } catch (e) {
      console.error('Error initializing Stripe:', e);
    }
  }
  
  // Create payment modal
  function createPaymentModal() {
    // Check if payment modal already exists
    if (document.getElementById('payment-modal')) {
      return;
    }
    
    // Create modal element
    paymentModal = document.createElement('div');
    paymentModal.id = 'payment-modal';
    paymentModal.className = 'modal';
    
    // Create modal content
    paymentModal.innerHTML = `
      <div class="modal-content payment-modal-content">
        <span class="close-modal">&times;</span>
        <h2>Finaliser votre commande</h2>
        
        <div id="order-summary">
          <h3>Récapitulatif de la commande</h3>
          <div id="order-items"></div>
          <div id="order-total">
            <p>Total: <span>0.00 €</span></p>
          </div>
        </div>
        
        <form id="payment-form">
          <div class="form-group">
            <label for="cardholder-name">Nom</label>
            <input type="text" id="cardholder-name" required>
          </div>
          
          <div class="form-group">
            <label for="cardholder-email">Email</label>
            <input type="email" id="cardholder-email" required>
          </div>
          
          <div class="form-group">
            <label for="card-element">Informations de paiement</label>
            <div id="card-element" class="stripe-element">
              <!-- Stripe Elements will be inserted here -->
            </div>
            <div id="card-errors" role="alert"></div>
          </div>
          
          <div class="payment-footer">
            <p class="secure-payment">🔒 Paiement sécurisé</p>
            <button type="submit" id="submit-payment" class="btn btn-primary">
              Payer <span id="payment-amount">0.00 €</span>
            </button>
          </div>
        </form>
      </div>
    `;
    
    // Add modal to document
    document.body.appendChild(paymentModal);
    
    // Get modal elements
    closeModalButton = paymentModal.querySelector('.close-modal');
    paymentForm = document.getElementById('payment-form');
    
    // Add event listeners
    closeModalButton.addEventListener('click', hidePaymentModal);
    paymentForm.addEventListener('submit', handlePaymentSubmit);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === paymentModal) {
        hidePaymentModal();
      }
    });
  }
  
  // Initialize Stripe Card Element
  function initializeCardElement() {
    if (!elements || card) return;
    
    // Create card element
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    
    card = elements.create('card', { style: style });
    
    // Mount card element
    const cardElement = document.getElementById('card-element');
    if (cardElement) {
      card.mount('#card-element');
      
      // Handle real-time validation errors
      card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = '';
        }
      });
    }
  }
  
  // Show payment modal
  function showPaymentModal(items, total) {
    // Store cart items and total
    cartItems = items;
    totalAmount = total;
    
    // Update order summary
    updateOrderSummary();
    
    // Initialize card element if necessary
    if (!card && elements) {
      initializeCardElement();
    }
    
    // Show modal
    paymentModal.style.display = 'block';
  }
  
  // Hide payment modal
  function hidePaymentModal() {
    paymentModal.style.display = 'none';
  }
  
  // Update order summary in the payment modal
  function updateOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotalElement = document.querySelector('#order-total span');
    const paymentAmountElement = document.getElementById('payment-amount');
    
    // Clear order items
    orderItemsContainer.innerHTML = '';
    
    // Add each item to the summary
    cartItems.forEach(item => {
      const orderItem = document.createElement('div');
      orderItem.className = 'order-item';
      
      orderItem.innerHTML = `
        <div class="order-item-info">
          <div class="order-item-title">${item.name}</div>
          ${item.size ? `<div class="order-item-size">Taille: ${item.size}</div>` : ''}
          <div class="order-item-quantity">Quantité: ${item.quantity}</div>
        </div>
        <div class="order-item-price">${(item.price * item.quantity).toFixed(2)} €</div>
      `;
      
      orderItemsContainer.appendChild(orderItem);
    });
    
    // Update total amount
    if (orderTotalElement) {
      orderTotalElement.textContent = `${totalAmount.toFixed(2)} €`;
    }
    
    if (paymentAmountElement) {
      paymentAmountElement.textContent = `${totalAmount.toFixed(2)} €`;
    }
  }
  
  // Handle payment form submission
  async function handlePaymentSubmit(e) {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Votre panier est vide.');
      return;
    }
    
    // Get customer information
    const cardholderName = document.getElementById('cardholder-name').value;
    const cardholderEmail = document.getElementById('cardholder-email').value;
    
    // Validate form
    if (!cardholderName || !cardholderEmail) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    // Show loading state
    const submitButton = document.getElementById('submit-payment');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Traitement en cours...';
    
    // Clear previous errors
    const errorElement = document.getElementById('card-errors');
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    if (stripe && card) {
      try {
        // In a real implementation, you would call your backend API to create a payment intent
        // For this demo, we'll simulate it
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate a successful payment (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
          // Create order object
          const order = {
            customer_name: cardholderName,
            customer_email: cardholderEmail,
            total: totalAmount,
            items: cartItems,
            payment_method: 'card',
            timestamp: new Date().toISOString()
          };
          
          // Save order
          if (typeof saveOrder === 'function') {
            await saveOrder(order);
          } else {
            // Fallback if database API not available
            console.log('API not available, saving order to localStorage');
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
          }
          
          // Show success message
          alert(`Paiement réussi ! Merci pour votre commande, ${cardholderName}.`);
          
          // Clear cart
          if (typeof clearCart === 'function') {
            clearCart();
          }
          
          // Reset form
          paymentForm.reset();
          
          // Hide modal
          hidePaymentModal();
        } else {
          // Show error message
          if (errorElement) {
            errorElement.textContent = 'Erreur lors du traitement du paiement. Veuillez vérifier vos informations et réessayer.';
          } else {
            alert('Erreur lors du traitement du paiement. Veuillez vérifier vos informations et réessayer.');
          }
        }
      } catch (error) {
        console.error('Payment error:', error);
        if (errorElement) {
          errorElement.textContent = error.message || 'Une erreur s\'est produite lors du traitement du paiement.';
        }
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    } else {
      // Fallback if Stripe isn't initialized
      alert('Le système de paiement n\'est pas disponible actuellement. Veuillez réessayer plus tard.');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }
  
  // Public API
  return {
    init: init,
    showPaymentModal: showPaymentModal
  };
})();

// Initialize Stripe payment when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  stripePayment.init();
  
  // Make stripePayment available globally
  window.stripePayment = stripePayment;
});