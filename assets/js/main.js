/**
 * Main JavaScript File
 * Version: 3.2
 * Author: Ahmed Ikram
 * Description: Handles all interactive elements, animations, and navigation logic.
 */

/* =========================================================================
   Analytics consent + dynamic gtag loader
   Moved from inline <head> into this file so consent handling is centralized.
   ========================================================================= */

// Ensure dataLayer and gtag helper exist early
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} 

// Default: deny analytics-related storage until user gives consent
gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'personalization_storage': 'denied',
    'security_storage': 'granted'
});

function loadGoogleAnalytics() {
    if (window.gaLoaded) return;
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-0LCXMLYZHQ';
    gaScript.onload = function () {
        gtag('js', new Date());
        gtag('config', 'G-0LCXMLYZHQ');
    };
    document.head.appendChild(gaScript);
    window.gaLoaded = true;
}

function hideConsentBanner() {
    var b = document.getElementById('cookie-consent-banner');
    if (b && b.parentNode) b.parentNode.removeChild(b);
}

function grantAnalyticsConsent() {
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
    try { window.localStorage.setItem('ga_consent', 'granted'); } catch (e) {}
    loadGoogleAnalytics();
    hideConsentBanner();
}

function denyAnalyticsConsent() {
    try { window.localStorage.setItem('ga_consent', 'denied'); } catch (e) {}
    hideConsentBanner();
}

