document.addEventListener('DOMContentLoaded', () => {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    console.log('DOM loaded, initializing functions...');
  }
  initHeroOverlay();
  initParallax();
  initFormValidation();
  initHeroDisappearance();
  initHeroTypingEffect();
  initBackToTop();
  initBurgerMenu();
  initHeroSmoothScroll();
  initSmoothScrollAnimations();
  init3DHeroEffects();
  initLazyLoad();
  initNavbarScroll();
  initHeroTyping();
  initScrollSpy();
  initSPAInteraction();
  initHeaderScroll();
});



// Hero Overlay Pop-up functionality
function initHeroOverlay() {
  const heroOverlay = document.getElementById('heroOverlay');
  if (!heroOverlay) return;
  
  let dismissed = false;
  
  // Function to dismiss the hero overlay
  function dismissHero() {
    if (dismissed) return;
    dismissed = true;
    
    heroOverlay.classList.add('hidden');
    
    // Remove from DOM after quick animation completes
    setTimeout(() => {
      heroOverlay.style.display = 'none';
    }, 400);
  }
  
  // Dismiss on click outside hero card
  heroOverlay.addEventListener('click', (e) => {
    const heroCard = heroOverlay.querySelector('.hero-card');
    if (heroCard && !heroCard.contains(e.target)) {
      dismissHero();
    }
  });
  
  // Dismiss on scroll
  let scrollThreshold = 50;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > scrollThreshold) {
      dismissHero();
    }
  });
  
  // Dismiss on any key press (except when typing in forms)
  document.addEventListener('keydown', (e) => {
    if (!e.target.matches('input, textarea')) {
      dismissHero();
    }
  });
  
  // Handle explore button click
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dismissHero();
      
      // Scroll to main content after hero is dismissed
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Reduced delay for quicker response
    });
  }
}
// Clean burger menu functionality
function initBurgerMenu() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarNav = document.querySelector('.navbar-nav');
  
  if (!navbarToggler || !navbarNav) {
    console.log('Navbar elements not found');
    return;
  }

  // Handle burger menu toggle
  navbarToggler.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle classes
    navbarNav.classList.toggle('show');
    navbarToggler.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navbarNav.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navbarNav.classList.remove('show');
      navbarToggler.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!navbarToggler.contains(event.target) && !navbarNav.contains(event.target)) {
      navbarNav.classList.remove('show');
      navbarToggler.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Enhanced navbar scroll effect
function initNavbarScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling background
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hiding logic removed to keep navbar sticky at all times
    // Ensure header is always visible
    header.style.opacity = '1';
    header.style.transform = 'translateY(0)';
    header.style.pointerEvents = 'auto';
  });
}

// Enhanced lazy loading with performance optimization
function initLazyLoad() {
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
  
  // Add fade-in effect for images
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        if (img.complete) {
          img.style.opacity = '1';
        }
        
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
  });
}

function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.body.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
  });
}

function initFormValidation() {
  'use strict';
  const forms = document.getElementsByClassName('needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();
      
      if (form.checkValidity()) {
        // Form is valid - you can add success handling here
        alert('Message sent successfully! Thank you for contacting me.');
        form.reset();
        form.classList.remove('was-validated');
      } else {
        // Form is invalid - show validation messages
        form.classList.add('was-validated');
      }
    });
    
    // Remove validation class when user starts typing in invalid fields
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (form.classList.contains('was-validated')) {
          // Re-validate in real-time once validation has been triggered
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

function initHeroDisappearance() {
  const hero = document.querySelector('.hero');
  if (!hero) {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      console.log('Hero element not found');
    }
    return;
  }
  
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    console.log('Hero disappearance initialized');
  }
  
  window.addEventListener('scroll', () => {
    const threshold = hero.offsetHeight / 3;
    if (window.pageYOffset > threshold) {
      hero.classList.add('hero-hidden');
    } else {
      hero.classList.remove('hero-hidden');
    }
  });
}

function initHeroTypingEffect() {
  const heroText = document.querySelector('.hero-typing');
  if (!heroText) {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      console.log('Hero typing element not found');
    }
    return;
  }
  
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    console.log('Hero typing effect initialized');
  }
  
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
      // Slightly faster typing for smoother effect
      setTimeout(type, 60);
    } else {
      setTimeout(erase, 2000);
    }
  }
  
  function erase() {
    if (charIndex > 0) {
      heroText.textContent = messages[messageIndex].substring(0, --charIndex);
      // Faster erasing for smoother transition
      setTimeout(erase, 30);
    } else {
      messageIndex = (messageIndex + 1) % messages.length;
      setTimeout(type, 800);
    }
  }
  
  // Start the typing effect after a brief delay
  setTimeout(type, 1500);
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

