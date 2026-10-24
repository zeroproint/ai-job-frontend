<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 状态栏 + 导航栏（浅色底 → 白色图标需转深色） -->
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
          <image class="nav-icon" src="/static/jiantou-1.png" mode="aspectFit" @click="handleBack"></image>
          <text class="nav-title">匹配度报告</text>
          <image class="nav-icon" src="/static/fenxiang.png" mode="aspectFit" @click="handleShare"></image>
        </view>
      </view>

      <!-- 职位信息 -->
      <view class="job-card">
        <view class="job-company">
          <image class="job-icon" src="/static/gongsi.png" mode="aspectFit"></image>
          <text class="company-name">{{ job.company }}</text>
        </view>
        <text class="job-name">{{ job.name }}</text>
        <view class="job-date">
          <image class="job-icon" src="/static/shichang.png" mode="aspectFit"></image>
          <text>{{ job.date }}</text>
        </view>
      </view>

      <!-- 综合匹配度 -->
      <view class="card">
        <view class="card-title">
          <image class="title-icon" src="/static/pipeidu.png" mode="aspectFit"></image>
          <text>综合匹配度</text>
        </view>

        <view class="gauge">
          <view class="gauge-ring" :style="ringStyle"></view>
          <view class="gauge-inner">
            <text class="gauge-value">{{ score }}</text>
            <text class="gauge-unit">%</text>
          </view>
        </view>

        <view class="match-badge">
          <text class="check">✓</text>
          <text>匹配度较高，建议投递</text>
        </view>
      </view>

      <!-- 匹配维度 -->
      <view class="card">
        <view class="card-title">
          <image class="title-icon" src="/static/jianlifenxi.png" mode="aspectFit"></image>
          <text>匹配维度</text>
        </view>

        <view class="dim-item" v-for="dim in dimensions" :key="dim.name">
          <view class="dim-head">
            <image class="dim-icon" :src="dim.icon" mode="aspectFit"></image>
            <text class="dim-name">{{ dim.name }}</text>
            <text class="dim-value" :style="{ color: dim.color }">{{ dim.percent }}%</text>
          </view>
          <view class="dim-track">
            <view class="dim-fill" :style="{ width: dim.percent + '%', backgroundColor: dim.color }"></view>
          </view>
        </view>
      </view>

      <!-- 职位亮点 -->
      <view class="card highlight-card">
        <view class="card-title">
          <image class="title-icon" src="/static/shoucang.png" mode="aspectFit"></image>
          <text>职位亮点</text>
        </view>
        <view class="point-item" v-for="(text, index) in highlights" :key="index">
          <view class="dot dot-green"></view>
          <text class="point-text">{{ text }}</text>
        </view>
      </view>

      <!-- 优化建议 -->
      <view class="card advice-card">
        <view class="card-title">
          <image class="title-icon" src="/static/qiuzhijiqiao.png" mode="aspectFit"></image>
          <text>优化建议</text>
        </view>
        <view class="point-item" v-for="(text, index) in suggestions" :key="index">
          <view class="dot dot-orange"></view>
          <text class="point-text">{{ text }}</text>
        </view>
      </view>

      <!-- 二维码 -->
      <view class="card qr-card">
        <view class="qr-box">
          <view class="qr-grid">
            <view
              class="qr-cell"
              v-for="(cell, index) in qrPattern"
              :key="index"
              :class="{ filled: cell === 1 }"
            ></view>
          </view>
        </view>
        <view class="qr-tip" @click="handleDownload">
          <image class="qr-tip-icon" src="/static/shoucang.png" mode="aspectFit"></image>
          <text>扫码查看完整报告</text>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const job = ref({
  company: '字节跳动',
  name: '高级Java开发工程师',
  date: '2024-03-15'
})

const score = ref(82)

// 环形进度：conic-gradient 默认从 12 点方向顺时针填充
const ringStyle = computed(() => ({
  background: `conic-gradient(#4f6bff 0 ${score.value}%, #e8ecf7 ${score.value}% 100%)`
}))

const dimensions = ref([
  { name: '专业技能', percent: 88, color: '#4f6bff', icon: '/static/jinengyaoqiu.png' },
  { name: '项目经验', percent: 75, color: '#22d3ee', icon: '/static/renzhi.png' },
  { name: '学历背景', percent: 95, color: '#34d399', icon: '/static/xueye.png' },
  { name: '软技能', percent: 80, color: '#f59e0b', icon: '/static/wode_xuanzhong.png' }
])

const highlights = ref([
  '岗位技术栈与你的 Java / Spring Cloud 经验高度重合，上手成本低',
  '团队正在做微服务架构升级，你的服务拆分经验可直接复用',
  '薪资区间高于同岗位市场中位数，且带 14 薪与股票期权'
])

const suggestions = ref([
  '补充一份体现高并发场景的项目描述，突出 QPS 与响应时间等量化指标',
  'JD 中提到的 K8s / Docker 你经历里未体现，建议补充容器化部署相关经验',
  '简历中缺少开源贡献或技术博客，可作为加分项补充以提升区分度'
])

