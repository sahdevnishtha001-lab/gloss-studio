CREATE TABLE `portfolios` (
  `id` text PRIMARY KEY NOT NULL,
  `owner_id` text NOT NULL,
  `published` integer DEFAULT 0 NOT NULL,
  `generation` integer DEFAULT 0 NOT NULL,
  `revision` text,
  `document_json` text,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolios_owner_unique` ON `portfolios` (`owner_id`);
--> statement-breakpoint
CREATE TABLE `publication_builds` (
  `id` text PRIMARY KEY NOT NULL,
  `portfolio_id` text NOT NULL,
  `owner_id` text NOT NULL,
  `generation` integer NOT NULL,
  `document_json` text NOT NULL,
  `created_at` text NOT NULL
);
