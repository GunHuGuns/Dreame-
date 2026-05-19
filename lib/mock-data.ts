import type {
  Device,
  DeviceActivation,
  DeviceImport,
  DeviceBinding,
  DeviceLocation,
  DeviceLog,
} from './types'

// 品类列表
export const categories = ['智能手表', '智能手环', '智能眼镜', '智能耳机', '智能音箱']

// 品牌列表
export const brands = ['华为', '小米', 'OPPO', 'vivo', '荣耀', '一加']

// 运营商列表
export const carriers = ['中国移动', '中国联通', '中国电信']

// 地区列表
export const regions = ['中国大陆', '中国香港', '中国台湾', '东南亚', '欧洲', '北美']

// 生成随机ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// 生成随机IMEI
const generateIMEI = () => {
  const prefix = '86'
  const body = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('')
  return prefix + body
}

// 生成随机Device ID
const generateDeviceId = () => `DEV${Date.now()}${Math.floor(Math.random() * 1000)}`

// 生成随机SN
const generateSN = () => `SN${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)}`

// 生成随机日期
const generateDate = (daysAgo: number = 365) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date.toISOString().slice(0, 19).replace('T', ' ')
}

// 生成设备列表
export const generateDevices = (count: number = 50): Device[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    imei: generateIMEI(),
    deviceId: generateDeviceId(),
    sn: generateSN(),
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    model: `Model-${Math.floor(Math.random() * 100)}`,
    systemVersion: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    firmwareVersion: `FW${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 10)}`,
    carrier: carriers[Math.floor(Math.random() * carriers.length)],
    status: (['在线', '离线', '未激活'] as const)[Math.floor(Math.random() * 3)],
    batchNumber: `BATCH-${Date.now().toString(36).toUpperCase().slice(0, 6)}`,
    productionTime: generateDate(180),
    region: regions[Math.floor(Math.random() * regions.length)],
    operationTime: generateDate(30),
  }))
}

// 生成激活记录列表
export const generateActivations = (count: number = 50): DeviceActivation[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    logId: `LOG-${generateId().toUpperCase()}`,
    imei: generateIMEI(),
    deviceId: generateDeviceId(),
    sn: generateSN(),
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    model: `Model-${Math.floor(Math.random() * 100)}`,
    activationStatus: (['已激活', '未激活'] as const)[Math.floor(Math.random() * 2)],
    activationTime: generateDate(90),
  }))
}

// 生成导入记录列表
export const generateImports = (count: number = 30): DeviceImport[] => {
  return Array.from({ length: count }, () => {
    const total = Math.floor(Math.random() * 500) + 50
    const success = Math.floor(Math.random() * total)
    const status = (['成功', '失败', '进行中'] as const)[Math.floor(Math.random() * 3)]
    return {
      id: generateId(),
      batchNumber: `IMP-${Date.now().toString(36).toUpperCase().slice(0, 8)}`,
      importTime: generateDate(60),
      importStatus: status,
      totalCount: total,
      successCount: status === '进行中' ? Math.floor(success * 0.6) : success,
      failCount: status === '进行中' ? 0 : total - success,
      operator: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
    }
  })
}

// 生成绑定记录列表
export const generateBindings = (count: number = 50): DeviceBinding[] => {
  return Array.from({ length: count }, () => ({
    id: generateId(),
    imei: generateIMEI(),
    deviceId: generateDeviceId(),
    sn: generateSN(),
    accountId: `ACC${Math.floor(Math.random() * 100000)}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    brand: brands[Math.floor(Math.random() * brands.length)],
    model: `Model-${Math.floor(Math.random() * 100)}`,
    bindingTime: generateDate(120),
    bindingStatus: (['已绑定', '未绑定'] as const)[Math.floor(Math.random() * 2)],
  }))
}

// 中国主要城市坐标
const cityLocations = [
  { name: '北京', lng: 116.407526, lat: 39.90403 },
  { name: '上海', lng: 121.473701, lat: 31.230416 },
  { name: '广州', lng: 113.264385, lat: 23.129112 },
  { name: '深圳', lng: 114.057868, lat: 22.543099 },
  { name: '杭州', lng: 120.15507, lat: 30.274084 },
  { name: '成都', lng: 104.066541, lat: 30.572269 },
  { name: '武汉', lng: 114.305393, lat: 30.593098 },
  { name: '西安', lng: 108.946609, lat: 34.347269 },
  { name: '南京', lng: 118.796877, lat: 32.060255 },
  { name: '重庆', lng: 106.551556, lat: 29.563009 },
]

// 生成位置记录列表
export const generateLocations = (count: number = 50): DeviceLocation[] => {
  return Array.from({ length: count }, () => {
    const city = cityLocations[Math.floor(Math.random() * cityLocations.length)]
    // 在城市坐标基础上添加随机偏移
    const lngOffset = (Math.random() - 0.5) * 0.1
    const latOffset = (Math.random() - 0.5) * 0.1
    return {
      id: generateId(),
      imei: generateIMEI(),
      deviceId: generateDeviceId(),
      sn: generateSN(),
      accountId: `ACC${Math.floor(Math.random() * 100000)}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      model: `Model-${Math.floor(Math.random() * 100)}`,
      requestTime: generateDate(7),
      longitude: city.lng + lngOffset,
      latitude: city.lat + latOffset,
      address: `${city.name}市某区某街道${Math.floor(Math.random() * 100)}号`,
    }
  })
}

// 日志详情模板
const logDetails = {
  系统: [
    '系统启动成功',
    '系统重启完成',
    '固件更新完成',
    '系统资源占用正常',
    '网络连接恢复',
    '存储空间清理完成',
  ],
  操作: [
    '用户登录成功',
    '设备配置修改',
    '数据同步完成',
    '设置项变更',
    '蓝牙配对成功',
    '固件下载开始',
  ],
  告警: [
    '电量低于20%',
    '存储空间不足',
    '网络连接异常',
    '温度过高告警',
    '内存占用超过阈值',
    '多次登录失败',
  ],
}

// 生成日志记录列表
export const generateLogs = (count: number = 100): DeviceLog[] => {
  return Array.from({ length: count }, () => {
    const logType = (['系统', '操作', '告警'] as const)[Math.floor(Math.random() * 3)]
    const details = logDetails[logType]
    const logLevel = logType === '告警' 
      ? (['WARN', 'ERROR'] as const)[Math.floor(Math.random() * 2)]
      : (['INFO', 'WARN'] as const)[Math.floor(Math.random() * 2)]
    
    return {
      id: generateId(),
      logId: `LOG-${generateId().toUpperCase().slice(0, 10)}`,
      imei: generateIMEI(),
      deviceId: generateDeviceId(),
      sn: generateSN(),
      logType,
      logLevel,
      timestamp: generateDate(30),
      detail: details[Math.floor(Math.random() * details.length)],
    }
  })
}

// 预生成数据
export const mockDevices = generateDevices(50)
export const mockActivations = generateActivations(50)
export const mockImports = generateImports(30)
export const mockBindings = generateBindings(50)
export const mockLocations = generateLocations(50)
export const mockLogs = generateLogs(100)
