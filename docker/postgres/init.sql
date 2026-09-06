-- Docker PostgreSQL initialization
-- This runs once when the container is first created

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Log success
DO $$
BEGIN
  RAISE NOTICE 'PostgreSQL initialized for XYZ Eyewear';
END $$;
