// Donation modals handling with Stripe integration

document.addEventListener('DOMContentLoaded', function() {
  // Stripe configuration
  const stripePublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Replace with your actual test key
  let stripe;
  let elements;
  let card;
  
  try {
    stripe = Stripe(stripePublicKey);
    elements = stripe.elements();
  } catch (e) {
    console.error('Error initializing Stripe:', e);
  }
  
  // Get donation buttons
  const donationButtons = document.querySelectorAll('.donation-btn');
  
  // Get all modals
  const moneyModal = document.getElementById('money-modal');
  const clothesModal = document.getElementById('clothes-modal');
  const foodModal = document.getElementById('food-modal');
  
  // Get close buttons
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Add click event to donation buttons
  donationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const donationType = this.getAttribute('data-type');
      
      if (donationType === 'money') {
        moneyModal.style.display = 'block';
        // Initialize Stripe elements if not already done
        if (elements && !card) {
          initializeStripeElements();
        }
      } else if (donationType === 'clothes') {
        clothesModal.style.display = 'block';
      } else if (donationType === 'food') {
        foodModal.style.display = 'block';
      }
    });
  });
  
  // Initialize Stripe Elements
  function initializeStripeElements() {
    if (!elements) return;
    
    // Create and mount the Card Element
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        },
        padding: '12px 15px',
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    
    card = elements.create('card', { style: style });
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
  
  // Add click event to close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === moneyModal) {
      moneyModal.style.display = 'none';
    } else if (event.target === clothesModal) {
      clothesModal.style.display = 'none';
    } else if (event.target === foodModal) {
      foodModal.style.display = 'none';
    }
  });
  
  // Handle amount buttons in money donation form
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('custom-amount');
  let selectedAmount = 0;
  
  amountButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      amountButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Set the selected amount
      selectedAmount = parseInt(this.getAttribute('data-amount'));
      
      // Clear custom amount
      if (customAmountInput) {
        customAmountInput.value = '';
      }
    });
  });
  
  // Handle custom amount focus
  if (customAmountInput) {
    customAmountInput.addEventListener('focus', function() {
      // Remove active class from amount buttons
      amountButtons.forEach(btn => btn.classList.remove('active'));
      selectedAmount = 0;
    });
    
    customAmountInput.addEventListener('input', function() {
      selectedAmount = parseInt(this.value) || 0;
    });
  }
  
  // Handle form submissions
  const donationForm = document.getElementById('donation-form');
  const clothesForm = document.getElementById('clothes-form');
  const foodForm = document.getElementById('food-form');
  
  // Money donation form submission
  if (donationForm) {
    donationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get selected amount or custom amount
      let amount = 0;
      const activeButton = document.querySelector('.amount-btn.active');
      
      if (activeButton) {
        amount = parseInt(activeButton.getAttribute('data-amount'));
      } else if (customAmountInput && customAmountInput.value) {
        amount = parseInt(customAmountInput.value);
      }
      
      if (amount <= 0) {
        alert('Veuillez sélectionner ou saisir un montant valide.');
        return;
      }
      
      // Get form data
      const name = document.getElementById('nom-donateur').value;
      const email = document.getElementById('email-donateur').value;
      
      // Show loading state
      const submitButton = donationForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Traitement en cours...';
      
      // If Stripe is available, use it for payment processing
      if (stripe && card) {
        try {
          // In a real implementation, you would call your backend to create a payment intent
          // For this demo, we'll simulate it
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Simulate a successful payment (80% chance of success)
          const success = Math.random() > 0.2;
          
          if (success) {
            // Show success message
            alert(`Merci pour votre don de ${amount}€, ${name}! Un reçu a été envoyé à ${email}.`);
            
            // Reset form
            donationForm.reset();
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Close modal
            moneyModal.style.display = 'none';
            
            // Record donation
            processDonation(amount, name, email);
          } else {
            // Show error message
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = "Erreur lors du traitement du paiement. Veuillez vérifier vos informations et réessayer.";
          }
        } catch (error) {
          console.error('Payment error:', error);
          const errorElement = document.getElementById('card-errors');
          if (errorElement) {
            errorElement.textContent = error.message || "Une erreur s'est produite lors du traitement du paiement.";
          }
        } finally {
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      } else {
        // Fallback to original behavior if Stripe isn't available
        alert(`Merci pour votre don de ${amount}€, ${name}! Un reçu a été envoyé à ${email}.`);
        
        // Reset form
        donationForm.reset();
        amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Close modal
        moneyModal.style.display = 'none';
        
        // Record donation
        processDonation(amount, name, email);
      }
    });
  }
  
  // Helper function to process donation
  function processDonation(amount, name, email) {
    // Log the donation
    console.log({
      type: 'monetary',
      amount: amount,
      name: name,
      email: email,
      description: `Don en ligne de ${amount}€`
    });
    
    // Call saveDonation API if available
    if (typeof saveDonation === 'function') {
      saveDonation({
        type: 'monetary',
        amount: amount,
        name: name,
        email: email,
        description: `Don en ligne de ${amount}€`
      })
      .then(response => {
        console.log('Donation saved:', response);
      })
      .catch(error => {
        console.error('Error saving donation:', error);
      });
    }
  }
  
  // Clothes donation form submission
  if (clothesForm) {
    clothesForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('nom-vetements').value;
      const email = document.getElementById('email-vetements').value;
      const description = document.getElementById('description-vetements').value;
      
      // Process donation (mock)
      alert(`Merci pour votre don de vêtements, ${name}! Nous vous contacterons bientôt pour organiser la collecte.`);
      
      // Reset form
      this.reset();
      
      // Close modal
      clothesModal.style.display = 'none';
      
      // In a real app, you would send this data to your server
      console.log({
        type: 'clothes',
        name: name,
        email: email,
        description: description
      });
      
      // Call saveDonation API if available
      if (typeof saveDonation === 'function') {
        saveDonation({
          type: 'clothes',
          amount: null,
          name: name,
          email: email,
          description: description
        })
        .then(response => {
          console.log('Donation saved:', response);
        })
        .catch(error => {
          console.error('Error saving donation:', error);
        });
      }
    });
  }
  
  // Food donation form submission
  if (foodForm) {
    foodForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('nom-alimentaire').value;
      const email = document.getElementById('email-alimentaire').value;
      const message = document.getElementById('message-alimentaire').value;
      
      // Process donation (mock)
      alert(`Merci pour votre intérêt à faire un don alimentaire, ${name}! Nous vous contacterons bientôt.`);
      
      // Reset form
      this.reset();
      
      // Close modal
      foodModal.style.display = 'none';
      
      // In a real app, you would send this data to your server
      console.log({
        type: 'food',
        name: name,
        email: email,
        description: message
      });
      
      // Call saveDonation API if available
      if (typeof saveDonation === 'function') {
        saveDonation({
          type: 'food',
          amount: null,
          name: name,
          email: email,
          description: message
        })
        .then(response => {
          console.log('Donation saved:', response);
        })
        .catch(error => {
          console.error('Error saving donation:', error);
        });
      }
    });
  }
});