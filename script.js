const wrapper = document.getElementById('scroll-wrapper');
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('.section');
const sideIndicators = document.querySelectorAll('.indicator');
const navLinks = document.querySelectorAll('.nav-links a');
const scrollProgress = document.getElementById('scroll-progress');

// Escuchar evento de scroll en el wrapper principal
if (wrapper) {
    wrapper.addEventListener('scroll', () => {
        // Barra de progreso horizontal
        const scrollTop = wrapper.scrollTop;
        const scrollHeight = wrapper.scrollHeight - wrapper.clientHeight;
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
            // Si el scroll llega a la mitad de la sección
            if (scrollTop >= (sectionTop - sectionHeight / 2)) {
                current = section.getAttribute('id');
            }
        });

        // Cambio de color del menú si la sección es oscura (Mascotas o Contacto)
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
}

// Navegación fluida al hacer click en links/indicadores
document.querySelectorAll('a[href^="#"], button[data-target]').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = el.getAttribute('href') || el.getAttribute('data-target');
        const target = document.querySelector(targetId);
        if (target && wrapper) {
            wrapper.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Interesection Observer para animaciones "fade-in"
const observerOptions = {
    root: wrapper,
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

    // Obtener medida aproximada de scroll (80% del contenedor o 300px min)
    const getScrollAmount = () => {
        return container.clientWidth * 0.8;
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });
    }
};

document.querySelectorAll('.carousel-wrapper').forEach(setupCarousel);

// Cambio de fondo dinámico según slide activo en #personas
const personasSection = document.getElementById('personas');
const personasCarousel = document.getElementById('carousel-personas');

if (personasSection && personasCarousel) {
    const isMobile = () => window.matchMedia('(max-width: 800px)').matches;

    const setBackground = (item) => {
        const bg = isMobile()
            ? (item.dataset.bgMobile || item.dataset.bg)
            : item.dataset.bg;
        if (bg) personasSection.style.backgroundImage = `url('${bg}')`;
    };

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setBackground(entry.target);
        });
    }, { root: personasCarousel, threshold: 0.5 });

    const bgItems = personasCarousel.querySelectorAll('.carousel-item[data-bg]');
    bgItems.forEach(item => slideObserver.observe(item));

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
