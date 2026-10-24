<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 顶部导航栏 -->
      <view class="header-bg">
        <view class="status-bar">
          <text class="time">9:41</text>
          <view class="icons">
            <image class="status-icon" src="/static/dingwei.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/WIFI.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/dianchidianliang.png" mode="aspectFit"></image>
          </view>
        </view>

        <view class="nav-bar">
          <image class="nav-icon" src="/static/jiantou-1.png" mode="aspectFit" @click="goBack"></image>
          <text class="nav-title">简历诊断报告</text>
          <image class="nav-icon" src="/static/xiazai.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 分析中 / 失败状态 -->
      <view v-if="loading" class="status-card">
        <view class="loading-dots">
          <text></text><text></text><text></text>
        </view>
        <text class="status-title">AI 正在分析您的简历</text>
        <text class="status-sub">通常需要 10-30 秒，请稍候…</text>
      </view>
      <view v-else-if="errorMsg" class="status-card error-card">
        <text class="status-title">报告获取失败</text>
        <text class="status-sub">{{ errorMsg }}</text>
        <view class="retry-btn" @click="goBack">返回重试</view>
      </view>

      <block v-else>
      <!-- 报告标题卡片 -->
      <view class="report-title-card">
        <view class="title-left">
          <text class="report-name">简历诊断报告</text>
          <view class="report-date">
            <image class="mini-icon" src="/static/shichang.png" mode="aspectFit"></image>
            <text>{{ reportDate }}</text>
          </view>
        </view>
        <view class="score-badge">
          <text class="score-num">{{ score }}</text>
          <text class="score-label">总分</text>
        </view>
      </view>

      <!-- 得分概况卡片（环形图） -->
      <view class="chart-card">
        <view class="card-header">
          <view class="header-left">
            <image class="header-icon" src="/static/shichang.png" mode="aspectFit"></image>
            <text>得分概况</text>
          </view>
          <text class="header-right">满分100</text>
        </view>

        <view class="circle-wrapper">
          <view class="circle-outer" :style="{ background: `conic-gradient(#4f6bff 0% ${score}%, #e5e7eb ${score}% 100%)` }">
            <view class="circle-inner">
              <text class="circle-score">{{ score }}</text>
              <text class="circle-label">总分</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 总体评价卡片 -->
      <view class="evaluation-card">
        <view class="card-header">
          <view class="header-left">
            <image class="header-icon" src="/static/jianlifenxi.png" mode="aspectFit"></image>
            <text>总体评价</text>
          </view>
        </view>
        <view class="evaluation-list">
          <view class="eval-item" v-for="(item, index) in evaluations" :key="index">
            <view class="eval-dot"></view>
            <text>{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 维度卡片循环 -->
      <view class="dimension-card" v-for="(dim, dIndex) in dimensions" :key="dIndex">
        <view class="card-header">
          <view class="header-left">
            <image class="header-icon" :src="dim.icon" mode="aspectFit"></image>
            <text>{{ dim.name }}</text>
          </view>
          <text class="header-right">均分 {{ dim.avg }}</text>
        </view>

        <view class="bar-chart">
          <view class="bar-item" v-for="(item, iIndex) in dim.items" :key="iIndex">
            <text class="bar-value">{{ item.score }}</text>
            <view class="bar-track">
              <view
                class="bar-fill"
                :style="{ height: item.score + '%', background: dim.color }"
              ></view>
            </view>
            <text class="bar-label">{{ item.name }}</text>
          </view>
        </view>

        <view class="dim-feedback">
          <view class="feedback-block highlight-block">
            <view class="feedback-title">
              <image class="feedback-icon" src="/static/shoucang.png" mode="aspectFit"></image>
              <text>亮点</text>
            </view>
            <text class="feedback-text">{{ dim.highlight }}</text>
          </view>
          <view class="feedback-block suggest-block">
            <view class="feedback-title">
              <image class="feedback-icon" src="/static/qiuzhijinnang.png" mode="aspectFit"></image>
              <text>建议</text>
            </view>
            <text class="feedback-text">{{ dim.suggest }}</text>
          </view>
        </view>
      </view>

      <!-- 整体能力（Canvas 雷达图） -->
      <view class="dimension-card">
        <view class="card-header">
          <view class="header-left">
            <image class="header-icon" src="/static/ai.png" mode="aspectFit"></image>
            <text>整体能力</text>
          </view>
          <text class="header-right">五维雷达</text>
        </view>

        <view class="radar-wrapper">
          <canvas
            canvas-id="radarCanvas"
            id="radarCanvas"
            class="radar-canvas"
          ></canvas>
        </view>
      </view>
      </block>

    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { get } from '../../utils/request'

const goBack = () => {
  // 本页有两个入口（上传简历、简历分析历史），有上一页时正常退栈返回；
  // 直接从路由打开本页时栈内只有本页，navigateBack 会失败，回退到「上传简历」页兜底。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/resume/upload' })
  }
}

