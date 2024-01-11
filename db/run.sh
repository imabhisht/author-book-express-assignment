#!/bin/bash

# Wait until PostgreSQL is ready to accept connections
until pg_isready -h postgres -p 5432 -q -U admin; do
  echo "Waiting for PostgreSQL to become available..."
  sleep 1
done

# Execute the SQL script
psql -h postgres -U admin -d postgres -f /docker-entrypoint-initdb.d/init.sql
