// API endpoint for user registration
// This endpoint is called by the registration form to create a new user account. 
//It validates the input data, checks for existing users with the same email, and if everything is valid, 
//it creates a new user record in the database. It returns a JSON response indicating success

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

$fullName = trim($_POST['full_name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? 'customer';

$auth = new AuthController();

if ($auth->register($fullName, $email, $password, $role)) {
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful. You can now login.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Registration failed. Please check your details or use another email.'
    ]);
}