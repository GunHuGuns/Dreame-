import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  PageBreak,
} from 'docx'

// PRD内容定义
export const prdContent = {
  title: '设备管理系统产品需求文档（PRD）',
  version: 'v1.0.0',
  date: new Date().toLocaleDateString('zh-CN'),
  overview: {
    title: '1. 产品概述',
    content: '设备管理系统是一个面向企业的Web端后台管理平台，用于对智能设备进行全生命周期管理。系统涵盖设备查询、激活管理、批量导入、账号绑定、位置追踪和日志管理六大核心功能模块，帮助企业高效管理其智能设备资产。',
    targetUsers: [
      '设备运营人员：负责设备的日常管理和状态监控',
      '技术支持人员：处理设备问题和查看设备日志',
      '管理人员：查看设备统计数据和整体运营情况',
    ],
  },
  modules: [
    {
      name: '2. 设备查询模块',
      description: '设备查询模块是系统的核心功能，提供对所有设备信息的综合查询和展示功能。',
      screenshot: 'devices.png',
      features: [
        '支持按IMEI、Device ID、SN三种唯一标识进行精确查询',
        '查询结果以表格形式展示，支持分页浏览',
        '提供查询和重置按钮，方便用户操作',
      ],
      fields: [
        { name: 'IMEI', description: '国际移动设备识别码，设备的唯一标识' },
        { name: 'Device ID', description: '设备ID，系统内部的设备唯一编号' },
        { name: 'SN', description: '设备序列号' },
        { name: '品类', description: '设备类型，如智能眼镜、智能手表、智能手环等' },
        { name: '品牌', description: '设备品牌，如华为、小米、vivo、OPPO等' },
        { name: '型号', description: '设备具体型号' },
        { name: '系统版本号', description: '设备当前的系统软件版本' },
        { name: '固件版本号', description: '设备当前的固件版本' },
        { name: '运营商', description: '设备绑定的运营商，如中国移动、中国联通、中国电信' },
        { name: '设备状态', description: '设备当前状态：在线、离线、未激活' },
        { name: '生产批次', description: '设备的生产批次编号' },
        { name: '生产时间', description: '设备的生产日期' },
        { name: '国家/地区', description: '设备销售或使用的国家或地区' },
        { name: '操作时间', description: '最近一次操作的时间记录' },
      ],
      rules: [
        '查询条件可单独使用，也可组合使用',
        '查询结果按操作时间倒序排列',
        '每页默认显示10条记录，可选择20、50、100条',
        '设备状态使用不同颜色标签区分：在线-绿色、离线-红色、未激活-灰色',
      ],
    },
    {
      name: '3. 设备激活模块',
      description: '设备激活模块用于管理设备的激活状态和查看激活日志，支持批量下载激活日志。',
      screenshot: 'activation.png',
      features: [
        '支持按IMEI、Device ID、SN查询',
        '支持按激活状态筛选（全部/已激活/未激活）',
        '支持按时间范围筛选（开始时间-结束时间）',
        '提供下载日志功能，导出激活日志数据',
      ],
      fields: [
        { name: '激活日志ID', description: '激活记录的唯一标识' },
        { name: 'IMEI', description: '设备IMEI码' },
        { name: 'Device ID', description: '设备ID' },
        { name: 'SN', description: '设备序列号' },
        { name: '品类', description: '设备类型' },
        { name: '品牌', description: '设备品牌' },
        { name: '型号', description: '设备型号' },
        { name: '激活状态', description: '已激活/未激活' },
        { name: '激活时间', description: '设备激活的具体时间' },
      ],
      rules: [
        '激活状态筛选默认为"全部"',
        '时间筛选支持选择开始时间和结束时间',
        '下载日志功能导出CSV格式文件',
        '激活状态使用颜色标签：已激活-绿色、未激活-灰色',
      ],
    },
    {
      name: '4. 导入设备模块',
      description: '导入设备模块用于批量导入新设备数据，并管理导入记录。',
      screenshot: 'import.png',
      features: [
        '支持CSV/Excel文件批量导入设备',
        '记录每次导入的详细信息',
        '支持下载导入的设备列表',
        '按批次号、时间范围、状态、操作员筛选',
      ],
      fields: [
        { name: '导入批次', description: '每次导入生成的唯一批次号' },
        { name: '导入时间', description: '导入操作的时间' },
        { name: '导入状态', description: '成功/失败/进行中' },
        { name: '导入数量', description: '本次导入的设备总数' },
        { name: '成功数量', description: '成功导入的设备数量' },
        { name: '失败数量', description: '导入失败的设备数量' },
        { name: '操作员', description: '执行导入操作的用户' },
      ],
      rules: [
        '支持的文件格式：CSV、XLSX、XLS',
        '导入文件需包含必填字段：IMEI、Device ID、SN',
        '重复的IMEI/Device ID/SN将被标记为导入失败',
        '导入状态说明：成功-全部导入成功、失败-部分或全部失败、进行中-正在处理',
        '可下载每个批次的设备列表，查看具体导入结果',
      ],
    },
    {
      name: '5. 设备账号绑定模块',
      description: '设备账号绑定模块管理设备与用户账号的绑定关系。',
      screenshot: 'binding.png',
      features: [
        '查询设备与账号的绑定记录',
        '支持按设备标识或账号ID查询',
        '支持按时间范围筛选',
        '显示绑定状态',
      ],
      fields: [
        { name: 'IMEI', description: '设备IMEI码' },
        { name: 'Device ID', description: '设备ID' },
        { name: 'SN', description: '设备序列号' },
        { name: '账号ID', description: '绑定的用户账号ID' },
        { name: '品类', description: '设备类型' },
        { name: '品牌', description: '设备品牌' },
        { name: '型号', description: '设备型号' },
        { name: '绑定时间', description: '账号与设备绑定的时间' },
        { name: '绑定状态', description: '已绑定/未绑定' },
      ],
      rules: [
        '一个设备同一时间只能绑定一个账号',
        '账号解绑后，绑定状态变为"未绑定"',
        '绑定状态颜色：已绑定-绿色、未绑定-灰色',
        '支持按账号ID精确查询该账号下所有绑定设备',
      ],
    },
    {
      name: '6. 设备位置模块',
      description: '设备位置模块用于查看设备的地理位置信息，支持地图可视化展示。',
      screenshot: 'location.png',
      features: [
        '查询设备位置记录',
        '支持按时间范围筛选',
        '点击"显示"按钮在地图上查看设备位置',
        '显示设备经纬度坐标',
      ],
      fields: [
        { name: 'IMEI', description: '设备IMEI码' },
        { name: 'Device ID', description: '设备ID' },
        { name: 'SN', description: '设备序列号' },
        { name: '账号ID', description: '设备绑定的账号' },
        { name: '品类', description: '设备类型' },
        { name: '品牌', description: '设备品牌' },
        { name: '型号', description: '设备型号' },
        { name: '请求时间', description: '位置信息上报的时间' },
      ],
      rules: [
        '位置信息来源于设备GPS上报',
        '点击"显示"按钮弹出地图弹窗',
        '地图弹窗显示设备在地图上的标记点',
        '同时显示经度和纬度数值',
        '使用高德地图API进行地图渲染',
      ],
    },
    {
      name: '7. 设备日志模块',
      description: '设备日志模块用于查询和下载设备运行日志，帮助技术人员排查问题。',
      screenshot: 'logs.png',
      features: [
        '支持按设备标识查询日志',
        '支持按日志类型和级别筛选',
        '支持按时间范围筛选',
        '支持批量下载和单条下载日志',
      ],
      fields: [
        { name: '日志ID', description: '日志记录的唯一标识' },
        { name: 'IMEI', description: '设备IMEI码' },
        { name: 'Device ID', description: '设备ID' },
        { name: 'SN', description: '设备序列号' },
        { name: '日志类型', description: '系统/操作/告警' },
        { name: '日志级别', description: 'INFO/WARN/ERROR' },
        { name: '时间戳', description: '日志产生的时间' },
        { name: '日志详情', description: '日志的详细内容' },
      ],
      rules: [
        '日志类型：系统-系统级日志、操作-用户操作日志、告警-告警和异常日志',
        '日志级别颜色：INFO-蓝色、WARN-黄色、ERROR-红色',
        '右上角"下载日志"按钮下载当前筛选条件下的所有日志',
        '每条日志右侧的"下载日志"按钮下载单条日志详情',
        '下载格式为TXT或CSV文件',
      ],
    },
  ],
}

