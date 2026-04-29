<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\OrderController;

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

$controller = new OrderController();
$result = $controller->placeOrder($_POST);

echo json_encode($result);