/* ========================================
   MAIN JAVASCRIPT - Ubuntu Seguros - VERSIÓN FINAL
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
        progressBarDelay: 200, // Delay entre barras de progreso
        progressAnimationDuration: 2000, // Duración animación barras
        mobileBreakpoint: 768,
        transitionDuration: 400,
        hoverDelay: 100
    },

    // Initialize the application
    init() {
        this.loadData();
        this.bindEvents();
        this.initAnimations();
        // Los pilares se inicializan con el script simplificado al final
        this.isLoaded = true;
        console.log('Ubuntu Seguros Website Loaded ✅');
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
        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // CTA button handlers
        this.bindCTAButtons();
        
        // Update mobile state
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
        console.log(`Mode changed to: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
        // Re-initialize components that need mobile/desktop handling
        if (window.Navigation) {
            window.Navigation.updateMobileState(this.isMobile);
        }
    },

    // Initialize animations (UPDATED con barras de progreso)
    initAnimations() {
        // Animar dashboard del hero
        this.initHeroDashboardAnimation();
        
        // Initialize stats section animation
        this.initStatsAnimation();
    },

    // ========================================
    // NUEVA FUNCIÓN: Animación Dashboard Hero
    // ========================================
    initHeroDashboardAnimation() {
        const dashboard = document.querySelector('.dashboard-mockup');
        
        if (!dashboard) return;

        // Crear observer para animar cuando el dashboard entra en viewport
        const dashboardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Iniciar animaciones del dashboard
                    this.animateDashboardElements();
                    
                    // Desconectar observer después de animar
                    dashboardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar el dashboard
        dashboardObserver.observe(dashboard);

        // También animar inmediatamente si ya está visible
        setTimeout(() => {
            const rect = dashboard.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                this.animateDashboardElements();
            }
        }, 500);
    },

    // ========================================
    // NUEVA FUNCIÓN: Animar elementos del dashboard
    // ========================================
    animateDashboardElements() {
        console.log('🎯 Iniciando animaciones del dashboard');
        
        // 1. Animar barras de progreso de forma escalonada
        this.animateProgressBars();
        
        // 2. Animar línea del chart después de las barras
        setTimeout(() => {
            this.animateChartLine();
        }, 1000);
    },

    // ========================================
    // NUEVA FUNCIÓN: Animar barras de progreso
    // ========================================
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        if (progressBars.length === 0) {
            console.log('⚠️ No se encontraron barras de progreso');
            return;
        }

        console.log(`📊 Animando ${progressBars.length} barras de progreso`);
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate');
                console.log(`✨ Barra ${index + 1} animada`);
            }, index * this.config.progressBarDelay);
        });
    },

    // ========================================
    // NUEVA FUNCIÓN: Animar línea del chart
    // ========================================
    animateChartLine() {
        const chartLine = document.querySelector('.chart-line');
        
        if (chartLine) {
            chartLine.classList.add('animate');
            console.log('📈 Línea del chart animada');
        } else {
            console.log('⚠️ No se encontró la línea del chart');
        }
    },
    
    // Stats animation (función existente actualizada)
    initStatsAnimation() {
        const statsSection = document.querySelector('.stats-section');
        
        if (!statsSection) {
            console.log('⚠️ No se encontró la sección de estadísticas');
            return;
        }
        
        console.log('🎯 Configurando animación de estadísticas con scroll trigger');
        
        // Stats configuration - puedes personalizar estos valores
        const statsConfig = [
            { start: 0, end: 500, suffix: '+', duration: 2000 },
            { start: 0, end: 100, suffix: '%', duration: 2500 },
            { start: 0, end: 98, suffix: '%', duration: 1500 }
        ];
        
        // Variable para rastrear si ya se animó
        let hasAnimated = false;
        
        // Create intersection observer for stats animation
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    console.log('📊 Usuario llegó a la sección de estadísticas - iniciando animación');
                    hasAnimated = true;
                    
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    console.log(`🔢 Encontrados ${statNumbers.length} elementos de estadística`);
                    
                    // Add animation class to each stat item
                    statNumbers.forEach((stat, index) => {
                        stat.classList.add('count-animation');
                        
                        // Start counter animation with staggered delay
                        setTimeout(() => {
                            const config = statsConfig[index];
                            if (config) {
                                console.log(`🎲 Iniciando contador ${index + 1}: ${config.start} → ${config.end}${config.suffix}`);
                                this.animateCounter(
                                    stat, 
                                    config.start, 
                                    config.end, 
                                    config.duration, 
                                    config.suffix
                                );
                            }
                        }, index * 200); // 200ms delay between each stat
                    });
                    
                    // Disconnect observer after animation starts to prevent re-triggering
                    statsObserver.unobserve(entry.target);
                    console.log('✅ Animación de estadísticas completada');
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% of section is visible
            rootMargin: '0px 0px -100px 0px' // Trigger a bit before the section is fully visible
        });
        
        // Start observing the stats section
        statsObserver.observe(statsSection);
        console.log('👁️ Observer configurado para la sección de estadísticas');
    },

    // Counter Animation Function (función existente)
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

    // Load services data (función existente)
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

    // Load companies data (función existente)
    loadCompanies() {
        const companies = [
            'Bancolombia', 'Grupo Éxito', 'EPM', 'Avianca', 
            'Grupo Sura', 'Ecopetrol', 'Falabella', 'Colpatria',
            'Terpel', 'Corona', 'Argos', 'Nutresa'
        ];

        const companiesTrack = document.getElementById('companies-track');
        if (companiesTrack) {
            // Duplicate companies for infinite scroll effect
            const duplicatedCompanies = [...companies, ...companies];
            
            companiesTrack.innerHTML = duplicatedCompanies.map(company => `
                <div class="company-logo">${company}</div>
            `).join('');
        }
    },

    // Load features data (función existente)
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

    // Load footer content (función existente)
    loadFooterContent() {
        const footerSections = [
            {
                title: 'Ubuntu Seguros',
                content: '<p>Transformando el bienestar empresarial a través de seguros integrales y tecnología de vanguardia.</p>'
            },
            {
                title: 'Servicios',
                content: `
                    <p><a href="#servicios">Seguros de Salud</a></p>
                    <p><a href="#servicios">Seguros de Vida</a></p>
                    <p><a href="#servicios">Accidentes Laborales</a></p>
                    <p><a href="#servicios">Bienestar Mental</a></p>
                `
            },
            {
                title: 'Empresa',
                content: `
                    <p><a href="#">Sobre nosotros</a></p>
                    <p><a href="#">Casos de éxito</a></p>
                    <p><a href="#">Blog</a></p>
                    <p><a href="#">Carreras</a></p>
                `
            },
            {
                title: 'Contacto',
                content: `
                    <p>📞 +57 (4) 123-4567</p>
                    <p>✉️ hola@ubuntuseguros.com</p>
                    <p>📍 Medellín, Colombia</p>
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

    // Bind CTA button events (función existente)
    bindCTAButtons() {
        const ctaButtons = [
            'header-cta',
            'hero-primary-cta',
            'hero-secondary-cta',
            'main-cta'
        ];

        ctaButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                if (buttonId === "header-cta") return;
                
                button.addEventListener('click', (e) => {
                    this.handleCTAClick(e, buttonId);
                });
            }
        });
    },

    // Handle CTA button clicks (función existente)
    handleCTAClick(event, buttonId) {
        event.preventDefault();
        
        // Analytics tracking
        this.trackEvent('CTA Click', {
            buttonId: buttonId,
            location: this.getCTALocation(buttonId)
        });

        // Show demo modal or redirect
        if (buttonId.includes('demo') || buttonId.includes('secondary')) {
            this.showDemoModal();
        } else {
            this.showContactForm();
        }
    },

    // Get CTA location for analytics (función existente)
    getCTALocation(buttonId) {
        const locations = {
            'header-cta': 'Header',
            'hero-primary-cta': 'Hero Primary',
            'hero-secondary-cta': 'Hero Secondary',
            'main-cta': 'Main CTA Section'
        };
        return locations[buttonId] || 'Unknown';
    },

    // Show demo modal (función existente)
    showDemoModal() {
        alert('Demo modal would open here. Integrate with your preferred modal library.');
        console.log('Demo requested');
    },

    // Show contact form (función existente)
    showContactForm() {
        alert('Contact form would open here. Integrate with your preferred form handler.');
        console.log('Contact form requested');
    },

    // Track events (función existente)
    trackEvent(eventName, data) {
        console.log(`Event: ${eventName}`, data);
        
        // Integrate with Google Analytics, Mixpanel, etc.
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

    console.log('🚀 Inicializando pilares con comportamiento actualizado...');

    // Configuración
    const CONFIG = {
        mobileBreakpoint: 768,
        debugMode: true // Cambiar a false en producción
    };

    // Función de logging condicional
    function log(...args) {
        if (CONFIG.debugMode) {
            console.log('🎯 PILARES:', ...args);
        }
    }

    // Función para verificar si es mobile
    function isMobile() {
        return window.innerWidth <= CONFIG.mobileBreakpoint;
    }

    // Función principal de inicialización
    function initPillars() {
        log('Inicializando pilares...');
        
        // Buscar todos los elementos pillar
        const pillars = document.querySelectorAll('.pillar-item');
        log(`Encontrados ${pillars.length} pilares`);

        if (pillars.length === 0) {
            console.error('❌ No se encontraron pilares');
            return;
        }

        // Configurar cada pilar
        pillars.forEach((pillar, index) => setupPillar(pillar, index));

        // Configurar comportamiento responsive
        setupResponsive();
        
        log('✅ Pilares inicializados correctamente');
    }

    // Configurar un pilar individual
    function setupPillar(pillar, index) {
        const header = pillar.querySelector('.pillar-header');
        const arrow = pillar.querySelector('.pillar-arrow');
        const description = pillar.querySelector('.pillar-description');

        if (!header || !arrow || !description) {
            console.error(`❌ Pilar ${index + 1} tiene elementos faltantes:`, {
                header: !!header,
                arrow: !!arrow,
                description: !!description
            });
            return;
        }

        log(`Configurando pilar ${index + 1}`);

        // Limpiar event listeners previos
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);

        // Obtener referencias actualizadas
        const updatedPillar = pillar;
        const updatedHeader = updatedPillar.querySelector('.pillar-header');

        // Asegurar que el header es focusable
        updatedHeader.setAttribute('tabindex', '0');

        // Event listener para click
        updatedHeader.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handlePillarClick(updatedPillar, index);
        });

        // Event listener para teclado
        updatedHeader.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePillarClick(updatedPillar, index);
            }
        });

        log(`✅ Pilar ${index + 1} configurado`);
    }

    // Manejar click en pilar - COMPORTAMIENTO ACTUALIZADO
    function handlePillarClick(pillar, index) {
        log(`Click en pilar ${index + 1}, es mobile: ${isMobile()}`);

        // Solo funcionar en mobile
        if (!isMobile()) {
            log('Desktop mode - ignorando click');
            return;
        }

        const wasActive = pillar.classList.contains('active');
        log(`Pilar estaba ${wasActive ? 'activo' : 'inactivo'}`);

        // NUEVO: NO cerrar otros pilares - permitir múltiples abiertos
        // Simplemente hacer toggle del pilar actual
        pillar.classList.toggle('active');
        const isNowActive = pillar.classList.contains('active');
        
        log(`Pilar ${index + 1} ahora está ${isNowActive ? 'ACTIVO' : 'INACTIVO'}`);

        // Debug: verificar estilos de la descripción
        if (CONFIG.debugMode) {
            const description = pillar.querySelector('.pillar-description');
            if (description) {
                setTimeout(() => {
                    const styles = window.getComputedStyle(description);
                    log(`Estilos de descripción pilar ${index + 1}:`, {
                        maxHeight: styles.maxHeight,
                        opacity: styles.opacity,
                        marginTop: styles.marginTop,
                        overflow: styles.overflow,
                        transition: styles.transition
                    });
                }, 100);
            }
        }
    }

    // Configurar comportamiento responsive - ACTUALIZADO
    function setupResponsive() {
        log('Configurando comportamiento responsive');

        // Función para actualizar layout
        function updateLayout() {
            const arrows = document.querySelectorAll('.pillar-arrow');
            const pillars = document.querySelectorAll('.pillar-item');
            const mobile = isMobile();
            
            log(`Actualizando layout: ${mobile ? 'MOBILE' : 'DESKTOP'} (${window.innerWidth}px)`);

            arrows.forEach((arrow, index) => {
                arrow.style.display = mobile ? 'block' : 'none';
                log(`Flecha ${index + 1}: ${mobile ? 'visible' : 'oculta'}`);
            });

            // NUEVO: En mobile, mostrar el primer pilar por defecto si ninguno está activo
            if (mobile) {
                const activePillars = document.querySelectorAll('.pillar-item.active');
                if (activePillars.length === 0 && pillars.length > 0) {
                    pillars[0].classList.add('active');
                    log('Primer pilar activado por defecto en modo mobile');
                }
            } else {
                // En desktop, cerrar todos los acordeones
                document.querySelectorAll('.pillar-item.active').forEach((pillar, index) => {
                    pillar.classList.remove('active');
                    log(`Pilar ${index + 1} cerrado (modo desktop)`);
                });
            }
        }

        // Actualizar al cargar
        updateLayout();

        // Actualizar en resize con debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateLayout();
            }, 250);
        });
    }

    // Función de diagnóstico completo
    function diagnosticoPillars() {
        console.log('\n=== DIAGNÓSTICO COMPLETO PILARES ===');
        
        const pillars = document.querySelectorAll('.pillar-item');
        console.log(`Total pilares: ${pillars.length}`);
        console.log(`Viewport: ${window.innerWidth}px (${isMobile() ? 'MOBILE' : 'DESKTOP'})`);
        
        pillars.forEach((pillar, index) => {
            console.log(`\nPilar ${index + 1}:`);
            
            const header = pillar.querySelector('.pillar-header');
            const arrow = pillar.querySelector('.pillar-arrow');
            const description = pillar.querySelector('.pillar-description');
            const title = pillar.querySelector('.pillar-title');
            
            console.log(`  Header: ${header ? 'SI' : 'NO'}`);
            console.log(`  Arrow: ${arrow ? 'SI' : 'NO'}`);
            console.log(`  Description: ${description ? 'SI' : 'NO'}`);
            console.log(`  Title: ${title ? title.textContent : 'NO'}`);
            console.log(`  Active: ${pillar.classList.contains('active') ? 'SI' : 'NO'}`);
            
            if (arrow) {
                const arrowStyles = window.getComputedStyle(arrow);
                console.log(`  Arrow display: ${arrowStyles.display}`);
                console.log(`  Arrow transform: ${arrowStyles.transform}`);
                console.log(`  Arrow color: ${arrowStyles.color}`);
            }
            
            if (description) {
                const descStyles = window.getComputedStyle(description);
                console.log(`  Desc maxHeight: ${descStyles.maxHeight}`);
                console.log(`  Desc opacity: ${descStyles.opacity}`);
                console.log(`  Desc marginTop: ${descStyles.marginTop}`);
            }
        });
        
        console.log('=== FIN DIAGNÓSTICO ===\n');
    }

    // Función de test manual
    function testPillar(index) {
        const pillars = document.querySelectorAll('.pillar-item');
        if (index >= 0 && index < pillars.length) {
            log(`Testeando pilar ${index + 1} manualmente`);
            handlePillarClick(pillars[index], index);
        } else {
            console.error(`Índice ${index} fuera de rango. Disponibles: 0-${pillars.length - 1}`);
        }
    }

    // Función para mostrar todos los pilares (útil para testing)
    function showAllPillars() {
        if (!isMobile()) {
            log('Solo funciona en modo mobile');
            return;
        }
        
        const pillars = document.querySelectorAll('.pillar-item');
        pillars.forEach((pillar, index) => {
            if (!pillar.classList.contains('active')) {
                pillar.classList.add('active');
                log(`Pilar ${index + 1} activado`);
            }
        });
        log('Todos los pilares mostrados');
    }

    // Función para ocultar todos los pilares
    function hideAllPillars() {
        const pillars = document.querySelectorAll('.pillar-item');
        pillars.forEach((pillar, index) => {
            if (pillar.classList.contains('active')) {
                pillar.classList.remove('active');
                log(`Pilar ${index + 1} desactivado`);
            }
        });
        log('Todos los pilares ocultados');
    }

    // Inicializar cuando el DOM esté listo
    function domReady(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    // Auto-inicializar
    domReady(() => {
        // Pequeño delay para asegurar que otros scripts hayan cargado
        setTimeout(() => {
            initPillars();
            
            // Funciones globales para debug
            if (CONFIG.debugMode) {
                window.diagnosticoPillars = diagnosticoPillars;
                window.testPillar = testPillar;
                window.reinitPillars = initPillars;
                window.showAllPillars = showAllPillars;
                window.hideAllPillars = hideAllPillars;
                
                console.log('🔧 Funciones de debug disponibles:');
                console.log('  - diagnosticoPillars() : diagnóstico completo');
                console.log('  - testPillar(index) : probar pilar específico');
                console.log('  - reinitPillars() : reinicializar pilares');
                console.log('  - showAllPillars() : mostrar todos los pilares');
                console.log('  - hideAllPillars() : ocultar todos los pilares');
            }
        }, 500);
    });

    // También inicializar en window load como backup
    window.addEventListener('load', () => {
        setTimeout(() => {
            const pillars = document.querySelectorAll('.pillar-item');
            if (pillars.length === 0) {
                console.error('❌ ADVERTENCIA: No se encontraron pilares después del load');
            } else {
                log(`✅ Confirmado: ${pillars.length} pilares encontrados después del load`);
                
                // Verificar que el primer pilar esté activo en mobile
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