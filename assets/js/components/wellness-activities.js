/* ========================================
   WELLNESS CAROUSEL FUNCTIONALITY
   ======================================== */

   class WellnessCarousel {
    constructor() {
        this.wrapper = null;
        this.slides = null;
        this.indicators = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.autoplayBtn = null;
        
        this.currentSlide = 0;
        this.isAutoplay = true;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isMobile = false;
        
        this.init();
    }
    
    init() {
        // Verificar si estamos en mobile
        this.updateMobileState();
        
        // Solo inicializar si estamos en mobile
        if (!this.isMobile) {
            console.log('Wellness Carousel: Desktop mode - no se inicializa el carrusel');
            return;
        }
        
        // Buscar elementos del DOM
        this.findElements();
        
        // Solo continuar si encontramos los elementos necesarios
        if (this.wrapper && this.slides && this.slides.length > 0) {
            console.log('Wellness Carousel: Inicializando en modo mobile');
            this.setupEventListeners();
            this.startAutoplay();
            this.updateCarousel();
        } else {
            console.log('Wellness Carousel: Elementos no encontrados, no se inicializa');
        }
    }
    
    findElements() {
        this.wrapper = document.getElementById('wellnessCarouselWrapper');
        this.slides = document.querySelectorAll('#wellnessCarouselWrapper .carousel-slide');
        this.indicators = document.querySelectorAll('#wellnessIndicators .indicator');
        this.prevBtn = document.getElementById('wellnessPrevBtn');
        this.nextBtn = document.getElementById('wellnessNextBtn');
        this.autoplayBtn = document.getElementById('wellnessAutoplayBtn');
        
        console.log('Wellness Carousel: Elementos encontrados:', {
            wrapper: !!this.wrapper,
            slides: this.slides.length,
            indicators: this.indicators.length,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            autoplayBtn: !!this.autoplayBtn
        });
    }
    
    updateMobileState() {
        this.isMobile = window.innerWidth <= 810;
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Autoplay control
        if (this.autoplayBtn) {
            this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
        }
        
        // Touch events for mobile swipe
        if (this.wrapper) {
            this.wrapper.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.pauseAutoplay();
            });
            
            this.wrapper.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
                if (this.isAutoplay) this.startAutoplay();
            });
            
            // Pause on hover (for devices with hover capability)
            this.wrapper.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.wrapper.addEventListener('mouseleave', () => {
                if (this.isAutoplay) this.startAutoplay();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Solo responder si el carrusel está visible (mobile)
            if (!this.isMobile) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoplay();
            }
        });
        
        // Responsive handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.updateMobileState();
        
        // Si cambiamos de mobile a desktop o viceversa
        if (wasMobile !== this.isMobile) {
            if (this.isMobile && !this.wrapper) {
                // Cambió a mobile pero no tenemos elementos - reinicializar
                setTimeout(() => {
                    this.findElements();
                    if (this.wrapper && this.slides && this.slides.length > 0) {
                        this.setupEventListeners();
                        this.startAutoplay();
                        this.updateCarousel();
                    }
                }, 100);
            } else if (!this.isMobile) {
                // Cambió a desktop - pausar autoplay
                this.pauseAutoplay();
            } else if (this.isMobile && this.isAutoplay) {
                // Volvió a mobile - reanudar autoplay si estaba activo
                this.startAutoplay();
            }
        }
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    nextSlide() {
        if (!this.slides || this.slides.length === 0) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateCarousel();
    }
    
    prevSlide() {
        if (!this.slides || this.slides.length === 0) return;
        
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (!this.slides || index < 0 || index >= this.slides.length) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.slides || this.slides.length === 0) return;
        
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update wrapper transform
        if (this.wrapper) {
            const translateX = -this.currentSlide * 100;
            this.wrapper.style.transform = `translateX(${translateX}%)`;
        }
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoplay() {
        if (!this.isMobile || this.autoplayInterval) return;
        
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
        
        if (this.autoplayBtn) {
            this.autoplayBtn.innerHTML = '⏸️';
            this.autoplayBtn.title = 'Pausar autoplay';
        }
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    toggleAutoplay() {
        this.isAutoplay = !this.isAutoplay;
        
        if (this.isAutoplay) {
            this.startAutoplay();
        } else {
            this.pauseAutoplay();
            if (this.autoplayBtn) {
                this.autoplayBtn.innerHTML = '▶️';
                this.autoplayBtn.title = 'Reanudar autoplay';
            }
        }
    }
    
    // Método público para destruir el carrusel
    destroy() {
        this.pauseAutoplay();
        // Aquí podrías limpiar event listeners si fuera necesario
        console.log('Wellness Carousel: Destruido');
    }
}

/* ========================================
   INTEGRACIÓN CON EL SISTEMA EXISTENTE
   ======================================== */

// Función para inicializar el carrusel
function initWellnessCarousel() {
    // Verificar si ya existe una instancia
    if (window.wellnessCarousel) {
        window.wellnessCarousel.destroy();
    }
    
    // Crear nueva instancia
    window.wellnessCarousel = new WellnessCarousel();
}

// Auto-inicialización
function domReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

// Inicializar cuando el DOM esté listo
domReady(() => {
    // Esperar un poco para asegurar que otros scripts se hayan cargado
    setTimeout(() => {
        initWellnessCarousel();
    }, 500);
});

// También inicializar en window load como backup
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!window.wellnessCarousel || !window.wellnessCarousel.wrapper) {
            console.log('Wellness Carousel: Backup initialization');
            initWellnessCarousel();
        }
    }, 1000);
});

// Reinicializar en resize (para cambios de orientación, etc.)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Si cambiamos a mobile y no hay carrusel, inicializar
        if (window.innerWidth <= 810 && (!window.wellnessCarousel || !window.wellnessCarousel.wrapper)) {
            initWellnessCarousel();
        }
    }, 300);
});

// Exportar funciones para debug
if (typeof window !== 'undefined') {
    window.initWellnessCarousel = initWellnessCarousel;
}