'use client'

import { cn } from '@/lib/utils'

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default'

interface StatusBadgeProps {
  status: string
  type?: StatusType
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
}

// 自动根据状态文本判断类型
function getStatusType(status: string): StatusType {
  const successStatuses = ['在线', '已激活', '成功', '已绑定']
  const warningStatuses = ['离线', '进行中']
  const errorStatuses = ['失败', 'ERROR']
  const infoStatuses = ['INFO', 'WARN']
  
  if (successStatuses.includes(status)) return 'success'
  if (warningStatuses.includes(status)) return 'warning'
  if (errorStatuses.includes(status)) return 'error'
  if (infoStatuses.includes(status)) return 'info'
  return 'default'
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const statusType = type || getStatusType(status)
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[statusType]
      )}
    >
      {status}
    </span>
  )
}
