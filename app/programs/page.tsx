import { getAllPrograms, getAllStates } from '../../lib/programs';
import ProgramsClient from './ProgramsClient';

export const metadata = {
    title: 'Browse Programs — Find USCE',
    description: 'Search 500+ Internal Medicine observership programs. Filter by state, USMLE requirements, visa type, and more.',
};

export default function ProgramsPage() {
    const programs = getAllPrograms();
    const states = getAllStates();
    return (
        <div className="container" style={{ paddingTop: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Browse Programs</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                    {programs.length}+ Internal Medicine observership programs across the US
                </p>
            </div>
            <ProgramsClient programs={programs} states={states} />
        </div>
    );
}
