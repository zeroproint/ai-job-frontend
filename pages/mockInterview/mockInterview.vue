<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 状态栏 + 导航栏（深色底，白色图标直接显示） -->
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
          <text class="nav-title">模拟面试</text>
          <image class="nav-icon" src="/static/sandian.png" mode="aspectFit" @click="handleMore"></image>
        </view>
      </view>

      <!-- 面试官问候 -->
      <view class="greeting">
        <view class="avatar">
          <image class="avatar-icon" src="/static/ai.png" mode="aspectFit"></image>
        </view>
        <view class="greeting-text">
          <text class="greeting-title">您好，我是本次面试官！</text>
          <text class="greeting-sub">本次面试题共 5 题，每道答题时长建议在 3 分钟以内。</text>
        </view>
      </view>

      <!-- 摄像头预览 -->
      <view class="camera-card">
        <view class="recording">
          <view class="recording-dot"></view>
          <text class="recording-text">录制中</text>
        </view>
        <view class="camera-icon">
          <view class="camera-lens"></view>
        </view>
        <text class="camera-label">摄像头预览</text>
      </view>

      <!-- 当前题目 -->
      <view class="question-card">
        <view class="question-top">
          <text class="question-tag">问题：{{ currentIndex + 1 }} / {{ questions.length }}</text>
          <view class="timer">
            <view class="clock-icon"></view>
            <text>{{ timerText }}</text>
          </view>
        </view>
        <text class="question-content">{{ current.content }}</text>
      </view>

      <!-- 面试题目列表 -->
      <view class="list-section">
        <text class="list-title">面试题目列表</text>
        <view
          class="list-item"
          :class="{ 'item-active': index === currentIndex }"
          v-for="(item, index) in questions"
          :key="item.id"
          @click="switchQuestion(index)"
        >
          <view class="item-index" :class="{ 'index-active': index === currentIndex }">
            <text>{{ index + 1 }}</text>
          </view>
          <text class="item-text" :class="{ 'text-active': index === currentIndex }">{{ item.title }}</text>
          <text class="item-status" :class="index === currentIndex ? 'status-active' : 'status-idle'">
            {{ index === currentIndex ? '答题中' : '待答题' }}
          </text>
        </view>
      </view>

    </view>

    <!-- 底部控制栏 -->
    <view class="bottom-bar">
      <view class="main-btn" :class="{ 'main-btn-paused': isPaused }" @click="togglePause">
        <view class="main-btn-dot"></view>
        <text>{{ isPaused ? '已暂停' : '正在答题' }}</text>
      </view>

      <view class="sub-actions">
        <view class="sub-btn" @click="togglePause">
          <view class="pause-icon">
            <view class="pause-bar"></view>
            <view class="pause-bar"></view>
          </view>
          <text>{{ isPaused ? '继续' : '暂停' }}</text>
        </view>

        <view class="sub-btn" @click="nextQuestion">
          <image class="sub-icon" src="/static/xiabiao.png" mode="aspectFit"></image>
          <text>下一题</text>
        </view>

        <view class="sub-btn" @click="endInterview">
          <text class="check-icon">✓</text>
          <text>结束</text>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const questions = ref([
  {
    id: 1,
    title: '请先进行自我介绍',
    content: '请先进行自我介绍，包括教育背景、工作经历、技术栈和个人优势。'
  },
  {
    id: 2,
    title: '接口和抽象类有什么区别',
    content: '接口和抽象类有什么区别？分别说说它们的使用场景，以及为什么 Java 8 之后接口可以定义 default 方法。'
  },
  {
    id: 3,
    title: '线程和进程的区别',
    content: '线程和进程的区别是什么？在 Java 中如何创建线程，线程池的核心参数分别有什么含义？'
  },
  {
    id: 4,
    title: '谈谈你对 Spring IoC 的理解',
    content: '谈谈你对 Spring IoC 的理解，它是如何实现依赖注入的？Bean 的生命周期包含哪些阶段？'
  },
  {
    id: 5,
    title: '描述一次你解决过的线上问题',
    content: '描述一次你解决过的线上问题，说明问题的现象、排查思路、定位过程和最终的解决方案。'
  }
])

