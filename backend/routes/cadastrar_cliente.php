<?php

include "../config/database.php";

header('Content-Type: application/json');

$nome = $_POST['nome'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$email = $_POST['email'] ?? '';
$endereco = $_POST['endereco'] ?? '';

if ($nome === '' || $telefone === '') {
    echo json_encode([
        "success" => false,
        "message" => "Nome e telefone são obrigatórios."
    ]);
    exit;
}

$sql = "INSERT INTO clientes (nome, telefone, email, endereco) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $nome, $telefone, $email, $endereco);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Cliente cadastrado com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao cadastrar cliente: " . $conn->error
    ]);
}
?>