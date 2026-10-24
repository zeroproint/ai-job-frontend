<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 状态栏 + 导航栏 + 搜索 + 城市 Tab（白色底 → 白色图标需转深色） -->
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
          <text class="nav-title">区域选择</text>
          <image class="nav-icon" src="/static/dingwei-1.png" mode="aspectFit" @click="handleLocate"></image>
        </view>

        <!-- 搜索框 -->
        <view class="search-box">
          <image class="search-icon" src="/static/sousuo.png" mode="aspectFit"></image>
          <input
            class="search-input"
            v-model="keyword"
            placeholder="搜索城市"
            confirm-type="search"
          />
        </view>

        <!-- 城市 Tab -->
        <view class="city-tabs">
          <view
            class="city-tab"
            :class="{ 'tab-active': city === activeCity }"
            v-for="city in cities"
            :key="city"
            @click="switchCity(city)"
          >
            <text class="tab-text">{{ city }}</text>
            <view class="tab-line" v-if="city === activeCity"></view>
          </view>
        </view>
      </view>

      <!-- 区县列表 -->
      <view class="section-card">
        <!-- 当前城市 -->
        <view class="region-row" @click="selectRegion(`${activeCity}市`)">
          <image class="row-icon" src="/static/dingwei-1.png" mode="aspectFit"></image>
          <text class="row-name" :class="{ 'name-active': selectedRegion === `${activeCity}市` }">
            {{ activeCity }}市
          </text>
          <view class="row-check" v-if="selectedRegion === `${activeCity}市`">
            <text>✓</text>
          </view>
        </view>

        <!-- 不限 -->
        <view class="region-row" @click="selectRegion('不限')">
          <view class="row-check" :class="{ 'check-on': selectedRegion === '不限' }">
            <text v-if="selectedRegion === '不限'">✓</text>
          </view>
          <text class="row-name" :class="{ 'name-active': selectedRegion === '不限' }">不限</text>
          <text class="row-tag">全市</text>
        </view>

        <!-- 区县 -->
        <view
          class="region-row"
          v-for="item in filteredDistricts"
          :key="item.name"
          @click="selectRegion(item.name)"
        >
          <image class="row-icon" src="/static/dingwei-1.png" mode="aspectFit"></image>
          <text class="row-name" :class="{ 'name-active': selectedRegion === item.name }">
            {{ item.name }}
          </text>
          <text class="row-tag">{{ item.tag }}</text>
          <text class="row-arrow">></text>
        </view>

        <view class="empty-tip" v-if="filteredDistricts.length === 0">
          <text>没有匹配的区县</text>
        </view>
      </view>

      <!-- 其他热门城市 -->
      <view class="section-card">
        <view class="card-title">
          <image class="title-icon" src="/static/dingwei-1.png" mode="aspectFit"></image>
          <text>其他热门城市</text>
        </view>

        <view
          class="region-row"
          v-for="item in filteredHotCities"
          :key="item"
          @click="selectRegion(item)"
        >
          <image class="row-icon" src="/static/dingwei-1.png" mode="aspectFit"></image>
          <text class="row-name" :class="{ 'name-active': selectedRegion === item }">{{ item }}</text>
          <text class="row-tag">不限</text>
        </view>
      </view>

    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const cities = ['北京', '上海', '深圳']
const activeCity = ref('北京')
const keyword = ref('')
const selectedRegion = ref('不限')

// 各区县及其特征标签
const cityDistricts = {
  北京: [
    { name: '海淀区', tag: '互联网' },
    { name: '朝阳区', tag: 'CBD' },
    { name: '东城区', tag: '老城区' },
    { name: '西城区', tag: '金融街' },
    { name: '丰台区', tag: '总部基地' },
    { name: '石景山区', tag: '科技园' }
  ],
  上海: [
    { name: '浦东新区', tag: '金融中心' },
    { name: '徐汇区', tag: '漕河泾' },
    { name: '静安区', tag: '商圈' },
    { name: '黄浦区', tag: '老城区' },
    { name: '长宁区', tag: '临空园区' }
  ],
  深圳: [
    { name: '南山区', tag: '科技园' },
    { name: '福田区', tag: 'CBD' },
    { name: '罗湖区', tag: '老城区' },
    { name: '宝安区', tag: '制造基地' },
    { name: '龙岗区', tag: '产业园' }
  ]
}

