<?php

include "../config/database.php";

$sql = "
    SELECT 
        clientes.id,
        clientes.nome,
        clientes.documento,
        clientes.telefone,
        clientes.email,
        clientes.endereco,
        GROUP_CONCAT(veiculos.modelo SEPARATOR ', ') AS veiculos
    FROM clientes
    LEFT JOIN veiculos ON veiculos.cliente_id = clientes.id
    GROUP BY clientes.id
";

$result = $conn->query($sql);

$clientes = [];

while ($row = $result->fetch_assoc()) {
    $clientes[] = $row;
}

header('Content-Type: application/json');
echo json_encode($clientes);

?>