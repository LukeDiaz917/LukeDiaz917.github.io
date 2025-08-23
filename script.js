// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Simple contact form feedback
const form = document.querySelector('form[aria-label="Contact form"]');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you — I will be in touch.');
    form.reset();
  });
}
