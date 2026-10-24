<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 状态栏：白底图标为白色，故置于蓝色渐变背景上 -->
      <view class="header-bg">
        <view class="status-bar">
          <text class="time">12:00</text>
          <view class="icons">
            <image class="status-icon" src="/static/dingwei.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/WIFI.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/dianchidianliang.png" mode="aspectFit"></image>
          </view>
        </view>
      </view>

      <!-- 导航栏（返回箭头/分享/收藏均为深色 → 浅色底） -->
      <view class="nav-bar">
        <image class="nav-back" src="/static/jiantou-1.png" mode="aspectFit" @click="handleBack"></image>
        <text class="nav-title">职位详情</text>
        <view class="nav-actions">
          <image class="nav-action-icon" src="/static/fenxiang.png" mode="aspectFit" @click="handleShare"></image>
          <image class="nav-action-icon" src="/static/shoucang.png" mode="aspectFit" @click="handleCollect"></image>
        </view>
      </view>

      <!-- 职位基本信息 -->
      <view class="card">
        <view class="job-top">
          <text class="job-name">{{ job.name }}</text>
          <text class="job-salary">{{ job.salary }}</text>
        </view>

        <view class="meta-row">
          <view class="meta-item">
            <image class="meta-icon" src="/static/dingwei-1.png" mode="aspectFit"></image>
            <text>{{ job.location }}</text>
          </view>
          <view class="meta-item">
            <image class="meta-icon" src="/static/shichang.png" mode="aspectFit"></image>
            <text>{{ job.experience }}</text>
          </view>
          <view class="meta-item">
            <image class="meta-icon" src="/static/xueye.png" mode="aspectFit"></image>
            <text>{{ job.education }}</text>
          </view>
        </view>

        <view class="skill-tags">
          <text class="skill-tag" v-for="tag in skills" :key="tag">{{ tag }}</text>
        </view>
      </view>

      <!-- 职位详情 -->
      <view class="card">
        <view class="card-title">
          <image class="title-icon" src="/static/tiaokuanxieyi.png" mode="aspectFit"></image>
          <text>职位详情</text>
        </view>

        <view class="sub-title">
          <image class="sub-icon" src="/static/gangwei.png" mode="aspectFit"></image>
          <text>岗位职责</text>
        </view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in duties" :key="index">
            <text class="dot">•</text>
            <text class="list-text">{{ item }}</text>
          </view>
        </view>

        <view class="sub-title">
          <image class="sub-icon" src="/static/renzhi.png" mode="aspectFit"></image>
          <text>任职要求</text>
        </view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in requirements" :key="index">
            <text class="dot">•</text>
            <text class="list-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- AI 职位分析 -->
      <view class="ai-card">
        <view class="card-title">
          <image class="title-icon" src="/static/ai.png" mode="aspectFit"></image>
          <text>AI 职位分析</text>
        </view>

        <view class="ai-btn" @click="startAiAnalysis">
          <image class="ai-btn-icon" src="/static/ai.png" mode="aspectFit"></image>
          <text>点击开始职位分析</text>
        </view>

        <view class="sub-title">
          <image class="sub-icon" src="/static/zhiyefenxi.png" mode="aspectFit"></image>
          <text>职位分析报告</text>
        </view>
        <view class="report-box">
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
          <text class="report-text">扫码下载职位报告</text>
        </view>

        <view class="sub-title">
          <image class="sub-icon" src="/static/jinengyaoqiu.png" mode="aspectFit"></image>
          <text>技能要求</text>
        </view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in aiSkills" :key="index">
            <text class="dot">•</text>
            <text class="list-text">{{ item }}</text>
          </view>
        </view>

        <view class="sub-title">
          <image class="sub-icon" src="/static/jiafenxiang.png" mode="aspectFit"></image>
          <text>加分项</text>
        </view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in aiBonus" :key="index">
            <text class="dot">•</text>
            <text class="list-text">{{ item }}</text>
          </view>
        </view>

        <view class="sub-title">
          <image class="sub-icon" src="/static/fazhanqianjing.png" mode="aspectFit"></image>
          <text>发展前景</text>
        </view>
        <view class="list">
          <view class="list-item" v-for="(item, index) in aiProspects" :key="index">
            <text class="dot">•</text>
            <text class="list-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <!-- 简历职位匹配度 -->
      <view class="card">
        <view class="card-title">
          <image class="title-icon" src="/static/pipeidu.png" mode="aspectFit"></image>
          <text>简历职位匹配度</text>
        </view>

        <view class="ai-btn" @click="startMatchAnalysis">
          <image class="ai-btn-icon" src="/static/pipeidu.png" mode="aspectFit"></image>
          <text>简历职位匹配度分析</text>
        </view>

        <text class="match-hint">上传简历后即可生成匹配度报告</text>
      </view>

      <!-- 公司信息 -->
      <view class="card company-card">
        <view class="card-title">
          <image class="title-icon" src="/static/gongsi.png" mode="aspectFit"></image>
          <text>公司信息</text>
        </view>

        <view class="company-row">
          <view class="company-logo">字</view>
          <view class="company-info">
            <text class="company-name">{{ job.company }}</text>
            <text class="company-meta">互联网 · {{ job.size }}</text>
          </view>
        </view>
      </view>

    </view>

    <!-- 底部固定操作栏 -->
    <view class="bottom-bar">
      <view class="bar-btn bar-btn-outline" @click="goInterviewReport">
        <image class="bar-icon" src="/static/mianshi.png" mode="aspectFit"></image>
        <text>面试报告</text>
      </view>
      <view class="bar-btn bar-btn-primary" @click="startMockInterview">
        <image class="bar-icon bar-icon-white" src="/static/ai.png" mode="aspectFit"></image>
        <text>AI 模拟面试</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const job = ref({
  name: '高级Java开发工程师',
  salary: '25-40K·14薪',
  company: '字节跳动',
  location: '北京·海淀',
  education: '本科',
  experience: '3-5 年',
  size: '1000-9999人'
})

