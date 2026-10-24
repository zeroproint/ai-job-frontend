<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 顶部渐变区域 -->
      <view class="header-bg">
        <!-- 顶部状态栏（时间、定位、WiFi、电量） -->
        <view class="status-bar">
          <text class="time">12:00</text>
          <view class="icons">
            <image class="status-icon" src="/static/dingwei.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/WIFI.png" mode="aspectFit"></image>
            <image class="status-icon" src="/static/dianchidianliang.png" mode="aspectFit"></image>
          </view>
        </view>

        <view class="header-content">
          <text class="title">AI 求职</text>
          <text class="subtitle">智能求职助手，助你找到理想工作</text>
          <image class="bell-icon" src="/static/lingdang.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 核心功能卡片 -->
      <view class="cards-container">
        <!-- AI 简历诊断 -->
        <view class="card" @click="goToResumeDiagnosis">
          <view class="card-left">
            <image class="card-icon-img" src="/static/jianlifenxi.png" mode="aspectFit"></image>
          </view>
          <view class="card-center">
            <view class="card-title-row">
              <text class="card-title">AI 简历诊断</text>
              <text class="tag tag-ai">AI 智能</text>
            </view>
            <text class="card-desc">智能分析简历，多维度评分与优化建议</text>
          </view>
          <view class="action-text">立即诊断 ></view>
        </view>

        <!-- 求职 -->
        <view class="card" @click="goToJobList">
          <view class="card-left">
            <image class="card-icon-img" src="/static/qiuzhi-12.png" mode="aspectFit"></image>
          </view>
          <view class="card-center">
            <view class="card-title-row">
              <text class="card-title">求职</text>
              <text class="tag tag-job">职位推荐</text>
            </view>
            <text class="card-desc">海量职位，精准匹配，AI 职位分析</text>
          </view>
          <view class="action-text">开始求职 ></view>
        </view>
      </view>

      <!-- 求职锦囊 -->
      <view class="section-title">
        <image class="section-icon" src="/static/qiuzhijinnang.png" mode="aspectFit"></image>
        <text>求职锦囊</text>
      </view>
      <view class="tips-container">
        <view class="tip-item">
          <image class="tip-icon-img" src="/static/qiuzhijiqiao.png" mode="aspectFit"></image>
          <text class="tip-name">面试技巧</text>
          <text class="tip-desc">高频考点</text>
        </view>
        <view class="tip-item">
          <image class="tip-icon-img" src="/static/hanyebaike.png" mode="aspectFit"></image>
          <text class="tip-name">行业百科</text>
          <text class="tip-desc">岗位详解</text>
        </view>
        <view class="tip-item">
          <image class="tip-icon-img" src="/static/zhiyefazhan.png" mode="aspectFit"></image>
          <text class="tip-name">职业发展</text>
          <text class="tip-desc">规划指南</text>
        </view>
      </view>

      <!-- 底部导航栏 -->
      <view class="custom-tabbar">
        <view class="tab-item active" @click="switchTab(0, '/pages/index/index')">
          <image class="tab-icon-img" src="/static/shouye_xuanzhong.png" mode="aspectFit"></image>
          <text class="tab-text">首页</text>
        </view>
        <view class="tab-item" @click="switchTab(1, '/pages/job/job')">
          <image class="tab-icon-img" src="/static/qiuzhi_weixuanzhong.png" mode="aspectFit"></image>
          <text class="tab-text">求职</text>
        </view>
        <view class="tab-item" @click="switchTab(2, '/pages/mine/mine')">
          <image class="tab-icon-img" src="/static/wode_weixuanzhong.png" mode="aspectFit"></image>
          <text class="tab-text">我的</text>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
const goToResumeDiagnosis = () => {
  uni.navigateTo({ url: '/pages/resume/upload' })
}
const goToJobList = () => {
  uni.reLaunch({ url: '/pages/job/job' })
}
const switchTab = (index, url) => {
  uni.reLaunch({ url })
}
</script>

<style scoped>
.page-container {
  background-color: #f5f6fa;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 120rpx;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.page-container::-webkit-scrollbar {
  display: none;
}

/* 顶部背景 */
.header-bg {
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  height: 300rpx;
  padding: 20rpx 40rpx 0;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  color: #fff;
  position: relative;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

/* 状态栏图标 */
.status-icon {
  width: 32rpx;
  height: 24rpx;
  margin-left: 10rpx;
}

/* 标题与文字 */
.title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-top: 60rpx;
}
.subtitle {
  font-size: 26rpx;
  opacity: 0.8;
  margin-top: 10rpx;
  display: block;
}

/* 铃铛图片 */
.bell-icon {
  position: absolute;
  right: 40rpx;
  top: 130rpx;
  width: 40rpx;
  height: 40rpx;
}

/* 功能卡片 */
.cards-container { padding: 0 30rpx; margin-top: -40rpx; position: relative; z-index: 10; }

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}
.card-left { flex-shrink: 0; }
.card-icon-img { width: 100rpx; height: 100rpx; border-radius: 20rpx; }

.card-center {
  flex: 1;
  margin-left: 20rpx;
  margin-right: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-title-row { display: flex; align-items: center; margin-bottom: 8rpx; }
.card-title { font-size: 32rpx; font-weight: bold; color: #333; }
.tag { font-size: 20rpx; padding: 2rpx 10rpx; border-radius: 8rpx; margin-left: 10rpx; }
.tag-ai { background: #ccfbf1; color: #0d9488; }
.tag-job { background: #e0e7ff; color: #4f46e5; }
.card-desc { font-size: 24rpx; color: #666; display: block; line-height: 1.4; }

.action-text {
  font-size: 30rpx;
  color: #4f6bff;
  font-weight: bold;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 求职锦囊 */
.section-title {
  display: flex;
  align-items: center;
  padding: 30rpx 40rpx 10rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.section-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 12rpx;
}

.tips-container { display: flex; justify-content: space-between; padding: 0 30rpx; }
.tip-item {
  background: #fff; width: 30%; border-radius: 16rpx; padding: 30rpx 0;
  display: flex; flex-direction: column; align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.03);
}
.tip-icon-img { width: 60rpx; height: 60rpx; margin-bottom: 10rpx; }
.tip-name { font-size: 26rpx; font-weight: bold; color: #333; }
.tip-desc { font-size: 20rpx; color: #999; margin-top: 5rpx; }

/* 底部导航栏 */
.custom-tabbar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1rpx solid #eee;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  z-index: 9999;
}
.tab-item { display: flex; flex-direction: column; align-items: center; font-size: 24rpx; color: #999; }
.tab-item.active { color: #4f6bff; }
.tab-icon-img { width: 48rpx; height: 48rpx; margin-bottom: 4rpx; }
</style>
