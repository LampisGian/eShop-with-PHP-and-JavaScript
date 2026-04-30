-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: localhost
-- Χρόνος δημιουργίας: 30 Απρ 2026 στις 15:21:54
-- Έκδοση διακομιστή: 10.4.28-MariaDB
-- Έκδοση PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `eshop_db`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Electronics', '2026-04-29 09:44:22'),
(2, 'Clothing', '2026-04-29 09:44:22'),
(3, 'Books', '2026-04-29 09:44:22'),
(4, 'Home', '2026-04-29 09:44:22'),
(5, 'Sports', '2026-04-29 09:44:22'),
(6, 'Fashion', '2026-04-30 13:11:17'),
(7, 'Beauty', '2026-04-30 13:11:17');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(150) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `customer_name`, `customer_email`, `shipping_address`, `phone`, `total_price`, `status`, `created_at`) VALUES
(1, 1, 'Test Customer', 'customer@test.com', 'Agiou Adreou 130, 2622 Patras, Greece', '+30 6974785884', 49.99, 'completed', '2026-04-29 11:44:15'),
(2, 3, 'Charalampos Giannelis', 'labischr@gmail.com', 'Agiou Andreou 130, 26222 Patras, Greece', '+30 6943939935', 49.99, 'completed', '2026-04-29 11:59:55'),
(3, 3, 'Charalampos Giannelis', 'labischr@gmail.com', 'Agiou Andreou 130, 2622 Patras, Greece', '+30 6943939935', 49.99, 'completed', '2026-04-29 12:04:45'),
(4, 3, 'Charalampos Giannelis', 'labischr@gmail.com', 'a, a a, Cyprus', '+357 a', 99.98, 'completed', '2026-04-30 13:07:14');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 1, 49.99),
(2, 2, 1, 1, 49.99),
(3, 3, 1, 1, 49.99),
(4, 4, 1, 2, 49.99);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `products`
--

