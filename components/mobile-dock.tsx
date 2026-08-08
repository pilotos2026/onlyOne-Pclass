import Link from "next/link";
import { eventPath, PUBLIC_SECTIONS } from "../lib/pclass-routes";

export function MobileDock() {
  const items = [
    PUBLIC_SECTIONS[0],
    PUBLIC_SECTIONS[1],
    PUBLIC_SECTIONS[2],
    PUBLIC_SECTIONS[6],
  ];

  return (
    <nav className="mobile-dock" aria-label="Accesos rápidos">
      {items.map((item) => (
        <Link key={item.slug} href={eventPath(item.slug)}>
          <span aria-hidden="true">{item.symbol}</span>
          {item.shortLabel}
        </Link>
      ))}
      <style>{`
        .mobile-dock {
          position: fixed;
          right: .75rem;
          bottom: .75rem;
          left: .75rem;
          z-index: 40;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: .45rem;
          border: 1px solid var(--pclass-line);
          border-radius: 1.15rem;
          background: rgba(255,255,255,.96);
          box-shadow: 0 18px 48px rgba(50, 24, 69, .15);
          backdrop-filter: blur(14px);
        }
        .mobile-dock a {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          gap: .2rem;
          padding: .35rem .15rem;
          color: var(--pclass-muted);
          font-size: .66rem;
          font-weight: 700;
        }
        .mobile-dock span {
          display: grid;
          width: 1.8rem;
          height: 1.8rem;
          place-items: center;
          border-radius: .58rem;
          background: var(--pclass-purple-soft);
          color: var(--pclass-purple);
          font-size: .82rem;
          font-weight: 900;
        }
        @media (min-width: 768px) { .mobile-dock { display: none; } }
      `}</style>
    </nav>
  );
}
