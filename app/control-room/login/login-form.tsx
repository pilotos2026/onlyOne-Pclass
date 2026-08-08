"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

type LoginFormProps = {
  configured: boolean;
};

export function LoginForm({ configured }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Primero conecta el proyecto Supabase con la guía entregada.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("No pudimos validar esos datos. Revisa tu correo y contraseña.");
      setSubmitting(false);
      return;
    }

    router.replace("/control-room");
    router.refresh();
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        Correo del equipo
        <input
          autoComplete="email"
          disabled={!configured || submitting}
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label>
        Contraseña
        <input
          autoComplete="current-password"
          disabled={!configured || submitting}
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      {message ? <p className="form-message" role="alert">{message}</p> : null}
      <button className="button button-purple" disabled={!configured || submitting} type="submit">
        {submitting ? "Verificando…" : "Ingresar al Control Room"}
      </button>
      {!configured ? (
        <p className="setup-note">Conexión pendiente: sigue la guía Supabase del BLOQUE 2.</p>
      ) : null}
    </form>
  );
}

