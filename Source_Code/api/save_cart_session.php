<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Session;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
    exit;
}

Session::start();

$userId = Session::get('user_id');
$userRole = Session::get('user_role');

if (!$userId || $userRole !== 'customer') {
    echo json_encode([
        'success' => false,
        'message' => 'You must be logged in as a customer to continue to checkout.'
    ]);
    exit;
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!isset($data['cart']) || !is_array($data['cart']) || count($data['cart']) === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Your cart is empty.'
    ]);
    exit;
}

$cleanCart = [];
$total = 0;

foreach ($data['cart'] as $item) {
    $id = (int) ($item['id'] ?? 0);
    $title = trim($item['title'] ?? '');
    $price = (float) ($item['price'] ?? 0);
    $image = trim($item['image'] ?? '');
    $stock = (int) ($item['stock'] ?? 0);
    $quantity = (int) ($item['quantity'] ?? 0);

    if ($id <= 0 || $title === '' || $price <= 0 || $quantity <= 0) {
        continue;
    }

    if ($stock >= 0 && $quantity > $stock) {
        $quantity = $stock;
    }

    $lineTotal = $price * $quantity;
    $total += $lineTotal;

    $cleanCart[] = [
        'id' => $id,
        'title' => $title,
        'price' => $price,
        'image' => $image,
        'stock' => $stock,
        'quantity' => $quantity,
        'line_total' => $lineTotal
    ];
}

if (count($cleanCart) === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'No valid cart items were found.'
    ]);
    exit;
}

Session::set('checkout_cart', $cleanCart);
Session::set('checkout_total', $total);

echo json_encode([
    'success' => true,
    'message' => 'Cart connected to checkout session successfully.'
]);