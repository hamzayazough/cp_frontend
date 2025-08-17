"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UserRole } from "@/app/interfaces/user";
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logout } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { routes } from "@/lib/router";
import NotificationBadge from "@/components/ui/NotificationBadge";
import { notificationSystemService } from "@/services/notification-system.service";

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole: UserRole;
  onMenuClick: () => void;
}

export default function DashboardHeader({
  userName,
  userEmail,
  userAvatar,
  userRole,
  onMenuClick,
}: DashboardHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  // Fetch unread count on component mount
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await notificationSystemService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  const handleViewAllNotifications = async () => {
    try {
      // Get the most recent unread notification
      const recentNotifications = await notificationSystemService.getDropdownNotifications(1);
      
      if (recentNotifications.length > 0) {
        // Navigate to the most recent unread notification detail page
        const mostRecentNotification = recentNotifications[0];
        router.push(routes.dashboardNotificationDetails(mostRecentNotification.id));
      } else {
        // No unread notifications, go to the general notifications page
        router.push(routes.dashboardNotifications);
      }
    } catch (error) {
      console.error("Failed to fetch recent notifications:", error);
      // Fallback to notifications page
      router.push(routes.dashboardNotifications);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "ADVERTISER":
        return "bg-blue-100 text-blue-800";
      case "PROMOTER":
        return "bg-green-100 text-green-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="hidden lg:block ml-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-blue-600">CP</div>
              <div className="h-8 w-px bg-gray-300" />
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                  userRole
                )}`}
              >
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleViewAllNotifications}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
            >
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <NotificationBadge
                  count={unreadCount}
                  size="sm"
                  variant="danger"
                />
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              {" "}
              <div className="flex-shrink-0">
                {userAvatar ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <Image
                      src={userAvatar}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      style={{ width: "100%", height: "100%" }}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {userName?.charAt(0) || userEmail?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {userName || "User"}
                </div>
                <div className="text-xs text-gray-500">{userEmail}</div>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <Link
                    href={routes.dashboardProfile}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
