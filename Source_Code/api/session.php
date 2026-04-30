// API endpoint to check if the user is logged in and retrieve user information
// This endpoint is called by the frontend to check if the user is currently logged in and to retrieve their information such as name, email, and role. 
//It checks the session for user information and returns a JSON response indicating whether the user is logged in along with their details if they are logged in.
 // This is used to personalize the user experience and control access to certain features based on the

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Session;

header('Content-Type: application/json');

Session::start();

$userId = Session::get('user_id');
$userName = Session::get('user_name');
$userEmail = Session::get('user_email');
$userRole = Session::get('user_role');

if ($userId) {
    echo json_encode([
        'logged_in' => true,
        'user' => [
            'id' => $userId,
            'name' => $userName,
            'email' => $userEmail,
            'role' => $userRole
        ]
    ]);
} else {
    echo json_encode([
        'logged_in' => false,
        'user' => null
    ]);
}