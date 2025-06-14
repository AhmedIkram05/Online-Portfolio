document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initFormValidation();
  initTheme();
  initHeroDisappearance();
  initHeroTypingEffect();
  initBackToTop();
  initBurgerMenu();
  initSmoothScrollAnimations();
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

function initTheme() {
  const themeToggler = document.getElementById('theme-toggler');
  const isDarkTheme = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  
  const navbar = document.querySelector('.navbar');
  if (navbar) {
      navbar.classList.toggle('navbar-dark', isDarkTheme);
      navbar.classList.toggle('bg-dark', isDarkTheme);
  }

  updateThemeTogglerIcon(themeToggler, isDarkTheme);

  if (themeToggler) {
    themeToggler.addEventListener('click', () => {
      const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      document.body.classList.toggle('dark-theme');
      if (navbar) {
          navbar.classList.toggle('navbar-dark', newTheme === 'dark');
          navbar.classList.toggle('bg-dark', newTheme === 'dark');
      }
      localStorage.setItem('theme', newTheme);
      updateThemeTogglerIcon(themeToggler, newTheme === 'dark');
    });
  }
}

function updateThemeTogglerIcon(themeToggler, isDarkTheme) {
  if (themeToggler) {
    themeToggler.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
}

function initHeroDisappearance() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
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
  const heroText = document.getElementById('heroTyping');
  if (!heroText) return;
  const messages = [
    "Discover my Projects, Skills and the journey behind them",
    "Learn more about me and my passion for coding"
  ];
  let messageIndex = 0;
  let charIndex = 0;
  function type() {
    if (charIndex < messages[messageIndex].length) {
      heroText.textContent += messages[messageIndex].charAt(charIndex++);
      setTimeout(type, 100);
    } else {
      setTimeout(erase, 1500);
    }
  }
  function erase() {
    if (charIndex > 0) {
      heroText.textContent = messages[messageIndex].substring(0, --charIndex);
      setTimeout(erase, 50);
    } else {
      messageIndex = (messageIndex + 1) % messages.length;
      setTimeout(type, 800);
    }
  }
  type();
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
