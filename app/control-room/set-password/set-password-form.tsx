"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

export function SetPasswordForm() {
  const router = useRouter();
  const supabaseRef = useRef<ReturnType<typeof createSupabaseBrowserClient>>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    supabaseRef.current = supabase;

    async function establishInvitationSession() {
      if (!supabase) {
        if (active) {
          setMessage("La conexión segura todavía no está configurada.");
          setChecking(false);
        }
        return;
      }

      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = fragment.get("access_token");
      const refreshToken = fragment.get("refresh_token");
      const invitationError = fragment.get("error_description");

      const result = accessToken && refreshToken
        ? await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
        : await supabase.auth.getSession();

      if (window.location.hash) {
        window.history.replaceState({}, "", window.location.pathname);
      }

      if (!active) {
        return;
      }

      const session = result.data.session;
      if (result.error || invitationError || !session) {
        setMessage("La invitación no es válida o ya venció. Solicita una nueva.");
        setChecking(false);
        return;
      }

      setEmail(session.user.email ?? null);
      setReady(true);
      setChecking(false);
    }

    void establishInvitationSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (password !== confirmation) {
      setMessage("Las dos contraseñas deben coincidir.");
      return;
    }

    const supabase = supabaseRef.current;
    if (!supabase) {
      setMessage("La conexión segura todavía no está configurada.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("No pudimos guardar la contraseña. Solicita una nueva invitación.");
      setSubmitting(false);
      return;
    }

    router.replace("/control-room");
    router.refresh();
  }

  return (
    <>
      {checking ? <p className="invitation-status" role="status">Validando invitación…</p> : null}
      {ready && email ? <p className="verified-email">Cuenta verificada: <strong>{email}</strong></p> : null}
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Nueva contraseña
          <input
            autoComplete="new-password"
            disabled={!ready || submitting}
            minLength={12}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        <label>
          Repetir contraseña
          <input
            autoComplete="new-password"
            disabled={!ready || submitting}
            minLength={12}
            onChange={(event) => setConfirmation(event.target.value)}
            required
            type="password"
            value={confirmation}
          />
        </label>
        <p className="password-hint">Usa al menos 12 caracteres y una contraseña única.</p>
        {message ? <p className="form-message" role="alert">{message}</p> : null}
        <button className="button button-purple" disabled={!ready || submitting} type="submit">
          {submitting ? "Guardando…" : "Guardar y entrar"}
        </button>
      </form>
    </>
  );
}
