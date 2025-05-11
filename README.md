# Ligue Des Souvenirs - Website

## Overview

"Ligue Des Souvenirs" (League of Memories) is a charity/non-profit organization website designed to help underprivileged individuals through various solidarity actions and events. The website provides an interactive platform where users can learn about the organization, register for events, make donations, purchase products from the solidarity shop, and contact the organization.

## Features

### Public Pages
- **Home Page**: Introduction to the organization, upcoming events, and solidarity actions
- **Events Page**: Browse upcoming, solidarity, and past events with registration functionality
- **Donation Page**: Make financial donations, donate clothes, or food with Stripe payment integration
- **Shop Page**: Purchase products with proceeds going to charity, featuring a shopping cart and Stripe checkout
- **Contact Page**: Send messages to the organization and find contact information

### Admin Dashboard
- **Overview**: View statistics about events, donations, shop sales, and contacts
- **Events Management**: Create, edit, and delete events
- **Registrations Management**: View and manage event registrations
- **Donations Management**: Track and manage financial, clothing, and food donations
- **Shop Management**: Manage products, stock, and orders
- **Messages Management**: View and respond to contact messages
- **Statistics**: Visual analytics of organization activities

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design for mobile and desktop devices
- Stripe API integration for payment processing
- LocalStorage for data persistence in demo mode

### Backend Integration
- RESTful API architecture for communication with the backend
- Supports JSON data exchange
- Fallback to LocalStorage when API is unavailable

## Project Structure

```
lds-frontend/
├── assets/                  # Static assets
│   ├── Evenements/          # Event images
│   └── Logo/                # Logo and icon images
├── css/                     # Stylesheets
│   ├── style.css            # Main stylesheet
│   ├── responsive.css       # Responsive design rules
│   └── boutique.css         # Shop-specific styles
├── js/                      # JavaScript files
│   ├── main.js              # Main application logic
│   ├── database.js          # API communication and data handling
│   ├── cart.js              # Shopping cart functionality
│   ├── donation.js          # Donation processing
│   └── stripe-payment.js    # Stripe payment integration
├── dashboard/               # Admin dashboard
│   ├── css/
│   │   └── dashboard.css    # Dashboard styles
│   ├── js/
│   │   └── dashboard.js     # Dashboard functionality
│   ├── index.html           # Dashboard main page
│   └── login.html           # Admin login page
├── Documentation/           # Project documentation
├── index.html               # Homepage
├── evenements.html          # Events page
├── dons.html                # Donations page
├── boutique.html            # Shop page
├── contact.html             # Contact page
└── merci.html               # Thank you/confirmation page
```

## Installation and Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local development server or web hosting

### Setup Instructions
1. Clone the repository
   ```
   git clone https://github.com/your-username/lds-frontend.git
   ```

2. Navigate to the project directory
   ```
   cd lds-frontend
   ```

3. Open the project in a code editor of your choice

4. Launch with a local development server
   - You can use VS Code's Live Server extension
   - Or any other local server like http-server

5. API Configuration (if available)
   - Update the API_BASE_URL in `js/database.js` to point to your backend server
   ```javascript
   const API_BASE_URL = "http://your-api-url/api";
   ```

## Usage

### Visitor Features
1. **Browsing Events**
   - View upcoming, solidarity, and past events
   - Register for events by filling out the registration form

2. **Making Donations**
   - Financial donations: processed through Stripe
   - Clothing donations: schedule a pickup or drop-off
   - Food donations: organize a food drive or drop-off

3. **Shopping**
   - Browse products by category
   - Add items to cart
   - Complete checkout with Stripe payment

4. **Contacting the Organization**
   - Send messages through the contact form
   - Find physical address and contact information

### Admin Features
1. **Login**
   - Access the admin dashboard through `/dashboard/login.html`
   - Default credentials (for demonstration): username: admin, password: admin

2. **Managing Content**
   - Create, edit, and delete events
   - View and manage registrations
   - Track donations and contributions
   - Manage shop products and orders
   - Read and respond to messages
   - View statistics and analytics

## Development

### Adding New Events
To add a new event, use the admin dashboard or modify the database directly.

### Adding New Products
Products can be added through the admin dashboard interface or by directly modifying the database.

### Customizing Styles
Modify the CSS files in the `/css` directory to customize the look and feel of the website.

### Extending Functionality
1. Add new JavaScript files for specific features
2. Include them in the relevant HTML files
3. Update the existing code to integrate with new features

## Payment Integration

The website uses Stripe for payment processing. To configure for production:

1. Replace the test key in `js/donation.js` and `js/stripe-payment.js`:
   ```javascript
   const stripePublicKey = 'your_live_stripe_public_key';
   ```

2. Configure your backend API to handle Stripe payment intents and confirmations securely.

## Demo Mode

The application can run in demo mode without a backend by utilizing the browser's LocalStorage to persist data. This is automatically enabled when the API is unavailable.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

All rights reserved. This project is proprietary and confidential.

## Contact

Ligue Des Souvenirs  
123 Rue de l'Association  
75000 Paris, France  
Email: contact@LigueDesSouvenirs.org  
Phone: +33 1 23 45 67 89
