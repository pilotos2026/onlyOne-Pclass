"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

export function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (password !== confirmation) {
      setMessage("Las dos contraseñas deben coincidir.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
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
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        Nueva contraseña
        <input
          autoComplete="new-password"
          disabled={submitting}
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
          disabled={submitting}
          minLength={12}
          onChange={(event) => setConfirmation(event.target.value)}
          required
          type="password"
          value={confirmation}
        />
      </label>
      <p className="password-hint">Usa al menos 12 caracteres y una contraseña única.</p>
      {message ? <p className="form-message" role="alert">{message}</p> : null}
      <button className="button button-purple" disabled={submitting} type="submit">
        {submitting ? "Guardando…" : "Guardar y entrar"}
      </button>
    </form>
  );
}
