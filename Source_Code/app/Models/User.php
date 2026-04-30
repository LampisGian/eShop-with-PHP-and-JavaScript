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