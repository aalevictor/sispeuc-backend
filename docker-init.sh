#!/bin/bash

# Enable PostGIS extension
echo "Enabling PostGIS extension..."
docker exec -it postgres bash -c "su - postgres -c 'psql -d smul -c \"CREATE EXTENSION IF NOT EXISTS postgis;\"'"

# Verify PostGIS extension is enabled
echo "Verifying PostGIS extension..."
docker exec -it postgres bash -c "su - postgres -c 'psql -d smul -c \"\\dx\"'"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev --schema=prisma/schema

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --schema=prisma/schema

# Seed the database
echo "Seeding the database..."
npx prisma db seed

# Start the NestJS application
echo "Starting the NestJS application..."
npx nest start dev --watch
