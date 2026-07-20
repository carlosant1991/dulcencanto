document.addEventListener('DOMContentLoaded', function () {

  const lazyImages = document.querySelectorAll('img.lazy');

  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {

    const observer = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (!entry.isIntersecting) return;

        const img = entry.target;

        if (img.dataset.src) {
          img.src = img.dataset.src;
        }

        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        img.classList.remove('lazy');

        observer.unobserve(img);

      });

    });

    lazyImages.forEach(function (img) {
      observer.observe(img);
    });

  } else {

    // Compatibilidad con navegadores antiguos
    lazyImages.forEach(function (img) {

      if (img.dataset.src) {
        img.src = img.dataset.src;
      }

      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }

      img.classList.remove('lazy');

    });

  }

});
