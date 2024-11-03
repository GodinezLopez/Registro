window.onload = function() {
    mostrarHistorial();
    mostrarHistorial1();
};

document.addEventListener("DOMContentLoaded", () => {
    // Comprobar si ya se ingresó el tiempo de trabajo previamente
    const horasGuardadas = localStorage.getItem("horasPorDia");
    if (horasGuardadas) {
        iniciarRegistroHoras(horasGuardadas);
    }

    // Manejo del formulario de ingreso de horas
    document.getElementById("formHoras").addEventListener("submit", (e) => {
        e.preventDefault();
        const horas = document.getElementById("horasPorDia").value;

        if (!isNaN(horas) && horas > 0) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `Has ingresado ${horas} horas por día.`,
                showConfirmButton: false,
                timer: 2500
            });
            localStorage.setItem("horasPorDia", horas);
            iniciarRegistroHoras(horas);
        } else {
            alert("Por favor, ingresa un número válido de horas.");
        }
    });
});

// Función para iniciar el registro de horas
function iniciarRegistroHoras(horas) {
    document.getElementById("formularioContainer").classList.add("d-none");
    document.getElementById("contenidoPrincipal").classList.remove("d-none");

    // Actualización en tiempo real de la hora de entrada cada segundo
    setInterval(() => {
        const ahora = new Date();
        const entradaHora = ahora.toLocaleTimeString("es-MX", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        document.getElementById("entrada").value = entradaHora;

        // Actualización de la hora de salida sumando las horas ingresadas
        const salidaHora = new Date(ahora.getTime() + horas * 60 * 60 * 1000);
        const salidaFormateada = salidaHora.toLocaleTimeString("es-MX", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        document.getElementById("salida").value = salidaFormateada;
    }, 1000);
}

// Manejo del botón "Guardar Entrada"
document.getElementById("guardarEntrada").addEventListener("click", guardaEntrada);

function guardaEntrada() {
    const entradaHora = document.getElementById("entrada").value;
    const ahora = new Date();
    const opcionesFechaTexto = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = ahora.toLocaleDateString('es-MX', opcionesFechaTexto);

    Swal.fire({
        title: "Guardar Entrada",
        text: "¿Deseas guardar tu hora de entrada?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Crear objeto con los datos y guardarlos en el localStorage
            const historial = JSON.parse(localStorage.getItem('historial')) || [];
            historial.push({ fecha: fechaFormateada, entrada: entradaHora, salida: null });
            localStorage.setItem('historial', JSON.stringify(historial));

            mostrarHistorial(); // Actualizar la visualización del historial
            document.getElementById("entrada").value = ''; // Limpiar el campo de entrada
        }
    });
}

// Manejo del botón "Guardar Salida"
document.getElementById("guardarSalida").addEventListener("click", guardaSalida);

function guardaSalida() {
    const salidaHora = document.getElementById("entrada").value; // Obtiene la hora de salida
    const ahora = new Date();
    const opcionesFechaTexto = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = ahora.toLocaleDateString('es-MX', opcionesFechaTexto);

    Swal.fire({
        title: "Guardar Salida",
        text: "¿Deseas guardar tu hora de salida?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const historial = JSON.parse(localStorage.getItem('historial')) || [];
            const entradaIndex = historial.length - 1; // Obtener el último registro
            if (historial[entradaIndex]) {
                historial[entradaIndex].salida = salidaHora; // Actualizar el último registro con la hora de salida
                localStorage.setItem('historial', JSON.stringify(historial));
                mostrarHistorial(); // Actualizar la visualización del historial
                document.getElementById("entrada").value = ''; // Limpiar el campo de entrada
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No hay ninguna entrada guardada para asociar la salida.',
                });
            }
        }
    });
}

