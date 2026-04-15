import { BookOpen, GraduationCap, Globe, Mail, Server } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type AboutLink = {
    label: string;
    href: string;
    icon: LucideIcon;
};

const upstream: AboutLink[] = [
    { label: 'dcs.spa', href: 'https://dcs.spa', icon: Globe },
    { label: 'Documentation', href: 'https://github.com/markc/laradcs#readme', icon: BookOpen },
];

const related: AboutLink[] = [
    { label: 'motd.com', href: 'https://motd.com', icon: Mail },
    { label: 'renta.net', href: 'https://renta.net', icon: Server },
    { label: 'SPE Docs', href: 'https://github.com/markc/spe', icon: GraduationCap },
];

function Item({ link }: { link: AboutLink }) {
    const Icon = link.icon;
    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
            style={{ color: 'var(--scheme-fg-secondary)' }}
        >
            <Icon className="h-4 w-4 shrink-0" />
            {link.label}
        </a>
    );
}

export default function AboutPanel() {
    return (
        <nav className="space-y-1 p-4">
            {upstream.map((link) => (
                <Item key={link.label} link={link} />
            ))}
            <div className="sidebar-divider" />
            {related.map((link) => (
                <Item key={link.label} link={link} />
            ))}
        </nav>
    );
}
