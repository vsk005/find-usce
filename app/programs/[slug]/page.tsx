import { getProgramById, getAllPrograms } from '../../../lib/programs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, Calendar, Award, CheckCircle, XCircle, ArrowLeft, Globe, Mail, Phone, User, Sparkles } from 'lucide-react';

const GRADIENTS = [
    'linear-gradient(135deg, #4285F4, #2d6ed4)',
    'linear-gradient(135deg, #9B59B6, #7d3f9e)',
    'linear-gradient(135deg, #34A853, #268a42)',
    'linear-gradient(135deg, #4285F4, #9B59B6)',
    'linear-gradient(135deg, #EA4335, #c73329)',
];

function getGradient(name: string): string {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
    return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}
function getInitials(name: string): string {
    const words = name.split(/[\s\/\-]+/).filter(w => w.length > 2 && !/^(and|of|at|the)$/i.test(w));
    return words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
}

export async function generateStaticParams() {
    const programs = getAllPrograms();
    return programs.map(p => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const program = getProgramById(slug);
    if (!program) return { title: 'Program Not Found' };
    return {
        title: `${program.name} — Find USCE`,
        description: program.description,
    };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const program = getProgramById(slug);
    if (!program) notFound();

    const gradient = getGradient(program.name);
    const initials = getInitials(program.name);

    return (
        <div className="container">
            <div style={{ paddingTop: '1.5rem', marginBottom: '1rem' }}>
                <Link href="/programs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <ArrowLeft size={14} /> Back to Programs
                </Link>
            </div>

            <div className="detail-layout">
                {/* Main */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Header Card */}
                    <div className="detail-card">
                        <div className="detail-header">
                            <div className="detail-avatar" style={{ background: gradient }}>
                                {initials}
                            </div>
                            <div>
                                <h1 className="detail-title">{program.name}</h1>
                                <div className="detail-subtitle">
                                    <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                                    {program.city !== 'N/A' ? `${program.city}, ${program.state}` : program.state}
                                    <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
                                    <Award size={13} style={{ display: 'inline', marginRight: 4 }} />
                                    {program.specialty}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '0.75rem' }}>
                                    {program.acceptingApplications
                                        ? <span className="badge badge-green"><CheckCircle size={10} /> Accepting Applications</span>
                                        : <span className="badge badge-red"><XCircle size={10} /> Not Currently Accepting</span>
                                    }
                                    {program.lor && <span className="badge badge-blue">Offers LOR</span>}
                                    {program.tags.map(t => <span key={t} className="badge badge-gray">{t}</span>)}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="section-title">About This Program</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{program.description}</p>
                        </div>

                        {/* Quick Meta */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {[
                                { label: 'Duration', value: program.duration, icon: <Clock size={14} /> },
                                { label: 'Deadline', value: program.applicationDeadline, icon: <Calendar size={14} /> },
                                { label: 'Specialty', value: program.specialty, icon: <Award size={14} /> },
                            ].map(m => (
                                <div key={m.label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ color: 'var(--primary-light)', marginBottom: 6 }}>{m.icon}</div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{m.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Eligibility */}
                    <div className="detail-card">
                        <p className="section-title">Eligibility Requirements</p>
                        <div className="eligibility-grid">
                            <div className="eligibility-item">
                                <div className="eligibility-item-label">USMLE Steps Required</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {program.eligibility.usmleSteps.map(s => <span key={s} className="badge badge-blue">{s}</span>)}
                                </div>
                            </div>
                            <div className="eligibility-item">
                                <div className="eligibility-item-label">Accepted Visa Types</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {program.eligibility.visaTypes.map(v => <span key={v} className="badge badge-purple">{v}</span>)}
                                </div>
                            </div>
                            <div className="eligibility-item">
                                <div className="eligibility-item-label">Graduation Cutoff</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{program.eligibility.graduationCutoff}</p>
                            </div>
                            <div className="eligibility-item">
                                <div className="eligibility-item-label">Clinical Experience</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{program.eligibility.clinicalExperience}</p>
                            </div>
                            <div className="eligibility-item" style={{ gridColumn: '1 / -1' }}>
                                <div className="eligibility-item-label">Additional Notes</div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{program.eligibility.additionalNotes}</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Ask Shortcut */}
                    <div style={{ background: 'var(--gemini-gradient-subtle)', border: '1px solid rgba(66,133,244,0.2)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Sparkles size={20} style={{ color: 'var(--primary-light)' }} />
                            <div>
                                <div style={{ fontWeight: 700 }}>Have Questions About This Program?</div>
                                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Ask our AI assistant for personalized advice</div>
                            </div>
                        </div>
                        <Link href={`/ask?program=${encodeURIComponent(program.name)}`} className="btn-ai-chat" style={{ fontSize: '0.875rem' }}>
                            <Sparkles size={14} /> Ask AI Assistant
                        </Link>
                    </div>

                    {/* Data Info */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
                        Last verified by Gemini AI: {program.lastVerified}. Data updates every 24 hours. Always verify directly with the program.
                    </div>
                </div>

                {/* Sidebar */}
                <div>
                    <div className="contact-card" style={{ top: 80 }}>
                        <p className="section-title">Contact &amp; Application</p>

                        <div className="contact-item">
                            <span className="contact-item-label"><Mail size={11} style={{ display: 'inline', marginRight: 3 }} />Email</span>
                            {program.contact.email
                                ? <a href={`mailto:${program.contact.email}`} className="contact-item-value">{program.contact.email}</a>
                                : <span className="contact-item-value na">Contact program directly</span>}
                        </div>

                        <div className="contact-item">
                            <span className="contact-item-label"><Phone size={11} style={{ display: 'inline', marginRight: 3 }} />Phone</span>
                            {program.contact.phone
                                ? <a href={`tel:${program.contact.phone}`} className="contact-item-value">{program.contact.phone}</a>
                                : <span className="contact-item-value na">Contact program directly</span>}
                        </div>

                        <div className="contact-item">
                            <span className="contact-item-label"><Globe size={11} style={{ display: 'inline', marginRight: 3 }} />Website</span>
                            {program.contact.website
                                ? <a href={program.contact.website} target="_blank" rel="noopener" className="contact-item-value">{program.contact.website.replace('https://', '').replace('http://', '').split('/')[0]}</a>
                                : <span className="contact-item-value na">Not available</span>}
                        </div>

                        <div className="contact-item">
                            <span className="contact-item-label"><User size={11} style={{ display: 'inline', marginRight: 3 }} />Coordinator</span>
                            <span className="contact-item-value">{program.contact.coordinatorName || 'Program Coordinator'}</span>
                        </div>

                        <div className="contact-item" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <span className="contact-item-label">💰 Fee</span>
                            <span className="contact-item-value" style={{ fontWeight: program.fee !== 'Contact program for fee details' ? 700 : 400, color: program.fee !== 'Contact program for fee details' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                                {program.fee}
                            </span>
                        </div>

                        {program.contact.website
                            ? <a href={program.contact.website} target="_blank" rel="noopener" className="btn-contact">
                                <Globe size={16} /> Visit Program Website
                            </a>
                            : <a href={`mailto:${program.contact.email || 'contact@hospital.edu'}`} className="btn-contact">
                                <Mail size={16} /> Contact Program
                            </a>
                        }
                        <Link href={`/ask?program=${encodeURIComponent(program.name)}`} className="btn-secondary">
                            <Sparkles size={14} /> Ask AI About This Program
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
