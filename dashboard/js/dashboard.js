// Check authentication before loading dashboard
document.addEventListener("DOMContentLoaded", function () {
  // First check if API authentication function is available

  // Check demo authentication from cookie
  const authToken = getCookie("authToken"); // Reads from cookie

  if (authToken) {
    // Token exists, proceed with dashboard initialization
    // You might want to set the admin name dynamically if possible
    const adminNameElement = document.getElementById("admin-name");
    if (adminNameElement) {
        // Example: Retrieve admin name from another cookie or a placeholder
        adminNameElement.textContent = getCookie("adminName") || "Admin";
    }
    initializeDashboard();
  } else {
    // No authentication token found in cookies, redirect to index.html
    console.log("No authentication token found in cookies. Redirecting to index.html.");
    window.location.href = "login.html"; // Redirect to parent folder's index.html
  }

  // Handle logout button
  document.getElementById("logout-btn").addEventListener("click", function () {
    if (typeof adminLogout === "function") {
      adminLogout()
        .then(() => {
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.error("Logout failed:", error);
          alert("Erreur lors de la déconnexion.");
        });
    } else {
      // Demo logout - remove from localStorage
      localStorage.removeItem("demoAdminAuth");
      window.location.href = "login.html";
    }
  });
});

const modals = {};

function openModal(modalId) {
  const modal = modals[modalId];
  if (modal) {
    modal.style.display = "block";
  }
}

function closeModal(modal) {
  if (modal) {
    modal.style.display = "none";
  }
}

// Main dashboard initialization function
function initializeDashboard() {
  // Navigation
  const navLinks = document.querySelectorAll(".dashboard-nav a");
  const sections = document.querySelectorAll(".dashboard-section");
  
  // Define modals variable here at the beginning
  modals["add-event-modal"] = document.getElementById("add-event-modal");
  modals["add-product-modal"] = document.getElementById("add-product-modal");
  modals["view-message-modal"] = document.getElementById("view-message-modal");
  modals["delete-confirmation-modal"] = document.getElementById('delete-confirmation-modal');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetSection = this.getAttribute("data-section");

      // Update active nav link
      navLinks.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");

      // Show the target section, hide others
      sections.forEach((section) => {
        if (section.id === targetSection) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    });
  });

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");
      const tabContainer = this.closest(".tabs").parentElement;

      // Update active tab button
      tabContainer
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Show the target tab content, hide others
      tabContainer.querySelectorAll(".tab-content").forEach((content) => {
        if (content.id === targetTab) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
    });
  });

  // Modal handling
  // The modals variable is now defined at the beginning of the function
  
  // Open modal buttons
  document
    .getElementById("add-event-btn")
    .addEventListener("click", () => openModal("add-event-modal"));
  document
    .getElementById("add-product-btn")
    .addEventListener("click", () => openModal("add-product-modal"));

  // Close modal buttons
  const closeButtons = document.querySelectorAll(".close-modal, .btn-cancel");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal");
      closeModal(modal);
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    for (const modalId in modals) {
      const modal = modals[modalId];
      if (event.target === modal) {
        closeModal(modal);
      }
    }
  });

  // Load dashboard data
  loadDashboardData();

  // Add event form submission
  const addEventForm = document.getElementById("add-event-form");
  if (addEventForm) {
    addEventForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Create event object
      const event = {
        name: document.getElementById("event-name").value,
        date: document.getElementById("event-date").value,
        type: document.getElementById("event-type").value,
        description: document.getElementById("event-description").value,
        image: document.getElementById("event-image").value,
      };

      // Save event
      if (typeof addEvent === "function") {
        addEvent(event)
          .then((response) => {
            console.log("Event saved:", response);
            alert("Événement ajouté avec succès!");
            addEventForm.reset();
            closeModal(document.getElementById("add-event-modal"));
            loadEvents();
          })
          .catch((error) => {
            console.error("Error saving event:", error);
            alert("Erreur lors de l'ajout de l'événement.");
          });
      } else {
        alert("API non disponible. Impossible d'ajouter l'événement.");
      }
    });
  }

  // Add product form submission
  const addProductForm = document.getElementById("add-product-form");
  if (addProductForm) {
    addProductForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Create product object
      const product = {
        name: document.getElementById("product-name").value,
        price: parseFloat(document.getElementById("product-price").value),
        category: document.getElementById("product-category").value,
        description: document.getElementById("product-description").value,
        image: document.getElementById("product-image").value,
        stock: parseInt(document.getElementById("product-stock").value),
      };

      // Save product
      if (typeof addProduct === "function") {
        addProduct(product)
          .then((response) => {
            console.log("Product saved:", response);
            alert("Produit ajouté avec succès!");
            addProductForm.reset();
            closeModal(document.getElementById("add-product-modal"));
            loadProducts();
          })
          .catch((error) => {
            console.error("Error saving product:", error);
            alert("Erreur lors de l'ajout du produit.");
          });
      } else {
        alert("API non disponible. Impossible d'ajouter le produit.");
      }
    });
  }

  // Export data button
  document
    .getElementById("export-data-btn")
    .addEventListener("click", function () {
      exportDashboardData();
    });

  // Message handling
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("view-message-btn")) {
      const messageId = e.target.getAttribute("data-id");
      viewMessage(messageId);
    }
  });

  document
    .getElementById("mark-read-btn")
    .addEventListener("click", function () {
      const messageId = this.getAttribute("data-message-id");
      markMessageAsRead(messageId);
    });

  // Filters
  document
    .getElementById("donation-type-filter")
    .addEventListener("change", function () {
      const filterValue = this.value;
      loadDonations(filterValue);
    });

  document
    .getElementById("event-filter")
    .addEventListener("change", function () {
      const filterValue = this.value;
      loadRegistrations(filterValue);
    });
    // Add to initializeDashboard()