function initSmoothScrollAnimations() {
  // Auto-tag common content elements so effect applies site-wide without manually adding data-animate
  const autoSelectors = [
    'main section',
    '.experience-item',
    '.project-card',
    '.contact-item',
    '.skill',
    '.services .card',
    '.footer-grid > *',
    '.footer-bottom',
    '.section-title'
  ];
  autoSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(node => {
      // Skip hero overlay / hero container if present
      if (node.classList && node.classList.contains('hero')) return;
      // Skip elements explicitly marked to not animate
      if (node.classList && node.classList.contains('no-animate')) return;
      
      if (!node.hasAttribute('data-animate')) node.setAttribute('data-animate', '');
    });
  });

  const items = Array.from(document.querySelectorAll('[data-animate]'));
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  let lastScrollY = window.pageYOffset;

  const observer = new IntersectionObserver((entries) => {
    const currentScrollY = window.pageYOffset;
    const scrollingDown = currentScrollY > lastScrollY;

    // Get all currently intersecting elements in this batch to calculate stagger
    const intersectingEntries = entries.filter(entry => entry.isIntersecting);

    entries.forEach(entry => {
      const el = entry.target;
      const direction = scrollingDown ? 'down' : 'up';
      if (entry.isIntersecting) {
        el.classList.remove('from-top', 'from-bottom');
        el.classList.add(direction === 'down' ? 'from-bottom' : 'from-top');
        void el.offsetWidth; // force reflow for transition
        
        if (!el.__revealedOnce) {
          // Use index within the current batch for stagger effect
          // This ensures elements appearing together stagger nicely, 
          // but elements further down don't have huge delays based on global index
          const batchIndex = intersectingEntries.indexOf(entry);
          el.style.transitionDelay = (batchIndex * 100) + 'ms';
        } else {
          el.style.transitionDelay = '';
        }
        el.classList.add('in-view');
        el.__revealedOnce = true;
      } else {
        el.classList.remove('in-view');
        el.classList.add(direction === 'down' ? 'from-top' : 'from-bottom');
      }
    });

    lastScrollY = currentScrollY;
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  items.forEach(el => {
    el.classList.add('from-bottom');
    observer.observe(el);
  });
}

function initHeroSmoothScroll() {
  // Smooth scroll for hero CTA button
  const exploreBtns = document.querySelectorAll('a[href="#main-content"]');
  exploreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#main-content');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// 3D hero section effects
function init3DHeroEffects() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const updateTransform = () => {
    const scrollY = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    const windowHeight = window.innerHeight;
    const maxDepth = 50;
    
    // Calculate depth based on scroll position
    const depth = Math.min(maxDepth, (scrollY / windowHeight) * maxDepth);
    
    hero.style.transform = `translateZ(${-depth}px)`;
  };
  
  window.addEventListener('scroll', updateTransform);
  updateTransform();
}

// ===== SPA Migration Utilities =====

function initScrollSpy() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  if (navLinks.length === 0) return;

  function updateActiveLink() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    const scrollY = window.pageYOffset;
    
    // Define a trigger zone: roughly 30% down the viewport.
    const triggerPoint = windowHeight * 0.3;

    let currentId = '';

    // Priority Check: Bottom of page -> Always activate 'Contact' (or last item)
    if ((scrollY + windowHeight) >= (documentHeight - 50)) {
       const lastLink = navLinks[navLinks.length - 1];
       if (lastLink) currentId = lastLink.getAttribute('href').substring(1);
    } else {
        // Standard Check: Find the last section whose top has crossed the trigger point
        // We iterate in order, so the last one that matches overwrites previous matches.
        navLinks.forEach(link => {
            const id = link.getAttribute('href').substring(1);
            const section = document.getElementById(id);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= triggerPoint) {
                    currentId = id;
                }
            }
        });
    }

    // Fallback: If no section is triggered (e.g. at very top), default to first one if visible
    if (!currentId && navLinks.length > 0) {
        // Only if we are near the top
        if (scrollY < 100) {
             currentId = navLinks[0].getAttribute('href').substring(1);
        }
    }

    navLinks.forEach(link => {
      // Remove active class from all
      link.classList.remove('active');
      
      // Add active class to match
      const linkId = link.getAttribute('href').substring(1);
      if (linkId === currentId) {
        link.classList.add('active');
      }
    });
  }

  // Use passive listener for performance
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  // Initial check
  updateActiveLink(); 
  // Delayed check to handle any layout shifts
  setTimeout(updateActiveLink, 100);
}

function initSPAInteraction() {
  // Mobile menu close on click
  const navLinks = document.querySelectorAll('.nav-link');
  const navbarNav = document.querySelector('.navbar-nav');
  const navbarToggler = document.querySelector('.navbar-toggler');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarNav && navbarNav.classList.contains('show')) {
        navbarNav.classList.remove('show');
        if (navbarToggler) {
             // Bootstrap toggler usually doesn't need manual class removal but depends on implementation
             // navbarToggler.classList.remove('active'); 
        }
      }
    });
  });

  // Smooth scroll with offset for fixed header
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Check for fixed header height
            const headerOffset = 80; 
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
      }
    });
  });
}
