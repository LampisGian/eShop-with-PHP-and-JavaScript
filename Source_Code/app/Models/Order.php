<?php

namespace App\Models;

use App\Core\Database;
use PDO;
use Exception;

class Order
{
    private PDO $db;

    public function __construct()
    {
        $this->db = (new Database())->connect();
    }

    public function createOrder(
        int $customerId,
        string $customerName,
        string $customerEmail,
        string $shippingAddress,
        string $phone,
        float $totalPrice,
        array $cartItems
    ): int {
        try {
            $this->db->beginTransaction();

            $orderSql = "INSERT INTO orders 
                (customer_id, customer_name, customer_email, shipping_address, phone, total_price, status)
                VALUES 
                (:customer_id, :customer_name, :customer_email, :shipping_address, :phone, :total_price, :status)";

            $orderStmt = $this->db->prepare($orderSql);

            $orderStmt->execute([
                "customer_id" => $customerId,
                "customer_name" => $customerName,
                "customer_email" => $customerEmail,
                "shipping_address" => $shippingAddress,
                "phone" => $phone,
                "total_price" => $totalPrice,
                "status" => "completed"
            ]);

            $orderId = (int) $this->db->lastInsertId();

            $itemSql = "INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES
                (:order_id, :product_id, :quantity, :price)";

            $itemStmt = $this->db->prepare($itemSql);

            foreach ($cartItems as $item) {
                $itemStmt->execute([
                    "order_id" => $orderId,
                    "product_id" => (int) $item["id"],
                    "quantity" => (int) $item["quantity"],
                    "price" => (float) $item["price"]
                ]);
            }

            $this->db->commit();

            return $orderId;
        } catch (Exception $e) {
            $this->db->rollBack();
            return 0;
        }
    }
}