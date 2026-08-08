import Link from "next/link";
import { MobileDock } from "./mobile-dock";
import { ProductScreen } from "./product-screens";
import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";
import {
  CURRENT_EVENT,
  eventPath,
  PUBLIC_SECTIONS,
  SECTION_COPY,
  type PublicSectionSlug,
} from "../lib/pclass-routes";

export function SectionPreview({ section }: { section: PublicSectionSlug }) {
  const copy = SECTION_COPY[section];

  return (
    <div>
      <PublicHeader />
      <main id="contenido" className="section-page">
        <div className="page-shell event-context">
          <span>{CURRENT_EVENT.campaign}</span>
          <strong>{CURRENT_EVENT.name}</strong>
          <small>Evento configurable</small>
        </div>
        <div className="page-shell section-page-grid">
          <nav className="section-rail" aria-label="Secciones del evento">
            <div className="rail-title"><b>PClass</b><small>Experiencia del evento</small></div>
            {PUBLIC_SECTIONS.map((item) => (
              <Link
                aria-current={item.slug === section ? "page" : undefined}
                className={item.slug === section ? "active" : ""}
                href={eventPath(item.slug)}
                key={item.slug}
              >
                <span aria-hidden="true">{item.symbol}</span>{item.label}
              </Link>
            ))}
            <Link className="rail-control" href="/control-room/login">Acceso del equipo</Link>
          </nav>
          <section className="section-stage">
            <header className="section-heading">
              <div><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1></div>
              <p>{copy.description}</p>
            </header>
            <ProductScreen section={section} />
          </section>
        </div>
      </main>
      <PublicFooter />
      <MobileDock />
      <style>{`
        .section-page { min-height: 72vh; padding-bottom: clamp(3rem,7vw,5rem); }
        .event-context { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem 1rem; min-height: 2.65rem; padding-block: .45rem; color: #fff; background: var(--pclass-purple); }
        .event-context::before { position: absolute; right: 0; left: 0; z-index: -1; height: 2.65rem; background: var(--pclass-purple); content: ""; }
        .event-context span { color: #dce487; font-size: .65rem; font-weight: 900; text-transform: uppercase; }.event-context strong { font-size: .75rem; }.event-context small { margin-left: auto; color: #e3dce7; }
        .section-page-grid { display: grid; gap: 1.4rem; padding-top: 1.5rem; }
        .section-rail { display: none; align-content: start; min-width: 0; padding: .8rem; border-radius: .8rem; background: var(--pclass-purple); color: #fff; }
        .rail-title { display: grid; gap: .1rem; padding: .55rem .6rem 1rem; }.rail-title b { font-size: 1.05rem; }.rail-title small { color: #d7cbdc; font-size: .6rem; }
        .section-rail > a:not(.rail-control) { display: flex; align-items: center; gap: .6rem; padding: .55rem .6rem; border-radius: .48rem; color: #e6dfeb; font-size: .72rem; font-weight: 700; }.section-rail > a span { display: grid; width: 1.25rem; place-items: center; font-size: .65rem; }.section-rail > a:hover,.section-rail > a.active { background: rgba(255,255,255,.15); color: #fff; }.section-rail > a.active { font-weight: 900; }
        .rail-control { margin-top: 1rem; padding: .7rem .6rem; border-top: 1px solid rgba(255,255,255,.16); color: #dce487; font-size: .68rem; font-weight: 900; }
        .section-stage { min-width: 0; }
        .section-heading { display: grid; gap: .7rem; margin-bottom: 1.2rem; }.section-heading h1 { margin: 0; color: var(--pclass-purple); font-size: clamp(1.7rem,5vw,2.65rem); line-height: 1; }.section-heading .eyebrow { margin-bottom: .35rem; }.section-heading > p { max-width: 38rem; margin: 0; color: var(--pclass-muted); font-size: .82rem; }
        @media (min-width: 880px) {
          .section-page-grid { grid-template-columns: 11rem minmax(0,1fr); gap: 1.4rem; }.section-rail { display: grid; position: sticky; top: 1rem; }.section-heading { grid-template-columns: 1fr .8fr; align-items: end; }
        }
      `}</style>
    </div>
  );
}
