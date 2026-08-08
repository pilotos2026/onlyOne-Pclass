import Link from "next/link";
import { eventPath, type PublicSectionSlug } from "../lib/pclass-routes";

export function ProductScreen({ section }: { section: PublicSectionSlug }) {
  return (
    <>
      {section === "live" && <LiveProduct />}
      {section === "solucionario" && <SolutionProduct />}
      {section === "registro" && <RegistrationProduct />}
      {section === "recursos" && <ResourcesProduct />}
      {section === "resultados" && <ResultsProduct />}
      {section === "orientacion" && <OrientationProduct />}
      {section === "mi-pclass" && <MyPClassProduct />}
      <style>{productStyles}</style>
    </>
  );
}

function LiveProduct() {
  return (
    <div className="live-product product-panel">
      <section className="live-main">
        <header className="product-toolbar">
          <div><span className="live-pill">EN VIVO</span><strong>Transmisión principal</strong></div>
          <div className="alt-signals"><small>Señales alternativas</small><span>YT</span><span>f</span><span>Tk</span><span>Ig</span></div>
        </header>
        <div className="video-stage">
          <div className="onlyone-video"><small>Experience</small><strong>Only<span>One</span></strong><p>Solucionario EN VIVO<br />UNCP 2026-II</p></div>
          <button type="button" aria-label="La señal se habilitará durante el evento">▶</button>
          <span className="video-note">La señal oficial aparecerá aquí</span>
        </div>
        <div className="live-information">
          <article><span>◎</span><div><small>Área actual</small><b>Por configurar</b></div></article>
          <article><span>▤</span><div><small>Bloque</small><b>Por configurar</b></div></article>
          <article><span>✓</span><div><small>Preguntas resueltas</small><b>—</b></div></article>
          <article><span>◷</span><div><small>Última actualización</small><b>Sin publicaciones</b></div></article>
        </div>
      </section>
      <aside className="chat-panel">
        <header><div><strong>Chat en vivo</strong><small>Sin datos ficticios</small></div><span className="connection-dot">●</span></header>
        <div className="chat-tabs"><b>Chat</b><span>Reacciones</span><span>Info</span></div>
        <div className="chat-empty"><span>□</span><b>El chat está preparado</b><p>Podrás leer sin registro. Para escribir o reaccionar se solicitará nombre, WhatsApp y consentimiento.</p></div>
        <div className="reaction-picker" aria-label="Reacciones disponibles"><span>👍</span><span>❤️</span><span>😂</span><span>😱</span><span>👏</span><span>🔥</span></div>
        <div className="message-box"><span>Escribe un mensaje…</span><button type="button" aria-label="Enviar, disponible con registro">→</button></div>
      </aside>
    </div>
  );
}

function SolutionProduct() {
  return (
    <div className="solution-product product-panel">
      <aside className="filter-panel">
        <strong>Filtros</strong>
        <label>Área<select defaultValue=""><option value="">Todas las áreas</option></select></label>
        <label>Curso<select defaultValue=""><option value="">Todos los cursos</option></select></label>
        <label>Estado<select defaultValue=""><option value="">Todos los estados</option></select></label>
        <label>Buscar<input placeholder="Número o palabra" /></label>
        <button type="button">Limpiar filtros</button>
      </aside>
      <section className="questions-panel">
        <div className="status-tabs"><b>Todas</b><span>Preliminares</span><span>Confirmadas</span><span>Corregidas</span></div>
        <div className="solution-empty-grid">
          <article><span className="state-neutral">Sin publicar</span><b>Las preguntas aparecerán aquí</b><p>El equipo académico todavía no ha publicado contenido para este evento.</p></article>
          <article className="state-guide"><small>Estados públicos</small><div><span className="dot preliminary"></span>Preliminar</div><div><span className="dot confirmed"></span>Confirmada</div><div><span className="dot corrected"></span>Corregida</div></article>
        </div>
      </section>
      <aside className="question-detail">
        <header><strong>Detalle de pregunta</strong><span>×</span></header>
        <div className="question-detail-empty"><span>?</span><b>Selecciona una pregunta</b><p>Aquí verás el enunciado, alternativas, respuesta, explicación, responsable, validador y versión.</p></div>
        <div className="history-note"><span>◷</span><p>Las correcciones conservarán el historial completo.</p></div>
      </aside>
    </div>
  );
}

