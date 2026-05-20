'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Loader2, CheckCircle } from 'lucide-react'
import { generatePRDDocument } from '@/lib/generate-prd'

const screenshotFiles = [
  'home.png',
  'devices.png',
  'activation.png',
  'import.png',
  'binding.png',
  'location.png',
  'logs.png',
]

export default function PRDPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleGeneratePRD = async () => {
    setIsGenerating(true)
    setIsGenerated(false)

    try {
      // 加载所有截图
      const screenshots: Record<string, ArrayBuffer> = {}
      
      for (const filename of screenshotFiles) {
        try {
          const response = await fetch(`/screenshots/${filename}`)
          if (response.ok) {
            screenshots[filename] = await response.arrayBuffer()
          }
        } catch (error) {
          console.log(`[v0] Failed to load screenshot: ${filename}`, error)
        }
      }

      // 生成Word文档
      const blob = await generatePRDDocument(screenshots)
      
      // 下载文件
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `设备管理系统PRD_${new Date().toISOString().slice(0, 10)}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setIsGenerated(true)
    } catch (error) {
      console.error('[v0] Failed to generate PRD:', error)
      alert('生成PRD文档失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="PRD文档生成"
        description="生成设备管理系统的产品需求文档"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            产品需求文档（PRD）
          </CardTitle>
          <CardDescription>
            点击下方按钮生成包含所有模块说明和截图的Word格式PRD文档
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 font-medium">文档内容包括：</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>1. 产品概述和目标用户</li>
              <li>2. 设备查询模块 - 功能说明、字段定义、业务规则</li>
              <li>3. 设备激活模块 - 功能说明、字段定义、业务规则</li>
              <li>4. 导入设备模块 - 功能说明、字段定义、业务规则</li>
              <li>5. 设备账号绑定模块 - 功能说明、字段定义、业务规则</li>
              <li>6. 设备位置模块 - 功能说明、字段定义、业务规则</li>
              <li>7. 设备日志模块 - 功能说明、字段定义、业务规则</li>
              <li>• 每个模块附带界面截图</li>
            </ul>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleGeneratePRD}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                正在生成文档...
              </>
            ) : isGenerated ? (
              <>
                <CheckCircle className="h-4 w-4" />
                文档已生成，再次下载
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                生成并下载PRD文档
              </>
            )}
          </Button>

          {isGenerated && (
            <p className="text-center text-sm text-muted-foreground">
              文档已下载到您的电脑，请查看下载文件夹
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