// 五大维度与 Dify full_detail 字段的映射
const DIMENSION_META = [
  { key: 'job_match', name: '职位匹配度', radarLabel: '职位匹配', icon: '/static/renzhi.png', color: '#4f6bff' },
  { key: 'structure_level', name: '结构层次指数', radarLabel: '结构层次', icon: '/static/jianlifenxi.png', color: '#f59e0b' },
  { key: 'visual_aesthetics', name: '视觉美观指数', radarLabel: '视觉美观', icon: '/static/ai.png', color: '#22d3ee' },
  { key: 'sincerity', name: '真诚度指数', radarLabel: '真诚度', icon: '/static/renzhi.png', color: '#8b5cf6' },
  { key: 'highlight_presentation', name: '亮点呈现指数', radarLabel: '亮点呈现', icon: '/static/ai.png', color: '#22c55e' }
]

const POLL_INTERVAL = 2000
const POLL_TIMEOUT = 3 * 60 * 1000

// 无 resumeId 打开本页（如从「分析历史」进入）时展示的静态样例
const DEMO_DATE = '2024-03-15'
const DEMO_EVALUATIONS = [
  '整体简历结构完整，岗位匹配度较高，建议突出量化成果。',
  '项目经历描述详实，但关键词密度偏低，可补充行业术语。',
  '视觉排版较为简洁，建议增加模块化分隔提升可读性。'
]
const DEMO_DIMENSIONS = [
  {
    name: '职位匹配度',
    avg: 85,
    icon: '/static/renzhi.png',
    color: '#4f6bff',
    items: [
      { name: '专业能力', score: 85 },
      { name: '基础要求', score: 92 },
      { name: '经历经验', score: 78 },
      { name: '胜任素质', score: 88 }
    ],
    highlight: '基础要求匹配度高，专业能力扎实。',
    suggest: '补充大型项目经历提升匹配度。'
  },
  {
    name: '结构层次指数',
    avg: 84,
    icon: '/static/jianlifenxi.png',
    color: '#f59e0b',
    items: [
      { name: '内容易读性', score: 82 },
      { name: '内容逻辑性', score: 85 },
      { name: '层次清晰性', score: 90 },
      { name: '结构完整性', score: 80 }
    ],
    highlight: '层次清晰，模块划分合理。',
    suggest: '完善教育模块和技能模块。'
  },
  {
    name: '视觉美观指数',
    avg: 81,
    icon: '/static/ai.png',
    color: '#22d3ee',
    items: [
      { name: '图形元素', score: 75 },
      { name: '排版布局', score: 82 },
      { name: '设计简洁性', score: 88 },
      { name: '颜色搭配', score: 80 }
    ],
    highlight: '设计简洁，配色舒适。',
    suggest: '增加图标和分隔线提升层次。'
  },
  {
    name: '真诚度指数',
    avg: 90,
    icon: '/static/renzhi.png',
    color: '#8b5cf6',
    items: [
      { name: '信息真实性', score: 95 },
      { name: '工作稳定性', score: 88 },
      { name: '文本正确度', score: 92 },
      { name: '求职空窗期', score: 85 }
    ],
    highlight: '信息真实度高，文本准确。',
    suggest: '说明空窗期内的学习与实践。'
  },
  {
    name: '亮点呈现指数',
    avg: 79,
    icon: '/static/ai.png',
    color: '#22c55e',
    items: [
      { name: '优势突出', score: 78 },
      { name: '关键词使用', score: 85 },
      { name: '奖项荣誉', score: 70 },
      { name: '数据展示', score: 82 }
    ],
    highlight: '关键词使用得当，优势突出。',
    suggest: '补充奖项荣誉和量化数据。'
  }
]
const DEMO_RADAR = [
  { label: '职位匹配', value: 85 },
  { label: '结构层次', value: 84 },
  { label: '视觉美观', value: 81 },
  { label: '真诚度', value: 90 },
  { label: '亮点呈现', value: 79 }
]

