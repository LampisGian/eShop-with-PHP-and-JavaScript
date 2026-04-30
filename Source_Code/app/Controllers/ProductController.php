<?php

namespace App\Controllers;

use App\Core\Session;
use App\Models\Product;

class ProductController
{
    private Product $productModel;

    public function __construct()
    {
        $this->productModel = new Product();
    }

    public function getCategories(): array
    {
        return $this->productModel->getCategories();
    }

    public function getAllProducts(): array
    {
        return [
            "success" => true,
            "products" => $this->productModel->getAll()
        ];
    }

    public function getSellerProducts(): array
    {
        Session::start();

        $sellerId = Session::get("user_id");
        $role = Session::get("user_role");

        if (!$sellerId || $role !== "seller") {
            return [
                "success" => false,
                "message" => "Only logged-in sellers can view their products.",
                "products" => []
            ];
        }

        return [
            "success" => true,
            "products" => $this->productModel->getBySeller((int) $sellerId)
        ];
    }

    public function createProduct(array $postData, array $fileData): array
    {
        Session::start();

        $sellerId = Session::get("user_id");
        $role = Session::get("user_role");

        if (!$sellerId || $role !== "seller") {
            return [
                "success" => false,
                "message" => "Only logged-in sellers can upload products."
            ];
        }

        $title = trim($postData["title"] ?? "");
        $description = trim($postData["description"] ?? "");
        $categoryId = (int) ($postData["category_id"] ?? 0);
        $price = (float) ($postData["price"] ?? 0);
        $stock = (int) ($postData["stock"] ?? 0);

        if ($title === "" || $description === "" || $categoryId <= 0 || $price <= 0 || $stock < 0) {
            return [
                "success" => false,
                "message" => "Please fill in all product fields correctly."
            ];
        }

        if (!isset($fileData["image"]) || $fileData["image"]["error"] !== UPLOAD_ERR_OK) {
            return [
                "success" => false,
                "message" => "Please upload a valid product image."
            ];
        }

        $imageResult = $this->uploadImage($fileData["image"]);

        if (!$imageResult["success"]) {
            return $imageResult;
        }

        $created = $this->productModel->create(
            (int) $sellerId,
            $categoryId,
            $title,
            $description,
            $price,
            $stock,
            $imageResult["path"]
        );

        if (!$created) {
            return [
                "success" => false,
                "message" => "Product could not be saved."
            ];
        }

        return [
            "success" => true,
            "message" => "Product uploaded successfully."
        ];
    }

    private function uploadImage(array $image): array
    {
        $allowedTypes = [
            "image/jpeg" => "jpg",
            "image/png" => "png",
            "image/webp" => "webp"
        ];

        $mimeType = mime_content_type($image["tmp_name"]);

        if (!array_key_exists($mimeType, $allowedTypes)) {
            return [
                "success" => false,
                "message" => "Only JPG, PNG and WEBP images are allowed."
            ];
        }

        $maxSize = 5 * 1024 * 1024;

        if ($image["size"] > $maxSize) {
            return [
                "success" => false,
                "message" => "Image size must be less than 5MB."
            ];
        }

        $extension = $allowedTypes[$mimeType];
        $safeName = uniqid("product_", true) . "." . $extension;

        $uploadDir = dirname(__DIR__, 2) . "/images/products/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $targetPath = $uploadDir . $safeName;

        if (!move_uploaded_file($image["tmp_name"], $targetPath)) {
            return [
                "success" => false,
                "message" => "Image upload failed."
            ];
        }

        return [
            "success" => true,
            "path" => "images/products/" . $safeName
        ];
    }
}

// This file defines the ProductController class, which handles product-related operations such as retrieving categories, fetching products, and creating new products. 
// It interacts with the Product model to perform database operations and uses the Session class to manage user 
//sessions and control access to certain features based on user roles. The controller also includes a 
// private method for handling image uploads, ensuring that only valid images are accepted and stored
//  securely on the server.