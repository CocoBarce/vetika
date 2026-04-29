// Initialize Lenis (assuming it's loaded via CDN in HTML or global window.Lenis)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const wrapper = document.getElementById('scroll-wrapper');
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section');
const sideIndicators = document.querySelectorAll('.indicator');
const navLinks = document.querySelectorAll('.nav-links a');
const scrollProgress = document.getElementById('scroll-progress');

// Función de utilidad global para mobile
const isMobile = () => window.matchMedia('(max-width: 800px)').matches;

// Escuchar evento de scroll
window.addEventListener('scroll', () => {
    // Barra de progreso horizontal
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';

    // Blur y estilo del navbar
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Determinar la sección actual
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollTop >= (sectionTop - sectionHeight / 2)) {
            current = section.getAttribute('id');
        }
    });

    // Cambio de color del menú
    if (current === 'mascotas' || current === 'contacto') {
        navbar.classList.add('dark-theme');
    } else {
        navbar.classList.remove('dark-theme');
    }

    // Actualizar indicadores laterales
    sideIndicators.forEach(indicator => {
        indicator.classList.remove('active');
        if (indicator.getAttribute('data-target') === `#${current}`) {
            indicator.classList.add('active');
        }
    });

    // Actualizar links superiores
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Navegación fluida sincronizada con Lenis
document.querySelectorAll('a[href^="#"], button[data-target]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = el.getAttribute('href') || el.getAttribute('data-target');
        const target = document.querySelector(targetId);
        if (target) {
            lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        }
    });
});

// Interesection Observer para animaciones "fade-in"
const observerOptions = {
    root: null,
    threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Configuración de Carruseles para Múltiples Secciones
const setupCarousel = (carouselWrapper) => {
    const container = carouselWrapper.querySelector('.carousel-container');
    const prevBtn = carouselWrapper.querySelector('.prev-btn');
    const nextBtn = carouselWrapper.querySelector('.next-btn');

    if (!container) return;

    // Obtener medida aproximada de scroll (100% del contenedor para un salto exacto)
    const getScrollAmount = () => {
        return container.clientWidth;
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const scrollLeft = container.scrollLeft;
            if (scrollLeft <= 10) {
                container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;
            if (scrollLeft >= maxScroll - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        });
    }
};

document.querySelectorAll('.carousel-wrapper').forEach(setupCarousel);

// Cambio de fondo dinámico según hover en #personas-grid (Vetika 2.0)
const personasSection = document.getElementById('personas');
const personaCards = document.querySelectorAll('.persona-reveal-card');

if (personasSection && personaCards.length > 0) {
    const setBackgroundByCard = (card) => {
        // En 2.0 usamos data-bg en la tarjeta o su contenedor si fuera necesario,
        // pero aquí lo definiremos basado en clases o atributos.
        // Para simplicidad, extraeremos la imagen del contexto.
        let bg = '';
        if (card.classList.contains('card-lavanda')) bg = 'assets/tendogel-sportfondo.png';
        if (card.classList.contains('card-manzanilla')) bg = 'assets/tendogel-sportfondo.png';
        if (card.classList.contains('card-kids')) bg = 'assets/tendogel-fondokids.png';

        if (bg) {
            personasSection.style.backgroundImage = `url('${bg}')`;

            // Ajustes de clases para posicionamiento
            if (bg.includes('kids')) {
                personasSection.classList.add('kids-active');
                personasSection.classList.remove('sport-active');
            } else if (bg.includes('sport') || bg.includes('manzanilla') || bg.includes('lavanda')) {
                personasSection.classList.add('sport-active');
                personasSection.classList.remove('kids-active');
            }
        }
    };

    personaCards.forEach(card => {
        card.addEventListener('mouseenter', () => setBackgroundByCard(card));
    });

    // Fondo inicial (primera tarjeta)
    setBackgroundByCard(personaCards[0]);
}

// =============== VETIKA 2.0: FULL-SCREEN PRODUCT DETAIL LOGIC ===============

const productData = {
    clasico: {
        tag: "Bienestar Diario",
        title: "Tendogel Clásico",
        desc: "Nuestra fórmula original diseñada para el alivio cotidiano. Combina el poder antiinflamatorio del árnica con la calma de la lavanda.",
        image: "assets/tendogel-lavanda.png",
        bgColor: "#F8F5F0",
        benefits: [
            "Alivia contracturas y tensiones acumuladas",
            "Ideal para dolores lumbares y cervicales",
            "Fórmula libre de AINEs y fragancias artificiales",
            "Textura de rápida absorción sin dejar residue"
        ],
        usage: "Aplicar sobre la zona afectada con un suave masaje circular hasta 3 veces al día."
    },
    sport: {
        tag: "Rendimiento Activo",
        title: "Tendogel Sport",
        desc: "El aliado perfecto para el deportista. Optimiza la recuperación muscular y prepara el cuerpo para la exigencia física.",
        image: "assets/tendogel-manzanilla.png",
        bgColor: "#E6EBE6",
        benefits: [
            "Acelera la desinflamación post-entrenamiento",
            "Efecto refrescante inmediato",
            "Relaja músculos exigidos y previene calambres",
            "Aroma terapéutico a manzanilla para el relax mental"
        ],
        usage: "Aplica antes del calentamiento para activar músculos, o después de la ducha post-ejercicio."
    },
    kids: {
        tag: "Cuidado Infantil",
        title: "Tendogel Kids",
        desc: "La naturaleza cuidando a los más pequeños. Una fórmula extremadamente suave para su piel delicada pero efectiva para su bienestar.",
        image: "assets/tendogel-kids.png",
        bgColor: "#FDF9F0",
        benefits: [
            "Calma dolores del crecimiento en piernas y rodillas",
            "Alivio inmediato para golpes y 'chichones'",
            "Refresca picaduras de insectos de forma natural",
            "Efecto relax ideal para antes de dormir"
        ],
        usage: "Apto para niños mayores de 2 años. Aplicar suavemente sobre la zona de molestia o moretones."
    },
    caballos: {
        tag: "Rendimiento Equino",
        title: "Tendogel Caballos",
        desc: "Potencia natural para atletas de alto rendimiento. Nuestra fórmula equina original está diseñada para las exigencias del campo y la competencia.",
        image: "assets/tendogel-caballos.png",
        bgColor: "#EBF0EC",
        benefits: [
            "Desinflamación rápida de tendones y ligamentos",
            "Alivio de tensiones en lomo y articulaciones",
            "Favorece la recuperación post-esfuerzo intenso",
            "Fórmula no dopante y segura para uso frecuente"
        ],
        usage: "Aplicar una capa generosa sobre la zona afectada. Puede utilizarse bajo vendajes si es necesario."
    },
    flyrepel: {
        tag: "Protección Natural",
        title: "Flyrepel",
        desc: "Escudo botánico contra insectos. Protege a tu caballo sin comprometer su salud ni el medio ambiente con químicos agresivos.",
        image: "assets/tendogel-flyrepel.png",
        bgColor: "#F9F6E6",
        benefits: [
            "Repele moscas, mosquitos y tábanos eficazmente",
            "Extracto puro de Citronella y Eucaliptus",
            "No irrita la piel ni las mucosas del animal",
            "Aroma fresco y agradable para el jinete y el caballo"
        ],
        usage: "Rociar uniformemente sobre el cuerpo del animal. Evitar contacto directo con ojos y boca."
    }
};

// =============== VETIKA 2.0: FULL-SCREEN PRODUCT DETAIL LOGIC ===============

const modal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = modal?.querySelector('.modal-close-btn');
const modalOverlay = modal?.querySelector('.modal-overlay');

const openProductModal = (productId) => {
    const data = productData[productId];
    if (!data || !modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="modal-visual-side" style="background-color: ${data.bgColor}">
            <img src="${data.image}" alt="${data.title}">
        </div>
        <div class="modal-info-side">
            <span class="modal-tag">${data.tag}</span>
            <h2>${data.title}</h2>
            <p class="modal-desc">${data.desc}</p>

            <div class="detail-section">
                <h4>Beneficios Clave</h4>
                <ul>
                    ${data.benefits.map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>

            <div class="detail-section">
                <h4>Modo de Uso</h4>
                <p style="font-size: 0.95rem; opacity: 0.85; line-height: 1.6;">${data.usage}</p>
            </div>

            <div style="margin-top: auto; padding-top: 40px;">
                <button class="btn btn-hero modal-close-trigger">Volver al catálogo</button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    lenis.stop(); // Pausar scroll global
};

const closeProductModal = () => {
    modal.classList.remove('active');
    lenis.start(); // Reanudar scroll global
};

// Event Listeners
document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.getAttribute('data-product');
        openProductModal(productId);
    });
});