const resumeId = ref('')
const loading = ref(false)
const errorMsg = ref('')
const score = ref(88)
const reportDate = ref(DEMO_DATE)
const evaluations = ref(DEMO_EVALUATIONS)
const dimensions = ref(DEMO_DIMENSIONS)
const radarData = ref(DEMO_RADAR)

let pollTimer = null
let pollDeadline = 0

const formatDate = (value) => {
  if (!value) return ''
  return String(value).replace('T', ' ').slice(0, 16)
}

const stopPolling = () => {
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
}

// 进入真实的联调模式前先清空样例，避免分析中闪现旧数据
const resetReport = () => {
  score.value = 0
  reportDate.value = ''
  evaluations.value = []
  dimensions.value = DIMENSION_META.map((meta) => ({
    name: meta.name,
    icon: meta.icon,
    color: meta.color,
    avg: 0,
    items: [],
    highlight: '暂无数据',
    suggest: '暂无建议'
  }))
  radarData.value = DIMENSION_META.map((meta) => ({ label: meta.radarLabel, value: 0 }))
}

const buildDimensions = (detail) => DIMENSION_META.map((meta) => {
  const item = (detail && detail[meta.key]) || {}
  const suggestions = Array.isArray(item.suggestions)
    ? item.suggestions
    : (item.suggestions ? [item.suggestions] : [])
  return {
    name: meta.name,
    icon: meta.icon,
    color: meta.color,
    avg: Number(item.score) || 0,
    items: Array.isArray(item.breakdown)
      ? item.breakdown.map((part) => ({ name: part.name, score: Number(part.score) || 0 }))
      : [],
    highlight: item.highlights || '暂无数据',
    suggest: suggestions.length ? suggestions.join('；') : '暂无建议'
  }
})

const buildRadar = (values) => DIMENSION_META.map((meta, index) => ({
  label: meta.radarLabel,
  value: Math.max(0, Math.min(100, Number((values || [])[index]) || 0))
}))

const stripCodeFence = (text) => String(text || '')
  .replace(/<think>[\s\S]*?<\/think>/gi, '')
  .trim()
  .replace(/^```(?:json)?\s*/i, '')
  .replace(/```\s*$/, '')
  .trim()

const applyReport = (report) => {
  let data
  try {
    data = JSON.parse(stripCodeFence(report.result))
  } catch (e) {
    loading.value = false
    errorMsg.value = '报告数据格式异常，请重新发起分析'
    stopPolling()
    return
  }

  if (!data || data.status === 'error') {
    loading.value = false
    errorMsg.value = (data && (data.message || data.error)) || 'AI 分析失败，请重新发起分析'
    stopPolling()
    return
  }

  score.value = Number(data.total_score) || 0
  reportDate.value = formatDate(report.createTime)
  evaluations.value = Array.isArray(data.overall_evaluation) ? data.overall_evaluation : []
  dimensions.value = buildDimensions(data.full_detail)
  radarData.value = buildRadar(data.radar_data)
  loading.value = false
  stopPolling()
  nextTick(() => setTimeout(() => drawRadar(radarData.value), 50))
}

const scheduleNextPoll = () => {
  if (Date.now() > pollDeadline) {
    loading.value = false
    errorMsg.value = '分析超时，请稍后到「分析历史」中查看结果'
    stopPolling()
    return
  }
  pollTimer = setTimeout(pollReport, POLL_INTERVAL)
}

const pollReport = async () => {
  try {
    const report = await get(`/api/resume/report/${resumeId.value}`)
    if (!report || report.status === 0) {
      scheduleNextPoll()
      return
    }
    if (report.status === 2) {
      loading.value = false
      errorMsg.value = report.errorMsg || 'AI 分析失败，请稍后重试'
      stopPolling()
      return
    }
    if (report.status === 1) {
      applyReport(report)
      return
    }
    scheduleNextPoll()
  } catch (e) {
    // 报告尚未落库时后端返回 404，继续轮询
    if (e.statusCode === 404) {
      scheduleNextPoll()
      return
    }
    loading.value = false
    errorMsg.value = e.message || '获取分析结果失败'
    stopPolling()
  }
}

