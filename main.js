document.addEventListener('DOMContentLoaded', function() {
	// Parallax effect for background image
	window.addEventListener('scroll', function() {
		const scrolled = window.pageYOffset;
		document.body.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
	});
	
	// Bootstrap form validation (for pages that require it)
	(function() {
		'use strict';
		var forms = document.getElementsByClassName('needs-validation');
		Array.prototype.forEach.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			});
		});
	})();
});

// Load scripts with defer (update script tags in HTML accordingly)
