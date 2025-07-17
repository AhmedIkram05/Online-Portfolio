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
  initProgressBars();
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
  
  // Dismiss on click anywhere
  heroOverlay.addEventListener('click', dismissHero);
  
  // Dismiss on scroll
  let scrollThreshold = 50;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > scrollThreshold) {
      dismissHero();
    }
  });
  
  // Dismiss on any key press
  document.addEventListener('keydown', dismissHero);
  
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
function initBurgerMenu() {
  const toggler = document.querySelector('.navbar-toggler');
  if (!toggler) return;
  const barsIcon = toggler.querySelector('.fa-bars');
  const timesIcon = toggler.querySelector('.fa-times');
  if (!barsIcon || !timesIcon) return;

  // Ensure only bars is visible initially
  barsIcon.style.display = '';
  timesIcon.style.display = 'none';

  toggler.addEventListener('click', () => {
    const navMenu = document.getElementById('navMenu');
    const expanded = toggler.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      barsIcon.style.display = '';
      timesIcon.style.display = 'none';
    } else {
      barsIcon.style.display = 'none';
      timesIcon.style.display = '';
    }
  });

  // Also handle collapse on nav link click (optional, if nav links exist)
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      barsIcon.style.display = '';
      timesIcon.style.display = 'none';
    });
  });
}

// Enhanced navbar scroll effect
function initNavbarScroll() {
  const header = document.querySelector('header');
  if (!header) return;
  
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class for styling
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Smooth hide/show entire header on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide entire header with smooth animation
      header.style.opacity = '0';
      header.style.transform = 'translateY(-100%)';
      header.style.pointerEvents = 'none';
    } else {
      // Scrolling up - show entire header with smooth animation
      header.style.opacity = '1';
      header.style.transform = 'translateY(0)';
      header.style.pointerEvents = 'auto';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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
  const animatedItems = document.querySelectorAll('[data-animate]');
  if (!("IntersectionObserver" in window)) {
    animatedItems.forEach(item => item.classList.add('animate'));
    return;
  }
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  animatedItems.forEach(item => observer.observe(item));
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

// Progress bar animations
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.style.width || '0%';
        
        // Start from 0 and animate to target
        progressBar.style.width = '0%';
        setTimeout(() => {
          progressBar.style.width = targetWidth;
        }, 200);
        
        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.1 });
  
  progressBars.forEach(bar => observer.observe(bar));
}