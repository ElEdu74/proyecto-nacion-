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
        
        // Buscar campos específicos por los nombres exactos de AFIP
        const numeroJuicioField = document.querySelector("body > form > table > tbody > tr:nth-child(1) > td:nth-child(2) > input");
        const añoField = document.querySelector("body > form > table > tbody > tr:nth-child(1) > td:nth-child(3) > input");
        const buscarButton = document.querySelector("body > form > table > tbody > tr:nth-child(2) > td > input"); 

/*         const numeroJuicioField = document.querySelector('input[name="juicio"]');
        const añoField = document.querySelector('input[name="anio"]');
        const buscarButton = document.querySelector('input[name="buscar"]') || 
                            document.querySelector('button[name="buscar"]') ||
                            document.querySelector('[name="buscar"]');
 */        
        console.log('Campos encontrados:', {
            numeroJuicioField: numeroJuicioField ? `INPUT[name="${numeroJuicioField.name}"]` : 'NO ENCONTRADO',
            añoField: añoField ? `INPUT[name="${añoField.name}"]` : 'NO ENCONTRADO',
            buscarButton: buscarButton ? `${buscarButton.tagName}[name="${buscarButton.name}"]` : 'NO ENCONTRADO'
        });
        
        if (numeroJuicioField && añoField && buscarButton) {
            console.log('✅ Todos los campos encontrados, completando formulario...');
            
            // Limpiar campos primero
            numeroJuicioField.value = '';
            añoField.value = '';
            
            // Completar campos con los valores específicos
            numeroJuicioField.value = '556402';
            numeroJuicioField.dispatchEvent(new Event('input', { bubbles: true }));
            numeroJuicioField.dispatchEvent(new Event('change', { bubbles: true }));
            numeroJuicioField.dispatchEvent(new Event('keyup', { bubbles: true }));
            
            añoField.value = '2025';
            añoField.dispatchEvent(new Event('input', { bubbles: true }));
            añoField.dispatchEvent(new Event('change', { bubbles: true }));
            añoField.dispatchEvent(new Event('keyup', { bubbles: true }));
            
            console.log('✅ Campos completados:', {
                juicio: numeroJuicioField.value,
                anio: añoField.value
            });
            
            // Hacer click en buscar después de un pequeño delay
            setTimeout(() => {
                console.log('🔍 Ejecutando búsqueda...');
                buscarButton.click();
                
                // Esperar a que cargue el juicio y expandir tablas
                setTimeout(() => {
                    console.log('📋 Expandiendo tablas...');
                    expandAllTables();
                }, 3000); // Mayor tiempo de espera para AFIP
            }, 800);
            
        } else {
            console.log('❌ No se encontraron todos los campos necesarios');
            
            // Información de depuración específica
            const debugInfo = `
❌ CAMPOS NO ENCONTRADOS:

Buscando específicamente:
• input[name="juicio"] → ${numeroJuicioField ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO'}
• input[name="anio"] → ${añoField ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO'}  
• [name="buscar"] → ${buscarButton ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO'}

Todos los campos INPUT en la página:
${getAllInputs().map(input => `• ${input.tagName}[name="${input.name}"][id="${input.id}"] type="${input.type}"`).join('\n')}

Todos los botones en la página:
${getAllButtons().map(btn => `• ${btn.tagName}[name="${btn.name}"][id="${btn.id}"] value="${btn.value || btn.innerText}"`).join('\n')}
            `;
            
            alert('No se pudieron encontrar todos los campos necesarios.\n\nRevisa la consola (F12) para más información.');
            console.log(debugInfo);
        }
    }
    
    // Función de depuración para analizar la página
    function debugPageFields() {
        console.log('=== ANÁLISIS DE CAMPOS DE LA PÁGINA ===');
        
        const allInputs = getAllInputs();
        console.log('Campos de entrada encontrados:', allInputs.length);
        allInputs.forEach((input, index) => {
            console.log(`${index + 1}. ${input.tagName}`, {
                name: input.name,
                id: input.id,
                type: input.type,
                placeholder: input.placeholder,
                value: input.value,
                className: input.className
            });
        });
        
        const allButtons = getAllButtons();
        console.log('Botones encontrados:', allButtons.length);
        allButtons.forEach((btn, index) => {
            console.log(`${index + 1}. ${btn.tagName}`, {
                name: btn.name,
                id: btn.id,
                type: btn.type,
                innerText: btn.innerText,
                value: btn.value,
                className: btn.className
            });
        });
        
        console.log('=== FIN ANÁLISIS ===');
    }
    
    // Función auxiliar para obtener todos los inputs
    function getAllInputs() {
        return Array.from(document.querySelectorAll('input'));
    }
    
    // Función auxiliar para obtener todos los botones
    function getAllButtons() {
        return Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]'));
    }
    
    // Función para buscar campos específicos de AFIP (mejorada)
    function findField(keywords) {
        console.log(`Buscando campo para palabras clave: ${keywords.join(', ')}`);
        
        // Selectores específicos más amplios para AFIP
        const specificSelectors = [
            // Variaciones comunes de número de expediente
            'input[name*="nroExpediente"]',
            'input[name*="numeroExpediente"]',
            'input[name*="nroJuicio"]',
            'input[name*="numeroJuicio"]',
            'input[name*="expediente"]',
            'input[name*="juicio"]',
            'input[name*="numero"]',
            'input[name*="nro"]',
            
            // Variaciones de año
            'input[name*="anio"]',
            'input[name*="año"]',
            'input[name*="anoExpediente"]',
            'input[name*="year"]',
            
            // Por ID
            'input[id*="expediente"]',
            'input[id*="juicio"]',
            'input[id*="numero"]',
            'input[id*="nro"]',
            'input[id*="anio"]',
            'input[id*="año"]',
            
            // Por placeholder
            'input[placeholder*="expediente"]',
            'input[placeholder*="juicio"]',
            'input[placeholder*="número"]',
            'input[placeholder*="numero"]',
            'input[placeholder*="año"]',
            'input[placeholder*="anio"]'
        ];
        
        // Probar selectores específicos
        for (let selector of specificSelectors) {
            const elements = document.querySelectorAll(selector);
            for (let element of elements) {
                const name = (element.name || '').toLowerCase();
                const id = (element.id || '').toLowerCase();
                const placeholder = (element.placeholder || '').toLowerCase();
                
                for (let keyword of keywords) {
                    if (name.includes(keyword) || id.includes(keyword) || placeholder.includes(keyword)) {
                        console.log(`Campo encontrado con selector específico: ${selector}`, element);
                        return element;
                    }
                }
            }
        }
        
        // Búsqueda general mejorada
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input:not([type]), input[type=""]');
        
        for (let input of inputs) {
            const id = (input.id || '').toLowerCase();
            const name = (input.name || '').toLowerCase();
            const placeholder = (input.placeholder || '').toLowerCase();
            const label = getAssociatedLabel(input)?.toLowerCase() || '';
            
            // Logging detallado
            console.log(`Evaluando input:`, {
                element: input,
                name,
                id,
                placeholder,
                label,
                keywords
            });
            
            for (let keyword of keywords) {
                if (id.includes(keyword) || name.includes(keyword) || 
                    placeholder.includes(keyword) || label.includes(keyword)) {
                    console.log(`Campo encontrado por búsqueda general: keyword="${keyword}"`, input);
                    return input;
                }
            }
        }
        
        console.log(`No se encontró campo para palabras clave: ${keywords.join(', ')}`);
        return null;
    }
    
    // Función para buscar botones específicos de AFIP (mejorada)
    function findButton(keywords) {
        console.log(`Buscando botón para palabras clave: ${keywords.join(', ')}`);
        
        // Selectores específicos ampliados para AFIP
        const specificSelectors = [
            'input[name*="btnBuscar"]',
            'input[name*="buscar"]',
            'input[value*="Buscar"]',
            'input[value*="BUSCAR"]',
            'input[value*="Consultar"]',
            'input[value*="CONSULTAR"]',
            'button[name*="buscar"]',
            'button[name*="consultar"]',
            'input[type="submit"]',
            'button[type="submit"]',
            'input[id*="buscar"]',
            'input[id*="consultar"]',
            'button[id*="buscar"]',
            'button[id*="consultar"]'
        ];
        
        // Probar selectores específicos
        for (let selector of specificSelectors) {
            const elements = document.querySelectorAll(selector);
            for (let element of elements) {
                console.log(`Botón encontrado con selector específico: ${selector}`, element);
                return element;
            }
        }
        
        // Búsqueda general mejorada
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="image"]');
        
        for (let button of buttons) {
            const text = (button.innerText || button.value || '').toLowerCase();
            const id = (button.id || '').toLowerCase();
            const name = (button.name || '').toLowerCase();
            const title = (button.title || '').toLowerCase();
            
            console.log(`Evaluando botón:`, {
                element: button,
                text,
                name,
                id,
                title,
                keywords
            });
            
            for (let keyword of keywords) {
                if (text.includes(keyword) || id.includes(keyword) || 
                    name.includes(keyword) || title.includes(keyword)) {
                    console.log(`Botón encontrado por búsqueda general: keyword="${keyword}"`, button);
                    return button;
                }
            }
        }
        
        console.log(`No se encontró botón para palabras clave: ${keywords.join(', ')}`);
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