'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, FileText, Briefcase, Mail } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { label: 'About', href: '/', icon: User },
  { label: 'Resume', href: '/resume', icon: FileText },
  { label: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { label: 'Contact', href: '/contact', icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const currentPath = pathname === '/' ? 'About' : pathname.slice(1);
    setActiveItem(currentPath.charAt(0).toUpperCase() + currentPath.slice(1));
  }, [pathname]);

  return (
    <nav className="navbar z-50">
      <ul className="z-50 navbar-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label} className="z-50 navbar-item">
              <Link
                href={item.href}
                className={`navbar-link z-50 ${activeItem === item.label ? 'active' : ''}`}
                onClick={() => setActiveItem(item.label)}
                aria-label={item.label}
              >
                <Icon className="navbar-icon" size={20} strokeWidth={1.75} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="navbar-item">
          <Link
            href="https://root.chnspart.com"
            className="navbar-link"
            aria-label="Root"
          >
            <Image
              src="/images/orb.svg"
              alt=""
              width={24}
              height={24}
              className="navbar-brand"
              aria-hidden="true"
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
