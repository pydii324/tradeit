import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bitcoin, ChartCandlestick, DollarSign, Factory, LayoutGrid, ScrollText, Wallet, WalletMinimal } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { balance } = usePage().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Spot',
            href: '/spot',
            icon: WalletMinimal
        },
        {
            title: 'Futures',
            href: '/futures',
            icon: ChartCandlestick
        },
    ];

    const newsNavItems: NavItem[] = [
        {
            title: 'Crypto',
            href: '/news/crypto',
            icon: Bitcoin
        },
        {
            title: 'Energy',
            href: '/news/energy',
            icon: Factory
        }
    ]
    
    const footerNavItems: NavItem[] = [
        {
            title: `Balance: $${balance}`,
            href: '/balance',
            icon: Wallet,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain title="Platform" items={mainNavItems} />
            </SidebarContent>

            <SidebarContent> 
                <NavMain title="News" items={newsNavItems} />
             </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
