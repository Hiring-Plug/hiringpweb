-- Run this script in your Supabase SQL Editor to create the necessary storage buckets

-- 1. Create 'avatars' bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Create 'banners' bucket
insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

-- 3. Set up access policies (RLS)

-- Public Access for viewing images
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Banner images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'banners' );

-- Upload Access (Authenticated users can upload)
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can upload a banner."
  on storage.objects for insert
  with check ( bucket_id = 'banners' );
