// API endpoint to update user profile information
// This endpoint is called when the user submits the profile update form. 
//It validates the input data, updates the user's profile information 
//in the database, and returns a JSON response indicating success or failure of the update operation. This allows the frontend to provide feedback to the user about the status of their profile update.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\ProfileController;

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

$controller = new ProfileController();

echo json_encode($controller->updateProfile($_POST));