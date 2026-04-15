import { usePage } from '@inertiajs/react';
import { Layers } from 'lucide-react';
import type { SharedData } from '@/types';

export default function AboutPanel() {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center gap-3">
                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: 'var(--scheme-accent-subtle)', color: 'var(--scheme-accent)' }}
                >
                    <Layers className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--scheme-fg-primary)' }}>
                        {name}
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--scheme-fg-muted)' }}>
                        Built with laradcs
                    </p>
                </div>
            </div>

            <p className="text-sm" style={{ color: 'var(--scheme-fg-secondary)' }}>
                This is the <strong>About</strong> panel — swap it out for anything useful: release notes,
                status, a changelog feed, or a help index.
            </p>

            <p className="text-xs" style={{ color: 'var(--scheme-fg-muted)' }}>
                Reference implementation: <a href="https://dcs.spa" className="underline">dcs.spa</a>
            </p>
        </div>
    );
}
