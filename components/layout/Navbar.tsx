'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <nav className="navbar">
      <ul className="navbar-list">
        {navItems.map((item) => (
          <li key={item.label} className="navbar-item">
            <Link
              href={item.href}
              className={`navbar-link ${activeItem === item.label ? 'active' : ''}`}
              onClick={() => setActiveItem(item.label)}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="navbar-item">
          <a href="https://root.chnspart.com">
            <button className="navbar-link">✨</button>
          </a>
        </li>
      </ul>
    </nav>
  );
}