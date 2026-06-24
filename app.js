/*
  Archivo: app.js
  Descripción: Lógica de interactividad para la landing page de Reku. Controla el simulador de tarjeta Wallet interactivo en tiempo real, el switch de precios, la selección de industrias, el acordeón de FAQs y animaciones premium como el efecto 3D tilt.
  Fecha de última modificación: 2026-06-03
  Autor: Antigravity
*/

// Carga dinámica de la hoja de estilos pricing.css
const pricingStyleLink = document.createElement('link');
pricingStyleLink.rel = 'stylesheet';
pricingStyleLink.href = 'pricing.css';
document.head.appendChild(pricingStyleLink);

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHeroTilt();
    initSimulator();
    initPricingSelector();
    initIndustryTabs();
    initFaqAccordion();
    initScrollReveal();
});

/* ==========================================================================
   1. NAVEGACIÓN MÓVIL
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('btn-mobile-toggle');
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');

    if (toggleBtn && header) {
        toggleBtn.addEventListener('click', () => {
            header.classList.toggle('nav-open');
            const isOpen = header.classList.contains('nav-open');
            toggleBtn.setAttribute('aria-expanded', isOpen);
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('nav-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
}

/* ==========================================================================
   2. EFECTO 3D TILT EN EL HERO (MOCKUP DEL CELULAR)
   ========================================================================== */
function initHeroTilt() {
    const heroVisual = document.querySelector('.hero-visual');
    const phoneMockup = document.getElementById('hero-phone-mockup');

    if (heroVisual && phoneMockup) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            // Calcular posición relativa del mouse en el contenedor (-1 a 1)
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            // Rotar suavemente el teléfono (máx 15 grados)
            const rotateX = y * -20;
            const rotateY = x * 20;

            phoneMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            // Restaurar posición original con transición suave
            phoneMockup.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    }
}

/* ==========================================================================
   3. SIMULADOR INTERACTIVO DE TARJETA WALLET
   ========================================================================== */
function initSimulator() {
    // Controles
    const shopInput = document.getElementById('input-shop-name');
    const rewardInput = document.getElementById('input-reward-title');
    const typeSellos = document.getElementById('radio-type-sellos');
    const typeCashback = document.getElementById('radio-type-cashback');
    const stampsSelect = document.getElementById('select-stamps');
    const cashbackInput = document.getElementById('input-cashback');
    const stampsControlGroup = document.getElementById('control-stamps-count');
    const cashbackControlGroup = document.getElementById('control-cashback-percent');
    
    // Controles de estética
    const iconPresets = document.querySelectorAll('.btn-icon-preset');
    const colorPresets = document.querySelectorAll('.btn-color-preset');
    const customColorInput = document.getElementById('input-custom-color');

    // Elementos de la tarjeta de simulación
    const simCard = document.getElementById('sim-card');
    const simShop = document.getElementById('sim-card-shop');
    const simReward = document.getElementById('sim-card-reward');
    const simIcon = document.getElementById('sim-card-icon');
    const simStampsGrid = document.getElementById('sim-stamps-grid');
    const simMetricLabel = document.getElementById('sim-card-metric-label');
    const simMetricVal = document.getElementById('sim-card-metric-val');
    const simMetricContainer = document.getElementById('sim-card-metric-container');
    const simCouponContainer = document.getElementById('sim-card-coupon-container');
    const simCashbackInfo = document.getElementById('sim-cashback-info');
    const simCashbackRate = document.getElementById('sim-cashback-rate');

    if (!simCard) return;

    // 3.1. Escuchar cambios de texto
    shopInput.addEventListener('input', (e) => {
        simShop.textContent = e.target.value || 'Tu Negocio';
    });

    rewardInput.addEventListener('input', (e) => {
        simReward.textContent = e.target.value || 'Premio';
    });

    // 3.2. Cambiar esquema (Sellos vs Cashback)
    function updateScheme() {
        if (typeSellos.checked) {
            // Mostrar controles de sellos, ocultar cashback
            stampsControlGroup.style.display = 'flex';
            cashbackControlGroup.style.display = 'none';

            // Ajustes en la tarjeta Wallet
            simStampsGrid.style.display = 'grid';
            simCashbackInfo.style.display = 'none';
            simMetricLabel.textContent = 'SELLOS';
            simMetricContainer.style.display = 'block';
            simCouponContainer.style.display = 'block';

            renderStamps();
        } else if (typeCashback.checked) {
            // Mostrar controles de cashback, ocultar sellos
            stampsControlGroup.style.display = 'none';
            cashbackControlGroup.style.display = 'flex';

            // Ajustes en la tarjeta Wallet
            simStampsGrid.style.display = 'none';
            simCashbackInfo.style.display = 'block';
            simMetricContainer.style.display = 'none';
            simCouponContainer.style.display = 'none';
            
            updateCashbackRate();
        }
    }

    typeSellos.addEventListener('change', updateScheme);
    typeCashback.addEventListener('change', updateScheme);

    // 3.3. Renderizar sellos dinámicamente
    function renderStamps() {
        const total = parseInt(stampsSelect.value, 10);
        // Supongamos que el cliente tiene el 40% de los sellos completados
        const activeCount = Math.round(total * 0.4);
        
        simMetricVal.textContent = `${activeCount} / ${total}`;
        simStampsGrid.innerHTML = '';
        
        // Ajustar columnas de la cuadrícula según cantidad de sellos
        if (total === 5) {
            simStampsGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        } else if (total === 8) {
            simStampsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            simStampsGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        }

        for (let i = 1; i <= total; i++) {
            const stamp = document.createElement('div');
            stamp.className = 'stamp';
            if (i <= activeCount) {
                stamp.className = 'stamp active';
                stamp.textContent = '✓';
            }
            simStampsGrid.appendChild(stamp);
        }
    }

    stampsSelect.addEventListener('change', renderStamps);

    // 3.4. Actualizar Cashback %
    function updateCashbackRate() {
        const rate = cashbackInput.value || 5;
        simCashbackRate.textContent = `${rate}%`;
    }

    cashbackInput.addEventListener('input', updateCashbackRate);

    // 3.5. Cambiar icono presets
    iconPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            iconPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            simIcon.textContent = preset.getAttribute('data-icon');
        });
    });

    // 3.6. Cambiar color de fondo presets
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            colorPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            
            const color = preset.getAttribute('data-color');
            simCard.style.setProperty('--card-color', color);
            customColorInput.value = color;
        });
    });

    // 3.7. Cambiar color personalizado
    customColorInput.addEventListener('input', (e) => {
        // Remover el estado activo de los presets predeterminados
        colorPresets.forEach(p => p.classList.remove('active'));
        simCard.style.setProperty('--card-color', e.target.value);
    });

    // Inicializar simulador
    updateScheme();
}

