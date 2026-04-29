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
}