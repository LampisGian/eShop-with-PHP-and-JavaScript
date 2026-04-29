<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\AuthController;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

$auth = new AuthController();

if ($auth->login($email, $password)) {
    echo json_encode([
        'success' => true,
        'message' => 'Login successful.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password.'
    ]);
}