function RegistrationProduct() {
  return (
    <div className="registration-product">
      <section className="registration-card product-panel">
        <header><span className="brand-mini">PClass</span><small>Paso 1 de 2</small></header>
        <div className="progress-bar"><span /></div>
        <h2>Completa tu información</h2>
        <p>Solicitamos solo lo necesario para permitirte participar.</p>
        <form>
          <label>Nombre completo<input name="name" autoComplete="name" placeholder="Escribe tu nombre" /></label>
          <label>WhatsApp<input name="whatsapp" inputMode="tel" autoComplete="tel" placeholder="Ej. 987 654 321" /></label>
          <label className="consent-field"><input name="consent" type="checkbox" /><span>Acepto recibir información por WhatsApp de Personal Class.</span></label>
          <button type="button">Continuar</button>
        </form>
        <small className="form-note">🔒 Tus datos serán privados y no se compartirán públicamente.</small>
      </section>
      <aside className="unlock-preview">
        <p className="eyebrow">Desbloqueo progresivo</p>
        <h3>Primero participa. Completa tu perfil cuando sea útil.</h3>
        <div><span>1</span><p><b>Acceso inicial</b>Nombre, WhatsApp y consentimiento.</p></div>
        <div><span>2</span><p><b>Personalización</b>Universidad y carrera solo después.</p></div>
        <p className="preview-disclaimer">Vista de interfaz: el guardado real se conectará en los BLOQUES 2 y 4.</p>
      </aside>
    </div>
  );
}

function ResourcesProduct() {
  return (
    <div className="resources-product">
      <section className="resource-list product-panel">
        <header><div><strong>Recursos y materiales</strong><small>Archivos oficiales del evento</small></div><span>Ver todos</span></header>
        {[
          ["▧", "Examen", "Pendiente de publicación"],
          ["✓", "Claves", "Pendiente de publicación"],
          ["▤", "Solucionario", "Pendiente de publicación"],
          ["◇", "Guías y materiales", "Pendiente de publicación"],
        ].map(([symbol,title,state]) => <article key={title}><span>{symbol}</span><div><b>{title}</b><small>{state}</small></div><button type="button" disabled aria-label={`${title}, ${state}`}>↓</button></article>)}
      </section>
      <aside className="resource-side">
        <section className="official-card product-panel"><span>◎</span><div><small>Resultados oficiales</small><b>Pendiente de publicación oficial</b><p>Solo mostraremos la fuente de la universidad.</p></div></section>
        <section className="orientation-mini product-panel"><span>↗</span><div><small>Orientación académica</small><b>¿Qué sigue después del resultado?</b><Link href={eventPath("orientacion")}>Conocer opciones →</Link></div></section>
      </aside>
    </div>
  );
}

function ResultsProduct() {
  return (
    <div className="results-product product-panel">
      <div className="result-illustration"><span>☆</span><i></i><i></i><i></i></div>
      <p className="eyebrow">Fuente oficial UNCP</p>
      <h2>Pendiente de publicación oficial</h2>
      <p>No presentaremos estimaciones ni resultados no verificados como oficiales.</p>
      <button type="button" disabled>Ver fuente oficial</button>
      <small>El enlace se habilitará desde Control Room cuando la universidad lo publique.</small>
    </div>
  );
}

function OrientationProduct() {
  return (
    <div className="orientation-product">
      <section className="orientation-intro product-panel"><span className="support-avatar">PC</span><p className="eyebrow">Orientación Personal Class</p><h2>Elige cómo quieres avanzar.</h2><p>Un acompañamiento claro para organizar tu preparación después del examen.</p></section>
      <section className="orientation-options">
        <article className="product-panel"><span>□</span><div><b>Chat con un asesor</b><p>Habla con el equipo académico por WhatsApp.</p><button type="button" disabled>Canal por configurar</button></div></article>
        <article className="product-panel"><span>▣</span><div><b>Sesión de orientación</b><p>Reserva una conversación sobre tu preparación.</p><button type="button" disabled>Agenda por configurar</button></div></article>
        <article className="product-panel"><span>◇</span><div><b>Guía de carreras</b><p>Explora alternativas según tus objetivos.</p><button type="button" disabled>Contenido por publicar</button></div></article>
      </section>
    </div>
  );
}

