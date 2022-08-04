-- Deploy imageApp:socketTable to pg

BEGIN;

CREATE TABLE "tag_socket" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "socket" TEXT NOT NULL UNIQUE,
    "image_id" INT NOT NULL UNIQUE,
    "file_name" TEXT NOT NULL UNIQUE
);

COMMIT;
