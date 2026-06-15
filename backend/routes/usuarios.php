<?php
include "../config/database.php";
header('Content-Type: application/json');

$sql = "SELECT id, nome, email, tipo FROM usuarios ORDER BY nome";
$result = $conn->query($sql);

$usuarios = [];

while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode($usuarios);
?>