document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing functions...');
  initParallax();
  initFormValidation();
  initHeroDisappearance();
  initHeroTypingEffect();
  initBackToTop();
  initBurgerMenu();
  initSmoothScrollAnimations();
  init3DHeroEffects();
  initSmoothScrolling();
});

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
    console.log('Hero element not found');
    return;
  }
  
  console.log('Hero disappearance initialized');
  
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
    console.log('Hero typing element not found');
    return;
  }
  
  console.log('Hero typing effect initialized');
  
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
      setTimeout(type, 80);
    } else {
      setTimeout(erase, 2500);
    }
  }
  
  function erase() {
    if (charIndex > 0) {
      heroText.textContent = messages[messageIndex].substring(0, --charIndex);
      setTimeout(erase, 40);
    } else {
      messageIndex = (messageIndex + 1) % messages.length;
      setTimeout(type, 1000);
    }
  }
  
  // Start the typing effect
  setTimeout(type, 2000);
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

function initBurgerMenu() {
  const toggler = document.querySelector('.navbar-toggler');
  const menu = document.querySelector(toggler.getAttribute('data-target'));
  if (!toggler || !menu) return;
  
  toggler.addEventListener('click', () => {
    toggler.classList.toggle('open');
  });

  menu.addEventListener('show.bs.collapse', () => {
    toggler.classList.add('open');
  });
  menu.addEventListener('hide.bs.collapse', () => {
    toggler.classList.remove('open');
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

function init3DHeroEffects() {
  // Add mouse interaction to 3D elements
  const floatingElements = document.querySelectorAll('.floating-element');
  const hero = document.querySelector('.hero');
  
  if (!hero || floatingElements.length === 0) return;
  
  // Mouse movement parallax effect
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    floatingElements.forEach((element, index) => {
      const intensity = (index + 1) * 10;
      const rotateX = y * intensity;
      const rotateY = x * intensity;
      
      element.style.transform = `${element.style.transform} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });
  
  // Reset on mouse leave
  hero.addEventListener('mouseleave', () => {
    floatingElements.forEach(element => {
      element.style.transform = element.style.transform.replace(/rotateX\([^)]*\)/g, '').replace(/rotateY\([^)]*\)/g, '');
    });
  });
  
  // Add click interactions to code blocks
  const codeBlocks = document.querySelectorAll('[class*="code-block"]');
  codeBlocks.forEach(block => {
    block.addEventListener('click', () => {
      // Create a ripple effect
      block.style.animation = 'none';
      setTimeout(() => {
        block.style.animation = 'float 6s ease-in-out infinite';
      }, 100);
    });
  });
}

function initSmoothScrolling() {
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
