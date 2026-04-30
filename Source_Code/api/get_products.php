// API endpoint to fetch all products
// This endpoint is used by the frontend to display products on the home page and category pages.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProductController;

header('Content-Type: application/json');

$controller = new ProductController();

echo json_encode($controller->getAllProducts());