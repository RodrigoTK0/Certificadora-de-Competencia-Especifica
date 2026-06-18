<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$ordem_id = $_POST['ordem_id'] ?? '';
$tipo = $_POST['tipo'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$valor = $_POST['valor'] ?? '';

if ($id === '' || $ordem_id === '' || $tipo === '' || $descricao === '' || $valor === '') {
    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos do item."
    ]);
    exit;
}

$sql = "UPDATE itens_ordem SET tipo = ?, descricao = ?, valor = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdi", $tipo, $descricao, $valor, $id);

$success = $stmt->execute();

if ($success) {
    $sqlTotal = "UPDATE ordens_servico 
                 SET valor_total = (
                     SELECT COALESCE(SUM(valor), 0) 
                     FROM itens_ordem 
                     WHERE ordem_id = ?
                 )
                 WHERE id = ?";

    $stmtTotal = $conn->prepare($sqlTotal);
    $stmtTotal->bind_param("ii", $ordem_id, $ordem_id);
    $stmtTotal->execute();
}

echo json_encode([
    "success" => $success,
    "message" => $success ? "Item atualizado com sucesso." : "Erro ao atualizar item."
]);

?>