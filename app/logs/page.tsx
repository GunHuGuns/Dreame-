'use client'

import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { FilterPanel, FilterItem } from '@/components/shared/filter-panel'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { ExportButton, exportToCSV } from '@/components/shared/export-button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { mockLogs } from '@/lib/mock-data'
import type { DeviceLog } from '@/lib/types'

export default function LogsPage() {
  const [filters, setFilters] = useState({
    imei: '',
    deviceId: '',
    sn: '',
    logType: '',
    logLevel: '',
    startDate: '',
    endDate: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 筛选数据
  const filteredData = useMemo(() => {
    return mockLogs.filter((item) => {
      if (appliedFilters.imei && !item.imei.includes(appliedFilters.imei)) return false
      if (appliedFilters.deviceId && !item.deviceId.includes(appliedFilters.deviceId)) return false
      if (appliedFilters.sn && !item.sn.includes(appliedFilters.sn)) return false
      if (appliedFilters.logType && item.logType !== appliedFilters.logType) return false
      if (appliedFilters.logLevel && item.logLevel !== appliedFilters.logLevel) return false
      if (appliedFilters.startDate) {
        const itemDate = new Date(item.timestamp)
        const startDate = new Date(appliedFilters.startDate)
        if (itemDate < startDate) return false
      }
      if (appliedFilters.endDate) {
        const itemDate = new Date(item.timestamp)
        const endDate = new Date(appliedFilters.endDate)
        endDate.setHours(23, 59, 59, 999)
        if (itemDate > endDate) return false
      }
      return true
    })
  }, [appliedFilters])

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const handleSearch = () => {
    setAppliedFilters(filters)
    setCurrentPage(1)
  }

  const handleReset = () => {
    const resetFilters = {
      imei: '',
      deviceId: '',
      sn: '',
      logType: '',
      logLevel: '',
      startDate: '',
      endDate: '',
    }
    setFilters(resetFilters)
    setAppliedFilters(resetFilters)
    setCurrentPage(1)
  }

  const handleExport = () => {
    exportToCSV(filteredData, '设备日志', [
      { key: 'logId', label: '日志ID' },
      { key: 'imei', label: 'IMEI' },
      { key: 'deviceId', label: 'Device ID' },
      { key: 'sn', label: 'SN' },
      { key: 'logType', label: '日志类型' },
      { key: 'logLevel', label: '日志级别' },
      { key: 'timestamp', label: '时间戳' },
      { key: 'detail', label: '日志详情' },
    ])
  }

  const getLogLevelType = (level: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (level) {
      case 'ERROR':
        return 'error'
      case 'WARN':
        return 'warning'
      default:
        return 'info'
    }
  }

  const columns: Column<DeviceLog>[] = [
    { key: 'logId', header: '日志ID', width: '140px' },
    { key: 'imei', header: 'IMEI', width: '140px' },
    { key: 'deviceId', header: 'Device ID', width: '160px' },
    { key: 'sn', header: 'SN', width: '140px' },
    {
      key: 'logType',
      header: '日志类型',
      width: '90px',
      render: (item) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {item.logType}
        </span>
      ),
    },
    {
      key: 'logLevel',
      header: '日志级别',
      width: '90px',
      render: (item) => <StatusBadge status={item.logLevel} type={getLogLevelType(item.logLevel)} />,
    },
    { key: 'timestamp', header: '时间戳', width: '160px' },
    {
      key: 'detail',
      header: '日志详情',
      render: (item) => (
        <span className="line-clamp-1 max-w-xs" title={item.detail}>
          {item.detail}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      width: '100px',
      render: () => (
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary">
          <Download className="h-3.5 w-3.5" />
          下载日志
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="设备日志"
        description="查询和下载设备运行日志"
        actions={<ExportButton onClick={handleExport} label="下载日志" />}
      />

      <FilterPanel onSearch={handleSearch} onReset={handleReset}>
        <FilterItem label="IMEI">
          <Input
            placeholder="请输入IMEI"
            value={filters.imei}
            onChange={(e) => setFilters({ ...filters, imei: e.target.value })}
            className="w-32"
          />
        </FilterItem>
        <FilterItem label="Device ID">
          <Input
            placeholder="请输入Device ID"
            value={filters.deviceId}
            onChange={(e) => setFilters({ ...filters, deviceId: e.target.value })}
            className="w-32"
          />
        </FilterItem>
        <FilterItem label="SN">
          <Input
            placeholder="请输入SN"
            value={filters.sn}
            onChange={(e) => setFilters({ ...filters, sn: e.target.value })}
            className="w-32"
          />
        </FilterItem>
        <FilterItem label="日志类型">
          <Select
            value={filters.logType}
            onValueChange={(value) => setFilters({ ...filters, logType: value })}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="系统">系统</SelectItem>
              <SelectItem value="操作">操作</SelectItem>
              <SelectItem value="告警">告警</SelectItem>
            </SelectContent>
          </Select>
        </FilterItem>
        <FilterItem label="日志级别">
          <Select
            value={filters.logLevel}
            onValueChange={(value) => setFilters({ ...filters, logLevel: value })}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="INFO">INFO</SelectItem>
              <SelectItem value="WARN">WARN</SelectItem>
              <SelectItem value="ERROR">ERROR</SelectItem>
            </SelectContent>
          </Select>
        </FilterItem>
        <FilterItem label="开始时间">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-32"
          />
        </FilterItem>
        <FilterItem label="结束时间">
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-32"
          />
        </FilterItem>
      </FilterPanel>

      <DataTable
        data={paginatedData}
        columns={columns}
        currentPage={currentPage}
        pageSize={pageSize}
        total={filteredData.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
