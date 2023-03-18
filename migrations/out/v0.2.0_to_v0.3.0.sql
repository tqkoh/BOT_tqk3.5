-- Apply --
ALTER TABLE `channels` ADD COLUMN `frequency` int(11) NOT NULL DEFAULT 5 AFTER `id`;
INSERT INTO migrations (version) VALUES ('v0.3.0');
