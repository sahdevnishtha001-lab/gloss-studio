CREATE TABLE webinar_registrations (
  email text PRIMARY KEY NOT NULL,
  name text NOT NULL,
  city text NOT NULL DEFAULT '',
  requested_at text NOT NULL
);
