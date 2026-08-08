import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

const FAILURE_PATH = "/control-room/login?error=invitation";
const SUCCESS_PATH = "/control-room/set-password";

function redirectWithoutCaching(request: Request, path: string) {
  const response = NextResponse.redirect(new URL(path, request.url), 303);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return redirectWithoutCaching(request, FAILURE_PATH);
  }

  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const code = url.searchParams.get("code");

  if (tokenHash && type === "invite") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "invite",
    });

    return redirectWithoutCaching(request, error ? FAILURE_PATH : SUCCESS_PATH);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return redirectWithoutCaching(request, error ? FAILURE_PATH : SUCCESS_PATH);
  }

  return redirectWithoutCaching(request, FAILURE_PATH);
}
