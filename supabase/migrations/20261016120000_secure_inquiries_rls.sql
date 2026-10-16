-- =============================================================================
-- Nagriva Dashboard — secure Row Level Security for public.inquiries
-- =============================================================================
-- Context
--   Single-administrator dashboard. The public Nagriva website form inserts
--   anonymous leads into public.inquiries. The dashboard only ever READS those
--   rows, and only after the administrator signs in with Supabase Auth.
--
-- Administrator (existing Supabase Auth account — not created here):
--   email : redwanaitlhadj16@gmail.com
--   uid   : dd8a76a2-8769-4518-bab7-a70d385ef9f1
--
-- What this migration changes (public.inquiries ONLY):
--   1. Preserves the existing anonymous INSERT policy (untouched).
--   2. Drops the broad authenticated SELECT / UPDATE / DELETE policies.
--   3. Adds a SELECT policy restricted to the administrator UUID.
--   4. Grants no SELECT to anon / public.
--   5. Grants no UPDATE / DELETE to authenticated (absence of a policy = deny).
--
-- It is idempotent and does NOT touch any other table or policy.
--
-- !! FOR MANUAL REVIEW ONLY — DO NOT RUN AUTOMATICALLY. Apply it yourself in
-- !! the Supabase SQL editor after reviewing the current policies (step 0).
-- =============================================================================

begin;

-- Policies only take effect while RLS is enabled. This is safe/idempotent and
-- targets the same table we are already securing.
alter table public.inquiries enable row level security;

-- -----------------------------------------------------------------------------
-- 0. (Review first) Inspect the policies that currently exist.
--    Run this SELECT before the DROP statements and confirm the names match.
-- -----------------------------------------------------------------------------
-- select policyname, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'inquiries'
-- order by cmd, policyname;

-- -----------------------------------------------------------------------------
-- 1. Preserve the anonymous INSERT used by the public website form.
--    Intentionally NOT dropped or modified. Confirm it still exists in the
--    verification step at the bottom.
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 2. Remove the broad authenticated policies that let any authenticated user
--    read, update, or delete every inquiry.
-- -----------------------------------------------------------------------------
drop policy if exists "authenticated can view inquiries" on public.inquiries;
drop policy if exists "authenticated can update inquiries" on public.inquiries;
drop policy if exists "authenticated can delete inquiries" on public.inquiries;

-- -----------------------------------------------------------------------------
-- 3. Administrator-only read access. `auth.uid()` is the authenticated user's
--    UUID taken from the verified JWT issued by Supabase Auth.
-- -----------------------------------------------------------------------------
drop policy if exists "administrator can read inquiries" on public.inquiries;
create policy "administrator can read inquiries"
  on public.inquiries
  for select
  to authenticated
  using (auth.uid() = 'dd8a76a2-8769-4518-bab7-a70d385ef9f1'::uuid);

-- -----------------------------------------------------------------------------
-- 4 & 5. No UPDATE / DELETE policies are created for `authenticated`, and no
--        SELECT policy is created for `anon` / `public`. With RLS enabled, the
--        absence of a matching policy denies the operation by default.
-- -----------------------------------------------------------------------------

commit;

-- -----------------------------------------------------------------------------
-- Verification (run after applying). Expect:
--   * a SELECT policy for `authenticated` restricted to the admin UUID
--   * the anon INSERT policy still present
--   * NO authenticated UPDATE / DELETE policies
-- -----------------------------------------------------------------------------
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'inquiries'
order by cmd, policyname;
