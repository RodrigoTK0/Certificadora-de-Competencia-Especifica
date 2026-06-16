<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID do cliente não informado."
    ]);
    exit;
}

$sqlVeiculos = "SELECT COUNT(*) AS total FROM veiculos WHERE cliente_id = ?";
$stmtVeiculos = $conn->prepare($sqlVeiculos);
$stmtVeiculos->bind_param("i", $id);
$stmtVeiculos->execute();
$totalVeiculos = $stmtVeiculos->get_result()->fetch_assoc()['total'];

if ($totalVeiculos > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Não é possível excluir este cliente, pois ele possui veículo cadastrado."
    ]);
    exit;
}

$sqlOrdens = "SELECT COUNT(*) AS total FROM ordens_servico WHERE cliente_id = ?";
$stmtOrdens = $conn->prepare($sqlOrdens);
$stmtOrdens->bind_param("i", $id);
$stmtOrdens->execute();
$totalOrdens = $stmtOrdens->get_result()->fetch_assoc()['total'];

if ($totalOrdens > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Não é possível excluir este cliente, pois ele possui ordem de serviço vinculada."
    ]);
    exit;
}

$sql = "DELETE FROM clientes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Cliente excluído com sucesso." : "Erro ao excluir cliente."
]);

?>