const skills = ref(['Java', 'Spring', '微服务', 'Redis', 'MySQL'])

const duties = ref([
  '负责公司核心业务系统的架构设计与开发，保障系统高可用、高并发；',
  '参与需求评审与技术方案设计，输出高质量的技术文档；',
  '负责微服务模块的拆分、治理与性能优化；',
  '参与线上问题排查与故障处理，保障服务稳定运行；',
  '指导初级工程师，参与代码评审，提升团队整体研发效率。'
])

// 学历/经验要求跟随所选职位，避免列表筛选后详情仍显示固定的「本科及以上」
const requirements = computed(() => [
  `学历要求：${job.value.education}；工作经验：${job.value.experience}；`,
  '精通 Java 基础，熟悉 JVM 原理、多线程与并发编程；',
  '熟练掌握 Spring Boot / Spring Cloud、MyBatis 等主流框架；',
  '熟悉 MySQL、Redis、消息队列，具备高并发场景实践经验。'
])

const aiSkills = ref([
  'Java / JVM 调优：岗位核心要求，需具备实战经验',
  'Spring Cloud 微服务：技术栈匹配度高',
  'MySQL / Redis：高并发场景必备技能'
])

const aiBonus = ref([
  '有分布式系统设计经验',
  '熟悉 Docker / K8s 容器化部署',
  '有开源项目贡献或技术博客'
])

const aiProspects = ref([
  '可晋升为技术专家 / 架构师',
  '参与核心业务，成长空间大',
  '团队技术氛围浓厚，晋升通道清晰'
])

// 二维码占位图案（1 为深色格子）
const qrPattern = ref([1, 0, 1, 0, 1, 0, 1, 0, 1])

onLoad((options) => {
  if (!options) return
  if (options.name) job.value.name = decodeURIComponent(options.name)
  if (options.salary) job.value.salary = decodeURIComponent(options.salary)
  if (options.company) job.value.company = decodeURIComponent(options.company)
  if (options.location) job.value.location = decodeURIComponent(options.location)
  if (options.education) job.value.education = decodeURIComponent(options.education)
  if (options.experience) job.value.experience = decodeURIComponent(options.experience)
  if (options.companySize) job.value.size = decodeURIComponent(options.companySize)
  if (options.tags) {
    const tags = decodeURIComponent(options.tags)
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
    if (tags.length) skills.value = tags
  }
})

const handleBack = () => {
  // 从「求职」页 navigateTo 进来时正常退栈返回；
  // 直接从路由打开本页（如 H5 刷新 / 直接输网址）时栈内只有本页，
  // navigateBack 会失败，此时回到「求职」页兜底。
  // 求职页是 tab 页，与首页/我的同级，故用 reLaunch。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/job/job' })
  }
}

const handleShare = () => {
  uni.showToast({ title: '分享职位', icon: 'none' })
}

const handleCollect = () => {
  uni.showToast({ title: '已收藏该职位', icon: 'none' })
}

