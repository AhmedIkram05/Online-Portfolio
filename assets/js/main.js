/**
 * Main JavaScript File
 * Version: 3.2
 * Author: Ahmed Ikram
 * Description: Handles all interactive elements, animations, and navigation logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized');
    
    // Navigation & Layout
    initNavigation();
    initBackToTop();
    
    // Hero Section modules
    initHeroFeatures();
    
    // Global UI/UX
    initScrollAnimations();
    initLazyLoad();
    initFormValidation();
    initParallax();
});

/**
 * =========================================================================
 * NAVIGATION MODULE
 * Handles: Active state, Sliding indicator, Mobile menu, Sticky header, Smooth scroll
 * =========================================================================
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-indicator');
    const header = document.querySelector('header');
    const navMenu = document.getElementById('navMenu');
    const toggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.querySelector('.navbar-nav');
    
    // Safety check for critical elements
    if (!header || !navMenu) return;

    /* --- 1. Sliding Indicator Logic --- */
    function moveIndicator(link) {
        // Only run on desktop (768px+)
        if (window.innerWidth < 768 || !indicator) return;
        
        const menuRect = navMenu.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        
        indicator.style.width = `${linkRect.width}px`;
        indicator.style.transform = `translateX(${linkRect.left - menuRect.left}px)`;
        indicator.style.display = 'block';
    }

    /* --- 2. Active State on Scroll (Spy) --- */
    function onScrollSpy() {
        const centerLine = window.innerHeight / 3; // Trigger earlier (top third)
        const sections = ['home', 'projects', 'experience', 'cv', 'contact'];
        let currentSectionId = '';

        // "Who is the lowest section on the page whose top has passed the scan line?"
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= centerLine) {
                    currentSectionId = sections[i];
                    break;
                }
            }
        }

        // Edge case: Bottom of page -> Contact
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) {
            currentSectionId = 'contact';
        }

        // Update classes and indicator
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                link.classList.add('active');
                moveIndicator(link);
            }
        });
    }

    /* --- 3. Sticky Header Logic --- */
    function onScrollHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    /* --- 4. Mobile Menu Logic --- */
    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Ensure elements exist before toggling
        if (navbarNav && toggler) {
            navbarNav.classList.toggle('show');
            toggler.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navbarNav.classList.contains('show') ? 'hidden' : '';
        }
    }

    function closeMobileMenu() {
        if (navbarNav && navbarNav.classList.contains('show')) {
            navbarNav.classList.remove('show');
            if (toggler) toggler.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /* --- 5. Event Binding --- */
    
    // Scroll Listeners
    window.addEventListener('scroll', () => {
        onScrollSpy();
        onScrollHeader();
    }, { passive: true });
    
    window.addEventListener('resize', onScrollSpy, { passive: true });

    // Initial check
    setTimeout(() => {
        onScrollSpy();
        onScrollHeader();
    }, 100);

    // Mobile Toggler
    if (toggler) {
        toggler.addEventListener('click', toggleMobileMenu);
    }

    /* --- Custom Smooth Scroll Helper --- */
    const smoothScroll = (target, duration = 800) => {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const headerOffset = header ? header.offsetHeight : 80;
        const distance = targetPosition - startPosition - headerOffset;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        requestAnimationFrame(animation);
    };

    // Click on Links (Smooth Scroll + Close Menu + Move Indicator)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Temporarily disable CSS scroll-behavior
                document.documentElement.style.scrollBehavior = 'auto';
                
                // Execute smooth scroll
                smoothScroll(targetSection, 1000);
                
                // Restore CSS scroll-behavior
                setTimeout(() => {
                    document.documentElement.style.scrollBehavior = '';
                }, 1000);
                
                // Immediate visual update
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                moveIndicator(link);
                
                // Close menu if open
                closeMobileMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navbarNav && toggler && 
            !toggler.contains(event.target) && 
            !navbarNav.contains(event.target) && 
            navbarNav.classList.contains('show')) {
            closeMobileMenu();
        }
    });
}

/**
 * =========================================================================
 * HERO SECTION MODULE
 * Handles: Overlay, Typing effect, Disappearance on scroll, 3D effect
 * =========================================================================
 */
function initHeroFeatures() {
    initHeroOverlay();
    initHeroTypingEffect();
    initHeroDisappearance();
    init3DHeroEffects();
    initHeroSmoothScroll();
}

function initHeroOverlay() {
    const heroOverlay = document.getElementById('heroOverlay');
    if (!heroOverlay) return;
    
    let dismissed = false;
  
    function dismissHero() {
        if (dismissed) return;
        dismissed = true;
        
        heroOverlay.classList.add('hidden');
        setTimeout(() => {
            heroOverlay.style.display = 'none';
        }, 400);
    }
  
    // Dismiss triggers
    heroOverlay.addEventListener('click', (e) => {
        const heroCard = heroOverlay.querySelector('.hero-card');
        if (heroCard && !heroCard.contains(e.target)) {
            dismissHero();
        }
    });

    // Dismiss on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) dismissHero();
    });
    
    // Dismiss on key press
    document.addEventListener('keydown', (e) => {
        if (!e.target.matches('input, textarea')) dismissHero();
    });
    
    // Explore Button
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dismissHero();
            setTimeout(() => {
                const mainContent = document.getElementById('main-content');
                if (mainContent) mainContent.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        });
    }
}

