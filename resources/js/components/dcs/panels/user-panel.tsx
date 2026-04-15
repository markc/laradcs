import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, User as UserIcon } from 'lucide-react';
import type { SharedData } from '@/types';

export default function UserPanel() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;

    if (!user) {
        return (
            <div className="space-y-3 p-4">
                <p className="text-sm" style={{ color: 'var(--scheme-fg-secondary)' }}>
                    You are not signed in.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium"
                    style={{ background: 'var(--scheme-accent)', color: 'var(--scheme-accent-fg)' }}
                >
                    Sign in
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center gap-3">
                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: 'var(--scheme-accent-subtle)', color: 'var(--scheme-accent)' }}
                >
                    <UserIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: 'var(--scheme-fg-primary)' }}>
                        {user.name}
                    </p>
                    <p className="truncate text-xs" style={{ color: 'var(--scheme-fg-muted)' }}>
                        {user.email}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Link
                    href="/settings/profile"
                    className="rounded-md px-3 py-1.5 text-sm transition-colors"
                    style={{ color: 'var(--scheme-fg-secondary)' }}
                >
                    Profile
                </Link>
                <Link
                    href="/settings/password"
                    className="rounded-md px-3 py-1.5 text-sm transition-colors"
                    style={{ color: 'var(--scheme-fg-secondary)' }}
                >
                    Password
                </Link>
                <button
                    onClick={() => router.post('/logout')}
                    className="flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors"
                    style={{ color: 'var(--scheme-fg-secondary)' }}
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
