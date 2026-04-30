// API endpoint to fetch product categories
// This endpoint is used by the frontend to populate category dropdowns and filters.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProductController;

header('Content-Type: application/json');

$controller = new ProductController();

echo json_encode([
    "success" => true,
    "categories" => $controller->getCategories()
]);