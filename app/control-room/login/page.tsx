import Link from "next/link";
import { PClassBrand } from "../../../components/pclass-brand";
import { LoginForm } from "./login-form";
import { getControlRoomAccess } from "../../../lib/auth/control-room-access";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type ControlRoomLoginProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ControlRoomLogin({ searchParams }: ControlRoomLoginProps) {
  const query = await searchParams;
  const access = await getControlRoomAccess();

  if (access.state === "authorized") {
    redirect("/control-room");
  }

  const configured = access.state !== "unconfigured";

  return (
    <main className="login-page">
      <div className="login-brand"><PClassBrand /></div>
      <section className="login-card">
        <span className="lock-mark" aria-hidden="true">P</span>
        <p className="eyebrow">Acceso del equipo</p>
        <h1>Control Room</h1>
        <p>
          Ingresa con el correo autorizado por Personal Class. Cada cuenta recibe
          únicamente los permisos de su función.
        </p>
        {access.state === "denied" ? (
          <p className="access-warning" role="alert">
            La cuenta está autenticada, pero todavía no tiene un rol operativo asignado.
          </p>
        ) : null}
        {query.error === "invitation" ? (
          <p className="access-warning" role="alert">
            La invitación no es válida o ya venció. Solicita una nueva al responsable.
          </p>
        ) : null}
        <LoginForm configured={configured} />
        <Link className="back-link" href="/">← Volver a la experiencia</Link>
      </section>
      <style>{`
        .login-page { display: grid; min-height: 100vh; place-items: center; padding: 5rem 1rem; background: var(--pclass-purple-soft); }
        .login-brand { position: absolute; top: 1.5rem; left: 1.5rem; }
        .login-card { width: min(100%, 28rem); padding: clamp(1.5rem, 6vw, 3rem); border: 1px solid var(--pclass-line); border-radius: var(--radius-lg); background: #fff; text-align: center; }
        .lock-mark { display: grid; width: 4rem; height: 4rem; place-items: center; margin: 0 auto 1.5rem; border-radius: 1.2rem 1.2rem 1.2rem .4rem; background: var(--pclass-academy); color: var(--pclass-purple-deep); font-size: 1.6rem; font-weight: 900; transform: rotate(-3deg); }
        .login-card h1 { margin: 0; font-size: 2.8rem; line-height: 1; }
        .login-card > p:not(.eyebrow) { margin: 1rem 0 1.5rem; color: var(--pclass-muted); }
        .login-form { display: grid; gap: .9rem; margin-top: 1.4rem; text-align: left; }.login-form label { display: grid; gap: .35rem; color: var(--pclass-purple-deep); font-size: .72rem; font-weight: 900; }.login-form input { width: 100%; min-height: 2.8rem; padding: .68rem .75rem; border: 1px solid var(--pclass-line); border-radius: .55rem; background: #fff; color: var(--pclass-ink); font: inherit; }.login-form input:focus { border-color: var(--pclass-purple); outline: 3px solid var(--pclass-purple-soft); }.login-form button { width: 100%; border: 0; }.login-form button:disabled { cursor: not-allowed; opacity: .55; }
        .form-message,.setup-note,.access-warning { margin: 0 !important; padding: .7rem; border-radius: .5rem; font-size: .66rem; text-align: left; }.form-message,.access-warning { background: #fff4e7; color: #8a4610 !important; }.setup-note { background: var(--pclass-purple-soft); color: var(--pclass-purple) !important; }.back-link { display: inline-block; margin-top: 1.2rem; color: var(--pclass-purple); font-size: .7rem; font-weight: 900; }
      `}</style>
    </main>
  );
}