const currentIndex = ref(0)
const isPaused = ref(false)
const elapsed = ref(32)

const current = computed(() => questions.value[currentIndex.value])

// 秒数格式化为 HH:MM:SS
const timerText = computed(() => {
  const t = elapsed.value
  const h = String(Math.floor(t / 3600)).padStart(2, '0')
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0')
  const s = String(t % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
})

let timer = null

onMounted(() => {
  timer = setInterval(() => {
    if (!isPaused.value) elapsed.value += 1
  }, 1000)
})

// 离开页面必须清掉定时器，否则后台仍在跑
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

onLoad((options) => {
  if (options && options.job) {
    // 从职位详情带过来的岗位，仅用于提示，不改变题目
    uni.showToast({ title: `开始面试：${decodeURIComponent(options.job)}`, icon: 'none' })
  }
})

const handleBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

const handleMore = () => {
  uni.showToast({ title: '更多设置', icon: 'none' })
}

const switchQuestion = (index) => {
  if (index === currentIndex.value) return
  currentIndex.value = index
  elapsed.value = 0
  isPaused.value = false
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const nextQuestion = () => {
  if (currentIndex.value >= questions.value.length - 1) {
    uni.showToast({ title: '已经是最后一题', icon: 'none' })
    return
  }
  switchQuestion(currentIndex.value + 1)
}

const endInterview = () => {
  uni.showModal({
    title: '结束面试',
    content: '确定要结束本次模拟面试吗？结束后可查看面试报告。',
    success: (res) => {
      if (res.confirm) {
        uni.redirectTo({
          url: '/pages/interviewReport/interviewReport',
          fail: () => {
            uni.reLaunch({ url: '/pages/index/index' })
          }
        })
      }
    }
  })
}
</script>

<style scoped>
/* 手机壳内纵向 flex，让内容区成为有确定高度的滚动容器 */
.phone-shell {
  display: flex;
  flex-direction: column;
  background-color: #0f172a;
}
.page-container {
  flex: 1;
  min-height: 0;
  height: auto;
  background-color: #0f172a;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 280rpx;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.page-container::-webkit-scrollbar {
  display: none;
}

/* 顶部区域（深色底，白色图标直接显示，无需 filter） */
.header-bg {
  background-color: #0f172a;
  padding: 20rpx 30rpx 24rpx;
}
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  font-weight: bold;
  color: #fff;
}
.status-icon {
  width: 32rpx;
  height: 24rpx;
  margin-left: 10rpx;
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
  /* 图标本身为深色，在深色底上需转为白色才可见 */
  filter: brightness(0) invert(1);
}
.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #fff;
}

/* 面试官问候 */
.greeting {
  display: flex;
  align-items: flex-start;
  padding: 10rpx 30rpx 30rpx;
}
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background-color: rgba(34, 211, 238, 0.15);
  border: 2rpx solid rgba(34, 211, 238, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar-icon {
  width: 52rpx;
  height: 52rpx;
  /* 图标为蓝色，转为白色后配青色底更清晰 */
  filter: brightness(0) invert(1);
}
.greeting-text {
  flex: 1;
  margin-left: 20rpx;
}
.greeting-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}
.greeting-sub {
  display: block;
  font-size: 24rpx;
  color: #94a3b8;
  line-height: 1.6;
  margin-top: 12rpx;
}

/* 摄像头预览 */
.camera-card {
  position: relative;
  margin: 0 30rpx 20rpx;
  height: 400rpx;
  border-radius: 16rpx;
  background-color: #1e293b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.recording {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  display: flex;
  align-items: center;
}
.recording-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background-color: #ef4444;
  margin-right: 10rpx;
  animation: blink 1.2s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}
.recording-text {
  font-size: 24rpx;
  color: #ef4444;
}