function initAnalyticsConsentBanner() {
    var stored = null;
    try { stored = window.localStorage.getItem('ga_consent'); } catch (e) {}
    if (stored === 'granted') {
        gtag('consent', 'update', { 'analytics_storage': 'granted' });
        loadGoogleAnalytics();
        return;
    }
    if (stored === 'denied') return;

    // No prior decision: create a small consent banner
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.style.position = 'fixed';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.bottom = '0';
    banner.style.zIndex = '12000';
    banner.style.backgroundColor = '#111';
    banner.style.color = '#fff';
    banner.style.padding = '0.9rem';
    banner.style.display = 'flex';
    banner.style.justifyContent = 'space-between';
    banner.style.alignItems = 'center';
    banner.style.gap = '0.5rem';
    banner.style.fontSize = '0.95rem';

    var text = document.createElement('div');
    text.textContent = 'This site uses Google Analytics for anonymous usage statistics. Analytics are disabled until you allow them.';
    text.style.flex = '1';

    var actions = document.createElement('div');

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.textContent = 'Allow analytics';
    accept.style.marginLeft = '0.5rem';
    accept.style.padding = '0.5rem 0.75rem';
    accept.style.border = 'none';
    accept.style.backgroundColor = '#0b84ff';
    accept.style.color = '#fff';
    accept.style.cursor = 'pointer';
    accept.onclick = grantAnalyticsConsent;

    var decline = document.createElement('button');
    decline.type = 'button';
    decline.textContent = 'Decline';
    decline.style.marginLeft = '0.5rem';
    decline.style.padding = '0.5rem 0.75rem';
    decline.style.border = '1px solid #555';
    decline.style.backgroundColor = 'transparent';
    decline.style.color = '#fff';
    decline.style.cursor = 'pointer';
    decline.onclick = denyAnalyticsConsent;

    actions.appendChild(decline);
    actions.appendChild(accept);

    banner.appendChild(text);
    banner.appendChild(actions);

    if (document.body) {
        document.body.appendChild(banner);
    } else {
        document.addEventListener('readystatechange', function () {
            if (document.readyState === 'complete') document.body.appendChild(banner);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized');
    // Initialize analytics consent/banner
    try { initAnalyticsConsentBanner(); } catch (e) { /* fail silently */ }
    
    // Navigation & Layout
    initNavigation();
    
    // Global UI/UX
    initScrollAnimations();
    initLazyLoad();
    initFormValidation();
    initProjectFilters();
    initCvViewer();
    initTouchNav();
    initBackToTop();
});

/**
 * =========================================================================
 * NAVIGATION MODULE
 * Handles: Active state, Sliding indicator, Mobile menu, Sticky header, Smooth scroll
 * =========================================================================
 */
function initNavigation() {
    const primaryNavLinks = document.querySelectorAll('.nav-link[data-level="primary"]');
    const allNavLinks = document.querySelectorAll('.nav-link[data-level]');
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

    function moveSubIndicator(link) {
        const submenu = link.closest('.nav-submenu');
        if (!submenu) return;
        const subIndicator = submenu.querySelector('.sub-nav-indicator');
        if (!subIndicator) return;

        const menuRect = submenu.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        
        subIndicator.style.height = `${linkRect.height}px`;
        subIndicator.style.transform = `translateY(${linkRect.top - menuRect.top}px)`;
        subIndicator.style.display = 'block';
    }

    /* --- 2. Active State on Scroll (Spy) --- */
    function onScrollSpy() {
        const centerLine = window.innerHeight / 3; // Trigger earlier (top third)
        // Expanded sections list to include sub-sections
        // Note: Order matters. Deeper/later sections should be checked first in reverse loop,
        // or just ensure they are in DOM order for the loop logic.
        // Projects filters share the same ID, so we only track the main section.
        const sections = [
            'home', 
            'about-all', 'about-journey', 'about-difference', 'about-looking', 'about-beyond',
            'projects', 
            'case-study',
            'case-study-overview', 'case-study-stats', 'case-study-architecture', 'case-study-detection', 'case-study-rag', 'case-study-delivery',
            'experience',
            'experience-work', 'experience-education', 'experience-certifications', 'experience-core', 'experience-skills',
            'cv', 
            'contact'
        ];
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
        // Reset all active states first is expensive, so we do it carefully
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Find the link corresponding to the current section
        let activeLink = document.querySelector(`.nav-link[href="#${currentSectionId}"]`);
        
        // Special handling for Projects section to respect active filter
        if (currentSectionId === 'projects') {
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            if (activeFilterBtn) {
                const filterValue = activeFilterBtn.getAttribute('data-filter');
                const filterLink = document.querySelector(`.nav-link-sub[data-filter="${filterValue}"]`);
                if (filterLink) {
                    activeLink = filterLink;
                }
            }
        }
        
        if (activeLink) {
            activeLink.classList.add('active');
            
            // If it's a sub-link
            if (activeLink.classList.contains('nav-link-sub')) {
                moveSubIndicator(activeLink);
                // Also activate the parent primary link
                const parentItem = activeLink.closest('.nav-item');
                if (parentItem) {
                    const primaryLink = parentItem.querySelector('.nav-link[data-level="primary"]');
                    if (primaryLink) {
                        primaryLink.classList.add('active');
                        moveIndicator(primaryLink);
                    }
                }
            } else {
                // It's a primary link
                moveIndicator(activeLink);
            }
        }
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
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            window.requestAnimationFrame(() => {
                onScrollSpy();
                onScrollHeader();
                navTicking = false;
            });
            navTicking = true;
        }
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

    // Click on Links (Smooth Scroll + Close Menu + Move Indicator)
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Custom slow smooth scroll
                const startPosition = window.pageYOffset;
                // Get scroll-margin-top from CSS or default to 120
                const scrollMargin = parseInt(window.getComputedStyle(targetSection).scrollMarginTop) || 120;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + startPosition - scrollMargin;
                const distance = offsetPosition - startPosition;
                const duration = 1500; // 1.5s for professional, slower feel
                let start = null;

                // Temporarily disable native smooth scroll to prevent conflict
                const originalBehavior = document.documentElement.style.scrollBehavior;
                document.documentElement.style.scrollBehavior = 'auto';

                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percent = Math.min(progress / duration, 1);
                    
                    // Ease In Out Cubic
                    const ease = percent < 0.5 ? 4 * percent * percent * percent : 1 - Math.pow(-2 * percent + 2, 3) / 2;

                    window.scrollTo(0, startPosition + (distance * ease));

                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        document.documentElement.style.scrollBehavior = originalBehavior;
                    }
                }
                
                window.requestAnimationFrame(step);

                // Immediate visual update - reset all nav links
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                
                const navItem = link.closest('.nav-item');
                const primaryLink = navItem ? navItem.querySelector('.nav-link[data-level="primary"]') : null;
                
                if (primaryLink) {
                    primaryLink.classList.add('active');
                    moveIndicator(primaryLink);
                }

                // Activate clicked sub-link immediately
                if (link.classList.contains('nav-link-sub')) {
                    link.classList.add('active');
                    moveSubIndicator(link);
                }
                
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
 * PROJECT FILTERS
 * =========================================================================
 */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hide all first to trigger animation reset
                card.style.display = 'none';
                card.classList.remove('show');
                
                if (filterValue === 'all' || (category || '').split(' ').includes(filterValue)) {
                    // Slight delay to allow display:none to apply
                    setTimeout(() => {
                        card.style.display = ''; // Restore default display
                        // Trigger reflow
                        void card.offsetWidth; 
                        card.classList.add('show');
                    }, 50);
                }
            });
        });
    });

    // Link navbar submenu items to filter buttons
    const navFilterLinks = document.querySelectorAll('.nav-link[data-filter]');
    navFilterLinks.forEach(link => {
        link.addEventListener('click', () => {
             const filterValue = link.getAttribute('data-filter');
             const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
             if (targetBtn) {
                 // Trigger the filter logic by simulating a click
                 targetBtn.click();
             }
        });
    });
}

