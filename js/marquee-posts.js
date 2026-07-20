// Marquesina de Últimas Entradas

document.addEventListener('DOMContentLoaded', function () {

  fetch('/feeds/posts/default?alt=json&max-results=15')
    .then(response => response.json())
    .then(data => {

      const container = document.querySelector('.marquee-content');

      if (!container) return;

      data.feed.entry.forEach(entry => {

        const title = entry.title.$t;

        const link = entry.link.find(l => l.rel === 'alternate').href;

        const a = document.createElement('a');

        a.href = link;
        a.className = 'marquee-item';
        a.textContent = `🆕 ${title}`;

        container.appendChild(a);

      });

    })
    .catch(err => console.error('Error cargando entradas:', err));

});
