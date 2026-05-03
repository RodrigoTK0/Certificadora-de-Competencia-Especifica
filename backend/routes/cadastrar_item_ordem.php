<?php

include "../config/database.php";

header('Content-Type: application/json');

$ordem_id = $_POST['ordem_id'] ?? '';
$descricao = $_POST['descricao'] ?? '';
$tipo = $_POST['tipo'] ?? '';
$valor = $_POST['valor'] ?? '';

if ($ordem_id == '' || $descricao == '' || $tipo == '' || $valor == '') {
    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos do item."
    ]);
    exit;
}

$sql = "INSERT INTO itens_ordem (ordem_id, descricao, tipo, valor)
VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("issd", $ordem_id, $descricao, $tipo, $valor);

if ($stmt->execute()) {
    $update = "
    UPDATE ordens_servico
    SET valor_total = valor_total + ?
    WHERE id = ?
";

    $stmtUpdate = $conn->prepare($update);
    $stmtUpdate->bind_param("di", $valor, $ordem_id);
    $stmtUpdate->execute();

    echo json_encode([
        "success" => true,
        "message" => "Item adicionado com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao adicionar item."
    ]);
}
?>