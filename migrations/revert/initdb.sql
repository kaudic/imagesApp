-- Revert imageApp:initdb from pg

BEGIN;

DROP TABLE "image_person" CASCADE;
DROP TABLE "image" CASCADE;
DROP TABLE "event" CASCADE;
DROP TABLE "locality" CASCADE;
DROP TABLE "person" CASCADE;

COMMIT;
