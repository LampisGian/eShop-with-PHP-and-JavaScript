<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProductController;

header('Content-Type: application/json');

$controller = new ProductController();

echo json_encode($controller->getSellerProducts());