// ========================================
// TESTIMONIOS + FIREBASE
// DULCE ENCANTO
// ========================================


// ========================================
// IMPORTAR FIREBASE
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
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
// VARIABLES FIREBASE
// ========================================

let app = null;
let auth = null;
let db = null;
let provider = null;


// ========================================
// ELEMENTOS DE LA PÁGINA
// ========================================

let slider;
let botonDejarOpinion;
let formulario;
let botonGoogle;
let usuarioOpinion;
let formularioContenido;
let usuarioLogueado;
let textoOpinion;
let contadorOpinion;
let botonEnviar;
let botonCerrar;
let mensajeOpinion;


// ========================================
// INICIALIZAR INTERFAZ
// ========================================

function inicializarInterfaz() {

  slider =
    document.getElementById("testimonios-slider");

  botonDejarOpinion =
    document.getElementById("btn-dejar-opinion");

  formulario =
    document.getElementById("formulario-opinion");

  botonGoogle =
    document.getElementById("btn-google-login");

  usuarioOpinion =
    document.getElementById("usuario-opinion");

  formularioContenido =
    document.getElementById("form-opinion-contenido");

  usuarioLogueado =
    document.getElementById("usuario-logueado");

  textoOpinion =
    document.getElementById("texto-opinion");

  contadorOpinion =
    document.getElementById("contador-opinion");

  botonEnviar =
    document.getElementById("btn-enviar-opinion");

  botonCerrar =
    document.getElementById("btn-cerrar-opinion");

  mensajeOpinion =
    document.getElementById("mensaje-opinion");


  // ========================================
  // BOTÓN DEJAR OPINIÓN
  // ========================================

  if (botonDejarOpinion) {

    botonDejarOpinion.addEventListener(
      "click",
      function () {

        if (!formulario) {
          console.error(
            "No se encontró el formulario de opiniones."
          );
          return;
        }

        formulario.style.display = "block";

        formulario.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }
    );

  }


  // ========================================
  // BOTÓN CERRAR
  // ========================================

  if (botonCerrar) {

    botonCerrar.addEventListener(
      "click",
      function () {

        formulario.style.display = "none";

      }
    );

  }


  // ========================================
  // CONTADOR DE CARACTERES
  // ========================================

  if (textoOpinion) {

    textoOpinion.addEventListener(
      "input",
      function () {

        if (contadorOpinion) {

          contadorOpinion.textContent =
            textoOpinion.value.length;

        }

      }
    );

  }

}


// ========================================
// INICIALIZAR FIREBASE
// ========================================

function inicializarFirebase() {

  try {

    app =
      initializeApp(firebaseConfig);

    auth =
      getAuth(app);

    db =
      getFirestore(app);

    provider =
      new GoogleAuthProvider();

    console.log(
      "Firebase inicializado correctamente."
    );

    configurarAutenticacion();

    configurarLoginGoogle();

    configurarEnvioOpinion();

    cargarOpiniones();

  } catch (error) {

    console.error(
      "Error al inicializar Firebase:",
      error
    );

    if (mensajeOpinion) {

      mensajeOpinion.textContent =
        "El sistema de opiniones no está disponible temporalmente.";

    }

  }

}


// ========================================
// INICIO DE SESIÓN CON GOOGLE
// ========================================

function configurarLoginGoogle() {

  if (!botonGoogle) return;

  botonGoogle.addEventListener(
    "click",
    async function () {

      if (!auth) {

        mensajeOpinion.textContent =
          "El sistema de inicio de sesión no está disponible.";

        return;

      }

      botonGoogle.disabled = true;

      botonGoogle.textContent =
        "Conectando con Google...";


      try {

        await signInWithPopup(
          auth,
          provider
        );

      } catch (error) {

        console.error(
          "Error al iniciar sesión con Google:",
          error
        );

        if (
          error.code ===
          "auth/popup-closed-by-user"
        ) {

          mensajeOpinion.textContent =
            "El inicio de sesión fue cancelado.";

        } else {

          mensajeOpinion.textContent =
            "No se pudo iniciar sesión con Google.";

        }

      } finally {

        botonGoogle.disabled = false;

        botonGoogle.textContent =
          "🔐 Iniciar sesión con Google";

      }

    }
  );

}


// ========================================
// ESTADO DE AUTENTICACIÓN
// ========================================

function configurarAutenticacion() {

  if (!auth) return;

  onAuthStateChanged(
    auth,
    function (user) {

      if (!user) {

        if (usuarioOpinion) {

          usuarioOpinion.style.display =
            "block";

        }

        if (formularioContenido) {

          formularioContenido.style.display =
            "none";

        }

        return;

      }


      // USUARIO AUTENTICADO

      if (usuarioOpinion) {

        usuarioOpinion.style.display =
          "none";

      }

      if (formularioContenido) {

        formularioContenido.style.display =
          "block";

      }

      if (usuarioLogueado) {

        usuarioLogueado.textContent =
          "Hola, " +
          (
            user.displayName ||
            "cliente"
          ) +
          ". Escribe tu opinión:";

      }

      if (mensajeOpinion) {

        mensajeOpinion.textContent =
          "";

      }

    }
  );

}


// ========================================
// CARGAR OPINIONES APROBADAS
// ========================================

