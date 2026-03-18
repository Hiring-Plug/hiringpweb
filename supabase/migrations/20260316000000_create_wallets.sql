-- Create wallets table for Web3 authentication
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL UNIQUE,
    chain_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Turn on RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own wallets"
ON wallets FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets"
ON wallets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets"
ON wallets FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
