// API Base URL - change this if your server runs on a different port or host
const API_BASE_URL = "http://localhost:3000/api";

// Function to get all products
function getProducts() {
  return fetch(`${API_BASE_URL}/products`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get products by category
function getProductsByCategory(category) {
  return fetch(`${API_BASE_URL}/products/category/${category}`).then(
    (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  );
}

// Function to add a product
function addProduct(product) {
  // If product is a FormData object, send as is
  if (product instanceof FormData) {
    return fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      body: product,
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  }

  // Otherwise convert to JSON
  return fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to update a product
function updateProduct(id, product) {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to delete a product
function deleteProduct(id) {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to save an order
function saveOrder(order) {
  return fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get all orders
function getOrders() {
  return fetch(`${API_BASE_URL}/orders`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get a specific order
function getOrder(id) {
  return fetch(`${API_BASE_URL}/orders/${id}`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to update an order
function updateOrder(id, order) {
  return fetch(`${API_BASE_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get all events
function getEvents() {
  return fetch(`${API_BASE_URL}/events`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get events by type (upcoming, solidarity, past)
function getEventsByType(type) {
  return fetch(`${API_BASE_URL}/events/type/${type}`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to add an event
function addEvent(event) {
  // If event is a FormData object, send as is
  if (event instanceof FormData) {
    return fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      body: event,
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  }

  // Otherwise convert to JSON
  return fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get a specific event
function getEvent(id) {
  return fetch(`${API_BASE_URL}/events/${id}`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to update an event
function updateEvent(id, event) {
  return fetch(`${API_BASE_URL}/events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to delete an event
function deleteEvent(id) {
  return fetch(`${API_BASE_URL}/events/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to save event registration
function saveRegistration(registration) {
  return fetch(`${API_BASE_URL}/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registration),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get all registrations
function getRegistrations() {
  return fetch(`${API_BASE_URL}/registrations`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get registrations by event
function getRegistrationsByEvent(eventId) {
  return fetch(`${API_BASE_URL}/registrations/event/${eventId}`).then(
    (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  );
}

// Function to delete a registration
function deleteRegistration(id) {
  return fetch(`${API_BASE_URL}/registrations/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to save donation
function saveDonation(donation) {
  return fetch(`${API_BASE_URL}/donations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(donation),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get all donations
function getDonations() {
  return fetch(`${API_BASE_URL}/donations`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get donations by type
function getDonationsByType(type) {
  return fetch(`${API_BASE_URL}/donations/type/${type}`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to delete a donation
function deleteDonation(id) {
  return fetch(`${API_BASE_URL}/donations/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to save contact message
function saveMessage(message) {
  return fetch(`${API_BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get all messages
function getMessages() {
  return fetch(`${API_BASE_URL}/messages`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get unread messages
function getUnreadMessages() {
  return fetch(`${API_BASE_URL}/messages/unread`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get a specific message
function getMessage(id) {
  return fetch(`${API_BASE_URL}/messages/${id}`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to update a message
function updateMessage(id, updates) {
  return fetch(`${API_BASE_URL}/messages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to delete a message
function deleteMessage(id) {
  return fetch(`${API_BASE_URL}/messages/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get recent activities
function getRecentActivities() {
  return fetch(`${API_BASE_URL}/activities`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to log into the admin dashboard - UPDATE THIS FUNCTION
// Function to log into the admin dashboard
function adminLogin(credentials) {
  return fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    // Store in localStorage as a fallback
    localStorage.setItem(
      "demoAdminAuth",
      JSON.stringify({
        username: credentials.username,
        role: "admin",
        timestamp: new Date().toISOString(),
      })
    );

    return response.json();
  });
}

// Function to check admin authentication status
function checkAdminAuth() {
  return fetch(`${API_BASE_URL}/admin/check-auth`, {
    method: "GET",
    credentials: "include", // This is already correct
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Not authenticated");
    }
    return response.json();
  });
}

// Function to log out from the admin dashboard
function adminLogout() {
  return fetch(`${API_BASE_URL}/admin/logout`, {
    method: "POST",
    credentials: "include", // This is already correct
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    return response.json();
  });
}

// Use localStorage as a fallback when API is not available
// These functions are called from main.js when API calls fail

// Function to save event registration to localStorage
function saveEventRegistration(data) {
  console.log("Saving event registration to localStorage:", data);
  const registrations = JSON.parse(
    localStorage.getItem("eventRegistrations") || "[]"
  );
  registrations.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("eventRegistrations", JSON.stringify(registrations));
}

// Function to save financial donation to localStorage
function processFinancialDonation(data) {
  console.log("Saving financial donation to localStorage:", data);
  const donations = JSON.parse(
    localStorage.getItem("financialDonations") || "[]"
  );
  donations.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("financialDonations", JSON.stringify(donations));
}

// Function to save clothing donation to localStorage
function processClothingDonation(data) {
  console.log("Saving clothing donation to localStorage:", data);
  const donations = JSON.parse(
    localStorage.getItem("clothingDonations") || "[]"
  );
  donations.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("clothingDonations", JSON.stringify(donations));
}

// Function to save food donation to localStorage
function processFoodDonation(data) {
  console.log("Saving food donation to localStorage:", data);
  const donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");
  donations.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("foodDonations", JSON.stringify(donations));
}

// Function to save contact form to localStorage
function processContactForm(data) {
  console.log("Saving contact form to localStorage:", data);
  const contacts = JSON.parse(localStorage.getItem("contactRequests") || "[]");
  contacts.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("contactRequests", JSON.stringify(contacts));
}
