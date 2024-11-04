window.onload = function() {
    mostrarHistorial();
    mostrarHistorial1();
    iniciarRegistroHoras(horas);
};

document.addEventListener("DOMContentLoaded", function () {
    const formularioContainer = document.getElementById("formularioContainer");
    const contenidoPrincipal = document.getElementById("contenidoPrincipal");
    const formHoras = document.getElementById("formHoras");
    const usuarioInput = document.getElementById("usuario");
    const nombreUsuarioMostrar = document.getElementById("nombreUsuarioMostrar");

    // Verificar si hay un nombre guardado en el almacenamiento local
    function checkUsuario() {
        const nombreGuardado = localStorage.getItem("nombreUsuario");

        if (nombreGuardado) {
            // Si hay un nombre guardado, ocultar el formulario y mostrar solo el contenido principal
            formularioContainer.style.display = "none";
            contenidoPrincipal.style.display = "block";
            // Mostrar el nombre del usuario en el contenido principal
            nombreUsuarioMostrar.textContent = `Bienvenido, ${nombreGuardado}!`;
        } else {
            // Si no hay un nombre guardado, mostrar el formulario y ocultar el contenido principal
            formularioContainer.style.display = "flex";
            contenidoPrincipal.style.display = "none";
        }
    }

    // Ejecutar la verificación de usuario al cargar
    checkUsuario();

    // Manejar el envío del formulario
    formHoras.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario

        const nombre = usuarioInput.value.trim();

        if (nombre) {
            // Guardar el nombre en el almacenamiento local
            localStorage.setItem("nombreUsuario", nombre);

            // Ocultar el formulario y mostrar el contenido principal
            formularioContainer.style.display = "none";
            contenidoPrincipal.style.display = "block";
            // Mostrar el nombre del usuario en el contenido principal
            nombreUsuarioMostrar.textContent = `Bienvenido, ${nombre}!`;
        }
    });
});


let horas = 1;
function iniciarRegistroHoras(horas) {
  
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
            location.reload();
        }
    });
}



// Manejo del botón "Guardar Salida"
// Manejo del botón "Guardar Salida"
document.getElementById("guardarSalida").addEventListener("click", guardaSalida);

function guardaSalida() {
    const salidaHora = document.getElementById("entrada").value; // Obtiene la hora de salida
    const ahora = new Date();
    const opcionesFechaTexto = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = ahora.toLocaleDateString('es-MX', opcionesFechaTexto);

    // Verificar el historial
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const entradaIndex = historial.length - 1; // Obtener el último registro

    if (entradaIndex >= 0) {
        // Si hay un registro de entrada
        const ultimoRegistro = historial[entradaIndex];
        if (ultimoRegistro.salida) {
            // Si ya hay una salida registrada
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes registrar una entrada primero.',
            });
        } else {
            // Si no hay salida, proceder a guardar
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
                    ultimoRegistro.salida = salidaHora; // Actualizar el último registro con la hora de salida
                    localStorage.setItem('historial', JSON.stringify(historial));
                    mostrarHistorial(); // Actualizar la visualización del historial
                    document.getElementById("entrada").value = ''; // Limpiar el campo de entrada
                    
                    // Reiniciar la página
                    location.reload();
                }
            });
        }
    } else {
        // No hay registros en el historial
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay ninguna entrada guardada para asociar la salida.',
        });
    }
}



// Mostrar el historial de entradas y salidas
let historial = JSON.parse(localStorage.getItem('historial')) || [];

// Mostrar el historial de entradas y salidas
function mostrarHistorial() {
    const contenedorHistorial = document.getElementById("horasGuardadas");
    contenedorHistorial.innerHTML = '';

    if (historial.length === 0) {
        contenedorHistorial.style.display = "none";
        return;
    } else {
        contenedorHistorial.style.display = "block";
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
                <button id="borrarES_${index}" title="borrar" class="BR" onclick="borrarRegistro(${index})"><i class="fa-solid fa-trash"></i></button>
                <button id="editarES_${index}" title="editar" class="ER"><i class="fa-solid fa-pen-to-square"></i></button>
            </div>
        `;
        contenedorHistorial.appendChild(histoDiv);

        const btnEditar = histoDiv.querySelector(`#editarES_${index}`);
        btnEditar.addEventListener('click', () => abrirModalEditar(index));
    });
}

