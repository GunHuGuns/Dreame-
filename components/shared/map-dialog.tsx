'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MapPin, Navigation } from 'lucide-react'
import type { DeviceLocation } from '@/lib/types'

interface MapDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: DeviceLocation | null
}

declare global {
  interface Window {
    AMap: typeof AMap
    _AMapSecurityConfig: {
      securityJsCode?: string
    }
  }
}

export function MapDialog({ open, onOpenChange, location }: MapDialogProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<AMap.Map | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !location) return

    const initMap = async () => {
      setLoading(true)
      setError(null)

      try {
        // 动态导入高德地图
        const AMapLoader = await import('@amap/amap-jsapi-loader')
        
        // 设置安全配置（如果需要）
        if (typeof window !== 'undefined') {
          window._AMapSecurityConfig = {
            securityJsCode: '',
          }
        }

        const AMap = await AMapLoader.default.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || 'demo', // 需要用户配置高德地图 Key
          version: '2.0',
          plugins: ['AMap.Marker', 'AMap.InfoWindow'],
        })

        if (mapRef.current && location) {
          // 创建地图实例
          const map = new AMap.Map(mapRef.current, {
            zoom: 14,
            center: [location.longitude, location.latitude],
            viewMode: '2D',
          })

          // 添加标记点
          const marker = new AMap.Marker({
            position: [location.longitude, location.latitude],
            title: `设备: ${location.deviceId}`,
          })

          map.add(marker)

          // 添加信息窗口
          const infoWindow = new AMap.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <p style="margin: 0 0 4px; font-weight: bold;">设备信息</p>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  Device ID: ${location.deviceId}<br/>
                  位置: ${location.address}
                </p>
              </div>
            `,
            offset: new AMap.Pixel(0, -30),
          })

          marker.on('click', () => {
            infoWindow.open(map, marker.getPosition())
          })

          mapInstance.current = map
        }
      } catch (err) {
        console.error('地图加载失败:', err)
        setError('地图加载失败，请检查高德地图 API Key 配置')
      } finally {
        setLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy()
        mapInstance.current = null
      }
    }
  }, [open, location])

  if (!location) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            设备位置详情
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 设备信息 */}
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4 text-sm">
            <div>
              <span className="text-muted-foreground">Device ID:</span>
              <span className="ml-2 font-medium">{location.deviceId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">IMEI:</span>
              <span className="ml-2 font-medium">{location.imei}</span>
            </div>
            <div>
              <span className="text-muted-foreground">SN:</span>
              <span className="ml-2 font-medium">{location.sn}</span>
            </div>
            <div>
              <span className="text-muted-foreground">请求时间:</span>
              <span className="ml-2 font-medium">{location.requestTime}</span>
            </div>
          </div>

          {/* 坐标信息 */}
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <Navigation className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">经纬度坐标</p>
              <p className="text-sm text-muted-foreground">
                经度: {location.longitude.toFixed(6)} | 纬度: {location.latitude.toFixed(6)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                地址: {location.address}
              </p>
            </div>
          </div>

          {/* 地图容器 */}
          <div className="relative h-[350px] w-full overflow-hidden rounded-lg border">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-muted-foreground">地图加载中...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 p-4">
                <p className="text-sm text-destructive">{error}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  请在环境变量中配置 NEXT_PUBLIC_AMAP_KEY
                </p>
              </div>
            )}
            <div ref={mapRef} className="h-full w-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
