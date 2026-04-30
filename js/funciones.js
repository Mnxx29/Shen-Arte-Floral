// IMPORTANTE:
//  Función auxiliar para validar el RUT basado en el algoritmo de módulo 11
function validarRut(rut) {
    if (rut == "") return false;
    rut = rut.replace(/\./g, "").toUpperCase();
    if (rut.indexOf("-") == -1) return false;
    var partes = rut.split("-");
    var cuerpo = partes[0];
    var dvIngresado = partes[1];
    var suma = 0;
    var multiplicador = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) {
        suma = suma + (cuerpo.charAt(i) * multiplicador);
        multiplicador = multiplicador + 1;
        if (multiplicador > 7) multiplicador = 2;
    }
    var resto = suma % 11;
    var resultado = 11 - resto;
    var dvEsperado = "";
    if (resultado == 11) dvEsperado = "0";
    else if (resultado == 10) dvEsperado = "K";
    else dvEsperado = resultado.toString();

    if (dvEsperado == dvIngresado) return true;
    else return false;
}

// Evento blur para validación instantánea
window.onload = function () {
    var campoRut = document.getElementById("rut");
    if (campoRut) {
        campoRut.addEventListener('blur', function () {
            var valor = campoRut.value;
            if (valor != "") {
                if (validarRut(valor) == false) {
                    alert("Atención: El RUT que acabas de escribir no es válido.");
                    campoRut.style.borderColor = "red";
                } else {
                    campoRut.style.borderColor = "green";
                }
            } else {
                campoRut.style.borderColor = "";
            }
        });
    }
}

function enviarFormulario() {
    // Obtener los valores de los elementos
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var rut = document.getElementById("rut").value;
    var email = document.getElementById("email").value;
    var telefono = document.getElementById("telefono").value;
    var campus = document.getElementById("campus").value;
    var radio1 = document.getElementById("inlineRadio1").checked;
    var radio2 = document.getElementById("inlineRadio2").checked;
    var cajatexto = document.getElementById("cajatexto").value;

    // Validar nombre
    if (nombre == "") {
        alert("Por favor, debe ingresar un nombre.");
        return;
    }

    // Validar apellido
    if (apellido == "") {
        alert("Por favor, debe ingresar un apellido.");
        return;
    }

    // Validar rut vacío
    if (rut == "") {
        alert("Por favor, debe ingresar su rut.");
        return;
    }

    // Validar rut matemáticamente
    if (validarRut(rut) == false) {
        alert("El RUT ingresado no es válido. Recuerda incluir el guión (Ej: 12345678-9).");
        return;
    }

    // Validar email
    if (email == "") {
        alert("Por favor, debe ingresar su correo electrónico.");
        return;
    }

    // Validar telefono
    if (telefono == "") {
        alert("Por favor, debe ingresar su teléfono.");
        return;
    }

    // Validar select (tipos de arreglo)
    if (campus == "Seleccione una opción") {
        alert("Por favor, seleccione un tipo de arreglo florar.");
        return;
    }

    // Validar radios (serenata)
    if (radio1 == false && radio2 == false) {
        alert("Por favor, debe seleccionar si incluye serenata o no.");
        return;
    }

    // Validar caja de texto (mas informacion)
    if (cajatexto == "") {
        alert("Por favor, debe darnos más información.");
        return;
    }

    // Si pasa todas las validaciones
    alert("¡Formulario enviado con éxito! Nos contactaremos pronto.");
}
