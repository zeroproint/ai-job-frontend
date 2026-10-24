<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 状态栏：图标为白色，故置于蓝色渐变背景上 -->
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

      <!-- 导航栏 -->
      <view class="nav-bar">
        <image class="nav-back" src="/static/jiantou-1.png" mode="aspectFit" @click="handleBack"></image>
        <text class="nav-title">个人信息</text>
        <text class="nav-save" @click="handleSave">保存</text>
      </view>

      <!-- 头像 -->
      <view class="card avatar-card">
        <image v-if="avatarUrl" class="avatar-img" :src="avatarUrl" mode="aspectFill"></image>
        <view v-else class="avatar">张</view>
        <view class="change-avatar" @click="chooseAvatar">
          <text>📷 更换头像</text>
        </view>
      </view>

      <!-- 信息表单 -->
      <view class="card form-card">
        <view class="form-row">
          <text class="label">昵称</text>
          <input class="input" v-model="formData.nickname" placeholder="请输入昵称" placeholder-class="placeholder" />
          <text class="arrow">›</text>
        </view>

        <view class="form-row">
          <text class="label">学号</text>
          <input class="input" v-model="formData.studentId" placeholder="请输入学号" placeholder-class="placeholder" />
          <text class="arrow">›</text>
        </view>

        <view class="form-row">
          <text class="label">性别</text>
          <picker class="picker-box" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
            <view class="picker-value">
              <text class="value">{{ formData.gender }}</text>
              <text class="arrow">›</text>
            </view>
          </picker>
        </view>

        <view class="form-row">
          <text class="label">手机号</text>
          <input class="input" v-model="formData.phone" placeholder="请输入手机号" placeholder-class="placeholder" />
          <text class="arrow">›</text>
        </view>

        <view class="form-row">
          <text class="label">邮箱</text>
          <input class="input" v-model="formData.email" placeholder="请输入邮箱" placeholder-class="placeholder" />
          <text class="arrow">›</text>
        </view>

        <view class="form-row">
          <text class="label">学校</text>
          <input class="input" v-model="formData.school" placeholder="请输入学校" placeholder-class="placeholder" />
          <text class="arrow">›</text>
        </view>

        <view class="form-row">
          <text class="label">专业</text>
          <input class="input" v-model="formData.major" placeholder="请输入专业" placeholder-class="placeholder" />
          <text class="arrow">›</text>
        </view>
      </view>

      <!-- 保存 -->
      <view class="save-btn" @click="handleSave">保存</view>

    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const genderOptions = ['男', '女']

const formData = ref({
  nickname: '张三',
  studentId: '202401001',
  gender: '男',
  phone: '138****8888',
  email: 'zhangsan@example.com',
  school: 'XX大学',
  major: '计算机科学与技术'
})

const avatarUrl = ref('')

const genderIndex = computed(() => Math.max(0, genderOptions.indexOf(formData.value.gender)))

onMounted(() => {
  const saved = uni.getStorageSync('userProfile')
  if (saved) formData.value = { ...formData.value, ...saved }
})

const onGenderChange = (e) => {
  formData.value.gender = genderOptions[e.detail.value]
}

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const path = res.tempFilePaths[0]
      avatarUrl.value = path
      uni.previewImage({ urls: [path], current: path })
    }
  })
}

const handleSave = () => {
  uni.setStorageSync('userProfile', formData.value)
  uni.showToast({ title: '保存成功', icon: 'success' })
  // 等提示显示完再跳回“我的”，否则页面被销毁、Toast 会被一起清掉
  setTimeout(() => {
    uni.reLaunch({ url: '/pages/mine/mine' })
  }, 1000)
}

const handleBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.page-container {
  background-color: #f5f6fa;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 40rpx;
}
.page-container::-webkit-scrollbar { display: none; }

/* 状态栏（白色图标 → 蓝色渐变底） */
.header-bg {
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  padding: 20rpx 40rpx 24rpx;
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

/* 导航栏（深色返回箭头 + 蓝色保存 → 浅色底） */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 40rpx;
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
.nav-save {
  font-size: 30rpx;
  color: #4f6bff;
}

/* 卡片 */
.card {
  background-color: #fff;
  margin: 0 30rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
}

/* 头像 */
.avatar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 30rpx;
}
.avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  color: #fff;
  font-size: 64rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}
.change-avatar {
  margin-top: 24rpx;
  background-color: #eef2ff;
  color: #4f6bff;
  font-size: 26rpx;
  padding: 12rpx 32rpx;
  border-radius: 30rpx;
}

/* 表单 */
.form-card {
  padding: 0 30rpx;
}
.form-row {
  display: flex;
  align-items: center;
  height: 100rpx;
  border-bottom: 1rpx solid #f0f2f5;
}
.form-row:last-child {
  border-bottom: none;
}
.label {
  width: 140rpx;
  font-size: 30rpx;
  color: #333;
  flex-shrink: 0;
}
.input {
  flex: 1;
  text-align: right;
  font-size: 30rpx;
  color: #333;
}
.placeholder {
  color: #bbb;
}
.value {
  font-size: 30rpx;
  color: #333;
}
.arrow {
  color: #ccc;
  font-size: 32rpx;
  margin-left: 12rpx;
}
.picker-box {
  flex: 1;
  height: 100%;
}
.picker-value {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 保存按钮 */
.save-btn {
  margin: 40rpx 30rpx 0;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 44rpx;
  box-shadow: 0 8rpx 20rpx rgba(79,107,255,0.3);
}
</style>
