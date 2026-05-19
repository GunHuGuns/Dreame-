'use client'

import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { FilterPanel, FilterItem } from '@/components/shared/filter-panel'
import { DataTable, type Column } from '@/components/shared/data-table'
import { StatusBadge } from '@/components/shared/status-badge'
import { Input } from '@/components/ui/input'
import { mockDevices } from '@/lib/mock-data'
import type { Device } from '@/lib/types'

export default function DevicesPage() {
  const [filters, setFilters] = useState({
    imei: '',
    deviceId: '',
    sn: '',
  })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 筛选数据
  const filteredData = useMemo(() => {
    return mockDevices.filter((item) => {
      if (appliedFilters.imei && !item.imei.includes(appliedFilters.imei)) return false
      if (appliedFilters.deviceId && !item.deviceId.includes(appliedFilters.deviceId)) return false
      if (appliedFilters.sn && !item.sn.includes(appliedFilters.sn)) return false
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
    const resetFilters = { imei: '', deviceId: '', sn: '' }
    setFilters(resetFilters)
    setAppliedFilters(resetFilters)
    setCurrentPage(1)
  }

  const columns: Column<Device>[] = [
    { key: 'imei', header: 'IMEI', width: '140px' },
    { key: 'deviceId', header: 'Device ID', width: '160px' },
    { key: 'sn', header: 'SN', width: '140px' },
    { key: 'category', header: '品类', width: '100px' },
    { key: 'brand', header: '品牌', width: '80px' },
    { key: 'model', header: '型号', width: '100px' },
    { key: 'systemVersion', header: '系统版本', width: '100px' },
    { key: 'firmwareVersion', header: '固件版本', width: '100px' },
    { key: 'carrier', header: '运营商', width: '90px' },
    {
      key: 'status',
      header: '设备状态',
      width: '90px',
      render: (item) => <StatusBadge status={item.status} />,
    },
    { key: 'batchNumber', header: '生产批次', width: '140px' },
    { key: 'productionTime', header: '生产时间', width: '160px' },
    { key: 'region', header: '国家/地区', width: '100px' },
    { key: 'operationTime', header: '操作时间', width: '160px' },
  ]

  return (
    <div>
      <PageHeader
        title="设备查询"
        description="按IMEI、Device ID、SN等条件查询设备信息"
      />

      <FilterPanel onSearch={handleSearch} onReset={handleReset}>
        <FilterItem label="IMEI">
          <Input
            placeholder="请输入IMEI"
            value={filters.imei}
            onChange={(e) => setFilters({ ...filters, imei: e.target.value })}
            className="w-40"
          />
        </FilterItem>
        <FilterItem label="Device ID">
          <Input
            placeholder="请输入Device ID"
            value={filters.deviceId}
            onChange={(e) => setFilters({ ...filters, deviceId: e.target.value })}
            className="w-40"
          />
        </FilterItem>
        <FilterItem label="SN">
          <Input
            placeholder="请输入SN"
            value={filters.sn}
            onChange={(e) => setFilters({ ...filters, sn: e.target.value })}
            className="w-40"
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
