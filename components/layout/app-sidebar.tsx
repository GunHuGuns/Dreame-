'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Smartphone,
  Search,
  Zap,
  Upload,
  Link2,
  MapPin,
  FileText,
  ChevronLeft,
  Menu,
  Home,
  FileDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navItems = [
  {
    title: '首页',
    href: '/',
    icon: Home,
  },
  {
    title: '设备查询',
    href: '/devices',
    icon: Search,
  },
  {
    title: '设备激活',
    href: '/activation',
    icon: Zap,
  },
  {
    title: '导入设备',
    href: '/import',
    icon: Upload,
  },
  {
    title: '设备账号绑定',
    href: '/binding',
    icon: Link2,
  },
  {
    title: '设备位置',
    href: '/location',
    icon: MapPin,
  },
  {
    title: '设备日志',
    href: '/logs',
    icon: FileText,
  },
  {
    title: 'PRD文档',
    href: '/prd',
    icon: FileDown,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-primary" />
            <span className="font-semibold text-sidebar-foreground">设备管理系统</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">设备管理后台 v1.0.0</p>
        </div>
      )}
    </aside>
  )
}
