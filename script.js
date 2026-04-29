// Initialize Lenis
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

// Cambio de fondo dinámico según slide activo en #personas
const personasSection = document.getElementById('personas');
const personasCarousel = document.getElementById('carousel-personas');

if (personasSection && personasCarousel) {
    const setBackground = (item) => {
        const bg = isMobile()
            ? (item.dataset.bgMobile || item.dataset.bg)
            : item.dataset.bg;
        if (bg) {
            personasSection.style.backgroundImage = `url('${bg}')`;
            
            // Ajustes específicos según la imagen
            if (bg.includes('kids')) {
                personasSection.classList.add('kids-active');
                personasSection.classList.remove('sport-active');
            } else if (bg.includes('sport')) {
                personasSection.classList.add('sport-active');
                personasSection.classList.remove('kids-active');
            } else {
                personasSection.classList.remove('kids-active', 'sport-active');
            }
        }
    };

    const bgItems = personasCarousel.querySelectorAll('.carousel-item[data-bg]');

    const updateBackgroundOnScroll = () => {
        const containerRect = personasCarousel.getBoundingClientRect();
        const midPoint = containerRect.left + containerRect.width / 2;
        
        let closestItem = null;
        let minDistance = Infinity;
        
        bgItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemMid = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(midPoint - itemMid);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });
        
        if (closestItem) {
            setBackground(closestItem);
        }
    };

    personasCarousel.addEventListener('scroll', updateBackgroundOnScroll, { passive: true });

    // Fondo inicial
    if (bgItems.length > 0) setBackground(bgItems[0]);
}

// Simulación visual simple del Formulario de Contacto
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
