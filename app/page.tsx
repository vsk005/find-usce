import Link from 'next/link';
import { getAllPrograms, getStats } from '../lib/programs';
import { Sparkles, Search, RefreshCw, Shield, ChevronRight, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const stats = getStats();
  const featured = getAllPrograms().filter(p => p.acceptingApplications).slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              AI-Powered • Updated Daily
            </div>
            <h1 className="hero-title">
              Find Your Perfect<br />
              <span className="gradient-text">US Observership</span>
            </h1>
            <p className="hero-subtitle">
              The most comprehensive directory of US Clinical Experience (USCE) programs in Internal Medicine for International Medical Graduates.
            </p>

            {/* Search */}
            <div className="search-container">
              <form action="/programs" method="get">
                <div className="search-input-wrap">
                  <Search size={18} />
                  <input
                    className="search-input"
                    name="q"
                    type="text"
                    placeholder="Search by hospital, city, or state…"
                    id="hero-search"
                  />
                  <button type="submit" className="search-btn">Search Programs</button>
                </div>
              </form>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">{stats.total}+</div>
                <div className="hero-stat-label">Programs</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{stats.states}</div>
                <div className="hero-stat-label">States</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{stats.accepting}</div>
                <div className="hero-stat-label">Accepting Now</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">{stats.withLor}</div>
                <div className="hero-stat-label">Offer LOR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Update Banner */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="update-banner">
          <RefreshCw size={16} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>AI Auto-Updated Daily</strong> — Program data is verified and enriched by Gemini AI every 24 hours from official hospital and program websites.
          </span>
        </div>
      </div>

      {/* Featured Programs */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow"><Sparkles size={14} /> Currently Accepting</div>
            <h2 className="section-title-lg">Featured Programs</h2>
            <p className="section-desc">Programs currently accepting applications. Data updated by Gemini AI.</p>
          </div>

          <div className="programs-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {featured.map(p => (
              <Link key={p.id} href={`/programs/${p.id}`} className="program-card">
                <div className="card-header">
                  <div className="card-avatar" style={{ background: 'linear-gradient(135deg, #4285F4, #9B59B6)', fontSize: '0.9rem' }}>
                    {p.name.split(' ').filter(w => w.length > 3).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'IM'}
                  </div>
                  <div className="card-title-wrap">
                    <div className="card-title">{p.name}</div>
                    <div className="card-location" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      📍 {p.city !== 'N/A' ? `${p.city}, ${p.stateCode}` : p.stateCode}
                    </div>
                  </div>
                </div>
                <div className="card-badges">
                  {p.eligibility.usmleSteps.slice(0, 2).map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                  {p.lor && <span className="badge badge-green">LOR</span>}
                </div>
                <div className="card-footer">
                  <span style={{ fontSize: '0.75rem', color: '#81C995', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34A853', boxShadow: '0 0 6px #34A853', display: 'inline-block' }} />
                    Accepting
                  </span>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/programs" className="btn-ai-chat" style={{ display: 'inline-flex', padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Browse All {stats.total}+ Programs <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title-lg">Why Find USCE?</h2>
            <p className="section-desc">Built specifically for IMGs navigating the US residency application journey.</p>
          </div>
          <div className="feature-grid">
            {[
              { icon: '🤖', title: 'AI-Powered Updates', desc: 'Gemini AI searches program websites and updates fee, eligibility, and contact data every 24 hours automatically.' },
              { icon: '🔍', title: 'Advanced Filtering', desc: 'Filter by USMLE step requirements, visa type, LOR availability, graduation cutoff, and application status.' },
              { icon: '🏥', title: '500+ Programs', desc: 'Comprehensive coverage of Internal Medicine observership programs across all 50 states and Puerto Rico.' },
              { icon: '💬', title: 'AI Assistant', desc: 'Ask USCE Assist anything — "Which programs accept J1 visa only?" or "Cheapest programs in New York?"' },
              { icon: '📋', title: 'Complete Details', desc: 'Program name, eligibility, fees, duration, contact info, LOR availability, and accepting status all in one place.' },
              { icon: '⚡', title: 'Real-Time Status', desc: 'Know instantly which programs are currently accepting applications so you can apply at the right time.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div style={{ background: 'var(--gemini-gradient-subtle)', border: '1px solid rgba(66,133,244,0.2)', borderRadius: 'var(--radius-xl)', padding: '3rem 2rem' }}>
            <Sparkles size={40} style={{ margin: '0 auto 1rem', color: 'var(--primary-light)' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ask AI Anything</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Our AI assistant knows all 500+ programs. Ask it to find the best match for your profile.
            </p>
            <Link href="/ask" className="btn-ai-chat" style={{ display: 'inline-flex', padding: '0.875rem 2rem', fontSize: '1rem' }}>
              <Sparkles size={18} /> Chat with USCE Assist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
