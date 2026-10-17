-- =============================================================================
-- Nagriva Dashboard — administrator management of public.feedbacks
-- =============================================================================
-- Context
--   The dashboard administrator can now edit and delete feedback entries in
--   addition to publishing them. The public website and anonymous visitors must
--   never be able to UPDATE or DELETE any feedback.
--
-- Administrator (existing Supabase Auth account — not created here):
--   uid : dd8a76a2-8769-4518-bab7-a70d385fe9f1
--
-- NOTE ON THE ADMIN UID
--   This UID was supplied with the edit/delete feature request. It differs in
--   its final segment from the UID recorded in the earlier inquiries and
--   publish migrations (`dd8a76a2-8769-4518-bab7-a70d385ef9f1`). Verify which
--   value matches the live administrator account before applying (step 0).
--
-- What this migration changes (public.feedbacks ONLY):
--   1. Administrator-only SELECT so the dashboard can list every status
--      (pending / published / rejected) for moderation. The existing public
--      "published only" SELECT policy is left untouched; permissive policies
--      are OR'd, so this only widens access for the single admin account.
--   2. Administrator-only UPDATE. The USING clause limits which existing rows
--      may be targeted to the administrator, and the WITH CHECK clause
--      guarantees the resulting row is still only reachable by the admin.
--   3. Administrator-only DELETE, restricted with USING.
--   4. Leaves the existing pending-only INSERT policies and the administrator
--      publishing INSERT policy untouched.
--
-- It is idempotent and does not modify any other table or database object.
--
-- !! FOR MANUAL REVIEW ONLY — DO NOT RUN AUTOMATICALLY. Apply it yourself in
-- !! the Supabase SQL editor after reviewing the current policies (step 0).
-- =============================================================================

begin;

-- Policies only take effect while RLS is enabled. Safe and idempotent.
alter table public.feedbacks enable row level security;

-- -----------------------------------------------------------------------------
-- 0. (Review first) Inspect the policies that currently exist and confirm the
--    existing public SELECT / INSERT policies are present before applying.
-- -----------------------------------------------------------------------------
-- select policyname, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'feedbacks'
-- order by cmd, policyname;

-- -----------------------------------------------------------------------------
-- 1. Administrator-only read access, so the dashboard can moderate every row.
-- -----------------------------------------------------------------------------
drop policy if exists "administrator can read feedback" on public.feedbacks;
create policy "administrator can read feedback"
  on public.feedbacks
  for select
  to authenticated
  using (auth.uid() = 'dd8a76a2-8769-4518-bab7-a70d385fe9f1'::uuid);

-- -----------------------------------------------------------------------------
-- 2. Administrator-only UPDATE. USING restricts the rows that may be changed;
--    WITH CHECK restricts the resulting rows. Both are limited to the admin, so
--    no other authenticated user can modify feedback.
-- -----------------------------------------------------------------------------
drop policy if exists "administrator can update feedback" on public.feedbacks;
create policy "administrator can update feedback"
  on public.feedbacks
  for update
  to authenticated
  using (auth.uid() = 'dd8a76a2-8769-4518-bab7-a70d385fe9f1'::uuid)
  with check (auth.uid() = 'dd8a76a2-8769-4518-bab7-a70d385fe9f1'::uuid);

-- -----------------------------------------------------------------------------
-- 3. Administrator-only DELETE.
-- -----------------------------------------------------------------------------
drop policy if exists "administrator can delete feedback" on public.feedbacks;
create policy "administrator can delete feedback"
  on public.feedbacks
  for delete
  to authenticated
  using (auth.uid() = 'dd8a76a2-8769-4518-bab7-a70d385fe9f1'::uuid);

-- -----------------------------------------------------------------------------
-- 4. Public INSERT policies and the administrator publishing policy are NOT
--    modified here.
-- -----------------------------------------------------------------------------

commit;

-- -----------------------------------------------------------------------------
-- Verification (run after applying). Expect:
--   * the pre-existing public INSERT policies for anon/authenticated
--   * the existing "administrator can publish feedback" INSERT policy
--   * the new administrator SELECT / UPDATE / DELETE policies, each restricted
--     to the administrator UUID
--   * unchanged public SELECT policy exposing published feedback only
-- -----------------------------------------------------------------------------
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'feedbacks'
order by cmd, policyname;
