/* ========================================
   MAIN JAVASCRIPT - Ubuntu Seguros - CON FEATURES ACCORDION
   ======================================== */

// Application State
const App = {
    isLoaded: false,
    isMobile: window.innerWidth <= 768,
    
    // Configuration
    config: {
        animationDuration: 300,
        scrollOffset: 100,
        observerThreshold: 0.1,
        progressBarDelay: 200,
        progressAnimationDuration: 2000,
        mobileBreakpoint: 768,
        transitionDuration: 400,
        hoverDelay: 100
    },

    // Initialize the application
    init() {
        this.loadData();
        this.bindEvents();
        this.initAnimations();
        this.initFeaturesAccordion(); // 👈 NUEVA LÍNEA AGREGADA AQUÍ
        this.isLoaded = true;
    },

    // Load dynamic content
    loadData() {
        this.loadServices();
        this.loadCompanies();
        this.loadFeatures();
        this.loadFooterContent();
    },

    // Bind global events
    bindEvents() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.updateMobileState();
    },

    // Handle window resize
    handleResize() {
        this.updateMobileState();
    },

    // Update mobile state
    updateMobileState() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            this.handleMobileStateChange();
        }
    },

    // Handle mobile state changes
    handleMobileStateChange() {
        if (window.Navigation) {
            window.Navigation.updateMobileState(this.isMobile);
        }
    },

    // Initialize animations
    initAnimations() {
        this.initHeroDashboardAnimation();
        this.initStatsAnimation();
    },

    // ========================================
    // NUEVA SECCIÓN: FEATURES ACCORDION
    // ========================================
    
    initFeaturesAccordion() {
        const serviceItems = document.querySelectorAll('.service-item');
        
        if (serviceItems.length === 0) {
            console.log('No se encontraron service-items');
            return;
        }

        console.log(`✅ Inicializando ${serviceItems.length} service items`);

        serviceItems.forEach((item, index) => {
            const header = item.querySelector('.service-header');
            
            if (!header) {
                console.warn(`Service item ${index} no tiene header`);
                return;
            }

            // Click event
            header.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleServiceItem(item);
            });

            // Keyboard navigation
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleServiceItem(item);
                }
            });
        });

        console.log('✅ Features accordion inicializado correctamente');
    },

    toggleServiceItem(item) {
        const isActive = item.classList.contains('active');
        
        // Opción 1: Permitir múltiples items abiertos
        // Solo hace toggle del item actual
        item.classList.toggle('active');
        
        // Opción 2: Solo un item abierto a la vez
        // Descomenta estas líneas si prefieres ese comportamiento:
        /*
        const allItems = document.querySelectorAll('.service-item');
        allItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        item.classList.toggle('active');
        */
        
        // Track event
        this.trackEvent('feature_accordion_toggle', {
            feature: item.querySelector('.service-text')?.textContent,
            action: isActive ? 'close' : 'open'
        });
    },

    // ========================================
    // FIN NUEVA SECCIÓN: FEATURES ACCORDION
    // ========================================

    // Animación Dashboard Hero
    initHeroDashboardAnimation() {
        const dashboard = document.querySelector('.dashboard-mockup');
        
        if (!dashboard) return;

        const dashboardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateDashboardElements();
                    dashboardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        dashboardObserver.observe(dashboard);

        setTimeout(() => {
            const rect = dashboard.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                this.animateDashboardElements();
            }
        }, 500);
    },

    animateDashboardElements() {
        this.animateProgressBars();
        
        setTimeout(() => {
            this.animateChartLine();
        }, 1000);
    },

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        if (progressBars.length === 0) {
            return;
        }
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate');
            }, index * this.config.progressBarDelay);
        });
    },

    animateChartLine() {
        const chartLine = document.querySelector('.chart-line');
        
        if (chartLine) {
            chartLine.classList.add('animate');
        }
    },
    
    // Stats animation
    initStatsAnimation() {
        const statsSection = document.querySelector('.stats-section');
        
        if (!statsSection) {
            return;
        }
        
        const statsConfig = [
            { start: 0, end: 500, suffix: '+', duration: 2000 },
            { start: 0, end: 100, suffix: '%', duration: 2500 },
            { start: 0, end: 98, suffix: '%', duration: 1500 }
        ];
        
        let hasAnimated = false;
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    
                    statNumbers.forEach((stat, index) => {
                        stat.classList.add('count-animation');
                        
                        setTimeout(() => {
                            const config = statsConfig[index];
                            if (config) {
                                this.animateCounter(
                                    stat, 
                                    config.start, 
                                    config.end, 
                                    config.duration, 
                                    config.suffix
                                );
                            }
                        }, index * 200);
                    });
                    
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        statsObserver.observe(statsSection);
    },

    // Counter Animation Function
    animateCounter(element, start, end, duration, suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            let currentValue;
            if (suffix === '%') {
                currentValue = Math.floor(progress * (end - start) + start);
                element.textContent = currentValue + '%';
            } else if (end === '24/7') {
                element.textContent = '24/7';
            } else if (end.toString().includes('+') || suffix === '+') {
                currentValue = Math.floor(progress * (parseInt(end) - start) + start);
                element.textContent = currentValue + '+';
            } else {
                currentValue = Math.floor(progress * (end - start) + start);
                element.textContent = currentValue + suffix;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    // Load services data
    loadServices() {
        const services = [
            {
                icon: '🏥',
                title: 'Seguro de Salud Empresarial',
                description: 'Cobertura médica completa con acceso a los mejores especialistas y centros médicos para todos tus empleados.'
            },
            {
                icon: '🛡️',
                title: 'Seguros de Vida Corporativo',
                description: 'Protección financiera para las familias de tus empleados con coberturas flexibles y personalizables.'
            },
            {
                icon: '💼',
                title: 'Seguros de Accidentes Laborales',
                description: 'Cobertura integral ante accidentes en el trabajo con atención inmediata y rehabilitación completa.'
            },
            {
                icon: '🧠',
                title: 'Bienestar Mental',
                description: 'Programas de apoyo psicológico y bienestar emocional para mantener equipos saludables y productivos.'
            },
            {
                icon: '📱',
                title: 'Plataforma Digital',
                description: 'Gestión completa de seguros desde una plataforma intuitiva con reportes y analytics en tiempo real.'
            },
            {
                icon: '🚀',
                title: 'Consultoría Especializada',
                description: 'Asesoría personalizada para diseñar el plan de seguros perfecto para tu empresa y cultura organizacional.'
            }
        ];

        const servicesGrid = document.getElementById('services-grid');
        if (servicesGrid) {
            servicesGrid.innerHTML = services.map(service => `
                <div class="service-card">
                    <div class="service-icon">${service.icon}</div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                </div>
            `).join('');
        }
    },

    // Load companies data
    loadCompanies() {
        const companies = [
            'Bancolombia', 'Grupo Éxito', 'EPM', 'Avianca', 
            'Grupo Sura', 'Ecopetrol', 'Falabella', 'Colpatria',
            'Terpel', 'Corona', 'Argos', 'Nutresa'
        ];

        const companiesTrack = document.getElementById('companies-track');
        if (companiesTrack) {
            const duplicatedCompanies = [...companies, ...companies];
            
            companiesTrack.innerHTML = duplicatedCompanies.map(company => `
                <div class="company-logo">${company}</div>
            `).join('');
        }
    },

    // Load features data
    loadFeatures() {
        const features = [
            {
                icon: '⚡',
                title: 'Implementación Rápida',
                description: 'Configura tus seguros empresariales en menos de 48 horas con nuestro proceso optimizado.'
            },
            {
                icon: '🎯',
                title: 'Personalización Total',
                description: 'Adapta cada aspecto de la cobertura a las necesidades específicas de tu empresa y empleados.'
            },
            {
                icon: '📈',
                title: 'ROI Medible',
                description: 'Reduce el ausentismo laboral hasta un 40% y aumenta la productividad con nuestros programas.'
            },
            {
                icon: '🔒',
                title: 'Seguridad Garantizada',
                description: 'Protección de datos nivel bancario y cumplimiento de todas las normativas internacionales.'
            }
        ];

        const featuresGrid = document.getElementById('features-grid');
        if (featuresGrid) {
            featuresGrid.innerHTML = features.map(feature => `
                <div class="feature">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('');
        }
    },

    // Load footer content
    loadFooterContent() {
        const footerSections = [
            {
                title: 'Ubuntu Seguros',
                content: '<p>Transformando organizaciones a través de soluciones integrales en seguridad, salud y bienestar laboral.</p>'
            },
            {
                title: 'Servicios',
                content: `
                    <p><a href="#features">Acompañamiento SG-SST</a></p>
                    <p><a href="#features">Evaluación Riesgo Psicosocial</a></p>
                    <p><a href="#features">Formación de Líderes</a></p>
                    <p><a href="#actividades">Bienestar Mental</a></p>
                `
            },
            {
                title: 'Empresa',
                content: `
                    <p><a href="#pillars-section">Pilares de Valor</a></p>
                    <p><a href="#estadisticas">Nuestros Resultados</a></p>
                    <p><a href="#features">Por qué nos eligen</a></p>
                    <p><a href="/calculadora-arl">Calculadora ARL</a></p>
                `
            },
            {
                title: 'Contacto',
                content: `
                    <p>+57 304 4999242</p>
                    <p>daniela.parra@ubuntuseguros.com</p>
                    <p>Medellín, Colombia</p>
                `
            }
        ];

        const footerContent = document.getElementById('footer-content');
        if (footerContent) {
            footerContent.innerHTML = footerSections.map(section => `
                <div class="footer-section">
                    <h3>${section.title}</h3>
                    ${section.content}
                </div>
            `).join('');
        }
    },

    // Track events
    trackEvent(eventName, data) {
        console.log('Event:', eventName, data);
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
    }
};

// ========================================
// PILARES - COMPORTAMIENTO ACTUALIZADO
// ======================================== 

(function() {
    'use strict';

    const CONFIG = {
        mobileBreakpoint: 768,
        debugMode: true
    };

    function log(...args) {
        if (CONFIG.debugMode) {
            console.log('[Pilares]', ...args);
        }
    }

    function isMobile() {
        return window.innerWidth <= CONFIG.mobileBreakpoint;
    }

    function initPillars() {
        log('Inicializando pilares...');
        
        const pillars = document.querySelectorAll('.pillar-item');
        log(`Encontrados ${pillars.length} pilares`);

        if (pillars.length === 0) {
            return;
        }

        pillars.forEach((pillar, index) => setupPillar(pillar, index));
        setupResponsive();
        
        log('✅ Pilares inicializados correctamente');
    }

    function setupPillar(pillar, index) {
        const header = pillar.querySelector('.pillar-header');
        const arrow = pillar.querySelector('.pillar-arrow');
        const description = pillar.querySelector('.pillar-description');

        if (!header || !arrow || !description) {
            return;
        }

        log(`Configurando pilar ${index + 1}`);

        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);

        const updatedPillar = pillar;
        const updatedHeader = updatedPillar.querySelector('.pillar-header');

        updatedHeader.setAttribute('tabindex', '0');

        updatedHeader.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handlePillarClick(updatedPillar, index);
        });

        updatedHeader.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePillarClick(updatedPillar, index);
            }
        });

        log(`✅ Pilar ${index + 1} configurado`);
    }

    function handlePillarClick(pillar, index) {
        log(`Click en pilar ${index + 1}, es mobile: ${isMobile()}`);

        if (!isMobile()) {
            log('Desktop mode - ignorando click');
            return;
        }

        const wasActive = pillar.classList.contains('active');
        log(`Pilar estaba ${wasActive ? 'activo' : 'inactivo'}`);

        pillar.classList.toggle('active');
        const isNowActive = pillar.classList.contains('active');
        
        log(`Pilar ${index + 1} ahora está ${isNowActive ? 'ACTIVO' : 'INACTIVO'}`);
    }

    function setupResponsive() {
        log('Configurando comportamiento responsive');

        function updateLayout() {
            const arrows = document.querySelectorAll('.pillar-arrow');
            const pillars = document.querySelectorAll('.pillar-item');
            const mobile = isMobile();
            
            log(`Actualizando layout: ${mobile ? 'MOBILE' : 'DESKTOP'} (${window.innerWidth}px)`);

            arrows.forEach((arrow, index) => {
                arrow.style.display = mobile ? 'block' : 'none';
                log(`Flecha ${index + 1}: ${mobile ? 'visible' : 'oculta'}`);
            });

            if (mobile) {
                const activePillars = document.querySelectorAll('.pillar-item.active');
                if (activePillars.length === 0 && pillars.length > 0) {
                    pillars[0].classList.add('active');
                    log('Primer pilar activado por defecto en modo mobile');
                }
            } else {
                document.querySelectorAll('.pillar-item.active').forEach((pillar, index) => {
                    pillar.classList.remove('active');
                    log(`Pilar ${index + 1} cerrado (modo desktop)`);
                });
            }
        }

        updateLayout();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateLayout();
            }, 250);
        });
    }

    function domReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    domReady(() => {
        setTimeout(() => {
            initPillars();
        }, 500);
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            const pillars = document.querySelectorAll('.pillar-item');
            if (pillars.length === 0) {
                console.error('❌ ADVERTENCIA: No se encontraron pilares después del load');
            } else {
                log(`✅ Confirmado: ${pillars.length} pilares encontrados después del load`);
                
                if (isMobile()) {
                    const firstPillar = pillars[0];
                    if (!firstPillar.classList.contains('active')) {
                        firstPillar.classList.add('active');
                        log('✅ Primer pilar activado por defecto');
                    }
                }
            }
        }, 1000);
    });

})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for other modules
window.App = App;