<?php
include "../config/database.php";
header('Content-Type: application/json');

$sql = "SELECT * FROM configuracoes WHERE id = 1";
$result = $conn->query($sql);

echo json_encode($result->fetch_assoc());
?>