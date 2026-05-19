import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Smartphone, Zap, Upload, Link2, MapPin, FileText } from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    title: '设备查询',
    description: '按IMEI/Device ID/SN查询设备信息',
    href: '/devices',
    icon: Smartphone,
    count: '2,847',
    label: '总设备数',
  },
  {
    title: '设备激活',
    description: '管理设备激活状态和日志',
    href: '/activation',
    icon: Zap,
    count: '2,156',
    label: '已激活',
  },
  {
    title: '导入设备',
    description: '批量导入设备记录管理',
    href: '/import',
    icon: Upload,
    count: '128',
    label: '导入批次',
  },
  {
    title: '设备账号绑定',
    description: '设备与账号绑定关系管理',
    href: '/binding',
    icon: Link2,
    count: '1,892',
    label: '已绑定',
  },
  {
    title: '设备位置',
    description: '设备位置信息及地图展示',
    href: '/location',
    icon: MapPin,
    count: '956',
    label: '有位置记录',
  },
  {
    title: '设备日志',
    description: '设备日志查询和下载',
    href: '/logs',
    icon: FileText,
    count: '12,458',
    label: '日志条数',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">设备管理系统</h1>
        <p className="mt-2 text-muted-foreground">
          欢迎使用设备管理后台，请从左侧菜单选择功能模块
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.count}</div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>快速入门</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. 使用「设备查询」模块查看所有设备信息</p>
          <p>2. 使用「设备激活」模块管理设备激活状态</p>
          <p>3. 使用「导入设备」模块批量导入新设备</p>
          <p>4. 使用「设备账号绑定」模块管理设备与用户账号的绑定关系</p>
          <p>5. 使用「设备位置」模块查看设备地理位置</p>
          <p>6. 使用「设备日志」模块查看和下载设备运行日志</p>
        </CardContent>
      </Card>
    </div>
  )
}
