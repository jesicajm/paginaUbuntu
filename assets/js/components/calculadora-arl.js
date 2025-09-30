/**
 * ===============================================
 * CALCULADORA ARL - UBUNTU SEGUROS
 * Archivo: script.js
 * Versión: 2.0.0
 * ===============================================
 */

'use strict';

// ===============================================
// MÓDULO DE CONSTANTES
// ===============================================
const ARLConstants = {
    // Tarifas de riesgo ARL Colombia 2024
    RISK_RATES: {
        1: 0.522,
        2: 1.044,
        3: 2.436,
        4: 4.350,
        5: 6.960
    },
    
    // Nombres de clases de riesgo
    RISK_NAMES: {
        1: 'Clase I - Riesgo Mínimo',
        2: 'Clase II - Riesgo Bajo',
        3: 'Clase III - Riesgo Medio',
        4: 'Clase IV - Riesgo Alto',
        5: 'Clase V - Riesgo Máximo'
    },

    // Sectores económicos
    ECONOMIC_SECTORS: {
        'comercio': 'Comercio, TIC y Servicios',
        'agricultura': 'Agricultura y Manufactura',
        'alimentos': 'Alimentos y Químicos',
        'textiles': 'Textiles y Metalmecánica',
        'petroleo': 'Petróleo y Construcción'
    },

    // Límites y validaciones
    MIN_SALARY_2024: 1300000,
    MAX_EMPLOYEES_PER_GROUP: 9999,
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 4000
};