// Mostrar el historial de entradas y salidas
function mostrarHistorial() {
    const contenedorHistorial = document.getElementById("horasGuardadas");
    contenedorHistorial.innerHTML = ''; // Limpiar contenido anterior

    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    
    // Verificar si hay datos para mostrar
    if (historial.length === 0) {
        contenedorHistorial.style.display = "none"; // Ocultar contenedor si no hay datos
        return; // No mostrar contenedor si no hay datos
    } else {
        contenedorHistorial.style.display = "block"; // Mostrar contenedor si hay datos
    }

    historial.forEach((registro, index) => {
        const histoDiv = document.createElement('div');
        histoDiv.className = 'histo';
        histoDiv.innerHTML = `
            <div class="fecha">
                <div id="fechaguardada">${registro.fecha}</div>
                <div id="horasGuardadas">ENTRADA: ${registro.entrada} ${registro.salida ? 'SALIDA: ' + registro.salida : ''}</div>
            </div>
            <div class="borr">
                <button id="borrarES_${index}" title="borrar" onclick="borrarRegistro(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        contenedorHistorial.appendChild(histoDiv);
    });
}

// Función para borrar un registro
function borrarRegistro(index) {
    Swal.fire({
        title: "BORRAR DATO!!",
        text: "¿Estás seguro de borrar este dato? No se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, Aceptar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const historial = JSON.parse(localStorage.getItem('historial')) || [];
            historial.splice(index, 1); // Eliminar el registro
            localStorage.setItem('historial', JSON.stringify(historial));
            mostrarHistorial(); // Actualizar la visualización del historial

            Swal.fire(
                "Borrado!",
                "Dato borrado exitosamente.",
                "success"
            ).then(() => {
                location.reload(); // Reiniciar la página después de que el usuario cierre la alerta
            });
        }
    });
}

// Manejo del botón "Borrar Todos los Datos"
document.getElementById("borrarDatos").addEventListener("click", () => {
    Swal.fire({
        title: "Borrar Todos los Datos",
        text: "¿Estás seguro de que deseas borrar todos los datos guardados? Esto no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, borrar todo",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear(); // Borrar todos los datos de localStorage
            mostrarHistorial(); // Limpiar el contenedor de horas guardadas
            Swal.fire(
                "Borrado!",
                "Todos los datos han sido borrados.",
                "success"
            ).then(() => {
                location.reload(); // Reiniciar la página después de que el usuario cierre la alerta
            });
        }
    });
});

function mostrarHistorial1() {
    const contenedorHistorial = document.getElementById("historialContenedor");
    contenedorHistorial.innerHTML = ''; // Limpiar contenido anterior

    const historial = JSON.parse(localStorage.getItem('historial')) || [];

    // Verificar si hay datos para mostrar
    if (historial.length === 0) {
        contenedorHistorial.style.display = "none"; // Ocultar contenedor si no hay datos
        return; // No mostrar contenedor si no hay datos
    } else {
        contenedorHistorial.style.display = "block"; // Mostrar contenedor si hay datos
    }

    let totalMinutos = 0; // Variable para acumular el total de minutos trabajados

    historial.forEach((registro) => {
        // Crear un nuevo div para cada registro
        const fecRegistroDiv = document.createElement('div');
        fecRegistroDiv.className = 'fec'; // Clase opcional para cada registro
        fecRegistroDiv.innerHTML = `
            <div id="fecha">${registro.fecha}</div>
            <div id="entradaH">ENTRADA: ${registro.entrada}</div>
            <div id="salidaH">${registro.salida ? 'SALIDA: ' + registro.salida : ''}</div><br>
        `;
        contenedorHistorial.appendChild(fecRegistroDiv); // Agregar cada registro dentro de historialContenedor

        // Calcular total de minutos si hay hora de salida
        if (registro.salida) {
            const [horaEntrada, minutosEntrada] = registro.entrada.split(':').map(Number);
            const [horaSalida, minutosSalida] = registro.salida.split(':').map(Number);
            const entradaEnMinutos = horaEntrada * 60 + minutosEntrada;
            const salidaEnMinutos = horaSalida * 60 + minutosSalida;

            const minutosTrabajados = salidaEnMinutos - entradaEnMinutos; // Calcular minutos trabajados

            // Acumular minutos trabajados
            totalMinutos += minutosTrabajados;

            // Calcular horas y minutos trabajados en el día
            const horasTrabajadas = Math.floor(minutosTrabajados / 60);
            const minutosRestantes = minutosTrabajados % 60;

            // Crear un nuevo div para mostrar las horas trabajadas
            const tiempoTrabajadoDiv = document.createElement('div');
            tiempoTrabajadoDiv.className = 'tiempoTrabajado'; // Clase para el tiempo trabajado
            tiempoTrabajadoDiv.innerText = `Horas concluidas: ${horasTrabajadas} horas con ${minutosRestantes} minutos`;

            // Agregar el div de tiempo trabajado debajo del registro
            fecRegistroDiv.appendChild(tiempoTrabajadoDiv);
        }
    });

    // Calcular total de horas y minutos
    const totalHoras = Math.floor(totalMinutos / 60);
    const minutosRestantesTotales = totalMinutos % 60;

    // Calcular segundos y meses
    const totalSegundos = totalMinutos * 60; // 1 minuto = 60 segundos
    const totalMinutosDesdeHoras = totalHoras * 60 + minutosRestantesTotales; // Convertir horas a minutos
    const totalMeses = Math.floor(totalHoras / (24 * 30)); // 1 mes = aproximadamente 30 días

    // Mostrar total en el div con clase totalH
    const totalHDiv = document.getElementsByClassName("totalH")[0]; // Seleccionar el primer div con la clase totalH
    if (totalHDiv) {
        totalHDiv.innerHTML = `
            <h2>HORAS TOTALES</h2>
            <div>Horas totales: ${totalHoras} horas con ${minutosRestantesTotales} minutos</div>
            <div>Traducido en segundos: ${totalSegundos}</div>
            <div>Traducido en minutos: ${totalMinutosDesdeHoras}</div>
            <div>Traducido en meses: ${totalMeses}</div>
        `;
    }
}

function mostrarFechaHora() {
    // Crear un objeto Date
    const fecha = new Date();

    // Opciones para formatear la fecha
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Mexico_City' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'America/Mexico_City' };

    // Formatear la fecha y la hora
    const fechaFormateada = fecha.toLocaleDateString('es-MX', opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString('es-MX', opcionesHora);

    // Obtener el elemento HTML
    const fechaCompletaElemento = document.getElementById("fechaCompleta");

    // Mostrar la fecha y la hora en el elemento
    fechaCompletaElemento.innerHTML = `
        ${fecha.toLocaleDateString('es-MX')}<br>
        ${fechaFormateada}<br>
        ${horaFormateada}
    `;
}

// Llamar a la función para mostrar la fecha y hora
mostrarFechaHora();

// Actualizar la hora cada segundo
setInterval(mostrarFechaHora, 1000);