// Add event listener for the confirm delete button
document.getElementById('confirm-delete-btn').addEventListener('click', function() {
  const itemId = document.getElementById('delete-item-id').value;
  const itemType = document.getElementById('delete-item-type').value;
  
  // Show loading state
  this.textContent = 'Suppression...';
  this.disabled = true;
  
  deleteItem(itemType, itemId)
    .then(() => {
      // Success - close modal
      closeModal(document.getElementById('delete-confirmation-modal'));
      // Show success message
      let itemTypeText = 'Élément';
      switch(itemType) {
        case 'event': itemTypeText = 'Événement'; break;
        case 'donation': itemTypeText = 'Don'; break;
        case 'message': itemTypeText = 'Message'; break;
        case 'registration': itemTypeText = 'Inscription'; break;
        case 'product': itemTypeText = 'Produit'; break;
      }
      alert(`${itemTypeText} supprimé avec succès.`);
    })
    .catch(error => {
      alert(`Erreur lors de la suppression: ${error.message}`);
    })
    .finally(() => {
      // Reset button state
      this.textContent = 'Supprimer';
      this.disabled = false;
    });
});

// Add global click handler for delete buttons
document.addEventListener('click', handleDeleteClick);
  }

// Dashboard data loading functions
function loadDashboardData() {
  loadOverviewStats();
  loadRecentActivities();
  loadEvents();
  loadRegistrations();
  loadDonations();
  loadProducts();
  loadOrders();
  loadMessages();
  initializeCharts();
}

function loadOverviewStats() {
  const eventsCount = document.getElementById("events-count");
  const registrationsCount = document.getElementById("registrations-count");
  const donationsSum = document.getElementById("donations-sum");
  const messagesCount = document.getElementById("messages-count");

  // If API functions are available
  if (typeof getEvents === "function") {
    // Count upcoming events
    getEvents()
      .then((events) => {
        const upcomingEvents = events.filter((e) => e.type === "upcoming");
        eventsCount.textContent = upcomingEvents.length;
      })
      .catch((error) => {
        console.error("Error loading events count:", error);
        eventsCount.textContent = "Erreur";
      });
  }

  if (typeof getRegistrations === "function") {
    // Count total registrations
    getRegistrations()
      .then((registrations) => {
        registrationsCount.textContent = registrations.length;
      })
      .catch((error) => {
        console.error("Error loading registrations count:", error);
        registrationsCount.textContent = "Erreur";
      });
  }

  if (typeof getDonations === "function") {
    // Calculate total financial donations
    getDonations()
      .then((donations) => {
        console.log("Donations:", donations);
        const financialDonations = donations.filter((d) => d.type === "money");
        const total = financialDonations.reduce(
          (sum, donation) => sum + donation.amount,
          0
        );
        donationsSum.textContent = total.toFixed(2) + " €";
      })
      .catch((error) => {
        console.error("Error loading donations sum:", error);
        donationsSum.textContent = "Erreur";
      });
  }

  if (typeof getUnreadMessages === "function") {
    // Count unread messages
    getUnreadMessages()
      .then((messages) => {
        messagesCount.textContent = messages.length;
      })
      .catch((error) => {
        console.error("Error loading unread messages count:", error);
        messagesCount.textContent = "Erreur";
      });
  }
}

