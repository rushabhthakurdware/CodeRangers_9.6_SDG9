// components/layout/Sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, LayoutDashboard, Map, Wrench, DollarSign, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/',
      icon: 'LayoutDashboard',
    },
    {
      id: 'repairs',
      label: 'Repairs',
      href: '/repairs',
      icon: 'Wrench',
      badge: 37,
    },
    {
      id: 'maps',
      label: 'Risk Map',
      href: '/maps',
      icon: 'Map',
    },
    {
      id: 'budget',
      label: 'Budget',
      href: '/budget',
      icon: 'DollarSign',
    },
  ];

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
      Wrench: <Wrench className="w-5 h-5" />,
      Map: <Map className="w-5 h-5" />,
      DollarSign: <DollarSign className="w-5 h-5" />,
    };
    return iconMap[iconName];
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-lg"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative w-64 h-screen bg-white border-r border-slate-200 transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IP</span>
            </div>
            <span>InfraPrioritizer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Municipal Decision System</p>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.has(item.id);

            return (
              <div key={item.id}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      toggleExpanded(item.id);
                    } else {
                      // Close sidebar on mobile after navigation
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors',
                    active
                      ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="flex-shrink-0">
                      {item.icon && getIcon(item.icon)}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {/* Badge */}
                  {item.badge && !hasChildren && (
                    <span className="flex-shrink-0 ml-auto bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {/* Chevron for expandable items */}
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 flex-shrink-0 transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  )}
                </Link>

                {/* Child items */}
                {hasChildren && isExpanded && (
                  <div className="mt-1 ml-6 space-y-1 border-l border-slate-200">
                    {item.children!.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive(child.href)
                            ? 'text-blue-600 bg-blue-50 font-medium'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        )}
                      >
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Quick Stats</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-slate-600">Assets</p>
                <p className="text-lg font-bold text-slate-900">156</p>
              </div>
              <div>
                <p className="text-slate-600">P1 Issues</p>
                <p className="text-lg font-bold text-red-600">12</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}