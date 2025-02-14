document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initFormValidation();
  initTheme();
  initHeroDisappearance();
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
      navbar.classList.toggle('dark-theme', isDarkTheme);
      // Removed inline backgroundColor update to allow CSS to control styling
  }

  updateThemeTogglerIcon(themeToggler, isDarkTheme);

  if (themeToggler) {
    themeToggler.addEventListener('click', () => {
      const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      document.body.classList.toggle('dark-theme');
      if (navbar) {
          navbar.classList.toggle('dark-theme');
          // Removed inline backgroundColor update to allow CSS to control styling
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
