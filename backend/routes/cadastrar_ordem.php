<?php

include "../config/database.php";

$cliente_id = $_POST['cliente_id'] ?? '';
$veiculo_id = $_POST['veiculo_id'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$valor_total = 0;

header('Content-Type: application/json');

if ($cliente_id == '' || $veiculo_id == '' || $descricao == '') {
    echo json_encode([
        "success" => false,
        "message" => "Preencha os campos obrigatórios."
    ]);
    exit;
}

$sql = "INSERT INTO ordens_servico 
(cliente_id, veiculo_id, descricao, valor_total, status)
VALUES (?, ?, ?, ?, 'Aberta')";

$stmt = $conn->prepare($sql);

$stmt->bind_param("iisd", $cliente_id, $veiculo_id, $descricao, $valor_total);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Ordem de serviço criada com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao criar ordem."
    ]);
}
?>