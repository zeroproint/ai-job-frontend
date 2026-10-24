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
          <text class="nav-title">职位简历报告</text>
          <image class="nav-icon" src="/static/sousuo.png" mode="aspectFit" @click="handleSearch"></image>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-value">{{ stats.total }}</text>
          <text class="stat-label">总职位</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.done }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.pending }}</text>
          <text class="stat-label">进行中</text>
        </view>
      </view>

      <!-- 报告列表 -->
      <view class="report-list">
        <view
          class="report-card"
          hover-class="report-card-hover"
          :hover-stay-time="80"
          v-for="item in reports"
          :key="item.id"
          @click="openReport(item)"
        >
          <view class="report-top">
            <view class="report-title">
              <text class="company-name">{{ item.company }}</text>
              <text class="job-name">{{ item.job }}</text>
            </view>
            <text class="status-tag" :class="item.status === 'done' ? 'tag-done' : 'tag-pending'">
              {{ item.status === 'done' ? '已生成' : '生成中' }}
            </text>
          </view>

          <view class="meta-row">
            <image class="meta-icon" src="/static/shichang.png" mode="aspectFit"></image>
            <text class="meta-text">{{ item.date }}</text>
          </view>
          <view class="meta-row">
            <image class="meta-icon" src="/static/jianlifenxi.png" mode="aspectFit"></image>
            <text class="meta-text">匹配简历 {{ item.resumeCount }} 份</text>
          </view>

          <!-- 整卡可点击，按钮仅作视觉引导，不再单独绑定事件（避免冒泡重复跳转） -->
          <view class="report-footer">
            <view class="report-btn" :class="item.status === 'done' ? 'btn-primary' : 'btn-disabled'">
              <image class="btn-icon" src="/static/pipeidu.png" mode="aspectFit"></image>
              <text>{{ item.status === 'done' ? '查看报告' : '生成中' }}</text>
            </view>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const reports = ref([
  { id: 1, company: '字节跳动', job: '高级Java开发工程师', date: '2024-05-20 14:30', resumeCount: 12, status: 'done' },
  { id: 2, company: '腾讯科技', job: '前端开发工程师', date: '2024-05-18 10:00', resumeCount: 8, status: 'done' },
  { id: 3, company: '阿里巴巴', job: '产品经理', date: '2024-05-15 16:00', resumeCount: 5, status: 'done' },
  { id: 4, company: '美团', job: 'Java后端开发工程师', date: '2024-05-12 09:30', resumeCount: 3, status: 'pending' }
])

// 统计由列表推导，避免两边数据不一致
const stats = computed(() => ({
  total: reports.value.length,
  done: reports.value.filter(i => i.status === 'done').length,
  pending: reports.value.filter(i => i.status === 'pending').length
}))

const handleBack = () => {
  // 从「我的」页 navigateTo 进来时正常退栈；
  // 直接从路由打开本页时栈内只有本页，navigateBack 会失败，回退到「我的」页兜底。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/mine/mine' })
  }
}

const handleSearch = () => {
  uni.showToast({ title: '搜索职位报告', icon: 'none' })
}

const openReport = (item) => {
  if (item.status !== 'done') {
    uni.showToast({ title: '报告生成中，请稍候', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/matchReportDetail/matchReportDetail?id=${item.id}` +
      `&job=${encodeURIComponent(item.job)}` +
      `&company=${encodeURIComponent(item.company)}` +
      `&date=${encodeURIComponent(item.date)}`,
    fail: () => {
      uni.showToast({ title: '匹配度报告页开发中', icon: 'none' })
    }
  })
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

/* 数据统计卡片 */
.stats-card {
  display: flex;
  align-items: center;
  margin: 24rpx 30rpx 20rpx;
  padding: 30rpx 0;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  box-shadow: 0 6rpx 20rpx rgba(79, 107, 255, 0.25);
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}
.stat-label {
  font-size: 24rpx;
  color: #fff;
  opacity: 0.85;
  margin-top: 8rpx;
}
.stat-divider {
  width: 1rpx;
  height: 60rpx;
  background-color: rgba(255, 255, 255, 0.3);
}

/* 报告列表 */
.report-list {
  padding: 0 30rpx;
}
.report-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}
/* 整卡点击反馈 */
.report-card-hover {
  background-color: #f7f8fc;
  transform: scale(0.99);
}
.report-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}
.report-title {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20rpx;
}
.company-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.job-name {
  font-size: 26rpx;
  color: #999;
  margin-top: 8rpx;
}
.status-tag {
  flex-shrink: 0;
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}
.tag-done {
  background-color: #ccfbf1;
  color: #0d9488;
}
.tag-pending {
  background-color: #fef3c7;
  color: #d97706;
}

.meta-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.meta-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 10rpx;
  flex-shrink: 0;
}
.meta-text {
  font-size: 24rpx;
  color: #999;
}

.report-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f1f5;
}
.report-btn {
  display: flex;
  align-items: center;
  height: 60rpx;
  padding: 0 26rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
  color: #fff;
}
.btn-primary {
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  box-shadow: 0 4rpx 12rpx rgba(79, 107, 255, 0.3);
}
.btn-disabled {
  background-color: #c9ccd6;
}
.btn-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 8rpx;
  /* 图标为彩色，压在渐变按钮上需转为白色才可见 */
  filter: brightness(0) invert(1);
}
</style>