async function cargarOpiniones() {

  if (!slider || !db) return;


  slider.innerHTML = `
    <div class="testimonio cargando-opiniones">
      <p>Cargando opiniones...</p>
    </div>
  `;


  try {

    const opinionesRef =
      collection(
        db,
        "opiniones"
      );


    const consulta =
      query(
        opinionesRef,

        where(
          "aprobada",
          "==",
          true
        ),

        orderBy(
          "fecha",
          "desc"
        ),

        limit(7)
      );


    const resultado =
      await getDocs(
        consulta
      );


    slider.innerHTML =
      "";


    // ====================================
    // SIN OPINIONES
    // ====================================

    if (resultado.empty) {

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


    // ====================================
    // MOSTRAR OPINIONES
    // ====================================

    resultado.forEach(
      function (documento) {

        const opinion =
          documento.data();


        const tarjeta =
          document.createElement(
            "div"
          );


        tarjeta.className =
          "testimonio";


        const estrellas =
          document.createElement(
            "div"
          );

        estrellas.className =
          "stars";

        estrellas.innerHTML =
          "&#9733;&#9733;&#9733;&#9733;&#9733;";


        const comentario =
          document.createElement(
            "p"
          );

        comentario.textContent =
          "“" +
          (
            opinion.comentario ||
            ""
          ) +
          "”";


        const autor =
          document.createElement(
            "span"
          );

        autor.textContent =
          opinion.nombre ||
          "Cliente";


        tarjeta.appendChild(
          estrellas
        );

        tarjeta.appendChild(
          comentario
        );

        tarjeta.appendChild(
          autor
        );


        slider.appendChild(
          tarjeta
        );

      }
    );


  } catch (error) {

    console.error(
      "Error al cargar opiniones:",
      error
    );


    slider.innerHTML = `
      <div class="testimonio cargando-opiniones">

        <p>
          Las opiniones estarán disponibles próximamente.
        </p>

      </div>
    `;


    // Mostrar información del índice
    if (
      error.message &&
      error.message.includes(
        "index"
      )
    ) {

      console.warn(
        "Firestore necesita crear un índice compuesto para aprobada y fecha."
      );

    }

  }

}


// ========================================
// ENVIAR OPINIÓN
// ========================================

function configurarEnvioOpinion() {

  if (!botonEnviar) return;


  botonEnviar.addEventListener(
    "click",
    async function () {

      if (!auth) {

        mensajeOpinion.textContent =
          "El sistema de opiniones no está disponible.";

        return;

      }


      const usuario =
        auth.currentUser;


      // ==================================
      // COMPROBAR LOGIN
      // ==================================

      if (!usuario) {

        mensajeOpinion.textContent =
          "Debes iniciar sesión con Google.";

        return;

      }


      // ==================================
      // OBTENER TEXTO
      // ==================================

      const comentario =
        textoOpinion.value.trim();


      // ==================================
      // VALIDACIONES
      // ==================================

      if (!comentario) {

        mensajeOpinion.textContent =
          "Escribe tu opinión antes de enviarla.";

        textoOpinion.focus();

        return;

      }


      if (
        comentario.length <
        10
      ) {

        mensajeOpinion.textContent =
          "Tu opinión debe tener al menos 10 caracteres.";

        textoOpinion.focus();

        return;

      }


      if (
        comentario.length >
        500
      ) {

        mensajeOpinion.textContent =
          "Tu opinión no puede superar los 500 caracteres.";

        return;

      }


      // ==================================
      // DESACTIVAR BOTÓN
      // ==================================

      botonEnviar.disabled =
        true;

      botonEnviar.textContent =
        "Enviando...";


      try {

        await addDoc(
          collection(
            db,
            "opiniones"
          ),
          {

            nombre:
              usuario.displayName ||
              "Cliente",

            comentario:
              comentario,

            uid:
              usuario.uid,

            aprobada:
              false,

            fecha:
              serverTimestamp()

          }
        );


        // ==================================
        // LIMPIAR
        // ==================================

        textoOpinion.value =
          "";

        contadorOpinion.textContent =
          "0";


        mensajeOpinion.textContent =
          "¡Gracias! Tu opinión fue enviada y será revisada antes de publicarse.";


        botonEnviar.textContent =
          "Opinión enviada";


        // ==================================
        // CERRAR FORMULARIO
        // ==================================

        setTimeout(
          function () {

            formulario.style.display =
              "none";

            botonEnviar.disabled =
              false;

            botonEnviar.textContent =
              "Publicar mi opinión";

            mensajeOpinion.textContent =
              "";

          },
          3500
        );


      } catch (error) {

        console.error(
          "Error al guardar la opinión:",
          error
        );


        mensajeOpinion.textContent =
          "No se pudo enviar la opinión. Inténtalo nuevamente.";


        botonEnviar.disabled =
          false;

        botonEnviar.textContent =
          "Publicar mi opinión";

      }

    }
  );

}


// ========================================
// CARRUSEL AUTOMÁTICO
// ========================================

function iniciarCarrusel() {

  setInterval(
    function () {

      if (!slider) return;


      const maxScroll =
        slider.scrollWidth -
        slider.clientWidth;


      // Si llegó al final
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

}


// ========================================
// INICIO PRINCIPAL
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    // Primero inicializar la interfaz
    // para que el botón funcione
    // independientemente de Firebase.

    inicializarInterfaz();

    // Iniciar carrusel

    iniciarCarrusel();

    // Inicializar Firebase

    inicializarFirebase();

  }
);
