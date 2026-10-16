-- =============================================================================
-- Nagriva Dashboard — allow the administrator to publish feedback
-- =============================================================================
-- Context
--   Public website visitors submit feedback as `pending` (moderation queue).
--   The dashboard administrator adds feedback that must be public immediately.
--   The existing INSERT policies on public.feedbacks only allow
--   status = 'pending', so changing the client payload alone is rejected by RLS.
--
-- Administrator (existing Supabase Auth account — not created here):
--   uid : dd8a76a2-8769-4518-bab7-a70d385ef9f1
--
-- What this migration changes (public.feedbacks ONLY):
--   1. Leaves the existing pending-only INSERT policies untouched, so public /
--      anonymous submissions continue to insert status = 'pending'.
--   2. Adds ONE additional permissive INSERT policy that allows only the
--      administrator UUID to insert rows with status = 'published'.
--      Permissive policies are OR'd, so this only widens access for that single
--      account. No other authenticated user may insert published feedback.
--   3. Does NOT touch SELECT / UPDATE / DELETE policies. The existing public
--      SELECT policy still exposes published rows only.
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
--    names referenced below are still accurate.
-- -----------------------------------------------------------------------------
-- select policyname, cmd, roles, qual, with_check
-- from pg_policies
-- where schemaname = 'public' and tablename = 'feedbacks'
-- order by cmd, policyname;

-- -----------------------------------------------------------------------------
-- 1. Preserve the pending-only INSERT policies (intentionally NOT modified):
--      * "Anyone can submit feedback"
--      * "Public can submit feedback"
--    These keep anon/authenticated public submissions at status = 'pending'.
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- 2. Administrator-only published INSERT. Scoped to the admin UUID AND
--    status = 'published', so this policy grants nothing to other users and
--    does not permit the admin to bypass any other table's rules.
-- -----------------------------------------------------------------------------
drop policy if exists "administrator can publish feedback" on public.feedbacks;
create policy "administrator can publish feedback"
  on public.feedbacks
  for insert
  to authenticated
  with check (
    auth.uid() = 'dd8a76a2-8769-4518-bab7-a70d385ef9f1'::uuid
    and status = 'published'
  );

-- -----------------------------------------------------------------------------
-- 3. Public SELECT policy (published rows only) is NOT modified.
-- -----------------------------------------------------------------------------

commit;

-- -----------------------------------------------------------------------------
-- Verification (run after applying). Expect:
--   * the pre-existing pending INSERT policies for anon/authenticated
--   * the new "administrator can publish feedback" INSERT policy, restricted to
--     the admin UUID with status = 'published'
--   * unchanged SELECT policies exposing published feedback only
-- -----------------------------------------------------------------------------
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'feedbacks'
order by cmd, policyname;
