<?php

include "../config/database.php";

$id = $_POST['id'] ?? '';
$status = $_POST['status'] ?? '';

header('Content-Type: application/json');

if ($id == '' || $status == '') {
    echo json_encode([
        "success" => false,
        "message" => "Dados inválidos."
    ]);
    exit;
}

$sql = "UPDATE ordens_servico SET status = ? WHERE id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Status atualizado."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao atualizar status."
    ]);
}
?>