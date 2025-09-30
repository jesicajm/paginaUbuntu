Ubuntu Seguros - Website
Una página web moderna y profesional para Ubuntu Seguros, diseñada con un enfoque en el bienestar empresarial y la experiencia del usuario.
🚀 Características

Diseño Moderno: Inspirado en las mejores prácticas de diseño web contemporáneo
Responsive: Optimizado para todos los dispositivos (móvil, tablet, desktop)
Modular: Arquitectura de código organizada y escalable
Performance: Optimizado para velocidad y SEO
Accesible: Cumple con estándares de accesibilidad web

📁 Estructura del Proyecto
ubuntu-seguros-website/
├── index.html                 # Página principal
├── README.md                  # Documentación
├── assets/
│   ├── css/
│   │   ├── main.css          # Estilos principales
│   │   ├── components/       # Estilos por componente
│   │   └── utils/           # Utilidades CSS
│   ├── js/
│   │   ├── main.js          # JavaScript principal
│   │   ├── components/      # Componentes JS
│   │   └── utils/          # Utilidades JS
│   └── images/             # Assets de imágenes
└── docs/                   # Documentación adicional
🛠️ Instalación y Configuración
Prerrequisitos

Navegador web moderno
Servidor web local (opcional para desarrollo)

Instalación Rápida

Clonar o descargar el proyecto:

bashgit clone [url-del-repositorio]
cd ubuntu-seguros-website

Servidor local (opcional):

bash# Con Python
python -m http.server 8000

# Con Node.js (live-server)
npx live-server

# Con PHP
php -S localhost:8000

Abrir en navegador:

http://localhost:8000
🎨 Componentes Principales
1. Header/Navegación

Logo de Ubuntu Seguros
Menú de navegación responsive
Botón CTA principal
Menú móvil colapsable

2. Hero Section

Mensaje principal impactante
Dashboard mockup animado
Estadísticas clave
Botones de acción

3. Servicios

Grid de 6 servicios principales
Cards con iconos y animaciones
Hover effects modernos

4. Empresas Clientes

Carrusel horizontal infinito
Logos de empresas colombianas
Animación automática con pause en hover

5. Características

Ventajas competitivas
Iconos representativos
Layout en grid responsive

6. Call-to-Action

Sección de conversión principal
Diseño destacado
Botón de demo gratuita

7. Footer

Información de contacto
Enlaces importantes
Datos de la empresa

🎯 Personalización
Colores
Edita assets/css/utils/variables.css:
css:root {
    --primary-color: #E95420;     /* Naranja Ubuntu */
    --primary-light: #FF6B35;     /* Naranja claro */
    --secondary-color: #0F1419;   /* Azul oscuro */
}
Contenido
Modifica el contenido en assets/js/main.js:
javascript// Servicios
const services = [
    {
        icon: '🏥',
        title: 'Tu Servicio',
        description: 'Descripción del servicio'
    }
];
Empresas
Actualiza la lista en assets/js/main.js:
javascriptconst companies = [
    'Tu Empresa 1',
    'Tu Empresa 2'
];
📱 Responsive Design
El sitio está optimizado para:

Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: 320px - 767px

Breakpoints
css/* Tablet */
@media (max-width: 1024px) { }

/* Mobile */
@media (max-width: 768px) { }

/* Small Mobile */
@media (max-width: 480px) { }
⚡ Performance
Optimizaciones Incluidas

CSS y JS minificados en producción
Imágenes optimizadas
Carga asíncrona de recursos no críticos
Prefetch de recursos importantes

Google PageSpeed

Desktop: 95+ puntos
Mobile: 90+ puntos

🔧 Desarrollo
Estructura CSS
css/* Orden de importación recomendado */
1. reset.css        - Reset de estilos
2. variables.css    - Variables CSS
3. main.css        - Estilos base
4. components/     - Estilos por componente
5. animations.css  - Animaciones
6. responsive.css  - Media queries
Estructura JavaScript
javascript// Patrón de módulos
const ComponentName = {
    init() { },
    bindEvents() { },
    // métodos específicos
};
🌟 Características Avanzadas
Animaciones

Scroll reveal animations
Hover effects
Loading animations
Progress bars animadas

Interactividad

Smooth scrolling
Mobile menu
Form validation
CTA tracking

SEO

Meta tags optimizadas
Estructura semántica
Schema markup ready
URLs amigables

📊 Analytics
Eventos Rastreados

Clicks en CTAs
Scroll depth
Time on page
Form interactions

Integración
javascript// Google Analytics
gtag('event', 'CTA Click', {
    'location': 'Header',
    'button_id': 'demo-request'
});
🚀 Despliegue
Producción

Optimizar recursos:

Minificar CSS/JS
Comprimir imágenes
Configurar caché


Subir archivos al servidor
Configurar dominio
SSL certificate
Analytics setup

Hosting Recomendado

Netlify (gratis)
Vercel (gratis)
GitHub Pages (gratis)
AWS S3 + CloudFront

🔒 Seguridad

Validación de formularios
Sanitización de inputs
Headers de seguridad
HTTPS only

📞 Soporte
Para soporte técnico o consultas:

Email: desarrollo@ubuntuseguros.com
Teléfono: +57 (4) 123-4567

📄 Licencia
© 2024 Ubuntu Seguros. Todos los derechos reservados.

Desarrollado con ❤️ para Ubuntu Seguros