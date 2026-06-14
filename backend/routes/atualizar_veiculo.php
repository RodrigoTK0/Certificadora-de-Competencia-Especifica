<?php

include "../config/database.php";

header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$placa = $_POST['placa'] ?? '';
$marca = $_POST['marca'] ?? '';
$modelo = $_POST['modelo'] ?? '';
$ano = $_POST['ano'] ?? null;
$cliente_id = $_POST['cliente_id'] ?? '';

if ($id === '' || $placa === '' || $marca === '' || $modelo === '' || $cliente_id === '') {
    echo json_encode([
        "success" => false,
        "message" => "ID, placa, marca, modelo e proprietário são obrigatórios."
    ]);
    exit;
}

$sql = "UPDATE veiculos SET placa = ?, marca = ?, modelo = ?, ano = ?, cliente_id = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssiii", $placa, $marca, $modelo, $ano, $cliente_id, $id);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Veículo atualizado com sucesso."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao atualizar veículo: " . $conn->error
    ]);
}
?>