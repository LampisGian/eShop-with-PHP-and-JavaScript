// API endpoint to test email sending functionality
// This endpoint is used to verify that the email configuration is correct and that the application can send 
//emails successfully. It sends a test email to the configured email address and returns a JSON response indicating whether
// the email was sent successfully.

<?php

require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

$config = require __DIR__ . '/../config/mail.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['port'];

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['from_email']);

    $mail->isHTML(true);
    $mail->Subject = 'eShop Test Email';
    $mail->Body = '<h2>eShop test email</h2><p>Brevo SMTP is working correctly.</p>';

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Test email sent successfully.'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Email could not be sent.',
        'error' => $mail->ErrorInfo
    ]);
}