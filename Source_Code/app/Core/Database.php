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

// This file defines the Database class, which is responsible for establishing a connection to the MySQL database using PDO. 
// It includes properties for the database connection parameters and a method to connect to the database. 
// The connect method checks if a connection already exists and creates a new one if it doesn't, while also setting error handling and fetch mode attributes for the PDO instance. 
// This class is essential for managing database interactions throughout the application, allowing other classes to easily access the database connection when needed.