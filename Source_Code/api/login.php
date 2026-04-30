// API endpoint for user login
// This endpoint is called by the login form to authenticate users and start a session. 
//It checks the provided email and password against the database, and if valid, it sets session variables for 
//the user and returns a JSON response indicating success along with user details. If authentication fails, it returns an error message.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\AuthController;
use App\Core\Session;

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
        'message' => 'Login successful.',
        'user' => [
            'id' => Session::get('user_id'),
            'name' => Session::get('user_name'),
            'email' => Session::get('user_email'),
            'role' => Session::get('user_role')
        ]
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password.'
    ]);
}