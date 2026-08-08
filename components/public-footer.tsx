import Link from "next/link";
import Image from "next/image";

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="page-shell footer-grid">
        <div>
          <div className="official-footer-logo">
            <Image src="/personal-class-academia.png" alt="Personal Class Academia" width={700} height={616} />
          </div>
          <p>Una experiencia de Personal Class.</p>
        </div>
        <div className="footer-links">
          <Link href="/">Inicio</Link>
          <Link href="/control-room/login">Acceso del equipo</Link>
          <span>Datos personales protegidos</span>
        </div>
      </div>
      <style>{`
        .public-footer {
          padding: 3rem 0 7rem;
          background: var(--pclass-purple-deep);
          color: #fff;
        }
        .public-footer p { margin: .85rem 0 0; color: #d8cce0; }
        .official-footer-logo { display: grid; width: 9rem; min-height: 5.3rem; place-items: center; padding: .45rem; border-radius: .65rem; background: #fff; }
        .official-footer-logo img { width: 100%; height: 4.4rem; object-fit: contain; }
        .footer-grid { display: grid; gap: 2rem; }
        .footer-links { display: grid; gap: .55rem; color: #d8cce0; }
        .footer-links a:hover { color: #fff; }
        @media (min-width: 768px) {
          .public-footer { padding-bottom: 3rem; }
          .footer-grid { grid-template-columns: 1fr auto; align-items: end; }
          .footer-links { text-align: right; }
        }
      `}</style>
    </footer>
  );
}
