document.addEventListener('DOMContentLoaded', function () {

  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.menu-overlay');
  const links = document.querySelectorAll('.nav-menu a');
  const body = document.body;

  if (!toggle || !menu || !overlay) return;

  function openMenu() {
    menu.classList.add('active');
    overlay.classList.add('active');
    body.classList.add('menu-open');
  }

  function closeMenu() {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.contains('active') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

});
