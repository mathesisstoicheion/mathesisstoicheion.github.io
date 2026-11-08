#!/bin/sh
# Tests the database rules on a local, empty, throwaway Postgres (never the site's real database):
#   PGHOST=… PGPORT=… PGUSER=postgres sh supabase/tests/run.sh
# Makes a fresh database, gives it Supabase's bare essentials (stub.sql), runs every migration in order, then each test.
set -e
cd "$(dirname "$0")"
DB=mathesis_test
psql -q -d postgres -c "drop database if exists $DB" -c "create database $DB"
P="psql -q -v ON_ERROR_STOP=1 -d $DB"
$P -f stub.sql
for m in ../migrations/*.sql; do $P -f "$m" > /dev/null; done
for t in *_test.sql; do echo "== $t"; $P -f "$t" > /dev/null; done
echo "All database tests passed."
