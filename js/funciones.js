// ============================================================
//  funciones.js  –  Validación con jQuery y Firebase
// ============================================================

// ============================================================
//  CONFIGURACIÓN DE FIREBASE (Reemplaza con tus credenciales)
// ============================================================
const firebaseConfig = {
    apiKey: "AIzaSyB1oAS1V5B5I3EGOJZgprwngYUtDA_x_OM",
    authDomain: "shen-arte-floral.firebaseapp.com",
    projectId: "shen-arte-floral",
    storageBucket: "shen-arte-floral.firebasestorage.app",
    messagingSenderId: "48052446837",
    appId: "1:48052446837:web:e071259b8183dc6dcbba3c",
    measurementId: "G-XQHMS8EQSF"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// Función auxiliar para validar el RUT chileno (módulo 11)
function validarRut(rut) {
    if (rut === "") return false;
    rut = rut.replace(/\./g, "").toUpperCase();
    if (rut.indexOf("-") === -1) return false;
    var partes = rut.split("-");
    var cuerpo = partes[0];
    var dvIngresado = partes[1];
    var suma = 0;
    var multiplicador = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) {
        suma += cuerpo.charAt(i) * multiplicador;
        multiplicador = (multiplicador >= 7) ? 2 : multiplicador + 1;
    }
    var resto = suma % 11;
    var resultado = 11 - resto;
    var dvEsperado = resultado === 11 ? "0" : resultado === 10 ? "K" : resultado.toString();
    return dvEsperado === dvIngresado;
}

// Función para validar teléfono chileno
function validarTelefono(telefono) {
    telefono = telefono.replace(/\s+/g, "");

    // Acepta:
    // +56912345678
    // 912345678
    var regex = /^(\+56)?9\d{8}$/;

    return regex.test(telefono);
}

// Muestra un mensaje de error debajo del campo
function mostrarError($campo, mensaje) {
    $campo.addClass("is-invalid").removeClass("is-valid");
    var $feedback = $campo.siblings(".form-error-msg");
    if ($feedback.length === 0) {
        $campo.after('<span class="form-error-msg text-danger small mt-1 d-block"></span>');
        $feedback = $campo.siblings(".form-error-msg");
    }
    $feedback.text("Debe rellenar " + mensaje);
}

// Limpia el error de un campo
function limpiarError($campo) {
    $campo.removeClass("is-invalid").addClass("is-valid");
    $campo.siblings(".form-error-msg").text("");
}