/* 纯 CSS 摄像机图标 */
.camera-icon {
  position: relative;
  width: 100rpx;
  height: 72rpx;
  border: 4rpx solid #475569;
  border-radius: 12rpx;
}
.camera-icon::before {
  content: '';
  position: absolute;
  top: -16rpx;
  left: 26rpx;
  width: 32rpx;
  height: 16rpx;
  border: 4rpx solid #475569;
  border-bottom: none;
  border-radius: 8rpx 8rpx 0 0;
}
.camera-lens {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 34rpx;
  height: 34rpx;
  border: 4rpx solid #475569;
  border-radius: 50%;
}
.camera-label {
  font-size: 24rpx;
  color: #94a3b8;
  margin-top: 30rpx;
}

/* 当前题目卡片 */
.question-card {
  margin: 0 30rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  background-color: #1e293b;
}
.question-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.question-tag {
  font-size: 24rpx;
  color: #fff;
  background-color: #4f6bff;
  padding: 6rpx 18rpx;
  border-radius: 20rpx;
}
.timer {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  font-weight: bold;
  color: #ef4444;
}
/* 纯 CSS 时钟图标 */
.clock-icon {
  position: relative;
  width: 28rpx;
  height: 28rpx;
  border: 3rpx solid #ef4444;
  border-radius: 50%;
  margin-right: 10rpx;
}
.clock-icon::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 4rpx;
  width: 3rpx;
  height: 9rpx;
  background-color: #ef4444;
  transform: translateX(-50%);
}
.clock-icon::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8rpx;
  height: 3rpx;
  background-color: #ef4444;
  transform-origin: left center;
}
.question-content {
  display: block;
  font-size: 28rpx;
  color: #fff;
  line-height: 1.6;
}

/* 面试题目列表 */
.list-section {
  padding: 0 30rpx;
}
.list-title {
  display: block;
  font-size: 26rpx;
  color: #94a3b8;
  margin-bottom: 20rpx;
}
.list-item {
  display: flex;
  align-items: center;
  background-color: #1e293b;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  border: 2rpx solid transparent;
}
.item-active {
  border-color: rgba(34, 211, 238, 0.5);
}
.item-index {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: #334155;
  color: #94a3b8;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.index-active {
  background-color: #22d3ee;
  color: #fff;
  font-weight: bold;
}
.item-text {
  flex: 1;
  font-size: 26rpx;
  color: #94a3b8;
  margin: 0 20rpx;
}
.text-active {
  color: #fff;
}
.item-status {
  flex-shrink: 0;
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}
.status-active {
  color: #22d3ee;
  background-color: rgba(34, 211, 238, 0.15);
}
.status-idle {
  color: #94a3b8;
  background-color: rgba(148, 163, 184, 0.15);
}

/* 底部控制栏 */
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 24rpx 30rpx 30rpx;
  box-sizing: border-box;
  background-color: #0f172a;
  border-top: 1rpx solid #1e293b;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  z-index: 9999;
}
.main-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 20rpx rgba(239, 68, 68, 0.35);
}
.main-btn-paused {
  background: linear-gradient(135deg, #64748b, #475569);
  box-shadow: none;
}
.main-btn-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background-color: #fff;
  margin-right: 12rpx;
}
.sub-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
}
.sub-btn {
  flex: 1;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e293b;
  border-radius: 36rpx;
  color: #fff;
  font-size: 26rpx;
  margin-right: 16rpx;
}
.sub-btn:last-child {
  margin-right: 0;
}
.sub-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
  /* 图标本身为深色，在深色按钮上需转为白色才可见 */
  filter: brightness(0) invert(1);
}
/* 纯 CSS 暂停图标 */
.pause-icon {
  display: flex;
  align-items: center;
  margin-right: 8rpx;
}
.pause-bar {
  width: 5rpx;
  height: 20rpx;
  background-color: #fff;
  border-radius: 3rpx;
  margin-right: 5rpx;
}
.pause-bar:last-child {
  margin-right: 0;
}
.check-icon {
  font-size: 26rpx;
  font-weight: bold;
  color: #fff;
  margin-right: 8rpx;
}
</style>
