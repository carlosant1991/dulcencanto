document.addEventListener('DOMContentLoaded', function () {

  const btn = document.getElementById('backToTop');

  if (!btn) return;

  function toggleButton() {

    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }

  }

  window.addEventListener('scroll', toggleButton, { passive: true });

  btn.addEventListener('click', function () {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  });

  // Estado inicial
  toggleButton();

});
