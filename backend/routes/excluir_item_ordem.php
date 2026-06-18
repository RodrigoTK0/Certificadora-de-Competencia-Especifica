<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$ordem_id = $_POST['ordem_id'] ?? '';

if ($id === '' || $ordem_id === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID do item não informado."
    ]);
    exit;
}

$sql = "DELETE FROM itens_ordem WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

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
    "message" => $success ? "Item excluído com sucesso." : "Erro ao excluir item."
]);

?>