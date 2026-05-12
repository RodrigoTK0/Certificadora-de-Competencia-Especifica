<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';

if ($id == '') {
    echo json_encode([
        "success" => false,
        "message" => "ID do cliente não informado."
    ]);
    exit;
}

// Primeiro busca as ordens ligadas aos veículos desse cliente
$sqlOrdens = "
    SELECT ordens_servico.id
    FROM ordens_servico
    INNER JOIN veiculos ON ordens_servico.veiculo_id = veiculos.id
    WHERE veiculos.cliente_id = ?
";

$stmtOrdens = $conn->prepare($sqlOrdens);
$stmtOrdens->bind_param("i", $id);
$stmtOrdens->execute();

$resultOrdens = $stmtOrdens->get_result();

while ($ordem = $resultOrdens->fetch_assoc()) {
    $ordem_id = $ordem['id'];

    // Apaga itens da ordem
    $sqlItens = "DELETE FROM itens_ordem WHERE ordem_id = ?";
    $stmtItens = $conn->prepare($sqlItens);
    $stmtItens->bind_param("i", $ordem_id);
    $stmtItens->execute();

    // Apaga a ordem
    $sqlDeleteOrdem = "DELETE FROM ordens_servico WHERE id = ?";
    $stmtDeleteOrdem = $conn->prepare($sqlDeleteOrdem);
    $stmtDeleteOrdem->bind_param("i", $ordem_id);
    $stmtDeleteOrdem->execute();
}

// Depois apaga os veículos do cliente
$sqlVeiculos = "DELETE FROM veiculos WHERE cliente_id = ?";
$stmtVeiculos = $conn->prepare($sqlVeiculos);
$stmtVeiculos->bind_param("i", $id);
$stmtVeiculos->execute();

// Por último apaga o cliente
$sqlCliente = "DELETE FROM clientes WHERE id = ?";
$stmtCliente = $conn->prepare($sqlCliente);
$stmtCliente->bind_param("i", $id);

if ($stmtCliente->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Cliente excluído com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao excluir cliente: " . $conn->error
    ]);
}

?>