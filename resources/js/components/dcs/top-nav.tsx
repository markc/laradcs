import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function TopNav() {
    const { name } = usePage<SharedData>().props;
    return (
        <header
            className="flex h-[var(--topnav-height)] items-center justify-center border-b"
            style={{
                background: 'var(--scheme-bg-secondary)',
                borderColor: 'var(--scheme-border)',
            }}
        >
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--scheme-accent)' }}>
                {name}
            </h1>
        </header>
    );
}
