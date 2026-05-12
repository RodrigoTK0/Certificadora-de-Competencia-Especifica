<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id == '') {
    echo json_encode([
        "success" => false,
        "message" => "ID da ordem não informado."
    ]);
    exit;
}

// Primeiro apaga os itens da ordem
$sqlItens = "DELETE FROM itens_ordem WHERE ordem_id = ?";
$stmtItens = $conn->prepare($sqlItens);
$stmtItens->bind_param("i", $id);
$stmtItens->execute();

// Depois apaga a ordem
$sql = "DELETE FROM ordens_servico WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Ordem excluída com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao excluir ordem."
    ]);
}

?>