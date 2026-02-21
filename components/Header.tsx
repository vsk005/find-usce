'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Stethoscope } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    return (
        <header className="header">
            <div className="container">
                <div className="header-inner">
                    <Link href="/" className="logo">
                        <div className="logo-icon">
                            <Stethoscope size={18} color="white" />
                        </div>
                        Find <span>USCE</span>
                    </Link>
                    <nav className="nav">
                        <Link href="/programs" className={`nav-link${pathname?.startsWith('/programs') ? ' active' : ''}`}>Programs</Link>
                        <Link href="/about" className={`nav-link${pathname === '/about' ? ' active' : ''}`}>About</Link>
                    </nav>
                    <Link href="/ask" className="btn-ai-chat">
                        <Sparkles size={15} />
                        Ask AI
                    </Link>
                </div>
            </div>
        </header>
    );
}
