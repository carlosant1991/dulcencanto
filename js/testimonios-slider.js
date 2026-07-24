// ========================================
// TESTIMONIOS - DULCE ENCANTO
// GOOGLE LOGIN + FIRESTORE + CARRUSEL
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
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot
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
// INICIAR FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const provider = new GoogleAuthProvider();


// ========================================
// VARIABLES DEL CARRUSEL
// ========================================

let opinionesActuales = [];

let indiceActual = 0;

let intervaloCarrusel = null;


// ========================================
// CARGAR CUANDO EL DOM ESTÉ LISTO
// ========================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    console.log(
      "✅ TESTIMONIOS JS CARGADO"
    );


    // ==================================
    // ELEMENTOS HTML
    // ==================================

    const botonDejarOpinion =
      document.getElementById(
        "btn-dejar-opinion"
      );

    const formulario =
      document.getElementById(
        "formulario-opinion"
      );

    const botonGoogle =
      document.getElementById(
        "btn-google-login"
      );

    const usuarioOpinion =
      document.getElementById(
        "usuario-opinion"
      );

    const formularioContenido =
      document.getElementById(
        "form-opinion-contenido"
      );

    const usuarioLogueado =
      document.getElementById(
        "usuario-logueado"
      );

    const textoOpinion =
      document.getElementById(
        "texto-opinion"
      );

    const contadorOpinion =
      document.getElementById(
        "contador-opinion"
      );

    const botonEnviar =
      document.getElementById(
        "btn-enviar-opinion"
      );

    const botonCerrar =
      document.getElementById(
        "btn-cerrar-opinion"
      );

    const mensajeOpinion =
      document.getElementById(
        "mensaje-opinion"
      );

    const slider =
      document.getElementById(
        "testimonios-slider"
      );


    // ==================================
    // BOTÓN DEJAR OPINIÓN
    // ==================================

    if (
      botonDejarOpinion &&
      formulario
    ) {

      botonDejarOpinion.addEventListener(
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


    // ==================================
    // INICIAR SESIÓN CON GOOGLE
    // ==================================

    if (botonGoogle) {

      botonGoogle.addEventListener(
        "click",
        async function () {

          console.log(
            "🔐 INICIANDO SESIÓN CON GOOGLE..."
          );


          botonGoogle.disabled =
            true;

          botonGoogle.textContent =
            "Conectando con Google...";


          if (mensajeOpinion) {

            mensajeOpinion.textContent =
              "";

          }


          try {

            const resultado =
              await signInWithPopup(
                auth,
                provider
              );


            const usuario =
              resultado.user;


            console.log(
              "✅ USUARIO AUTENTICADO:",
              usuario
            );


            // OCULTAR LOGIN

            if (usuarioOpinion) {

              usuarioOpinion.style.display =
                "none";

            }


            // MOSTRAR FORMULARIO

            if (formularioContenido) {

              formularioContenido.style.display =
                "block";

            }


            // MOSTRAR NOMBRE

            if (usuarioLogueado) {

              usuarioLogueado.textContent =
                "Hola, " +
                (
                  usuario.displayName ||
                  "cliente"
                ) +
                ". Escribe tu opinión:";

            }


          } catch (error) {

            console.error(
              "❌ ERROR AL INICIAR SESIÓN:",
              error
            );


            if (mensajeOpinion) {

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

            }


          } finally {

            botonGoogle.disabled =
              false;

            botonGoogle.textContent =
              "🔐 Iniciar sesión con Google";

          }

        }
      );

    }


    // ==================================
    // CONTADOR DE CARACTERES
    // ==================================

    if (
      textoOpinion &&
      contadorOpinion
    ) {

      textoOpinion.addEventListener(
        "input",
        function () {

          contadorOpinion.textContent =
            textoOpinion.value.length;

        }
      );

    }


    // ==================================
    // PUBLICAR OPINIÓN
    // ==================================

    if (botonEnviar) {

      botonEnviar.addEventListener(
        "click",
        async function () {

          console.log(
            "📝 BOTÓN PUBLICAR PRESIONADO"
          );


          const usuario =
            auth.currentUser;


          // VERIFICAR USUARIO

          if (!usuario) {

            if (mensajeOpinion) {

              mensajeOpinion.textContent =
                "Debes iniciar sesión con Google antes de publicar.";

            }

            return;

          }


          // OBTENER TEXTO

          const texto =
            textoOpinion
              ? textoOpinion.value.trim()
              : "";


          // VALIDAR TEXTO

          if (!texto) {

            if (mensajeOpinion) {

              mensajeOpinion.textContent =
                "Escribe tu opinión antes de publicarla.";

            }

            return;

          }


          if (texto.length < 10) {

            if (mensajeOpinion) {

              mensajeOpinion.textContent =
                "Tu opinión debe tener al menos 10 caracteres.";

            }

            return;

          }


          // DESACTIVAR BOTÓN

          botonEnviar.disabled =
            true;

          botonEnviar.textContent =
            "Enviando...";


          if (mensajeOpinion) {

            mensajeOpinion.textContent =
              "";

          }


          try {

            // GUARDAR EN FIRESTORE

            await addDoc(
              collection(
                db,
                "opiniones"
              ),
              {

                uid:
                  usuario.uid,

                nombre:
                  usuario.displayName ||
                  "Cliente",

                email:
                  usuario.email ||
                  "",

                foto:
                  usuario.photoURL ||
                  "",

                texto:
                  texto,

                aprobada:
                  false,

                fecha:
                  serverTimestamp()

              }
            );


            console.log(
              "✅ OPINIÓN GUARDADA CORRECTAMENTE"
            );


            // LIMPIAR

            if (textoOpinion) {

              textoOpinion.value =
                "";

            }


            if (contadorOpinion) {

              contadorOpinion.textContent =
                "0";

            }


            // MENSAJE

            if (mensajeOpinion) {

              mensajeOpinion.textContent =
                "¡Gracias por tu opinión! Ha sido enviada y será revisada antes de publicarse.";

            }


            // OCULTAR FORMULARIO

            setTimeout(
              function () {

                if (
                  formularioContenido
                ) {

                  formularioContenido.style.display =
                    "none";

                }

              },
              4000
            );


          } catch (error) {

            console.error(
              "❌ ERROR AL GUARDAR OPINIÓN:",
              error
            );


            if (mensajeOpinion) {

              mensajeOpinion.textContent =
                "No se pudo enviar tu opinión. Inténtalo nuevamente.";

            }

          } finally {

            botonEnviar.disabled =
              false;

            botonEnviar.textContent =
              "Publicar mi opinión";

          }

        }
      );

    }


    // ==================================
    // BOTÓN CANCELAR
    // ==================================

    if (botonCerrar) {

      botonCerrar.addEventListener(
        "click",
        function () {

          if (formularioContenido) {

            formularioContenido.style.display =
              "none";

          }

          if (textoOpinion) {

            textoOpinion.value =
              "";

          }

          if (contadorOpinion) {

            contadorOpinion.textContent =
              "0";

          }

          if (mensajeOpinion) {

            mensajeOpinion.textContent =
              "";

          }

        }
      );

    }


    // ==================================
    // CARRUSEL - MOSTRAR OPINIONES
    // ==================================

    function mostrarOpiniones() {

      if (!slider) {

        return;

      }


      if (
        !opinionesActuales.length
      ) {

        slider.innerHTML = `
          <div class="testimonio cargando-opiniones">
            <p>Todavía no hay opiniones publicadas.</p>
          </div>
        `;

        detenerCarrusel();

        return;

      }


      slider.innerHTML = "";


      opinionesActuales.forEach(
        function (opinion) {

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
            "★★★★★";


          const texto =
            document.createElement(
              "p"
            );


          texto.textContent =
            "“" +
            opinion.texto +
            "”";


          const autor =
            document.createElement(
              "span"
            );


          autor.textContent =
            (
              opinion.nombre ||
              "Cliente"
            );


          tarjeta.appendChild(
            estrellas
          );

          tarjeta.appendChild(
            texto
          );

          tarjeta.appendChild(
            autor
          );


          slider.appendChild(
            tarjeta
          );

        }
      );


      indiceActual = 0;


      iniciarCarrusel();

    }


    // ==================================
    // CARGAR OPINIONES APROBADAS
    // ==================================

    function cargarOpiniones() {

      if (!slider) {

        return;

      }


      slider.innerHTML = `
        <div class="testimonio cargando-opiniones">
          <p>Cargando opiniones...</p>
        </div>
      `;


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


      // ==================================
      // ACTUALIZACIÓN EN TIEMPO REAL
      // ==================================

      onSnapshot(
        consulta,

        function (snapshot) {

          opinionesActuales =
            snapshot.docs.map(
              function (doc) {

                return {

                  id:
                    doc.id,

                  ...doc.data()

                };

              }
            );


          console.log(
            "✅ OPINIONES APROBADAS:",
            opinionesActuales.length
          );


          mostrarOpiniones();

        },

        function (error) {

          console.error(
            "❌ ERROR AL CARGAR OPINIONES:",
            error
          );


          if (slider) {

            slider.innerHTML = `
              <div class="testimonio cargando-opiniones">
                <p>No se pudieron cargar las opiniones.</p>
              </div>
            `;

          }

        }
      );

    }


    // ==================================
    // INICIAR CARRUSEL AUTOMÁTICO
    // ==================================

    function iniciarCarrusel() {

      detenerCarrusel();


      if (
        !slider ||
        opinionesActuales.length <= 1
      ) {

        return;

      }


      intervaloCarrusel =
        setInterval(
          function () {

            slider.scrollBy({

              left:
                slider.clientWidth,

              behavior:
                "smooth"

            });

          },
          4000
        );

    }


    // ==================================
    // DETENER CARRUSEL
    // ==================================

    function detenerCarrusel() {

      if (
        intervaloCarrusel
      ) {

        clearInterval(
          intervaloCarrusel
        );

        intervaloCarrusel =
          null;

      }

    }


    // ==================================
    // PAUSAR AL PASAR EL RATÓN
    // ==================================

    if (slider) {

      slider.addEventListener(
        "mouseenter",
        detenerCarrusel
      );


      slider.addEventListener(
        "mouseleave",
        iniciarCarrusel
      );

    }


    // ==================================
    // CARGAR OPINIONES
    // ==================================

    cargarOpiniones();


    // ==================================
    // ESTADO DE AUTENTICACIÓN
    // ==================================

    onAuthStateChanged(
      auth,
      function (usuario) {

        if (usuario) {

          console.log(
            "👤 Usuario conectado:",
            usuario.displayName
          );

        } else {

          console.log(
            "👤 No hay usuario conectado"
          );

        }

      }
    );

  }
);
