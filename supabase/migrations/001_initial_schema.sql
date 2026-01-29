-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age_range TEXT CHECK (age_range IN ('7-8', '9-10', '11+')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creations table
CREATE TABLE creations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Images (Storage URLs)
  refined_image_url TEXT NOT NULL,
  original_image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  
  -- Metadata
  intent_statement TEXT NOT NULL,
  prompt_state_json JSONB NOT NULL,
  
  -- Certificate
  certificate_pdf_url TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creation stats table (denormalized for performance)
CREATE TABLE creation_stats (
  creation_id UUID PRIMARY KEY REFERENCES creations(id) ON DELETE CASCADE,
  edit_count INTEGER DEFAULT 0,
  variables_used INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  phase_completed_at JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_creations_user_id ON creations(user_id);
CREATE INDEX idx_creations_created_at ON creations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE creation_stats ENABLE ROW LEVEL SECURITY;
