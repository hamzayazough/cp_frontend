'use client';

import { ReactNode, useState } from 'react';
import { UserRole } from '@/app/interfaces/user';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export default function DashboardLayout({
  children,
  userRole,
  userName,
  userEmail,
  userAvatar,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        role={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:ml-64">
        {/* Header */}
        <DashboardHeader
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          userRole={userRole}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-white bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
