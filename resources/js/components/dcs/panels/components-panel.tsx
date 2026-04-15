import { Box, Code, Layers, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Link = { label: string; href: string; icon: LucideIcon };

const main: Link[] = [
    { label: 'Features', href: '#features', icon: Zap },
    { label: 'Architecture', href: '#architecture', icon: Layers },
    { label: 'Components', href: '#components', icon: Box },
];

const extra: Link[] = [{ label: 'Usage Guide', href: '#usage', icon: Code }];

function Item({ link }: { link: Link }) {
    const Icon = link.icon;
    return (
        <a
            href={link.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
            style={{ color: 'var(--scheme-fg-secondary)' }}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {link.label}
        </a>
    );
}

export default function ComponentsPanel() {
    return (
        <nav className="space-y-1 p-4">
            {main.map((link) => (
                <Item key={link.label} link={link} />
            ))}
            <div className="sidebar-divider" />
            {extra.map((link) => (
                <Item key={link.label} link={link} />
            ))}
        </nav>
    );
}