const startAiAnalysis = () => {
  uni.showToast({ title: '开始 AI 职位分析', icon: 'none' })
}

const startMatchAnalysis = () => {
  uni.showToast({ title: '开始匹配度分析', icon: 'none' })
}

const goInterviewReport = () => {
  uni.navigateTo({
    url: `/pages/interviewReport/interviewReport` +
      `?job=${encodeURIComponent(job.value.name)}` +
      `&company=${encodeURIComponent(job.value.company)}`,
    fail: () => {
      uni.showToast({ title: '面试报告页开发中', icon: 'none' })
    }
  })
}

const startMockInterview = () => {
  uni.navigateTo({
    url: `/pages/mockInterview/mockInterview?job=${encodeURIComponent(job.value.name)}`,
    fail: () => {
      uni.showToast({ title: '模拟面试页开发中', icon: 'none' })
    }
  })
}
</script>

<style scoped>
/* 手机壳内做纵向 flex 布局，让内容区成为「有确定高度」的滚动容器。
   原来只写 height:100%，一旦该百分比解析不出确定高度，overflow-y:auto 就不生效，
   超长内容会被 .phone-shell 的 overflow:hidden 直接裁掉且无法滚动。 */
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

/* 状态栏（白色图标 → 蓝色渐变底） */
.header-bg {
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
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
  padding: 24rpx 30rpx;
  background-color: #f5f6fa;
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
.nav-actions {
  display: flex;
  align-items: center;
}
.nav-action-icon {
  width: 40rpx;
  height: 40rpx;
  margin-left: 24rpx;
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
.sub-title {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin: 24rpx 0 12rpx;
}
.sub-icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 10rpx;
}

/* 职位基本信息 */
.job-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}
.job-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
  margin-right: 20rpx;
}
.job-salary {
  font-size: 30rpx;
  font-weight: bold;
  color: #4f6bff;
  flex-shrink: 0;
}
.meta-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}
.meta-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
  margin-right: 30rpx;
}
.meta-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 8rpx;
}
.skill-tags {
  display: flex;
  flex-wrap: wrap;
}
.skill-tag {
  font-size: 22rpx;
  background-color: #eef2ff;
  color: #4f6bff;
  padding: 8rpx 20rpx;
  border-radius: 24rpx;
  margin-right: 16rpx;
  margin-bottom: 10rpx;
}

/* 无序列表 */
.list-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12rpx;
}
.dot {
  font-size: 26rpx;
  color: #4f6bff;
  margin-right: 12rpx;
  line-height: 40rpx;
}
.list-text {
  flex: 1;
  font-size: 26rpx;
  color: #666;
  line-height: 40rpx;
}

/* AI 职位分析 */
.ai-card {
  background-color: #eef7ff;
  margin: 0 30rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
}
.ai-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  background-color: #22d3ee;
  border-radius: 40rpx;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  box-shadow: 0 6rpx 16rpx rgba(34,211,238,0.3);
}
.ai-btn-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
  /* 图标本身是蓝色，在青色/渐变按钮上需转为白色才可见 */
  filter: brightness(0) invert(1);
}

/* 二维码占位 */
.report-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0 10rpx;
}
.qr-box {
  width: 180rpx;
  height: 180rpx;
  background-color: #fff;
  border: 2rpx dashed #bcd4f0;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-grid {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  flex-wrap: wrap;
}
.qr-cell {
  width: 40rpx;
  height: 40rpx;
  background-color: transparent;
}
.qr-cell.filled {
  background-color: #4f6bff;
  border-radius: 4rpx;
}
.report-text {
  font-size: 26rpx;
  color: #666;
  margin-top: 16rpx;
}

/* 匹配度 */
.match-hint {
  display: block;
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-top: 20rpx;
}

/* 公司信息 */
.company-card {
  margin-bottom: 20rpx;
}
.company-row {
  display: flex;
  align-items: center;
}
.company-logo {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  color: #fff;
  font-size: 40rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.company-info {
  margin-left: 24rpx;
}
.company-name {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.company-meta {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
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
  border: 2rpx solid #4f6bff;
  color: #4f6bff;
  margin-right: 20rpx;
}
.bar-btn-primary {
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  color: #fff;
  font-weight: bold;
  box-shadow: 0 6rpx 16rpx rgba(79,107,255,0.3);
}
.bar-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}
.bar-icon-white {
  filter: brightness(0) invert(1);
}
</style>
