-- AlterTable
-- WARNING: This will drop and recreate the Contact table, losing all existing data.
-- If you have important contact data, please back it up first.

-- Drop existing table
DROP TABLE IF EXISTS "Contact" CASCADE;

-- CreateTable with UUID
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "timeline" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "requirements" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'new',

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
