'use client'

import { ReactNode } from 'react'
import { Search, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FilterPanelProps {
  children: ReactNode
  onSearch: () => void
  onReset: () => void
}

export function FilterPanel({ children, onSearch, onReset }: FilterPanelProps) {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-end gap-4">
          {children}
          <div className="flex gap-2">
            <Button onClick={onSearch} className="gap-2">
              <Search className="h-4 w-4" />
              查询
            </Button>
            <Button variant="outline" onClick={onReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface FilterItemProps {
  label: string
  children: ReactNode
}

export function FilterItem({ label, children }: FilterItemProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}