// Modal-----------------------------------------------------------------------------------------------------------------
// Función para abrir la modal y cargar el registro a editar
function abrirModalEditar(index) {
    const modal = document.getElementById('modalEditar');
    const registro = historial[index];

    // Convertir la fecha del registro a formato YYYY-MM-DD
    const fechaParts = registro.fecha.split(' '); // Asumiendo que la fecha está en el formato "d de mes de yyyy"
    const dia = fechaParts[0]; // Día
    const mes = getMesIndex(fechaParts[2]); // Convertir el mes a índice
    const anio = fechaParts[4]; // Año

    // Asignar el valor de fecha en el formato correcto al input
    const formattedDate = `${anio}-${('0' + mes).slice(-2)}-${('0' + dia).slice(-2)}`; // Formato YYYY-MM-DD
    document.getElementById('fechaInput').value = formattedDate; // Asigna la fecha correctamente

    document.getElementById('entradaInput').value = formatTime(registro.entrada); // Hora de entrada
    document.getElementById('salidaInput').value = registro.salida ? formatTime(registro.salida) : ''; // Manejo del caso donde no haya salida

    modal.style.display = "block"; // Mostrar la modal

    // Manejo de los botones de guardar y cancelar
    document.getElementById('guardarEdicion').onclick = () => {
        // Confirmación con SweetAlert
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres editar este registro?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, editar!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Llamar a la función para guardar la edición
                guardarEdicion(index);
                Swal.fire(
                    'Actualizado!',
                    'Registro actualizado correctamente.',
                    'success'
                ).then(() => {
                    location.reload(); // Recargar la página para mostrar cambios
                });
            }
        });
    };
    
    document.getElementById('cancelarEdicion').onclick = cerrarModal;
    document.getElementById('closeModal').onclick = cerrarModal;
}

// Función para guardar la edición
function guardarEdicion(index) {
    const fechaInput = document.getElementById('fechaInput').value;
    const entradaInput = document.getElementById('entradaInput').value;
    const salidaInput = document.getElementById('salidaInput').value;

    // Convertir fecha desde YYYY-MM-DD a Date
    const [anio, mes, dia] = fechaInput.split('-').map(Number); // Convertir a números
    const fechaCompleta = new Date(anio, mes - 1, dia); // Creando objeto de fecha

    // Formatear fecha a "d de mes de yyyy"
    const fechaFinal = `${fechaCompleta.getDate()} de ${getMes(fechaCompleta.getMonth() + 1)} de ${fechaCompleta.getFullYear()}`;

    // Convertir entrada y salida a formato hh:mm:ss a.m./p.m.
    const entradaHora = formatAMPM(entradaInput);
    const salidaHora = salidaInput ? formatAMPM(salidaInput) : '';

    // Actualizar el registro en el historial
    historial[index] = { fecha: fechaFinal, entrada: entradaHora, salida: salidaHora };

    // Guardar el historial actualizado en localStorage
    localStorage.setItem('historial', JSON.stringify(historial));

    // Cerrar la modal después de guardar
    cerrarModal();
}

// Función para obtener el índice del mes
function getMesIndex(mes) {
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return meses.indexOf(mes) + 1; // Retorna el índice del mes (1-12)
}

// Función para obtener el nombre del mes
function getMes(mes) {
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return meses[mes - 1];
}

// Función para formatear la hora en formato a.m./p.m.
function formatAMPM(hora) {
    const [h, m] = hora.split(':');
    const hours = parseInt(h, 10);
    const minutes = m;
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    const formattedHour = hours % 12 || 12; // convert 0 to 12
    return `${formattedHour}:${minutes}:00 ${ampm}`; // Retorna en formato deseado
}

// Función para formatear la hora a un string para el input
function formatTime(hora) {
    const [h, m] = hora.split(':');
    return `${('0' + h).slice(-2)}:${('0' + m).slice(-2)}`; // Asegura que el formato sea hh:mm
}

// Función para cerrar la modal
function cerrarModal() {
    const modal = document.getElementById('modalEditar');
    modal.style.display = "none"; 
}


