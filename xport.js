document.getElementById("exportar").addEventListener("click", function() {
    // Mostrar SweetAlert para confirmar la exportación
   
        if (result.isConfirmed) {  // Verificar si el usuario hizo clic en "Aceptar"
            // Obtener el historial desde localStorage
            const historial = JSON.parse(localStorage.getItem('historial')) || [];
            
            // Crear un arreglo para los datos a exportar
            const datos = [];

            // Recorrer el historial y organizar en el formato adecuado
            historial.forEach(registro => {
                datos.push({
                    'Fecha': registro.fecha,
                    'Entrada': registro.entrada,
                    'Salida': registro.salida || 'N/A' // Usar 'N/A' si no hay salida
                });
            });

            // Crear un libro de trabajo de Excel
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(datos);

            // Agregar la hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, "Registro");

            // Generar el archivo Excel y descargarlo
            XLSX.writeFile(wb, "Registro.xlsx");
        } else {
            // Mensaje de cancelación (opcional)
            Swal.fire("Exportación cancelada.");
        }
});
