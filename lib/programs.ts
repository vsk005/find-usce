import programsData from '../data/programs.json';
import type { Program, FilterOptions } from '../types/program';

export const programs: Program[] = programsData as Program[];

export function getAllPrograms(): Program[] {
    return programs;
}

export function getProgramById(id: string): Program | undefined {
    return programs.find(p => p.id === id);
}

export function getAllStates(): string[] {
    const states = [...new Set(programs.map(p => p.state))].filter(s => s !== 'United States');
    return states.sort();
}

export function getAllSpecialties(): string[] {
    return [...new Set(programs.map(p => p.specialty))].sort();
}

export function filterPrograms(opts: Partial<FilterOptions>): Program[] {
    let result = [...programs];

    if (opts.search) {
        const q = opts.search.toLowerCase();
        result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.hospital.toLowerCase().includes(q) ||
            p.city.toLowerCase().includes(q) ||
            p.state.toLowerCase().includes(q) ||
            p.tags.some(t => t.toLowerCase().includes(q))
        );
    }

    if (opts.state && opts.state !== 'All') {
        result = result.filter(p => p.state === opts.state);
    }

    if (opts.usmleStep && opts.usmleStep !== 'All') {
        result = result.filter(p => p.eligibility.usmleSteps.includes(opts.usmleStep!));
    }

    if (opts.visaType && opts.visaType !== 'All') {
        result = result.filter(p =>
            p.eligibility.visaTypes.includes(opts.visaType!) ||
            p.eligibility.visaTypes.includes('Any valid US visa')
        );
    }

    if (opts.lor !== null && opts.lor !== undefined) {
        result = result.filter(p => p.lor === opts.lor);
    }

    if (opts.acceptingApplications !== null && opts.acceptingApplications !== undefined) {
        result = result.filter(p => p.acceptingApplications === opts.acceptingApplications);
    }

    return result;
}

export function getStats() {
    const total = programs.length;
    const states = new Set(programs.map(p => p.stateCode)).size;
    const accepting = programs.filter(p => p.acceptingApplications).length;
    const withLor = programs.filter(p => p.lor).length;
    return { total, states, accepting, withLor };
}
