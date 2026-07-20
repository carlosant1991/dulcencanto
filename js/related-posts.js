document.addEventListener('DOMContentLoaded', function () {

  const container = document.getElementById('related-posts-container');
  const titleEl = document.querySelector('.related-title');

  if (!container) return;

  const FEED_BASE = '/feeds/posts/default';
  const currentUrl = location.href.split('?')[0].split('#')[0];

  const labelElements = document.querySelectorAll('.post-label-item');
  const postLabels = Array.from(labelElements)
    .map(el => el.getAttribute('data-label'))
    .filter(Boolean);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getImage(entry) {

    if (entry.media$thumbnail) {
      return entry.media$thumbnail.url.replace(/\/s\d+(-c)?\//, '/s600/');
    }

    if (entry.content && entry.content.$t) {
      const match = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
      if (match) return match[1];
    }

    return '';

  }

  fetch(`${FEED_BASE}?alt=json&max-results=100`)
    .then(res => res.json())
    .then(data => {

      const entries = data.feed.entry || [];
      let related = [];

      // Buscar relacionados por etiquetas
      if (postLabels.length > 0) {

        entries.forEach(entry => {

          const link = entry.link.find(l => l.rel === 'alternate');
          if (!link) return;

          const entryUrl = link.href.split('?')[0].split('#')[0];

          // Excluir la entrada actual
          if (entryUrl === currentUrl) return;

          const entryLabels = entry.category
            ? entry.category.map(cat => cat.term)
            : [];

          if (postLabels.some(label => entryLabels.includes(label))) {
            related.push(entry);
          }

        });

      }

      // Si no hay relacionados, mostrar aleatorios
      if (!related.length) {

        related = entries.filter(entry => {

          const link = entry.link.find(l => l.rel === 'alternate');
          if (!link) return false;

          return link.href.split('?')[0].split('#')[0] !== currentUrl;

        });

        shuffleArray(related);

        if (titleEl) {
          titleEl.textContent = 'Te puede interesar...';
        }

      }

      related = related.slice(0, 2);

      if (!related.length) {
        container.innerHTML =
          '<p style="text-align:center;">No hay artículos disponibles</p>';
        return;
      }

      let html = '';

      related.forEach(entry => {

        const title = entry.title.$t;

        const url = entry.link.find(l => l.rel === 'alternate').href;

        const image = getImage(entry);

        const date = new Date(entry.published.$t).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });

        html += `
          <article class="related-post-card">

            ${image ? `<img src="${image}" alt="${title}" loading="lazy">` : ''}

            <h4 class="related-title-card">
              <a href="${url}">${title}</a>
            </h4>

            <div class="related-meta">
              <i class="far fa-calendar"></i>
              ${date}
            </div>

          </article>
        `;

      });

      container.innerHTML = html;

    })
    .catch(() => {

      container.innerHTML =
        '<p style="text-align:center;">Error al cargar artículos</p>';

    });

});
