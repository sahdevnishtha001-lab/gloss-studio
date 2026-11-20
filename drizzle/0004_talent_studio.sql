CREATE TABLE talent_accounts (
 user_id text PRIMARY KEY NOT NULL,
 id text NOT NULL UNIQUE,
 profession text NOT NULL CHECK(profession IN ('model','makeup','hair','designer','agency','hotel','photographer')),
 name text NOT NULL,
 city text NOT NULL,
 avatar_key text,
 avatar_mime text,
 created_at text NOT NULL
);
--> statement-breakpoint
CREATE TRIGGER talent_profession_fixed BEFORE UPDATE OF profession ON talent_accounts
WHEN OLD.profession <> NEW.profession BEGIN SELECT RAISE(ABORT, 'Profession cannot be changed'); END;
--> statement-breakpoint
CREATE TABLE shoot_concepts (
 id text PRIMARY KEY NOT NULL,
 owner_id text NOT NULL,
 title text NOT NULL,
 brief text NOT NULL,
 city text NOT NULL,
 city_key text NOT NULL,
 shoot_date text NOT NULL,
 location_note text NOT NULL,
 exchange_note text NOT NULL,
 roles_json text NOT NULL,
 owner_role text NOT NULL,
 status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','finalised','completed','cancelled')),
 studio_note text NOT NULL DEFAULT '',
 created_at text NOT NULL
);
--> statement-breakpoint
CREATE INDEX shoot_city_status ON shoot_concepts(city_key, status);
--> statement-breakpoint
CREATE TABLE shoot_requests (
 id text PRIMARY KEY NOT NULL,
 concept_id text NOT NULL,
 applicant_id text NOT NULL,
 role text NOT NULL,
 message text NOT NULL,
 portfolio_url text NOT NULL,
 referral_id text,
 status text NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','selected','declined','withdrawn')),
 created_at text NOT NULL,
 UNIQUE(concept_id, applicant_id)
);
--> statement-breakpoint
CREATE UNIQUE INDEX shoot_selected_role ON shoot_requests(concept_id, role) WHERE status = 'selected';
--> statement-breakpoint
CREATE TABLE shoot_invitations (
 id text PRIMARY KEY NOT NULL,
 concept_id text NOT NULL,
 referrer_id text NOT NULL,
 role text NOT NULL,
 created_at text NOT NULL
);
--> statement-breakpoint
CREATE TABLE model_affiliations (
 id text PRIMARY KEY NOT NULL,
 model_id text NOT NULL,
 agency_id text NOT NULL,
 portfolio_url text NOT NULL,
 message text NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','declined','withdrawn')),
 created_at text NOT NULL,
 UNIQUE(model_id, agency_id)
);
