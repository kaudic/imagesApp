-- Deploy imageApp:initdb to pg

BEGIN;

CREATE TABLE "person" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "locality" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "event" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE
);

CREATE TABLE "image" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "file_name" TEXT NOT NULL UNIQUE,
    "year" INTEGER,
    "locality" INT REFERENCES "locality" ("id"),
    "event" INT REFERENCES "event" ("id"),
    "tag" BOOLEAN DEFAULT false,
    "fingerprints" TEXT UNIQUE
);

CREATE TABLE "image_person" (
    "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "image_id" INT NOT NULL REFERENCES "image" ("id") ON DELETE CASCADE, 
    "person_id" INT NOT NULL REFERENCES "person" ("id")
);

COMMIT;
