import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Plus, ClipboardList, HelpCircle, Heart, User, Bell } from 'lucide-react';
import { FaXTwitter, FaInstagram, FaLinkedin, FaTiktok } from 'react-icons/fa6';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage<{ auth: { user: { unread_notifications_count?: number } } }>();
    const user = page.props.auth.user;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'İlan Ver',
            href: '/ilanver',
            icon: Plus,
        },
        {
            title: 'İlanlarım',
            href: '/ilanlarim',
            icon: ClipboardList,
        },
        {
            title: 'Favorilerim',
            href: '/favorilerim',
            icon: Heart,
        },
        {
            title: 'Bildirimler',
            href: '/bildirimler',
            icon: Bell,
            badge: user.unread_notifications_count,
        },
        {
            title: 'Profilime Git',
            href: '/profil',
            icon: User,
        },
    ];

const footerNavItems: NavItem[] = [
    {
        title: 'Yardım Merkezi',
        href: '/yardim',
        icon: HelpCircle,
    },
];

const socialNavItems: NavItem[] = [
    {
        title: 'X',
        href: 'https://twitter.com/kampusx',
        icon: FaXTwitter,
    },
    {
        title: 'Instagram',
        href: 'https://instagram.com/kampusx',
        icon: FaInstagram,
    },
    {
        title: 'LinkedIn',
        href: 'https://linkedin.com/company/kampusx',
        icon: FaLinkedin,
    },
    {
        title: 'TikTok',
        href: 'https://tiktok.com/@kampusx',
        icon: FaTiktok,
    },
];


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={socialNavItems} className="mt-auto" />
                <NavFooter items={footerNavItems} className="mt-2" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
