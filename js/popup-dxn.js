// Popup DXN

document.addEventListener('DOMContentLoaded', function(){

  const popup = document.getElementById('popup-dxn');
  const closeBtn = document.querySelector('.popup-close');

  if(!popup) return;


  let popupAlreadyHandled = false;


  if(sessionStorage.getItem('popupShown')) return;


  function showPopup(){

    if(popupAlreadyHandled) return;

    popup.style.display = 'flex';

    document.body.classList.add('popup-active');

    sessionStorage.setItem('popupShown','true');

    popupAlreadyHandled = true;

  }


  function closePopup(){

    popup.style.display = 'none';

    document.body.classList.remove('popup-active');

    sessionStorage.setItem('popupShown','true');

    popupAlreadyHandled = true;

  }


  // INTENCIÓN DE SALIDA
  document.addEventListener('mouseleave',function(e){

    if(e.clientY <= 0){

      showPopup();

    }

  });


  // SCROLL
  let scrollTriggered = false;


  window.addEventListener('scroll',function(){

    if(scrollTriggered || popupAlreadyHandled) return;


    const scrollPercent =
      (window.scrollY /
      (document.body.scrollHeight - window.innerHeight)) * 100;


    if(scrollPercent > 40){

      scrollTriggered = true;

      showPopup();

    }

  });


  // FALLBACK
  setTimeout(function(){

    if(!popupAlreadyHandled){

      showPopup();

    }

  },8000);



  // CERRAR BOTÓN
  if(closeBtn){

    closeBtn.addEventListener('click',closePopup);

  }



  // CLIC FUERA DEL POPUP
  popup.addEventListener('click',function(e){

    if(e.target === popup){

      closePopup();

    }

  });



  // TECLA ESC
  document.addEventListener('keydown',function(e){

    if(e.key === 'Escape'){

      closePopup();

    }

  });


});
