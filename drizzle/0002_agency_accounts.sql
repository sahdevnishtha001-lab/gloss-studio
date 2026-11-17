ALTER TABLE `agency_listings` ADD `agency_login_email` text;
--> statement-breakpoint
ALTER TABLE `agency_listings` ADD `modeling_fields` text DEFAULT '' NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `agency_login_email_unique` ON `agency_listings` (`agency_login_email`);
--> statement-breakpoint
CREATE TABLE `agency_accounts` (
 `user_id` text PRIMARY KEY NOT NULL,
 `agency_id` text NOT NULL,
 `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agency_account_agency_unique` ON `agency_accounts` (`agency_id`);
--> statement-breakpoint
CREATE TABLE `model_referrals` (
 `model_user_id` text PRIMARY KEY NOT NULL,
 `agency_id` text NOT NULL,
 `referral_code` text NOT NULL,
 `signed_in_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `agency_verified_purchases` (
 `payment_reference` text PRIMARY KEY NOT NULL,
 `agency_id` text NOT NULL,
 `qualifying_amount_paise` integer NOT NULL,
 `currency` text NOT NULL,
 `payment_state` text NOT NULL,
 `verified_at` text NOT NULL
);
