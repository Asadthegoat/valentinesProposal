/* ============================================
   Main JavaScript - General Interactivity
   ============================================ */

/**
 * Intro Screen Handler - Manages Valentine's prompt interaction
 */
class IntroHandler {
  constructor() {
    this.btnYes = document.getElementById('btnYes');
    this.btnNo = document.getElementById('btnNo');
    this.introSection = document.getElementById('introSection');
    this.mainContent = document.getElementById('mainContent');
    
    // Messages that appear when clicking "No"
    this.noMessages = [
      'No',
      'Are you sure??',
      'Really sure??',
      'Positive??',
      'I\'ll be really sad...',
      'Please? 💔'
    ];
    
    this.noClickCount = 0;
    this.yesScale = 1;
    
    this.initIntro();
  }

  /**
   * Initialize intro button handlers
   */
  initIntro() {
    if (this.btnYes && this.btnNo) {
      this.btnYes.addEventListener('click', () => this.handleYes());
      this.btnNo.addEventListener('click', () => this.handleNo());
    }
  }

  /**
   * Handle Yes button click
   */
  handleYes() {
    // Hide intro, show main content
    this.introSection.style.opacity = '0';
    this.introSection.style.visibility = 'hidden';
    this.introSection.style.pointerEvents = 'none';
    
    // Allow scrolling now that intro is gone
    document.body.style.overflow = 'auto';
    
    this.mainContent.classList.remove('hidden');
    
    // Trigger animations on main content
    setTimeout(() => {
      document.body.classList.add('js-loaded');
      observeElements();
      // Make penguins visible once we're on the main page
      const penguins = document.querySelectorAll('.penguin-container');
      penguins.forEach(p => p.classList.add('visible'));
      // Initialize penguin tracking system
      if (typeof activatePenguins === 'function') {
        activatePenguins();
      }
    }, 100);
  }

  /**
   * Handle No button click - Makes Yes bigger, changes No text
   */
  handleNo() {
    this.noClickCount++;
    
    // Update No button text
    if (this.noClickCount <= this.noMessages.length) {
      this.btnNo.textContent = this.noMessages[this.noClickCount - 1];
    }
    
    // Grow the Yes button
    this.yesScale += 0.3;
    this.btnYes.style.transform = `scale(${this.yesScale})`;
    this.btnYes.style.zIndex = '11'; // Ensure Yes is always on top
    this.btnYes.classList.add('growing');
    
    // When Yes gets very large, disable No button and focus on Yes
    if (this.yesScale > 4) {
      this.btnNo.style.opacity = '0.3';
      this.btnNo.style.pointerEvents = 'none';
      this.btnNo.style.cursor = 'not-allowed';
    }
    
    // When Yes covers screen, make it the only option
    if (this.yesScale > 10) {
      this.makeYesOnlyOption();
    }
  }

  /**
   * Make Yes button cover entire screen
   */
  makeYesOnlyOption() {
    this.btnNo.style.display = 'none';
    this.btnYes.style.position = 'fixed';
    this.btnYes.style.top = '0';
    this.btnYes.style.left = '0';
    this.btnYes.style.width = '100%';
    this.btnYes.style.height = '100%';
    this.btnYes.style.borderRadius = '0';
    this.btnYes.style.fontSize = '4rem';
    this.btnYes.style.zIndex = '9999';
    this.btnYes.style.margin = '0';
    this.btnYes.style.transform = 'scale(1)';
  }
}

/**
 * Initialize the page with scroll animations and general effects
 */
function initPage() {
  // Clear any old penguin progress on fresh page load
  try {
    localStorage.removeItem('penguinsFound');
  } catch (error) {
    console.warn('Could not clear penguin progress:', error);
  }
  
  // Prevent scrolling while on intro screen
  document.body.style.overflow = 'hidden';
  
  // Initialize intro handler
  new IntroHandler();
  
  // Setup smooth scroll behavior for navigation
  setupSmoothScroll();
}

/**
 * Observe elements for scroll-triggered animations using Intersection Observer
 */
function observeElements() {
  // Target all elements that should fade in on scroll
  const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in, .letter-content, .proposal-content');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Only animate when element comes into view
      if (entry.isIntersecting) {
        entry.target.classList.add('js-animate');
        // Stop observing this element to prevent re-animation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Setup smooth scroll behavior for anchor links
 */
function setupSmoothScroll() {
  // Modern browsers support scroll-behavior: smooth in CSS
  // This function exists for any custom smooth scroll needs or polyfills
}

/**
 * Add CSS animation class when element is observed
 */
const style = document.createElement('style');
style.textContent = `
  .fade-in-up:not(.js-animate),
  .fade-in:not(.js-animate),
  .letter-content:not(.js-animate),
  .proposal-content:not(.js-animate) {
    opacity: 0;
    transform: translateY(30px);
  }

  .fade-in-up.js-animate,
  .fade-in.js-animate,
  .letter-content.js-animate,
  .proposal-content.js-animate {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

/**
 * Show penguin counter when first penguin is visible
 */
function showPenguinCounter() {
  const counter = document.getElementById('penguinCounter');
  if (counter) {
    counter.classList.add('show');
  }
}

/**
 * Update penguin count display
 * @param {number} count - Number of penguins found
 */
function updatePenguinCountDisplay(count) {
  const countElement = document.getElementById('penguinCount');
  if (countElement) {
    countElement.textContent = count;
  }
  
  // Show counter when first penguin is found
  if (count > 0) {
    showPenguinCounter();
  }
}

/**
 * Reveal the secret section with animation
 */
function revealSecretSection() {
  const secretSection = document.getElementById('secretSection');
  if (secretSection) {
    // Ensure it's visible
    secretSection.classList.add('revealed');
    secretSection.classList.add('secret-reveal-animation');
    
    // Force a reflow to ensure CSS changes take effect
    secretSection.offsetHeight;
    
    // Smooth scroll to reveal after a brief delay
    setTimeout(() => {
      secretSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  } else {
    console.warn('Secret section element not found');
  }
}

/**
 * Create a celebration effect when penguin is found
 * @param {HTMLElement} penguinElement - The penguin element that was clicked
 */
function createCelebrationEffect(penguinElement) {
  // Get penguin position
  const rect = penguinElement.getBoundingClientRect();
  
  // Create celebration particles or effects here if desired
  // For now, we'll add a simple animation class
  penguinElement.classList.add('penguin-found-animation');
}

/**
 * Disable pointer events on found penguins
 * @param {HTMLElement} container - The penguin container
 */
function disablePenguinInteraction(container) {
  container.classList.add('found');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

// Export functions for use in penguins.js
window.mainFunctions = {
  updatePenguinCountDisplay,
  revealSecretSection,
  createCelebrationEffect,
  disablePenguinInteraction
};
