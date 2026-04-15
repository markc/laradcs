import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    BookOpen,
    Box,
    Circle,
    Code,
    Cpu,
    FileText,
    Flame,
    Globe,
    Layers,
    Layout,
    LayoutTemplate,
    MousePointerClick,
    Paintbrush,
    Palette,
    Smartphone,
    Sparkles,
    Square,
    Sunset,
    Trees,
    Waves,
    Zap,
} from 'lucide-react';
import GithubIcon from '@/components/icons/github-icon';
import type { ComponentType, ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

type Card = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    items: string[];
};

function ServiceCard({ icon: Icon, title, items }: Card) {
    return (
        <div className="service-card">
            <span className="service-icon">
                <Icon className="h-8 w-8" />
            </span>
            <h3>{title}</h3>
            <ul>
                {items.map((i) => (
                    <li key={i}>{i}</li>
                ))}
            </ul>
        </div>
    );
}

type SectionHeader = { tag: string; title: string; subtitle: string; id?: string };

function SectionHeader({ tag, title, subtitle, id }: SectionHeader) {
    return (
        <div id={id} className="section-header">
            <span className="section-tag">{tag}</span>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
        </div>
    );
}

const featureCards: Card[] = [
    {
        icon: Palette,
        title: 'OKLCH Colors',
        items: ['Perceptually uniform', '5 color schemes', 'Dark + light modes', 'Consistent lightness'],
    },
    {
        icon: Smartphone,
        title: 'Mobile-First',
        items: ['Responsive breakpoints', 'Off-canvas sidebars', 'Desktop pinning', 'Touch-friendly'],
    },
    {
        icon: Layers,
        title: 'Cascade Layers',
        items: ['reset, tokens, base', 'components, utilities', 'animations layer', 'No specificity wars'],
    },
    {
        icon: Zap,
        title: 'React + Inertia',
        items: ['Type-safe routes', 'Persistent layouts', 'No page reloads', 'Laravel 12 + Fortify'],
    },
];

const architectureCards: Card[] = [
    {
        icon: Box,
        title: 'tokens.css',
        items: ['OKLCH colour schemes', 'Glassmorphism primitives', 'Sidebar animations', 'Scroll-reactive borders'],
    },
    {
        icon: Cpu,
        title: 'theme-context',
        items: ['Theme + scheme state', 'Sidebar open / pinned', 'Carousel mode', 'localStorage persistence'],
    },
    {
        icon: Paintbrush,
        title: 'components.css',
        items: ['Hero + service cards', 'Section headers', 'CTA buttons', 'Shimmer text animation'],
    },
    {
        icon: Sparkles,
        title: 'DCS components',
        items: ['Dual sidebars', 'Panel carousels', 'Top nav', 'Pin toggles'],
    },
];

const schemeCards: Card[] = [
    { icon: Waves, title: 'Ocean (H=220)', items: ['Cyan-blue, professional', 'Default scheme', 'Medium chroma'] },
    { icon: Flame, title: 'Crimson (H=25)', items: ['Bold red, high energy', 'High chroma', 'Strong contrast'] },
    { icon: Circle, title: 'Stone (H=60)', items: ['Warm neutral, minimal', 'Low chroma', 'Great for docs'] },
    { icon: Trees, title: 'Forest (H=150)', items: ['Natural green', 'Balanced chroma', 'Calming feel'] },
    { icon: Sunset, title: 'Sunset (H=45)', items: ['Warm orange-amber', 'High vibrancy', 'Inviting tone'] },
];

const componentCards: Card[] = [
    {
        icon: LayoutTemplate,
        title: 'App Shell',
        items: ['Fixed top nav', 'Dual sidebars (L/R)', 'Pinnable on desktop', 'Carousel panels'],
    },
    {
        icon: Square,
        title: 'Cards',
        items: ['Glassmorphism surface', 'Hover lift + glow', 'Accent bar on hover', 'Responsive grid'],
    },
    {
        icon: MousePointerClick,
        title: 'Buttons',
        items: ['shadcn/ui primitives', 'Primary / outline / ghost', 'Focus-visible rings', 'Size variants'],
    },
    {
        icon: FileText,
        title: 'Forms',
        items: ['Inertia useForm', 'Fortify validation', 'Input error helpers', 'Accessible labels'],
    },
];

