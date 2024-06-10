SET FOREIGN_KEY_CHECKS = 0;

  DROP TABLE IF EXISTS `users`;
  DROP TABLE IF EXISTS `workouts`;
  DROP TABLE IF EXISTS `exercises`;
  

CREATE TABLE `users`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);
CREATE TABLE `workouts`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `date` DATE NOT NULL,
    `sender_id` INT UNSIGNED DEFAULT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`)
);

CREATE TABLE `exercises`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `workout_id` INT UNSIGNED NOT NULL,
    `isDone` TINYINT(1) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `muscle` VARCHAR(255) NOT NULL,
    `equipment` VARCHAR(255) NOT NULL,
    `difficulty` VARCHAR(255) NOT NULL,
    `instructions` TEXT NOT NULL,
    FOREIGN KEY(`workout_id`) REFERENCES `workouts`(`id`)
);


SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO users (id, username, email, password) VALUES
(1, 'user1', 'user1@example.com', 'password1'),
(2, 'user2', 'user2@example.com', 'password2'),
(3, 'user3', 'user3@example.com', 'password3'),
(4, 'user4', 'user4@example.com', 'password4'),
(5, 'user5', 'user5@example.com', 'password5'),
(6, 'word', 'word@word.com', '$2b$10$WRwabwOF3kfNmKhq.EmfceEM6T3j7/neWKZamLceyjt8ZTPt67amS'),
(7, 'person', 'person@gmail.com', '$2b$10$te2a.Lp8EwEVOvr9ueand.a270WbmQZZDdWRv4yBZ2Uk1itdyriU2'),
(8, 'user1', 'user1@email.com', '$2b$10$TjnIK.hLUB9jtITZRkhHKO8dTNfm4ivX3p3cAkttBfqYuP8PlZvkC');

INSERT INTO workouts (id, user_id, date, sender_id) VALUES
(7, 1, '2024-06-10', 1),
(8, 1, '2024-06-11', 1),
(9, 2, '2024-06-12', 2),
(10, 1, '2024-06-13', 1),
(11, 1, '2024-06-14', 1),
(12, 2, '2024-06-15', 2),
(13, 3, '2024-06-16', 3),
(14, 2, '2024-06-17', 1),
(15, 3, '2024-06-18', 2),
(16, 1, '2024-06-19', 3);


