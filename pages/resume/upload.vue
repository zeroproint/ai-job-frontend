<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 状态栏（白色背景，白色图标用 filter 压深） -->
      <view class="header-bg">
        <view class="status-bar">
          <text class="time">12:00</text>
          <view class="icons">
            <image class="status-icon" src="/static/dingwei.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/WIFI.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/dianchidianliang.png" mode="aspectFit"></image>
          </view>
        </view>

        <!-- 导航栏 -->
        <view class="nav-bar">
          <image class="nav-back" src="/static/jiantou-1.png" mode="aspectFit" @click="handleBack"></image>
          <text class="nav-title">上传简历</text>
          <image class="nav-more" src="/static/sandian.png" mode="aspectFit" @click="handleMore"></image>
        </view>
      </view>

      <!-- 上传区域 -->
      <view class="card upload-card">
        <view class="upload-icon-box">
          <image class="upload-icon" src="/static/shangchuan.png" mode="aspectFit"></image>
        </view>
        <text class="upload-title">上传简历</text>
        <text class="upload-subtitle">点击下方按钮选择文件，支持 PDF、Word、TXT 格式</text>

        <view class="upload-btn" :class="{ 'upload-btn-disabled': uploading }" @click="chooseFile">
          <image class="upload-btn-icon" src="/static/shangchuan.png" mode="aspectFit"></image>
          <text>{{ uploading ? '上传解析中...' : '选择文件上传' }}</text>
        </view>

        <view class="upload-hint">
          <text class="hint-icon">ⓘ</text>
          <text>文件大小 ≤ 10MB</text>
        </view>
      </view>

      <!-- 已上传的简历 -->
      <view class="card">
        <view class="card-title">
          <image class="title-icon" src="/static/wenjianjia.png" mode="aspectFit"></image>
          <text>已上传的简历</text>
        </view>

        <view
          class="resume-item"
          v-for="(item, index) in resumeList"
          :key="item.id"
          :class="{ selected: selectedIndex === index }"
          @click="selectResume(index)"
        >
          <image class="file-icon" src="/static/jianli-1.png" mode="aspectFit"></image>
          <view class="file-info">
            <text class="file-name">{{ item.name }}</text>
            <text class="file-time">{{ item.time }}</text>
          </view>
          <view class="radio" :class="{ checked: selectedIndex === index }">
            <text v-if="selectedIndex === index" class="radio-check">✓</text>
          </view>
        </view>

        <view v-if="loadingList" class="list-tip">加载中...</view>
        <view v-else-if="resumeList.length === 0" class="list-tip">暂无已上传的简历，请先选择文件上传</view>
      </view>

      <!-- 简历小贴士 -->
      <view class="card">
        <view class="card-title">
          <image class="title-icon" src="/static/xiaotieshi.png" mode="aspectFit"></image>
          <text>简历小贴士</text>
        </view>
        <text class="tips-text">建议上传 PDF 格式简历，内容包含项目经历、技术栈与个人优势，AI 可生成更精准的诊断报告</text>
      </view>

    </view>

    <!-- 底部固定操作栏 -->
    <view class="bottom-bar">
      <view class="bar-btn bar-btn-outline" @click="goHistory">
        <image class="bar-icon" src="/static/lishi.png" mode="aspectFit"></image>
        <text>分析历史</text>
      </view>
      <view class="bar-btn bar-btn-primary" @click="startAnalysis">
        <image class="bar-icon bar-icon-white" src="/static/ai.png" mode="aspectFit"></image>
        <text>AI 简历分析</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { get, post, uploadFile } from '../../utils/request'

const selectedIndex = ref(-1)
const resumeList = ref([])
const loadingList = ref(false)
const uploading = ref(false)
const submitting = ref(false)

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

const loadResumes = async () => {
  loadingList.value = true
  try {
    const list = await get('/api/resume/list')
    resumeList.value = (list || []).map((item) => ({
      id: item.id,
      name: item.fileName || '未命名简历',
      time: formatTime(item.createTime)
    }))
    if (selectedIndex.value >= resumeList.value.length) {
      selectedIndex.value = resumeList.value.length - 1
    }
    if (selectedIndex.value < 0 && resumeList.value.length > 0) {
      selectedIndex.value = 0
    }
  } catch (e) {
    uni.showToast({ title: e.message, icon: 'none', duration: 3000 })
  } finally {
    loadingList.value = false
  }
}

onMounted(loadResumes)

const chooseFile = () => {
  if (uploading.value) return
  uni.chooseFile({
    count: 1,
    extension: ['.pdf', '.doc', '.docx', '.txt'],
    success: async (res) => {
      const file = res.tempFiles && res.tempFiles[0]
      const filePath = res.tempFilePaths && res.tempFilePaths[0]
      if (!file || !filePath) return

      uploading.value = true
      uni.showLoading({ title: '上传解析中...', mask: true })
      try {
        const summary = await uploadFile('/api/resume/upload', filePath)
        uni.hideLoading()
        resumeList.value.unshift({
          id: summary.id,
          name: summary.fileName || file.name || '未命名简历',
          time: formatTime(summary.createTime) || formatTime(new Date())
        })
        selectedIndex.value = 0
        uni.showToast({ title: '上传成功', icon: 'success' })
      } catch (e) {
        uni.hideLoading()
        uni.showToast({ title: e.message, icon: 'none', duration: 3000 })
      } finally {
        uploading.value = false
      }
    }
  })
}