function MyPClassProduct() {
  return (
    <div className="my-pclass-product">
      <header className="profile-summary product-panel"><span className="profile-avatar">P</span><div><small>Mi perfil</small><b>Completa tu registro para personalizar esta vista</b></div><Link href={eventPath("registro")}>Completar perfil</Link></header>
      <div className="plan-grid">
        <article className="plan-card product-panel active-plan"><small>Plan base</small><h2>PClass Free</h2><p>Acceso gratuito permanente.</p><ul><li>Experiencias abiertas</li><li>Recursos gratuitos</li><li>Orientación disponible</li></ul><span>Estado por confirmar</span></article>
        <article className="plan-card product-panel max7"><small>Vista de elegibilidad</small><h2>PClass MAX7</h2><p>7 días de acceso Max como mecanismo de adquisición.</p><span>No activado</span></article>
        <article className="plan-card product-panel on30"><small>Beneficio Experience OnlyOne</small><h2>PClass ON30</h2><p>30 días adicionales para usuarios elegibles.</p><span>Elegibilidad por confirmar</span></article>
      </div>
    </div>
  );
}

const productStyles = `
  .product-panel { border: 1px solid var(--pclass-line); border-radius: .8rem; background: #fff; box-shadow: 0 8px 24px rgba(89,48,121,.055); }
  .live-product { display: grid; overflow: hidden; }
  .live-main { min-width: 0; padding: .8rem; background: #1a1c2c; color: #fff; }
  .product-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .7rem; padding: .2rem .25rem .8rem; }
  .product-toolbar > div { display: flex; align-items: center; gap: .45rem; }
  .product-toolbar strong { font-size: .82rem; }.live-pill { padding: .22rem .42rem; border-radius: .25rem; background: var(--pclass-purple); font-size: .58rem; font-weight: 900; }
  .alt-signals small { color: #b8b8c2; font-size: .62rem; }.alt-signals span { display: grid; width: 1.5rem; height: 1.5rem; place-items: center; border-radius: 50%; background: #fff; color: var(--pclass-purple); font-size: .52rem; font-weight: 900; }
  .video-stage { position: relative; display: grid; min-height: clamp(16rem,42vw,27rem); place-items: center; overflow: hidden; border: 1px solid #343648; border-radius: .6rem; background: #0e101c; }
  .onlyone-video { text-align: center; }.onlyone-video small { display: block; color: var(--pclass-school); font-size: 1.1rem; font-style: italic; }.onlyone-video strong { color: #fff; font-size: clamp(2.8rem,8vw,5rem); line-height: .85; letter-spacing: -.08em; }.onlyone-video strong span { color: var(--pclass-school); }.onlyone-video p { color: #eee; font-size: clamp(.9rem,2vw,1.25rem); font-weight: 900; }
  .video-stage button { position: absolute; bottom: 1rem; left: 1rem; display: grid; width: 2.3rem; height: 2.3rem; place-items: center; border: 0; border-radius: 50%; background: var(--pclass-purple); color: #fff; }.video-note { position: absolute; right: 1rem; bottom: 1.45rem; color: #8d8f9e; font-size: .62rem; }
  .live-information { display: grid; grid-template-columns: repeat(2,1fr); gap: .5rem; margin-top: .65rem; }.live-information article { display: flex; align-items: center; gap: .55rem; min-width: 0; padding: .55rem; border: 1px solid #343648; border-radius: .45rem; background: #232638; }.live-information article > span { color: var(--pclass-school); }.live-information small,.live-information b { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.live-information small { color: #9fa1ae; font-size: .56rem; }.live-information b { font-size: .66rem; }
  .chat-panel { display: grid; min-height: 31rem; grid-template-rows: auto auto 1fr auto auto; }.chat-panel > header { display: flex; align-items: center; justify-content: space-between; padding: .9rem; }.chat-panel header div { display: grid; }.chat-panel header small { color: var(--pclass-muted); font-size: .6rem; }.connection-dot { color: var(--pclass-academy); }.chat-tabs { display: grid; grid-template-columns: repeat(3,1fr); border-block: 1px solid var(--pclass-line); }.chat-tabs > * { padding: .65rem .3rem; text-align: center; font-size: .68rem; }.chat-tabs b { color: var(--pclass-purple); box-shadow: inset 0 -2px var(--pclass-purple); }.chat-empty { display: grid; place-content: center; justify-items: center; padding: 1.5rem; color: var(--pclass-muted); text-align: center; }.chat-empty > span { color: var(--pclass-purple); font-size: 1.7rem; }.chat-empty b { color: var(--pclass-ink); }.chat-empty p { max-width: 19rem; margin: .35rem 0 0; font-size: .75rem; }.reaction-picker { display: flex; justify-content: space-around; margin: .7rem; padding: .6rem; border: 1px solid var(--pclass-line); border-radius: .55rem; background: var(--pclass-canvas); }.message-box { display: flex; justify-content: space-between; margin: 0 .7rem .7rem; padding: .55rem .65rem; border: 1px solid var(--pclass-line); border-radius: .5rem; color: #aaa3ad; font-size: .7rem; }.message-box button { border: 0; background: transparent; color: var(--pclass-purple); font-weight: 900; }
  .solution-product { display: grid; overflow: hidden; }.filter-panel { display: grid; align-content: start; gap: .75rem; padding: 1rem; background: #fbfafc; border-bottom: 1px solid var(--pclass-line); }.filter-panel label { display: grid; gap: .25rem; color: var(--pclass-muted); font-size: .66rem; font-weight: 700; }.filter-panel select,.filter-panel input { width: 100%; min-height: 2.25rem; padding: .4rem .55rem; border: 1px solid #dcd7df; border-radius: .4rem; background: #fff; color: var(--pclass-ink); font-size: .7rem; }.filter-panel button { padding: .55rem; border: 0; border-radius: .4rem; background: var(--pclass-purple); color: #fff; font-size: .7rem; font-weight: 900; }.questions-panel { min-width: 0; padding: 1rem; }.status-tabs { display: flex; gap: 1rem; overflow-x: auto; border-bottom: 1px solid var(--pclass-line); }.status-tabs > * { padding: .4rem 0 .6rem; color: var(--pclass-muted); font-size: .67rem; white-space: nowrap; }.status-tabs b { color: var(--pclass-purple); border-bottom: 2px solid var(--pclass-purple); }.solution-empty-grid { display: grid; gap: .8rem; margin-top: .9rem; }.solution-empty-grid article { min-height: 10rem; padding: 1rem; border: 1px solid var(--pclass-line); border-radius: .65rem; }.solution-empty-grid article > b,.solution-empty-grid article > p { display: block; }.solution-empty-grid article > b { margin-top: 2rem; }.solution-empty-grid article > p { margin: .3rem 0; color: var(--pclass-muted); font-size: .72rem; }.state-neutral { padding: .2rem .4rem; border-radius: .3rem; background: #efedf0; color: var(--pclass-muted); font-size: .58rem; font-weight: 900; }.state-guide { display: grid; align-content: center; gap: .6rem; }.state-guide > small { color: var(--pclass-muted); font-weight: 900; text-transform: uppercase; }.state-guide > div { display: flex; align-items: center; gap: .5rem; font-size: .72rem; }.dot { width: .65rem; height: .65rem; border-radius: 50%; }.preliminary { background: #e4ad31; }.confirmed { background: var(--pclass-academy); }.corrected { background: var(--pclass-sky); }.question-detail { padding: 1rem; border-top: 1px solid var(--pclass-line); }.question-detail header { display: flex; justify-content: space-between; }.question-detail-empty { display: grid; min-height: 15rem; place-content: center; justify-items: center; text-align: center; }.question-detail-empty > span { display: grid; width: 2.8rem; height: 2.8rem; place-items: center; border-radius: .7rem; background: var(--pclass-purple-soft); color: var(--pclass-purple); font-weight: 900; }.question-detail-empty b { margin-top: .7rem; }.question-detail-empty p { max-width: 18rem; margin: .3rem 0; color: var(--pclass-muted); font-size: .72rem; }.history-note { display: flex; gap: .5rem; padding: .6rem; border-radius: .45rem; background: #eef8fd; color: #347da9; font-size: .65rem; }.history-note p { margin: 0; }
  .registration-product { display: grid; gap: 1rem; max-width: 56rem; margin-inline: auto; }.registration-card { padding: clamp(1.2rem,4vw,2rem); }.registration-card header { display: flex; justify-content: space-between; color: var(--pclass-purple); }.brand-mini { font-weight: 900; }.registration-card header small { color: var(--pclass-muted); }.progress-bar { height: .4rem; margin: .8rem 0 1.5rem; overflow: hidden; border-radius: 1rem; background: #e5e2e6; }.progress-bar span { display: block; width: 50%; height: 100%; background: var(--pclass-sky); }.registration-card h2 { margin: 0; color: var(--pclass-purple); }.registration-card > p { color: var(--pclass-muted); font-size: .82rem; }.registration-card form { display: grid; gap: .85rem; margin-top: 1.2rem; }.registration-card form label:not(.consent-field) { display: grid; gap: .28rem; font-size: .7rem; font-weight: 700; }.registration-card input { min-height: 2.7rem; padding: .55rem .7rem; border: 1px solid #cec8d2; border-radius: .45rem; }.consent-field { display: flex; align-items: flex-start; gap: .55rem; color: var(--pclass-muted); font-size: .7rem; }.consent-field input { min-height: auto; }.registration-card form button { min-height: 2.8rem; border: 0; border-radius: .45rem; background: var(--pclass-purple); color: #fff; font-weight: 900; }.form-note { display: block; margin-top: .8rem; color: var(--pclass-muted); text-align: center; font-size: .62rem; }.unlock-preview { padding: clamp(1.2rem,4vw,2rem); border-radius: .8rem; background: var(--pclass-purple); color: #fff; }.unlock-preview h3 { margin: 0 0 1.5rem; font-size: 1.65rem; line-height: 1.05; }.unlock-preview > div { display: flex; gap: .7rem; margin-top: .7rem; padding: .7rem; border: 1px solid rgba(255,255,255,.18); border-radius: .55rem; }.unlock-preview > div > span { display: grid; width: 1.7rem; height: 1.7rem; flex: 0 0 auto; place-items: center; border-radius: 50%; background: var(--pclass-academy); color: var(--pclass-purple); font-weight: 900; }.unlock-preview p { margin: 0; color: #ece5f0; font-size: .72rem; }.unlock-preview p b { display: block; color: #fff; }.preview-disclaimer { margin-top: 1.2rem !important; color: #d6c9de !important; }
  .resources-product { display: grid; gap: 1rem; }.resource-list { overflow: hidden; }.resource-list header { display: flex; justify-content: space-between; padding: 1rem; border-bottom: 1px solid var(--pclass-line); }.resource-list header div { display: grid; }.resource-list header small { color: var(--pclass-muted); font-size: .65rem; }.resource-list header > span { color: var(--pclass-purple); font-size: .68rem; font-weight: 900; }.resource-list article { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .8rem; padding: .85rem 1rem; border-bottom: 1px solid var(--pclass-line); }.resource-list article:last-child { border-bottom: 0; }.resource-list article > span { display: grid; width: 2.25rem; height: 2.25rem; place-items: center; border-radius: .55rem; background: var(--pclass-purple-soft); color: var(--pclass-purple); }.resource-list article div { display: grid; }.resource-list article small { color: var(--pclass-muted); font-size: .65rem; }.resource-list button { border: 0; background: transparent; color: #aaa4ad; }.resource-side { display: grid; gap: 1rem; }.official-card,.orientation-mini { display: flex; gap: .85rem; padding: 1rem; }.official-card > span,.orientation-mini > span { display: grid; width: 2.6rem; height: 2.6rem; flex: 0 0 auto; place-items: center; border-radius: .65rem; background: var(--pclass-purple); color: #fff; }.official-card div,.orientation-mini div { display: grid; gap: .15rem; }.official-card small,.orientation-mini small { color: var(--pclass-purple); font-weight: 900; text-transform: uppercase; }.official-card p { margin: .25rem 0 0; color: var(--pclass-muted); font-size: .7rem; }.orientation-mini a { margin-top: .5rem; color: var(--pclass-academy-deep); font-size: .72rem; font-weight: 900; }
  .results-product { display: grid; max-width: 42rem; justify-items: center; margin-inline: auto; padding: clamp(2rem,6vw,4rem); text-align: center; }.result-illustration { position: relative; display: grid; width: 7rem; height: 6rem; place-items: center; }.result-illustration > span { display: grid; width: 4rem; height: 4rem; place-items: center; border-radius: 50% 50% 42% 42%; background: var(--pclass-academy); color: var(--pclass-purple); font-size: 2rem; }.result-illustration i { position: absolute; width: .55rem; height: .55rem; border-radius: 50%; background: var(--pclass-sky); }.result-illustration i:nth-of-type(1) { top: .2rem; left: .5rem; }.result-illustration i:nth-of-type(2) { top: .6rem; right: .8rem; background: var(--pclass-purple); }.result-illustration i:nth-of-type(3) { bottom: .2rem; right: 1rem; background: var(--pclass-school); }.results-product h2 { margin: 0; color: var(--pclass-purple); }.results-product > p:not(.eyebrow) { max-width: 30rem; color: var(--pclass-muted); }.results-product button { min-height: 2.7rem; padding: .55rem 1.2rem; border: 0; border-radius: .45rem; background: #d9d5dc; color: #827a86; font-weight: 900; }.results-product > small { margin-top: .7rem; color: var(--pclass-muted); }
  .orientation-product { display: grid; gap: 1rem; }.orientation-intro { padding: clamp(1.3rem,4vw,2.2rem); }.support-avatar { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: 50%; background: var(--pclass-school); color: #fff; font-weight: 900; }.orientation-intro h2 { margin: 0; color: var(--pclass-purple); }.orientation-intro > p:not(.eyebrow) { color: var(--pclass-muted); }.orientation-options { display: grid; gap: 1rem; }.orientation-options article { display: flex; gap: 1rem; padding: 1rem; }.orientation-options article > span { display: grid; width: 2.7rem; height: 2.7rem; flex: 0 0 auto; place-items: center; border-radius: .65rem; background: var(--pclass-purple-soft); color: var(--pclass-purple); }.orientation-options article div { display: grid; align-content: start; }.orientation-options article p { margin: .3rem 0 .7rem; color: var(--pclass-muted); font-size: .72rem; }.orientation-options button { justify-self: start; border: 0; background: transparent; color: var(--pclass-academy-deep); font-size: .68rem; font-weight: 900; }
  .my-pclass-product { display: grid; gap: 1rem; }.profile-summary { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: .8rem; padding: 1rem; }.profile-avatar { display: grid; width: 3rem; height: 3rem; place-items: center; border-radius: 50%; background: var(--pclass-purple); color: #fff; font-weight: 900; }.profile-summary div { display: grid; }.profile-summary small { color: var(--pclass-muted); }.profile-summary a { grid-column: 1 / -1; padding: .55rem; border-radius: .4rem; background: var(--pclass-purple-soft); color: var(--pclass-purple); text-align: center; font-size: .72rem; font-weight: 900; }.plan-grid { display: grid; gap: 1rem; }.plan-card { padding: 1.2rem; }.plan-card > small { color: var(--pclass-muted); font-weight: 900; text-transform: uppercase; }.plan-card h2 { margin: .3rem 0; color: var(--pclass-purple); }.plan-card p { color: var(--pclass-muted); font-size: .76rem; }.plan-card ul { padding-left: 1.1rem; color: var(--pclass-muted); font-size: .72rem; }.plan-card > span { display: block; margin-top: 1rem; padding: .55rem; border-radius: .4rem; background: var(--pclass-canvas); color: var(--pclass-muted); text-align: center; font-size: .68rem; font-weight: 900; }.active-plan { border-top: 4px solid var(--pclass-sky); }.max7 { border-top: 4px solid var(--pclass-purple); }.on30 { border-top: 4px solid var(--pclass-academy); }
  @media (min-width: 680px) {
    .live-information { grid-template-columns: repeat(4,1fr); }.solution-empty-grid { grid-template-columns: 1.4fr .8fr; }.registration-product { grid-template-columns: 1fr .85fr; align-items: stretch; }.resources-product { grid-template-columns: 1.35fr .8fr; }.orientation-product { grid-template-columns: .75fr 1.25fr; }.profile-summary { grid-template-columns: auto 1fr auto; }.profile-summary a { grid-column: auto; }.plan-grid { grid-template-columns: repeat(3,1fr); }
  }
  @media (min-width: 940px) {
    .live-product { grid-template-columns: minmax(0,1.7fr) minmax(17rem,.72fr); }.solution-product { grid-template-columns: 12.5rem minmax(0,1.2fr) minmax(16rem,.8fr); }.filter-panel { border-right: 1px solid var(--pclass-line); border-bottom: 0; }.question-detail { border-top: 0; border-left: 1px solid var(--pclass-line); }.orientation-options { grid-template-columns: 1fr; }
  }
`;
