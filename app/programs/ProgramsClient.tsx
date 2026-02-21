'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProgramCard from '../../components/ProgramCard';
import type { Program } from '../../types/program';
import { Search, SlidersHorizontal, X, RefreshCw, Filter } from 'lucide-react';

interface Props { programs: Program[]; states: string[]; }

const USMLE_OPTS = ['All', 'Step 1', 'Step 2 CK', 'Step 1, Step 2 CK'];
const VISA_OPTS = ['All', 'J1', 'H1B', 'F1', 'O1', 'EAD'];
const PER_PAGE = 24;

export default function ProgramsClient({ programs, states }: Props) {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading programs…</div>}>
            <ProgramsClientInner programs={programs} states={states} />
        </Suspense>
    );
}

function ProgramsClientInner({ programs, states }: Props) {
    const searchParams = useSearchParams();


    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [state, setState] = useState('All');
    const [usmle, setUsmle] = useState('All');
    const [visa, setVisa] = useState('All');
    const [lor, setLor] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const [sort, setSort] = useState('name');
    const [page, setPage] = useState(1);
    const [mobileFilter, setMobileFilter] = useState(false);

    const filtered = useMemo(() => {
        let r = [...programs];
        if (search) {
            const q = search.toLowerCase();
            r = r.filter(p => p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.state.toLowerCase().includes(q) || p.hospital.toLowerCase().includes(q));
        }
        if (state !== 'All') r = r.filter(p => p.state === state);
        if (usmle !== 'All') r = r.filter(p => p.eligibility.usmleSteps.join(', ').includes(usmle) || (usmle === 'Step 1' && p.eligibility.usmleSteps.includes('Step 1')));
        if (visa !== 'All') r = r.filter(p => p.eligibility.visaTypes.some(v => v.includes(visa)) || p.eligibility.visaTypes.includes('Any valid US visa'));
        if (lor) r = r.filter(p => p.lor);
        if (accepting) r = r.filter(p => p.acceptingApplications);
        if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name));
        else if (sort === 'state') r.sort((a, b) => a.state.localeCompare(b.state));
        else if (sort === 'accepting') r.sort((a, b) => Number(b.acceptingApplications) - Number(a.acceptingApplications));
        return r;
    }, [programs, search, state, usmle, visa, lor, accepting, sort]);

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    useEffect(() => { setPage(1); }, [search, state, usmle, visa, lor, accepting]);

    const resetFilters = () => { setSearch(''); setState('All'); setUsmle('All'); setVisa('All'); setLor(false); setAccepting(false); };

    const FiltersPanel = () => (
        <div className={`filters-panel${mobileFilter ? ' open' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Filters</span>
                <button className="mobile-filter-btn" style={{ display: 'flex' }} onClick={() => setMobileFilter(false)}><X size={16} /></button>
            </div>

            <div className="filter-section">
                <label className="filter-label">Search</label>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="filter-input" style={{ paddingLeft: 32 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Hospital, city, state…" />
                </div>
            </div>

            <div className="filter-section">
                <label className="filter-label">State</label>
                <select className="filter-select" value={state} onChange={e => setState(e.target.value)}>
                    <option value="All">All States</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">USMLE Requirement</label>
                <select className="filter-select" value={usmle} onChange={e => setUsmle(e.target.value)}>
                    {USMLE_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>

            <div className="filter-section">
                <label className="filter-label">Visa Type</label>
                <select className="filter-select" value={visa} onChange={e => setVisa(e.target.value)}>
                    {VISA_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
            </div>

            <div className="filter-section">
                <div className="filter-toggle">
                    <span className="filter-toggle-label">🏆 Offers LOR</span>
                    <button className={`toggle${lor ? ' active' : ''}`} onClick={() => setLor(!lor)} aria-label="Toggle LOR filter" />
                </div>
                <div className="filter-toggle">
                    <span className="filter-toggle-label">✅ Currently Accepting</span>
                    <button className={`toggle${accepting ? ' active' : ''}`} onClick={() => setAccepting(!accepting)} aria-label="Toggle accepting filter" />
                </div>
            </div>

            <button className="filter-reset" onClick={resetFilters}>
                <RefreshCw size={13} style={{ display: 'inline', marginRight: 5 }} /> Reset All Filters
            </button>
        </div>
    );

    return (
        <div>
            <div className="programs-toolbar">
                <div className="results-count">
                    Showing <strong>{filtered.length}</strong> of {programs.length} programs
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button className="mobile-filter-btn" onClick={() => setMobileFilter(!mobileFilter)}>
                        <Filter size={14} /> Filters
                    </button>
                    <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="name">Sort: A-Z</option>
                        <option value="state">Sort: By State</option>
                        <option value="accepting">Sort: Accepting First</option>
                    </select>
                </div>
            </div>

            <div className="programs-layout">
                <FiltersPanel />
                <div className="programs-main">
                    {paged.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <div className="empty-title">No programs found</div>
                            <div className="empty-desc">Try adjusting your filters or search terms</div>
                            <button className="filter-reset" style={{ marginTop: '1rem', maxWidth: 200 }} onClick={resetFilters}>Reset Filters</button>
                        </div>
                    ) : (
                        <div className="programs-grid">
                            {paged.map(p => <ProgramCard key={p.id} program={p} />)}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>←</button>
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                                if (p < 1 || p > totalPages) return null;
                                return <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>;
                            })}
                            <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>→</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
