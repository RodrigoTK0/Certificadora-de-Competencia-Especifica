<?php

include "../config/database.php";

$cliente_id = $_POST['cliente_id'] ?? '';
$marca = $_POST['marca'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$placa = $_POST['placa'] ?? '';
$ano = $_POST['ano'] ?? '';

header('Content-Type: application/json');

if ($cliente_id == '' || $marca == '' || $modelo == '' || $placa == '') {
    echo json_encode([
        "success" => false,
        "message" => "Preencha todos os campos obrigatórios."
    ]);
    exit;
}

$sql = "INSERT INTO veiculos (cliente_id, marca, modelo, ano, placa)
VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param("issis", $cliente_id, $marca, $modelo, $ano, $placa);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Veículo cadastrado com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao cadastrar veículo."
    ]);
}
?>