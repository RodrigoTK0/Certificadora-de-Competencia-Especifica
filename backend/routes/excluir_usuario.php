<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID do usuário não informado."
    ]);
    exit;
}

$sql = "DELETE FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

$success = $stmt->execute();

echo json_encode([
    "success" => $success,
    "message" => $success ? "Usuário excluído com sucesso." : "Erro ao excluir usuário."
]);

?>