<?php

include "../config/database.php";

$sql = "
    SELECT 
        ordens_servico.id,
        ordens_servico.descricao,
        ordens_servico.valor_total,
        ordens_servico.status,
        ordens_servico.data_criacao,
        clientes.nome AS cliente_nome,
        veiculos.modelo AS veiculo_modelo,
        veiculos.marca AS veiculo_marca,
        veiculos.placa AS veiculo_placa
    FROM ordens_servico
    INNER JOIN clientes ON ordens_servico.cliente_id = clientes.id
    INNER JOIN veiculos ON ordens_servico.veiculo_id = veiculos.id
    ORDER BY ordens_servico.id DESC
";

$result = $conn->query($sql);

$ordens = [];

while ($row = $result->fetch_assoc()) {
    $ordens[] = $row;
}

header('Content-Type: application/json');
echo json_encode($ordens);

?>