/**
 * ============================================================================
 * Dhruvi Portfolio - Main JavaScript
 * Clean, lightweight, zero-dependency script
 * ============================================================================
 */

// ==========================================
// 1. CENTRAL CONFIGURATION
// Update your email, GitHub repo, or social handles here!
// ==========================================
const CONFIG = {
  // Your contact email where FormSubmit delivers inquiries:
  email: "21bmiit103@gmail.com",

  // Your GitHub Profile & Work Repository:
  githubProfile: "https://github.com/dhruvi1010-designs",
  githubWorkRepo: "https://github.com/dhruvi1010-designs/My-Work",

  // Your Instagram Profile:
  instagramUrl: "https://instagram.com/dhruvi1010-designs",

  // FormSubmit AJAX endpoint:
  formSubmitEndpoint: "https://formsubmit.co/ajax/21bmiit103@gmail.com"
};

// ==========================================
// 2. DOM CONTENT LOADED EVENT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initActiveNavOnScroll();
  initContactForm();
  initDynamicYear();
  initLinkChecks();
});

// ==========================================
// 3. MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
  const toggleBtn = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu if clicking outside
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
      navLinks.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// ==========================================
// 4. ACTIVE NAVIGATION LINK ON SCROLL
// ==========================================
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// ==========================================
// 5. CONTACT FORM (Real FormSubmit Integration)
// ==========================================
function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  if (!form || !submitBtn || !formStatus) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic Validation
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const subjectInput = form.querySelector('input[name="subject"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showStatus("Please fill in all required fields.", "error");
      return;
    }

    // Set Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Sending Message...
    `;

    // Prepare Form Data
    const formData = new FormData(form);

    try {
      const response = await fetch(CONFIG.formSubmitEndpoint, {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        showStatus("Thank you, Dhruvi! Your message was sent successfully. I will get back to you shortly.", "success");
        form.reset();
      } else {
        // Fallback to traditional POST submission if AJAX gets blocked
        console.warn("AJAX response not OK, submitting via standard POST...");
        form.submit();
      }
    } catch (err) {
      console.warn("Fetch failed, falling back to standard form submission:", err);
      // Traditional submit fallback ensures user's email is NEVER lost
      form.submit();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = "block";
    
    // Auto clear after 8 seconds
    setTimeout(() => {
      formStatus.style.display = "none";
    }, 8000);
  }
}

// ==========================================
// 6. DYNAMIC COPYRIGHT YEAR
// ==========================================
function initDynamicYear() {
  const yearElem = document.getElementById("currentYear");
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}

// ==========================================
// 7. LINK AUDIT & SECURITY ATTRIBUTES
// Ensure all external links have target="_blank" and rel="noopener noreferrer"
// ==========================================
function initLinkChecks() {
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach(link => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}