INSERT INTO `products` (`id`, `seller_id`, `category_id`, `title`, `description`, `price`, `stock`, `image`, `created_at`) VALUES
(1, 2, 1, 'Wireless Headphones', 'Modern wireless headphones with clear sound and comfortable fit.', 49.99, 15, 'images/products/product_69f1e40edcbac8.94434248.webp', '2026-04-29 10:57:18'),
(2, 8, 1, 'Wireless Headphones', 'Modern wireless headphones with clear sound, soft ear cushions and long battery life.', 49.99, 18, 'images/products/demo-headphones.jpg', '2026-04-30 13:11:18'),
(3, 8, 1, 'Smart Watch', 'A stylish smart watch with fitness tracking, notifications and water resistant design.', 89.99, 12, 'images/products/demo-smartwatch.jpg', '2026-04-30 13:11:18'),
(4, 8, 1, 'Bluetooth Speaker', 'Portable Bluetooth speaker with deep bass, compact size and rechargeable battery.', 34.50, 20, 'images/products/demo-speaker.jpg', '2026-04-30 13:11:18'),
(5, 9, 6, 'Classic Denim Jacket', 'Comfortable denim jacket with modern fit, suitable for casual everyday outfits.', 59.90, 9, 'images/products/demo-jacket.jpg', '2026-04-30 13:11:18'),
(6, 9, 6, 'White Sneakers', 'Minimal white sneakers with soft inner sole and durable everyday construction.', 64.99, 14, 'images/products/demo-sneakers.jpg', '2026-04-30 13:11:18'),
(7, 9, 6, 'Cotton Hoodie', 'Warm cotton hoodie with relaxed fit, front pocket and soft fleece interior.', 39.99, 22, 'images/products/demo-hoodie.jpg', '2026-04-30 13:11:18'),
(8, 10, 4, 'Modern Desk Lamp', 'Adjustable desk lamp with clean design, warm light mode and compact base.', 29.99, 16, 'images/products/demo-lamp.jpg', '2026-04-30 13:11:18'),
(9, 10, 4, 'Ceramic Coffee Mug Set', 'Set of four ceramic coffee mugs with minimalist colors and comfortable handle.', 24.90, 30, 'images/products/demo-mugs.jpg', '2026-04-30 13:11:18'),
(10, 10, 4, 'Decorative Pillow', 'Soft decorative pillow for sofa or bedroom with premium fabric texture.', 18.50, 25, 'images/products/demo-pillow.jpg', '2026-04-30 13:11:18'),
(11, 11, 5, 'Yoga Mat', 'Non-slip yoga mat with comfortable thickness, suitable for home workouts and stretching.', 22.99, 19, 'images/products/demo-yogamat.jpg', '2026-04-30 13:11:18'),
(12, 11, 5, 'Training Dumbbells', 'Pair of compact dumbbells for strength training, home fitness and daily exercise.', 44.99, 10, 'images/products/demo-dumbbells.jpg', '2026-04-30 13:11:18'),
(13, 11, 5, 'Running Bottle', 'Lightweight water bottle designed for running, cycling and gym training.', 12.99, 35, 'images/products/demo-bottle.jpg', '2026-04-30 13:11:18'),
(14, 12, 3, 'JavaScript Beginner Guide', 'A beginner friendly book that explains JavaScript fundamentals with examples.', 19.99, 11, 'images/products/demo-jsbook.jpg', '2026-04-30 13:11:18'),
(15, 12, 3, 'PHP Web Development Book', 'Practical PHP book for building dynamic websites, forms, sessions and database apps.', 24.99, 8, 'images/products/demo-phpbook.jpg', '2026-04-30 13:11:18'),
(16, 12, 3, 'Clean Code Notes', 'Compact book with practical notes about clean code, structure and better programming habits.', 14.99, 17, 'images/products/demo-clean-code.jpg', '2026-04-30 13:11:18');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','seller') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Test Customer', 'customer@test.com', '$2y$10$n3ViAuEa.KU1F0pNFR25fewLKMBi32ghCOw9/lAGLWC.tEtwrOkpS', 'customer', '2026-04-29 10:18:06'),
(2, 'Test Seller', 'seller@test.com', '$2y$10$Xg30BRFcWyCO3pXcYd39j.EVYS7xmi7xmvMF786IwlaTomj2tc1hC', 'seller', '2026-04-29 10:18:58'),
(3, 'Charalampos Giannelis', 'labischr@gmail.com', '$2y$10$c0QZ0pLDD7QI51FpjKcLn.808PlhnwvpTmJRr46RXtUXxRj1XyEUW', 'customer', '2026-04-29 11:59:23'),
(4, 'John Customer', 'john.customer@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'customer', '2026-04-30 13:11:17'),
(5, 'Maria Customer', 'maria.customer@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'customer', '2026-04-30 13:11:17'),
(6, 'Nikos Customer', 'nikos.customer@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'customer', '2026-04-30 13:11:17'),
(7, 'Eleni Customer', 'eleni.customer@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'customer', '2026-04-30 13:11:17'),
(8, 'Tech Store Seller', 'tech.seller@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'seller', '2026-04-30 13:11:17'),
(9, 'Fashion Hub Seller', 'fashion.seller@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'seller', '2026-04-30 13:11:17'),
(10, 'Home Living Seller', 'home.seller@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'seller', '2026-04-30 13:11:17'),
(11, 'Sport Market Seller', 'sport.seller@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'seller', '2026-04-30 13:11:17'),
(12, 'Book Corner Seller', 'book.seller@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi', 'seller', '2026-04-30 13:11:18');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Ευρετήρια για πίνακα `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_customer` (`customer_id`);

--
-- Ευρετήρια για πίνακα `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_items_order` (`order_id`),
  ADD KEY `fk_order_items_product` (`product_id`);

--
-- Ευρετήρια για πίνακα `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_products_seller` (`seller_id`),
  ADD KEY `fk_products_category` (`category_id`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT για πίνακα `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT για πίνακα `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT για πίνακα `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Περιορισμοί για πίνακα `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_products_seller` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
