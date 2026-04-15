import { Link, usePage } from '@inertiajs/react';
import { Home, Settings, User, Palette, LayoutDashboard } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

type NavGroup = {
    title: string;
    items: NavItem[];
};

const groups: NavGroup[] = [
    {
        title: 'Main',
        items: [
            { label: 'Home', href: '/', icon: Home },
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Settings',
        items: [
            { label: 'Profile', href: '/settings/profile', icon: User },
            { label: 'Password', href: '/settings/password', icon: Settings },
            { label: 'Appearance', href: '/settings/appearance', icon: Palette },
        ],
    },
];

export default function NavPanel() {
    const { url } = usePage();

    return (
        <nav className="space-y-5 p-4">
            {groups.map((group) => (
                <div key={group.title}>
                    <h3
                        className="mb-2 px-2 text-xs font-semibold tracking-wider uppercase"
                        style={{ color: 'var(--scheme-fg-muted)' }}
                    >
                        {group.title}
                    </h3>
                    <ul className="space-y-0.5">
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const active = url === item.href || url.startsWith(item.href + '/');
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors"
                                        style={{
                                            background: active ? 'var(--scheme-accent-subtle)' : undefined,
                                            color: active ? 'var(--scheme-accent)' : 'var(--scheme-fg-secondary)',
                                            fontWeight: active ? 500 : undefined,
                                        }}
                                    >
                                        <Icon className="h-4 w-4 shrink-0" />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
