### Accounts panel Codex device login

#### Feature/Change Name
Accounts settings starts `codex login --device-auth` and completes sign-in automatically without a localhost callback URL or manual reload.

#### Prerequisites/Setup
1. Dev server running with an isolated `CODEX_HOME` that has no `auth.json`
2. `codex` CLI available in the server process `PATH`
3. A ChatGPT account that can use Codex
4. Light and dark themes available from the appearance switcher

#### Steps
1. At a 375x812 viewport with no saved Accounts collapse preference, open settings and confirm `Accounts` is already expanded with a `Login` action.
2. Click `Login` and verify a `Sign in to Codex` dialog displays a one-time code and waiting state.
3. Tap `Copy code & continue`, verify the OpenAI device page opens, and paste into its code field to confirm the displayed code was copied.
4. Complete ChatGPT authorization and return to the app without pasting a callback URL or clicking reload.
5. Verify the dialog closes automatically, the signed-in account becomes active, and Codex models become available.
6. Start login again, press `Cancel`, and verify a fresh login can be started without reusing the abandoned process.
7. Repeat steps 1-3 at 768x1024 and in dark theme.

#### Expected Results
- The server invokes `codex login --device-auth` and returns only the verification URL and one-time user code.
- `Copy code & continue` copies the code and opens the official OpenAI device page in one tap.
- A single bounded status poll runs at a time and stops after completion, failure, cancellation, or component teardown.
- Successful CLI completion imports `$CODEX_HOME/auth.json`, activates the account, refreshes account metadata, and closes the dialog automatically.
- No localhost callback URL, terminal access, manual account reload, or browser text selection is required.
- The code, waiting state, actions, and errors remain readable and tappable in light/dark mobile layouts.

#### Rollback/Cleanup
- Remove the test account from Accounts if needed.
- Cancel any unfinished login from the dialog before stopping the test server.

---
