import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Pin, PinOff } from 'lucide-react';
import PanelCarousel from '@/components/dcs/panel-carousel';
import { useTheme } from '@/contexts/theme-context';

interface SidebarProps {
    side: 'left' | 'right';
    panels: { label: string; content: ReactNode }[];
}

// Min/max mirror setSidebarWidth() in theme-context.tsx
const MIN_WIDTH = 200;
const MAX_WIDTH = 500;

export default function Sidebar({ side, panels }: SidebarProps) {
    const theme = useTheme();
    const state = theme[side];
    const dragging = useRef(false);

    // Drag the inner edge to resize. Left edge maps clientX directly; right edge
    // measures from the viewport's right. We set the CSS var live during the drag
    // (cheap, no React churn) and commit to persisted state only on release.
    const widthFor = (clientX: number) => {
        const raw = side === 'left' ? clientX : window.innerWidth - clientX;
        return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, raw));
    };
    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        document.body.classList.add('dcs-resizing');
    };
    const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        document.documentElement.style.setProperty('--sidebar-width', `${widthFor(e.clientX)}px`);
    };
    const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return;
        dragging.current = false;
        document.body.classList.remove('dcs-resizing');
        theme.setSidebarWidth(widthFor(e.clientX));
    };

    return (
        <aside
            className={`sidebar-${side} sidebar-slide page-fade-in fixed top-0 ${side}-0 z-40 flex h-screen w-[var(--sidebar-width)] flex-col ${
                state.open ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
            }`}
            style={{
                background: 'var(--scheme-bg-secondary)',
            }}
        >
            <PanelCarousel
                panels={panels}
                activePanel={state.panel}
                onPanelChange={(i) => theme.setPanel(side, i)}
                side={side}
                headerSlot={
                    <button
                        onClick={() => theme.pinSidebar(side)}
                        className="hover:bg-background hidden rounded p-1 transition-colors xl:block"
                        style={{ color: state.pinned ? 'var(--scheme-accent)' : 'var(--scheme-fg-muted)' }}
                        aria-label={state.pinned ? 'Unpin sidebar' : 'Pin sidebar'}
                    >
                        {state.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                    </button>
                }
            />
            {state.open && (
                <div
                    className="sidebar-resizer"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    role="separator"
                    aria-orientation="vertical"
                    aria-label="Resize sidebar"
                />
            )}
        </aside>
    );
}
