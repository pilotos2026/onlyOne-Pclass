import Link from "next/link";
import { PClassBrand } from "./pclass-brand";
import { eventPath, PUBLIC_SECTIONS } from "../lib/pclass-routes";

const headerSections = PUBLIC_SECTIONS.filter((item) => item.slug !== "registro");

export function PublicHeader() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <div className="page-shell header-inner">
          <PClassBrand />
          <nav className="desktop-nav" aria-label="Navegación principal">
            <Link href="/">Inicio</Link>
            {headerSections.slice(1, 5).map((item) => (
              <Link key={item.slug} href={eventPath(item.slug)}>{item.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="header-orientation" href={eventPath("orientacion")}>
              Quiero orientación
            </Link>
            <Link className="account-button" href={eventPath("mi-pclass")} aria-label="Abrir Mi PClass">
              <span aria-hidden="true">P</span>
            </Link>
          </div>
          <details className="mobile-menu">
            <summary aria-label="Abrir menú"><span></span><span></span><span></span></summary>
            <nav aria-label="Navegación móvil">
              <Link href="/">Inicio</Link>
              {PUBLIC_SECTIONS.map((item) => (
                <Link key={item.slug} href={eventPath(item.slug)}>
                  <span aria-hidden="true">{item.symbol}</span>{item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </header>
      <style>{`
        .site-header {
          position: relative;
          z-index: 30;
          border-bottom: 1px solid var(--pclass-line);
          background: #fff;
        }
        .header-inner {
          display: flex;
          min-height: 4.75rem;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
        }
        .desktop-nav, .header-actions { display: none; }
        .mobile-menu { position: relative; }
        .mobile-menu summary {
          display: grid;
          width: 2.7rem;
          height: 2.7rem;
          place-content: center;
          gap: .28rem;
          list-style: none;
          border: 1px solid var(--pclass-line);
          border-radius: .8rem;
          cursor: pointer;
        }
        .mobile-menu summary::-webkit-details-marker { display: none; }
        .mobile-menu summary span { width: 1rem; height: 2px; border-radius: 2px; background: var(--pclass-purple); }
        .mobile-menu nav {
          position: absolute;
          top: calc(100% + .65rem);
          right: 0;
          display: grid;
          width: min(19rem, calc(100vw - 2rem));
          padding: .6rem;
          border: 1px solid var(--pclass-line);
          border-radius: 1rem;
          background: #fff;
          box-shadow: 0 18px 44px rgba(89,48,121,.14);
        }
        .mobile-menu nav a { display: flex; align-items: center; gap: .7rem; padding: .7rem .75rem; border-radius: .65rem; font-weight: 700; }
        .mobile-menu nav a:hover { background: var(--pclass-purple-soft); color: var(--pclass-purple); }
        .mobile-menu nav a span { display: grid; width: 1.5rem; height: 1.5rem; place-items: center; border-radius: .45rem; background: var(--pclass-purple-soft); font-size: .7rem; }
        @media (min-width: 900px) {
          .desktop-nav { display: flex; align-items: center; gap: clamp(1rem,2.1vw,1.8rem); color: #4f4656; font-size: .9rem; font-weight: 700; }
          .desktop-nav a:first-child { color: var(--pclass-purple); border-bottom: 2px solid var(--pclass-purple); }
          .desktop-nav a:hover { color: var(--pclass-purple); }
          .header-actions { display: flex; align-items: center; gap: .75rem; }
          .header-orientation { padding: .68rem 1rem; border-radius: .45rem; background: var(--pclass-academy); color: var(--pclass-purple-deep); font-size: .82rem; font-weight: 900; }
          .account-button { display: grid; width: 2.25rem; height: 2.25rem; place-items: center; border: 1px solid var(--pclass-purple); border-radius: 50%; color: var(--pclass-purple); font-size: .76rem; font-weight: 900; }
          .mobile-menu { display: none; }
        }
      `}</style>
    </>
  );
}
