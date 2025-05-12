document.addEventListener("DOMContentLoaded", function () {
  // Function to load events dynamically from database
  function loadEvents() {
    const upcomingSection = document.querySelector(
      "#evenements-a-venir .events-list"
    );
    const solidaritySection = document.querySelector(
      "#evenements-solidaires .events-list"
    );
    const pastSection = document.querySelector(
      "#evenements-passes .events-list"
    );

    // If we're not on the events page, don't try to load events
    if (!upcomingSection && !solidaritySection && !pastSection) return;

    // Display loading messages
    if (upcomingSection)
      upcomingSection.innerHTML = "<p>Chargement des événements...</p>";
    if (solidaritySection)
      solidaritySection.innerHTML = "<p>Chargement des événements...</p>";
    if (pastSection)
      pastSection.innerHTML = "<p>Chargement des événements...</p>";

    // Use the API functions from database.js
    if (typeof getEvents === "function") {
      getEvents()
        .then((events) => {
          console.log("Loaded events:", events);

          // Group events by type
          const eventsByType = {
            upcoming: events.filter((e) => e.type === "upcoming"),
            solidarity: events.filter((e) => e.type === "solidarity"),
            past: events.filter((e) => e.type === "past"),
          };

          // Render each section
          if (upcomingSection) {
            upcomingSection.innerHTML = "";
            eventsByType.upcoming.forEach((event) => {
              upcomingSection.appendChild(createEventCard(event, "upcoming"));
            });
            if (eventsByType.upcoming.length === 0) {
              upcomingSection.innerHTML =
                "<p>Aucun événement à venir pour le moment.</p>";
            }
          }

          if (solidaritySection) {
            solidaritySection.innerHTML = "";
            eventsByType.solidarity.forEach((event) => {
              solidaritySection.appendChild(
                createEventCard(event, "solidarity")
              );
            });
            if (eventsByType.solidarity.length === 0) {
              solidaritySection.innerHTML =
                "<p>Aucun événement solidaire pour le moment.</p>";
            }
          }

          if (pastSection) {
            pastSection.innerHTML = "";
            eventsByType.past.forEach((event) => {
              pastSection.appendChild(createEventCard(event, "past"));
            });
            if (eventsByType.past.length === 0) {
              pastSection.innerHTML = "<p>Aucun événement passé.</p>";
            }
          }

          // Re-attach event listeners to the newly created elements
          setupEventListeners();
        })
        .catch((error) => {
          console.error("Error loading events:", error);
          // Show error messages
          const errorMsg =
            "<p>Impossible de charger les événements. Veuillez réessayer plus tard.</p>";
          if (upcomingSection) upcomingSection.innerHTML = errorMsg;
          if (solidaritySection) solidaritySection.innerHTML = errorMsg;
          if (pastSection) pastSection.innerHTML = errorMsg;
        });
    } else {
      console.warn("getEvents function not available, using static content");
      // If no function available, we'll use the static HTML content already present
    }
  }

  // Load homepage events
  function loadHomeEvents() {
    const homepageEvents = document.querySelector(".events-grid");
    if (!homepageEvents) return;

    if (typeof getEventsByType === "function") {
      getEventsByType("upcoming")
        .then((events) => {
          // Limit to 4 events
          const displayEvents = events.slice(0, 4);

          // Clear container
          homepageEvents.innerHTML = "";

          // Add each event
          displayEvents.forEach((event) => {
            const dateObj = new Date(event.date);
            const formattedDate = dateObj.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const eventDiv = document.createElement("div");
            eventDiv.className = "event-card";

            eventDiv.innerHTML = `
              <div class="event-icon">
                <img src="${event.image}" alt="${event.name}">
              </div>
              <h3>${event.name}</h3>
              <p>${formattedDate}</p>
              <a href="evenements.html" class="btn">En savoir plus</a>
            `;

            homepageEvents.appendChild(eventDiv);
          });

          if (displayEvents.length === 0) {
            homepageEvents.innerHTML =
              "<p>Aucun événement à venir pour le moment.</p>";
          }
        })
        .catch((error) => {
          console.error("Error loading homepage events:", error);
          homepageEvents.innerHTML =
            "<p>Impossible de charger les événements.</p>";
        });
    }
  }

  function initializeRegistrationForm() {
  const inscriptionForm = document.getElementById('inscription-form');
  const inscriptionModal = document.getElementById('inscription-modal');
  
  if (inscriptionForm) {
    inscriptionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const eventId = this.getAttribute('data-event-id');
      const eventName = document.getElementById('event-name').value;
      const nom = document.getElementById('inscription-nom').value;
      const email = document.getElementById('inscription-email').value;
      const telephone = document.getElementById('inscription-telephone').value;
      console.log(eventId, eventName, nom, email, telephone);
      // Create registration object with the EXACT format expected by API
      const registration = {
        event_id: parseInt(eventId), // Make sure this is a number
        name: nom,
        email: email,
        phone: telephone
      };

      
      console.log("Submitting registration:", registration);
      
      // Show loading state
      const submitButton = inscriptionForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Inscription en cours...';
      
      // Save to database
      saveRegistration(registration)
        .then(response => {
          console.log('Registration saved successfully:', response);
          
          // Show success message
          alert(`Merci ${nom} ! Votre inscription à l'événement "${eventName}" a été confirmée.`);
          
          // Reset form
          inscriptionForm.reset();
          
          // Close modal
          if (inscriptionModal) {
            inscriptionModal.style.display = 'none';
          }
        })
        .catch(error => {
          console.error('Error saving registration:', error);
          alert(`Une erreur est survenue lors de l'inscription. Veuillez réessayer. (${error.message})`);
          
          // // Fallback to localStorage if API fails
          // saveEventRegistration({
          //   event_id: eventId,
          //   name: nom,
          //   email: email,
          //   phone: telephone
          // });
        })
        .finally(() => {
          // Reset button state
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        });
    });
  }
}

