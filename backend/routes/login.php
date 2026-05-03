<?php

include "../config/database.php";

header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$senha = $_POST['senha'] ?? '';

if ($email == '' || $senha == '') {
    echo json_encode([
        "success" => false,
        "message" => "Preencha e-mail e senha."
    ]);
    exit;
}

$sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $senha);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();

    echo json_encode([
        "success" => true,
        "message" => "Login realizado com sucesso.",
        "usuario" => [
            "id" => $usuario["id"],
            "nome" => $usuario["nome"],
            "email" => $usuario["email"]
        ]
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "E-mail ou senha inválidos."
    ]);
}

?>