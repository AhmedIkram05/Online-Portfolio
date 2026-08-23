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
    initLogoMorph();
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
    const allNavLinks = document.querySelectorAll('.nav-link[data-level], .navbar-logo, .hero-scroll');
    const header = document.querySelector('header');
    const navMenu = document.getElementById('navMenu');
    const toggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.querySelector('.navbar-nav');

    // Safety check for critical elements
    if (!header || !navMenu) return;

    /* --- 1. Active State on Scroll (Spy) --- */
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
        // Special handling for CV section to respect active CV tab (parity with Projects)
        if (currentSectionId === 'cv') {
            const activeCvBtn = document.querySelector('.cv-viewer-tabs [data-cv-tab].active');
            if (activeCvBtn) {
                const cvLink = document.querySelector(`.nav-link-sub[data-cv-tab="${activeCvBtn.dataset.cvTab}"]`);
                if (cvLink) activeLink = cvLink;
            }
        }
        
        if (activeLink) {
            activeLink.classList.add('active');

            // Sub-link active: highlight its parent section too
            if (activeLink.classList.contains('nav-link-sub')) {
                const parentItem = activeLink.closest('.nav-item');
                if (parentItem) {
                    const primaryLink = parentItem.querySelector('.nav-link[data-level="primary"]');
                    if (primaryLink) primaryLink.classList.add('active');
                }
            }
        }
    }

    /* --- 2. Sticky Header Logic --- */
    function onScrollHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    /* --- 3. Drawer Menu Logic --- */
    function toggleMobileMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Ensure elements exist before toggling
        if (navbarNav && toggler) {
            const open = navbarNav.classList.toggle('show');
            toggler.classList.toggle('active');
            toggler.setAttribute('aria-expanded', String(open));
        }
    }

    function closeMobileMenu() {
        if (navbarNav && navbarNav.classList.contains('show')) {
            navbarNav.classList.remove('show');
            if (toggler) {
                toggler.classList.remove('active');
                toggler.setAttribute('aria-expanded', 'false');
            }
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
                // Scrolling the page dismisses the open burger menu
                if (navbarNav && navbarNav.classList.contains('show')) closeMobileMenu();
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

    // Escape closes the drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    // Click on Links (Smooth Scroll + Close Menu + Move Indicator) — ponytail: native smooth (CSS scroll-behavior) like the logo had; 1.5s custom was the slow one — deleted
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const rawHref = link.getAttribute('href') || '';
            const targetId = rawHref.startsWith('#') ? rawHref.substring(1) : rawHref;
            const targetSection = targetId ? document.getElementById(targetId) : null;

            if (targetSection) {
                // ponytail: native platform smooth — #top goes to exact 0, others use CSS scroll-margin-top (90px) via scrollIntoView
                if (targetId === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
                else targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Immediate visual update - reset all nav links
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                
                const navItem = link.closest('.nav-item');
                const primaryLink = navItem ? navItem.querySelector('.nav-link[data-level="primary"]') : null;

                if (primaryLink) primaryLink.classList.add('active');

                // Activate clicked sub-link immediately
                if (link.classList.contains('nav-link-sub')) {
                    link.classList.add('active');
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

            // Filter per group so empty groups (heading + cards) hide entirely
            document.querySelectorAll('.project-group').forEach(group => {
                let visibleCount = 0;

                group.querySelectorAll('.project-card').forEach(card => {
                    const category = card.getAttribute('data-category');

                    // Hide all first to trigger animation reset
                    card.style.display = 'none';
                    card.classList.remove('show');

                    if (filterValue === 'all' || (category || '').split(' ').includes(filterValue)) {
                        visibleCount++;
                        // Slight delay to allow display:none to apply
                        setTimeout(() => {
                            card.style.display = ''; // Restore default display
                            // Trigger reflow
                            void card.offsetWidth;
                            card.classList.add('show');
                        }, 50);
                    }
                });

                group.style.display = visibleCount ? '' : 'none';
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
    const tabs = document.querySelectorAll('.cv-viewer-tabs [data-cv-tab]');
    const navCvLinks = document.querySelectorAll('.nav-link[data-cv-tab]');
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
            document.querySelectorAll('.cv-embed-wrapper > [role="tabpanel"]').forEach(p => {
                p.hidden = p !== embed.parentElement;
            });
            syncDownload(embed);
            bump();
            // keep nav submenu in sync when viewer tabs are clicked directly
            navCvLinks.forEach(l => l.classList.toggle('active', l.dataset.cvTab === btn.dataset.cvTab));
        });
    });
    syncDownload(document.querySelector('.cv-embed-wrapper > [role="tabpanel"]:not([hidden]) embed'));

    // Link navbar CV submenu items to viewer tabs (parity with Projects filters)
    navCvLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tab = document.querySelector(`.cv-viewer-tabs [data-cv-tab="${link.dataset.cvTab}"]`);
            if (tab) tab.click();
        });
    });

    // Pin exists only while the CV section is on screen
    if (download && section && 'IntersectionObserver' in window) {
        new IntersectionObserver(entries => {
            download.hidden = !entries[0].isIntersecting;
        }, { threshold: 0.05 }).observe(section);
    }
}

/**
 * =========================================================================
 * DRAWER SUBMENU ACCORDIONS
 * Tap/click-to-open submenus in the unified nav drawer (no hover anywhere).
 * Accordion: opening one submenu closes the others; tapping a parent link
 * again closes its own. Capture phase so parent links act as toggles, not
 * scroll jumps.
 * =========================================================================
 */
function initTouchNav() {
    const navbarNav = document.querySelector('.navbar-nav');

    // Parent links only act as accordion toggles while the drawer is open.
    // With the drawer closed the links aren't visible anyway, so this is a
    // belt-and-braces guard for programmatic clicks.
    const burgerOpen = () => navbarNav && navbarNav.classList.contains('show');

    // Any tap closes all open submenus - except taps on a parent link,
    // which the link's own handler toggles below.
    document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link[data-level="primary"]')) return;
        document.querySelectorAll('.nav-item.has-submenu.open').forEach(i => i.classList.remove('open'));
    }, true);

    document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
        const link = item.querySelector(':scope > .nav-link');
        if (!link) return;
        link.addEventListener('click', (e) => {
            if (!burgerOpen()) return; // main navbar: navigate, don't toggle
            e.preventDefault();
            e.stopImmediatePropagation(); // accordion only - no scroll/panel close
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
 * LOGO MORPH MODULE
 * "Ahmed Ikram" scrubs into </AI> as the hero scrolls past (Anthropic-style).
 * Sets --logo-p (0→1) on .navbar-logo; the CSS interpolates it.
 * =========================================================================
 */
function initLogoMorph() {
    const logo = document.querySelector('.navbar-logo');
    if (!logo) return;

    // One-shot morph: leaving the very top of the page starts the full
    // animation (class .morphing); returning to the top plays it back
    // (.unmorphing). The scroll only triggers - each run completes.
    let compact = false;
    const update = () => {
        const next = window.scrollY > 0;
        if (next === compact) return;
        compact = next;
        logo.classList.toggle('morphing', compact);
        logo.classList.toggle('unmorphing', !compact);
    };
    window.addEventListener('scroll', () => { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
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

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // ponytail: native smooth like logo — platform default (~300-500ms), no custom 1.5s
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}