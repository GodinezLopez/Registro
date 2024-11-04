document.getElementById("exportar").addEventListener("click", async function (event) {
    event.preventDefault(); // Evita el comportamiento por defecto del botón

    // Obtener el historial desde localStorage
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const nombreUsuario = localStorage.getItem("nombreUsuario") || "Usuario"; // Obtener nombre del usuario guardado

    // Verifica si hay datos en el historial
    if (historial.length === 0) {
        noH(); // Mostrar alerta de error
        return; // Detener aquí para evitar la descarga
    }

    // Confirmar la exportación con el usuario
    const result = await Swal.fire({
        title: `Hola, ${nombreUsuario}`,
        text: "¿Deseas exportar el archivo?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    });

    // Solo proceder si el usuario confirma
    if (result.isConfirmed) {
        // Descargar archivo solo si el usuario acepta
        await descargarArchivo(historial, nombreUsuario);
    } else {
        // Mensaje de cancelación
        Swal.fire("Exportación cancelada.");
    }
});

// Función para descargar el archivo
async function descargarArchivo(historial, nombreUsuario) {
    return new Promise((resolve) => {
        // Crear un arreglo para los datos a exportar
        const datos = historial.map(registro => ({
            'Fecha': registro.fecha,
            'Entrada': registro.entrada,
            'Salida': registro.salida || 'N/A' // Usar 'N/A' si no hay salida
        }));

        // Crear un libro de trabajo de Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(datos);

        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, "Registro");

        // Generar el archivo Excel y descargarlo
        XLSX.writeFile(wb, "Registro.xlsx");

        // Llamar a la función de éxito
        succ(nombreUsuario);
        resolve(); // Resolvemos la promesa
    });
}

// Función para mostrar alerta de historial vacío
function noH() {
    Swal.fire({
        title: "No Hay Datos",
        text: "No hay datos en tu historial",
        icon: "error"
    });
}

// Función para mostrar alerta de éxito en la descarga
function succ(nombreUsuario) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Hola, ${nombreUsuario}. El archivo se descargó correctamente.`,
        showConfirmButton: false,
        timer: 1500
    });
}