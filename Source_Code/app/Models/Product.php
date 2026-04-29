<?php

namespace App\Models;

use App\Core\Database;
use PDO;

class Product
{
    private PDO $db;

    public function __construct()
    {
        $this->db = (new Database())->connect();
    }

    public function create(
        int $sellerId,
        int $categoryId,
        string $title,
        string $description,
        float $price,
        int $stock,
        string $imagePath
    ): bool {
        $sql = "INSERT INTO products 
                (seller_id, category_id, title, description, price, stock, image)
                VALUES 
                (:seller_id, :category_id, :title, :description, :price, :stock, :image)";

        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            "seller_id" => $sellerId,
            "category_id" => $categoryId,
            "title" => $title,
            "description" => $description,
            "price" => $price,
            "stock" => $stock,
            "image" => $imagePath
        ]);
    }

    public function getBySeller(int $sellerId): array
    {
        $sql = "SELECT 
                    products.id,
                    products.title,
                    products.description,
                    products.price,
                    products.stock,
                    products.image,
                    products.created_at,
                    categories.name AS category_name
                FROM products
                LEFT JOIN categories ON products.category_id = categories.id
                WHERE products.seller_id = :seller_id
                ORDER BY products.created_at DESC";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            "seller_id" => $sellerId
        ]);

        return $stmt->fetchAll();
    }

    public function getCategories(): array
    {
        $sql = "SELECT id, name FROM categories ORDER BY name ASC";

        $stmt = $this->db->query($sql);

        return $stmt->fetchAll();
    }
}