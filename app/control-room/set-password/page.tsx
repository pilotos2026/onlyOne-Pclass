import { PClassBrand } from "../../../components/pclass-brand";
import { SetPasswordForm } from "./set-password-form";

export const dynamic = "force-dynamic";

export default function SetPasswordPage() {
  return (
    <main className="login-page">
      <div className="login-brand"><PClassBrand /></div>
      <section className="login-card">
        <span className="lock-mark" aria-hidden="true">✓</span>
        <p className="eyebrow">Acceso por invitación</p>
        <h1>Crea tu contraseña</h1>
        <p>
          Abre esta pantalla desde el enlace recibido por correo. PClass
          verificará la invitación antes de habilitar tu nueva contraseña.
        </p>
        <SetPasswordForm />
      </section>
      <style>{`
        .login-page { display: grid; min-height: 100vh; place-items: center; padding: 5rem 1rem; background: var(--pclass-purple-soft); }
        .login-brand { position: absolute; top: 1.5rem; left: 1.5rem; }
        .login-card { width: min(100%, 28rem); padding: clamp(1.5rem, 6vw, 3rem); border: 1px solid var(--pclass-line); border-radius: var(--radius-lg); background: #fff; text-align: center; }
        .lock-mark { display: grid; width: 4rem; height: 4rem; place-items: center; margin: 0 auto 1.5rem; border-radius: 50%; background: var(--pclass-school); color: #fff; font-size: 1.6rem; font-weight: 900; }
        .login-card h1 { margin: 0; color: var(--pclass-purple); font-size: 2.5rem; line-height: 1; }
        .login-card > p:not(.eyebrow) { margin: 1rem 0 1.5rem; color: var(--pclass-muted); }
        .login-card > p strong { color: var(--pclass-purple-deep); }
        .login-form { display: grid; gap: .9rem; margin-top: 1.4rem; text-align: left; }.login-form label { display: grid; gap: .35rem; color: var(--pclass-purple-deep); font-size: .72rem; font-weight: 900; }.login-form input { width: 100%; min-height: 2.8rem; padding: .68rem .75rem; border: 1px solid var(--pclass-line); border-radius: .55rem; background: #fff; color: var(--pclass-ink); font: inherit; }.login-form input:focus { border-color: var(--pclass-purple); outline: 3px solid var(--pclass-purple-soft); }.login-form button { width: 100%; border: 0; }.login-form button:disabled { cursor: not-allowed; opacity: .55; }
        .password-hint { margin: -.25rem 0 0; color: var(--pclass-muted); font-size: .64rem; }.form-message,.invitation-status,.verified-email { margin: 0; padding: .7rem; border-radius: .5rem; font-size: .66rem; text-align: left; }.form-message { background: #fff4e7; color: #8a4610; }.invitation-status { background: var(--pclass-purple-soft); color: var(--pclass-purple); }.verified-email { background: #ecfbf7; color: #08735f; }.verified-email strong { color: inherit; }
      `}</style>
    </main>
  );
}
