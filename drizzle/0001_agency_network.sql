CREATE TABLE `agency_listings` (
 `id` text PRIMARY KEY NOT NULL,
 `name` text NOT NULL,
 `city` text NOT NULL,
 `specialties` text NOT NULL,
 `description` text NOT NULL,
 `website` text NOT NULL,
 `application_url` text NOT NULL,
 `relationship` text NOT NULL,
 `freshers` text DEFAULT 'unknown' NOT NULL,
 `published` integer DEFAULT 0 NOT NULL,
 `referral_enabled` integer DEFAULT 0 NOT NULL,
 `referral_code` text NOT NULL,
 `referral_visits` integer DEFAULT 0 NOT NULL,
 `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agency_referral_code_unique` ON `agency_listings` (`referral_code`);
--> statement-breakpoint
CREATE TABLE `agency_requests` (
 `id` text PRIMARY KEY NOT NULL,
 `submitted_by` text NOT NULL,
 `agency_name` text NOT NULL,
 `contact_name` text NOT NULL,
 `email` text NOT NULL,
 `city` text NOT NULL,
 `website` text NOT NULL,
 `message` text NOT NULL,
 `status` text DEFAULT 'new' NOT NULL,
 `created_at` text NOT NULL
);
