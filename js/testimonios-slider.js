document.addEventListener('DOMContentLoaded', function () {

  setInterval(function () {

    const slider = document.querySelector('.testimonios-slider');

    if (slider) {
      slider.scrollBy({
        left: 280,
        behavior: 'smooth'
      });
    }

  }, 4000);

});
