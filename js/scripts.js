function guardarConteo() {
    var codigoBarrasInput = document.getElementById("codigoBarras");
    var cantidadContadaInput = document.getElementById("cantidadContada");
    var codigoBarras = codigoBarrasInput.value;
    var cantidadContada = cantidadContadaInput.value;
    var cantidadContada = 1; // Cantidad por defecto

    if (codigoBarras.trim() !== "") {
        

    // Asignar automáticamente la cantidad 1 y guardar el conteo
    guardarConteoEnBaseDeDatos(codigoBarras, cantidadContada);

    // Limpiar el campo de código de barras y mantener el foco
    codigoBarrasInput.value = "";
    codigoBarrasInput.focus();
}
}

function guardarConteoEnBaseDeDatos(codigoBarras, cantidadContada) {
    // Realiza una solicitud AJAX para guardar el conteo
    $.ajax({
        type: "POST",
        url: "scripts.php",
        data: {
            accion: "guardar",
            codigoBarras: codigoBarras,
            cantidadContada: cantidadContada,
            estado: "inicial" // O "final" según corresponda
        },
        success: function (response) {
            // Actualiza la tabla de resultados después de guardar
            obtenerResultadosConteo();
        }
    });
}


function obtenerResultadosConteo() {
    // Realiza una solicitud AJAX para obtener los resultados de los conteos
    $.ajax({
        type: "POST",
        url: "scripts.php",
        data: {
            accion: "obtenerResultados"
        },
        success: function (response) {
            // Actualiza la tabla de resultados
            var resultados = JSON.parse(response);
            var tablaResultados = document.getElementById("resultadosConteo");

            // Limpia la tabla
            while (tablaResultados.firstChild) {
                tablaResultados.removeChild(tablaResultados.firstChild);
            }

            // Agrega los resultados a la tabla
            resultados.forEach(function (resultado) {
                var fila = document.createElement("tr");
                var codigoBarrasCell = document.createElement("td");
                var cantidadInicialCell = document.createElement("td");
                var cantidadFinalCell = document.createElement("td");

                codigoBarrasCell.textContent = resultado.codigo_barras;
                cantidadInicialCell.textContent = resultado.cantidad_inicial;
                cantidadFinalCell.textContent = resultado.cantidad_final;

                fila.appendChild(codigoBarrasCell);
                fila.appendChild(cantidadInicialCell);
                fila.appendChild(cantidadFinalCell);

                tablaResultados.appendChild(fila);

            });
        }
    });
}

function consolidarConteos() {
    // Realiza una solicitud AJAX para obtener los conteos iniciales y finales
    $.ajax({
        type: "POST",
        url: "scripts.php",
        data: {
            accion: "obtenerConteosInicialesFinales"
        },
        success: function (response) {
            // Parsea la respuesta JSON
            var conteos = JSON.parse(response);

            // Obtiene una referencia a la tabla de diferencias
            var tablaDiferencias = document.getElementById("tablaDiferencias");

            //Limpia la tabla (elimina todas las filas)
            while (tablaDiferencias.firstChild) {
                tablaDiferencias.removeChild(tablaDiferencias.firstChild);
            }

            // Crea la cabecera de la tabla
            var cabecera = document.createElement("thead");
            var filaCabecera = document.createElement("tr");
            var thCodigoBarras = document.createElement("th");
            var thDiferencia = document.createElement("th");

            thCodigoBarras.textContent = "Código de Barras";
            thDiferencia.textContent = "Diferencia";

            filaCabecera.appendChild(thCodigoBarras);
            filaCabecera.appendChild(thDiferencia);

            cabecera.appendChild(filaCabecera);
            tablaDiferencias.appendChild(cabecera);

            // Itera sobre los conteos y calcula y muestra las diferencias
            conteos.forEach(function (conteo) {
                var codigoBarras = conteo.codigo_barras;
                var cantidadInicial = conteo.cantidad_inicial;
                var cantidadFinal = conteo.cantidad_final;

                // Calcula la diferencia
                var diferencia = cantidadFinal - cantidadInicial;

                // Crea una fila para mostrar la diferencia
                var fila = document.createElement("tr");
                var tdCodigoBarras = document.createElement("td");
                var tdDiferencia = document.createElement("td");

                tdCodigoBarras.textContent = codigoBarras;
                tdDiferencia.textContent = diferencia;

                fila.appendChild(tdCodigoBarras);
                fila.appendChild(tdDiferencia);

                tablaDiferencias.appendChild(fila);
            });
        }
    });
}