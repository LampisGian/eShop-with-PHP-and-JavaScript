<?php

namespace App\Core;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
    private array $config;

    public function __construct()
    {
        $this->config = require __DIR__ . '/../../config/mail.php';
    }

    public function sendOrderConfirmation(
        string $customerEmail,
        string $customerName,
        int $orderId,
        float $totalPrice,
        array $cartItems
    ): bool {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = $this->config['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $this->config['username'];
            $mail->Password = $this->config['password'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $this->config['port'];

            $mail->setFrom($this->config['from_email'], $this->config['from_name']);
            $mail->addAddress($customerEmail, $customerName);

            $mail->isHTML(true);
            $mail->Subject = 'Order Confirmation #' . $orderId;
            $mail->Body = $this->buildOrderEmailHtml($customerName, $orderId, $totalPrice, $cartItems);
            $mail->AltBody = $this->buildOrderEmailText($customerName, $orderId, $totalPrice, $cartItems);

            return $mail->send();
        } catch (Exception $e) {
            return false;
        }
    }

    private function buildOrderEmailHtml(
        string $customerName,
        int $orderId,
        float $totalPrice,
        array $cartItems
    ): string {
        $itemsHtml = '';

        foreach ($cartItems as $item) {
            $title = htmlspecialchars($item['title']);
            $quantity = (int) $item['quantity'];
            $price = number_format((float) $item['price'], 2);
            $lineTotal = number_format((float) $item['line_total'], 2);

            $itemsHtml .= "
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #e5e7eb;'>{$title}</td>
                    <td style='padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;'>{$quantity}</td>
                    <td style='padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;'>€{$price}</td>
                    <td style='padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;'>€{$lineTotal}</td>
                </tr>
            ";
        }

        $safeName = htmlspecialchars($customerName);
        $formattedTotal = number_format($totalPrice, 2);

        return "
            <div style='font-family: Arial, sans-serif; background: #f4f6f8; padding: 28px; color: #111827;'>
                <div style='max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.08);'>
                    <div style='background: #0284c7; color: #ffffff; padding: 24px 28px;'>
                        <h1 style='margin: 0; font-size: 26px;'>Order Confirmation</h1>
                        <p style='margin: 8px 0 0;'>Thank you for your order, {$safeName}.</p>
                    </div>

                    <div style='padding: 28px;'>
                        <p style='font-size: 16px;'>Your order has been successfully placed.</p>
                        <p style='font-size: 16px;'><strong>Order number:</strong> #{$orderId}</p>

                        <table style='width: 100%; border-collapse: collapse; margin-top: 22px;'>
                            <thead>
                                <tr>
                                    <th style='padding: 10px; text-align: left; border-bottom: 2px solid #d1d5db;'>Product</th>
                                    <th style='padding: 10px; text-align: center; border-bottom: 2px solid #d1d5db;'>Qty</th>
                                    <th style='padding: 10px; text-align: right; border-bottom: 2px solid #d1d5db;'>Price</th>
                                    <th style='padding: 10px; text-align: right; border-bottom: 2px solid #d1d5db;'>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {$itemsHtml}
                            </tbody>
                        </table>

                        <p style='font-size: 20px; margin-top: 24px; text-align: right;'>
                            <strong>Total: €{$formattedTotal}</strong>
                        </p>

                        <p style='margin-top: 26px; color: #6b7280;'>
                            We have received your order and it is now being processed.
                        </p>
                    </div>
                </div>
            </div>
        ";
    }

    private function buildOrderEmailText(
        string $customerName,
        int $orderId,
        float $totalPrice,
        array $cartItems
    ): string {
        $text = "Hello {$customerName},\n\n";
        $text .= "Thank you for your order.\n";
        $text .= "Order number: #{$orderId}\n\n";
        $text .= "Items:\n";

        foreach ($cartItems as $item) {
            $title = $item['title'];
            $quantity = (int) $item['quantity'];
            $price = number_format((float) $item['price'], 2);
            $lineTotal = number_format((float) $item['line_total'], 2);

            $text .= "- {$title} x {$quantity} | €{$price} each | €{$lineTotal}\n";
        }

        $formattedTotal = number_format($totalPrice, 2);

        $text .= "\nTotal: €{$formattedTotal}\n\n";
        $text .= "We have received your order and it is now being processed.\n";
        $text .= "eShop Project";

        return $text;
    }
}

// This file defines the Mailer class, which is responsible for sending order confirmation emails to customers. 
// It uses the PHPMailer library to send emails via SMTP and includes methods for building both HTML and plain text versions of the order confirmation email. 
// The sendOrderConfirmation method takes the customer's email, name, order ID, total price, and cart items as parameters and attempts to send an email with the order details. 
// If the email is sent successfully, it returns true; otherwise, it returns false. The class also loads email configuration settings from a separate config file, allowing for easy customization of the email sending process.