// 生成Word文档
export async function generatePRDDocument(screenshots: Record<string, ArrayBuffer>): Promise<Blob> {
  const children: (Paragraph | Table)[] = []

  // 标题
  children.push(
    new Paragraph({
      children: [new TextRun({ text: prdContent.title, bold: true, size: 48 })],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  )

  // 版本和日期
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `版本：${prdContent.version}    日期：${prdContent.date}`, size: 24 }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    })
  )

  // 产品概述
  children.push(
    new Paragraph({
      children: [new TextRun({ text: prdContent.overview.title, bold: true, size: 32 })],
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    })
  )

  children.push(
    new Paragraph({
      children: [new TextRun({ text: prdContent.overview.content, size: 24 })],
      spacing: { after: 200 },
    })
  )

  children.push(
    new Paragraph({
      children: [new TextRun({ text: '目标用户：', bold: true, size: 24 })],
      spacing: { before: 200 },
    })
  )

  prdContent.overview.targetUsers.forEach((user) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `• ${user}`, size: 24 })],
        spacing: { before: 100 },
      })
    )
  })

  // 首页截图
  if (screenshots['home.png']) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '系统首页：', bold: true, size: 24 })],
        spacing: { before: 300 },
      })
    )
    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: screenshots['home.png'],
            transformation: { width: 600, height: 375 },
            type: 'png',
          }),
        ],
        spacing: { before: 200, after: 400 },
      })
    )
  }

  // 各模块详细说明
  for (const module of prdContent.modules) {
    // 分页
    children.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    )

    // 模块标题
    children.push(
      new Paragraph({
        children: [new TextRun({ text: module.name, bold: true, size: 32 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    )

    // 模块描述
    children.push(
      new Paragraph({
        children: [new TextRun({ text: module.description, size: 24 })],
        spacing: { after: 300 },
      })
    )

    // 模块截图
    if (screenshots[module.screenshot]) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '界面截图：', bold: true, size: 24 })],
          spacing: { before: 200 },
        })
      )
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: screenshots[module.screenshot],
              transformation: { width: 600, height: 375 },
              type: 'png',
            }),
          ],
          spacing: { before: 200, after: 300 },
        })
      )
    }

    // 功能特性
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '功能特性：', bold: true, size: 24 })],
        spacing: { before: 200 },
      })
    )

    module.features.forEach((feature) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${feature}`, size: 24 })],
          spacing: { before: 80 },
        })
      )
    })

    // 字段说明表格
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '字段说明：', bold: true, size: 24 })],
        spacing: { before: 300, after: 100 },
      })
    )

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: '字段名', bold: true, size: 22 })] })],
            width: { size: 2500, type: WidthType.DXA },
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: '说明', bold: true, size: 22 })] })],
            width: { size: 6500, type: WidthType.DXA },
          }),
        ],
      }),
      ...module.fields.map(
        (field) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: field.name, size: 22 })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: field.description, size: 22 })] })],
              }),
            ],
          })
      ),
    ]

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 9000, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
          insideVertical: { style: BorderStyle.SINGLE, size: 1 },
        },
      })
    )

    // 业务规则
    children.push(
      new Paragraph({
        children: [new TextRun({ text: '业务规则：', bold: true, size: 24 })],
        spacing: { before: 300 },
      })
    )

    module.rules.forEach((rule, index) => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${index + 1}. ${rule}`, size: 24 })],
          spacing: { before: 80 },
        })
      )
    })
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })

  return await Packer.toBlob(doc)
}
