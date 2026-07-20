// Dark Mode Toggle

// APLICAR TEMA INMEDIATAMENTE (SIN FLASH)
(function(){

  const savedTheme = localStorage.getItem('theme');

  if(savedTheme){
    document.documentElement.setAttribute('data-theme', savedTheme);
  }else{
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute(
      'data-theme',
      prefersDark ? 'dark' : 'light'
    );
  }

})();


document.addEventListener('DOMContentLoaded', function(){

  const toggle = document.querySelector('.theme-toggle');
  const icon = document.getElementById('theme-icon');

  if(!toggle || !icon) return;


  function updateIcon(theme){

    icon.classList.remove('fa-moon','fa-sun');

    icon.classList.add(
      theme === 'dark' ? 'fa-sun' : 'fa-moon'
    );

  }


  function setTheme(theme){

    document.documentElement.setAttribute('data-theme',theme);

    localStorage.setItem('theme',theme);

    updateIcon(theme);

  }


  const currentTheme =
    document.documentElement.getAttribute('data-theme') || 'light';

  updateIcon(currentTheme);


  toggle.addEventListener('click',function(){

    const newTheme =
      document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light'
      : 'dark';

    setTheme(newTheme);

  });


});
