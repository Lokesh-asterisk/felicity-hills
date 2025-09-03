
#!/bin/bash

# Database Export Script for Felicity Hills Application
# This script exports both schema and data from the PostgreSQL database

# Load environment variables if .env file exists
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL or create a .env file with DATABASE_URL"
    exit 1
fi

# Create exports directory
mkdir -p exports

# Get current timestamp for file naming
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "Starting database export..."

# Export schema only
echo "Exporting database schema..."
pg_dump "$DATABASE_URL" --schema-only --no-owner --no-privileges > "exports/schema_$TIMESTAMP.sql"

if [ $? -eq 0 ]; then
    echo "✅ Schema exported to: exports/schema_$TIMESTAMP.sql"
else
    echo "❌ Failed to export schema"
    exit 1
fi

# Export data only
echo "Exporting database data..."
pg_dump "$DATABASE_URL" --data-only --no-owner --no-privileges > "exports/data_$TIMESTAMP.sql"

if [ $? -eq 0 ]; then
    echo "✅ Data exported to: exports/data_$TIMESTAMP.sql"
else
    echo "❌ Failed to export data"
    exit 1
fi

# Export complete database (schema + data)
echo "Exporting complete database..."
pg_dump "$DATABASE_URL" --no-owner --no-privileges > "exports/complete_dump_$TIMESTAMP.sql"

if [ $? -eq 0 ]; then
    echo "✅ Complete database exported to: exports/complete_dump_$TIMESTAMP.sql"
else
    echo "❌ Failed to export complete database"
    exit 1
fi

# Export custom format (compressed)
echo "Exporting database in custom format..."
pg_dump "$DATABASE_URL" --format=custom --no-owner --no-privileges > "exports/database_$TIMESTAMP.dump"

if [ $? -eq 0 ]; then
    echo "✅ Custom format database exported to: exports/database_$TIMESTAMP.dump"
else
    echo "❌ Failed to export database in custom format"
fi

echo ""
echo "📊 Database Export Summary:"
echo "================================"
ls -la exports/*$TIMESTAMP*

echo ""
echo "🔧 To restore the database:"
echo "Schema only: psql \$DATABASE_URL < exports/schema_$TIMESTAMP.sql"
echo "Data only: psql \$DATABASE_URL < exports/data_$TIMESTAMP.sql"
echo "Complete: psql \$DATABASE_URL < exports/complete_dump_$TIMESTAMP.sql"
echo "Custom format: pg_restore -d \$DATABASE_URL exports/database_$TIMESTAMP.dump"

echo ""
echo "✅ Database export completed successfully!"
