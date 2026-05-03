<?php

include "../config/database.php";

$ordem_id = $_GET['ordem_id'] ?? '';

header('Content-Type: application/json');

if ($ordem_id == '') {
    echo json_encode([]);
    exit;
}

$sql = "
    SELECT *
    FROM itens_ordem
    WHERE ordem_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $ordem_id);
$stmt->execute();

$result = $stmt->get_result();

$itens = [];

while ($row = $result->fetch_assoc()) {
    $itens[] = $row;
}

echo json_encode($itens);

?>