closeModalBtn?.addEventListener('click', closeProductModal);
modalOverlay?.addEventListener('click', closeProductModal);
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close-trigger')) {
        closeProductModal();
    }
});

// Lógica de fondo para secciones grid
const setupGridBackground = (sectionId, gridId) => {
    const section = document.getElementById(sectionId);
    const grid = document.getElementById(gridId);
    if (!section || !grid) return;

    const cards = grid.querySelectorAll('.persona-reveal-card');

    const setBg = (card) => {
        let bg = '';
        if (card.classList.contains('card-lavanda')) bg = 'assets/tendogelclasico.png';
        if (card.classList.contains('card-manzanilla')) bg = 'assets/tendogel-sportfondo.png';
        if (card.classList.contains('card-kids')) bg = 'assets/tendogel-fondokids.png';
        if (card.classList.contains('card-caballos')) bg = 'assets/fondo-corriendo.jpg';
        if (card.classList.contains('card-flyrepel')) bg = 'assets/fondo-corriendo.jpg';

        if (bg) {
            section.style.backgroundImage = `url('${bg}')`;
            if (bg.includes('kids')) {
                section.classList.add('kids-active');
                section.classList.remove('sport-active');
            } else if (bg.includes('sport') || bg.includes('fondo-corriendo')) {
                section.classList.add('sport-active');
                section.classList.remove('kids-active');
            }
        }
    };

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => setBg(card));
    });

    if (cards.length > 0) setBg(cards[0]);
};

setupGridBackground('personas', 'personas-grid');
setupGridBackground('equino', 'equino-grid');
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Enviando...';

        setTimeout(() => {
            submitBtn.textContent = '¡Mensaje Enviado!';
            submitBtn.style.background = '#6B8E71'; // Tono Sage Green
            submitBtn.style.color = '#fff';
            contactForm.reset();

            setTimeout(() => {
                submitBtn.textContent = 'Enviar Mensaje';
                submitBtn.style.background = '';
            }, 3000);
        }, 1500);
    });
}
