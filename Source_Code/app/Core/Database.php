<?php

namespace App\Core;

use PDO;
use PDOException;

class Database
{
    private string $host = "localhost";
    private string $port = "1233";
    private string $database = "eshop_db";
    private string $username = "root";
    private string $password = "";
    private ?PDO $connection = null;

    public function connect(): PDO
    {
        if ($this->connection === null) {
            try {
                $this->connection = new PDO(
                    "mysql:host={$this->host};port={$this->port};dbname={$this->database};charset=utf8mb4",
                    $this->username,
                    $this->password
                );

                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                die("Database connection failed: " . $e->getMessage());
            }
        }

        return $this->connection;
    }
}