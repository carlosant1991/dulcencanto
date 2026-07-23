console.log("✅ TESTIMONIOS JS CARGADO");

document.addEventListener("DOMContentLoaded", function () {

  console.log("✅ DOM CARGADO");

  const boton = document.getElementById("btn-dejar-opinion");

  const formulario =
    document.getElementById("formulario-opinion");

  console.log("Botón:", boton);
  console.log("Formulario:", formulario);

  if (boton && formulario) {

    boton.addEventListener("click", function () {

      console.log("✅ BOTÓN DE OPINIÓN PRESIONADO");

      formulario.style.display = "block";

      formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    });

  }

});
