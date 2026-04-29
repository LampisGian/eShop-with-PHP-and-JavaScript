<?php

namespace App\Controllers;

use App\Models\User;
use App\Core\Session;

class AuthController
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function register(string $fullName, string $email, string $password, string $role): bool
    {
        if ($fullName === "" || $email === "" || $password === "") {
            return false;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        if (!in_array($role, ["customer", "seller"])) {
            return false;
        }

        if ($this->userModel->findByEmail($email)) {
            return false;
        }

        return $this->userModel->create($fullName, $email, $password, $role);
    }

    public function login(string $email, string $password): bool
    {
        $user = $this->userModel->findByEmail($email);

        if (!$user) {
            return false;
        }

        if (!password_verify($password, $user["password"])) {
            return false;
        }

        Session::set("user_id", $user["id"]);
        Session::set("user_name", $user["full_name"]);
        Session::set("user_email", $user["email"]);
        Session::set("user_role", $user["role"]);

        return true;
    }

    public function logout(): void
    {
        Session::destroy();
    }

    public function isLoggedIn(): bool
    {
        return Session::has("user_id");
    }

    public function isSeller(): bool
    {
        return Session::get("user_role") === "seller";
    }

    public function isCustomer(): bool
    {
        return Session::get("user_role") === "customer";
    }
}