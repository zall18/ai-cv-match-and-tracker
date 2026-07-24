'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wand2, Settings, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kanban Tracker', href: '/tracker', icon: LayoutDashboard },
    { name: 'AI Matcher', href: '/matcher', icon: Wand2 },
  ];

  const secondaryItems = [
    { name: 'Profil', href: '#', icon: User },
    { name: 'Pengaturan', href: '#', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // force reload to clear states
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-2 border-b border-slate-100">
        <Wand2 className="w-6 h-6 text-brand-tertiary" />
        <span className="font-bold text-xl text-brand-primary">CV Matcher</span>
      </div>

      <div className="flex-1 py-6 px-4 flex flex-col gap-8">
        <div>
          <h4 className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-4 px-2">Menu Utama</h4>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-brand-primary text-white' 
                      : 'text-brand-secondary hover:text-brand-primary hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-4 px-2">Lainnya</h4>
          <nav className="flex flex-col gap-1">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-secondary hover:text-brand-primary hover:bg-slate-100 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
