document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initFormValidation();
  initTheme();
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
  // Load the saved theme
  const themeToggler = document.getElementById('theme-toggler');
  const isDarkTheme = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  
  // Add dark-theme class to navbar if dark theme is enabled
  const navbar = document.querySelector('.navbar');
  if (navbar) {
      navbar.classList.toggle('dark-theme', isDarkTheme);
      // Set background color directly
      navbar.style.backgroundColor = isDarkTheme ? '#222' : '#2C3E50';
  }

  updateThemeTogglerIcon(themeToggler, isDarkTheme);

  // Toggle theme handler
  if (themeToggler) {
    themeToggler.addEventListener('click', () => {
      const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
      document.body.classList.toggle('dark-theme');
        
      // Toggle dark-theme class on navbar
      if (navbar) {
          navbar.classList.toggle('dark-theme');
          // Set background color directly
          navbar.style.backgroundColor = newTheme === 'dark' ? '#222' : '#2C3E50';
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
