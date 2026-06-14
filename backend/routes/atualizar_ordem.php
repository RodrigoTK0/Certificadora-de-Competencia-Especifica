<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$cliente_id = $_POST['cliente_id'] ?? '';
$veiculo_id = $_POST['veiculo_id'] ?? '';
$descricao = $_POST['descricao'] ?? '';

if ($id === '' || $cliente_id === '' || $veiculo_id === '' || $descricao === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID, cliente, veículo e descrição são obrigatórios."
    ]);
    exit;
}

$sql = "UPDATE ordens_servico
        SET cliente_id = ?, veiculo_id = ?, descricao = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iisi", $cliente_id, $veiculo_id, $descricao, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Ordem de serviço atualizada com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao atualizar ordem de serviço."
    ]);
}
?>