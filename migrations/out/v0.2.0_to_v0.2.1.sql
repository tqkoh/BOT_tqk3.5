-- Apply --
ALTER TABLE `channels` ADD COLUMN `frequency` int(11) NOT NULL AFTER `id`;
INSERT INTO migrations (version) VALUES ('v0.2.1');
