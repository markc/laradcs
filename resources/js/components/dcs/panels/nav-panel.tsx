import { Link, usePage } from '@inertiajs/react';
import { Box, Code, Github, Home, Layers, Palette, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NavLink = {
    label: string;
    icon: LucideIcon;
} & ({ href: string; external?: false } | { href: string; external: true });

const mainLinks: NavLink[] = [
    { label: 'Home', icon: Home, href: '/dashboard' },
    { label: 'GitHub', icon: Github, href: 'https://github.com/markc/laradcs', external: true },
];

const sectionLinks: NavLink[] = [
    { label: 'Features', icon: Zap, href: '#features' },
    { label: 'Architecture', icon: Layers, href: '#architecture' },
    { label: 'Color Schemes', icon: Palette, href: '#themes' },
    { label: 'Components', icon: Box, href: '#components' },
    { label: 'Usage', icon: Code, href: '#usage' },
];

function Item({ link, active }: { link: NavLink; active?: boolean }) {
    const Icon = link.icon;
    const className = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors';
    const style = {
        background: active ? 'var(--scheme-accent-subtle)' : undefined,
        color: active ? 'var(--scheme-accent)' : 'var(--scheme-fg-secondary)',
        fontWeight: active ? 500 : undefined,
    };

    const content = (
        <>
            <Icon className="h-4 w-4 shrink-0" />
            {link.label}
        </>
    );

    if (link.external) {
        return (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
                {content}
            </a>
        );
    }

    if (link.href.startsWith('#')) {
        return (
            <a href={link.href} className={className} style={style}>
                {content}
            </a>
        );
    }

    return (
        <Link href={link.href} className={className} style={style}>
            {content}
        </Link>
    );
}

export default function NavPanel() {
    const { url } = usePage();

    return (
        <nav className="space-y-1 p-4">
            {mainLinks.map((link) => (
                <Item
                    key={link.label}
                    link={link}
                    active={!link.external && (url === link.href || url.startsWith(link.href + '/'))}
                />
            ))}

            <div className="sidebar-divider" />

            {sectionLinks.map((link) => (
                <Item key={link.label} link={link} />
            ))}
        </nav>
    );
}
