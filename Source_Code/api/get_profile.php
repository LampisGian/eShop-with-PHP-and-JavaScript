<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProfileController;

header('Content-Type: application/json');

$controller = new ProfileController();

echo json_encode($controller->getProfile());