// Content script para automatizar juicios - Solo AFIP SIRAEF
(function() {
    'use strict';
    
    // Verificar que estamos en la URL correcta
    if (!window.location.href.includes('juridicosint.afip.gob.ar/atenea/siraef/consultas/Principal.asp')) {
        return; // No ejecutar si no estamos en la página correcta
    }
    
    console.log('Extensión cargada en AFIP SIRAEF');
    
    // Función para crear el botón de automatización
    function createAutomationButton() {
        const button = document.createElement('button');
        button.id = 'automation-button';
        button.innerText = 'Automatizar Juicio 556402/2025 - AFIP';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            padding: 15px 25px;
            background: linear-gradient(45deg, #0066cc, #004499);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,102,204,0.3);
            transition: all 0.3s ease;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        // Efectos hover específicos para AFIP
        button.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(45deg, #004499, #002266)';
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.boxShadow = '0 6px 20px rgba(0,102,204,0.4)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(45deg, #0066cc, #004499)';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0,102,204,0.3)';
        });
        
        button.addEventListener('click', executeAutomation);
        
        document.body.appendChild(button);
    }
    
    // Función principal de automatización
    function executeAutomation() {
        console.log('Iniciando automatización...');
        
        // Buscar campos de número de juicio y año
        const numeroJuicioField = findField(['numero', 'juicio', 'expediente', 'nro']);
        const añoField = findField(['año', 'year', 'anio']);
        const buscarButton = findButton(['buscar', 'search', 'consultar']);
        
        if (numeroJuicioField && añoField && buscarButton) {
            console.log('Campos encontrados, completando formulario...');
            
            // Completar campos
            numeroJuicioField.value = '556402';
            numeroJuicioField.dispatchEvent(new Event('input', { bubbles: true }));
            numeroJuicioField.dispatchEvent(new Event('change', { bubbles: true }));
            
            añoField.value = '2025';
            añoField.dispatchEvent(new Event('input', { bubbles: true }));
            añoField.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Hacer click en buscar después de un pequeño delay
            setTimeout(() => {
                buscarButton.click();
                console.log('Botón buscar clickeado');
                
                // Esperar a que cargue el juicio y expandir tablas
                setTimeout(() => {
                    expandAllTables();
                }, 2000);
            }, 500);
            
        } else {
            console.log('No se encontraron todos los campos necesarios');
            alert('No se pudieron encontrar todos los campos necesarios en la página');
        }
    }
    
    // Función para buscar campos específicos de AFIP
    function findField(keywords) {
        // Primero buscar por IDs/names específicos de AFIP
        const specificSelectors = [
            'input[name="nroExpediente"]',
            'input[name="numeroExpediente"]', 
            'input[name="nroJuicio"]',
            'input[name="numeroJuicio"]',
            'input[name="anio"]',
            'input[name="año"]',
            'input[name="anoExpediente"]'
        ];
        
        for (let selector of specificSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const field = element.name || element.id || '';
                for (let keyword of keywords) {
                    if (field.toLowerCase().includes(keyword)) {
                        return element;
                    }
                }
            }
        }
        
        // Búsqueda general como respaldo
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input:not([type])');
        
        for (let input of inputs) {
            const id = input.id?.toLowerCase() || '';
            const name = input.name?.toLowerCase() || '';
            const placeholder = input.placeholder?.toLowerCase() || '';
            const label = getAssociatedLabel(input)?.toLowerCase() || '';
            
            for (let keyword of keywords) {
                if (id.includes(keyword) || name.includes(keyword) || 
                    placeholder.includes(keyword) || label.includes(keyword)) {
                    return input;
                }
            }
        }
        
        return null;
    }
    
    // Función para buscar botones específicos de AFIP
    function findButton(keywords) {
        // Selectores específicos para AFIP
        const specificSelectors = [
            'input[name="btnBuscar"]',
            'input[value*="Buscar"]',
            'button[name="buscar"]',
            'input[type="submit"]'
        ];
        
        for (let selector of specificSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element;
            }
        }
        
        // Búsqueda general
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        
        for (let button of buttons) {
            const text = button.innerText?.toLowerCase() || button.value?.toLowerCase() || '';
            const id = button.id?.toLowerCase() || '';
            const name = button.name?.toLowerCase() || '';
            
            for (let keyword of keywords) {
                if (text.includes(keyword) || id.includes(keyword) || name.includes(keyword)) {
                    return button;
                }
            }
        }
        
        return null;
    }
    
    // Función para obtener la etiqueta asociada a un input
    function getAssociatedLabel(input) {
        // Buscar label por 'for' attribute
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) return label.innerText;
        }
        
        // Buscar label padre
        const parentLabel = input.closest('label');
        if (parentLabel) return parentLabel.innerText;
        
        // Buscar texto cercano
        const parent = input.parentElement;
        if (parent) {
            const text = parent.innerText.replace(input.value || '', '').trim();
            return text;
        }
        
        return '';
    }
    
    // Función para expandir todas las tablas/divs colapsables
    function expandAllTables() {
        console.log('Expandiendo todas las tablas...');
        
        // Buscar elementos colapsables comunes
        const expandableElements = [
            // Bootstrap collapse
            ...document.querySelectorAll('[data-toggle="collapse"]'),
            ...document.querySelectorAll('[data-bs-toggle="collapse"]'),
            
            // Elementos con clases comunes de expansión
            ...document.querySelectorAll('.collapse-toggle, .expand-toggle, .accordion-toggle'),
            
            // Botones que contengan texto de expandir
            ...document.querySelectorAll('button, a, div, span')
        ].filter(el => {
            const text = el.innerText?.toLowerCase() || '';
            const title = el.title?.toLowerCase() || '';
            return text.includes('expandir') || text.includes('mostrar') || 
                   text.includes('expand') || text.includes('show') ||
                   text.includes('+') || title.includes('expandir') ||
                   title.includes('mostrar');
        });
        
        // Expandir divs colapsados
        const collapsedDivs = document.querySelectorAll('div.collapse:not(.show)');
        collapsedDivs.forEach(div => {
            div.classList.add('show');
            div.style.display = 'block';
        });
        
        // Hacer click en elementos expandibles
        expandableElements.forEach((element, index) => {
            setTimeout(() => {
                try {
                    element.click();
                    console.log('Elemento expandido:', element);
                } catch (e) {
                    console.log('Error al expandir elemento:', e);
                }
            }, index * 200);
        });
        
        // Buscar y expandir acordeones
        const accordions = document.querySelectorAll('[id*="accordion"], [class*="accordion"]');
        accordions.forEach(accordion => {
            const headers = accordion.querySelectorAll('.accordion-header, .card-header, [data-toggle="collapse"]');
            headers.forEach((header, index) => {
                setTimeout(() => {
                    try {
                        header.click();
                    } catch (e) {
                        console.log('Error al expandir acordeón:', e);
                    }
                }, index * 300);
            });
        });
        
        // Forzar visibilidad de elementos ocultos relacionados con tablas
        const hiddenTables = document.querySelectorAll('table[style*="display: none"], .table-hidden, .hidden-content');
        hiddenTables.forEach(table => {
            table.style.display = 'table';
            table.classList.remove('hidden', 'table-hidden');
        });
        
        console.log('Proceso de expansión completado');
    }
    
    // Crear el botón cuando la página esté lista
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createAutomationButton);
    } else {
        createAutomationButton();
    }
    
    // Observer para detectar cambios dinámicos en la página
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Si se detectan cambios significativos, verificar si necesitamos expandir nuevas tablas
                const hasNewTables = Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && (
                        node.querySelector && (
                            node.querySelector('table') || 
                            node.querySelector('.collapse') ||
                            node.querySelector('[data-toggle="collapse"]')
                        )
                    )
                );
                
                if (hasNewTables) {
                    setTimeout(expandAllTables, 1000);
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();