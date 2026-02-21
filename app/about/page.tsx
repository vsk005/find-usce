export const metadata = {
    title: 'About — Find USCE',
    description: 'About Find USCE — the AI-powered directory of US Clinical Observership programs for IMGs.',
};

export default function AboutPage() {
    return (
        <>
            <div className="about-hero">
                <div className="container">
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                        About <span className="gradient-text">Find USCE</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
                        Find USCE is an AI-powered directory built exclusively for International Medical Graduates (IMGs) seeking US Clinical Experience through observership programs.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            {
                                icon: '🎯',
                                title: 'Our Mission',
                                desc: 'To make US Clinical Experience accessible to every IMG by providing a comprehensive, accurate, and always-updated directory of observership and clinical shadowing programs.',
                            },
                            {
                                icon: '🤖',
                                title: 'How AI Updates Work',
                                desc: 'Every 24 hours, Gemini AI searches program websites and public sources to update fee, eligibility, contact information, and application status for all listed programs.',
                            },
                            {
                                icon: '📊',
                                title: 'Data Sources',
                                desc: 'Program information is gathered from official hospital websites, FREIDA (AMA), and program coordinator pages. All data is attributed to publicly available sources.',
                            },
                            {
                                icon: '⚠️',
                                title: 'Data Disclaimer',
                                desc: 'While we strive for accuracy, always verify program details directly with the institution before applying. Program requirements change frequently.',
                            },
                            {
                                icon: '🌍',
                                title: 'Built for IMGs',
                                desc: 'Designed with the IMG journey in mind — from understanding USMLE requirements to navigating visa eligibility and finding programs that offer Letters of Recommendation.',
                            },
                            {
                                icon: '💡',
                                title: 'Open & Free',
                                desc: 'Find USCE is completely free to use. Our goal is to democratize access to USCE information for IMGs worldwide.',
                            },
                        ].map(f => (
                            <div key={f.title} className="feature-card">
                                <div className="feature-icon">{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Technology Stack</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {['Next.js 14 (App Router)', 'TypeScript', 'Gemini 2.0 Flash AI', 'Vercel Deployment', 'GitHub Actions (24h Cron)', 'Google Fonts (Inter)'].map(t => (
                                <span key={t} className="badge badge-blue" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