const usageCards: Card[] = [
    {
        icon: Globe,
        title: 'App Shell',
        items: ['Install via laradcs', 'Own every file', 'Replace panels freely', 'Deploy to any host'],
    },
    {
        icon: BookOpen,
        title: 'Documentation',
        items: ['Inertia pages', 'Markdown via MDX', 'Persistent sidebars', 'Anchor navigation'],
    },
    {
        icon: Code,
        title: 'Admin Panel',
        items: ['Fortify auth', 'Dashboard + settings', 'Form patterns', 'Type-safe routes'],
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            {/* Hero */}
            <section className="hero-bg">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Layout className="h-4 w-4" />
                        <span>laradcs — dual carousel sidebar starter kit</span>
                    </div>
                    <h1>
                        <span className="shimmer-text">Dual Carousel</span>
                        <br />
                        Sidebars
                    </h1>
                    <h2
                        className="shimmer-text"
                        style={{
                            marginTop: '-0.1em',
                            marginBottom: '0.8em',
                            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                            fontWeight: 600,
                        }}
                    >
                        Laravel + Inertia + React
                    </h2>
                    <p>
                        A polished DCS starter kit with OKLCH colour schemes, dark/light modes, and mobile-first
                        responsive layout. Clone it, own every file, customise freely.
                    </p>
                    <div className="cta-group">
                        <a
                            href="https://github.com/markc/laradcs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-btn primary"
                        >
                            <GithubIcon className="h-5 w-5" />
                            View on GitHub
                        </a>
                        <a href="#features" className="cta-btn secondary">
                            Explore Features
                        </a>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="content-section">
                <SectionHeader
                    tag="Core Features"
                    title="Everything You Need"
                    subtitle="A complete design system wired into a Laravel starter kit"
                />
                <div className="services-grid">
                    {featureCards.map((c) => (
                        <ServiceCard key={c.title} {...c} />
                    ))}
                </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="bg-image-section">
                <SectionHeader
                    tag="Modular Architecture"
                    title="Tokens + Components"
                    subtitle="Generic DCS primitives separate from app logic"
                />
            </section>
            <section className="content-section">
                <div className="services-grid services-grid-2col">
                    {architectureCards.map((c) => (
                        <ServiceCard key={c.title} {...c} />
                    ))}
                </div>
            </section>

            {/* Color Schemes */}
            <section id="themes" className="bg-image-section">
                <SectionHeader
                    tag="Try Them Now"
                    title="5 Color Schemes"
                    subtitle="Open the right sidebar and pick one — schemes switch live"
                />
            </section>
            <section className="content-section">
                <div className="services-grid services-grid-3col" style={{ maxWidth: 960 }}>
                    {schemeCards.map((c) => (
                        <ServiceCard key={c.title} {...c} />
                    ))}
                </div>
            </section>

            {/* Components */}
            <section id="components" className="bg-image-section">
                <SectionHeader
                    tag="Built-In Components"
                    title="Ready to Use"
                    subtitle="Glass cards, shadcn primitives, forms, and layout helpers"
                />
            </section>
            <section className="content-section">
                <div className="services-grid">
                    {componentCards.map((c) => (
                        <ServiceCard key={c.title} {...c} />
                    ))}
                </div>
            </section>

            {/* Usage */}
            <section id="usage" className="bg-image-section">
                <SectionHeader
                    tag="Get Started"
                    title="Three Use Cases"
                    subtitle="Marketing shells, documentation, and admin panels"
                />
            </section>
            <section className="content-section">
                <div className="services-grid services-grid-3col">
                    {usageCards.map((c) => (
                        <ServiceCard key={c.title} {...c} />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-image-section">
                <div className="section-header">
                    <span className="section-tag">Open Source</span>
                    <h2 className="section-title">MIT Licensed</h2>
                    <p className="section-subtitle">Use it in any project, commercial or personal</p>
                    <div className="cta-group">
                        <a
                            href="https://github.com/markc/laradcs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cta-btn primary"
                        >
                            <GithubIcon className="h-5 w-5" />
                            Clone the Repo
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
