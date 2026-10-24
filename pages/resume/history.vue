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
          <text class="nav-title">简历分析历史</text>
          <image class="nav-icon" src="/static/shaixuan.png" mode="aspectFit" @click="handleFilter"></image>
        </view>
      </view>

      <!-- Banner -->
      <view class="banner">
        <text class="banner-title">简历分析历史</text>
        <view class="banner-sub">
          <image class="banner-icon" src="/static/shichang.png" mode="aspectFit"></image>
          <text>查看您的简历分析记录</text>
        </view>
      </view>

      <!-- 历史记录列表 -->
      <view class="history-list">
        <view v-if="loading" class="list-tip">加载中...</view>
        <view v-else-if="records.length === 0" class="list-tip">暂无分析记录</view>

        <view v-else class="record-list">
          <view
            class="history-card"
            hover-class="history-card-hover"
            :hover-stay-time="80"
            v-for="item in records"
            :key="item.reportId"
            @click="goReport(item)"
          >
            <!-- 头像：取文件名首字 -->
            <view class="avatar">{{ item.name.charAt(0) }}</view>

            <view class="info">
              <text class="name">{{ item.name }}</text>
              <view class="time">
                <image class="time-icon" src="/static/shichang.png" mode="aspectFit"></image>
                <text>{{ item.time }}</text>
              </view>
            </view>

            <view class="record-right">
              <text
                v-if="item.status === 1 && item.score !== null"
                class="score"
                :style="scoreStyle(item.score)"
              >{{ item.score }}分</text>
              <text class="status-tag" :class="'status-' + item.status">{{ statusText(item.status) }}</text>
            </view>
            <text class="arrow">></text>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get } from '../../utils/request'

const records = ref([])
const loading = ref(false)

const pad = (n) => (n < 10 ? '0' + n : '' + n)

// 后端时间形如 2026-10-25T01:18:22，统一显示为 2026-10-25 01:18
const formatTime = (value) => {
  if (!value) return ''
  if (value instanceof Date) {
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ` +
      `${pad(value.getHours())}:${pad(value.getMinutes())}`
  }
  return String(value).replace('T', ' ').slice(0, 16)
}

const loadHistory = async () => {
  loading.value = true
  try {
    const list = await get('/api/resume/history')
    records.value = (list || []).map((item) => ({
      reportId: item.reportId,
      resumeId: item.resumeId,
      name: item.fileName || '未命名简历',
      time: formatTime(item.uploadTime),
      score: item.totalScore,
      status: item.status
    }))
  } catch (e) {
    uni.showToast({ title: e.message, icon: 'none', duration: 3000 })
  } finally {
    loading.value = false
  }
}

// 每次进入页面都刷新，返回报告页后可看到最新状态
onShow(loadHistory)

const statusText = (status) => {
  if (status === 0) return '分析中'
  if (status === 2) return '分析失败'
  return '已完成'
}

// 分数分档配色
const scoreStyle = (score) => {
  const value = Number(score) || 0
  if (value >= 85) return { backgroundColor: '#dbeafe', color: '#2563eb' }
  if (value >= 75) return { backgroundColor: '#dcfce7', color: '#16a34a' }
  if (value >= 60) return { backgroundColor: '#ffedd5', color: '#ea580c' }
  return { backgroundColor: '#fee2e2', color: '#dc2626' }
}

const handleBack = () => {
  // 从「上传简历」页 navigateTo 进来时正常退栈返回；
  // 直接从路由打开本页时栈内只有本页，navigateBack 会失败，回退到「上传简历」页兜底。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/resume/upload' })
  }
}

const handleFilter = () => {
  uni.showToast({ title: '筛选分析记录', icon: 'none' })
}

const goReport = (item) => {
  uni.navigateTo({ url: `/pages/resume/report?resumeId=${item.resumeId}` })
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

/* Banner */
.banner {
  margin: 24rpx 30rpx 20rpx;
  padding: 36rpx 30rpx;
  border-radius: 20rpx;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  box-shadow: 0 6rpx 20rpx rgba(79, 107, 255, 0.25);
}
.banner-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
}
.banner-sub {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #fff;
  opacity: 0.9;
  margin-top: 12rpx;
}
.banner-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 10rpx;
  flex-shrink: 0;
  /* 图标为白色，在蓝色渐变上保持白色即可见 */
  filter: brightness(0) invert(1);
}

/* 历史记录 */
.history-list {
  padding: 0 30rpx;
}
.history-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}
.history-card-hover {
  background-color: #f7f8fc;
  transform: scale(0.99);
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.info {
  flex: 1;
  min-width: 0;
  margin: 0 20rpx;
}
.name {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.time {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  color: #999;
  margin-top: 10rpx;
}
.time-icon {
  width: 22rpx;
  height: 22rpx;
  margin-right: 8rpx;
  flex-shrink: 0;
}
.score {
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: bold;
  padding: 8rpx 18rpx;
  border-radius: 20rpx;
}
.record-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}
.status-tag {
  margin-top: 8rpx;
  font-size: 20rpx;
  line-height: 1.4;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
}
.status-0 {
  color: #2563eb;
  background-color: #dbeafe;
}
.status-1 {
  color: #16a34a;
  background-color: #dcfce7;
}
.status-2 {
  color: #dc2626;
  background-color: #fee2e2;
}
.arrow {
  flex-shrink: 0;
  font-size: 28rpx;
  color: #ccc;
  margin-left: 16rpx;
}
.list-tip {
  padding: 60rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #999;
}
</style>
