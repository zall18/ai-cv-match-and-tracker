'use client';

import Link from 'next/link';
import { Wand2 } from 'lucide-react';
import { GoogleLoginButton } from '../GoogleLoginButton';

export function Navbar() {
  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'About Us', href: '#about' },
  ];

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Wand2 className="w-6 h-6 text-brand-tertiary" />
        <span className="font-bold text-xl text-brand-primary">CV Matcher</span>
      </div>

      <div className="hidden md:flex bg-slate-100 p-1 rounded-full items-center">
        {navItems.map((item) => {
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all text-brand-secondary hover:text-brand-primary hover:bg-slate-200"
            >
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>

      <div>
        <GoogleLoginButton />
      </div>
    </nav>
  );
}
