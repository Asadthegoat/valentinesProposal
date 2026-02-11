/* ============================================
   Penguin Easter Egg System - Tracking & Unlocking
   ============================================ */

/**
 * PenguinTracker - Manages the hidden penguin easter egg system
 * - Tracks which penguins have been found
 * - Persists progress using localStorage
 * - Reveals secret section when all penguins are found
 */
class PenguinTracker {
  constructor() {
    // Array of penguin IDs (matches HTML data attributes)
    this.penguinIds = ['penguin1', 'penguin2', 'penguin3', 'penguin4', 'penguin5'];
    
    // Store handler functions so we can remove them later
    this.penguinHandlers = new Map();
    
    // Load saved progress from localStorage
    this.foundPenguins = this.loadProgress();
    
    // Initialize penguin event listeners
    this.initPenguins();
    
    // Update display with saved progress
    this.updateDisplay();
  }

  /**
   * Load penguin progress from localStorage
   * @returns {Set} Set of found penguin IDs
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem('penguinsFound');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Could not load saved penguin progress:', error);
    }
    return new Set();
  }

  /**
   * Save current penguin progress to localStorage
   */
  saveProgress() {
    try {
      localStorage.setItem('penguinsFound', JSON.stringify(Array.from(this.foundPenguins)));
    } catch (error) {
      console.warn('Could not save penguin progress:', error);
    }
  }

  /**
   * Initialize click event listeners for all penguins
   */
  initPenguins() {
    this.penguinIds.forEach(penguinId => {
      const penguinElement = document.getElementById(penguinId);
      
      if (penguinElement) {
        // If this penguin was already found, mark it as found visually
        if (this.foundPenguins.has(penguinId)) {
          penguinElement.classList.add('found');
        } else {
          // Create a bound handler function for this penguin
          const handler = (e) => this.handlePenguinClick(penguinId, e);
          // Store the handler so we can remove it later
          this.penguinHandlers.set(penguinId, handler);
          // Add click listener
          penguinElement.addEventListener('click', handler);
        }
      }
    });
  }

  /**
   * Handle clicking a penguin
   * @param {string} penguinId - ID of the clicked penguin
   * @param {Event} event - Click event
   */
  handlePenguinClick(penguinId, event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Mark penguin as found
    this.foundPenguins.add(penguinId);
    this.saveProgress();
    
    console.log(`Found penguin ${penguinId}. Total found: ${this.foundPenguins.size}/5`);
    
    // Get the penguin container element
    const penguinContainer = document.getElementById(penguinId);
    
    // Visual feedback: celebration effect
    window.mainFunctions.createCelebrationEffect(penguinContainer);
    
    // Remove click listener properly using stored handler
    const handler = this.penguinHandlers.get(penguinId);
    if (handler) {
      penguinContainer.removeEventListener('click', handler);
      this.penguinHandlers.delete(penguinId);
    }
    
    // Mark as found
    window.mainFunctions.disablePenguinInteraction(penguinContainer);
    
    // Update display
    this.updateDisplay();
    
    // Show subtle feedback
    this.showPenguinFoundFeedback();
    
    // Check if all penguins are found
    this.checkForCompletion();
  }

  /**
   * Update the penguin count display
   */
  updateDisplay() {
    const count = this.foundPenguins.size;
    window.mainFunctions.updatePenguinCountDisplay(count);
  }

  /**
   * Show subtle feedback when a penguin is found
   */
  showPenguinFoundFeedback() {
    // Create a temporary notification or visual effect
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(212, 165, 165, 0.9);
      color: #4a3f3f;
      padding: 1.5rem 2rem;
      border-radius: 8px;
      z-index: 1000;
      font-family: Georgia, serif;
      font-size: 1.1rem;
      pointer-events: none;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      animation: fadeInOut 2s ease-in-out forwards;
    `;
    
    notification.textContent = '🐧 Found one!';
    document.body.appendChild(notification);
    
    // Add animation styles if not already present
    if (!document.getElementById('penguinFeedbackStyle')) {
      const style = document.createElement('style');
      style.id = 'penguinFeedbackStyle';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -60%); }
          10% { opacity: 1; transform: translate(-50%, -50%); }
          90% { opacity: 1; transform: translate(-50%, -50%); }
          100% { opacity: 0; transform: translate(-50%, -40%); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Remove notification after animation
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  /**
   * Check if all penguins have been found
   * If so, reveal the secret section
   */
  checkForCompletion() {
    console.log(`Checking completion: ${this.foundPenguins.size}/${this.penguinIds.length}`);
    if (this.foundPenguins.size === this.penguinIds.length) {
      console.log('All penguins found! Revealing secret section...');
      this.allPenguinsFound();
    }
  }

  /**
   * Called when all penguins are found
   * Reveals the secret section and shows celebration
   */
  allPenguinsFound() {
    // Small delay for dramatic effect
    setTimeout(() => {
      // Show celebration effect
      this.showCompletionCelebration();
      
      // Reveal secret section
      window.mainFunctions.revealSecretSection();
    }, 300);
  }

  /**
   * Show celebration effect when all penguins are found
   */
  showCompletionCelebration() {
    // Create a celebratory overlay/modal effect
    const celebration = document.createElement('div');
    celebration.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(212, 165, 165, 0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 999;
      animation: celebrationFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(celebration);
    
    // Add animation style if not present
    if (!document.getElementById('celebrationStyle')) {
      const style = document.createElement('style');
      style.id = 'celebrationStyle';
      style.textContent = `
        @keyframes celebrationFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Remove celebration element after animation
    setTimeout(() => {
      celebration.remove();
    }, 1000);
  }

  /**
   * Reset penguin progress (useful for testing)
   * Call window.penguinTracker.reset() in browser console
   */
  reset() {
    this.foundPenguins.clear();
    this.saveProgress();
    location.reload();
  }
}

/**
 * Initialize the penguin tracker when the page loads
 */
let penguinTracker;

function initPenguinSystem() {
  // Don't initialize penguins yet - they'll be initialized after Yes is clicked
  // This ensures they stay hidden until the main page is shown
}

/**
 * Actually initialize penguins after Yes is clicked
 */
function activatePenguins() {
  penguinTracker = new PenguinTracker();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPenguinSystem);
} else {
  initPenguinSystem();
}

// Export for console debugging
window.penguinTracker = penguinTracker;
