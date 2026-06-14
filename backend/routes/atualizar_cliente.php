<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$nome = $_POST['nome'] ?? '';
$documento = $_POST['documento'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$email = $_POST['email'] ?? '';
$endereco = $_POST['endereco'] ?? '';

if ($id === '' || $nome === '' || $telefone === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID, nome e telefone são obrigatórios."
    ]);
    exit;
}

$sql = "UPDATE clientes 
        SET nome = ?, documento = ?, telefone = ?, email = ?, endereco = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $nome, $documento, $telefone, $email, $endereco, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Cliente atualizado com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao atualizar cliente: " . $conn->error
    ]);
}
?>