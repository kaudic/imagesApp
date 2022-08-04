-- Revert imageApp:socketTable from pg

BEGIN;

DROP TABLE "tag_socket";

COMMIT;
