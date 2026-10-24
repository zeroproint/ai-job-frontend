<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 头部渐变与个人信息 -->
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

        <!-- 导航栏 -->
        <view class="nav-bar">
          <image class="nav-icon" src="/static/jiantou.png" mode="aspectFit"></image>
          <text class="nav-title">我的</text>
          <image class="nav-icon" src="/static/shezhi-1.png" mode="aspectFit"></image>
        </view>

        <view class="user-info">
          <view class="avatar">张</view>
          <view class="user-text">
            <text class="user-name">张三</text>
            <text class="user-id">学号: 202401001</text>
            <view class="edit-btn" @click="goToProfile">
              <image class="edit-icon" src="/static/bianji.png" mode="aspectFit"></image>
              <text>编辑</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 快捷入口 -->
      <view class="quick-actions">
        <view class="action-card" @click="goToInterviewReport">
          <view class="action-left">
            <image class="action-icon-img" src="/static/mianshibaogao.png" mode="aspectFit"></image>
          </view>
          <view class="action-text">
            <text class="action-title">面试报告</text>
            <text class="action-desc">查看面试记录</text>
          </view>
        </view>
        <view class="action-card" @click="goToMatchReport">
          <view class="action-left">
            <image class="action-icon-img" src="/static/jianlizhiweibaogao.png" mode="aspectFit"></image>
          </view>
          <view class="action-text">
            <text class="action-title">简历职位报告</text>
            <text class="action-desc">匹配度分析</text>
          </view>
        </view>
      </view>

      <!-- 功能入口 -->
      <view class="section-box">
        <view class="section-title">
          <image class="section-icon" src="/static/gongneng.png" mode="aspectFit"></image>
          <text>功能入口</text>
        </view>
        <view class="grid-container">
          <view class="grid-item">
            <image class="grid-icon-img" src="/static/tiaokuanxieyi.png" mode="aspectFit"></image>
            <text>条款协议</text>
          </view>
          <view class="grid-item">
            <image class="grid-icon-img" src="/static/yijianfankui.png" mode="aspectFit"></image>
            <text>意见反馈</text>
          </view>
          <view class="grid-item">
            <image class="grid-icon-img" src="/static/shezhi.png" mode="aspectFit"></image>
            <text>设置</text>
          </view>
          <view class="grid-item">
            <image class="grid-icon-img" src="/static/guanyuwomen.png" mode="aspectFit"></image>
            <text>关于我们</text>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="logout-btn" @click="handleLogout">
        退出登录
      </view>

      <!-- 底部导航栏 -->
      <view class="custom-tabbar">
        <view class="tab-item" @click="switchTab(0, '/pages/index/index')">
          <image class="tab-icon-img" src="/static/shouye_weixuanzhong.png" mode="aspectFit"></image>
          <text class="tab-text">首页</text>
        </view>
        <view class="tab-item" @click="switchTab(1, '/pages/job/job')">
          <image class="tab-icon-img" src="/static/qiuzhi_weixuanzhong.png" mode="aspectFit"></image>
          <text class="tab-text">求职</text>
        </view>
        <view class="tab-item active" @click="switchTab(2, '/pages/mine/mine')">
          <image class="tab-icon-img" src="/static/wode_xuanzhong.png" mode="aspectFit"></image>
          <text class="tab-text">我的</text>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
const goToInterviewReport = () => {
  uni.navigateTo({ url: '/pages/interview/interview' })
}
const goToProfile = () => {
  uni.navigateTo({ url: '/pages/profile/profile' })
}
const goToMatchReport = () => {
  uni.navigateTo({ url: '/pages/matchReport/matchReport' })
}
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出', icon: 'success' })
      }
    }
  })
}
const switchTab = (index, url) => {
  uni.reLaunch({ url })
}
</script>

<style scoped>
.page-container { background-color: #f5f6fa; height: 100%; overflow-y: auto; padding-bottom: 120rpx; }
.page-container::-webkit-scrollbar { display: none; }

/* 顶部渐变 */
.header-bg {
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  padding: 20rpx 40rpx 60rpx;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  color: #fff;
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
.status-icon {
  width: 32rpx;
  height: 24rpx;
  margin-left: 10rpx;
}

/* 导航栏 */
.nav-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40rpx; }
.nav-title { font-size: 34rpx; font-weight: bold; }
.nav-icon {
  width: 40rpx;
  height: 40rpx;
}

.user-info { display: flex; align-items: center; }
.avatar { width: 120rpx; height: 120rpx; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; justify-content: center; align-items: center; font-size: 50rpx; font-weight: bold; border: 4rpx solid rgba(255,255,255,0.5); }
.user-text { margin-left: 30rpx; }
.user-name { font-size: 40rpx; font-weight: bold; display: block; }
.user-id { font-size: 26rpx; opacity: 0.8; display: block; margin-top: 10rpx; }

/* 编辑按钮 */
.edit-btn {
  font-size: 22rpx;
  background: rgba(255,255,255,0.2);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  display: inline-flex;
  align-items: center;
  margin-top: 15rpx;
}
.edit-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 6rpx;
}

/* 快捷入口 */
.quick-actions { display: flex; justify-content: space-between; padding: 0 30rpx; margin-top: -40rpx; }
.action-card { background: #fff; width: 48%; border-radius: 16rpx; padding: 30rpx; display: flex; align-items: center; box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05); }
.action-left { flex-shrink: 0; }
.action-icon-img { width: 80rpx; height: 80rpx; border-radius: 16rpx; }
.action-text { margin-left: 20rpx; }
.action-title { font-size: 28rpx; font-weight: bold; color: #333; display: block; }
.action-desc { font-size: 22rpx; color: #999; margin-top: 5rpx; display: block; }

/* 功能入口 */
.section-box { background: #fff; margin: 30rpx; border-radius: 16rpx; padding: 30rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03); }
.section-title {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}
.section-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 12rpx;
}
.grid-container { display: flex; justify-content: space-between; }
.grid-item { display: flex; flex-direction: column; align-items: center; font-size: 24rpx; color: #666; }
.grid-icon-img { width: 60rpx; height: 60rpx; margin-bottom: 15rpx; }

.logout-btn { margin: 40rpx 30rpx; background: #fff; color: #ef4444; text-align: center; padding: 30rpx; border-radius: 16rpx; font-size: 32rpx; font-weight: bold; border: 2rpx solid #ef4444; }

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
