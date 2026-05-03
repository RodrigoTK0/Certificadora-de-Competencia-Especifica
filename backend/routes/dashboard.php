<?php

include "../config/database.php";

$sqlAbertas = "SELECT COUNT(*) AS total FROM ordens_servico WHERE status = 'Aberta'";
$sqlConcluidas = "SELECT COUNT(*) AS total FROM ordens_servico WHERE status = 'Concluída' OR status = 'Concluído'";
$sqlClientes = "SELECT COUNT(*) AS total FROM clientes";

$abertas = $conn->query($sqlAbertas)->fetch_assoc()['total'];
$concluidas = $conn->query($sqlConcluidas)->fetch_assoc()['total'];
$clientes = $conn->query($sqlClientes)->fetch_assoc()['total'];

header('Content-Type: application/json');

echo json_encode([
    "ordens_abertas" => $abertas,
    "ordens_concluidas" => $concluidas,
    "clientes_ativos" => $clientes
]);

?>