// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Basic client-side form feedback
const form = document.querySelector('form[aria-label="Contact form"]');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks — I will get back to you soon.');
    form.reset();
  });
}
