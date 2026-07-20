document.addEventListener('DOMContentLoaded', function () {

  var postId = window.currentPostId;

  var container = document.getElementById('related-posts-container');
  var titleEl = document.querySelector('.related-title');

  if (!container || !postId) return;

  var labelElements = document.querySelectorAll('.post-label-item');

  var postLabels = Array.from(labelElements).map(function(el){
    return el.getAttribute('data-label');
  });

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function getImage(entry){

    if(entry.media$thumbnail){
      return entry.media$thumbnail.url.replace(/\/s\d+(-c)?\//,'/s600/');
    }

    if(entry.content && entry.content.$t){
      var match = entry.content.$t.match(/<img[^>]+src="([^">]+)"/);
      if(match) return match[1];
    }

    return '';

  }

  fetch('/feeds/posts/default?alt=json&max-results=100')
    .then(function(res){
      return res.json();
    })
    .then(function(data){

      var entries = data.feed.entry || [];
      var related = [];

      if(postLabels.length){

        entries.forEach(function(entry){

          if(entry.id.$t.indexOf(postId) !== -1) return;

          var labels = [];

          if(entry.category){
            labels = entry.category.map(function(cat){
              return cat.term;
            });
          }

          var found = postLabels.some(function(label){
            return labels.indexOf(label) !== -1;
          });

          if(found){
            related.push(entry);
          }

        });

      }

      if(!related.length){

        related = entries.filter(function(entry){
          return entry.id.$t.indexOf(postId) === -1;
        });

        shuffleArray(related);

        if(titleEl){
          titleEl.textContent = 'Te puede interesar...';
        }

      }

      related = related.slice(0,2);

      if(!related.length){
        container.innerHTML='<p style="text-align:center;">No hay artículos disponibles</p>';
        return;
      }

      var html='';

      related.forEach(function(entry){

        var title = entry.title.$t;

        var url = '#';

        var link = entry.link.find(function(l){
          return l.rel === 'alternate';
        });

        if(link){
          url = link.href;
        }

        var image = getImage(entry);

        var date = new Date(entry.published.$t).toLocaleDateString('es-ES',{
          day:'2-digit',
          month:'short',
          year:'numeric'
        });

        html +=
        '<article class="related-post-card">'+

          (image ? '<img src="'+image+'" alt="'+title+'" loading="lazy">' : '')+

          '<h4 class="related-title-card">'+
            '<a href="'+url+'">'+title+'</a>'+
          '</h4>'+

          '<div class="related-meta">'+
            '<i class="far fa-calendar"></i> '+date+
          '</div>'+

        '</article>';

      });

      container.innerHTML = html;

    })
    .catch(function(){

      container.innerHTML='<p style="text-align:center;">Error al cargar artículos</p>';

    });

});
