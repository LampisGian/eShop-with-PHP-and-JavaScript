// API endpoint to fetch user profile information
// This endpoint is used by the profile page to display the user's current information and allow them to update it. 
//It checks if the user is logged in and returns their profile data in a JSON response
<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProfileController;

header('Content-Type: application/json');

$controller = new ProfileController();

echo json_encode($controller->getProfile());