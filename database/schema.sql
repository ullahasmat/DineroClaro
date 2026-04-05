-- DineroClaro base schema (Supabase/Postgres)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    role TEXT DEFAULT 'user',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    category TEXT,                 -- 'credit_card' | 'bank' | 'investing_app'
    name TEXT NOT NULL,
    provider TEXT,
    description TEXT NOT NULL,
    tags TEXT,
    target_goal TEXT,              -- 'build_credit' | 'save_money' | 'start_investing'
    target_life_stage TEXT,        -- 'new_arrival' | 'first_gen' | 'established'
    featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS user_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recommendation_id INTEGER REFERENCES recommendations(id) ON DELETE CASCADE,
    dismissed BOOLEAN DEFAULT false,
    saved BOOLEAN DEFAULT false,
    shown_at TIMESTAMPTZ DEFAULT now()
);


CREATE TABLE IF NOT EXISTS financial_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    credit_score INTEGER,
    credit_score_range TEXT,       -- 'poor' | 'fair' | 'good' | 'very_good' | 'exceptional'
    monthly_income NUMERIC(12, 2),
    checking_balance NUMERIC(12, 2),
    total_debt NUMERIC(12, 2),
    financial_goal TEXT,           -- 'build_credit' | 'save_money' | 'start_investing'
    risk_tolerance TEXT,           -- 'low' | 'medium' | 'high'
    life_stage TEXT,               -- 'new_arrival' | 'first_gen' | 'established'
    last_updated TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_profiles_user_id ON financial_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_rec_id ON user_recommendations(recommendation_id);
