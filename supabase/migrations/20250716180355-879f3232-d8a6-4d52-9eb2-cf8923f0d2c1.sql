-- Add approval status column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pending_reason TEXT;

-- Update existing profiles to be approved by default
UPDATE public.profiles SET approved = true WHERE approved IS NULL;

-- Update the handle_new_user function to handle admin approval
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, approved, pending_reason)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'admin' THEN false
      ELSE true
    END,
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'admin' THEN 'Admin registration pending approval'
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

-- Create RLS policy for approved users only
CREATE POLICY "Only approved users can access content" ON public.profiles
  FOR SELECT USING (approved = true OR id = auth.uid());

-- Create a function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT approved FROM public.profiles WHERE id = user_id;
$$;