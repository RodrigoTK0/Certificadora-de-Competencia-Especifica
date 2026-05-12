<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id == '') {
    echo json_encode([
        "success" => false,
        "message" => "ID do veículo não informado."
    ]);
    exit;
}

// Busca ordens do veículo
$sqlOrdens = "SELECT id FROM ordens_servico WHERE veiculo_id = ?";
$stmtOrdens = $conn->prepare($sqlOrdens);
$stmtOrdens->bind_param("i", $id);
$stmtOrdens->execute();

$resultOrdens = $stmtOrdens->get_result();

while ($ordem = $resultOrdens->fetch_assoc()) {

    $ordem_id = $ordem['id'];

    // Remove itens
    $sqlItens = "DELETE FROM itens_ordem WHERE ordem_id = ?";
    $stmtItens = $conn->prepare($sqlItens);
    $stmtItens->bind_param("i", $ordem_id);
    $stmtItens->execute();

    // Remove ordem
    $sqlDeleteOrdem = "DELETE FROM ordens_servico WHERE id = ?";
    $stmtDeleteOrdem = $conn->prepare($sqlDeleteOrdem);
    $stmtDeleteOrdem->bind_param("i", $ordem_id);
    $stmtDeleteOrdem->execute();
}

// Remove veículo
$sql = "DELETE FROM veiculos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Veículo excluído com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao excluir veículo."
    ]);
}
?>