//CIERRE MODAL----------------------------------------------------------------------------------------------------------------------
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
        return;
    } else {
        contenedorHistorial.style.display = "block"; // Mostrar contenedor si hay datos
    }

    let totalMinutos = 0; // Variable para acumular el total de minutos trabajados

    historial.forEach((registro) => {
        // Crear un nuevo div para cada registro
        const fecRegistroDiv = document.createElement('div');
        fecRegistroDiv.className = 'fec';
        fecRegistroDiv.innerHTML = `
            <div id="fecha">${registro.fecha}</div>
            <div id="entradaH">ENTRADA: ${registro.entrada}</div>
            <div id="salidaH">${registro.salida ? 'SALIDA: ' + registro.salida : ''}</div><br>
        `;
        contenedorHistorial.appendChild(fecRegistroDiv);

        // Calcular total de minutos si hay hora de salida
        if (registro.salida) {
            const entradaEnMinutos = convertirA12HorasEnMinutos(registro.entrada);
            const salidaEnMinutos = convertirA12HorasEnMinutos(registro.salida);

            let minutosTrabajados = salidaEnMinutos - entradaEnMinutos;
            if (minutosTrabajados < 0) {
                minutosTrabajados += 1440; // Ajuste si la salida es después de medianoche
            }

            totalMinutos += minutosTrabajados;

            const horasTrabajadas = Math.floor(minutosTrabajados / 60);
            const minutosRestantes = minutosTrabajados % 60;

            const tiempoTrabajadoDiv = document.createElement('div');
            tiempoTrabajadoDiv.className = 'tiempoTrabajado';
            tiempoTrabajadoDiv.innerText = `Horas concluidas: ${horasTrabajadas} horas con ${minutosRestantes} minutos`;

            fecRegistroDiv.appendChild(tiempoTrabajadoDiv);
        }
    });

    const totalHoras = Math.floor(totalMinutos / 60);
    const minutosRestantesTotales = totalMinutos % 60;
    const totalSegundos = totalMinutos * 60;
    const totalMinutosDesdeHoras = totalHoras * 60 + minutosRestantesTotales;
    const totalMeses = Math.floor(totalHoras / (24 * 30));

    const totalHDiv = document.getElementsByClassName("totalH")[0];
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