// 绘制雷达图
const drawRadar = (data) => {
  if (!data || data.length < 3) return

  const ctx = uni.createCanvasContext('radarCanvas')

  const centerX = 150
  const centerY = 150
  const maxRadius = 100
  const total = data.length
  const angleStep = (Math.PI * 2) / total

  // 1. 绘制背景网格（5 层同心多边形）
  const layers = 5
  for (let i = 1; i <= layers; i++) {
    const radius = (maxRadius / layers) * i
    ctx.beginPath()
    for (let j = 0; j < total; j++) {
      const angle = -Math.PI / 2 + j * angleStep
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      if (j === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    ctx.setStrokeStyle('#e5e7eb')
    ctx.setLineWidth(0.5)
    ctx.stroke()
  }

  // 2. 绘制从中心到顶点的放射线
  for (let j = 0; j < total; j++) {
    const angle = -Math.PI / 2 + j * angleStep
    const x = centerX + maxRadius * Math.cos(angle)
    const y = centerY + maxRadius * Math.sin(angle)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.setStrokeStyle('#e5e7eb')
    ctx.setLineWidth(0.5)
    ctx.stroke()
  }

  // 3. 绘制数据填充区域
  ctx.beginPath()
  data.forEach((item, index) => {
    const angle = -Math.PI / 2 + index * angleStep
    const radius = (item.value / 100) * maxRadius
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.closePath()
  ctx.setFillStyle('rgba(79, 107, 255, 0.25)')
  ctx.fill()
  ctx.setStrokeStyle('#4f6bff')
  ctx.setLineWidth(2)
  ctx.stroke()

  // 4. 绘制数据点（圆点）
  data.forEach((item, index) => {
    const angle = -Math.PI / 2 + index * angleStep
    const radius = (item.value / 100) * maxRadius
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.setFillStyle('#4f6bff')
    ctx.fill()
  })

  // 5. 绘制标签文字
  ctx.setFontSize(10)
  ctx.setFillStyle('#666')
  data.forEach((item, index) => {
    const angle = -Math.PI / 2 + index * angleStep
    const labelRadius = maxRadius + 20
    const x = centerX + labelRadius * Math.cos(angle)
    const y = centerY + labelRadius * Math.sin(angle)
    ctx.setTextAlign('center')
    ctx.setTextBaseline('middle')
    ctx.fillText(`${item.label} ${item.value}`, x, y)
  })

  ctx.draw()
}

onLoad((options) => {
  const id = options && options.resumeId
  // 无 resumeId 时保留静态样例展示（历史页入口）
  if (!id) return

  resumeId.value = id
  resetReport()
  loading.value = true
  pollDeadline = Date.now() + POLL_TIMEOUT
  pollReport()
})

onUnload(stopPolling)

onMounted(() => {
  if (!resumeId.value) {
    nextTick(() => {
      drawRadar(radarData.value)
    })
  }
})
</script>

<style scoped>
.page-container { background-color: #f5f6fa; height: 100%; overflow-y: auto; padding-bottom: 60rpx; }
.page-container::-webkit-scrollbar { display: none; }

/* 顶部背景 */
.header-bg { background: #fff; padding: 20rpx 30rpx 0; }
.status-bar { display: flex; justify-content: space-between; align-items: center; font-size: 26rpx; font-weight: bold; margin-bottom: 10rpx; color: #333; }
.status-icon { width: 32rpx; height: 24rpx; margin-left: 10rpx; filter: brightness(0.2); }
.nav-bar { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 0; }
.nav-title { font-size: 34rpx; font-weight: bold; }
.nav-icon { width: 40rpx; height: 40rpx; }

/* 报告标题卡片 */
.report-title-card { background: #fff; margin: 20rpx 30rpx; border-radius: 16rpx; padding: 30rpx; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03); }
.report-name { font-size: 34rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
.report-date { display: flex; align-items: center; font-size: 24rpx; color: #999; }
.mini-icon { width: 24rpx; height: 24rpx; margin-right: 6rpx; }
.score-badge { width: 100rpx; height: 100rpx; background: linear-gradient(135deg, #4f6bff, #6a82fb); border-radius: 20rpx; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #fff; }
.score-num { font-size: 44rpx; font-weight: bold; }
.score-label { font-size: 20rpx; opacity: 0.9; }

/* 图表卡片（通用） */
.chart-card, .evaluation-card, .dimension-card { background: #fff; margin: 0 30rpx 20rpx; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.header-left { display: flex; align-items: center; font-size: 30rpx; font-weight: bold; color: #333; }
.header-icon { width: 36rpx; height: 36rpx; margin-right: 10rpx; }
.header-right { font-size: 24rpx; color: #999; }

/* 环形图 */
.circle-wrapper { display: flex; justify-content: center; padding: 30rpx 0; }
.circle-outer { width: 300rpx; height: 300rpx; border-radius: 50%; background: conic-gradient(#4f6bff 0% 88%, #e5e7eb 88% 100%); display: flex; justify-content: center; align-items: center; }
.circle-inner { width: 240rpx; height: 240rpx; border-radius: 50%; background: #fff; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.circle-score { font-size: 60rpx; font-weight: bold; color: #333; }
.circle-label { font-size: 24rpx; color: #999; }

/* 总体评价 */
.evaluation-card { background: #eef7ff; }
.evaluation-list { padding-left: 10rpx; }
.eval-item { display: flex; align-items: flex-start; margin-bottom: 16rpx; }
.eval-dot { width: 12rpx; height: 12rpx; border-radius: 50%; background: #4f6bff; margin-top: 12rpx; margin-right: 12rpx; flex-shrink: 0; }
.eval-item text { font-size: 26rpx; color: #333; line-height: 1.6; }

/* 柱状图 */
.bar-chart { display: flex; justify-content: space-around; align-items: flex-end; height: 280rpx; padding: 20rpx 0; }
.bar-item { display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
.bar-value { font-size: 24rpx; color: #333; font-weight: bold; margin-bottom: 8rpx; }
.bar-track { width: 60rpx; height: 180rpx; background: #f0f2f5; border-radius: 8rpx; display: flex; align-items: flex-end; overflow: hidden; }
.bar-fill { width: 100%; border-radius: 8rpx 8rpx 0 0; transition: height 0.5s; }
.bar-label { font-size: 22rpx; color: #666; margin-top: 10rpx; text-align: center; }

/* 亮点 & 建议 */
.dim-feedback { display: flex; margin-top: 20rpx; }
.feedback-block { flex: 1; padding: 16rpx; border-radius: 12rpx; margin: 0 8rpx; }
.highlight-block { background: #f0fdf4; }
.suggest-block { background: #fef3c7; }
.feedback-title { display: flex; align-items: center; font-size: 24rpx; font-weight: bold; margin-bottom: 8rpx; }
.highlight-block .feedback-title { color: #16a34a; }
.suggest-block .feedback-title { color: #d97706; }
.feedback-icon { width: 28rpx; height: 28rpx; margin-right: 6rpx; }
.feedback-text { font-size: 22rpx; color: #333; line-height: 1.5; }

/* 雷达图 */
.radar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
}
.radar-canvas {
  width: 600rpx;
  height: 600rpx;
}

/* 分析中 / 失败状态 */
.status-card {
  background: #fff;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  padding: 60rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
}
.status-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-top: 20rpx;
}
.status-sub {
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
  text-align: center;
  line-height: 1.6;
}
.error-card .status-title {
  color: #dc2626;
}
.retry-btn {
  margin-top: 30rpx;
  padding: 0 48rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 36rpx;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  color: #fff;
  font-size: 28rpx;
}

/* 加载动画：三个跳动的圆点 */
.loading-dots {
  display: flex;
  align-items: center;
  height: 40rpx;
}
.loading-dots text {
  width: 14rpx;
  height: 14rpx;
  margin: 0 8rpx;
  border-radius: 50%;
  background: #4f6bff;
  animation: dot-bounce 1.2s infinite ease-in-out;
}
.loading-dots text:nth-child(2) {
  animation-delay: 0.15s;
}
.loading-dots text:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-12rpx);
    opacity: 1;
  }
}
</style>
