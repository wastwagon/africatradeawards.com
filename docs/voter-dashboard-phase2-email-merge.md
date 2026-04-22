# Phase 2 (optional): Link historical anonymous votes to voter accounts

The MVP voter dashboard only shows **`PublicVote` rows where `voterId` is set** at cast time (user was signed in). Anonymous votes cast before accounts existed are **not** merged automatically.

If product owners require “backfill” so voters see older anonymous votes on their dashboard, implement **only** under these constraints:

1. **Proof:** Link when `PublicVote.voterEmail` (or a consumed `VoteVerification` row for the same email) **exactly matches** the signed-in user’s `User.email` after email ownership is confirmed (same verification standard as voting, not self-serve guesswork).

2. **Validity:** Only link votes with `status = VALID` unless legal/comms explicitly approves showing `QUARANTINED` / `REJECTED` in the UI.

3. **Uniqueness:** Respect `entryId` + `ipHash` and `entryId` + `voterId` uniqueness: merging must not create duplicate keys. If an IP-based vote already exists and a merge would attach `voterId`, use a single well-defined resolution path (e.g. attach `voterId` to the existing row and drop redundant account-level rows — **requires careful transaction design**).

4. **Audit:** Log merges in `AuditLog` (or equivalent) with `publicVoteId`, prior `voterId`, actor `userId`, and reason.

5. **Expectations:** Document that merge is **best-effort** (no `voterEmail`, IP-only voters, or mismatched emails will not link).

6. **Abuse:** Run merges behind an explicit user action (“Import my past votes”) with rate limits; consider manual admin review for high-volume anomalies.

This phase is **not** required for launch and should be scheduled only after MVP metrics show demand.
