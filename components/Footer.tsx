import Link from 'next/link';
import { Stethoscope } from 'lucide-react';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link href="/" className="logo">
                            <div className="logo-icon"><Stethoscope size={16} color="white" /></div>
                            Find <span>USCE</span>
                        </Link>
                        <p className="footer-desc">
                            The most comprehensive directory of US Clinical Observership programs for International Medical Graduates (IMGs). Powered by Gemini AI.
                        </p>
                    </div>
                    <div>
                        <p className="footer-heading">Navigate</p>
                        <ul className="footer-links">
                            <li><Link href="/programs">Browse Programs</Link></li>
                            <li><Link href="/ask">AI Assistant</Link></li>
                            <li><Link href="/about">About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="footer-heading">Resources</p>
                        <ul className="footer-links">
                            <li><a href="https://freida.ama-assn.org" target="_blank" rel="noopener">FREIDA (AMA)</a></li>
                            <li><a href="https://www.ecfmg.org" target="_blank" rel="noopener">ECFMG</a></li>
                            <li><a href="https://www.usmle.org" target="_blank" rel="noopener">USMLE.org</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© {year} Find USCE. Built for IMGs, by AI.</span>
                    <span>Data updated daily by Gemini AI</span>
                </div>
                <p className="footer-disclaimer">
                    ⚠️ Disclaimer: Program information is sourced from publicly available data and updated via AI. Always verify eligibility, fees, and contact details directly with the program. Find USCE is not affiliated with any hospital or medical institution.
                </p>
            </div>
        </footer>
    );
}
