
CREATE TABLE `migrations` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`version` varchar(10) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `channel_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
