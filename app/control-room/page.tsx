import Link from "next/link";
import { redirect } from "next/navigation";
import { PClassBrand } from "../../components/pclass-brand";
import { getControlRoomAccess } from "../../lib/auth/control-room-access";
import { STAFF_ROLE_LABELS } from "../../lib/auth/roles";

const MODULES = ["Dashboard", "Eventos", "Preguntas", "Solucionario", "Chat", "Recursos", "Leads", "Orientación", "Configuración", "Contingencia"];

const METRICS = [
  ["Usuarios registrados", "—", "Sin registros conectados"],
  ["Mensajes en chat", "—", "Sin mensajes conectados"],
  ["Preguntas recibidas", "—", "Sin preguntas conectadas"],
  ["Leads captados", "—", "Sin leads conectados"],
] as const;

export const dynamic = "force-dynamic";

export default async function ControlRoomPreview() {
  const access = await getControlRoomAccess();

  if (access.state === "unauthenticated") {
    redirect("/control-room/login");
  }

  if (access.state === "denied") {
    return (
      <main className="login-page">
        <section className="login-card">
          <p className="eyebrow">Acceso restringido</p>
          <h1>Falta asignar un rol</h1>
          <p>La cuenta {access.email ?? "actual"} no tiene permisos operativos.</p>
          <form action="/control-room/logout" method="post"><button className="button button-purple" type="submit">Cerrar sesión</button></form>
        </section>
      </main>
    );
  }

  const operatorRole = access.state === "authorized"
    ? STAFF_ROLE_LABELS[access.role]
    : "Vista previa segura";
  const operatorEmail = access.state === "authorized" ? access.email : null;

  return (
    <main className="control-room">
      <aside className="control-sidebar">
        <PClassBrand inverse />
        <span className="control-room-label">Control Room</span>
        <nav aria-label="Módulos operativos">
          {MODULES.map((module, index) => <span className={index === 0 ? "active" : ""} key={module}><i>{module.charAt(0)}</i>{module}</span>)}
        </nav>
        <Link href="/">← Volver a la experiencia</Link>
      </aside>
      <section className="control-content">
        <header className="control-topbar">
          <div><small>Evento activo</small><strong>Solucionario UNCP 2026-II</strong></div>
          <div className="admin-preview">
            <span>{operatorRole}</span>
            <b>{operatorEmail ?? "Supabase pendiente"}</b>
            {access.state === "authorized" ? <form action="/control-room/logout" method="post"><button type="submit">Salir</button></form> : null}
          </div>
        </header>
        <div className="control-heading"><div><p className="eyebrow">Operación del evento</p><h1>Dashboard</h1></div><button type="button" disabled>Configurar evento</button></div>
        <div className="metric-grid">
          {METRICS.map(([label,value,note]) => <article key={label}><small>{label}</small><strong>{value}</strong><span>{note}</span></article>)}
        </div>
        <div className="dashboard-grid">
          <section className="dashboard-card chart-card">
            <header><strong>Actividad en tiempo real</strong><small>Última hora</small></header>
            <div className="empty-chart"><div className="chart-axis"><i></i><i></i><i></i><i></i></div><span>La gráfica se activará con eventos reales.</span></div>
          </section>
          <section className="dashboard-card source-card">
            <header><strong>Distribución por fuente</strong><small>Leads</small></header>
            <div className="empty-donut"><span>—</span></div><p>Sin datos de captación</p>
          </section>
          <section className="dashboard-card activity-card">
            <header><strong>Actividad reciente</strong><small>AuditLog</small></header>
            <div className="empty-activity"><span>◷</span><b>Sin actividad registrada</b><p>Los cambios críticos aparecerán aquí con usuario y fecha.</p></div>
          </section>
        </div>
        <section className="dashboard-card operations-table">
          <header><div><strong>Operación académica</strong><small>Preguntas y respuestas</small></div><button type="button" disabled>Nueva pregunta</button></header>
          <div className="table-head"><span>#</span><span>Área</span><span>Curso</span><span>Estado público</span><span>Responsable</span><span>Validador</span><span>Acciones</span></div>
          <div className="table-empty"><span>✓</span><b>Aún no hay preguntas</b><p>Se mostrarán únicamente datos creados por el equipo autorizado.</p></div>
        </section>
      </section>
      <style>{`
        .control-room { min-height: 100vh; background: var(--pclass-canvas); }
        .control-sidebar { display: none; }
        .control-content { min-width: 0; padding: 1rem; }
        .control-topbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin: -1rem -1rem 1.2rem; padding: .7rem 1rem; background: var(--pclass-purple); color: #fff; }.control-topbar > div { display: grid; }.control-topbar small { color: #d8cde0; font-size: .58rem; }.control-topbar strong { font-size: .72rem; }.admin-preview { text-align: right; }.admin-preview span { color: #dce487; font-size: .58rem; }.admin-preview b { max-width: 13rem; overflow: hidden; font-size: .68rem; text-overflow: ellipsis; white-space: nowrap; }.admin-preview form { margin-top: .15rem; }.admin-preview button { padding: 0; border: 0; background: transparent; color: #fff; cursor: pointer; font: inherit; font-size: .58rem; text-decoration: underline; }
        .control-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; }.control-heading h1 { margin: 0; color: var(--pclass-purple); font-size: 2.25rem; }.control-heading button,.operations-table button { padding: .55rem .8rem; border: 0; border-radius: .4rem; background: #dad6dc; color: #8e8791; font-size: .67rem; font-weight: 900; }
        .metric-grid { display: grid; gap: .75rem; margin-top: 1.2rem; }.metric-grid article { display: grid; min-width: 0; padding: .9rem; border: 1px solid var(--pclass-line); border-top: 3px solid var(--pclass-purple); border-radius: .65rem; background: #fff; }.metric-grid small { color: var(--pclass-muted); font-size: .62rem; }.metric-grid strong { color: var(--pclass-purple); font-size: 1.7rem; }.metric-grid span { overflow: hidden; color: var(--pclass-muted); font-size: .58rem; text-overflow: ellipsis; white-space: nowrap; }.metric-grid article:nth-child(2) { border-top-color: var(--pclass-academy); }.metric-grid article:nth-child(3) { border-top-color: var(--pclass-sky); }.metric-grid article:nth-child(4) { border-top-color: var(--pclass-school); }
        .dashboard-grid { display: grid; gap: .75rem; margin-top: .75rem; }.dashboard-card { overflow: hidden; border: 1px solid var(--pclass-line); border-radius: .65rem; background: #fff; }.dashboard-card > header { display: flex; justify-content: space-between; gap: .5rem; padding: .8rem; border-bottom: 1px solid var(--pclass-line); }.dashboard-card header > div { display: grid; }.dashboard-card header small { color: var(--pclass-muted); font-size: .58rem; }
        .empty-chart { display: grid; min-height: 12rem; place-items: center; padding: 1rem; color: var(--pclass-muted); font-size: .66rem; }.chart-axis { position: relative; width: 100%; height: 7rem; border-left: 1px solid #ddd8e0; border-bottom: 1px solid #ddd8e0; }.chart-axis i { position: absolute; right: 0; left: 0; border-top: 1px dashed #e5e1e7; }.chart-axis i:nth-child(1) { top: 20%; }.chart-axis i:nth-child(2) { top: 40%; }.chart-axis i:nth-child(3) { top: 60%; }.chart-axis i:nth-child(4) { top: 80%; }
        .source-card { display: grid; grid-template-rows: auto 1fr auto; justify-items: center; }.source-card header { width: 100%; }.empty-donut { display: grid; width: 6rem; height: 6rem; place-items: center; margin: 1.2rem; border: 1.1rem solid #e9e5eb; border-radius: 50%; color: var(--pclass-muted); }.source-card > p { margin: 0 0 1rem; color: var(--pclass-muted); font-size: .65rem; }
        .empty-activity { display: grid; min-height: 12rem; place-content: center; justify-items: center; padding: 1rem; text-align: center; }.empty-activity > span { color: var(--pclass-purple); font-size: 1.5rem; }.empty-activity p { max-width: 16rem; margin: .25rem 0; color: var(--pclass-muted); font-size: .65rem; }
        .operations-table { margin-top: .75rem; }.operations-table > header { align-items: center; }.table-head { display: none; grid-template-columns: 2.5rem 1fr 1fr 1fr 1fr 1fr 4rem; gap: .5rem; padding: .6rem .8rem; background: #f2f0f3; color: var(--pclass-muted); font-size: .58rem; font-weight: 900; }.table-empty { display: grid; min-height: 11rem; place-content: center; justify-items: center; padding: 1rem; text-align: center; }.table-empty > span { display: grid; width: 2.4rem; height: 2.4rem; place-items: center; border-radius: 50%; background: var(--pclass-purple-soft); color: var(--pclass-purple); }.table-empty b { margin-top: .5rem; }.table-empty p { margin: .2rem 0; color: var(--pclass-muted); font-size: .67rem; }
        @media (min-width: 620px) { .metric-grid { grid-template-columns: repeat(2,1fr); }.dashboard-grid { grid-template-columns: 1.4fr .7fr; }.activity-card { grid-column: 1 / -1; } }
        @media (min-width: 980px) {
          .control-room { display: grid; grid-template-columns: 13rem minmax(0,1fr); }.control-sidebar { position: sticky; top: 0; display: flex; height: 100vh; flex-direction: column; padding: 1rem .75rem; background: var(--pclass-purple); color: #fff; }.control-room-label { margin: .7rem .5rem 1rem; color: #dce487; font-size: .58rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }.control-sidebar nav { display: grid; gap: .12rem; }.control-sidebar nav > span { display: flex; align-items: center; gap: .55rem; padding: .48rem .55rem; border-radius: .45rem; color: #e5ddea; font-size: .68rem; }.control-sidebar nav i { display: grid; width: 1.1rem; font-style: normal; text-align: center; }.control-sidebar nav > span.active { background: rgba(255,255,255,.16); color: #fff; font-weight: 900; }.control-sidebar > a { margin-top: auto; padding: .55rem; color: #dce487; font-size: .65rem; }.control-content { padding: 1.2rem 1.5rem 3rem; }.control-topbar { margin: -1.2rem -1.5rem 1.2rem; padding-inline: 1.5rem; }.metric-grid { grid-template-columns: repeat(4,1fr); }.dashboard-grid { grid-template-columns: 1.5fr .65fr .85fr; }.activity-card { grid-column: auto; }.table-head { display: grid; }
        }
      `}</style>
    </main>
  );
}