// Update the function that shows the registration modal
function showRegistrationModal(event) {
  const modal = document.getElementById('inscription-modal');
  const form = document.getElementById('inscription-form');
  const eventNameInput = document.getElementById('event-name');
  
  if (modal && form && eventNameInput) {
    console.log("Opening registration modal for event:", event);
    
    // Set the event name in the hidden field
    eventNameInput.value = event.name || event.title;
    
    // Add event ID to the form - important for database storage
    // Make sure we're using the correct property from the event object
    const eventId = event.id || event.event_id;
    form.setAttribute('data-event-id', eventId);
    
    console.log(`Set event ID to ${eventId} for registration`);
    
    // Show the modal
    modal.style.display = 'block';
  }
}

  // Helper function to create event cards
  function createEventCard(event, type) {
    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const div = document.createElement("div");
    div.className = type === "past" ? "event-item past-event" : "event-item";
    div.setAttribute("data-event-type", type);
    div.setAttribute("data-event-id", event.id);

const inscriptionButton = type === "upcoming"
    ? `<button class="btn inscription-btn" data-event="${event.name}" data-event-id="${event.id}">S'inscrire</button>`
    : "<p><b>Clickez pour voir les photos</b></p>";
  
  div.innerHTML = `
    <div class="event-image">
      <img src="${event.image}" alt="${event.name}">
    </div>
    <div class="event-details">
      <h3>${event.name}</h3>
      <div class="event-date">${formattedDate}</div>
      <p>${event.description}</p>
      ${inscriptionButton}
    </div>
  `;
  
  return div;
  }

  // Setup event listeners for dynamically created events
  function setupEventListeners() {
    // Event buttons (for registration)
const inscriptionBtns = document.querySelectorAll(".inscription-btn");
inscriptionBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const eventName = this.getAttribute("data-event");
    const eventId = this.getAttribute("data-event-id");
    
    console.log(`Clicked inscription button for event: ${eventName}, ID: ${eventId}`);
    
    // Create an event object to pass to showRegistrationModal
    const event = {
      id: eventId,
      name: eventName
    };
    
    // Show the modal with this event
    showRegistrationModal(event);
  });
});

    // Event item click for photo albums
    const eventItems = document.querySelectorAll(".event-item");
    eventItems.forEach((item) => {
      item.addEventListener("click", function (event) {
        // Don't trigger if clicking on the registration button
        if (event.target.classList.contains("inscription-btn")) {
          return;
        }

        const eventType = this.getAttribute("data-event-type");
        const eventName = this.querySelector("h3").textContent;
        const eventId = this.getAttribute("data-event-id") || "1";

        if (eventType === "solidarity" || eventType === "past") {
          // For past or solidarity events, open photo album modal
          const albumTitle = document.getElementById("album-title");
          const albumContainer = document.getElementById("album-photos");

          if (albumTitle) albumTitle.textContent = eventName;

          // Clear previous photos
          if (albumContainer) albumContainer.innerHTML = "";

          // Add sample photos for this event (in real app, fetch from database)
          const photoCount = Math.floor(Math.random() * 3) + 3; // 3-5 photos
          for (let i = 1; i <= photoCount; i++) {
            const photoDiv = document.createElement("div");
            photoDiv.className = "album-photo";

            // Use event image as first photo, then placeholders
            let photoSrc =
              i === 1
                ? this.querySelector(".event-image img").src
                : `assets/Evenements/Ev ${
                    ["sport", "pingpong", "poker", "jeux videos"][
                      Math.floor(Math.random() * 4)
                    ]
                  }.jpg`;

            photoDiv.innerHTML = `<img src="${photoSrc}" alt="Photo ${i} de ${eventName}">`;
            albumContainer.appendChild(photoDiv);
          }

          openModal("album-modal");
        }
      });
    });
  }

  // Call loadEvents and loadHomeEvents functions
  loadEvents();
  loadHomeEvents();

  // Handle modals
  const modals = {
    "inscription-modal": document.getElementById("inscription-modal"),
    "money-modal": document.getElementById("money-modal"),
    "clothes-modal": document.getElementById("clothes-modal"),
    "food-modal": document.getElementById("food-modal"),
    "cart-modal": document.getElementById("cart-modal"),
    "album-modal": document.getElementById("album-modal"),
  };

  // Event buttons (for registration)
  const inscriptionBtns = document.querySelectorAll(".inscription-btn");
  inscriptionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const eventName = this.getAttribute("data-event");
      const eventId = this.getAttribute("data-event-id") || "1"; // Default to 1 if not set
      document.getElementById("event-name").value = eventName;
      if (document.getElementById("event-id")) {
        document.getElementById("event-id").value = eventId;
      }
      openModal("inscription-modal");
    });
  });

  // Donation buttons
  const donationBtns = document.querySelectorAll(".donation-btn");
  donationBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const donationType = this.getAttribute("data-type");
      openModal(donationType + "-modal");
    });
  });

  // Modal close buttons
  const closeButtons = document.querySelectorAll(".close-modal");
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

  // Function to open modal
  function openModal(modalId) {
    const modal = modals[modalId];
    if (modal) {
      modal.style.display = "block";
    }
  }

  // Function to close modal
  function closeModal(modal) {
    modal.style.display = "none";
  }

  // Handle donation amount buttons
  const amountBtns = document.querySelectorAll(".amount-btn");
  amountBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      amountBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");
      // Clear custom amount field
      if (document.getElementById("custom-amount")) {
        document.getElementById("custom-amount").value = "";
      }
    });
  });

  // Handle existing static event items
  const eventItems = document.querySelectorAll(".event-item");
  eventItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      // Don't trigger if clicking on the registration button
      if (event.target.classList.contains("inscription-btn")) {
        return;
      }

      const eventType = this.getAttribute("data-event-type");
      const eventName = this.querySelector("h3").textContent;
      const eventId = this.getAttribute("data-event-id") || "1";

      if (eventType === "solidarity" || eventType === "past") {
        // For past or solidarity events, open photo album modal
        const albumTitle = document.getElementById("album-title");
        const albumContainer = document.getElementById("album-photos");

        if (albumTitle) albumTitle.textContent = eventName;

        // Clear previous photos
        if (albumContainer) albumContainer.innerHTML = "";

        // Add sample photos for this event (in real app, fetch from database)
        const photoCount = Math.floor(Math.random() * 3) + 3; // 3-5 photos
        for (let i = 1; i <= photoCount; i++) {
          const photoDiv = document.createElement("div");
          photoDiv.className = "album-photo";

          // Use event image as first photo, then placeholders
          let photoSrc =
            i === 1
              ? this.querySelector(".event-image img").src
              : `assets/Evenements/Ev ${
                  ["sport", "pingpong", "poker", "jeux videos"][
                    Math.floor(Math.random() * 4)
                  ]
                }.jpg`;

          photoDiv.innerHTML = `<img src="${photoSrc}" alt="Photo ${i} de ${eventName}">`;
          albumContainer.appendChild(photoDiv);
        }

        openModal("album-modal");
      }
    });
  });

  // Event Registration Form
  // const inscriptionForm = document.getElementById("inscription-form");
  // if (inscriptionForm) {
  //   inscriptionForm.addEventListener("submit", function (event) {
  //     event.preventDefault();

  //     // Get event data
  //     const eventName = document.getElementById("event-name").value;
  //     const eventId = document.getElementById("event-id")?.value || "1";

  //     // Create registration object
  //     const registration = {
  //       event_id: parseInt(eventId),
  //       name: document.getElementById("inscription-nom").value,
  //       email: document.getElementById("inscription-email").value,
  //       phone: document.getElementById("inscription-telephone").value,
  //     };

  //     // First try to save to the database through API
  //     if (typeof saveRegistration === "function") {
  //       console.log("Saving registration to database:", registration);
  //       saveRegistration(registration)
  //         .then((response) => {
  //           console.log("Registration saved to database:", response);
  //           alert(`Merci pour votre inscription à l'événement "${eventName}"!`);
  //           inscriptionForm.reset();
  //           closeModal(document.getElementById("inscription-modal"));
  //         })
  //         .catch((error) => {
  //           console.error("Error saving registration to database:", error);
  //           // Fallback to localStorage if API fails
  //           saveEventRegistration(registration);
  //           alert(
  //             `Merci pour votre inscription à l'événement "${eventName}"! (Mode hors ligne)`
  //           );
  //           inscriptionForm.reset();
  //           closeModal(document.getElementById("inscription-modal"));
  //         });
  //     } else {
  //       // If API function not available, use localStorage fallback
  //       saveEventRegistration(registration);
  //       alert(
  //         `Merci pour votre inscription à l'événement "${eventName}"! (Mode hors ligne)`
  //       );
  //       inscriptionForm.reset();
  //       closeModal(document.getElementById("inscription-modal"));
  //     }
  //   });
  // }

  // Financial Donation Form
  const donationForm = document.getElementById("donation-form");
  if (donationForm) {
    donationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get selected amount
      let amount;
      const activeAmountBtn = document.querySelector(".amount-btn.active");
      if (activeAmountBtn) {
        amount = parseFloat(activeAmountBtn.getAttribute("data-amount"));
      } else {
        amount =
          parseFloat(document.getElementById("custom-amount").value) || 0;
      }

      // Create donation object
      const donation = {
        type: "money",
        amount: amount,
        name: document.getElementById("nom-donateur").value,
        email: document.getElementById("email-donateur").value,
        description: "Don financier en ligne",
      };

      // Try to save to database through API
      if (typeof saveDonation === "function") {
        console.log("Saving financial donation to database:", donation);
        saveDonation(donation)
          .then((response) => {
            console.log("Financial donation saved to database:", response);
            alert(`Merci pour votre don de ${amount} €!`);
            donationForm.reset();
            closeModal(document.getElementById("money-modal"));
          })
          .catch((error) => {
            console.error("Error saving donation to database:", error);
            // Fallback to localStorage if API fails
            processFinancialDonation({
              amount,
              nom: donation.name,
              email: donation.email,
            });
            alert(`Merci pour votre don de ${amount} €! (Mode hors ligne)`);
            donationForm.reset();
            closeModal(document.getElementById("money-modal"));
          });
      } else {
        // If API function not available, use localStorage fallback
        processFinancialDonation({
          amount,
          nom: donation.name,
          email: donation.email,
        });
        alert(`Merci pour votre don de ${amount} €! (Mode hors ligne)`);
        donationForm.reset();
        closeModal(document.getElementById("money-modal"));
      }
    });
  }

  // Clothing Donation Form
  const clothesForm = document.getElementById("clothes-form");
  if (clothesForm) {
    clothesForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Create donation object
      const donation = {
        type: "clothes",
        name: document.getElementById("nom-vetements").value,
        email: document.getElementById("email-vetements").value,
        description:
          document.getElementById("description-vetements").value ||
          "Don de vêtements",
      };

      // Try to save to database through API
      if (typeof saveDonation === "function") {
        console.log("Saving clothing donation to database:", donation);
        saveDonation(donation)
          .then((response) => {
            console.log("Clothing donation saved to database:", response);
            alert(
              "Merci pour votre don de vêtements! Nous vous contacterons bientôt."
            );
            clothesForm.reset();
            closeModal(document.getElementById("clothes-modal"));
          })
          .catch((error) => {
            console.error("Error saving clothing donation to database:", error);
            // Fallback to localStorage if API fails
            processClothingDonation({
              nom: donation.name,
              email: donation.email,
              description: donation.description,
            });
            alert(
              "Merci pour votre don de vêtements! Nous vous contacterons bientôt. (Mode hors ligne)"
            );
            clothesForm.reset();
            closeModal(document.getElementById("clothes-modal"));
          });
      } else {
        // If API function not available, use localStorage fallback
        processClothingDonation({
          nom: donation.name,
          email: donation.email,
          description: donation.description,
        });
        alert(
          "Merci pour votre don de vêtements! Nous vous contacterons bientôt. (Mode hors ligne)"
        );
        clothesForm.reset();
        closeModal(document.getElementById("clothes-modal"));
      }
    });
  }

  // Food Donation Form
  const foodForm = document.getElementById("food-form");
  if (foodForm) {
    foodForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Create donation object
      const donation = {
        type: "food",
        name: document.getElementById("nom-alimentaire").value,
        email: document.getElementById("email-alimentaire").value,
        description:
          document.getElementById("message-alimentaire").value ||
          "Don alimentaire",
      };

      // Try to save to database through API
      if (typeof saveDonation === "function") {
        console.log("Saving food donation to database:", donation);
        saveDonation(donation)
          .then((response) => {
            console.log("Food donation saved to database:", response);
            alert(
              "Merci pour votre don alimentaire! Nous vous contacterons bientôt."
            );
            foodForm.reset();
            closeModal(document.getElementById("food-modal"));
          })
          .catch((error) => {
            console.error("Error saving food donation to database:", error);
            // Fallback to localStorage if API fails
            processFoodDonation({
              nom: donation.name,
              email: donation.email,
              message: donation.description,
            });
            alert(
              "Merci pour votre don alimentaire! Nous vous contacterons bientôt. (Mode hors ligne)"
            );
            foodForm.reset();
            closeModal(document.getElementById("food-modal"));
          });
      } else {
        // If API function not available, use localStorage fallback
        processFoodDonation({
          nom: donation.name,
          email: donation.email,
          message: donation.description,
        });
        alert(
          "Merci pour votre don alimentaire! Nous vous contacterons bientôt. (Mode hors ligne)"
        );
        foodForm.reset();
        closeModal(document.getElementById("food-modal"));
      }
    });
  }

  // Contact Form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Create message object
      const message = {
        name: document.getElementById("contact-nom").value,
        email: document.getElementById("contact-email").value,
        subject: document.getElementById("contact-sujet").value,
        message: document.getElementById("contact-message").value,
      };

      // Try to save to database through API
      if (typeof saveMessage === "function") {
        console.log("Saving contact message to database:", message);
        saveMessage(message)
          .then((response) => {
            console.log("Contact message saved to database:", response);
            alert(
              "Merci pour votre message! Nous vous répondrons dans les meilleurs délais."
            );
            contactForm.reset();
          })
          .catch((error) => {
            console.error("Error saving message to database:", error);
            // Fallback to localStorage if API fails
            processContactForm({
              nom: message.name,
              email: message.email,
              sujet: message.subject,
              message: message.message,
            });
            alert(
              "Merci pour votre message! Nous vous répondrons dans les meilleurs délais. (Mode hors ligne)"
            );
            contactForm.reset();
          });
      } else {
        // If API function not available, use localStorage fallback
        processContactForm({
          nom: message.name,
          email: message.email,
          sujet: message.subject,
          message: message.message,
        });
        alert(
          "Merci pour votre message! Nous vous répondrons dans les meilleurs délais. (Mode hors ligne)"
        );
        contactForm.reset();
      }
    });
  }

  // Full-screen photo view
  document.addEventListener("click", function (event) {
    if (event.target.closest(".album-photo")) {
      const img = event.target.closest(".album-photo").querySelector("img");

      // Create a full screen overlay
      const overlay = document.createElement("div");
      overlay.className = "photo-overlay";
      overlay.innerHTML = `
        <div class="large-photo-container">
          <img src="${img.src}" alt="${img.alt}">
          <span class="close-overlay">&times;</span>
        </div>
      `;

      document.body.appendChild(overlay);

      // Close on click
      overlay.addEventListener("click", function () {
        document.body.removeChild(overlay);
      });
    }
  });

  // Legacy form handling functions (for fallback to localStorage)
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

  function processFoodDonation(data) {
    console.log("Saving food donation to localStorage:", data);
    const donations = JSON.parse(localStorage.getItem("foodDonations") || "[]");
    donations.push({
      ...data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("foodDonations", JSON.stringify(donations));
  }

  function processContactForm(data) {
    console.log("Saving contact form to localStorage:", data);
    const contacts = JSON.parse(
      localStorage.getItem("contactRequests") || "[]"
    );
    contacts.push({
      ...data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("contactRequests", JSON.stringify(contacts));
  }
  const menuIcon = document.querySelector(".menu-icon");
  const navMenu = document.querySelector("nav ul");

  if (menuIcon) {
    menuIcon.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }
  initializeRegistrationForm();
});
