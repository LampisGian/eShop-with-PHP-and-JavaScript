//This file is the API endpoint for creating a new product. 
//It expects a POST request with product details and an optional image file. 
//The endpoint will return a JSON response indicating success or failure of the product creation process.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProductController;

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

$controller = new ProductController();
$result = $controller->createProduct($_POST, $_FILES);

echo json_encode($result);