/* ==========================================================================
   4. CONTROL DE PRECIOS Y FACTURACIÓN (3 POSICIONES)
   ========================================================================== */
function initPricingSelector() {
    const selectorControl = document.getElementById('billing-selector-control');
    const opts = document.querySelectorAll('.billing-opt');
    
    const priceStarter = document.getElementById('price-starter');
    const priceGrow = document.getElementById('price-grow');
    const priceBusiness = document.getElementById('price-business');
    
    const subStarter = document.getElementById('sub-starter');
    const subGrow = document.getElementById('sub-grow');
    const subBusiness = document.getElementById('sub-business');

    if (selectorControl && opts.length > 0) {
        opts.forEach(opt => {
            opt.addEventListener('click', () => {
                // Quitar clase activa de todos y añadirla al seleccionado
                opts.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                
                const billingType = opt.getAttribute('data-billing');
                selectorControl.setAttribute('data-active', billingType);
                
                if (billingType === 'monthly') {
                    animatePrice(priceStarter, 1299);
                    animatePrice(priceGrow, 1899);
                    animatePrice(priceBusiness, 3499);
                    
                    subStarter.textContent = 'Facturado mensualmente';
                    subGrow.textContent = 'Facturado mensualmente';
                    subBusiness.textContent = 'Facturado mensualmente';
                } else if (billingType === 'quarterly') {
                    animatePrice(priceStarter, 1104);
                    animatePrice(priceGrow, 1614);
                    animatePrice(priceBusiness, 2974);
                    
                    subStarter.textContent = 'Facturado trimestralmente ($3,312 MXN/trimestre)';
                    subGrow.textContent = 'Facturado trimestralmente ($4,842 MXN/trimestre)';
                    subBusiness.textContent = 'Facturado trimestralmente ($8,922 MXN/trimestre)';
                } else if (billingType === 'yearly') {
                    animatePrice(priceStarter, 779);
                    animatePrice(priceGrow, 1139);
                    animatePrice(priceBusiness, 2099);
                    
                    subStarter.textContent = 'Facturado anualmente ($9,348 MXN/año)';
                    subGrow.textContent = 'Facturado anualmente ($13,668 MXN/año)';
                    subBusiness.textContent = 'Facturado anualmente ($25,188 MXN/año)';
                }
            });
        });
    }
}

// Animación numérica suave para el cambio de precios (soporta formato con comas de miles)
function animatePrice(element, targetValue) {
    if (!element) return;
    let start = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;
    const duration = 250; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Interpolación lineal
        const currentVal = Math.round(start + (targetValue - start) * progress);
        
        // Formatear con comas
        element.textContent = currentVal.toLocaleString('es-MX');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ==========================================================================
   5. PESTAÑAS POR INDUSTRIA
   ========================================================================== */
function initIndustryTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de botones y paneles
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Activar botón actual
            btn.classList.add('active');

            // Mostrar panel correspondiente
            const targetTab = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   6. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.faq-icon-indicator');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Alternar estado expandido
            question.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                // Abrir
                answer.style.display = 'block';
                icon.textContent = '−';
                icon.style.transform = 'rotate(180deg)';
                question.parentElement.style.borderColor = 'var(--color-primary-glow)';
            } else {
                // Cerrar
                answer.style.display = 'none';
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
                question.parentElement.style.borderColor = 'var(--glass-border)';
            }
        });
    });
}

/* ==========================================================================
   7. REVELAR ELEMENTOS AL HACER SCROLL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
    // Configuración para el Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                // Dejar de observar una vez que ya se ha revelado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Añadir clase inicial y observar secciones/cards
    const itemsToReveal = document.querySelectorAll('.step-card, .comparison-card, .tab-pane-grid, .pricing-card, .faq-item');
    
    // Definir estilos dinámicos de revelación
    const style = document.createElement('style');
    style.textContent = `
        .step-card, .comparison-card, .tab-pane-grid, .pricing-card, .faq-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                        transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal-active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    itemsToReveal.forEach(item => {
        observer.observe(item);
    });
}
