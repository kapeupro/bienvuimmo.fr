-- Migration: Add missing columns to Property table
-- Run this on o2switch phpMyAdmin

-- Add bathrooms column if not exists
ALTER TABLE Property ADD COLUMN IF NOT EXISTS bathrooms INT NULL AFTER bedrooms;

-- Add transactionType column if not exists  
ALTER TABLE Property ADD COLUMN IF NOT EXISTS transactionType VARCHAR(50) NULL AFTER type;

-- Add gesClass column if not exists
ALTER TABLE Property ADD COLUMN IF NOT EXISTS gesClass VARCHAR(10) NULL AFTER energyClass;

-- Make address fields optional (allow NULL)
ALTER TABLE Property MODIFY COLUMN address VARCHAR(255) NULL;
ALTER TABLE Property MODIFY COLUMN city VARCHAR(100) NULL;
ALTER TABLE Property MODIFY COLUMN postalCode VARCHAR(20) NULL;

-- Show result
DESCRIBE Property;