/**
 * =========================================================================
 * GLOBAL UTILITIES
 * Handles: Lazy Loading, Animations, Forms, Parallax
 * =========================================================================
 */

function initScrollAnimations() {
    // Select elements to animate
    const autoSelectors = [
        'main section', '.experience-item', '.project-card', 
        '.contact-item', '.services .card', 
        '.section-title'
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
    }, { threshold: 0, rootMargin: '0px 0px -50px 0px' });

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
                    updateSubmitState();
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

        // Live submit state: dimmed until every required field is valid,
        // solid green when the form is complete
        const submitBtn = form.querySelector('button[type="submit"]');
        const updateSubmitState = () => {
            submitBtn.disabled = !form.checkValidity();
        };
        inputs.forEach(input => input.addEventListener('input', updateSubmitState));
        updateSubmitState();
    });
}

/**
 * =========================================================================
 * CV VIEWER TABS MODULE
 * Tabbed PDF preview: one embed per CV. PDF src is assigned on first tab
 * activation so only the visible CV downloads (lazy).
 * =========================================================================
 */
function initCvViewer() {
    const tabs = document.querySelectorAll('[data-cv-tab]');
    const download = document.getElementById('cv-download');
    const section = document.getElementById('cv');
    if (!tabs.length) return;

    // Point the pin at the visible CV: embed.src is populated lazily
    const syncDownload = embed => {
        if (download && embed) download.href = embed.src || embed.dataset.src;
    };

    // Hop the pin each time the active CV changes
    const bump = () => {
        if (!download) return;
        download.classList.remove('jump');
        void download.offsetWidth; // force reflow so the animation restarts
        download.classList.add('jump');
    };

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
            });
            const embed = document.getElementById('cv-' + btn.dataset.cvTab);
            if (!embed) return;
            if (embed.dataset.src && !embed.src) embed.src = embed.dataset.src; // first view only
            document.querySelectorAll('.cv-embed-wrapper embed').forEach(e => {
                e.hidden = e !== embed;
            });
            syncDownload(embed);
            bump();
        });
    });
    syncDownload(document.querySelector('.cv-embed-wrapper embed:not([hidden])'));

    // Pin exists only while the CV section is on screen
    if (download && section && 'IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            download.hidden = !entries[0].isIntersecting;
        }, { threshold: 0.05 }).observe(section);
    }
}

/**
 * =========================================================================
 * TOUCH NAV MODULE
 * Tap-to-open submenus on the mobile burger menu (clicks drive it, not hover).
 * Accordion: opening one submenu closes the others; tapping a parent link
 * again closes its own. Capture phase so parent links act as toggles, not
 * scroll jumps.
 * =========================================================================
 */
function initTouchNav() {
    // Bind whenever the mobile menu layout is in use — on any device
    // (hover-capable ones included), matching the burger CSS at max-width: 767px.
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    // Any tap closes all open submenus — except taps on a parent link,
    // which the link's own handler toggles below.
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link[data-level="primary"]')) return;
        document.querySelectorAll('.nav-item.has-submenu.open').forEach(i => i.classList.remove('open'));
    }, true);

    document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
        const link = item.querySelector(':scope > .nav-link');
        if (!link) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // accordion only — no scroll/panel close
            // Accordion: close sibling submenus, toggle this one
            document.querySelectorAll('.nav-item.has-submenu.open').forEach(i => {
                if (i !== item) i.classList.remove('open');
            });
            item.classList.toggle('open');
        }, true);
    });
}

/**
 * =========================================================================
 * BACK TO TOP MODULE
 * Shows a floating button after scrolling past 400px; smooth scrolls to top.
 * =========================================================================
 */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const onScroll = () => {
        const y = window.pageYOffset || document.documentElement.scrollTop;
        btn.classList.toggle('visible', y > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}