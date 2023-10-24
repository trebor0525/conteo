<?php

// Conexión a la base de datos

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "inventario";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión a la base de datos: " . $conn->connect_error);
}

// Función para guardar un conteo
function guardarConteo($codigoBarras, $cantidadContada, $estado) {
    global $conn;

    $sql = "INSERT INTO Conteos (fecha, hora, codigo_barras, cantidad_contada, estado) VALUES (NOW(), NOW(), '$codigoBarras', $cantidadContada, '$estado')";

    if ($conn->query($sql) === TRUE) {
        return true;
        echo "Conteo guardado correctamente.";
    } else {
        return "Error al guardar el conteo: " . $conn->error;
    }
}

// Función para obtener los resultados de los conteos
function obtenerResultadosConteo() {
    global $conn;

    $sql = "SELECT codigo_barras,
                    SUM(CASE WHEN estado = 'inicial' THEN cantidad_contada ELSE 0 END) AS cantidad_inicial,
                    SUM(CASE WHEN estado = 'final' THEN cantidad_contada ELSE 0 END) AS contidad_final
            FROM Conteos
            GROUP BY codigo_barras";
    
    $result = $conn->query($sql);

    $resultados = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $resultados[] = $row;
        }
    }

    return $resultados;
}

// Manejar solicitudes del frontend
if (isset($_POST['accion'])) {
    if ($_POST['accion'] === 'guardar') {
        $codigoBarras = $_POST['codigoBarras'];
        $cantidadContada = $_POST['cantidadContada'];
        $estado = $_POST['estado'];

        $resultado = guardarConteo($codigoBarras, $cantidadContada, $estado);
        echo json_encode($resultado);
    } elseif ($_POST['accion'] === 'obtenerResultados') {
        $resultados = obtenerResultadosConteo();
        echo json_encode($resultados);
    }
} 

// Función para obtener los conteos iniciales y finales
function obtenerConteosInicialesFinales() {
    global $conn;

    $sql = "SELECT codigo_barras, 
                   SUM(CASE WHEN estado = 'inicial' THEN cantidad_contada ELSE 0 END) AS cantidad_inicial,
                   SUM(CASE WHEN estado = 'final' THEN cantidad_contada ELSE 0 END) AS cantidad_final
            FROM Conteos
            GROUP BY codigo_barras";

    $result = $conn->query($sql);

    $conteos = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $conteos[] = $row;
        }
    }

    return $conteos;
}

// Manejar solicitudes del frontend...
if (isset($_POST['accion'])) {
    if ($_POST['accion'] === 'obtenerConteosInicialesFinales') {
        $conteos = obtenerConteosInicialesFinales();
        echo json_encode($conteos);
    } elseif ($_POST['accion'] === 'guardar') {
        $codigoBarras = $_POST['codigoBarras'];
        $cantidadContada = $_POST['cantidadContada'];
        $estado = $_POST['estado'];
    }
}

$conn->close();
?>