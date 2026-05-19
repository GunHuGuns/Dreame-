'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExportButtonProps {
  onClick: () => void
  label?: string
  disabled?: boolean
}

export function ExportButton({ onClick, label = '导出', disabled = false }: ExportButtonProps) {
  return (
    <Button variant="outline" onClick={onClick} disabled={disabled} className="gap-2">
      <Download className="h-4 w-4" />
      {label}
    </Button>
  )
}

// 通用导出为CSV的工具函数
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers: { key: keyof T; label: string }[]
) {
  if (data.length === 0) return

  const headerRow = headers.map(h => h.label).join(',')
  const dataRows = data.map(row => 
    headers.map(h => {
      const value = row[h.key]
      // 处理包含逗号或引号的值
      const stringValue = String(value ?? '')
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  ).join('\n')

  const csvContent = `\uFEFF${headerRow}\n${dataRows}` // BOM for Excel
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
