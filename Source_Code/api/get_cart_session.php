<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Session;

header('Content-Type: application/json');

Session::start();

$userId = Session::get('user_id');
$userRole = Session::get('user_role');

if (!$userId || $userRole !== 'customer') {
    echo json_encode([
        'success' => false,
        'message' => 'You must be logged in as a customer to view checkout.',
        'cart' => [],
        'total' => 0
    ]);
    exit;
}

$cart = Session::get('checkout_cart') ?? [];
$total = Session::get('checkout_total') ?? 0;

if (!$cart || count($cart) === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'No checkout cart found. Please return to your cart.',
        'cart' => [],
        'total' => 0
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'cart' => $cart,
    'total' => $total,
    'user' => [
        'id' => Session::get('user_id'),
        'name' => Session::get('user_name'),
        'email' => Session::get('user_email'),
        'role' => Session::get('user_role')
    ]
]);