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
import { mockActivations, categories, brands, models } from '@/lib/mock-data'
import type { DeviceActivation } from '@/lib/types'

export default function ActivationPage() {
  const [filters, setFilters] = useState({
    imei: '',
    deviceId: '',
    sn: '',
    category: '',
    brand: '',
    model: '',
    activationStatus: '',
    startDate: '',
    endDate: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 筛选数据
  const filteredData = useMemo(() => {
    return mockActivations.filter((item) => {
      if (appliedFilters.imei && !item.imei.includes(appliedFilters.imei)) return false
      if (appliedFilters.deviceId && !item.deviceId.includes(appliedFilters.deviceId)) return false
      if (appliedFilters.sn && !item.sn.includes(appliedFilters.sn)) return false
      if (appliedFilters.category && item.category !== appliedFilters.category) return false
      if (appliedFilters.brand && item.brand !== appliedFilters.brand) return false
      if (appliedFilters.model && !item.model.includes(appliedFilters.model)) return false
      if (appliedFilters.activationStatus && item.activationStatus !== appliedFilters.activationStatus) return false
      if (appliedFilters.startDate) {
        const itemDate = new Date(item.activationTime)
        const startDate = new Date(appliedFilters.startDate)
        if (itemDate < startDate) return false
      }
      if (appliedFilters.endDate) {
        const itemDate = new Date(item.activationTime)
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
      category: '',
      brand: '',
      model: '',
      activationStatus: '',
      startDate: '',
      endDate: '',
    }
    setFilters(resetFilters)
    setAppliedFilters(resetFilters)
    setCurrentPage(1)
  }

  const handleExport = () => {
    exportToCSV(filteredData, '设备激活日志', [
      { key: 'logId', label: '激活日志ID' },
      { key: 'imei', label: 'IMEI' },
      { key: 'deviceId', label: 'Device ID' },
      { key: 'sn', label: 'SN' },
      { key: 'category', label: '品类' },
      { key: 'brand', label: '品牌' },
      { key: 'model', label: '型号' },
      { key: 'activationStatus', label: '激活状态' },
      { key: 'activationTime', label: '激活时间' },
    ])
  }

  const columns: Column<DeviceActivation>[] = [
    { key: 'logId', header: '激活日志ID', width: '160px' },
    { key: 'imei', header: 'IMEI', width: '140px' },
    { key: 'deviceId', header: 'Device ID', width: '160px' },
    { key: 'sn', header: 'SN', width: '140px' },
    { key: 'category', header: '品类', width: '100px' },
    { key: 'brand', header: '品牌', width: '80px' },
    { key: 'model', header: '型号', width: '100px' },
    {
      key: 'activationStatus',
      header: '激活状态',
      width: '90px',
      render: (item) => <StatusBadge status={item.activationStatus} />,
    },
    { key: 'activationTime', header: '激活时间', width: '160px' },
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
        title="设备激活"
        description="管理设备激活状态和激活日志"
        actions={<ExportButton onClick={handleExport} label="下载日志" />}
      />

      <FilterPanel onSearch={handleSearch} onReset={handleReset}>
        <FilterItem label="IMEI">
          <Input
            placeholder="请输入IMEI"
            value={filters.imei}
            onChange={(e) => setFilters({ ...filters, imei: e.target.value })}
            className="w-36"
          />
        </FilterItem>
        <FilterItem label="Device ID">
          <Input
            placeholder="请输入Device ID"
            value={filters.deviceId}
            onChange={(e) => setFilters({ ...filters, deviceId: e.target.value })}
            className="w-36"
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
        <FilterItem label="品类">
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterItem>
        <FilterItem label="品牌">
          <Select
            value={filters.brand}
            onValueChange={(value) => setFilters({ ...filters, brand: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterItem>
        <FilterItem label="型号">
          <Select
            value={filters.model}
            onValueChange={(value) => setFilters({ ...filters, model: value === 'all' ? '' : value })}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {models.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterItem>
        <FilterItem label="激活状态">
          <Select
            value={filters.activationStatus}
            onValueChange={(value) => setFilters({ ...filters, activationStatus: value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="已激活">已激活</SelectItem>
              <SelectItem value="未激活">未激活</SelectItem>
            </SelectContent>
          </Select>
        </FilterItem>
        <FilterItem label="开始时间">
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-36"
          />
        </FilterItem>
        <FilterItem label="结束时间">
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-36"
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