// Función para convertir formato de 12 horas (hh:mm AM/PM) a minutos sin cambio de 24 horas
function convertirA12HorasEnMinutos(hora12) {
    // Separar horas, minutos y AM/PM
    const [time, period] = hora12.split(" ");
    let [horas, minutos] = time.split(":").map(Number);

    // Si es PM y no es 12 PM, sumamos 12 horas para convertir a 24 horas
    if (period === "p.m." && horas !== 12) {
        horas += 12;
    }
    // Si es AM y es 12 AM, convertir a 0 horas
    if (period === "a.m." && horas === 12) {
        horas = 0;
    }

    return horas * 60 + minutos;
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

function exportarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    
    // Verificar si hay datos para exportar
    if (historial.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'No hay datos para exportar',
            text: 'Por favor, registra tus entradas y salidas antes de intentar exportar.',
        });
        return;
    }

    // Obtener el nombre de usuario guardado
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';

    // Crear un array de filas para la hoja de cálculo
    const filas = [['Nombre de Usuario:', nombreUsuario], ['Fecha', 'Entrada', 'Salida', 'Horas Concluidas']];
    let totalMinutos = 0;

    historial.forEach((registro) => {
        // Calcular horas concluidas
        let horasConcluidas = '';
        if (registro.salida) {
            const entradaEnMinutos = convertirA12HorasEnMinutos(registro.entrada);
            const salidaEnMinutos = convertirA12HorasEnMinutos(registro.salida);
            let minutosTrabajados = salidaEnMinutos - entradaEnMinutos;

            if (minutosTrabajados < 0) {
                minutosTrabajados += 1440; // Ajuste si la salida es después de medianoche
            }

            totalMinutos += minutosTrabajados;
            const horasTrabajadas = Math.floor(minutosTrabajados / 60);
            const minutosRestantes = minutosTrabajados % 60;
            horasConcluidas = `${horasTrabajadas} horas con ${minutosRestantes} minutos`;
        }

        // Agregar la fila de datos
        filas.push([registro.fecha, registro.entrada, registro.salida || '', horasConcluidas]);
    });

    // Calcular total horas
    const totalHoras = Math.floor(totalMinutos / 60);
    const minutosRestantesTotales = totalMinutos % 60;
    const totalHorasTexto = `Total: ${totalHoras} horas con ${minutosRestantesTotales} minutos`;

    // Agregar total al final
    filas.push(['', '', '', totalHorasTexto]);

    // Crear un libro de trabajo y una hoja
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(filas);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');

    // Exportar el archivo Excel
    XLSX.writeFile(wb, 'historial.xlsx');

    // Mostrar alerta de éxito tras la exportación
    Swal.fire({
        icon: 'success',
        title: 'Exportación Exitosa',
        text: `El historial de ${nombreUsuario} se ha exportado correctamente.`,
    });
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    // Inicialización y carga de fecha y hora
    const today = new Date();
    const dia = String(today.getDate()).padStart(2, '0');
    const mes = String(today.getMonth() + 1).padStart(2, '0');
    const año = today.getFullYear();
    document.getElementById('nuevaFechaInput').value = `${año}-${mes}-${dia}`;
    document.getElementById('nuevaEntradaInput').value = '00:00:00';
    document.getElementById('nuevaSalidaInput').value = '12:00:00';

    // Manejo del botón de insertar
    document.getElementById('insertNueva').addEventListener('click', function() {
        document.getElementById('modalNuevaInsertar').style.display = 'block';
    });

    document.getElementById('closeNuevaModal').addEventListener('click', function() {
        document.getElementById('modalNuevaInsertar').style.display = 'none';
    });

    // Cierre del modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modalNuevaInsertar');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Manejo del envío de datos
    document.getElementById('submitNuevaData').addEventListener('click', function() {
        const fecha = document.getElementById('nuevaFechaInput').value.trim();
        const entrada = document.getElementById('nuevaEntradaInput').value;
        const salida = document.getElementById('nuevaSalidaInput').value;

        if (!fecha || !entrada || !salida) {
            Swal.fire({
                title: "Error",
                text: "Todos los campos son obligatorios.",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
            return;
        }

        const fechaFormateada = formatearFecha(fecha);
        const entrada12Horas = convertirHora12Horas(entrada);
        const salida12Horas = convertirHora12Horas(salida);

        // Confirmación de inserción
        Swal.fire({
            title: "Confirmación",
            text: `¿Estás seguro de que quieres insertar este registro?\n\nFecha: ${fechaFormateada}\nEntrada: ${entrada12Horas}\nSalida: ${salida12Horas}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Guardar en localStorage
                const historial = JSON.parse(localStorage.getItem('historial')) || [];
                historial.push({
                    fecha: fechaFormateada, // Almacena la fecha ya formateada
                    entrada: entrada12Horas, // Almacena la hora de entrada ya convertida
                    salida: salida12Horas // Almacena la hora de salida ya convertida
                });
                localStorage.setItem('historial', JSON.stringify(historial));

                // Mensaje de éxito y recarga
                Swal.fire({
                    title: "Éxito",
                    text: "El registro se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    location.reload(); // Recargar la página para ver los cambios
                });
            }
        });
    });

    cargarHistorial(); // Cargar el historial al inicio
});

// Función para formatear la fecha
function formatearFecha(fecha) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const [año, mes, dia] = fecha.split('-').map(Number);
    return `${dia} de ${meses[mes - 1]} de ${año}`;
}

// Función para convertir la hora a formato 12 horas
function convertirHora12Horas(hora) {
    let [horas, minutos, segundos] = hora.split(':').map(Number);
    const ampm = horas >= 12 ? 'p.m.' : 'a.m.';
    horas = horas % 12; // Convertir a formato 12 horas
    horas = horas ? horas : 12; // si horas es 0, se convierte en 12
    return `${horas}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} ${ampm}`;
}

// Función para cargar el historial
function cargarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const contenedorHistorial = document.getElementById('contenedorHistorial');
    contenedorHistorial.innerHTML = '';

    historial.forEach((registro, index) => {
        const histoDiv = document.createElement('div');
        histoDiv.className = 'histo';
        histoDiv.innerHTML = `
            <div class="fecha">
                <div class="fechaguardada">${registro.fecha}</div>
                <div class="horasGuardadas">ENTRADA: ${registro.entrada} SALIDA: ${registro.salida}</div>
            </div>
            <div class="borr">
                <button id="borrarES_${index}" title="borrar" class="BR" onclick="borrarRegistro(${index})"><i class="fa-solid fa-trash"></i></button>
                <button id="editarES_${index}" title="editar" class="ER"><i class="fa-solid fa-pen-to-square"></i></button>
            </div>
        `;
        contenedorHistorial.appendChild(histoDiv);

        // Manejo del botón de editar
        const btnEditar = histoDiv.querySelector(`#editarES_${index}`);
        btnEditar.addEventListener('click', () => abrirModalEditar(index));
    });
}


// Dark mode toggle
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        document.body.classList.add('dark-mode');
    }
}

// Your existing JavaScript code goes here
// ...

// Remember to update any DOM manipulation or styling in your existing code
// to use the CSS variables for colors to ensure compatibility with dark mode