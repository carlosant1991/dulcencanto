document.addEventListener('DOMContentLoaded', function () {

  const container = document.getElementById('related-posts-container');
  const titleEl = document.querySelector('.related-title');

  if (!container) return;

  const currentUrl = window.location.href
    .split('?')[0]
    .split('#')[0]
    .replace(/\/$/, '');

  const postLabels = Array.from(
    document.querySelectorAll('.post-label-item')
  )
    .map(function (el) {
      return el.getAttribute('data-label');
    })
    .filter(Boolean);

  function shuffleArray(array) {

    for (let i = array.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];

    }

    return array;

  }

  function getUrl(entry) {

    if (!entry.link) return '';

    const link = entry.link.find(function (item) {
      return item.rel === 'alternate';
    });

    return link ? link.href : '';

  }

  function normalizeUrl(url) {

    return (url || '')
      .split('?')[0]
      .split('#')[0]
      .replace(/\/$/, '');

  }

  function getImage(entry) {

    if (entry.media$thumbnail) {

      return entry.media$thumbnail.url.replace(
        /\/s\d+(-c)?\//,
        '/s600/'
      );

    }

    if (entry.content && entry.content.$t) {

      const match = entry.content.$t.match(
        /<img[^>]+src=["']([^"']+)["']/
      );

      return match ? match[1] : '';

    }

    return '';

  }

  fetch('/feeds/posts/default?alt=json&max-results=100')

    .then(function (response) {

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      return response.json();

    })

    .then(function (data) {

      const entries = data.feed && data.feed.entry
        ? data.feed.entry
        : [];

      console.log(
        'Productos encontrados:',
        entries.length
      );

      let related = [];

      // ============================
      // BUSCAR POR ETIQUETAS
      // ============================

      if (postLabels.length > 0) {

        related = entries.filter(function (entry) {

          const entryUrl = getUrl(entry);

          if (!entryUrl) return false;

          // No mostrar el producto actual
          if (
            normalizeUrl(entryUrl) ===
            normalizeUrl(currentUrl)
          ) {
            return false;
          }

          const entryLabels = entry.category
            ? entry.category.map(function (cat) {
                return cat.term;
              })
            : [];

          return postLabels.some(function (label) {

            return entryLabels.includes(label);

          });

        });

      }

      // ============================
      // SI NO HAY RELACIONADOS
      // MOSTRAR ALEATORIOS
      // ============================

      if (related.length === 0) {

        related = entries.filter(function (entry) {

          const entryUrl = getUrl(entry);

          if (!entryUrl) return false;

          return (
            normalizeUrl(entryUrl) !==
            normalizeUrl(currentUrl)
          );

        });

        shuffleArray(related);

        if (titleEl) {
          titleEl.textContent = 'Te puede interesar...';
        }

      }

      // ============================
      // MOSTRAR SOLO 2
      // ============================

      related = related.slice(0, 2);

      console.log(
        'Productos relacionados mostrados:',
        related.length
      );

      if (related.length === 0) {

        container.innerHTML =
          '<p style="text-align:center;">No hay artículos disponibles</p>';

        return;

      }

      // ============================
      // GENERAR HTML
      // ============================

      let html = '';

      related.forEach(function (entry) {

        const title = entry.title && entry.title.$t
          ? entry.title.$t
          : 'Sin título';

        const url = getUrl(entry);

        const image = getImage(entry);

        let date = '';

        if (entry.published && entry.published.$t) {

          date = new Date(
            entry.published.$t
          ).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });

        }

        html += `
          <article class="related-post-card">

            ${
              image
                ? `
                  <img
                    src="${image}"
                    alt="${title}"
                    loading="lazy"
                  >
                `
                : ''
            }

            <h4 class="related-title-card">
              <a href="${url}">
                ${title}
              </a>
            </h4>

            ${
              date
                ? `
                  <div class="related-meta">
                    <i class="far fa-calendar"></i>
                    ${date}
                  </div>
                `
                : ''
            }

          </article>
        `;

      });

      container.innerHTML = html;

    })

    .catch(function (error) {

      console.error(
        'Error cargando productos relacionados:',
        error
      );

      container.innerHTML =
        '<p style="text-align:center;">Error al cargar artículos</p>';

    });

});
