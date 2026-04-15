import AppDualSidebarLayout from '@/layouts/app/app-dual-sidebar-layout';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children }: AppLayoutProps) => <AppDualSidebarLayout>{children}</AppDualSidebarLayout>;
