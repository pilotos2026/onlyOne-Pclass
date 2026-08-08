import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const callbackUrl = new URL("../app/auth/callback/route.ts", import.meta.url);
const passwordFormUrl = new URL(
  "../app/control-room/set-password/set-password-form.tsx",
  import.meta.url,
);
const passwordPageUrl = new URL(
  "../app/control-room/set-password/page.tsx",
  import.meta.url,
);

test("completes administrative invitations without exposing secret keys", async () => {
  const [callback, passwordForm, passwordPage] = await Promise.all([
    readFile(callbackUrl, "utf8"),
    readFile(passwordFormUrl, "utf8"),
    readFile(passwordPageUrl, "utf8"),
  ]);

  assert.match(callback, /type === "invite"/);
  assert.match(callback, /verifyOtp/);
  assert.match(callback, /exchangeCodeForSession/);
  assert.match(callback, /Cache-Control", "private, no-store"/);
  assert.match(passwordPage, /verificará la invitación/);
  assert.match(passwordForm, /fragment\.get\("access_token"\)/);
  assert.match(passwordForm, /fragment\.get\("refresh_token"\)/);
  assert.match(passwordForm, /auth\.setSession/);
  assert.match(passwordForm, /window\.history\.replaceState/);
  assert.match(passwordForm, /auth\.getSession\(\)/);
  assert.match(passwordForm, /auth\.updateUser\(\{ password \}\)/);
  assert.match(passwordForm, /minLength=\{12\}/);
  assert.doesNotMatch(
    `${callback}\n${passwordForm}\n${passwordPage}`,
    /SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY|service_role/,
  );
});
