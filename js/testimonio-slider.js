// ========================================
// TESTIMONIOS - DULCE ENCANTO
// ETAPA 2: INICIO DE SESIÓN CON GOOGLE
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

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const provider =
  new GoogleAuthProvider();


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

    const mensajeOpinion =
      document.getElementById(
        "mensaje-opinion"
      );


    console.log(
      "Botón opinión:",
      botonDejarOpinion
    );

    console.log(
      "Formulario:",
      formulario
    );

    console.log(
      "Botón Google:",
      botonGoogle
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

          console.log(
            "✅ BOTÓN DEJAR OPINIÓN PRESIONADO"
          );

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


            // ==============================
            // OCULTAR LOGIN
            // ==============================

            if (usuarioOpinion) {

              usuarioOpinion.style.display =
                "none";

            }


            // ==============================
            // MOSTRAR FORMULARIO
            // ==============================

            if (formularioContenido) {

              formularioContenido.style.display =
                "block";

            }


            // ==============================
            // MOSTRAR NOMBRE
            // ==============================

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


            if (
              mensajeOpinion
            ) {

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
    // DETECTAR ESTADO DE AUTENTICACIÓN
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
