-- Add role_tier to board_members table
ALTER TABLE public.board_members 
ADD COLUMN role_tier TEXT NOT NULL DEFAULT 'council' 
CHECK (role_tier IN ('council', 'executive', 'advisor'));

-- Update existing members to be in the sovereign council by default
UPDATE public.board_members SET role_tier = 'council' WHERE role_tier IS NULL;

-- Add sub_title for additional institutional detail
ALTER TABLE public.board_members 
ADD COLUMN sub_title TEXT;

-- Verify RLS
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
