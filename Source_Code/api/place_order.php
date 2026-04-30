// API endpoint to place an order
// This endpoint is called when the user submits the checkout form. 
//It processes the order by validating the input, creating an order record in the database, and
// sending a confirmation email to the customer. It returns a JSON response indicating success or failure of the order

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controllers\OrderController;

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
    exit;
}

$controller = new OrderController();
$result = $controller->placeOrder($_POST);

echo json_encode($result);