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