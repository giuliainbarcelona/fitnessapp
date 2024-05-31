SET FOREIGN_KEY_CHECKS = 0;

  DROP TABLE IF EXISTS `users`;
  DROP TABLE IF EXISTS `workouts`;
  DROP TABLE IF EXISTS `exercises`;
  

CREATE TABLE `users`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);
CREATE TABLE `workouts`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `date` DATE NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
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
    `instructions` VARCHAR(255) NOT NULL,
    FOREIGN KEY(`workout_id`) REFERENCES `workouts`(`id`)
);


SET FOREIGN_KEY_CHECKS = 1;

    