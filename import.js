// Abrir el explorador de archivos al hacer clic en el botón importar
document.getElementById("importar").addEventListener("click", function() {
    document.getElementById("archivo").click(); // Simular el clic en el input oculto
});

// Manejar la importación de datos
document.getElementById("archivo").addEventListener("change", function() {
    const archivo = this.files[0]; // Obtener el archivo seleccionado

    if (!archivo) {
        alert("Por favor, selecciona un archivo para importar.");
        return;
    }

    // Verificar la extensión del archivo
    const extensionesPermitidas = ['.xls', '.xlsx'];
    const extensionArchivo = archivo.name.substring(archivo.name.lastIndexOf('.'));

    if (!extensionesPermitidas.includes(extensionArchivo)) {
        Swal.fire({
            icon: 'error',
            title: 'Archivo no compatible',
            text: 'Por favor, selecciona un archivo de Excel (.xls o .xlsx).'
        });
        return; 
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const primeraHoja = workbook.Sheets[workbook.SheetNames[0]];
        const jsonDatos = XLSX.utils.sheet_to_json(primeraHoja, { header: 1 });

        // Procesar los datos importados y guardarlos en localStorage
        const historial = jsonDatos.slice(1).map(fila => ({
            fecha: fila[0],
            entrada: fila[1],
            salida: fila[2]
        }));

        localStorage.setItem('historial', JSON.stringify(historial));
        success1();
        setTimeout(function() {
            location.reload();
        }, 1800);
    };

    reader.readAsArrayBuffer(archivo); // Leer el archivo como un ArrayBuffer
});

// Función para mostrar alerta de éxito en la importación
function success1() {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Los datos se importaron correctamente",
        showConfirmButton: false,
        timer: 1500
    });
}
