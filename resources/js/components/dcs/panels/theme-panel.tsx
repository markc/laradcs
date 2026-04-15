import { useTheme, type CarouselMode, type ColorScheme, type ThemeMode } from '@/contexts/theme-context';

const schemes: { id: ColorScheme; label: string; hue: number }[] = [
    { id: 'ocean', label: 'Ocean', hue: 220 },
    { id: 'crimson', label: 'Crimson', hue: 30 },
    { id: 'stone', label: 'Stone', hue: 60 },
    { id: 'forest', label: 'Forest', hue: 150 },
    { id: 'sunset', label: 'Sunset', hue: 45 },
];

function ToggleGroup<T extends string>({
    options,
    value,
    onChange,
}: {
    options: { value: T; label: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <div className="flex overflow-hidden rounded-md border" style={{ borderColor: 'var(--scheme-border)' }}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className="flex-1 px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{
                        background: value === opt.value ? 'var(--scheme-accent-subtle)' : 'transparent',
                        color: value === opt.value ? 'var(--scheme-accent)' : 'var(--scheme-fg-muted)',
                    }}
                    onMouseEnter={(e) => {
                        if (value !== opt.value) e.currentTarget.style.background = 'var(--scheme-bg-secondary)';
                    }}
                    onMouseLeave={(e) => {
                        if (value !== opt.value) e.currentTarget.style.background = 'transparent';
                    }}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export default function ThemePanel() {
    const { theme, scheme, carouselMode, sidebarWidth, toggleTheme, setScheme, setCarouselMode, setSidebarWidth } = useTheme();

    return (
        <div className="space-y-5 p-4">
            <ToggleGroup<ThemeMode>
                options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                ]}
                value={theme}
                onChange={(v) => {
                    if (v !== theme) toggleTheme();
                }}
            />

            <ToggleGroup<CarouselMode>
                options={[
                    { value: 'slide', label: 'Slide' },
                    { value: 'fade', label: 'Fade' },
                ]}
                value={carouselMode}
                onChange={setCarouselMode}
            />

            <div>
                <label
                    className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--scheme-fg-muted)' }}
                >
                    <span>Sidebar width</span>
                    <span style={{ color: 'var(--scheme-fg-secondary)' }}>{sidebarWidth}px</span>
                </label>
                <input
                    type="range"
                    min={200}
                    max={500}
                    value={sidebarWidth}
                    onChange={(e) => setSidebarWidth(Number(e.target.value))}
                    className="scheme-range w-full"
                />
            </div>

            <div className="space-y-1">
                {schemes.map((s) => {
                    const active = scheme === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => setScheme(s.id)}
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
                            style={{
                                background: active ? 'var(--scheme-accent-subtle)' : undefined,
                                color: active ? 'var(--scheme-accent)' : 'var(--scheme-fg-secondary)',
                                border: active ? '2px solid var(--scheme-accent)' : '2px solid transparent',
                                fontWeight: active ? 500 : undefined,
                            }}
                        >
                            <span
                                className="h-[1.125rem] w-[1.125rem] shrink-0 rounded-full"
                                style={{ background: `oklch(50% 0.15 ${s.hue})` }}
                            />
                            {s.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
