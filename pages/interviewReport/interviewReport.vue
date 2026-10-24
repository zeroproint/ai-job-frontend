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
          <text class="nav-title">面试报告</text>
          <image class="nav-icon" src="/static/shoucang.png" mode="aspectFit" @click="handleDownload"></image>
        </view>
      </view>

      <!-- 职位信息 -->
      <view class="job-card">
        <text class="job-name">{{ job.name }}</text>
        <view class="job-meta">
          <image class="job-meta-icon" src="/static/gongsi.png" mode="aspectFit"></image>
          <text>{{ job.company }}</text>
        </view>
        <view class="job-meta">
          <image class="job-meta-icon" src="/static/shichang.png" mode="aspectFit"></image>
          <text>{{ job.date }}</text>
        </view>
      </view>

      <!-- 二维码下载 -->
      <view class="qr-card">
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
          <text>扫码下载面试报告</text>
        </view>
      </view>

      <!-- 逐题问答 -->
      <view class="qa-list">
        <view class="qa-card" v-for="(item, index) in questions" :key="item.id">
          <view class="qa-title">
            <view class="q-icon">
              <text>?</text>
            </view>
            <text class="q-text">{{ index + 1 }}. {{ item.question }}</text>
          </view>

          <!-- 我的回答 -->
          <view class="qa-block answer-block">
            <view class="block-label">
              <image class="block-icon" src="/static/wode_weixuanzhong.png" mode="aspectFit"></image>
              <text>我的回答</text>
            </view>
            <text class="block-text">{{ item.answer }}</text>
          </view>

          <!-- 优化建议 -->
          <view class="qa-block advice-block">
            <view class="block-label">
              <image class="block-icon" src="/static/qiuzhijiqiao.png" mode="aspectFit"></image>
              <text>优化建议</text>
            </view>
            <text class="block-text">{{ item.advice }}</text>
          </view>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const job = ref({
  name: '高级Java开发工程师',
  company: '字节跳动',
  date: '2024-05-20 14:30'
})

// 二维码占位图案（1 为深色格子）
const qrPattern = ref([1, 0, 1, 0, 1, 0, 1, 0, 1])

const questions = ref([
  {
    id: 1,
    question: '请先进行自我介绍。',
    answer: '面试官您好，我叫张三，计算机科学与技术专业，有 3 年 Java 后端开发经验。目前主要负责电商交易系统的订单与支付模块，熟悉 Spring Cloud 微服务架构，主导过一次订单服务的拆分与性能优化，将接口平均响应时间从 800ms 降到 200ms。',
    advice: '自我介绍建议控制在 1-2 分钟内，采用「基本情况 + 核心技术栈 + 1 个有数据的亮点项目」的结构。你目前的回答内容扎实，但结尾缺少与岗位的关联，建议补一句「贵司该岗位要求的高并发经验，正是我近一年投入最多的方向」，让面试官立刻看到匹配度。'
  },
  {
    id: 2,
    question: '请介绍一下 JVM 的内存模型。',
    answer: 'JVM 内存主要分为堆、方法区、虚拟机栈、本地方法栈和程序计数器。堆是线程共享的，存放对象实例，分为新生代和老年代；方法区存放类元信息；虚拟机栈和程序计数器是线程私有的，栈帧里存放局部变量表和操作数栈。',
    advice: '回答偏教科书式，缺少与实战的连接。建议按「线程共享 / 线程私有」两类先划分，再补充你实际排查过的案例，例如「曾遇到 Metaspace 溢出，定位到是动态代理类不断生成，通过调整 -XX:MaxMetaspaceSize 并缓存代理对象解决」。同时可主动提到 G1 收集器与调优参数，体现深度。'
  },
  {
    id: 3,
    question: '你在项目中是如何解决高并发问题的？',
    answer: '我们在大促场景下主要做了几件事：一是用 Redis 做热点数据缓存，减少数据库压力；二是对下单接口做了限流，用令牌桶算法；三是对订单表做了分库分表；四是把非核心逻辑改成异步消息处理。',
    advice: '这题是你的加分项，但目前只列了手段，没有量化结果。强烈建议每一点都补上数据，比如「缓存命中率 98%，QPS 从 3000 提升到 12000」「分库分表后单表数据量从 2 亿降到 2000 万，慢查询减少 90%」。面试官更关心你如何权衡方案与衡量效果，而不是用了哪些组件。'
  }
])

onLoad((options) => {
  if (options && options.job) job.value.name = decodeURIComponent(options.job)
  if (options && options.company) job.value.company = decodeURIComponent(options.company)
  if (options && options.date) job.value.date = decodeURIComponent(options.date)
})

const handleBack = () => {
  // 本页有两个入口（面试列表、职位详情），正常来路直接退栈；
  // 直接从路由打开时栈内只有本页，navigateBack 会失败，回退到「我的」页兜底。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/mine/mine' })
  }
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
}
.job-name {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20rpx;
}
.job-meta {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #fff;
  opacity: 0.9;
  margin-top: 12rpx;
}
.job-meta-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 10rpx;
  flex-shrink: 0;
  /* 图标为白色，在蓝色渐变上保持白色即可见 */
  filter: brightness(0) invert(1);
}

/* 二维码区域 */
.qr-card {
  margin: 0 30rpx 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
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

/* 逐题问答 */
.qa-list {
  padding: 0 30rpx;
}
.qa-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}
.qa-title {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24rpx;
}
.q-icon {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background-color: #4f6bff;
  color: #fff;
  font-size: 22rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12rpx;
  margin-top: 4rpx;
}
.q-text {
  flex: 1;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.5;
}

.qa-block {
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
}
.answer-block {
  background-color: #f0f2f5;
}
.advice-block {
  background-color: #fef3c7;
}
.block-label {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}
.block-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 8rpx;
  flex-shrink: 0;
}
.block-text {
  display: block;
  font-size: 26rpx;
  color: #555;
  line-height: 1.6;
}
</style>