// ===============================================
// MÓDULO DE UTILIDADES
// ===============================================
const ARLUtils = {
    /**
     * Formatea un número como moneda colombiana
     * @param {number} amount - Cantidad a formatear
     * @returns {string} - Cantidad formateada
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Formatea un número con separadores de miles
     * @param {number} number - Número a formatear
     * @returns {string} - Número formateado
     */
    formatNumber(number) {
        return new Intl.NumberFormat('es-CO').format(number);
    },

    /**
     * Convierte texto con formato de moneda a número
     * @param {string} value - Valor a convertir
     * @returns {number} - Número convertido
     */
    parseCurrency(value) {
        return parseInt(value.replace(/\D/g, '')) || 0;
    },

    /**
     * Valida si un salario cumple con el mínimo legal
     * @param {number} salary - Salario a validar
     * @returns {boolean} - True si es válido
     */
    validateSalary(salary) {
        return salary >= ARLConstants.MIN_SALARY_2024;
    },

    /**
     * Valida el número de empleados en un grupo
     * @param {number} count - Número de empleados
     * @returns {boolean} - True si es válido
     */
    validateEmployeeCount(count) {
        return count > 0 && count <= ARLConstants.MAX_EMPLOYEES_PER_GROUP;
    },

    /**
     * Genera un ID único
     * @returns {string} - ID único
     */
    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Función de delay para simulaciones
     * @param {number} ms - Milisegundos de espera
     * @returns {Promise} - Promesa que se resuelve después del delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Valida si un elemento del DOM existe
     * @param {string} selector - Selector CSS
     * @returns {HTMLElement|null} - Elemento o null
     */
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Elemento no encontrado: ${selector}`);
        }
        return element;
    },

    /**
     * Debounce function para optimizar eventos
     * @param {Function} func - Función a ejecutar
     * @param {number} wait - Tiempo de espera
     * @returns {Function} - Función debounced
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ===============================================
// MÓDULO DE CÁLCULOS ARL
// ===============================================
const ARLCalculations = {
    /**
     * Calcula el aporte mensual ARL para un empleado
     * @param {number} salary - Salario mensual
     * @param {number} riskClass - Clase de riesgo (1-5)
     * @returns {number} - Aporte mensual
     */
    calculateMonthlyContribution(salary, riskClass) {
        if (!salary || !riskClass || !ARLConstants.RISK_RATES[riskClass]) {
            throw new Error('Parámetros inválidos para el cálculo');
        }
        
        const rate = ARLConstants.RISK_RATES[riskClass] / 100;
        return Math.round(salary * rate);
    },

    /**
     * Calcula el aporte anual ARL para un empleado
     * @param {number} salary - Salario mensual
     * @param {number} riskClass - Clase de riesgo (1-5)
     * @returns {number} - Aporte anual
     */
    calculateAnnualContribution(salary, riskClass) {
        return this.calculateMonthlyContribution(salary, riskClass) * 12;
    },

    /**
     * Calcula las contribuciones para un grupo de empleados
     * @param {number} employeeCount - Número de empleados
     * @param {number} salary - Salario mensual por empleado
     * @param {number} riskClass - Clase de riesgo
     * @returns {Object} - Objeto con todas las contribuciones calculadas
     */
    calculateGroupContributions(employeeCount, salary, riskClass) {
        try {
            const monthlyPerEmployee = this.calculateMonthlyContribution(salary, riskClass);
            const annualPerEmployee = this.calculateAnnualContribution(salary, riskClass);
            
            return {
                monthlyPerEmployee,
                annualPerEmployee,
                monthlyTotal: monthlyPerEmployee * employeeCount,
                annualTotal: annualPerEmployee * employeeCount,
                effectiveRate: ARLConstants.RISK_RATES[riskClass]
            };
        } catch (error) {
            console.error('Error en cálculo de grupo:', error);
            throw error;
        }
    },

    /**
     * Calcula totales generales de todos los grupos
     * @param {Array} groups - Array de grupos de empleados
     * @returns {Object} - Totales generales
     */
    calculateGrandTotals(groups) {
        return groups.reduce((totals, group) => {
            totals.totalEmployees += group.employeeCount;
            totals.totalMonthly += group.contributions.monthlyTotal;
            totals.totalAnnual += group.contributions.annualTotal;
            return totals;
        }, { totalEmployees: 0, totalMonthly: 0, totalAnnual: 0 });
    }
};

// ===============================================
// MÓDULO DE GESTIÓN DE NOTIFICACIONES
// ===============================================
const NotificationManager = {
    /**
     * Muestra una notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, warning, info)
     */
    show(message, type = 'info') {
        try {
            this.removeAll();

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');
            
            document.body.appendChild(notification);

            // Auto remove después del tiempo configurado
            setTimeout(() => {
                this.remove(notification);
            }, ARLConstants.NOTIFICATION_DURATION);

        } catch (error) {
            console.error('Error mostrando notificación:', error);
        }
    },

    /**
     * Remueve una notificación específica
     * @param {HTMLElement} notification - Elemento de notificación
     */
    remove(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = `slideOut ${ARLConstants.ANIMATION_DURATION}ms ease`;
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, ARLConstants.ANIMATION_DURATION);
        }
    },

    /**
     * Remueve todas las notificaciones existentes
     */
    removeAll() {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
    }
};

// ===============================================
// MÓDULO DE MANEJO DE FORMULARIO
// ===============================================
const FormHandler = {
    elements: {},
    initialized: false,

    /**
     * Inicializa el manejador de formulario
     */
    init() {
        try {
            this.elements = {
                form: ARLUtils.getElement('#employeeGroupForm'),
                employeeCount: ARLUtils.getElement('#employeeCount'),
                salary: ARLUtils.getElement('#salary'),
                riskClass: ARLUtils.getElement('#riskClass'),
                economicSector: ARLUtils.getElement('#economicSector'),
                loading: ARLUtils.getElement('#loading')
            };

            // Verificar que todos los elementos existan
            const missingElements = Object.entries(this.elements)
                .filter(([key, element]) => !element)
                .map(([key]) => key);

            if (missingElements.length > 0) {
                throw new Error(`Elementos faltantes: ${missingElements.join(', ')}`);
            }

            this.bindEvents();
            this.initialized = true;
            console.log('FormHandler inicializado correctamente');

        } catch (error) {
            console.error('Error inicializando FormHandler:', error);
            NotificationManager.show('Error inicializando formulario', 'error');
        }
    },

    /**
     * Vincula eventos a los elementos del formulario
     */
    bindEvents() {
        if (!this.initialized && !this.elements.form) return;

        // Evento principal del formulario
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Formateo de salario con debounce
        const debouncedSalaryFormat = ARLUtils.debounce((e) => this.formatSalaryInput(e), 100);
        this.elements.salary.addEventListener('input', debouncedSalaryFormat);
        this.elements.salary.addEventListener('blur', (e) => this.validateSalaryInput(e));
        
        // Validación de número de empleados
        this.elements.employeeCount.addEventListener('input', (e) => this.validateEmployeeCount(e));
        
        // Validación en tiempo real de campos requeridos
        this.elements.riskClass.addEventListener('change', (e) => this.validateRiskClass(e));
    },

    /**
     * Formatea el input de salario con separadores de miles
     * @param {Event} e - Evento de input
     */
    formatSalaryInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            e.target.value = ARLUtils.formatNumber(parseInt(value));
        }
    },

    /**
     * Valida el salario ingresado
     * @param {Event} e - Evento de blur
     */
    validateSalaryInput(e) {
        const salary = ARLUtils.parseCurrency(e.target.value);
        
        if (salary && !ARLUtils.validateSalary(salary)) {
            this.setFieldError(e.target, `El salario debe ser al menos ${ARLUtils.formatCurrency(ARLConstants.MIN_SALARY_2024)}`);
        } else if (salary) {
            this.setFieldSuccess(e.target);
        }
    },

    /**
     * Valida el número de empleados
     * @param {Event} e - Evento de input
     */
    validateEmployeeCount(e) {
        const count = parseInt(e.target.value);
        
        if (count && !ARLUtils.validateEmployeeCount(count)) {
            this.setFieldError(e.target, `El número debe estar entre 1 y ${ARLConstants.MAX_EMPLOYEES_PER_GROUP}`);
        } else if (count) {
            this.setFieldSuccess(e.target);
        }
    },

    /**
     * Valida la clase de riesgo seleccionada
     * @param {Event} e - Evento de change
     */
    validateRiskClass(e) {
        const riskClass = parseInt(e.target.value);
        if (riskClass && (riskClass < 1 || riskClass > 5)) {
            this.setFieldError(e.target, 'Seleccione una clase de riesgo válida');
        } else if (riskClass) {
            this.setFieldSuccess(e.target);
        }
    },

    /**
     * Establece estilo de error en un campo
     * @param {HTMLElement} field - Campo del formulario
     * @param {string} message - Mensaje de error
     */
    setFieldError(field, message) {
        field.style.borderColor = '#DC3545';
        if (message) {
            NotificationManager.show(message, 'warning');
        }
    },

    /**
     * Establece estilo de éxito en un campo
     * @param {HTMLElement} field - Campo del formulario
     */
    setFieldSuccess(field) {
        field.style.borderColor = '#E95420';
    },

    /**
     * Maneja el envío del formulario
     * @param {Event} e - Evento de submit
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = this.getFormData();
            if (!this.validateFormData(formData)) return;

            this.showLoading(true);
            
            // Simular procesamiento
            await ARLUtils.delay(800);
            
            // Agregar grupo a la calculadora
            if (window.calculator) {
                window.calculator.addEmployeeGroup(formData);
                window.calculator.updateResults();
                this.reset();
                
                NotificationManager.show(
                    `✅ Grupo de ${formData.employeeCount} empleado(s) agregado exitosamente`, 
                    'success'
                );
            } else {
                throw new Error('Calculadora no disponible');
            }

        } catch (error) {
            console.error('Error en envío de formulario:', error);
            NotificationManager.show('Error procesando el formulario', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    /**
     * Obtiene los datos del formulario
     * @returns {Object} - Datos del formulario
     */
    getFormData() {
        return {
            employeeCount: parseInt(this.elements.employeeCount.value) || 0,
            salary: ARLUtils.parseCurrency(this.elements.salary.value),
            riskClass: parseInt(this.elements.riskClass.value) || 0,
            economicSector: this.elements.economicSector.value
        };
    },

    /**
     * Valida todos los datos del formulario
     * @param {Object} data - Datos a validar
     * @returns {boolean} - True si todos los datos son válidos
     */
    validateFormData(data) {
        // Validar número de empleados
        if (!ARLUtils.validateEmployeeCount(data.employeeCount)) {
            NotificationManager.show('❌ Por favor ingrese un número válido de empleados', 'error');
            this.elements.employeeCount.focus();
            return false;
        }
        
        // Validar salario
        if (!data.salary || !ARLUtils.validateSalary(data.salary)) {
            NotificationManager.show(
                `❌ Por favor ingrese un salario válido (mínimo ${ARLUtils.formatCurrency(ARLConstants.MIN_SALARY_2024)})`, 
                'error'
            );
            this.elements.salary.focus();
            return false;
        }
        
        // Validar clase de riesgo
        if (!data.riskClass || data.riskClass < 1 || data.riskClass > 5) {
            NotificationManager.show('❌ Por favor seleccione una clase de riesgo válida', 'error');
            this.elements.riskClass.focus();
            return false;
        }

        // Verificar grupos duplicados
        if (window.calculator) {
            const exists = window.calculator.employeeGroups.find(group => 
                group.salary === data.salary && group.riskClass === data.riskClass
            );
            if (exists) {
                NotificationManager.show('⚠️ Ya existe un grupo con el mismo salario y clase de riesgo', 'warning');
                return false;
            }
        }
        
        return true;
    },

    /**
     * Resetea el formulario a su estado inicial
     */
    reset() {
        this.elements.form.reset();
        // Resetear estilos de validación
        Object.values(this.elements).forEach(element => {
            if (element && element.style) {
                element.style.borderColor = '';
            }
        });
    },

    /**
     * Muestra u oculta el indicador de carga
     * @param {boolean} show - True para mostrar, false para ocultar
     */
    showLoading(show) {
        if (this.elements.loading) {
            this.elements.loading.classList.toggle('show', show);
        }
    }
};

// ===============================================
// MÓDULO DE VISUALIZACIÓN DE RESULTADOS
// ===============================================
const ResultsDisplay = {
    elements: {},
    initialized: false,

    /**
     * Inicializa el módulo de resultados
     */
    init() {
        try {
            this.elements = {
                totalEmployees: ARLUtils.getElement('#totalEmployees'),
                totalMonthly: ARLUtils.getElement('#totalMonthly'),
                totalAnnual: ARLUtils.getElement('#totalAnnual'),
                groupList: ARLUtils.getElement('#employeeGroupList')
            };

            // Verificar elementos
            const missingElements = Object.entries(this.elements)
                .filter(([key, element]) => !element)
                .map(([key]) => key);

            if (missingElements.length > 0) {
                throw new Error(`Elementos faltantes en ResultsDisplay: ${missingElements.join(', ')}`);
            }

            this.initialized = true;
            console.log('ResultsDisplay inicializado correctamente');

        } catch (error) {
            console.error('Error inicializando ResultsDisplay:', error);
        }
    },

    /**
     * Actualiza las tarjetas de resumen con los totales
     * @param {Array} groups - Array de grupos de empleados
     */
    updateSummaryCards(groups) {
        if (!this.initialized) return;

        try {
            const totals = ARLCalculations.calculateGrandTotals(groups);

            this.elements.totalEmployees.textContent = totals.totalEmployees;
            this.elements.totalMonthly.textContent = ARLUtils.formatCurrency(totals.totalMonthly);
            this.elements.totalAnnual.textContent = ARLUtils.formatCurrency(totals.totalAnnual);

            // Agregar animación a las tarjetas
            this.animateCards();

        } catch (error) {
            console.error('Error actualizando tarjetas de resumen:', error);
        }
    },

    /**
     * Actualiza la lista de grupos de empleados
     * @param {Array} groups - Array de grupos de empleados
     */
    updateGroupList(groups) {
        if (!this.initialized) return;

        try {
            if (groups.length === 0) {
                this.showEmptyState();
                return;
            }

            const groupsHTML = groups.map(group => this.generateGroupHTML(group)).join('');
            this.elements.groupList.innerHTML = groupsHTML;

        } catch (error) {
            console.error('Error actualizando lista de grupos:', error);
        }
    },

    /**
     * Genera el HTML para un grupo de empleados
     * @param {Object} group - Datos del grupo
     * @returns {string} - HTML del grupo
     */
    generateGroupHTML(group) {
        const sectorInfo = group.economicSector 
            ? `<br>🏢 ${ARLConstants.ECONOMIC_SECTORS[group.economicSector] || group.economicSector}` 
            : '';

        return `
            <div class="employee-group-item" data-id="${group.id}">
                <div class="group-info">
                    <div class="group-summary">
                        ${group.employeeCount} empleado${group.employeeCount > 1 ? 's' : ''} - ${ARLConstants.RISK_NAMES[group.riskClass]}
                    </div>
                    <div class="group-details">
                        💰 Salario: ${ARLUtils.formatCurrency(group.salary)} c/u<br>
                        🛡️ Tasa ARL: ${ARLConstants.RISK_RATES[group.riskClass]}%<br>
                        📊 Aporte individual: ${ARLUtils.formatCurrency(group.contributions.monthlyPerEmployee)}/mes
                        ${sectorInfo}
                    </div>
                </div>
                <div class="group-contribution">
                    <div class="monthly">Total: ${ARLUtils.formatCurrency(group.contributions.monthlyTotal)}/mes</div>
                    <div class="annual">Anual: ${ARLUtils.formatCurrency(group.contributions.annualTotal)}</div>
                </div>
                <button class="remove-btn" 
                        onclick="calculator.removeEmployeeGroup('${group.id}')" 
                        title="Eliminar grupo"
                        aria-label="Eliminar grupo de ${group.employeeCount} empleados">
                    🗑️
                </button>
            </div>
        `;
    },

    /**
     * Muestra el estado vacío cuando no hay grupos
     */
    showEmptyState() {
        this.elements.groupList.innerHTML = `
            <div style="text-align: center; color: var(--text-secondary); padding: var(--spacing-4xl);">
                <p>📋 Configure grupos de empleados para visualizar los cálculos de aportes ARL</p>
                <small>Agregue empleados con el mismo salario y clase de riesgo en un solo grupo</small>
            </div>
        `;
    },

    /**
     * Anima las tarjetas de resumen
     */
    animateCards() {
        const cards = document.querySelectorAll('.summary-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 150);
            }, index * 100);
        });
    },

    /**
     * Actualiza todos los elementos de resultados
     * @param {Array} groups - Array de grupos de empleados
     */
    update(groups) {
        this.updateSummaryCards(groups);
        this.updateGroupList(groups);
    }
};

// ===============================================
// MÓDULO DE EXPORTACIÓN
// ===============================================
const ExportManager = {
    /**
     * Exporta los datos a un archivo CSV
     * @param {Array} groups - Array de grupos de empleados
     */
    exportToCSV(groups) {
        try {
            if (groups.length === 0) {
                NotificationManager.show('⚠️ No hay datos para exportar', 'warning');
                return;
            }

            const csvData = this.generateCSVData(groups);
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const filename = `calculo_arl_${new Date().toISOString().split('T')[0]}.csv`;
            
            this.downloadFile(blob, filename);
            NotificationManager.show('📁 Datos exportados exitosamente', 'success');

        } catch (error) {
            console.error('Error exportando CSV:', error);
            NotificationManager.show('❌ Error al exportar los datos', 'error');
        }
    },

    /**
     * Genera los datos en formato CSV
     * @param {Array} groups - Array de grupos de empleados
     * @returns {string} - Datos en formato CSV
     */
    generateCSVData(groups) {
        const headers = [
            'Número de Empleados',
            'Salario Individual',
            'Clase de Riesgo',
            'Tasa ARL (%)',
            'Aporte Mensual Individual',
            'Aporte Mensual Total',
            'Aporte Anual Total',
            'Sector Económico',
            'Fecha de Creación'
        ];

        const rows = groups.map(group => [
            group.employeeCount,
            group.salary,
            `Clase ${group.riskClass}`,
            ARLConstants.RISK_RATES[group.riskClass],
            group.contributions.monthlyPerEmployee,
            group.contributions.monthlyTotal,
            group.contributions.annualTotal,
            group.economicSector ? ARLConstants.ECONOMIC_SECTORS[group.economicSector] || group.economicSector : 'No especificado',
            group.createdAt ? new Date(group.createdAt).toLocaleDateString('es-CO') : 'N/A'
        ]);

        // Agregar fila de totales
        const totals = ARLCalculations.calculateGrandTotals(groups);
        rows.push([
            `TOTAL: ${totals.totalEmployees}`,
            '',
            '',
            '',
            '',
            totals.totalMonthly,
            totals.totalAnnual,
            '',
            ''
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    },

    /**
     * Descarga un archivo
     * @param {Blob} blob - Contenido del archivo
     * @param {string} filename - Nombre del archivo
     */
    downloadFile(blob, filename) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar URL object
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    },

    /**
     * Exporta un resumen en formato JSON
     * @param {Array} groups - Array de grupos de empleados
     */
    exportToJSON(groups) {
        try {
            if (groups.length === 0) {
                NotificationManager.show('⚠️ No hay datos para exportar', 'warning');
                return;
            }

            const data = {
                exportDate: new Date().toISOString(),
                calculator: 'Ubuntu Seguros ARL Calculator',
                version: '2.0.0',
                totals: ARLCalculations.calculateGrandTotals(groups),
                groups: groups
            };

            const jsonData = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
            const filename = `calculo_arl_${new Date().toISOString().split('T')[0]}.json`;
            
            this.downloadFile(blob, filename);
            NotificationManager.show('📁 Resumen JSON exportado exitosamente', 'success');

        } catch (error) {
            console.error('Error exportando JSON:', error);
            NotificationManager.show('❌ Error al exportar el resumen', 'error');
        }
    }
};

// ===============================================
// CLASE PRINCIPAL DE LA CALCULADORA
// ===============================================
class ARLCalculatorUbuntu {
    constructor() {
        this.employeeGroups = [];
        this.initialized = false;
        this.init();
    }

    /**
     * Inicializa la calculadora
     */
    async init() {
        try {
            console.log('Inicializando Calculadora ARL Ubuntu Seguros v2.0.0');

            // Inicializar módulos
            FormHandler.init();
            ResultsDisplay.init();

            // Configurar efectos de scroll
          

            // Configurar eventos globales
            this.bindGlobalEvents();

            this.initialized = true;
            console.log('Calculadora ARL inicializada correctamente');

        } catch (error) {
            console.error('Error inicializando calculadora:', error);
            NotificationManager.show('❌ Error inicializando la aplicación', 'error');
        }
    }

    /**
     * Agrega un nuevo grupo de empleados
     * @param {Object} formData - Datos del formulario
     */
    addEmployeeGroup(formData) {
        try {
            const contributions = ARLCalculations.calculateGroupContributions(
                formData.employeeCount,
                formData.salary,
                formData.riskClass
            );

            const group = {
                id: ARLUtils.generateId(),
                employeeCount: formData.employeeCount,
                salary: formData.salary,
                riskClass: formData.riskClass,
                economicSector: formData.economicSector,
                contributions: contributions,
                createdAt: new Date().toISOString()
            };
            
            this.employeeGroups.push(group);
            console.log('Grupo agregado:', group);

        } catch (error) {
            console.error('Error agregando grupo:', error);
            NotificationManager.show('❌ Error agregando el grupo de empleados', 'error');
            throw error;
        }
    }

    /**
     * Remueve un grupo de empleados
     * @param {string} id - ID del grupo a remover
     */
    removeEmployeeGroup(id) {
        try {
            const groupIndex = this.employeeGroups.findIndex(g => g.id === id);
            
            if (groupIndex === -1) {
                NotificationManager.show('⚠️ Grupo no encontrado', 'warning');
                return;
            }

            const group = this.employeeGroups[groupIndex];
            this.employeeGroups.splice(groupIndex, 1);
            this.updateResults();
            
            NotificationManager.show(
                `🗑️ Grupo de ${group.employeeCount} empleado(s) eliminado`, 
                'info'
            );

        } catch (error) {
            console.error('Error removiendo grupo:', error);
            NotificationManager.show('❌ Error eliminando el grupo', 'error');
        }
    }

    /**
     * Actualiza la visualización de resultados
     */
    updateResults() {
        if (!this.initialized) return;
        
        try {
            ResultsDisplay.update(this.employeeGroups);
        } catch (error) {
            console.error('Error actualizando resultados:', error);
        }
    }

    /**
     * Exporta datos a CSV
     */
    exportToCSV() {
        ExportManager.exportToCSV(this.employeeGroups);
    }

    /**
     * Exporta resumen a JSON
     */
    exportToJSON() {
        ExportManager.exportToJSON(this.employeeGroups);
    }

    /**
     * Limpia todos los grupos de empleados
     */
    clearAllGroups() {
        try {
            if (this.employeeGroups.length === 0) {
                NotificationManager.show('⚠️ No hay grupos para eliminar', 'warning');
                return;
            }

            const confirmed = confirm('¿Está seguro de que desea eliminar todos los grupos de empleados?');
            if (!confirmed) return;

            const groupCount = this.employeeGroups.length;
            this.employeeGroups = [];
            this.updateResults();
            
            NotificationManager.show(`🗑️ ${groupCount} grupo(s) eliminado(s)`, 'info');

        } catch (error) {
            console.error('Error limpiando grupos:', error);
            NotificationManager.show('❌ Error eliminando los grupos', 'error');
        }
    }

    /**
     * Obtiene estadísticas de la calculadora
     * @returns {Object} - Estadísticas
     */
    getStatistics() {
        const totals = ARLCalculations.calculateGrandTotals(this.employeeGroups);
        const riskDistribution = this.employeeGroups.reduce((dist, group) => {
            const riskClass = `Clase ${group.riskClass}`;
            dist[riskClass] = (dist[riskClass] || 0) + group.employeeCount;
            return dist;
        }, {});

        return {
            totalGroups: this.employeeGroups.length,
            ...totals,
            riskDistribution,
            averageSalary: totals.totalEmployees > 0 
                ? Math.round(this.employeeGroups.reduce((sum, group) => 
                    sum + (group.salary * group.employeeCount), 0) / totals.totalEmployees)
                : 0
        };
    }

 
    bindGlobalEvents() {
        // Manejo de errores globales
        window.addEventListener('error', (event) => {
            console.error('Error global:', event.error);
        });

        // Manejo de promesas rechazadas
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promesa rechazada:', event.reason);
        });

        // Confirmación antes de salir si hay datos
        window.addEventListener('beforeunload', (event) => {
            if (this.employeeGroups.length > 0) {
                event.preventDefault();
                event.returnValue = '¿Está seguro de que desea salir? Se perderán los datos no guardados.';
                return event.returnValue;
            }
        });
    }
}

// ===============================================
// INICIALIZACIÓN GLOBAL
// ===============================================

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Crear instancia global de la calculadora
        window.calculator = new ARLCalculatorUbuntu();
        
        // Agregar funciones de utilidad al objeto global
        window.ARLUtils = ARLUtils;
        window.ARLConstants = ARLConstants;
        
        console.log('Aplicación ARL Ubuntu Seguros cargada exitosamente');
        
    } catch (error) {
        console.error('Error fatal al inicializar la aplicación:', error);
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8f9fa;">
                <div style="text-align: center; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: #dc3545; margin-bottom: 1rem;">Error de Inicialización</h2>
                    <p>No se pudo cargar la calculadora ARL. Por favor, recargue la página.</p>
                    <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #E95420; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Recargar Página
                    </button>
                </div>
            </div>
        `;
    }
});

// ===============================================
// EXPORTACIONES PARA TESTING (si es necesario)
// ===============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ARLConstants,
        ARLUtils,
        ARLCalculations,
        NotificationManager,
        FormHandler,
        ResultsDisplay,
        ExportManager,
        ARLCalculatorUbuntu
    };
}