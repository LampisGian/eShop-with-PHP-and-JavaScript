// This file contains the configuration settings for the mail server used in the e-commerce application. 
// It includes the SMTP host, port, username, password, and default sender information (email and name).   
//These settings are essential for enabling the application to send emails, such as order confirmations, 
//password resets, and other notifications to users. The configuration is returned as an associative array 
//that can be accessed throughout the application whenever email functionality is required.
<?php

return [
    'host' => 'smtp-relay.brevo.com',
    'port' => 587,
    'username' => 'a9a7f7001@smtp-brevo.com',
    'password' => 'xsmtpsib-b50fb2b25b562d207f2c6060b5f7716b961678345fd1fc351d12a231a530881c-bDBIjkrhu1CL4oio',
    'from_email' => 'labischr@gmail.com',
    'from_name' => 'eShop Project'
];