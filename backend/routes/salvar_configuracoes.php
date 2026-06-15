<?php
include "../config/database.php";
header('Content-Type: application/json');

$nome = $_POST['nome_oficina'] ?? '';
$telefone = $_POST['telefone'] ?? '';
$email = $_POST['email'] ?? '';
$endereco = $_POST['endereco'] ?? '';

if ($nome === '') {
    echo json_encode(["success" => false, "message" => "Informe o nome da oficina."]);
    exit;
}

$sql = "UPDATE configuracoes SET nome_oficina = ?, telefone = ?, email = ?, endereco = ? WHERE id = 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $nome, $telefone, $email, $endereco);

$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Configurações salvas com sucesso." : "Erro ao salvar configurações."
]);
?>