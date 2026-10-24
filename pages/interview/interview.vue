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
          <text class="nav-title">面试列表</text>
          <image class="nav-icon" src="/static/sousuo.png" mode="aspectFit" @click="handleSearch"></image>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="stats-card">
        <view class="stat-item">
          <text class="stat-value">{{ stats.total }}</text>
          <text class="stat-label">总面试</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.done }}</text>
          <text class="stat-label">已生成报告</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.pending }}</text>
          <text class="stat-label">进行中</text>
        </view>
      </view>

      <!-- 面试记录列表 -->
      <view class="record-list">
        <view
          class="record-card"
          hover-class="record-card-hover"
          :hover-stay-time="80"
          v-for="item in interviews"
          :key="item.id"
          @click="openReport(item)"
        >
          <view class="record-top">
            <text class="record-job">{{ item.job }}</text>
            <text class="status-tag" :class="item.status === 'done' ? 'tag-done' : 'tag-pending'">
              {{ item.status === 'done' ? '已生成' : '生成中' }}
            </text>
          </view>

          <view class="meta-row">
            <image class="meta-icon" src="/static/gongsi.png" mode="aspectFit"></image>
            <text class="meta-text">{{ item.company }}</text>
          </view>
          <view class="meta-row">
            <image class="meta-icon" src="/static/shichang.png" mode="aspectFit"></image>
            <text class="meta-text">{{ item.date }}</text>
          </view>

          <!-- 整卡可点击，此处仅作视觉引导，不再单独绑定事件（避免冒泡重复跳转） -->
          <view class="record-footer">
            <text v-if="item.status === 'done'" class="report-link">查看报告 ></text>
            <text v-else class="report-link disabled">报告生成中…</text>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const interviews = ref([
  { id: 1, job: '高级Java开发工程师', company: '字节跳动', date: '2024-05-20 14:30', status: 'done' },
  { id: 2, job: '前端开发工程师', company: '腾讯科技', date: '2024-05-18 10:00', status: 'done' },
  { id: 3, job: '产品经理', company: '阿里巴巴', date: '2024-05-15 16:00', status: 'done' },
  { id: 4, job: 'Java后端开发工程师', company: '美团', date: '2024-05-12 09:30', status: 'done' },
  { id: 5, job: '算法工程师', company: '百度', date: '2024-05-10 15:20', status: 'pending' }
])

// 统计由列表推导，避免两边数据不一致
const stats = computed(() => ({
  total: interviews.value.length,
  done: interviews.value.filter(i => i.status === 'done').length,
  pending: interviews.value.filter(i => i.status === 'pending').length
}))

const handleBack = () => {
  // 从「我的」页 navigateTo 进来时，栈内有上一页，正常返回即可；
  // 若是直接从路由打开本页（如 H5 刷新 / 直接输网址），栈内只有本页，
  // navigateBack 会失败，此时直接回退到「我的」页，保证箭头始终可用。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/mine/mine' })
  }
}

const handleSearch = () => {
  uni.showToast({ title: '搜索面试记录', icon: 'none' })
}

const openReport = (item) => {
  if (item.status !== 'done') {
    uni.showToast({ title: '报告生成中，请稍候', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/interviewReport/interviewReport?id=${item.id}` +
      `&job=${encodeURIComponent(item.job)}` +
      `&company=${encodeURIComponent(item.company)}` +
      `&date=${encodeURIComponent(item.date)}`,
    fail: () => {
      uni.showToast({ title: '面试报告页开发中', icon: 'none' })
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

/* 面试记录 */
.record-list {
  padding: 0 30rpx;
}
.record-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}
/* 整卡点击反馈 */
.record-card-hover {
  background-color: #f7f8fc;
  transform: scale(0.99);
}
.record-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}
.record-job {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 20rpx;
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

.record-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f1f5;
}
.report-link {
  font-size: 28rpx;
  font-weight: bold;
  color: #4f6bff;
}
.report-link.disabled {
  font-size: 26rpx;
  font-weight: normal;
  color: #bbb;
}
</style>
