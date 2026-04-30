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

            foreach ($cartItems as $item) {
                $productId = (int) $item["id"];
                $quantity = (int) $item["quantity"];

                $stockSql = "SELECT stock FROM products WHERE id = :product_id FOR UPDATE";
                $stockStmt = $this->db->prepare($stockSql);

                $stockStmt->execute([
                    "product_id" => $productId
                ]);

                $product = $stockStmt->fetch();

                if (!$product) {
                    $this->db->rollBack();
                    return 0;
                }

                $currentStock = (int) $product["stock"];

                if ($currentStock < $quantity) {
                    $this->db->rollBack();
                    return 0;
                }
            }

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

            $updateStockSql = "UPDATE products
                SET stock = stock - :quantity
                WHERE id = :product_id";

            $updateStockStmt = $this->db->prepare($updateStockSql);

            foreach ($cartItems as $item) {
                $productId = (int) $item["id"];
                $quantity = (int) $item["quantity"];

                $itemStmt->execute([
                    "order_id" => $orderId,
                    "product_id" => $productId,
                    "quantity" => $quantity,
                    "price" => (float) $item["price"]
                ]);

                $updateStockStmt->execute([
                    "quantity" => $quantity,
                    "product_id" => $productId
                ]);
            }

            $this->db->commit();

            return $orderId;
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }

            return 0;
        }
    }
}