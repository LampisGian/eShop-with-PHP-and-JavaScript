<?php

namespace App\Controllers;

use App\Core\Session;
use App\Models\User;

class ProfileController
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function getProfile(): array
    {
        Session::start();

        $userId = Session::get("user_id");

        if (!$userId) {
            return [
                "success" => false,
                "message" => "You must be logged in to view your profile.",
                "user" => null
            ];
        }

        $user = $this->userModel->findById((int) $userId);

        if (!$user) {
            return [
                "success" => false,
                "message" => "User profile could not be found.",
                "user" => null
            ];
        }

        return [
            "success" => true,
            "user" => $user
        ];
    }

    public function updateProfile(array $data): array
    {
        Session::start();

        $userId = Session::get("user_id");

        if (!$userId) {
            return [
                "success" => false,
                "message" => "You must be logged in to update your profile."
            ];
        }

        $fullName = trim($data["full_name"] ?? "");
        $email = trim($data["email"] ?? "");
        $newPassword = $data["new_password"] ?? "";
        $confirmPassword = $data["confirm_password"] ?? "";

        if ($fullName === "" || $email === "") {
            return [
                "success" => false,
                "message" => "Full name and email are required."
            ];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "message" => "Please enter a valid email address."
            ];
        }

        if ($this->userModel->emailExistsForOtherUser($email, (int) $userId)) {
            return [
                "success" => false,
                "message" => "This email is already used by another account."
            ];
        }

        if ($newPassword !== "" || $confirmPassword !== "") {
            if (strlen($newPassword) < 6) {
                return [
                    "success" => false,
                    "message" => "New password must be at least 6 characters."
                ];
            }

            if ($newPassword !== $confirmPassword) {
                return [
                    "success" => false,
                    "message" => "New passwords do not match."
                ];
            }
        }

        $passwordToUpdate = $newPassword !== "" ? $newPassword : null;

        $updated = $this->userModel->updateProfile(
            (int) $userId,
            $fullName,
            $email,
            $passwordToUpdate
        );

        if (!$updated) {
            return [
                "success" => false,
                "message" => "Profile could not be updated."
            ];
        }

        Session::set("user_name", $fullName);
        Session::set("user_email", $email);

        return [
            "success" => true,
            "message" => "Profile updated successfully.",
            "user" => [
                "id" => (int) $userId,
                "name" => $fullName,
                "email" => $email,
                "role" => Session::get("user_role")
            ]
        ];
    }
}
