import { usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import Sidebar from '@/components/dcs/sidebar';
import TopNav from '@/components/dcs/top-nav';
import AboutPanel from '@/components/dcs/panels/about-panel';
import AppPanel from '@/components/dcs/panels/app-panel';
import ComponentsPanel from '@/components/dcs/panels/components-panel';
import NavPanel from '@/components/dcs/panels/nav-panel';
import ThemePanel from '@/components/dcs/panels/theme-panel';
import UserPanel from '@/components/dcs/panels/user-panel';
import { ThemeProvider, useTheme } from '@/contexts/theme-context';

const leftPanels = [
    { label: 'L1: Navigation', content: <NavPanel /> },
    { label: 'L2: About', content: <AboutPanel /> },
    { label: 'L3: App', content: <AppPanel /> },
];

const rightPanels = [
    { label: 'R1: Appearance', content: <ThemePanel /> },
    { label: 'R2: Components', content: <ComponentsPanel /> },
    { label: 'R3: Account', content: <UserPanel /> },
];

function LayoutContent({ children }: { children: ReactNode }) {
    const { left, right, toggleSidebar } = useTheme();

    useEffect(() => {
        const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 0);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.classList.add('dcs-shell');
        return () => document.body.classList.remove('dcs-shell');
    }, []);

    return (
        <div className="text-foreground relative">
            <button
                onClick={() => toggleSidebar('left')}
                className="text-foreground fixed top-[0.625rem] left-3 z-50 rounded-lg p-1.5 transition-colors hover:text-[var(--scheme-accent)]"
                style={{
                    background: 'var(--glass)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                }}
                aria-label="Toggle left sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>
            <button
                onClick={() => toggleSidebar('right')}
                className="text-foreground fixed top-[0.625rem] right-3 z-50 rounded-lg p-1.5 transition-colors hover:text-[var(--scheme-accent)]"
                style={{
                    background: 'var(--glass)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                }}
                aria-label="Toggle right sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>

            <Sidebar side="left" panels={leftPanels} />
            <Sidebar side="right" panels={rightPanels} />

            <TopNav />

            <div
                className="sidebar-slide min-h-screen"
                style={{
                    marginInlineStart: left.pinned ? 'var(--sidebar-width)' : undefined,
                    marginInlineEnd: right.pinned ? 'var(--sidebar-width)' : undefined,
                }}
            >
                <main key={usePage().url} className="page-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AppDualSidebarLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
    );
}
