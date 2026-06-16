<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID do veículo não informado."
    ]);
    exit;
}

$sqlOrdens = "SELECT COUNT(*) AS total
              FROM ordens_servico
              WHERE veiculo_id = ?";

$stmtOrdens = $conn->prepare($sqlOrdens);
$stmtOrdens->bind_param("i", $id);
$stmtOrdens->execute();

$totalOrdens = $stmtOrdens->get_result()->fetch_assoc()['total'];

if ($totalOrdens > 0) {

    echo json_encode([
        "success" => false,
        "message" => "Não é possível excluir este veículo, pois ele possui ordem de serviço vinculada."
    ]);

    exit;
}

$sql = "DELETE FROM veiculos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success
        ? "Veículo excluído com sucesso."
        : "Erro ao excluir veículo."
]);

?>