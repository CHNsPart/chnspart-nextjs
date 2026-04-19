"use client";

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, LogOut, Filter, Menu, X, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/mmm/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/mmm/clients', label: 'Clients', icon: Users },
  { href: '/mmm/campaigns', label: 'Campaigns', icon: Filter },
  { href: '/mmm/visitors', label: 'Visitors', icon: Eye },
];

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 px-6 py-8 border-b border-[var(--jet)]">
      <div className="relative">
        <Image
          src="/images/favicon.ico"
          alt="CHNsPart Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--eerie-black-2)]" />
      </div>
      <div>
        <h2 className="text-[var(--orange-yellow-crayola)] text-2xl font-bold">CHNsPart</h2>
        <p className="text-[var(--light-gray-70)] text-xs">Admin Panel</p>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/mmm');
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  if (pathname === '/mmm') return children;

  return (
    <div className="min-h-screen bg-[var(--smoky-black)] lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[var(--eerie-black-2)] border-b border-[var(--jet)] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/favicon.ico" alt="CHNsPart Logo" width={32} height={32} className="object-contain" />
            <h2 className="text-[var(--orange-yellow-crayola)] text-xl font-semibold">CHNsPart</h2>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[var(--white-2)] hover:bg-[var(--jet)] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col sticky top-0 h-screen z-30 bg-[var(--eerie-black-2)] border-r border-[var(--jet)]">
        <SidebarBrand />
        <nav className="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)] shadow-lg shadow-[var(--orange-yellow-crayola)]/20'
                      : 'text-[var(--light-gray)] hover:bg-[var(--jet)] hover:text-[var(--white-2)]'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[var(--orange-yellow-crayola)] rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon size={20} className={`relative z-10 ${isActive ? 'stroke-[2.5]' : ''}`} />
                  <span className={`relative z-10 font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {!isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-[var(--orange-yellow-crayola)] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mt-auto pt-6 border-t border-[var(--jet)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[var(--light-gray)]
              hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
            >
              <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[var(--eerie-black-2)] border-r border-[var(--jet)] z-50 overflow-y-auto"
          >
            <SidebarBrand />
            <nav className="flex flex-col px-4 py-6">
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`
                          group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                          ${isActive
                            ? 'bg-[var(--orange-yellow-crayola)] text-[var(--smoky-black)] shadow-lg shadow-[var(--orange-yellow-crayola)]/20'
                            : 'text-[var(--light-gray)] hover:bg-[var(--jet)] hover:text-[var(--white-2)]'
                          }
                        `}
                      >
                        <item.icon size={20} className={isActive ? 'stroke-[2.5]' : ''} />
                        <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 pt-6 border-t border-[var(--jet)]"
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[var(--light-gray)]
                  hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
                >
                  <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="font-medium">Logout</span>
                </button>
              </motion.div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content — grid column 2, minmax(0,1fr) guarantees children can shrink */}
      <main className="min-w-0 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