// 二维码占位图案（1 为深色格子）
const qrPattern = ref([1, 0, 1, 0, 1, 0, 1, 0, 1])

onLoad((options) => {
  if (options && options.job) job.value.name = decodeURIComponent(options.job)
  if (options && options.company) job.value.company = decodeURIComponent(options.company)
  if (options && options.date) job.value.date = decodeURIComponent(options.date)
})

const handleBack = () => {
  // 从「职位简历报告」列表 navigateTo 进来时正常退栈；
  // 直接从路由打开本页时栈内只有本页，navigateBack 会失败，回退到「我的」页兜底。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/mine/mine' })
  }
}

const handleShare = () => {
  uni.showToast({ title: '分享匹配度报告', icon: 'none' })
}

const handleDownload = () => {
  uni.showToast({ title: '报告已开始下载', icon: 'none' })
}
</script>

<style scoped>
/* 手机壳内纵向 flex，让内容区成为有确定高度的滚动容器 */
.phone-shell {
  display: flex;
  flex-direction: column;
}
.page-container {
  flex: 1;
  min-height: 0;
  height: auto;
  background-color: #f5f6fa;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 40rpx;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.page-container::-webkit-scrollbar {
  display: none;
}

/* 顶部区域（浅色底，状态栏白图标需转深色） */
.header-bg {
  background-color: #fff;
  padding: 20rpx 30rpx 24rpx;
}
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
}
.status-icon {
  width: 32rpx;
  height: 24rpx;
  margin-left: 10rpx;
  /* 图标本身为白色，在白色背景上压暗才可见 */
  filter: brightness(0.2);
}

/* 导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}
.nav-icon {
  width: 40rpx;
  height: 40rpx;
}
.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

/* 职位信息卡片 */
.job-card {
  margin: 24rpx 30rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  box-shadow: 0 6rpx 20rpx rgba(79, 107, 255, 0.25);
  color: #fff;
}
.job-company {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.company-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}
.job-name {
  display: block;
  font-size: 28rpx;
  color: #fff;
  opacity: 0.92;
  margin-bottom: 20rpx;
}
.job-date {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #fff;
  opacity: 0.9;
}
.job-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 10rpx;
  flex-shrink: 0;
  /* 图标为白色，在蓝色渐变上保持白色即可见 */
  filter: brightness(0) invert(1);
}

/* 通用卡片 */
.card {
  background-color: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}
.card-title {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}
.title-icon {
  width: 34rpx;
  height: 34rpx;
  margin-right: 12rpx;
}

/* 综合匹配度环形进度 */
.gauge {
  position: relative;
  width: 220rpx;
  height: 220rpx;
  margin: 0 auto;
}
.gauge-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.gauge-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 164rpx;
  height: 164rpx;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: baseline;
  justify-content: center;
}
.gauge-value {
  font-size: 56rpx;
  font-weight: bold;
  color: #4f6bff;
  line-height: 164rpx;
}
.gauge-unit {
  font-size: 26rpx;
  font-weight: bold;
  color: #4f6bff;
  margin-left: 4rpx;
}

.match-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
  font-size: 26rpx;
  color: #16a34a;
}
.check {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background-color: #22c55e;
  color: #fff;
  font-size: 22rpx;
  font-weight: bold;
  text-align: center;
  line-height: 32rpx;
  margin-right: 10rpx;
}

/* 匹配维度 */
.dim-item {
  margin-bottom: 28rpx;
}
.dim-item:last-child {
  margin-bottom: 0;
}
.dim-head {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.dim-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 10rpx;
  flex-shrink: 0;
}
.dim-name {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}
.dim-value {
  font-size: 26rpx;
  font-weight: bold;
}
.dim-track {
  height: 12rpx;
  border-radius: 6rpx;
  background-color: #f0f2f5;
  overflow: hidden;
}
.dim-fill {
  height: 100%;
  border-radius: 6rpx;
}

/* 职位亮点 / 优化建议 */
.highlight-card {
  background-color: #f0fdf4;
}
.advice-card {
  background-color: #fef3c7;
}
.point-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 14rpx;
}
.point-item:last-child {
  margin-bottom: 0;
}
.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 14rpx;
  margin-right: 14rpx;
}
.dot-green {
  background-color: #22c55e;
}
.dot-orange {
  background-color: #f59e0b;
}
.point-text {
  flex: 1;
  font-size: 26rpx;
  color: #555;
  line-height: 1.6;
}

/* 二维码 */
.qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qr-box {
  width: 220rpx;
  height: 220rpx;
  background-color: #fff;
  border: 2rpx dashed #c8d3e8;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-grid {
  width: 150rpx;
  height: 150rpx;
  display: flex;
  flex-wrap: wrap;
}
.qr-cell {
  width: 50rpx;
  height: 50rpx;
  background-color: transparent;
}
.qr-cell.filled {
  background-color: #4f6bff;
  border-radius: 4rpx;
}
.qr-tip {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #4f6bff;
  margin-top: 24rpx;
}
.qr-tip-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}
</style>
