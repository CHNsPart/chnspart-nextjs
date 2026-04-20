'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { label: 'About', href: '/' },
  { label: 'Resume', href: '/resume' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
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
        {navItems.map((item) => (
          <li key={item.label} className="z-50 navbar-item">
            <Link
              href={item.href}
              className={`navbar-link z-50 ${activeItem === item.label ? 'active' : ''}`}
              onClick={() => setActiveItem(item.label)}
              aria-label={item.label}
            >
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
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