const hotCities = ['上海市', '广州市', '深圳市', '杭州市', '成都市', '南京市', '武汉市']

const filteredDistricts = computed(() => {
  const kw = keyword.value.trim()
  const list = cityDistricts[activeCity.value] || []
  if (!kw) return list
  return list.filter(i => i.name.includes(kw) || i.tag.includes(kw))
})

const filteredHotCities = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return hotCities
  return hotCities.filter(c => c.includes(kw))
})

const switchCity = (city) => {
  activeCity.value = city
  // 切换城市后原选中区域已不属于该城市，重置为「不限」
  selectedRegion.value = '不限'
  keyword.value = ''
}

const handleBack = () => {
  // 从「求职」页 navigateTo 进来时正常退栈返回；
  // 直接从路由打开本页时栈内只有本页，navigateBack 会失败，回退到「求职」页兜底。
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/job/job' })
  }
}

const handleLocate = () => {
  uni.showToast({ title: '已定位到当前城市', icon: 'none' })
}

const selectRegion = (name) => {
  selectedRegion.value = name

  // 供「求职」页监听：label 用于按钮回显，location 用于后端地点前缀匹配
  let payload
  if (name === '不限') {
    payload = { label: '区域选择', location: '' }
  } else if (name.endsWith('市')) {
    // 整市：北京市 → 北京
    payload = { label: name, location: name.replace(/市$/, '') }
  } else {
    // 区县：转成职位数据中的「城市·区域」格式，如 海淀区 → 北京·海淀、浦东新区 → 上海·浦东
    payload = {
      label: `${activeCity.value}·${name}`,
      location: `${activeCity.value}·${name.replace(/(新区|区)$/, '')}`
    }
  }
  uni.$emit('areaSelected', payload)

  // 有上一页则带着结果返回；直接打开本页时留在原地，便于查看选中效果
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.showToast({ title: `已选择：${payload.label}`, icon: 'none' })
  }
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

/* 顶部白色区域 */
.header-bg {
  background-color: #fff;
  padding: 20rpx 30rpx 0;
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

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  height: 76rpx;
  margin-top: 24rpx;
  padding: 0 24rpx;
  border-radius: 38rpx;
  background-color: #f0f2f5;
}
.search-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

/* 城市 Tab */
.city-tabs {
  display: flex;
  margin-top: 12rpx;
}
.city-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 48rpx;
  padding: 20rpx 0 0;
}
.tab-text {
  font-size: 28rpx;
  color: #666;
  padding-bottom: 14rpx;
}
.tab-active .tab-text {
  color: #4f6bff;
  font-weight: bold;
}
.tab-line {
  width: 48rpx;
  height: 6rpx;
  border-radius: 3rpx;
  background-color: #4f6bff;
}

/* 区块卡片 */
.section-card {
  background-color: #fff;
  margin: 20rpx 30rpx 20rpx;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
}
.card-title {
  display: flex;
  align-items: center;
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.title-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}

/* 区域行 */
.region-row {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f6fa;
}
.region-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.row-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}
.row-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.name-active {
  color: #4f6bff;
  font-weight: bold;
}
.row-check {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 2rpx solid #ccc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16rpx;
  font-size: 20rpx;
  font-weight: bold;
  color: #fff;
}
.check-on {
  background-color: #4f6bff;
  border-color: #4f6bff;
}
.row-tag {
  flex-shrink: 0;
  font-size: 22rpx;
  color: #999;
  background-color: #f0f2f5;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
  margin-left: 12rpx;
}
.row-arrow {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #ccc;
  margin-left: 12rpx;
}
.empty-tip {
  padding: 30rpx 0 10rpx;
  text-align: center;
  font-size: 26rpx;
  color: #999;
}
</style>
