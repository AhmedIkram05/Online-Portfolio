document.addEventListener('DOMContentLoaded', () => {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    console.log('DOM loaded, initializing functions...');
  }
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
});

// Burger menu toggler icon logic
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

// Lazy-load all images by setting loading attribute
function initLazyLoad() {
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
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
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        alert('Form submitted successfully!');
      }
      form.classList.add('was-validated');
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
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function init3DHeroEffects() {
  // Add subtle mouse interaction to 3D elements
  const floatingElements = document.querySelectorAll('.floating-element');
  const hero = document.querySelector('.hero');
  
  if (!hero || floatingElements.length === 0) return;
  
  // Store original transforms to preserve CSS animations
  const originalTransforms = new Map();
  floatingElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    originalTransforms.set(element, computedStyle.transform);
  });
  
  // Very subtle mouse movement parallax effect
  let isMouseInHero = false;
  
  hero.addEventListener('mouseenter', () => {
    isMouseInHero = true;
  });
  
  hero.addEventListener('mouseleave', () => {
    isMouseInHero = false;
    // Reset to original transforms
    floatingElements.forEach(element => {
      element.style.transform = '';
    });
  });
  
  hero.addEventListener('mousemove', (e) => {
    if (!isMouseInHero) return;
    
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    floatingElements.forEach((element, index) => {
      // Much more subtle movement - only 2-3 degrees max
      const intensity = (index + 1) * 2;
      const rotateX = y * intensity;
      const rotateY = x * intensity;
      
      // Apply subtle parallax while preserving existing transforms
      element.style.transform = `translate3d(${x * intensity}px, ${y * intensity}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });
  
  // Enable roaming movement for floating elements
  const roamElements = document.querySelectorAll('.hero-3d-scene .floating-element');
  roamElements.forEach((el, idx) => {
    // Apply smooth top/left transitions
    el.style.transition = 'top 20s ease-in-out, left 20s ease-in-out';
    // Ensure absolute positioning
    el.style.position = 'absolute';
    // Initial roam invocation
    (function roam() {
      const newLeft = 10 + Math.random() * 80;   // percent values between 10% and 90%
      const newTop = 15 + Math.random() * 70;    // percent values between 15% and 85%
      el.style.left = newLeft + '%';
      el.style.top = newTop + '%';
      // Continue roaming periodically
      setTimeout(roam, 20000 + idx * 2000);
    })();
  });
  
  // Add relevant click interactions to code blocks
  const codeBlocks = document.querySelectorAll('[class*="code-block"]');
  codeBlocks.forEach((block, index) => {
    block.addEventListener('click', () => {
      // Simulate code execution with visual feedback
      const originalBg = block.style.background;
      const originalBorder = block.style.borderColor;
      
      // Flash effect to simulate code execution
      block.style.background = 'rgba(46, 204, 113, 0.2)';
      block.style.borderColor = '#2ecc71';
      
      setTimeout(() => {
        block.style.background = originalBg;
        block.style.borderColor = originalBorder;
      }, 500);
      
      // Optional: Show a console message
      console.log(`Code block ${index + 1} executed!`);
    });
  });
  
  // Add click interactions to geometric elements
  const geometricElements = document.querySelectorAll('[class*="geometric"]');
  geometricElements.forEach((element, index) => {
    element.addEventListener('click', () => {
      // Create a brief scaling effect
      element.style.transform += ' scale(1.2)';
      setTimeout(() => {
        element.style.transform = element.style.transform.replace(' scale(1.2)', '');
      }, 300);
    });
  });
  
  // Add click interactions to dynamic orbs
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach((orb, index) => {
    orb.addEventListener('mouseover', () => {
      orb.style.animation = 'none';
      orb.style.transform += ' scale(1.3)';
      orb.style.opacity = '1';
    });
    orb.addEventListener('mouseout', () => {
      orb.style.animation = '';
    });
    orb.addEventListener('click', () => {
      // Temporary flash effect
      orb.style.boxShadow = '0 0 25px rgba(46, 204, 113, 0.7)';
      setTimeout(() => orb.style.boxShadow = '', 500);
      console.log(`Orb ${index + 1} clicked!`);
    });
  });
}