// ============================================================
$(document).ready(function () {

    // --- Validación en tiempo real (blur) ---

    // RUT: validación extra de formato
    $("#rut").on("blur", function () {
        var val = $(this).val().trim();
        if (val === "") {
            mostrarError($(this), "su RUT");
        } else if (!validarRut(val)) {
            $(this).addClass("is-invalid").removeClass("is-valid");
            var $fb = $(this).siblings(".form-error-msg");
            if ($fb.length === 0) {
                $(this).after('<span class="form-error-msg text-danger small mt-1 d-block"></span>');
                $fb = $(this).siblings(".form-error-msg");
            }
            $fb.text("El RUT no es válido. Formato: 12345678-9");
        } else {
            limpiarError($(this));
        }
    });

    // Campos de texto simples
    $("#nombre, #apellido, #email, #ciudad, #direccion, #cantidad, #fechaEntrega").on("blur", function () {
    if ($(this).val().trim() === "") {
        var etiqueta = $(this).prev("label").text().replace("*", "").trim().toLowerCase();
        mostrarError($(this), etiqueta);
    } else {
        limpiarError($(this));
    }
});

// Validación teléfono
$("#telefono").on("blur", function () {
    var telefono = $(this).val().trim();

    if (telefono === "") {
        mostrarError($(this), "su teléfono");
    } else if (!validarTelefono(telefono)) {
        $(this).addClass("is-invalid").removeClass("is-valid");

        var $fb = $(this).siblings(".form-error-msg");

        if ($fb.length === 0) {
            $(this).after('<span class="form-error-msg text-danger small mt-1 d-block"></span>');
            $fb = $(this).siblings(".form-error-msg");
        }

        $fb.text("Ingrese un teléfono válido. Ej: +56912345678");
    } else {
        limpiarError($(this));
    }
});

    // Selects
    $("#ocasion, #tipoArreglo, #modalidadEntrega").on("change", function () {
        if ($(this).val() === "") {
            var etiqueta = $(this).prev("label").text().replace("*", "").trim().toLowerCase();
            mostrarError($(this), etiqueta);
        } else {
            limpiarError($(this));
        }
    });



    // --- Envío del formulario ---
    $("#btnEnviar").on("click", function () {
        var valido = true;

        // Helper para validar campo requerido
        function requerido($campo, etiqueta) {
            if ($campo.val().trim() === "") {
                mostrarError($campo, etiqueta);
                valido = false;
            } else {
                limpiarError($campo);
            }
        }

        requerido($("#nombre"),     "su nombre");
        requerido($("#apellido"),   "su apellido");
        requerido($("#email"),      "su correo");
        requerido($("#ciudad"),     "su ciudad");
        requerido($("#direccion"),  "su dirección");
        // Teléfono
var telVal = $("#telefono").val().trim();

if (telVal === "") {
    mostrarError($("#telefono"), "su teléfono");
    valido = false;
} else if (!validarTelefono(telVal)) {

    $("#telefono").addClass("is-invalid").removeClass("is-valid");

    var $fbTel = $("#telefono").siblings(".form-error-msg");

    if ($fbTel.length === 0) {
        $("#telefono").after('<span class="form-error-msg text-danger small mt-1 d-block"></span>');
        $fbTel = $("#telefono").siblings(".form-error-msg");
    }

    $fbTel.text("Ingrese un teléfono válido. Ej: +56912345678");
    valido = false;

} else {
    limpiarError($("#telefono"));
}
        requerido($("#ocasion"),    "la ocasión");
        requerido($("#tipoArreglo"),"el tipo de arreglo");
        requerido($("#cantidad"),   "la cantidad");
        requerido($("#fechaEntrega"),"la fecha de entrega");
        requerido($("#modalidadEntrega"), "la modalidad de entrega");

        // RUT
        var rutVal = $("#rut").val().trim();
        if (rutVal === "") {
            mostrarError($("#rut"), "su RUT");
            valido = false;
        } else if (!validarRut(rutVal)) {
            $("#rut").addClass("is-invalid").removeClass("is-valid");
            var $fb = $("#rut").siblings(".form-error-msg");
            if ($fb.length === 0) {
                $("#rut").after('<span class="form-error-msg text-danger small mt-1 d-block"></span>');
                $fb = $("#rut").siblings(".form-error-msg");
            }
            $fb.text("El RUT no es válido. Formato: 12345678-9");
            valido = false;
        } else {
            limpiarError($("#rut"));
        }

        if (valido) {
            // Cambiar texto de botón para feedback visual
            var $btn = $("#btnEnviar");
            var originalText = $btn.text();
            $btn.prop("disabled", true).text("Enviando...");

            // Recopilar datos del formulario
            var datosPedido = {
                nombre: $("#nombre").val().trim(),
                apellido: $("#apellido").val().trim(),
                rut: $("#rut").val().trim(),
                empresa: $("#empresa").val().trim(),
                email: $("#email").val().trim(),
                telefono: $("#telefono").val().trim(),
                ciudad: $("#ciudad").val().trim(),
                direccion: $("#direccion").val().trim(),
                ocasion: $("#ocasion").val(),
                tipoArreglo: $("#tipoArreglo").val(),
                cantidad: parseInt($("#cantidad").val()) || 1,
                fechaEntrega: $("#fechaEntrega").val(),
                modalidadEntrega: $("#modalidadEntrega").val(),
                dedicatoria: $("#dedicatoria").val().trim(),
                observaciones: $("#observaciones").val().trim(),
                fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
            };

            // Guardar en Firestore (colección "pedidos")
            db.collection("pedidos").add(datosPedido)
                .then(function (docRef) {
                    console.log("Pedido guardado exitosamente con ID: ", docRef.id);
                    
                    // Restaurar botón
                    $btn.prop("disabled", false).text(originalText);

                    // Mostrar modal de éxito
                    var myModal = new bootstrap.Modal(document.getElementById('modalExito'));
                    myModal.show();
                    
                    // Limpiar formulario cuando el modal se oculte
                    $('#modalExito').on('hidden.bs.modal', function () {
                        $("#formPedido")[0].reset();
                        $(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
                        $(".form-error-msg").text("");
                    });
                })
                .catch(function (error) {
                    console.error("Error al guardar en Firebase: ", error);
                    $btn.prop("disabled", false).text(originalText);
                    alert("Ocurrió un error al enviar tu pedido: " + error.message + "\nPor favor, verifica la configuración de Firebase y las reglas de seguridad.");
                });
        } else {
            // Scroll al primer error
            var $primerError = $(".is-invalid").first();
            if ($primerError.length) {
                $("html, body").animate({
                    scrollTop: $primerError.offset().top - 120
                }, 400);
            }
        }
    });

    // Limpiar formulario con botón reset
    $("#btnLimpiar").on("click", function () {
        $("#formPedido")[0].reset();
        $(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
        $(".form-error-msg").text("");
        $("#mensajeExito").addClass("d-none");
    });
});