const selectResume = (index) => {
  selectedIndex.value = index
}

const startAnalysis = async () => {
  const current = resumeList.value[selectedIndex.value]
  if (!current) {
    uni.showToast({ title: '请先选择一份简历', icon: 'none' })
    return
  }
  if (submitting.value) return

  submitting.value = true
  try {
    await post(`/api/resume/analyze/${current.id}`)
    // 后端异步分析，进入报告页后轮询结果
    uni.navigateTo({ url: `/pages/resume/report?resumeId=${current.id}` })
  } catch (e) {
    uni.showToast({ title: e.message, icon: 'none', duration: 3000 })
  } finally {
    submitting.value = false
  }
}

const goHistory = () => {
  uni.navigateTo({ url: '/pages/resume/history' })
}

const handleBack = () => {
  // 从首页 navigateTo 进来时正常退栈返回；
  // 直接从路由打开本页（如 H5 刷新 / 直接输网址）时栈内只有本页，
  // navigateBack 会失败，此时回到首页兜底。首页是 tab 页，故用 reLaunch。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

const handleMore = () => {
  uni.showToast({ title: '更多操作', icon: 'none' })
}
</script>

<style scoped>
/* 手机壳内做纵向 flex 布局，让内容区成为「有确定高度」的滚动容器 */
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
  padding-bottom: 180rpx;
}
.page-container::-webkit-scrollbar { display: none; }

/* 顶部（白色） */
.header-bg {
  background-color: #fff;
  padding: 20rpx 30rpx 0;
}

/* 状态栏（白底 → 白图标压深） */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}
.status-icon {
  width: 32rpx;
  height: 24rpx;
  margin-left: 10rpx;
  filter: brightness(0.2);
}

/* 导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}
.nav-back {
  width: 40rpx;
  height: 40rpx;
}
.nav-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}
.nav-more {
  width: 40rpx;
  height: 40rpx;
}

/* 卡片 */
.card {
  background-color: #fff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
}
.card-title {
  display: flex;
  align-items: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}
.title-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 12rpx;
}

/* 上传区域 */
.upload-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20rpx;
  padding: 50rpx 30rpx;
}
.upload-icon-box {
  width: 120rpx;
  height: 120rpx;
  background-color: #eef2ff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-icon {
  width: 70rpx;
  height: 70rpx;
}
.upload-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-top: 24rpx;
}
.upload-subtitle {
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
  text-align: center;
}
.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88rpx;
  margin-top: 36rpx;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  border-radius: 44rpx;
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  box-shadow: 0 8rpx 20rpx rgba(79,107,255,0.3);
}
.upload-btn-icon {
  width: 34rpx;
  height: 34rpx;
  margin-right: 12rpx;
  /* 图标本身是深灰，在蓝色渐变按钮上需转为白色才清晰 */
  filter: brightness(0) invert(1);
}
.upload-hint {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  font-size: 22rpx;
  color: #4f6bff;
}
.hint-icon {
  margin-right: 6rpx;
}

/* 简历列表 */
.resume-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 16rpx;
  border-radius: 12rpx;
  background-color: #fafbfc;
  border-left: 6rpx solid transparent;
  box-sizing: border-box;
}
.resume-item.selected {
  background-color: #eef2ff;
  border-left-color: #4f6bff;
}
.file-icon {
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
}
.file-info {
  flex: 1;
  margin-left: 20rpx;
  overflow: hidden;
}
.file-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-time {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
}

/* 单选圆点 */
.radio {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid #ccc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 16rpx;
}
.radio.checked {
  background-color: #4f6bff;
  border-color: #4f6bff;
}
.radio-check {
  color: #fff;
  font-size: 22rpx;
  line-height: 1;
}

/* 小贴士 */
.tips-text {
  font-size: 26rpx;
  color: #666;
  line-height: 40rpx;
}

/* 底部固定操作栏 */
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box;
  z-index: 9999;
}
.bar-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40rpx;
  font-size: 28rpx;
}
.bar-btn-outline {
  background-color: #fff;
  border: 2rpx solid #e5e7eb;
  color: #666;
  margin-right: 20rpx;
}
.bar-btn-primary {
  background: linear-gradient(135deg, #22d3ee, #06b6d4);
  color: #fff;
  font-weight: bold;
  box-shadow: 0 6rpx 16rpx rgba(34,211,238,0.3);
}
.bar-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}
.bar-icon-white {
  filter: brightness(0) invert(1);
}

/* 上传中禁用态 / 列表空状态 */
.upload-btn-disabled {
  opacity: 0.6;
}
.list-tip {
  padding: 30rpx 0;
  text-align: center;
  font-size: 26rpx;
  color: #999;
}
</style>
