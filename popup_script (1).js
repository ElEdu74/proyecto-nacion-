// Popup script para controlar la extensión
document.addEventListener('DOMContentLoaded', function() {
    const automateBtn = document.getElementById('automate');
    const expandBtn = document.getElementById('expand');
    const statusDiv = document.getElementById('status');
    
    function showStatus(message, type = 'success') {
        statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 3000);
    }
    
    // Función para ejecutar script en la pestaña activa
    function executeScript(func) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: func
            }).then(() => {
                showStatus('✅ Acción ejecutada correctamente');
            }).catch((error) => {
                showStatus('❌ Error: ' + error.message, 'error');
            });
        });
    }
    
    // Función de automatización específica para AFIP
    function fullAutomation() {
        // Verificar que estamos en AFIP
        if (!window.location.href.includes('juridicosint.afip.gob.ar/atenea/siraef/consultas/Principal.asp')) {
            alert('Esta extensión solo funciona en AFIP SIRAEF');
            return;
        }
        
        // Selectores específicos de AFIP
        const numeroField = document.querySelector('input[name="nroExpediente"]') ||
                           document.querySelector('input[name="numeroExpediente"]') ||
                           document.querySelector('input[name="nroJuicio"]') ||
                           document.querySelector('input[name*="numero"], input[id*="numero"]') ||
                           document.querySelector('input[name*="expediente"], input[id*="expediente"]');
        
        const añoField = document.querySelector('input[name="anio"]') ||
                        document.querySelector('input[name="anoExpediente"]') ||
                        document.querySelector('input[name="año"]') ||
                        document.querySelector('input[name*="anio"], input[id*="anio"]');
        
        const buscarBtn = document.querySelector('input[name="btnBuscar"]') ||
                         document.querySelector('input[value*="Buscar"]') ||
                         document.querySelector('input[type="submit"]') ||
                         Array.from(document.querySelectorAll('button, input')).find(btn => 
                             (btn.textContent || btn.value || '').toLowerCase().includes('buscar')
                         );
        
        console.log('Campos encontrados:', {numeroField, añoField, buscarBtn});
        
        if (numeroField && añoField && buscarBtn) {
            numeroField.value = '556402';
            numeroField.dispatchEvent(new Event('input', { bubbles: true }));
            numeroField.dispatchEvent(new Event('change', { bubbles: true }));
            
            añoField.value = '2025';
            añoField.dispatchEvent(new Event('input', { bubbles: true }));
            añoField.dispatchEvent(new Event('change', { bubbles: true }));
            
            setTimeout(() => {
                buscarBtn.click();
                setTimeout(() => {
                    expandAllElements();
                }, 3000); // Mayor tiempo de espera para AFIP
            }, 800);
        } else {
            alert('No se encontraron todos los campos en la página de AFIP SIRAEF');
        }
    }
    
    // Función para expandir todos los elementos
    function expandAllElements() {
        // Expandir elementos colapsados
        const collapsedElements = document.querySelectorAll('.collapse:not(.show)');
        collapsedElements.forEach(el => {
            el.classList.add('show');
            el.style.display = 'block';
        });
        
        // Hacer click en botones de expandir
        const expandButtons = Array.from(document.querySelectorAll('button, a, span, div')).filter(el => {
            const text = el.textContent.toLowerCase();
            return text.includes('expandir') || text.includes('mostrar') || text.includes('+') || 
                   text.includes('expand') || text.includes('show') || text.includes('ver más');
        });
        
        expandButtons.forEach((btn, index) => {
            setTimeout(() => {
                try {
                    btn.click();
                } catch (e) {
                    console.log('Error expandiendo:', e);
                }
            }, index * 200);
        });
        
        // Expandir acordeones
        const accordionHeaders = document.querySelectorAll('[data-toggle="collapse"], [data-bs-toggle="collapse"], .accordion-button');
        accordionHeaders.forEach((header, index) => {
            setTimeout(() => {
                try {
                    header.click();
                } catch (e) {
                    console.log('Error expandiendo acordeón:', e);
                }
            }, index * 300);
        });
        
        // Mostrar elementos ocultos
        const hiddenTables = document.querySelectorAll('table[style*="display: none"], .hidden, [style*="display: none"]');
        hiddenTables.forEach(el => {
            el.style.display = 'block';
            el.classList.remove('hidden');
        });
    }
    
    // Event listeners
    automateBtn.addEventListener('click', () => {
        executeScript(fullAutomation);
    });
    
    expandBtn.addEventListener('click', () => {
        executeScript(expandAllElements);
    });
});