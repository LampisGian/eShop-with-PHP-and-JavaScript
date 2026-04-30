<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProfileController;

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

$controller = new ProfileController();

echo json_encode($controller->updateProfile($_POST));