// API Base URL - update to the PHP backend
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

// Function to get a specific product
function getProduct(id) {
  return fetch(`${API_BASE_URL}/products/${id}`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to add a product (Admin only)
function addProduct(product) {
  // If product is a FormData object, send as is
  if (product instanceof FormData) {
    return fetchWithAdminAuth(`${API_BASE_URL}/products`, {
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
  return fetchWithAdminAuth(`${API_BASE_URL}/products`, {
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

// Function to update a product (Admin only)
function updateProduct(id, product) {
  return fetchWithAdminAuth(`${API_BASE_URL}/products/${id}`, {
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

// Function to delete a product (Admin only)
function deleteProduct(productId) {
  // First check if we have the delete function available from the API
  if (typeof deleteProductApi !== 'function') {
    return Promise.reject(new Error('API function deleteProductApi is not available'));
  }
  
  return deleteProductApi(productId);
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

// Function to get all orders (Admin only)
function getOrders() {
  return fetchWithAdminAuth(`${API_BASE_URL}/orders`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get a specific order
function getOrder(id, email) {
  // Check if we need to add email for customer access
  const url = email 
    ? `${API_BASE_URL}/orders/${id}?email=${encodeURIComponent(email)}` 
    : `${API_BASE_URL}/orders/${id}`;
    
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to update order status (Admin only)
function updateOrder(id, order) {
  return fetchWithAdminAuth(`${API_BASE_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: order.status }),
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

// Function to add an event (Admin only)
function addEvent(event) {
  // If event is a FormData object, send as is
  if (event instanceof FormData) {
    return fetchWithAdminAuth(`${API_BASE_URL}/events`, {
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
  return fetchWithAdminAuth(`${API_BASE_URL}/events`, {
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

// Function to update an event (Admin only)
function updateEvent(id, event) {
  return fetchWithAdminAuth(`${API_BASE_URL}/events/${id}`, {
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

// Function to delete an event (Admin only)
function deleteEvent(id) {
  console.log("Deleting event with ID:", id);
  return fetchWithAdminAuth(`${API_BASE_URL}/events/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Update or add this function to database.js
function saveRegistration(registrationData) {
  console.log("Saving registration:", registrationData);
  
  // Ensure data is in the correct format expected by API
  const formattedData = {
    event_id: parseInt(registrationData.event_id),
    name: registrationData.name,
    email: registrationData.email,
    phone: registrationData.phone
  };
  
  console.log("Formatted registration data:", formattedData);
  
  return fetch(`${API_BASE_URL}/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedData)
  }).then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        // Try to parse as JSON, but if it's not JSON, use the raw text
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Failed to save registration");
        } catch (e) {
          throw new Error(`Server error: ${text || response.status}`);
        }
      });
    }
    return response.json();
  });
}

// Function to get all registrations (Admin only)
function getRegistrations() {
  return fetchWithAdminAuth(`${API_BASE_URL}/registrations`).then((response) => {
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

// Function to get all donations (Admin only)
function getDonations() {
  return fetchWithAdminAuth(`${API_BASE_URL}/donations`).then((response) => {
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

// Function to get all messages (Admin only)
function getMessages() {
  return fetchWithAdminAuth(`${API_BASE_URL}/messages`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to get unread messages (Admin only)
function getUnreadMessages() {
  return fetchWithAdminAuth(`${API_BASE_URL}/messages/unread`).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to update a message (Admin only)
function updateMessage(id, updates) {
  return fetchWithAdminAuth(`${API_BASE_URL}/messages/${id}`, {
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

// Cookie management functions
function setCookie(name, value, days, path = '/') {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  
  // Set secure flag in production
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${secure}; samesite=strict`;
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

function deleteCookie(name, path = '/') {
  setCookie(name, '', -1, path);
}

// Function to log into the admin dashboard
// Function to log into the admin dashboard
function adminLogin(credentials) {
  console.log("🔐 Attempting login for user:", credentials.username);
  console.log("🌐 Login URL:", `${API_BASE_URL}/admin/login`);
  
  return fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then(async (response) => {
    console.log("📊 Login response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Login failed:", errorText);
      try {
        // Try to parse as JSON if possible
        const errorJson = JSON.parse(errorText);
        console.error("❌ Login error details:", errorJson);
      } catch (e) {
        // If not JSON, show as text
        console.error("❌ Login error response (text):", errorText);
      }
      throw new Error("Invalid credentials");
    }
    
    try {
      const data = await response.json();
      console.log("✅ Login successful, response data:", JSON.stringify(data, null, 2));
      
      if (!data.token) {
        console.error("❌ No token in response:", data);
        throw new Error("Authentication failed: No token received");
      }
      
      // Store token in cookie - expires based on server response or default to 1 day
      const expiresDate = data.expires_at ? new Date(data.expires_at) : null;
      const now = new Date();
      const expiryDays = expiresDate ? 
        Math.max(1, Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24))) : 1;
      
      console.log(`🍪 Setting auth cookie, expires in ${expiryDays} days`);
      setCookie('authToken', data.token, expiryDays);
      
      // Store user info
      const userInfo = {
        userId: data.user_id,
        username: data.username,
        role: data.role,
        expiresAt: data.expires_at
      };
      setCookie('userInfo', JSON.stringify(userInfo), expiryDays);
      
      console.log("💾 Auth data stored in cookies");
      return data;
    } catch (e) {
      console.error("❌ Error parsing login response:", e);
      throw new Error("Invalid response format");
    }
  });
}

// Function to check admin authentication status
function checkAdminAuth() {
  const token = getCookie('authToken');
  
  console.log("🔍 Checking admin authentication status");
  console.log(`🔑 Auth token exists: ${!!token}`);
  
  if (!token) {
    console.error("❌ No auth token found in cookies");
    return Promise.reject(new Error("Not authenticated"));
  }
  
  console.log("🌐 Sending auth check request");
  return fetch(`${API_BASE_URL}/admin/check-auth`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  }).then(async (response) => {
    console.log(`📊 Auth check response status: ${response.status}`);
    
    if (!response.ok) {
      console.error("❌ Auth check failed:", response.statusText);
      // If server says token is invalid, clear cookies
      if (response.status === 401) {
        console.log("🗑️ Clearing invalid auth token from cookies");
        deleteCookie('authToken');
        deleteCookie('userInfo');
      }
      throw new Error("Not authenticated");
    }
    
    const data = await response.json();
    console.log("✅ Authentication valid, user data:", data);
    return data;
  });
}

// Function to log out from the admin dashboard
function adminLogout() {
  const token = getCookie('authToken');
  
  if (!token) {
    console.log("🔍 No auth token found, nothing to logout");
    deleteCookie('authToken');
    deleteCookie('userInfo');
    return Promise.resolve({ success: true });
  }
  
  console.log("🌐 Sending logout request");
  return fetch(`${API_BASE_URL}/admin/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  }).then((response) => {
    // Always clear cookies regardless of server response
    console.log("🗑️ Clearing auth cookies");
    deleteCookie('authToken');
    deleteCookie('userInfo');
    
    if (!response.ok) {
      console.warn("⚠️ Logout request failed:", response.statusText);
      throw new Error("Logout failed");
    }
    return response.json();
  }).catch(error => {
    console.error("❌ Logout error:", error);
    // Still clear cookies even if the request fails
    deleteCookie('authToken');
    deleteCookie('userInfo');
    throw error;
  });
}

// Helper function for making authenticated admin requests
function fetchWithAdminAuth(url, options = {}) {
  const token = getCookie('authToken');
  console.log("🔍 Fetching with admin auth");
  
  console.log(`🔍 Authenticated request to: ${url}`);
  console.log(`🔑 Auth token exists: ${!!token}`);
  
  if (!token) {
    console.error("❌ Auth token missing - not authenticated");
    return Promise.reject(new Error("Not authenticated"));
  }
  
  const authOptions = {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`
    }
  };
  
  console.log("📤 Request headers include Authorization");
  
  return fetch(url, authOptions).then(async response => {
    console.log(`📊 Response from ${url}:`, response.status);
    
    // If we get an authentication error, clear cookies and redirect to login
    if (response.status === 401) {
      console.error("❌ Authentication failed (401) - clearing token");
      deleteCookie('authToken');
      deleteCookie('userInfo');
      
      // Redirect to login page if we're in the dashboard
      if (window.location.pathname.includes('dashboard') || 
          window.location.pathname.includes('admin')) {
        console.log("🔄 Redirecting to login page");
        window.location.href = '/dashboard/login.html';
        return new Promise(() => {}); // Never resolves, since we're redirecting
      }
      throw new Error("Authentication expired. Please log in again.");
    }
    
    return response;
  });
}

// Function to get current user info
function getCurrentUser() {
  const userInfoStr = getCookie('userInfo');
  if (!userInfoStr) return null;
  
  try {
    return JSON.parse(userInfoStr);
  } catch (e) {
    console.error("Error parsing user info:", e);
    return null;
  }
}

// Use localStorage as a fallback when API is not available
// These functions are called from main.js when API calls fail

// Function to save event registration to localStorage
function processEventRegistration(registration) {
  console.log("Saving event registration to localStorage:", registration);
  const registrations = JSON.parse(
    localStorage.getItem("eventRegistrations") || "[]"
  );
  registrations.push({
    ...registration,
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

// Function to upload a product image (Admin only)
function uploadProductImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return fetchWithAdminAuth(`${API_BASE_URL}/products/upload-image`, {
    method: "POST",
    body: formData
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to upload an event image (Admin only)
function uploadEventImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return fetchWithAdminAuth(`${API_BASE_URL}/events/upload-image`, {
    method: "POST",
    body: formData
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}
// Add these functions if they don't exist

function deleteEventApi(id) {
  console.log("Deleting event with ID:", id);
  return fetchWithAdminAuth(`${API_BASE_URL}/events/${id}`, {
    method: "DELETE",
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
    return response.json().catch(() => ({ success: true }));
  });
}

function deleteDonationApi(id) {
  console.log("Deleting donation with ID:", id);
  return fetchWithAdminAuth(`${API_BASE_URL}/donations/${id}`, {
    method: "DELETE",
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete donation");
    }
    return response.json().catch(() => ({ success: true }));
  });
}

function deleteMessageApi(id) {
  console.log("Deleting message with ID:", id);
  return fetchWithAdminAuth(`${API_BASE_URL}/messages/${id}`, {
    method: "DELETE",
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete message");
    }
    return response.json().catch(() => ({ success: true }));
  });
}

function deleteRegistrationApi(id) {
  console.log("Deleting registration with ID:", id);
  return fetchWithAdminAuth(`${API_BASE_URL}/registrations/${id}`, {
    method: "DELETE",
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete registration");
    }
    return response.json().catch(() => ({ success: true }));
  });
}

// Delete product API function (note: This fixes the name conflict with the existing deleteProduct)
function deleteProductApi(id) {
  console.log("Deleting product with ID:", id);
  return fetchWithAdminAuth(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  }).then(response => {
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    return response.json().catch(() => ({ success: true }));
  });
}