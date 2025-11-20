/* ========================================
   NAVIGATION COMPONENT - Ubuntu Seguros (FIXED)
   ======================================== */

   const Navigation = {
    header: null,
    mobileToggle: null,
    mobileMenu: null,
    isMenuOpen: false,
    lastScrollY: 0,
    initialized: false,
    
    /**
     * Inicializa la navegación cuando el header está disponible
     */
    init() {
        // Esperar a que el header esté disponible
        this.waitForHeader().then(() => {
            this.header = document.querySelector('.header');
            this.mobileToggle = document.getElementById('mobile-menu-toggle');
            this.mobileMenu = document.getElementById('mobile-menu');
            
            if (!this.header) {
                console.error('Header element not found after waiting!');
                return;
            }
            
            if (!this.mobileToggle) {
                console.warn('Mobile menu toggle not found');
                return;
            }
            
            if (!this.mobileMenu) {
                console.warn('Mobile menu not found');
                return;
            }
            
            this.bindEvents();
            this.bindNavigationClicks();
            this.initialized = true;
            
            console.log('✅ Navigation initialized successfully');
        }).catch(error => {
            console.error('Error initializing navigation:', error);
        });
    },

    /**
     * Espera a que el header esté disponible en el DOM
     * @returns {Promise} Promesa que se resuelve cuando el header existe
     */
    waitForHeader() {
        return new Promise((resolve, reject) => {
            // Si el header ya existe, resolver inmediatamente
            if (document.querySelector('.header')) {
                resolve();
                return;
            }

            // Usar MutationObserver para esperar que se agregue el header
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.header')) {
                    obs.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Timeout de seguridad (5 segundos)
            setTimeout(() => {
                observer.disconnect();
                if (document.querySelector('.header')) {
                    resolve();
                } else {
                    reject(new Error('Header not loaded after timeout'));
                }
            }, 5000);
        });
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                this.mobileMenu && 
                !this.mobileMenu.contains(e.target) && 
                !this.mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu when clicking on mobile nav links
        if (this.mobileMenu) {
            const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => {
                        this.closeMobileMenu();
                    }, 300);
                });
            });
        }

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    },

    openMobileMenu() {
        if (!this.mobileMenu || !this.mobileToggle) {
            console.error('Mobile menu elements not found!');
            return;
        }

        this.isMenuOpen = true;
        
        // Add active classes
        this.mobileToggle.classList.add('active');
        this.mobileMenu.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        this.mobileMenu.focus();
        
        console.log('📱 Mobile menu opened');
    },

    closeMobileMenu() {
        if (!this.mobileMenu || !this.mobileToggle) {
            return;
        }

        this.isMenuOpen = false;
        
        // Remove active classes
        this.mobileToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';

        console.log('📱 Mobile menu closed');
    },

    bindNavigationClicks() {
        // Smooth scroll for anchor links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
    },

    handleNavClick(e) {
        const targetId = e.target.getAttribute('href');
        
        if (!targetId || targetId === '#') {
            return;
        }
        
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = this.header ? this.header.offsetHeight : 80;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update active state
            this.updateActiveLink(targetId);
            
            // Close mobile menu if open
            if (this.isMenuOpen) {
                setTimeout(() => {
                    this.closeMobileMenu();
                }, 300);
            }
        }
    },

    updateActiveLink(targetId) {
        // Remove active class from all links
        document.querySelectorAll('.nav-links a, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current link
        document.querySelectorAll(`a[href="${targetId}"]`).forEach(link => {
            link.classList.add('active');
        });
    },

    // Public API
    updateMobileState(isMobile) {
        if (!isMobile && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    },

    /**
     * Método para reinicializar si es necesario
     */
    reinit() {
        if (this.initialized) {
            console.log('Navigation already initialized');
            return;
        }
        this.init();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
});

// Make available globally
window.Navigation = Navigation;