// Auto-set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Simple contact form feedback (can be replaced later with real submission)
const form = document.querySelector('form[aria-label="Contact form"]');
if (form) {
  form.addEventListener('submit', () => {
    alert('Thank you — I will be in touch.');
  });
}
