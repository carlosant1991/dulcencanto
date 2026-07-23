import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ========================================
// CONFIGURACIÓN FIREBASE
// ========================================

const firebaseConfig = {
  apiKey: "AIzaSyBcZlmjd5PYsy2dYJKbqLBWgNVViPvFFzY",
  authDomain: "dulce-encanto-opiniones.firebaseapp.com",
  projectId: "dulce-encanto-opiniones",
  storageBucket: "dulce-encanto-opiniones.firebasestorage.app",
  messagingSenderId: "623520812289",
  appId: "1:623520812289:web:8a2430310992e7bd5ddf00"
};


// ========================================
// INICIALIZAR FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();


// ========================================
// ELEMENTOS DEL HTML
// ========================================

const slider = document.getElementById("testimonios-slider");

const btnDejarOpinion =
  document.getElementById("btn-dejar-opinion");

const formulario =
  document.getElementById("formulario-opinion");

const btnGoogleLogin =
  document.getElementById("btn-google-login");

const contenidoFormulario =
  document.getElementById("form-opinion-contenido");

const usuarioOpinion =
  document.getElementById("usuario-opinion");

const usuarioLogueado =
  document.getElementById("usuario-logueado");

const textoOpinion =
  document.getElementById("texto-opinion");

const btnEnviarOpinion =
  document.getElementById("btn-enviar-opinion");

const btnCerrarOpinion =
  document.getElementById("btn-cerrar-opinion");

const mensajeOpinion =
  document.getElementById("mensaje-opinion");

const contadorOpinion =
  document.getElementById("contador-opinion");


// ========================================
// CARGAR OPINIONES
// ========================================

async function cargarOpiniones() {

  if (!slider) return;

  slider.innerHTML = `
    <div class="testimonio cargando-opiniones">
      <p>Cargando opiniones...</p>
    </div>
  `;

  try {

    const opinionesRef =
      collection(db, "opiniones");

    const q = query(
      opinionesRef,
      where("aprobada", "==", true),
      orderBy("fecha", "desc"),
      limit(7)
    );

    const snapshot =
      await getDocs(q);

    slider.innerHTML = "";

    if (snapshot.empty) {

      slider.innerHTML = `
        <div class="testimonio cargando-opiniones">
          <div class="stars">
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </div>

          <p>
            Sé el primero en compartir tu experiencia con nosotros.
          </p>

          <span>
            Dulce Encanto &#8211; Repostería Artesanal
          </span>
        </div>
      `;

      return;
    }


    snapshot.forEach((doc) => {

      const opinion = doc.data();

      const tarjeta =
        document.createElement("div");

      tarjeta.className =
        "testimonio";

      tarjeta.innerHTML = `

        <div class="stars">
          &#9733;&#9733;&#9733;&#9733;&#9733;
        </div>

        <p>
          &#8220;${escaparHTML(opinion.comentario)}&#8221;
        </p>

        <span>
          ${escaparHTML(opinion.nombre || "Cliente")}
        </span>

      `;

      slider.appendChild(tarjeta);

    });

  } catch (error) {

    console.error(
      "Error al cargar opiniones:",
      error
    );

    slider.innerHTML = `
      <div class="testimonio cargando-opiniones">
        <p>
          No se pudieron cargar las opiniones.
        </p>
      </div>
    `;

  }

}


// ========================================
// ESCAPAR HTML
// ========================================

function escaparHTML(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    texto || "";

  return div.innerHTML;

}


// ========================================
// ABRIR FORMULARIO
// ========================================

if (btnDejarOpinion) {

  btnDejarOpinion.addEventListener(
    "click",
    function () {

      formulario.style.display =
        "block";

      formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }
  );

}


// ========================================
// LOGIN CON GOOGLE
// ========================================

if (btnGoogleLogin) {

  btnGoogleLogin.addEventListener(
    "click",
    async function () {

      mensajeOpinion.textContent =
        "Conectando con Google...";

      try {

        await signInWithPopup(
          auth,
          provider
        );

      } catch (error) {

        console.error(
          "Error de inicio de sesión:",
          error
        );

        mensajeOpinion.textContent =
          "No se pudo iniciar sesión con Google.";

      }

    }
  );

}


