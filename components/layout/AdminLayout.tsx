"use client";

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    href: '/mmm/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    href: '/mmm/clients',
    label: 'Clients',
    icon: Users
  }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/mmm');
  };

  // If we're on the login page, don't show the layout
  if (pathname === '/mmm') return children;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--eerie-black-2)] border-r border-[var(--jet)] p-6">
        <div className="mb-8">
          <h2 className="text-[var(--orange-yellow-crayola)] text-xl font-semibold">
            Admin Panel
          </h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${pathname === item.href 
                  ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)]' 
                  : 'text-[var(--light-gray)] hover:bg-[var(--jet)]'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[var(--light-gray)] 
            hover:bg-[var(--jet)] rounded-lg transition-colors mt-8"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[var(--smoky-black)] min-h-screen">
        <main className="px-8">
          {children}
        </main>
      </div>
    </div>
  );
}