function initHeroTypingEffect() {
    const heroText = document.querySelector('.hero-typing');
    if (!heroText) return;

    const messages = [
        "Building innovative solutions with modern technology",
        "Passionate about clean code and user experience", 
        "Ready to collaborate on your next big idea",
        "Transforming ideas into reality through code"
    ];
    let messageIndex = 0;
    let charIndex = 0;
  
    function type() {
        if (charIndex < messages[messageIndex].length) {
            heroText.textContent += messages[messageIndex].charAt(charIndex++);
            setTimeout(type, 60);
        } else {
            setTimeout(erase, 2000);
        }
    }
  
    function erase() {
        if (charIndex > 0) {
            heroText.textContent = messages[messageIndex].substring(0, --charIndex);
            setTimeout(erase, 30);
        } else {
            messageIndex = (messageIndex + 1) % messages.length;
            setTimeout(type, 800);
        }
    }
  
    setTimeout(type, 1500);
}

function initHeroDisappearance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const threshold = hero.offsetHeight / 3;
        hero.classList.toggle('hero-hidden', window.pageYOffset > threshold);
    });
}

function init3DHeroEffects() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const updateTransform = () => {
        const scrollY = window.pageYOffset;
        // Limit depth to avoid visual glitches
        const depth = Math.min(50, (scrollY / window.innerHeight) * 50);
        hero.style.transform = `translateZ(${-depth}px)`;
    };
    
    window.addEventListener('scroll', updateTransform, { passive: true });
}

function initHeroSmoothScroll() {
    const exploreBtns = document.querySelectorAll('a[href="#main-content"]');
    exploreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#main-content');
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/**
 * =========================================================================
 * GLOBAL UTILITIES
 * Handles: Lazy Loading, Animations, Back to Top, Forms, Parallax
 * =========================================================================
 */

function initScrollAnimations() {
    // Select elements to animate
    const autoSelectors = [
        'main section', '.experience-item', '.project-card', 
        '.contact-item', '.skill', '.services .card', 
        '.footer-grid > *', '.footer-bottom', '.section-title'
    ];
    
    // Tag elements
    autoSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(node => {
            if (node.classList.contains('hero') || node.classList.contains('no-animate')) return;
            if (!node.hasAttribute('data-animate')) node.setAttribute('data-animate', '');
        });
    });

    const items = document.querySelectorAll('[data-animate]');
    if (!items.length) return;

    // Fallback for no Observer support
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('in-view'));
        return;
    }

    // Observer Logic
    let lastScrollY = window.pageYOffset;
    const observer = new IntersectionObserver((entries) => {
        const scrollingDown = window.pageYOffset > lastScrollY;
        
        entries.forEach((entry) => {
            const el = entry.target;
            if (entry.isIntersecting) {
                // Set direction class
                el.classList.remove('from-top', 'from-bottom');
                el.classList.add(scrollingDown ? 'from-bottom' : 'from-top');
                
                // Add in-view class
                el.classList.add('in-view');
                
                // Stagger delay based on index in this batch
                // (Simplified for robustness)
                
            } else {
                 el.classList.remove('in-view');
            }
        });
        
        lastScrollY = window.pageYOffset;
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    items.forEach(el => observer.observe(el));
}

function initLazyLoad() {
    // 1. Native Lazy Loading
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });
  
    // 2. Fade-in on load
    const imageObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';
                
                const showImage = () => { img.style.opacity = '1'; };
                
                if (img.complete) showImage();
                else img.onload = showImage;
                
                obs.unobserve(img);
            }
        });
    });
  
    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        btn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
    });
    
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();
            event.stopPropagation();
            
            form.classList.add('was-validated');
            
            if (form.checkValidity()) {
                // Get button and show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';

                // Send data using Fetch API
                const formData = new FormData(form);

                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        alert('Message sent successfully! Thank you for contacting me.');
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {
                        alert('Oops! There was a problem submitting your form. Please try again.');
                    }
                })
                .catch(error => {
                    alert('There was an error sending your message. Please email me directly.');
                    console.error('Error:', error);
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                });
            }
        });
        
        // Real-time validation feedback
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (form.classList.contains('was-validated')) {
                    if (input.checkValidity()) {
                        input.classList.remove('is-invalid');
                        input.classList.add('is-valid');
                    } else {
                        input.classList.remove('is-valid');
                        input.classList.add('is-invalid');
                    }
                }
            });
        });
    });
}

function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.body.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    });
}
