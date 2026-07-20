document.addEventListener('DOMContentLoaded', function() {

  function loadPosts(config) {
    const { container, max, type } = config;
    if (!container) return;

    container.innerHTML = `
      <div class="loading-posts">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Cargando entradas...</p>
      </div>
    `;

    const FEED_BASE = '/feeds/posts/default';

fetch(`${FEED_BASE}?alt=json&max-results=${max}`)
  .then(res => res.json())
  .then(data => {
    const entries = data.feed.entry || [];
    let html = '';

        entries.forEach(entry => {
          const title = entry.title.$t;

          const linkObj = entry.link.find(l => l.rel === 'alternate');
          const url = linkObj ? linkObj.href : '#';

          let image = '';
          if (entry.media$thumbnail) {
            image = entry.media$thumbnail.url.replace(/\/s\d+(-c)?\//, '/s800/');
          } else if (entry.content?.$t) {
            const match = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
            if (match) image = match[1];
          }

          if (type === 'grid') {
            html += `
              <article class="post-card-grid">
                ${image ? `<img src="${image}" alt="${title}" loading="lazy">` : ''}
                <div class="post-content">
                  <h3><a href="${url}">${title}</a></h3>
                </div>
              </article>
            `;
          }

          if (type === 'large') {
            html += `
              <article class="large-post-card">
                ${image ? `<img src="${image}" alt="${title}" loading="lazy">` : ''}
                <div class="post-content">
                  <h3><a href="${url}">${title}</a></h3>
                </div>
              </article>
            `;
          }
        });

        container.innerHTML = html;
      })
      .catch(() => {
        container.innerHTML = `<p>Error al cargar entradas</p>`;
      });
  }

  // 🔥 LLAMADAS
  loadPosts({
    container: document.getElementById('latest-posts-container'),
    max: 4,
    type: 'grid'
  });

  loadPosts({
    container: document.querySelector('.large-posts-section'),
    max: 5,
    type: 'large'
  });

});
