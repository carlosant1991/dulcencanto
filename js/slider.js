document.addEventListener('DOMContentLoaded', function () {

  const slider = document.querySelector('.slider-inner');
  const slides = document.querySelectorAll('.slide');

  if (!slider || !slides.length) return;

  let index = 0;

  setInterval(function () {

    index++;

    if (index >= slides.length) {
      index = 0;
    }

    slider.style.transform = `translateX(-${index * 100}%)`;

  }, 5000);

});
