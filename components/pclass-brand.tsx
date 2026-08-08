import Link from "next/link";
import Image from "next/image";

export function PClassBrand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      className={`brand ${inverse ? "brand-inverse" : ""}`}
      href="/"
      aria-label="Personal Class, volver al inicio"
    >
      <span className="brand-mark-wrap">
        <Image src="/personal-class-mark.png" alt="" aria-hidden="true" width={320} height={320} priority />
      </span>
      <span className="brand-copy">
        <strong>Personal Class</strong>
        <small>Academia</small>
      </span>
      <style>{`
        .brand {
          display: inline-flex;
          align-items: center;
          gap: .58rem;
          color: var(--pclass-purple);
          line-height: 1;
        }
        .brand-inverse { color: #fff; }
        .brand-mark-wrap {
          display: grid;
          width: 2.45rem;
          height: 2.45rem;
          flex: 0 0 auto;
          place-items: center;
          overflow: hidden;
          border-radius: .72rem;
          background: #fff;
        }
        .brand-mark-wrap img { width: 100%; height: 100%; object-fit: contain; }
        .brand-copy { display: grid; gap: .18rem; }
        .brand-copy strong {
          font-size: 1.12rem;
          font-weight: 900;
          letter-spacing: -.035em;
        }
        .brand-copy small {
          color: var(--pclass-academy-deep);
          font-size: .55rem;
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
        }
        .brand-inverse .brand-copy small { color: #dce487; }
      `}</style>
    </Link>
  );
}