function loadRecentActivities() {
  const activitiesContainer = document.getElementById("recent-activities");

  if (typeof getRecentActivities === "function") {
    getRecentActivities()
      .then((activities) => {
        if (activities.length === 0) {
          activitiesContainer.innerHTML = "<p>Aucune activité récente.</p>";
          return;
        }

        activitiesContainer.innerHTML = "";
        activities.forEach((activity) => {
          const timeAgo = formatTimeAgo(new Date(activity.timestamp));
          const activityEl = document.createElement("div");
          activityEl.className = "activity-item";

          activityEl.innerHTML = `
              <div class="activity-icon">${getActivityIcon(activity.type)}</div>
              <div class="activity-details">
                <div class="activity-text">${activity.message}</div>
                <div class="activity-time">${timeAgo}</div>
              </div>
            `;

          activitiesContainer.appendChild(activityEl);
        });
      })
      .catch((error) => {
        console.error("Error loading recent activities:", error);
        activitiesContainer.innerHTML =
          "<p>Erreur lors du chargement des activités.</p>";
      });
  } else {
    activitiesContainer.innerHTML = "<p>API non disponible.</p>";
  }
}

function loadEvents() {
  const eventsTableBody = document.querySelector("#events-table tbody");
  const eventFilter = document.getElementById("event-filter");

  if (typeof getEvents === "function") {
    getEvents()
      .then((events) => {
        // Clear table
        eventsTableBody.innerHTML = "";

        // Clear filter options and add new ones
        if (eventFilter) {
          // Keep the first option
          const firstOption = eventFilter.options[0];
          eventFilter.innerHTML = "";
          eventFilter.appendChild(firstOption);

          // Add event options
          events.forEach((event) => {
            const option = document.createElement("option");
            option.value = event.id;
            option.textContent = event.name;
            eventFilter.appendChild(option);
          });
        }

        // Add events to table
        events.forEach((event) => {
          const row = document.createElement("tr");

          const date = new Date(event.date);
          const formattedDate = date.toLocaleDateString("fr-FR");

          // Get registrations count for this event
          let registrationsCount = 0;
          if (typeof getRegistrations === "function") {
            getRegistrations()
              .then((registrations) => {
                registrationsCount = registrations.filter(
                  (r) => r.event_id === event.id
                ).length;
                document.getElementById(
                  `event-reg-count-${event.id}`
                ).textContent = registrationsCount;
              })
              .catch(() => {});
          }

          row.innerHTML = `
              <td>${event.id}</td>
              <td>${event.name}</td>
              <td>${formattedDate}</td>
              <td>${formatEventType(event.type)}</td>
              <td id="event-reg-count-${event.id}">${registrationsCount}</td>
              <td>
                <div class="table-actions">
                  <button class="btn-edit" data-id="${event.id}">Éditer</button>
                  <button class="btn-delete" data-id="${
                    event.id
                  }">Supprimer</button>
                </div>
              </td>
            `;

          eventsTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error loading events:", error);
        eventsTableBody.innerHTML =
          '<tr><td colspan="6">Erreur lors du chargement des événements.</td></tr>';
      });
  } else {
    eventsTableBody.innerHTML =
      '<tr><td colspan="6">API non disponible.</td></tr>';
  }
}

function loadRegistrations(eventId = "") {
  const registrationsTableBody = document.querySelector(
    "#registrations-table tbody"
  );

  if (typeof getRegistrations === "function") {
    getRegistrations()
      .then((registrations) => {
        // Filter by event if specified
        if (eventId) {
          registrations = registrations.filter((r) => r.event_id == eventId);
        }

        // Clear table
        registrationsTableBody.innerHTML = "";

        if (registrations.length === 0) {
          registrationsTableBody.innerHTML =
            '<tr><td colspan="7">Aucune inscription trouvée.</td></tr>';
          return;
        }

        // Load events to get names
        getEvents()
          .then((events) => {
            const eventMap = {};
            events.forEach((event) => {
              eventMap[event.id] = event.name;
            });

            // Add registrations to table
            registrations.forEach((registration) => {
              const row = document.createElement("tr");

              const date = new Date(registration.timestamp);
              const formattedDate = date.toLocaleDateString("fr-FR");
              const eventName =
                eventMap[registration.event_id] ||
                `Événement #${registration.event_id}`;

              row.innerHTML = `
                <td>${registration.id}</td>
                <td>${eventName}</td>
                <td>${registration.name}</td>
                <td>${registration.email}</td>
                <td>${registration.phone}</td>
                <td>${formattedDate}</td>
                <td>
                  <div class="table-actions">
                    <button class="btn-view" data-id="${registration.id}">Voir</button>
                    <button class="btn-delete" data-id="${registration.id}">Supprimer</button>
                  </div>
                </td>
              `;

              registrationsTableBody.appendChild(row);
            });
          })
          .catch((error) => {
            console.error("Error loading events for registrations:", error);
          });
      })
      .catch((error) => {
        console.error("Error loading registrations:", error);
        registrationsTableBody.innerHTML =
          '<tr><td colspan="7">Erreur lors du chargement des inscriptions.</td></tr>';
      });
  } else {
    registrationsTableBody.innerHTML =
      '<tr><td colspan="7">API non disponible.</td></tr>';
  }
}

function loadDonations(type = "") {
  const donationsTableBody = document.querySelector("#donations-table tbody");

  if (typeof getDonations === "function") {
    getDonations()
      .then((donations) => {
        console.log(donations)
        // Filter by type if specified
        if (type) {
          donations = donations.filter((d) => d.type === type);
        }

        // Clear table
        donationsTableBody.innerHTML = "";

        if (donations.length === 0) {
          donationsTableBody.innerHTML =
            '<tr><td colspan="7">Aucun don trouvé.</td></tr>';
          return;
        }

        // Add donations to table
        donations.forEach((donation) => {
          const row = document.createElement("tr");

          const date = new Date(donation.timestamp);
          const formattedDate = date.toLocaleDateString("fr-FR");

          // Format donation value based on type
          let donationValue = "";
          if (donation.type === "money") {
            donationValue = `${donation.amount} €`;
          } else {
            donationValue = donation.description;
          }

          row.innerHTML = `
              <td>${donation.id}</td>
              <td>${formatDonationType(donation.type)}</td>
              <td>${donation.name}</td>
              <td>${donation.email}</td>
              <td>${donationValue}</td>
              <td>${formattedDate}</td>
              <td>
                <div class="table-actions">
                  <button class="btn-view" data-id="${
                    donation.id
                  }">Voir</button>
                  <button class="btn-delete" data-id="${
                    donation.id
                  }">Supprimer</button>
                </div>
              </td>
            `;

          donationsTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error loading donations:", error);
        donationsTableBody.innerHTML =
          '<tr><td colspan="7">Erreur lors du chargement des dons.</td></tr>';
      });
  } else {
    donationsTableBody.innerHTML =
      '<tr><td colspan="7">API non disponible.</td></tr>';
  }
}

function loadProducts() {
  const productsTableBody = document.querySelector("#products-table tbody");

  if (typeof getProducts === "function") {
    getProducts()
      .then((products) => {
        // Clear table
        productsTableBody.innerHTML = "";

        if (products.length === 0) {
          productsTableBody.innerHTML =
            '<tr><td colspan="7">Aucun produit trouvé.</td></tr>';
          return;
        }

        // Add products to table
        products.forEach((product) => {
          const row = document.createElement("tr");

          row.innerHTML = `
              <td>${product.id}</td>
              <td><img src="${product.image}" alt="${
            product.name
          }" width="50"></td>
              <td>${product.name}</td>
              <td>${product.price.toFixed(2)} €</td>
              <td>${formatProductCategory(product.category)}</td>
              <td>${product.stock}</td>
              <td>
                <div class="table-actions">
                  <button class="btn-edit" data-id="${
                    product.id
                  }">Éditer</button>
                  <button class="btn-delete" data-id="${
                    product.id
                  }">Supprimer</button>
                </div>
              </td>
            `;

          productsTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error loading products:", error);
        productsTableBody.innerHTML =
          '<tr><td colspan="7">Erreur lors du chargement des produits.</td></tr>';
      });
  } else {
    productsTableBody.innerHTML =
      '<tr><td colspan="7">API non disponible.</td></tr>';
  }
}

function loadOrders() {
  const ordersTableBody = document.querySelector("#orders-table tbody");

  if (typeof getOrders === "function") {
    getOrders()
      .then((orders) => {
        // Clear table
        ordersTableBody.innerHTML = "";

        if (orders.length === 0) {
          ordersTableBody.innerHTML =
            '<tr><td colspan="7">Aucune commande trouvée.</td></tr>';
          return;
        }

        // Add orders to table
        orders.forEach((order) => {
          const row = document.createElement("tr");

          const date = new Date(order.timestamp);
          const formattedDate = date.toLocaleDateString("fr-FR");

          // Format items
          const itemsCount = order.items.length;
          const itemsText =
            itemsCount === 1 ? "1 article" : `${itemsCount} articles`;

          row.innerHTML = `
              <td>${order.id}</td>
              <td>${order.customer_name}</td>
              <td>${order.total.toFixed(2)} €</td>
              <td>${itemsText}</td>
              <td>${formattedDate}</td>
              <td>${formatOrderStatus(order.status || "pending")}</td>
              <td>
                <div class="table-actions">
                  <button class="btn-view" data-id="${order.id}">Voir</button>
                  <button class="btn-edit" data-id="${
                    order.id
                  }">Modifier</button>
                </div>
              </td>
            `;

          ordersTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error loading orders:", error);
        ordersTableBody.innerHTML =
          '<tr><td colspan="7">Erreur lors du chargement des commandes.</td></tr>';
      });
  } else {
    ordersTableBody.innerHTML =
      '<tr><td colspan="7">API non disponible.</td></tr>';
  }
}

function loadMessages() {
  const messagesTableBody = document.querySelector("#messages-table tbody");

  if (typeof getMessages === "function") {
    getMessages()
      .then((messages) => {
        // Clear table
        messagesTableBody.innerHTML = "";

        if (messages.length === 0) {
          messagesTableBody.innerHTML =
            '<tr><td colspan="7">Aucun message trouvé.</td></tr>';
          return;
        }

        // Add messages to table
        messages.forEach((message) => {
          const row = document.createElement("tr");

          const date = new Date(message.timestamp);
          const formattedDate = date.toLocaleDateString("fr-FR");

          row.innerHTML = `
              <td>${message.id}</td>
              <td>${message.name}</td>
              <td>${message.email}</td>
              <td>${message.subject}</td>
              <td>${formattedDate}</td>
              <td>${
                message.read ? "Lu" : '<span class="unread">Non lu</span>'
              }</td>
              <td>
                <div class="table-actions">
                  <button class="btn-view view-message-btn" data-id="${
                    message.id
                  }">Lire</button>
                  <button class="btn-delete" data-id="${
                    message.id
                  }">Supprimer</button>
                </div>
              </td>
            `;

          messagesTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error loading messages:", error);
        messagesTableBody.innerHTML =
          '<tr><td colspan="7">Erreur lors du chargement des messages.</td></tr>';
      });
  } else {
    messagesTableBody.innerHTML =
      '<tr><td colspan="7">API non disponible.</td></tr>';
  }
}

function viewMessage(messageId) {
  if (typeof getMessage === "function") {
    getMessage(messageId)
      .then((message) => {
        document.getElementById("message-sender").textContent = message.name;
        document.getElementById("message-email").textContent = message.email;

        const date = new Date(message.timestamp);
        document.getElementById("message-date").textContent =
          date.toLocaleDateString("fr-FR");

        document.getElementById("message-subject").textContent =
          message.subject || "Sans sujet";
        document.getElementById("message-content").textContent =
          message.message;

        document
          .getElementById("mark-read-btn")
          .setAttribute("data-message-id", message.id);

        // Open modal
        document.getElementById("view-message-modal").style.display = "block";

        // Mark as read if not read already
        if (!message.read) {
          markMessageAsRead(message.id);
        }
      })
      .catch((error) => {
        console.error("Error loading message:", error);
        alert("Erreur lors du chargement du message.");
      });
  }
}

function markMessageAsRead(messageId) {
  if (typeof updateMessage === "function") {
    updateMessage(messageId, { read: true })
      .then(() => {
        // Update UI
        loadMessages();
        loadOverviewStats();
      })
      .catch((error) => {
        console.error("Error marking message as read:", error);
      });
  }
}

function initializeCharts() {
  // Events Chart
  if (typeof getEvents === "function") {
    getEvents()
      .then((events) => {
        // Group events by month
        const eventsByMonth = groupByMonth(events);

        new Chart(document.getElementById("events-chart-canvas"), {
          type: "bar",
          data: {
            labels: eventsByMonth.labels,
            datasets: [
              {
                label: "Nombre d'événements",
                data: eventsByMonth.data,
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error initializing events chart:", error);
      });
  }

  // Donations Chart
  if (typeof getDonations === "function") {
    getDonations()
      .then((donations) => {
        // Filter financial donations only
        const financialDonations = donations.filter((d) => d.type === "money");

        // Group donations by month
        const donationsByMonth = groupByMonth(financialDonations);

        new Chart(document.getElementById("donations-chart-canvas"), {
          type: "line",
          data: {
            labels: donationsByMonth.labels,
            datasets: [
              {
                label: "Dons financiers (€)",
                data: donationsByMonth.amounts,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 2,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error initializing donations chart:", error);
      });
  }
}

function exportDashboardData() {
  const data = {};

  Promise.all([
    getEvents ? getEvents() : Promise.resolve([]),
    getRegistrations ? getRegistrations() : Promise.resolve([]),
    getDonations ? getDonations() : Promise.resolve([]),
    getProducts ? getProducts() : Promise.resolve([]),
    getOrders ? getOrders() : Promise.resolve([]),
    getMessages ? getMessages() : Promise.resolve([]),
  ])
    .then(([events, registrations, donations, products, orders, messages]) => {
      data.events = events;
      data.registrations = registrations;
      data.donations = donations;
      data.products = products;
      data.orders = orders;
      data.messages = messages;

      // Create JSON file
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      // Create download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.setAttribute("href", url);

      // Create filename with current date
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];
      link.setAttribute("download", `dashboard-export-${formattedDate}.json`);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.error("Error exporting data:", error);
      alert("Erreur lors de l'exportation des données.");
    });
}

// Helper functions
function formatEventType(type) {
  switch (type) {
    case "upcoming":
      return "À venir";
    case "solidarity":
      return "Solidaire";
    case "past":
      return "Passé";
    default:
      return type;
  }
}

function formatDonationType(type) {
  switch (type) {
    case "money":
    case "monetary":
      return "Financier";
    case "clothes":
    case "clothing":
      return "Vêtements";
    case "food":
      return "Alimentaire";
    default:
      return type;
  }
}

function formatProductCategory(category) {
  switch (category) {
    case "clothing":
      return "Vêtements";
    case "accessories":
      return "Accessoires";
    case "souvenirs":
      return "Souvenirs";
    default:
      return category;
  }
}

function formatOrderStatus(status) {
  switch (status) {
    case "pending":
      return "En attente";
    case "processing":
      return "En traitement";
    case "shipped":
      return "Expédié";
    case "delivered":
      return "Livré";
    case "canceled":
      return "Annulé";
    default:
      return status;
  }
}

function getActivityIcon(type) {
  switch (type) {
    case "registration":
      return "👤";
    case "donation":
      return "💰";
    case "order":
      return "🛒";
    case "message":
      return "✉️";
    case "event":
      return "📅";
    default:
      return "📌";
  }
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Il y a quelques secondes";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  } else {
    return date.toLocaleDateString("fr-FR");
  }
}

function groupByMonth(items) {
  // Get last 6 months
  const months = [];
  const labels = [];
  const data = [];
  const amounts = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const month = date.getMonth();
    const year = date.getFullYear();

    months.push({ month, year });

    const monthName = date.toLocaleDateString("fr-FR", { month: "short" });
    labels.push(`${monthName} ${year}`);

    // Initialize data
    data.push(0);
    amounts.push(0);
  }

  // Count items per month
  items.forEach((item) => {
    const date = new Date(item.date || item.timestamp);
    const month = date.getMonth();
    const year = date.getFullYear();

    // Find index in our months array
    const index = months.findIndex((m) => m.month === month && m.year === year);

    if (index !== -1) {
      data[index] += 1;

      // For financial donations, sum the amounts
      if (item.amount) {
        amounts[index] += item.amount;
      }
    }
  });

  return { labels, data, amounts };
}

// Replace the handleDeleteClick function with this improved version

// Delete item handler
// Update the handleDeleteClick function to include registrations and products

function handleDeleteClick(e) {
  if (!e.target.classList.contains('btn-delete')) return;
  
  const itemId = e.target.getAttribute('data-id');
  let itemType = '';
  let itemName = '';
  
  // Get the closest row and table
  const row = e.target.closest('tr');
  if (!row) {
    console.error('Could not find row element for delete button');
    return;
  }
  
  const table = row.closest('table');
  if (!table) {
    console.error('Could not find table element for delete button');
    return;
  }
  
  // Determine item type based on table ID
  const tableId = table.id;
  
  if (tableId === 'events-table' || table.closest('#events-section')) {
    itemType = 'event';
    // Try to get event name from row
    if (row.cells && row.cells.length > 1) {
      itemName = row.cells[1].textContent; // Event name is in second column
    }
  } else if (tableId === 'donations-table' || table.closest('#donations-section')) {
    itemType = 'donation';
    // Get donation info if possible
    if (row.cells && row.cells.length > 2) {
      const donorName = row.cells[2].textContent; // Donor name is in third column
      const donationType = row.cells[1].textContent; // Type is in second column
      itemName = `${donationType} de ${donorName}`;
    }
  } else if (tableId === 'messages-table' || table.closest('#messages-section')) {
    itemType = 'message';
    // Get message info if possible
    if (row.cells && row.cells.length > 3) {
      const sender = row.cells[1].textContent; // Sender is in second column
      const subject = row.cells[3].textContent; // Subject is in fourth column
      itemName = `message de ${sender} (${subject})`;
    }
  } else if (tableId === 'registrations-table' || table.closest('#registrations-section')) {
    itemType = 'registration';
    // Get registration info if possible
    if (row.cells && row.cells.length > 2) {
      const personName = row.cells[2].textContent; // Person name is in third column
      const eventName = row.cells[1].textContent; // Event name is in second column
      itemName = `inscription de ${personName} à "${eventName}"`;
    }
  } else if (tableId === 'products-table' || table.closest('#products')) {
    itemType = 'product';
    // Get product info if possible
    if (row.cells && row.cells.length > 2) {
      const productName = row.cells[2].textContent; // Product name is in third column
      itemName = `produit "${productName}"`;
    }
  } else {
    // For debugging purposes, log what table we found
    console.warn('Could not determine item type for deletion', {
      tableId,
      closestSectionId: table.closest('section')?.id,
      buttonParents: Array.from(e.target.parentElement.classList),
      rowHTML: row.innerHTML.substring(0, 100) + '...'
    });
    
    // As a fallback, try to detect type from the nearby elements or context
    if (window.location.hash === '#events-section' || document.querySelector('#events-section.active')) {
      itemType = 'event';
    } else if (window.location.hash === '#donations-section' || document.querySelector('#donations-section.active')) {
      itemType = 'donation';
    } else if (window.location.hash === '#messages-section' || document.querySelector('#messages-section.active')) {
      itemType = 'message';
    } else if (window.location.hash === '#registrations-section' || document.querySelector('#registrations-section.active')) {
      itemType = 'registration';
    } else if (window.location.hash === '#shop' || document.querySelector('#shop.active')) {
      itemType = 'product';
    } else {
      alert('Impossible de déterminer le type d\'élément à supprimer.');
      return;
    }
  }
  
  console.log(`Preparing to delete ${itemType} with ID ${itemId}`);
  
  // Set confirmation message
  const message = itemName 
    ? `Êtes-vous sûr de vouloir supprimer ${
        itemType === 'event' ? 'l\'événement' : 
        itemType === 'donation' ? 'le don' : 
        itemType === 'message' ? 'le message' :
        itemType === 'registration' ? 'l\'inscription' :
        itemType === 'product' ? 'le produit' : 'cet élément'
      } "${itemName}" ?`
    : `Êtes-vous sûr de vouloir supprimer cet élément ?`;
    
  document.getElementById('delete-confirmation-message').textContent = message;
  
  // Set hidden input values
  document.getElementById('delete-item-id').value = itemId;
  document.getElementById('delete-item-type').value = itemType;
  
  // Show modal
  openModal('delete-confirmation-modal');
}

// Delete an event
function deleteEvent(eventId) {
  // First check if we have the delete function available
  if (typeof deleteEventApi !== 'function') {
    return Promise.reject(new Error('API function deleteEvent is not available'));
  }
  
  return deleteEventApi(eventId);
}

// Delete a donation
function deleteDonation(donationId) {
  // First check if we have the delete function available
  if (typeof deleteDonationApi !== 'function') {
    return Promise.reject(new Error('API function deleteDonation is not available'));
  }
  
  return deleteDonationApi(donationId);
}

// Delete a message
function deleteMessage(messageId) {
  // First check if we have the delete function available
  if (typeof deleteMessageApi !== 'function') {
    return Promise.reject(new Error('API function deleteMessage is not available'));
  }
  
  return deleteMessageApi(messageId);
}


function deleteItem(itemType, itemId) {
  console.log(`🗑️ Deleting ${itemType} with ID: ${itemId}`);
  
  let deleteFunc;
  
  switch(itemType) {
    case 'event':
      deleteFunc = deleteEvent;
      break;
    case 'donation':
      deleteFunc = deleteDonation;
      break;
    case 'message':
      deleteFunc = deleteMessage;
      break;
    case 'registration':
      deleteFunc = deleteRegistration;
      break;
    case 'product':
      deleteFunc = deleteProduct;
      break;
    default:
      console.error(`Unknown item type: ${itemType}`);
      return Promise.reject(new Error('Unknown item type'));
  }
  
  if (typeof deleteFunc !== 'function') {
    console.error(`Delete function for ${itemType} is not available`);
    return Promise.reject(new Error(`API function for deleting ${itemType} is not available`));
  }
  
  return deleteFunc(itemId)
    .then(response => {
      console.log(`✅ ${itemType} deleted successfully:`, response);
      
      // Reload data based on what was deleted
      switch(itemType) {
        case 'event':
          loadEvents();
          break;
        case 'donation':
          loadDonations();
          break;
        case 'message':
          loadMessages();
          break;
        case 'registration':
          loadRegistrations();
          break;
        case 'product':
          loadProducts();
          break;
      }
      
      // Reload overview stats
      loadOverviewStats();
      
      return response;
    })
    .catch(error => {
      console.error(`❌ Error deleting ${itemType}:`, error);
      throw error;
    });
}

// Replace the three problematic delete functions with these versions:

// Delete an event
function deleteEvent(eventId) {
  // First check if we have the delete function available from the API
  if (typeof deleteEventApi !== 'function') {
    return Promise.reject(new Error('API function deleteEventApi is not available'));
  }
  
  return deleteEventApi(eventId);
}

// Delete a donation
function deleteDonation(donationId) {
  // First check if we have the delete function available from the API
  if (typeof deleteDonationApi !== 'function') {
    return Promise.reject(new Error('API function deleteDonationApi is not available'));
  }
  
  return deleteDonationApi(donationId);
}

// Delete a message
function deleteMessage(messageId) {
  // First check if we have the delete function available from the API
  if (typeof deleteMessageApi !== 'function') {
    return Promise.reject(new Error('API function deleteMessageApi is not available'));
  }
  
  return deleteMessageApi(messageId);
}

function deleteRegistration(registrationId) {
  // First check if we have the delete function available from the API
  if (typeof deleteRegistrationApi !== 'function') {
    return Promise.reject(new Error('API function deleteRegistrationApi is not available'));
  }
  
  return deleteRegistrationApi(registrationId);
}

// Delete a product
function deleteProduct(productId) {
  // First check if we have the delete function available from the API
  if (typeof deleteProductApi !== 'function') {
    return Promise.reject(new Error('API function deleteProduct is not available'));
  }
  
  return deleteProductApi(productId);
}