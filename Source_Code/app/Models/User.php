<?php

namespace App\Models;

use App\Core\Database;
use PDO;

class User
{
    private PDO $db;

    public function __construct()
    {
        $this->db = (new Database())->connect();
    }

    public function create(string $fullName, string $email, string $password, string $role): bool
    {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (full_name, email, password, role)
                VALUES (:full_name, :email, :password, :role)";

        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            "full_name" => $fullName,
            "email" => $email,
            "password" => $hashedPassword,
            "role" => $role
        ]);
    }

    public function findByEmail(string $email): ?array
    {
        $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            "email" => $email
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function findById(int $id): ?array
    {
        $sql = "SELECT id, full_name, email, role, created_at FROM users WHERE id = :id LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            "id" => $id
        ]);

        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function emailExistsForOtherUser(string $email, int $currentUserId): bool
    {
        $sql = "SELECT id FROM users WHERE email = :email AND id != :id LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            "email" => $email,
            "id" => $currentUserId
        ]);

        return (bool) $stmt->fetch();
    }

    public function updateProfile(int $id, string $fullName, string $email, ?string $newPassword = null): bool
    {
        if ($newPassword !== null && $newPassword !== "") {
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            $sql = "UPDATE users
                    SET full_name = :full_name,
                        email = :email,
                        password = :password
                    WHERE id = :id";

            $stmt = $this->db->prepare($sql);

            return $stmt->execute([
                "full_name" => $fullName,
                "email" => $email,
                "password" => $hashedPassword,
                "id" => $id
            ]);
        }

        $sql = "UPDATE users
                SET full_name = :full_name,
                    email = :email
                WHERE id = :id";

        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            "full_name" => $fullName,
            "email" => $email,
            "id" => $id
        ]);
    }
}

// This file defines the User class, which is responsible for handling user-related operations in the application. 
// The class includes methods for creating a new user, finding a user by email or ID, checking if an email is already used by another user, and updating a user's profile information. 
// It interacts with the database using PDO to perform these operations and is essential for managing user accounts,
//  authentication and profile management in the e-commerce application. The class ensures that user data is securely 
// stored and provides the necessary functionality for user registration and profile updates.