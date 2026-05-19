// 设备状态枚举
export type DeviceStatus = '在线' | '离线' | '未激活'

// 激活状态枚举
export type ActivationStatus = '已激活' | '未激活'

// 导入状态枚举
export type ImportStatus = '成功' | '失败' | '进行中'

// 绑定状态枚举
export type BindingStatus = '已绑定' | '未绑定'

// 日志类型枚举
export type LogType = '系统' | '操作' | '告警'

// 日志级别枚举
export type LogLevel = 'INFO' | 'WARN' | 'ERROR'

// 设备基本信息
export interface Device {
  id: string
  imei: string
  deviceId: string
  sn: string
  category: string
  brand: string
  model: string
  systemVersion: string
  firmwareVersion: string
  carrier: string
  status: DeviceStatus
  batchNumber: string
  productionTime: string
  region: string
  operationTime: string
}

// 设备激活记录
export interface DeviceActivation {
  id: string
  logId: string
  imei: string
  deviceId: string
  sn: string
  category: string
  brand: string
  model: string
  activationStatus: ActivationStatus
  activationTime: string
}

// 设备导入记录
export interface DeviceImport {
  id: string
  batchNumber: string
  importTime: string
  importStatus: ImportStatus
  totalCount: number
  successCount: number
  failCount: number
  operator: string
}

// 设备账号绑定记录
export interface DeviceBinding {
  id: string
  imei: string
  deviceId: string
  sn: string
  accountId: string
  category: string
  brand: string
  model: string
  bindingTime: string
  bindingStatus: BindingStatus
}

// 设备位置记录
export interface DeviceLocation {
  id: string
  imei: string
  deviceId: string
  sn: string
  accountId: string
  category: string
  brand: string
  model: string
  requestTime: string
  longitude: number
  latitude: number
  address: string
}

// 设备日志记录
export interface DeviceLog {
  id: string
  logId: string
  imei: string
  deviceId: string
  sn: string
  logType: LogType
  logLevel: LogLevel
  timestamp: string
  detail: string
}

// 筛选条件通用类型
export interface FilterOption {
  label: string
  value: string
}

// 分页信息
export interface PaginationInfo {
  current: number
  pageSize: number
  total: number
}
