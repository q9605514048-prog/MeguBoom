# Verification

Public export: run npm test and the Android JVM/lint/build commands in USER_GUIDE.md. Isolated fixtures cover progress merging, rewind/unmark, offline persistence, account changes, token refresh races and Drive pagination.

The private predecessor passed99 Node tests and41 JVM tests plus desktop and emulator playback checks. These counts describe that predecessor, not every test shipped in this cleaned export. Publication checks are recorded in the release notes.

Real Google authorization and physical-phone↔PC cloud exchange require your own project/account/consent and remain a manual integration check. The app UI is Russian. Public Android builds start with a placeholder folder until configured.

Public export verification (2026-11-03):41 Node tests passed;41 Android JVM tests passed; Android lint and debug assembly succeeded.
