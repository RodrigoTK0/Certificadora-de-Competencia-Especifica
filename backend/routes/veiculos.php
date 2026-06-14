<?php

include "../config/database.php";

$sql = "
   SELECT
    veiculos.id,
    veiculos.placa,
    veiculos.modelo,
    veiculos.marca,
    veiculos.ano,
    veiculos.cliente_id,
    clientes.nome AS cliente_nome
FROM veiculos
LEFT JOIN clientes ON clientes.id = veiculos.cliente_id
";

$result = $conn->query($sql);

$veiculos = [];

while ($row = $result->fetch_assoc()) {
    $veiculos[] = $row;
}

header('Content-Type: application/json');
echo json_encode($veiculos);

?>