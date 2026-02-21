'use client';
import Link from 'next/link';
import type { Program } from '../types/program';
import { MapPin, Clock, Award, CheckCircle, XCircle } from 'lucide-react';

const GRADIENTS = [
    'linear-gradient(135deg, #4285F4, #2d6ed4)',
    'linear-gradient(135deg, #9B59B6, #7d3f9e)',
    'linear-gradient(135deg, #34A853, #268a42)',
    'linear-gradient(135deg, #4285F4, #9B59B6)',
    'linear-gradient(135deg, #EA4335, #c73329)',
    'linear-gradient(135deg, #FBBC04, #d99d00)',
    'linear-gradient(135deg, #34A853, #4285F4)',
    'linear-gradient(135deg, #9B59B6, #EA4335)',
];

function getGradient(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
    return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitials(name: string): string {
    const words = name.split(/[\s\/\-]+/).filter(w => w.length > 2 && !/^(and|of|at|the|for|in)$/i.test(w));
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

interface Props { program: Program; }

export default function ProgramCard({ program }: Props) {
    return (
        <Link href={`/programs/${program.id}`} className="program-card">
            <div className="card-header">
                <div className="card-avatar" style={{ background: getGradient(program.name) }}>
                    {getInitials(program.name)}
                </div>
                <div className="card-title-wrap">
                    <div className="card-title">{program.name}</div>
                    <div className="card-location">
                        <MapPin size={11} />
                        {program.city !== 'N/A' ? `${program.city}, ${program.stateCode}` : program.stateCode}
                    </div>
                </div>
            </div>

            <div className="card-badges">
                {program.eligibility.usmleSteps.slice(0, 2).map(s => (
                    <span key={s} className="badge badge-blue">{s}</span>
                ))}
                {program.eligibility.visaTypes.slice(0, 2).map(v => (
                    <span key={v} className="badge badge-purple">{v}</span>
                ))}
                {program.lor && <span className="badge badge-green">LOR</span>}
            </div>

            <div className="card-meta">
                <div className="card-meta-item">
                    <span className="card-meta-label">Duration</span>
                    <span className="card-meta-value">
                        <Clock size={11} style={{ display: 'inline', marginRight: 3 }} />
                        {program.duration}
                    </span>
                </div>
                <div className="card-meta-item">
                    <span className="card-meta-label">Fee</span>
                    <span className="card-meta-value" style={{ fontSize: '0.75rem' }}>{program.fee === 'Contact program for fee details' ? 'Contact program' : program.fee}</span>
                </div>
                <div className="card-meta-item">
                    <span className="card-meta-label">Graduation</span>
                    <span className="card-meta-value">{program.eligibility.graduationCutoff}</span>
                </div>
                <div className="card-meta-item">
                    <span className="card-meta-label">Deadline</span>
                    <span className="card-meta-value">{program.applicationDeadline}</span>
                </div>
            </div>

            <div className="card-footer">
                <div className={`accepting-dot`}>
                    {program.acceptingApplications ? (
                        <>
                            <div className="dot dot-green" />
                            <span style={{ color: '#81C995' }}>Accepting</span>
                        </>
                    ) : (
                        <>
                            <div className="dot dot-red" />
                            <span style={{ color: '#F28B82' }}>Not accepting</span>
                        </>
                    )}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <Award size={10} style={{ display: 'inline', marginRight: 3 }} />
                    {program.specialty}
                </span>
            </div>
        </Link>
    );
}
