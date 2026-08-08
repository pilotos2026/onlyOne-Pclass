import Link from "next/link";
import { MobileDock } from "./mobile-dock";
import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";
import { CURRENT_EVENT, eventPath } from "../lib/pclass-routes";

const QUICK_ACCESS = [
  { symbol: "◷", title: "Solucionario en tiempo real", copy: "Estados académicos claros" },
  { symbol: "✓", title: "Respuestas validadas", copy: "Confirmación humana" },
  { symbol: "↓", title: "Recursos y materiales", copy: "Publicación por evento" },
  { symbol: "□", title: "Chat durante el live", copy: "Participación con registro" },
] as const;

export function EventLanding() {
  return (
    <div>
      <PublicHeader />
      <main id="contenido">
        <section className="event-hero">
          <div className="page-shell event-hero-grid">
            <div className="event-copy">
              <div className="onlyone-lockup" aria-label="Experience OnlyOne">
                <span>Experience</span>
                <strong>Only<span>One</span></strong>
              </div>
              <h1>Solucionario <b>EN VIVO</b><br />UNCP 2026-II</h1>
              <p>
                Transmisión, chat y respuestas académicas publicadas con estados
                claros en una sola experiencia.
              </p>
              <div className="event-status-card">
                <small>Evento actual</small>
                <strong>{CURRENT_EVENT.name}</strong>
                <span>La fecha y hora se mostrarán desde la configuración oficial.</span>
              </div>
              <div className="event-actions">
                <Link className="button button-purple" href={eventPath("live")}>
                  <span aria-hidden="true">▶</span> Ver transmisión en vivo
                </Link>
                <Link className="button button-green-outline" href={eventPath("registro")}>
                  Registrarme gratis <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="hero-product" aria-label="Vista previa móvil de PClass">
              <div className="hero-shape shape-sky" aria-hidden="true" />
              <div className="hero-shape shape-purple" aria-hidden="true" />
              <div className="phone-shell">
                <div className="phone-speaker" />
                <div className="phone-screen">
                  <div className="phone-brand">
                    <span>PClass</span><small>UNCP</small>
                  </div>
                  <div className="phone-onlyone">
                    <small>Experience</small>
                    <strong>Only<span>One</span></strong>
                    <p>Vive el examen de admisión en tiempo real</p>
                  </div>
                  <div className="phone-event-state">
                    <small>TRANSMISIÓN</small><strong>Próximamente</strong>
                  </div>
                  <div className="phone-shortcuts">
                    <span>▶<small>En vivo</small></span>
                    <span>□<small>Chat</small></span>
                    <span>✓<small>Solución</small></span>
                    <span>↓<small>Recursos</small></span>
                    <span>◎<small>Resultados</small></span>
                    <span>↗<small>Orientación</small></span>
                  </div>
                  <Link href={eventPath("registro")}>Ingresar ahora</Link>
                </div>
              </div>
              <div className="next-step-card">
                <small>Tu siguiente paso</small>
                <strong>Prepárate con PClass</strong>
                <span>Orientación para tu próximo examen</span>
              </div>
            </div>
          </div>
          <div className="page-shell quick-access-grid">
            {QUICK_ACCESS.map((item) => (
              <article key={item.title}>
                <span aria-hidden="true">{item.symbol}</span>
                <div><strong>{item.title}</strong><small>{item.copy}</small></div>
              </article>
            ))}
          </div>
        </section>

        <section className="complete-experience">
          <div className="page-shell">
            <div className="experience-heading">
              <div><p className="eyebrow">Experiencia completa del evento</p><h2>Todo ocurre dentro de PClass.</h2></div>
              <p>La vista de escritorio reúne señal, solucionario y participación sin obligarte a saltar entre páginas.</p>
            </div>
            <div className="desktop-product-preview">
              <aside>
                <b>PClass</b>
                {[
                  ["⌂", "Inicio"], ["▶", "Live"], ["✓", "Solucionario"], ["↓", "Recursos"], ["◎", "Resultados"], ["↗", "Orientación"], ["P", "Mi PClass"],
                ].map(([symbol, label], index) => <span className={index === 1 ? "active" : ""} key={label}><i>{symbol}</i>{label}</span>)}
              </aside>
              <div className="preview-live">
                <div className="preview-topbar"><span><b>EN VIVO</b> {CURRENT_EVENT.name}</span><small>Señal principal</small></div>
                <div className="preview-video"><span>▶</span><p>La transmisión de YouTube aparecerá aquí</p></div>
                <div className="preview-solutions">
                  <strong>Solucionario en tiempo real</strong>
                  <div>{Array.from({ length: 12 }, (_, index) => <span key={index}>{String(index + 1).padStart(2, "0")}</span>)}</div>
                  <small>Las preguntas aparecerán cuando el equipo académico las publique.</small>
                </div>
              </div>
              <div className="preview-chat">
                <header><strong>Chat en vivo</strong><span>Disponible durante el evento</span></header>
                <div className="empty-chat"><span>□</span><b>El chat está listo</b><p>Los mensajes reales aparecerán durante la transmisión.</p></div>
                <div className="reaction-row"><span>👍</span><span>❤️</span><span>😂</span><span>😱</span><span>👏</span><span>🔥</span></div>
                <div className="chat-input">Escribe un mensaje… <b>→</b></div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-principles">
          <div className="page-shell principle-grid">
            <article><span>◈</span><div><b>Experiencia en vivo</b><p>Información, chat y participación.</p></div></article>
            <article><span>✓</span><div><b>Validación académica</b><p>Sin respuestas oficiales ficticias.</p></div></article>
            <article><span>↗</span><div><b>Continuidad PClass</b><p>Orientación después del evento.</p></div></article>
            <article><span>▣</span><div><b>Datos protegidos</b><p>Consentimiento y permisos reales.</p></div></article>
          </div>
        </section>
      </main>
      <PublicFooter />
      <MobileDock />
      <style>{`
        .event-hero { padding: clamp(2.4rem,6vw,5rem) 0 0; background: #fff; }
        .event-hero-grid { display: grid; gap: 2.8rem; align-items: center; }
        .event-copy { position: relative; z-index: 2; }
        .onlyone-lockup { display: inline-grid; margin-bottom: 1rem; color: var(--pclass-purple); line-height: .8; transform: rotate(-2deg); }
        .onlyone-lockup > span { margin-left: .7rem; color: var(--pclass-school); font-size: 1.55rem; font-style: italic; font-weight: 700; }
        .onlyone-lockup strong { font-size: clamp(3.2rem,10vw,5.8rem); font-weight: 900; letter-spacing: -.08em; }
        .onlyone-lockup strong span { color: var(--pclass-school); }
        .event-copy h1 { margin: 0; color: var(--pclass-purple); font-size: clamp(2rem,6vw,3.75rem); font-weight: 900; letter-spacing: -.045em; line-height: .98; }
        .event-copy h1 b { font-size: .58em; letter-spacing: .01em; }
        .event-copy > p { max-width: 34rem; margin: 1.1rem 0 0; color: #514957; font-size: 1.05rem; }
        .event-status-card { display: grid; max-width: 28rem; gap: .1rem; margin-top: 1.35rem; padding: .8rem 1rem; border: 1px solid var(--pclass-line); border-left: 4px solid var(--pclass-sky); border-radius: .65rem; background: var(--pclass-canvas); }
        .event-status-card small { color: var(--pclass-muted); font-size: .68rem; font-weight: 900; text-transform: uppercase; }
        .event-status-card strong { color: var(--pclass-purple); }
        .event-status-card span { color: var(--pclass-muted); font-size: .78rem; }
        .event-actions { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.4rem; }
        .button-green-outline { border-color: var(--pclass-academy); background: #fff; color: var(--pclass-academy-deep); }
        .hero-product { position: relative; min-height: 31rem; }
        .hero-shape { position: absolute; border-radius: 48% 52% 42% 58%; }
        .shape-sky { width: 17rem; height: 16rem; top: 2rem; right: 0; background: var(--pclass-sky); opacity: .92; }
        .shape-purple { width: 19rem; height: 19rem; right: 1rem; bottom: 0; background: var(--pclass-purple); }
        .phone-shell { position: absolute; z-index: 2; top: 0; right: 12%; width: min(15.7rem,68vw); padding: .45rem; border: 4px solid #17141a; border-radius: 2.4rem; background: #17141a; box-shadow: 0 22px 42px rgba(48,31,58,.2); transform: rotate(1.2deg); }
        .phone-speaker { position: absolute; z-index: 3; top: .55rem; left: 50%; width: 4.2rem; height: .25rem; border-radius: 1rem; background: #302b33; transform: translateX(-50%); }
        .phone-screen { min-height: 29rem; padding: 1.3rem .9rem 1rem; overflow: hidden; border-radius: 1.8rem; background: var(--pclass-purple); color: #fff; }
        .phone-brand { display: flex; align-items: center; justify-content: space-between; font-weight: 900; }
        .phone-brand small { padding: .22rem .42rem; border-radius: .3rem; background: var(--pclass-academy); color: var(--pclass-purple); }
        .phone-onlyone { margin-top: 2.3rem; text-align: center; }
        .phone-onlyone > small { display: block; color: #fff; font-size: .75rem; font-style: italic; }
        .phone-onlyone strong { display: block; color: #fff; font-size: 2.65rem; line-height: .8; letter-spacing: -.08em; }
        .phone-onlyone strong span { color: #dce487; }
        .phone-onlyone p { margin: .85rem auto 0; max-width: 12rem; color: #eee7f2; font-size: .78rem; font-weight: 700; }
        .phone-event-state { display: grid; margin: 1.5rem 0 1rem; padding: .65rem; border: 1px solid rgba(255,255,255,.16); border-radius: .7rem; background: rgba(255,255,255,.08); text-align: center; }
        .phone-event-state small { color: #dce487; font-size: .58rem; font-weight: 900; }
        .phone-event-state strong { font-size: 1.05rem; }
        .phone-shortcuts { display: grid; grid-template-columns: repeat(3,1fr); gap: .7rem .3rem; }
        .phone-shortcuts > span { display: grid; place-items: center; gap: .2rem; font-size: .95rem; }
        .phone-shortcuts small { font-size: .58rem; font-weight: 700; }
        .phone-screen > a { display: block; margin-top: 1.1rem; padding: .7rem; border-radius: .45rem; background: var(--pclass-academy); color: var(--pclass-purple); text-align: center; font-size: .74rem; font-weight: 900; text-transform: uppercase; }
        .next-step-card { position: absolute; z-index: 3; right: 0; bottom: 1.4rem; display: none; width: 14rem; padding: 1rem; border: 1px solid var(--pclass-line); border-radius: .85rem; background: #fff; box-shadow: 0 12px 32px rgba(89,48,121,.14); }
        .next-step-card small,.next-step-card strong,.next-step-card span { display: block; }
        .next-step-card small { color: var(--pclass-muted); font-size: .65rem; text-transform: uppercase; }
        .next-step-card strong { color: var(--pclass-purple); font-size: 1rem; }
        .next-step-card span { margin-top: .25rem; color: var(--pclass-muted); font-size: .73rem; }
        .quick-access-grid { display: grid; gap: .7rem; margin-top: 2.2rem; padding-block: 1rem; border-top: 1px solid var(--pclass-line); }
        .quick-access-grid article { display: flex; align-items: center; gap: .7rem; padding: .6rem; border-radius: .65rem; background: var(--pclass-canvas); }
        .quick-access-grid article > span { display: grid; width: 2rem; height: 2rem; flex: 0 0 auto; place-items: center; border-radius: 50%; background: var(--pclass-purple-soft); color: var(--pclass-purple); font-weight: 900; }
        .quick-access-grid strong,.quick-access-grid small { display: block; }
        .quick-access-grid strong { color: var(--pclass-purple); font-size: .76rem; }
        .quick-access-grid small { color: var(--pclass-muted); font-size: .65rem; }
        .complete-experience { padding: clamp(4rem,8vw,6.5rem) 0; }
        .experience-heading { display: grid; gap: 1rem; align-items: end; }
        .experience-heading h2 { margin: 0; color: var(--pclass-purple); font-size: clamp(2rem,6vw,3.4rem); line-height: 1; }
        .experience-heading > p { max-width: 35rem; margin: 0; color: var(--pclass-muted); }
        .desktop-product-preview { display: grid; margin-top: 2rem; overflow: hidden; border: 1px solid #ded9e2; border-radius: 1rem; background: #fff; box-shadow: 0 16px 40px rgba(89,48,121,.08); }
        .desktop-product-preview > aside { display: none; padding: 1.15rem .75rem; background: var(--pclass-purple); color: #fff; }
        .desktop-product-preview aside > b { display: block; margin: .2rem .45rem 1.2rem; font-size: 1.15rem; }
        .desktop-product-preview aside > span { display: flex; gap: .55rem; padding: .48rem .55rem; border-radius: .5rem; color: #e7deec; font-size: .72rem; }
        .desktop-product-preview aside > span.active { background: rgba(255,255,255,.16); color: #fff; font-weight: 900; }
        .desktop-product-preview aside i { width: 1rem; font-style: normal; text-align: center; }
        .preview-live { min-width: 0; padding: .85rem; }
        .preview-topbar { display: flex; justify-content: space-between; gap: .7rem; margin-bottom: .65rem; color: var(--pclass-muted); font-size: .68rem; }
        .preview-topbar b { margin-right: .35rem; padding: .18rem .35rem; border-radius: .25rem; background: #d93645; color: #fff; font-size: .56rem; }
        .preview-video { display: grid; min-height: 15rem; place-items: center; border-radius: .6rem; background: #151723; color: #fff; text-align: center; }
        .preview-video > span { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: 50%; background: var(--pclass-purple); }
        .preview-video p { margin: -2.8rem 1rem 0; color: #a9a8b2; font-size: .75rem; }
        .preview-solutions { padding: .8rem 0 0; }
        .preview-solutions > strong { color: var(--pclass-purple); font-size: .8rem; }
        .preview-solutions > div { display: grid; grid-template-columns: repeat(6,1fr); gap: .3rem; margin: .55rem 0; }
        .preview-solutions > div span { display: grid; aspect-ratio: 1; place-items: center; border: 1px solid var(--pclass-line); border-radius: .32rem; color: var(--pclass-muted); font-size: .62rem; }
        .preview-solutions > small { color: var(--pclass-muted); font-size: .62rem; }
        .preview-chat { display: grid; min-height: 24rem; grid-template-rows: auto 1fr auto auto; padding: .9rem; border-top: 1px solid var(--pclass-line); }
        .preview-chat header { display: grid; gap: .1rem; padding-bottom: .7rem; border-bottom: 1px solid var(--pclass-line); }
        .preview-chat header span { color: var(--pclass-muted); font-size: .65rem; }
        .empty-chat { display: grid; place-content: center; justify-items: center; padding: 1rem; color: var(--pclass-muted); text-align: center; }
        .empty-chat > span { color: var(--pclass-purple); font-size: 1.5rem; }.empty-chat b { color: var(--pclass-ink); }.empty-chat p { margin: .25rem 0; font-size: .7rem; }
        .reaction-row { display: flex; justify-content: space-between; gap: .3rem; padding: .55rem; border: 1px solid var(--pclass-line); border-radius: .6rem; background: var(--pclass-canvas); }
        .chat-input { display: flex; justify-content: space-between; margin-top: .5rem; padding: .55rem .65rem; border: 1px solid var(--pclass-line); border-radius: .5rem; color: #98919c; font-size: .68rem; }
        .chat-input b { color: var(--pclass-purple); }
        .brand-principles { padding: 0 0 5rem; }
        .principle-grid { display: grid; overflow: hidden; border: 1px solid var(--pclass-line); border-radius: .85rem; background: #fff; }
        .principle-grid article { display: flex; gap: .8rem; padding: 1rem; border-bottom: 1px solid var(--pclass-line); }
        .principle-grid article:last-child { border-bottom: 0; }
        .principle-grid article > span { display: grid; width: 2.3rem; height: 2.3rem; flex: 0 0 auto; place-items: center; border-radius: 50%; background: var(--pclass-purple); color: #fff; }
        .principle-grid b { color: var(--pclass-purple); font-size: .78rem; text-transform: uppercase; }.principle-grid p { margin: .15rem 0 0; color: var(--pclass-muted); font-size: .68rem; }
        @media (min-width: 620px) {
          .quick-access-grid { grid-template-columns: repeat(2,1fr); }
          .next-step-card { display: block; }
          .desktop-product-preview { grid-template-columns: minmax(0,1.6fr) minmax(13rem,.7fr); }
          .preview-chat { border-top: 0; border-left: 1px solid var(--pclass-line); }
          .principle-grid { grid-template-columns: repeat(2,1fr); }.principle-grid article:nth-child(odd) { border-right: 1px solid var(--pclass-line); }
        }
        @media (min-width: 900px) {
          .event-hero-grid { grid-template-columns: minmax(0,.95fr) minmax(26rem,1.05fr); }
          .hero-product { min-height: 34rem; }.phone-shell { right: 22%; }.shape-sky { right: 7%; }.shape-purple { right: 10%; }
          .quick-access-grid { grid-template-columns: repeat(4,1fr); }
          .experience-heading { grid-template-columns: 1fr .8fr; }
          .desktop-product-preview { grid-template-columns: 9.5rem minmax(0,1.6fr) minmax(14rem,.72fr); }
          .desktop-product-preview > aside { display: block; }
          .principle-grid { grid-template-columns: repeat(4,1fr); }.principle-grid article { border-right: 1px solid var(--pclass-line); border-bottom: 0; }
        }
      `}</style>
    </div>
  );
}
