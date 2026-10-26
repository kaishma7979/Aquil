-- Aquill setup. Paste all of this in Supabase > SQL Editor and click Run. Safe to run twice.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'member' check (role in ('admin','member')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
insert into public.profiles (id, email) select id, email from auth.users on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('GST','EPFO/ESIC','Professional Tax','ROC/MCA','Income Tax')),
  title text not null,
  link text,
  published date not null default current_date,
  note text,
  created_by uuid default auth.uid(),
  created_at timestamptz default now()
);
alter table public.updates enable row level security;
drop policy if exists "read updates" on public.updates;
drop policy if exists "admin add updates" on public.updates;
drop policy if exists "admin delete updates" on public.updates;
create policy "read updates" on public.updates for select to authenticated using (true);
create policy "admin add updates" on public.updates for insert to authenticated with check (public.is_admin());
create policy "admin delete updates" on public.updates for delete to authenticated using (public.is_admin());

-- Make admins: put your two real emails here, then run this part again after creating the users.
update public.profiles set role = 'admin' where email in ('FIRST_EMAIL_HERE', 'SECOND_EMAIL_HERE');
