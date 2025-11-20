/* ========================================
   LAYOUT LOADER - Ubuntu Seguros
   Carga componentes dinámicos con preloader
   ======================================== */

   export const LayoutLoader = {
    /**
     * Carga un componente HTML dinámicamente
     * @param {string} id - ID del elemento placeholder
     * @param {string} file - Ruta del archivo HTML
     */
    async loadComponent(id, file) {
        try {
            const res = await fetch(file);
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const html = await res.text();
            const element = document.getElementById(id);
            
            if (element) {
                element.innerHTML = html;
                console.log(`✅ ${file} cargado`);
            } else {
                console.warn(`⚠️ Elemento #${id} no encontrado`);
            }
        } catch (err) {
            console.error(`❌ Error al cargar ${file}:`, err);
            throw err; // Re-lanzar el error para manejarlo en init
        }
    },

    /**
     * Muestra el loader de página
     */
    showLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    },

    /**
     * Oculta el loader de página con animación
     */
    hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                // Remover del DOM completamente
                loader.remove();
            }, 300);
        }
    },

    /**
     * Muestra el contenido principal
     */
    showContent() {
        document.body.classList.add('loaded');
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.visibility = 'visible';
        }
    },

    /**
     * Inicializa la carga de todos los componentes
     */
    async init() {
        console.log('🔄 Iniciando carga de layouts...');
        
        try {
            // Mostrar loader
            this.showLoader();
            
            // Cargar componentes en paralelo para mayor velocidad
            await Promise.all([
                this.loadComponent('header-placeholder', '../components/header.html'),
                this.loadComponent('footer-placeholder', '../components/footer.html')
            ]);
            
            // Esperar un momento para asegurar que el DOM esté actualizado
            await this.delay(50);
            
            // Inicializar Navigation después de cargar el header
            if (window.Navigation) {
                window.Navigation.reinit();
                console.log('🔄 Navigation reinicializado');
            } else {
                console.warn('⚠️ window.Navigation no está disponible');
            }
            
            // Pequeño delay adicional para suavizar la transición
            await this.delay(150);
            
            console.log('✅ Layouts cargados exitosamente');
            
            // Mostrar contenido y ocultar loader
            this.showContent();
            this.hideLoader();
            
        } catch (error) {
            console.error('❌ Error crítico cargando layouts:', error);
            // Ocultar loader incluso si hay error
            this.hideLoader();
            this.showContent();
        }
    },

    /**
     * Función de delay auxiliar
     * @param {number} ms - Milisegundos de espera
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};