// API endpoint for user logout
// This endpoint is called when the user clicks the logout button. 
//It destroys the session and logs the user out of the application.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\AuthController;

header('Content-Type: application/json');

$auth = new AuthController();
$auth->logout();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.'
]);