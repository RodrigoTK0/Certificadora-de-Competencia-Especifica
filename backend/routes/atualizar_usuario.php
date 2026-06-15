<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';
$tipo = $_POST['tipo'] ?? 'Funcionário';

if ($id == '' || $nome == '' || $email == '') {

    echo json_encode([
        "success" => false,
        "message" => "Preencha os campos obrigatórios."
    ]);

    exit;
}

if ($senha != '') {

    $sql = "UPDATE usuarios
            SET nome = ?, email = ?, senha = ?, tipo = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "ssssi",
        $nome,
        $email,
        $senha,
        $tipo,
        $id
    );

} else {

    $sql = "UPDATE usuarios
            SET nome = ?, email = ?, tipo = ?
            WHERE id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sssi",
        $nome,
        $email,
        $tipo,
        $id
    );
}

$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success
        ? "Usuário atualizado com sucesso."
        : "Erro ao atualizar usuário."
]);

?>