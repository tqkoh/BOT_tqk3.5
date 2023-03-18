-- Apply --
ALTER TABLE `channels` DROP COLUMN `frequency`;
INSERT INTO migrations (version) VALUES ('v0.2.0');
