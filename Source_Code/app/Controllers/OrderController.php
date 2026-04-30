<?php

namespace App\Controllers;

use App\Core\Session;
use App\Core\Mailer;
use App\Models\Order;

class OrderController
{
    private Order $orderModel;

    public function __construct()
    {
        $this->orderModel = new Order();
    }

    public function placeOrder(array $data): array
    {
        Session::start();

        $customerId = Session::get("user_id");
        $userRole = Session::get("user_role");

        if (!$customerId || $userRole !== "customer") {
            return [
                "success" => false,
                "message" => "You must be logged in as a customer to place an order."
            ];
        }

        $cart = Session::get("checkout_cart") ?? [];
        $total = (float) (Session::get("checkout_total") ?? 0);

        if (!$cart || count($cart) === 0 || $total <= 0) {
            return [
                "success" => false,
                "message" => "Your checkout session is empty. Please return to your cart."
            ];
        }

        $customerName = trim($data["customer_name"] ?? "");
        $customerEmail = trim($data["customer_email"] ?? "");
        $streetAddress = trim($data["street_address"] ?? "");
        $city = trim($data["city"] ?? "");
        $postalCode = trim($data["postal_code"] ?? "");
        $country = trim($data["country"] ?? "");
        $phoneCode = trim($data["phone_code"] ?? "");
        $phoneNumber = trim($data["phone_number"] ?? "");

        if (
            $customerName === "" ||
            $customerEmail === "" ||
            $streetAddress === "" ||
            $city === "" ||
            $postalCode === "" ||
            $country === "" ||
            $phoneCode === "" ||
            $phoneNumber === ""
        ) {
            return [
                "success" => false,
                "message" => "Please fill in all checkout fields."
            ];
        }

        if (!filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
            return [
                "success" => false,
                "message" => "Please enter a valid email address."
            ];
        }

        $shippingAddress = $streetAddress . ", " . $postalCode . " " . $city . ", " . $country;
        $phone = $phoneCode . " " . $phoneNumber;

        $orderId = $this->orderModel->createOrder(
            (int) $customerId,
            $customerName,
            $customerEmail,
            $shippingAddress,
            $phone,
            $total,
            $cart
        );

        if ($orderId <= 0) {
            return [
                "success" => false,
                "message" => "Order could not be completed. Please try again."
            ];
        }

        $emailSent = false;

        try {
            $mailer = new Mailer();
            $emailSent = $mailer->sendOrderConfirmation(
                $customerEmail,
                $customerName,
                $orderId,
                $total,
                $cart
            );
        } catch (\Throwable $e) {
            $emailSent = false;
        }

        Session::remove("checkout_cart");
        Session::remove("checkout_total");

        return [
            "success" => true,
            "message" => $emailSent
                ? "Order placed successfully. A confirmation email has been sent."
                : "Order placed successfully, but the confirmation email could not be sent.",
            "order_id" => $orderId,
            "email_sent" => $emailSent
        ];
    }
}

// This file defines the OrderController class, which handles the order placement process. 
// It checks if the user is logged in as a customer, validates the checkout cart session,
// processes the order by creating a new order record in the database, and sends a confirmation email to the customer. 
// The controller interacts with the Order model to perform database operations related to orders and uses 
// the Mailer class to send emails. It also manages the checkout session data to ensure a smooth checkout experience for the user.