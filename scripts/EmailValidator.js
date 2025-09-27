// Email validation and form handling
class EmailValidator {
    constructor() {
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.init();
    }

    init() {
        this.form = document.getElementById('emailForm');
        this.emailInput = document.getElementById('emailInput');
        this.errorIcon = document.getElementById('errorIcon');
        this.errorMessage = document.getElementById('errorMessage');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.modalCloseBtn = document.getElementById('modalCloseBtn');

        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('input', () => this.clearError());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.closeModal();
            }
        });

        // Handle escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.emailInput.value.trim();
        
        if (this.validateEmailInput(email)) {
            this.showSuccess();
            this.resetForm();
        }
    }

    validateEmailInput(email) {
        if (!email) {
            this.showError('Email address cannot be empty');
            return false;
        }

        if (!this.emailRegex.test(email)) {
            this.showError('Please provide a valid email');
            return false;
        }

        return true;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        if (email && !this.emailRegex.test(email)) {
            this.showError('Please provide a valid email');
        }
    }

    showError(message) {
        this.emailInput.classList.add('error');
        this.errorIcon.classList.add('show');
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        
        // Add shake animation
        this.emailInput.addEventListener('animationend', () => {
            this.emailInput.style.animation = '';
        }, { once: true });
        
        // Focus back to input for better UX
        this.emailInput.focus();
    }

    clearError() {
        this.emailInput.classList.remove('error');
        this.errorIcon.classList.remove('show');
        this.errorMessage.classList.remove('show');
        
        // Clear error message after transition
        setTimeout(() => {
            if (!this.errorMessage.classList.contains('show')) {
                this.errorMessage.textContent = '';
            }
        }, 300);
    }

    showSuccess() {
        this.modalOverlay.classList.add('show');
        
        // Focus trap in modal
        this.modalCloseBtn.focus();
        
        // Add to localStorage for analytics (if needed)
        try {
            const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
            subscribers.push({
                email: this.emailInput.value.trim(),
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
        } catch (error) {
            console.warn('Could not save subscriber data:', error);
        }
    }

    closeModal() {
        this.modalOverlay.classList.remove('show');
        this.emailInput.focus();
    }

    resetForm() {
        this.form.reset();
        this.clearError();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailValidator();
});

// Add smooth scrolling for better UX
if (CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}