'use client'

import { useState, useMemo, useRef } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { FilterPanel, FilterItem } from '@/components/shared/filter-panel'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { exportToCSV } from '@/components/shared/export-button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'
import { mockImports } from '@/lib/mock-data'
import type { DeviceImport } from '@/lib/types'

export default function ImportPage() {
  const [filters, setFilters] = useState({
    batchNumber: '',
    startDate: '',
    endDate: '',
    importStatus: '',
    operator: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 处理导入设备
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 模拟导入操作
      alert(`已选择文件: ${file.name}\n（模拟导入成功，实际项目中需要调用后端API）`)
      e.target.value = '' // 清空以便再次选择
    }
  }

  // 下载设备列表
  const handleDownloadDeviceList = (item: DeviceImport) => {
    // 模拟生成设备列表数据
    const deviceListData = Array.from({ length: item.successCount }, (_, i) => ({
      序号: i + 1,
      IMEI: `86${item.batchNumber.slice(-6)}${String(i).padStart(8, '0')}`,
      DeviceID: `DEV-${item.batchNumber}-${String(i).padStart(4, '0')}`,
      SN: `SN${item.batchNumber.slice(-6)}${String(i).padStart(6, '0')}`,
      导入状态: '成功',
      导入时间: item.importTime,
    }))
    
    exportToCSV(deviceListData, `设备列表_${item.batchNumber}`, [
      { key: '序号', label: '序号' },
      { key: 'IMEI', label: 'IMEI' },
      { key: 'DeviceID', label: 'Device ID' },
      { key: 'SN', label: 'SN' },
      { key: '导入状态', label: '导入状态' },
      { key: '导入时间', label: '导入时间' },
    ])
  }

  // 获取所有操作员列表
  const operators = useMemo(() => {
    const operatorSet = new Set(mockImports.map((item) => item.operator))
    return Array.from(operatorSet)
  }, [])

  // 筛选数据
  const filteredData = useMemo(() => {
    return mockImports.filter((item) => {
      if (appliedFilters.batchNumber && !item.batchNumber.includes(appliedFilters.batchNumber)) return false
      if (appliedFilters.importStatus && item.importStatus !== appliedFilters.importStatus) return false
      if (appliedFilters.operator && item.operator !== appliedFilters.operator) return false
      if (appliedFilters.startDate) {
        const itemDate = new Date(item.importTime)
        const startDate = new Date(appliedFilters.startDate)
        if (itemDate < startDate) return false
      }
      if (appliedFilters.endDate) {
        const itemDate = new Date(item.importTime)
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
      batchNumber: '',
      startDate: '',
      endDate: '',
      importStatus: '',
      operator: '',
    }
    setFilters(resetFilters)
    setAppliedFilters(resetFilters)
    setCurrentPage(1)
  }

  const columns: Column<DeviceImport>[] = [
    { key: 'batchNumber', header: '导入批次', width: '180px' },
    { key: 'importTime', header: '导入时间', width: '160px' },
    {
      key: 'importStatus',
      header: '导入状态',
      width: '100px',
      render: (item) => <StatusBadge status={item.importStatus} />,
    },
    { key: 'totalCount', header: '导入数量', width: '100px' },
    {
      key: 'successCount',
      header: '成功数量',
      width: '100px',
      render: (item) => (
        <span className="text-green-600">{item.successCount}</span>
      ),
    },
    {
      key: 'failCount',
      header: '失败数量',
      width: '100px',
      render: (item) => (
        <span className={item.failCount > 0 ? 'text-red-600' : 'text-muted-foreground'}>
          {item.failCount}
        </span>
      ),
    },
    { key: 'operator', header: '操作员', width: '100px' },
    {
      key: 'actions',
      header: '操作',
      width: '120px',
      render: (item) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-1 text-primary"
          onClick={() => handleDownloadDeviceList(item)}
        >
          <Download className="h-3.5 w-3.5" />
          下载设备列表
        </Button>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="导入设备"
        description="查看和管理批量导入的设备记录"
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={handleImportClick} className="gap-2">
              <Upload className="h-4 w-4" />
              导入设备
            </Button>
          </>
        }
      />

      <FilterPanel onSearch={handleSearch} onReset={handleReset}>
        <FilterItem label="导入批次号">
          <Input
            placeholder="请输入批次号"
            value={filters.batchNumber}
            onChange={(e) => setFilters({ ...filters, batchNumber: e.target.value })}
            className="w-40"
          />
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
        <FilterItem label="导入状态">
          <Select
            value={filters.importStatus}
            onValueChange={(value) => setFilters({ ...filters, importStatus: value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="成功">成功</SelectItem>
              <SelectItem value="失败">失败</SelectItem>
              <SelectItem value="进行中">进行中</SelectItem>
            </SelectContent>
          </Select>
        </FilterItem>
        <FilterItem label="操作员">
          <Select
            value={filters.operator}
            onValueChange={(value) => setFilters({ ...filters, operator: value })}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="全部" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {operators.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
