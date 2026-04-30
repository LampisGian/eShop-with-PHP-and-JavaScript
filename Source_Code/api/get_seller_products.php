// API endpoint to fetch products for the logged-in seller
// This endpoint is used by the seller dashboard to display the products that the seller has uploaded.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProductController;

header('Content-Type: application/json');

$controller = new ProductController();

echo json_encode($controller->getSellerProducts());