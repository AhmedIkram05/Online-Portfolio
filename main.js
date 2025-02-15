document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initFormValidation();
  initTheme();
  initHeroDisappearance();
  initCustomCursor();
  initBackToTop();
});

// ...existing functions... 
// (Ensure that any page-specific code referencing a "skills" page is updated to "experience" if needed)

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

function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mousedown', (e) => {
      if (e.target.closest('a')) {
        cursor.classList.add('cursor-click-link'); // For link clicks
      } else {
        cursor.classList.add('cursor-click'); // For any other clicks
      }
    });
    document.addEventListener('mouseup', () => {
      setTimeout(() => {
        cursor.classList.remove('cursor-click', 'cursor-click-link');
      }, 100);
    });
  }
}

function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
