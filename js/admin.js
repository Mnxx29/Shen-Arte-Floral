// ============================================================
//  admin.js  –  Lógica de administración (CRUD) para Pedidos
// ============================================================

// CONFIGURACIÓN DE FIREBASE
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

// Referencias a elementos del DOM
let pedidoIdSeleccionado = null;
let modalEditar = null;
let modalEliminar = null;

$(document).ready(function () {
    // Inicializar modales de Bootstrap
    modalEditar = new bootstrap.Modal(document.getElementById('modalEditarPedido'));
    modalEliminar = new bootstrap.Modal(document.getElementById('modalConfirmarEliminar'));

    // Cargar y escuchar pedidos en tiempo real
    escucharPedidos();

    // Evento al guardar la edición de un pedido
    $("#btnGuardarEdicion").on("click", guardarEdicion);

    // Evento al confirmar la eliminación de un pedido
    $("#btnConfirmarEliminar").on("click", ejecutarEliminacion);
});

// ============================================================
//  READ: Escuchar la colección de pedidos en tiempo real
// ============================================================
function escucharPedidos() {
    const $tablaCuerpo = $("#tablaPedidosCuerpo");
    const $cargandoSpinner = $("#cargandoSpinner");

    // onSnapshot mantiene los datos actualizados en tiempo real si hay cambios en Firebase
    db.collection("pedidos").orderBy("fechaCreacion", "desc").onSnapshot(function (querySnapshot) {
        $tablaCuerpo.empty();
        $cargandoSpinner.addClass("d-none");

        if (querySnapshot.empty) {
            $tablaCuerpo.append(`
                <tr>
                    <td colspan="9" class="text-center text-muted py-4">
                        No hay pedidos registrados en el sistema.
                    </td>
                </tr>
            `);
            return;
        }

        querySnapshot.forEach(function (doc) {
            const pedido = doc.data();
            const id = doc.id;

            // Formatear fecha
            let fechaFormateada = "Sin fecha";
            if (pedido.fechaCreacion) {
                const date = pedido.fechaCreacion.toDate();
                fechaFormateada = date.toLocaleDateString("es-CL") + " " + date.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' });
            }

            // Crear fila de la tabla
            const filaHtml = `
                <tr>
                    <td class="align-middle fw-bold">${pedido.nombre} ${pedido.apellido}</td>
                    <td class="align-middle">${pedido.rut || '-'}</td>
                    <td class="align-middle">${pedido.email}</td>
                    <td class="align-middle">${pedido.telefono}</td>
                    <td class="align-middle">${pedido.tipoArreglo}</td>
                    <td class="align-middle text-center">${pedido.cantidad}</td>
                    <td class="align-middle">${pedido.fechaEntrega}</td>
                    <td class="align-middle">${fechaFormateada}</td>
                    <td class="align-middle text-center">
                        <div class="btn-group gap-2" role="group">
                            <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="prepararEdicion('${id}')">
                                ✏️ Editar
                            </button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="prepararEliminacion('${id}')">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            $tablaCuerpo.append(filaHtml);
        });
    }, function (error) {
        console.error("Error al escuchar pedidos: ", error);
        $cargandoSpinner.addClass("d-none");
        $tablaCuerpo.append(`
            <tr>
                <td colspan="9" class="text-center text-danger py-4">
                    Error al cargar los pedidos. Por favor, revisa la consola de desarrollador.
                </td>
            </tr>
        `);
    });
}

// ============================================================
//  UPDATE: Cargar datos en el modal de edición
// ============================================================
window.prepararEdicion = function (id) {
    pedidoIdSeleccionado = id;

    // Obtener datos del pedido
    db.collection("pedidos").doc(id).get()
        .then(function (doc) {
            if (doc.exists) {
                const pedido = doc.data();

                // Rellenar campos del formulario en el modal
                $("#editNombre").val(pedido.nombre);
                $("#editApellido").val(pedido.apellido);
                $("#editRut").val(pedido.rut);
                $("#editEmail").val(pedido.email);
                $("#editTelefono").val(pedido.telefono);
                $("#editCiudad").val(pedido.ciudad);
                $("#editDireccion").val(pedido.direccion);
                $("#editOcasion").val(pedido.ocasion);
                $("#editTipoArreglo").val(pedido.tipoArreglo);
                $("#editCantidad").val(pedido.cantidad);
                $("#editFechaEntrega").val(pedido.fechaEntrega);
                $("#editModalidadEntrega").val(pedido.modalidadEntrega);
                $("#editDedicatoria").val(pedido.dedicatoria || "");
                $("#editObservaciones").val(pedido.observaciones || "");

                // Mostrar el modal
                modalEditar.show();
            } else {
                alert("El pedido no existe.");
            }
        })
        .catch(function (error) {
            console.error("Error al obtener el pedido para editar: ", error);
            alert("Error al cargar los datos del pedido.");
        });
};

function guardarEdicion() {
    if (!pedidoIdSeleccionado) return;

    // Obtener valores modificados
    const datosActualizados = {
        nombre: $("#editNombre").val().trim(),
        apellido: $("#editApellido").val().trim(),
        rut: $("#editRut").val().trim(),
        email: $("#editEmail").val().trim(),
        telefono: $("#editTelefono").val().trim(),
        ciudad: $("#editCiudad").val().trim(),
        direccion: $("#editDireccion").val().trim(),
        ocasion: $("#editOcasion").val(),
        tipoArreglo: $("#editTipoArreglo").val(),
        cantidad: parseInt($("#editCantidad").val()) || 1,
        fechaEntrega: $("#editFechaEntrega").val(),
        modalidadEntrega: $("#editModalidadEntrega").val(),
        dedicatoria: $("#editDedicatoria").val().trim(),
        observaciones: $("#editObservaciones").val().trim()
    };

    // Validaciones básicas antes de enviar
    if (!datosActualizados.nombre || !datosActualizados.apellido || !datosActualizados.email || !datosActualizados.telefono || !datosActualizados.direccion) {
        alert("Por favor, rellene los campos obligatorios del pedido.");
        return;
    }

    $("#btnGuardarEdicion").prop("disabled", true).text("Guardando...");

    // Actualizar documento en Firestore
    db.collection("pedidos").doc(pedidoIdSeleccionado).update(datosActualizados)
        .then(function () {
            modalEditar.hide();
            $("#btnGuardarEdicion").prop("disabled", false).text("Guardar Cambios");
            pedidoIdSeleccionado = null;
        })
        .catch(function (error) {
            console.error("Error al actualizar el pedido: ", error);
            alert("Error al actualizar el pedido: " + error.message);
            $("#btnGuardarEdicion").prop("disabled", false).text("Guardar Cambios");
        });
}

// ============================================================
//  DELETE: Configurar eliminación de pedido
// ============================================================
window.prepararEliminacion = function (id) {
    pedidoIdSeleccionado = id;
    modalEliminar.show();
};

function ejecutarEliminacion() {
    if (!pedidoIdSeleccionado) return;

    $("#btnConfirmarEliminar").prop("disabled", true).text("Eliminando...");

    // Eliminar documento de Firestore
    db.collection("pedidos").doc(pedidoIdSeleccionado).delete()
        .then(function () {
            modalEliminar.hide();
            $("#btnConfirmarEliminar").prop("disabled", false).text("Eliminar");
            pedidoIdSeleccionado = null;
        })
        .catch(function (error) {
            console.error("Error al eliminar el pedido: ", error);
            alert("Error al eliminar el pedido: " + error.message);
            $("#btnConfirmarEliminar").prop("disabled", false).text("Eliminar");
        });
}
