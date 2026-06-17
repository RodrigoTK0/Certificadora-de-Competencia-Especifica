<?php

include "../config/database.php";

header('Content-Type: application/json');

$totalClientes = $conn->query("
    SELECT COUNT(*) AS total 
    FROM clientes
")->fetch_assoc()['total'];

$totalVeiculos = $conn->query("
    SELECT COUNT(*) AS total 
    FROM veiculos
")->fetch_assoc()['total'];

$ordensAbertas = $conn->query("
    SELECT COUNT(*) AS total 
    FROM ordens_servico 
    WHERE status = 'Aberta'
")->fetch_assoc()['total'];

$ordensAndamento = $conn->query("
    SELECT COUNT(*) AS total 
    FROM ordens_servico 
    WHERE status = 'Em andamento'
")->fetch_assoc()['total'];

$ordensAguardando = $conn->query("
    SELECT COUNT(*) AS total 
    FROM ordens_servico 
    WHERE status = 'Aguardando peças'
")->fetch_assoc()['total'];

$ordensProntas = $conn->query("
    SELECT COUNT(*) AS total 
    FROM ordens_servico 
    WHERE status = 'Pronta para retirada'
")->fetch_assoc()['total'];

$ordensConcluidas = $conn->query("
    SELECT COUNT(*) AS total 
    FROM ordens_servico 
    WHERE status = 'Concluída' OR status = 'Concluído'
")->fetch_assoc()['total'];

$ordensCanceladas = $conn->query("
    SELECT COUNT(*) AS total 
    FROM ordens_servico 
    WHERE status = 'Cancelada'
")->fetch_assoc()['total'];

$faturamento = $conn->query("
    SELECT COALESCE(SUM(valor_total), 0) AS total 
    FROM ordens_servico 
    WHERE status = 'Concluída' OR status = 'Concluído'
")->fetch_assoc()['total'];

echo json_encode([
    "total_clientes" => $totalClientes,
    "total_veiculos" => $totalVeiculos,
    "ordens_abertas" => $ordensAbertas,
    "ordens_andamento" => $ordensAndamento,
    "ordens_aguardando_pecas" => $ordensAguardando,
    "ordens_prontas_retirada" => $ordensProntas,
    "ordens_concluidas" => $ordensConcluidas,
    "ordens_canceladas" => $ordensCanceladas,
    "faturamento" => $faturamento
]);

?>