// ========================================
// ESTADO DEL USUARIO
// ========================================

onAuthStateChanged(
  auth,
  function (user) {

    if (!user) {

      if (usuarioOpinion) {

        usuarioOpinion.style.display =
          "block";

      }

      if (contenidoFormulario) {

        contenidoFormulario.style.display =
          "none";

      }

      return;

    }


    if (usuarioOpinion) {

      usuarioOpinion.style.display =
        "none";

    }


    if (contenidoFormulario) {

      contenidoFormulario.style.display =
        "block";

    }


    if (usuarioLogueado) {

      usuarioLogueado.textContent =
        "Hola, " +
        (user.displayName || "cliente") +
        ". Escribe tu opinión:";

    }

    mensajeOpinion.textContent =
      "";

  }
);


// ========================================
// CONTADOR DE CARACTERES
// ========================================

if (textoOpinion) {

  textoOpinion.addEventListener(
    "input",
    function () {

      contadorOpinion.textContent =
        textoOpinion.value.length;

    }
  );

}


// ========================================
// ENVIAR OPINIÓN
// ========================================

if (btnEnviarOpinion) {

  btnEnviarOpinion.addEventListener(
    "click",
    async function () {

      const user =
        auth.currentUser;

      if (!user) {

        mensajeOpinion.textContent =
          "Debes iniciar sesión con Google.";

        return;

      }


      const comentario =
        textoOpinion.value.trim();


      if (!comentario) {

        mensajeOpinion.textContent =
          "Escribe tu opinión antes de enviarla.";

        textoOpinion.focus();

        return;

      }


      if (comentario.length < 10) {

        mensajeOpinion.textContent =
          "Tu opinión debe tener al menos 10 caracteres.";

        textoOpinion.focus();

        return;

      }


      if (comentario.length > 500) {

        mensajeOpinion.textContent =
          "La opinión no puede superar los 500 caracteres.";

        return;

      }


      btnEnviarOpinion.disabled =
        true;

      btnEnviarOpinion.textContent =
        "Enviando...";


      try {

        await addDoc(
          collection(db, "opiniones"),
          {

            nombre:
              user.displayName ||
              "Cliente",

            comentario:
              comentario,

            uid:
              user.uid,

            aprobada:
              false,

            fecha:
              serverTimestamp()

          }
        );


        textoOpinion.value =
          "";

        contadorOpinion.textContent =
          "0";


        mensajeOpinion.textContent =
          "¡Gracias por tu opinión! Será revisada antes de publicarse.";


        btnEnviarOpinion.textContent =
          "Opinión enviada";


        setTimeout(
          function () {

            formulario.style.display =
              "none";

            btnEnviarOpinion.disabled =
              false;

            btnEnviarOpinion.textContent =
              "Publicar mi opinión";

            mensajeOpinion.textContent =
              "";

          },
          3500
        );


      } catch (error) {

        console.error(
          "Error al guardar opinión:",
          error
        );

        mensajeOpinion.textContent =
          "No se pudo enviar tu opinión. Inténtalo nuevamente.";

        btnEnviarOpinion.disabled =
          false;

        btnEnviarOpinion.textContent =
          "Publicar mi opinión";

      }

    }
  );

}


// ========================================
// CERRAR FORMULARIO
// ========================================

if (btnCerrarOpinion) {

  btnCerrarOpinion.addEventListener(
    "click",
    function () {

      formulario.style.display =
        "none";

    }
  );

}


// ========================================
// CARGAR OPINIONES AL INICIAR
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    cargarOpiniones();

  }
);


// ========================================
// CARRUSEL AUTOMÁTICO
// ========================================

setInterval(
  function () {

    if (!slider) return;

    const maxScroll =
      slider.scrollWidth -
      slider.clientWidth;


    if (
      slider.scrollLeft >=
      maxScroll - 10
    ) {

      slider.scrollTo({
        left: 0,
        behavior: "smooth"
      });

    } else {

      slider.scrollBy({
        left: 280,
        behavior: "smooth"
      });

    }

  },
  4000
);
