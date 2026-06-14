<?php

include "../config/database.php";

header('Content-Type: application/json');

$sqlAbertas = "SELECT COUNT(*) AS total FROM ordens_servico WHERE status = 'Aberta'";
$sqlConcluidas = "SELECT COUNT(*) AS total FROM ordens_servico WHERE status = 'Concluída' OR status = 'Concluído'";
$sqlClientes = "SELECT COUNT(*) AS total FROM clientes";
$sqlVeiculos = "SELECT COUNT(*) AS total FROM veiculos";
$sqlAguardando = "SELECT COUNT(*) AS total FROM ordens_servico WHERE status = 'Aguardando peças'";
$sqlFaturamento = "SELECT COALESCE(SUM(valor_total), 0) AS total FROM ordens_servico WHERE status = 'Concluída' OR status = 'Concluído'";

$abertas = $conn->query($sqlAbertas)->fetch_assoc()['total'];
$concluidas = $conn->query($sqlConcluidas)->fetch_assoc()['total'];
$clientes = $conn->query($sqlClientes)->fetch_assoc()['total'];
$veiculos = $conn->query($sqlVeiculos)->fetch_assoc()['total'];
$aguardando = $conn->query($sqlAguardando)->fetch_assoc()['total'];
$faturamento = $conn->query($sqlFaturamento)->fetch_assoc()['total'];

echo json_encode([
    "ordens_abertas" => $abertas,
    "ordens_concluidas" => $concluidas,
    "clientes_ativos" => $clientes,
    "veiculos_cadastrados" => $veiculos,
    "ordens_aguardando_pecas" => $aguardando,
    "faturamento_total" => $faturamento
]);

?>