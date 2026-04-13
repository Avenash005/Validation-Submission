# BUG_REPORT.md - Root Causes of 6 Form Bugs

## Bug #1: Empty Submissions Go Through

**Symptom**: Form submits with blank fields; empty tickets created.
**Root Cause**: `validate()` always returns `true`. `handleSubmit` calls it but ignores the result (no `if (!validate()) return` check).

## Bug #2: Submit Clicked Multiple Times

**Symptom**: Button stays enabled during 1.8s API call; duplicates created.
**Root Cause**: `setLoading(true)` never called before `await`. No `disabled={loading}` on button.

## Bug #3: Form Not Reset After Success

**Symptom**: Fields retain values after successful submit.
**Root Cause**: `setForm(EMPTY_FORM)` missing in try block after `setSuccessId`.

## Bug #4: Silent Server Errors

**Symptom**: "login" title submits → 409 error thrown but no UI feedback.
**Root Cause**: Empty `catch` block swallows error. `setServerError`/`setErrors` never called.

## Bug #5: No Field-Level Messages

**Symptom**: No red borders/messages next to invalid fields.
**Root Cause**: `errors` state never populated (`validate` stub). JSX conditionals `{errors.title && ...}` exist but never trigger (no wiring to styles/input).

## Bug #6: Invalid Steps Count Accepted

**Symptom**: `0`, `-5`, empty allowed in stepsCount.
**Root Cause**: No check in `validate()` for `stepsCount` (must be integer >=1).

**Verification**: All reproduce in browser. Fixes implement validation gate, full lifecycle (loading/success/error), JSX wiring per professional form patterns.
