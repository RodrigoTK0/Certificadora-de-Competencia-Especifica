<?php
include "../config/database.php";
header('Content-Type: application/json');

$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$tipo = $_POST['tipo'] ?? 'Funcionário';

if ($nome === '' || $email === '' || $senha === '') {
    echo json_encode(["success" => false, "message" => "Preencha todos os campos."]);
    exit;
}

$sql = "INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $nome, $email, $senha, $tipo);

$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Usuário cadastrado com sucesso." : "Erro ao cadastrar usuário."
]);
?>