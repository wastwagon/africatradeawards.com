'use client'

import Link from 'next/link'

const cards = [
  {
    href: '/nominate/',
    title: 'Nominations',
    body: 'Submit and manage award nominations with clear progress tracking from intake to validation.',
    icon: 'fa-solid fa-user-plus',
    cta: 'Nominate now',
  },
  {
    href: '/vote/',
    title: 'Public Voting',
    body: 'Enable audience participation with secure verification and anti-fraud checks built into the flow.',
    icon: 'fa-solid fa-list-check',
    cta: 'Cast vote',
  },
  {
    href: '/portal/entrant/',
    title: 'Entrant Workspace',
    body: 'Entrants can draft submissions, upload evidence, and monitor review decisions in one dashboard.',
    icon: 'fa-solid fa-pen-to-square',
    cta: 'Open portal',
  },
  {
    href: '/login/',
    title: 'Judging & Operations',
    body: 'A single sign-in routes judges, staff, and administrators to role-specific workflows and controls.',
    icon: 'fa-solid fa-user-shield',
    cta: 'Access dashboard',
  },
] as const

export default function EngagePlatformSection() {
  return (
    <section className="engage-platform-section" aria-labelledby="engage-platform-heading">
      <div className="engage-platform-bg" aria-hidden />
      <div className="container">
        <div className="engage-platform-head text-center" data-aos="fade-up" data-aos-duration={600}>
          <p className="engage-platform-eyebrow">Core platform services</p>
          <h2 id="engage-platform-heading" className="engage-platform-title">
            Everything needed to run a premium awards programme
          </h2>
          <p className="engage-platform-intro">
            This is the operational layer behind the public brand experience: nominee intake, entrant submissions,
            judging, voting, and role-based administration.
          </p>
        </div>
        <div className="row g-4 engage-platform-row">
          {cards.map((card, i) => (
            <div key={card.href} className="col-md-6 col-lg-3 d-flex">
              <div
                className="engage-card w-100"
                data-aos="fade-up"
                data-aos-duration={600}
                data-aos-delay={i * 80}
              >
                <div className="engage-card-icon" aria-hidden>
                  <i className={card.icon} />
                </div>
                <h3 className="engage-card-title">{card.title}</h3>
                <p className="engage-card-body">{card.body}</p>
                <Link href={card.href} className="engage-card-cta vl-btn1">
                  <span className="engage-card-cta-text">{card.cta}</span>
                  <i className="fa-solid fa-arrow-right" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .engage-platform-section {
          position: relative;
          padding: 72px 0 88px;
          overflow: hidden;
        }
        .engage-platform-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 10% 0%, rgba(255, 190, 120, 0.14) 0%, transparent 55%),
            radial-gradient(ellipse 70% 45% at 95% 100%, rgba(120, 80, 140, 0.18) 0%, transparent 55%),
            linear-gradient(180deg, #fffaf5 0%, #f6f0fa 45%, #faf7fc 100%);
        }
        .engage-platform-head {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto 48px;
        }
        .engage-platform-eyebrow {
          font-family: var(--grotesk), sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c45a2a;
          margin: 0 0 10px;
        }
        .engage-platform-title {
          font-family: var(--grotesk), sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          font-weight: 700;
          color: var(--ztc-text-text-2);
          line-height: 1.2;
          margin: 0 0 14px;
        }
        .engage-platform-intro {
          font-family: var(--figtree), system-ui, sans-serif;
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--ztc-text-text-3);
          margin: 0;
        }
        .engage-platform-row {
          position: relative;
          z-index: 1;
        }
        .engage-card {
          height: 100%;
          background: rgba(255, 255, 255, 0.88);
          border-radius: 20px;
          padding: 28px 24px 26px;
          border: 1px solid rgba(120, 80, 140, 0.12);
          box-shadow: 0 12px 40px rgba(78, 43, 90, 0.08);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .engage-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 48px rgba(78, 43, 90, 0.12);
        }
        .engage-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(255, 200, 140, 0.45) 0%, rgba(120, 80, 140, 0.2) 100%);
          color: #4e2b5a;
          font-size: 1.25rem;
          margin-bottom: 18px;
        }
        .engage-card-title {
          font-family: var(--grotesk), sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--ztc-text-text-2);
          margin: 0 0 10px;
        }
        .engage-card-body {
          font-family: var(--figtree), system-ui, sans-serif;
          font-size: 0.98rem;
          line-height: 1.55;
          color: var(--ztc-text-text-3);
          margin: 0 0 20px;
          flex: 1 1 auto;
        }
        .engage-card-cta:global(.vl-btn1) {
          margin-top: auto;
          align-self: stretch;
          width: 100%;
          box-sizing: border-box;
          /* Override global .vl-btn1 { display: inline-block } so height is reliable */
          display: inline-flex !important;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 8px 10px;
          /* Fixed height so all four cards match; fits two lines of uppercase CTA + icon */
          height: 4.5rem;
          min-height: 4.5rem;
          max-height: 4.5rem;
          padding: 10px 16px 10px 20px;
          text-align: center;
          text-decoration: none;
        }
        .engage-card-cta-text {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-align: center;
          line-height: 1.2;
          word-break: break-word;
          min-width: 0;
          max-width: 12em;
        }
        .engage-card-cta i {
          font-size: 0.8rem;
          flex-shrink: 0;
          line-height: 1;
        }
        @media (max-width: 767px) {
          .engage-platform-section {
            padding: 56px 0 64px;
          }
        }
      `}</style>
    </section>
  )
}
