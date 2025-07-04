'use client';

import { UserRole } from '@/app/interfaces/user';
import { routes } from '@/lib/router';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  RectangleStackIcon,
  BanknotesIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as SearchIconSolid,
  RectangleStackIcon as StackIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  UserIcon as UserIconSolid,
  ChatBubbleLeftRightIcon as ChatIconSolid,
  Cog6ToothIcon as CogIconSolid,
  PlusCircleIcon as PlusIconSolid,
  DocumentTextIcon as DocumentIconSolid,
  ChartBarIcon as ChartIconSolid
} from '@heroicons/react/24/solid';

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

export default function DashboardSidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const getNavigationItems = (userRole: UserRole): NavigationItem[] => {
    if (userRole === 'PROMOTER') {
      return [
        {
          name: 'Dashboard',
          href: routes.promoter.dashboard,
          icon: HomeIcon,
          activeIcon: HomeIconSolid,
          description: 'Overview & stats'
        },
        {
          name: 'Explore Campaigns',
          href: routes.promoter.explore,
          icon: MagnifyingGlassIcon,
          activeIcon: SearchIconSolid,
          description: 'Find new opportunities'
        },
        {
          name: 'My Campaigns',
          href: routes.promoter.campaigns,
          icon: RectangleStackIcon,
          activeIcon: StackIconSolid,
          description: 'Active & applied campaigns'
        },
        {
          name: 'Earnings',
          href: routes.promoter.earnings,
          icon: BanknotesIcon,
          activeIcon: BanknotesIconSolid,
          description: 'Wallet & payouts'
        },
        {
          name: 'My Profile',
          href: routes.promoter.profile,
          icon: UserIcon,
          activeIcon: UserIconSolid,
          description: 'Portfolio & skills'
        },
        {
          name: 'Messages',
          href: routes.promoter.messages,
          icon: ChatBubbleLeftRightIcon,
          activeIcon: ChatIconSolid,
          description: 'Chat with advertisers'
        },
        {
          name: 'Settings',
          href: routes.promoter.settings,
          icon: Cog6ToothIcon,
          activeIcon: CogIconSolid,
          description: 'Preferences & integrations'
        }
      ];
    } else if (userRole === 'ADVERTISER') {
      return [
        {
          name: 'Dashboard',
          href: routes.advertiser.dashboard,
          icon: HomeIcon,
          activeIcon: HomeIconSolid,
          description: 'Overview & metrics'
        },
        {
          name: 'My Campaigns',
          href: routes.advertiser.campaigns,
          icon: RectangleStackIcon,
          activeIcon: StackIconSolid,
          description: 'Manage campaigns'
        },
        {
          name: 'Applications',
          href: routes.advertiser.applications,
          icon: DocumentTextIcon,
          activeIcon: DocumentIconSolid,
          description: 'Review promoter applications'
        },
        {
          name: 'Create Campaign',
          href: routes.advertiser.campaignCreate,
          icon: PlusCircleIcon,
          activeIcon: PlusIconSolid,
          description: 'Launch new campaign'
        },
        {
          name: 'Stats',
          href: routes.advertiser.stats,
          icon: ChartBarIcon,
          activeIcon: ChartIconSolid,
          description: 'Performance analytics'
        },
        {
          name: 'Profile',
          href: routes.advertiser.profile,
          icon: UserIcon,
          activeIcon: UserIconSolid,
          description: 'Company info'
        },
        {
          name: 'Messages',
          href: routes.advertiser.messages,
          icon: ChatBubbleLeftRightIcon,
          activeIcon: ChatIconSolid,
          description: 'Communicate with promoters'
        },
        {
          name: 'Settings',
          href: routes.advertiser.settings,
          icon: Cog6ToothIcon,
          activeIcon: CogIconSolid,
          description: 'Account settings'
        }
      ];
    }
    
    return [];
  };

  const navigationItems = getNavigationItems(role);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <SidebarContent 
            navigationItems={navigationItems} 
            isActive={isActive} 
            onClose={onClose}
            showCloseButton={true}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r border-gray-200">
        <SidebarContent 
          navigationItems={navigationItems} 
          isActive={isActive}
          showCloseButton={false}
        />
      </div>
    </>
  );
}

interface SidebarContentProps {
  navigationItems: NavigationItem[];
  isActive: (href: string) => boolean;
  onClose?: () => void;
  showCloseButton: boolean;
}

function SidebarContent({ navigationItems, isActive, onClose, showCloseButton }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo and close button */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <Link href={routes.home} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CP</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Crowd Prop</span>
        </Link>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const active = isActive(item.href);
          const Icon = active ? item.activeIcon : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  active ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
              />
              <div className="flex-1">
                <div>{item.name}</div>
                {item.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Crowd Prop
        </div>
      </div>
    </div>
  );
}
