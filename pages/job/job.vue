<template>
  <view class="phone-shell">
    <view class="page-container">

      <!-- 顶部（白色背景） -->
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

        <!-- 自定义导航栏 -->
        <view class="nav-bar">
          <image class="nav-icon" src="/static/jiantou-1.png" mode="aspectFit" @click="goHome"></image>
          <text class="nav-title">求职</text>
          <image class="nav-icon" src="/static/sousuo.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 搜索与筛选 -->
      <view class="search-section">
        <view class="search-box">
          <image class="search-icon-inner" src="/static/sousuo.png" mode="aspectFit"></image>
          <input
            class="search-input"
            v-model="keyword"
            placeholder="搜索职位"
            confirm-type="search"
          />
        </view>
        <view class="filter-icon-box" @click="goFilter">
          <image class="filter-icon" src="/static/shaixuan.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 快捷标签：点击后按关键词查询 -->
      <view class="tags-row">
        <text
          class="tag-item"
          v-for="tag in quickTags"
          :key="tag"
          :class="{ active: activeTag === tag }"
          @click="selectTag(tag)"
        >{{ tag }}</text>
      </view>

      <!-- 筛选下拉 -->
      <view class="dropdown-row">
        <view class="dropdown-item" @click="goAreaSelect">
          <image class="dropdown-icon" src="/static/dingwei-1.png" mode="aspectFit"></image>
          <text>{{ areaLabel }}</text>
          <image class="dropdown-arrow" src="/static/xiabiao.png" mode="aspectFit"></image>
        </view>
        <view class="dropdown-item" @click="goFilter">
          <image class="dropdown-icon" src="/static/shaixuan.png" mode="aspectFit"></image>
          <text>{{ filterLabel }}</text>
          <image class="dropdown-arrow" src="/static/xiabiao.png" mode="aspectFit"></image>
        </view>
      </view>

      <!-- 职位列表 -->
      <view class="job-list">
        <view class="job-card" v-for="item in jobList" :key="item.id" @click="goToJobDetail(item)">
          <view class="job-header">
            <text class="job-name">{{ item.name }}</text>
            <text class="job-salary">{{ item.salary }}</text>
          </view>
          <view class="job-company">{{ item.company }} | {{ item.size }}</view>
          <view class="job-tags">
            <text class="job-tag" v-for="(tag, tIndex) in item.tags" :key="tIndex">{{ tag }}</text>
          </view>
          <view class="job-footer">
            <view class="job-location">
              <image class="location-icon" src="/static/dingwei-1.png" mode="aspectFit"></image>
              <text>{{ item.location }}</text>
            </view>
            <text class="job-require">{{ item.education }} · {{ item.experience }}</text>
          </view>
        </view>

        <view class="empty-tip" v-if="loading">职位加载中...</view>
        <view class="empty-tip" v-else-if="loadError" @click="loadJobs">{{ loadError }}（点击重试）</view>
        <view class="empty-tip" v-else-if="jobList.length === 0">没有找到相关职位</view>
      </view>

      <!-- 底部导航栏 -->
      <view class="custom-tabbar">
        <view class="tab-item" @click="switchTab(0, '/pages/index/index')">
          <image class="tab-icon-img" src="/static/shouye_weixuanzhong.png" mode="aspectFit"></image>
          <text class="tab-text">首页</text>
        </view>
        <view class="tab-item active" @click="switchTab(1, '/pages/job/job')">
          <image class="tab-icon-img" src="/static/qiuzhi_xuanzhong.png" mode="aspectFit"></image>
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { get } from '../../utils/request'

const keyword = ref('')
const areaLabel = ref('区域选择')
const filterLabel = ref('筛选')

const quickTags = ['Java', '前端', '嵌入式', '网络', '安全', '测试']
const activeTag = ref('')

const jobList = ref([])
const loading = ref(false)
const loadError = ref('')

// 区域 + 筛选页的已选条件；空字符串表示不限
const areaFilter = ref('')
const filters = ref({
  education: '',
  salary: '',
  experience: '',
  size: '',
  financing: ''
})

// 薪资标签 → 数值区间（K）；开区间只传一侧
const SALARY_RANGE_MAP = {
  '3K 以下': { max: 3 },
  '3-5K': { min: 3, max: 5 },
  '5-10K': { min: 5, max: 10 },
  '10-20K': { min: 10, max: 20 },
  '20-50K': { min: 20, max: 50 },
  '50K 以上': { min: 50 }
}

let requestSeq = 0
let searchTimer = null

const buildParams = () => {
  const params = {}
  const kw = keyword.value.trim()
  if (kw) params.keyword = kw
  if (areaFilter.value) params.location = areaFilter.value

  ;['education', 'experience', 'size', 'financing'].forEach((key) => {
    if (filters.value[key]) params[key] = filters.value[key]
  })

  const range = SALARY_RANGE_MAP[filters.value.salary]
  if (range) {
    if (range.min != null) params.salaryMin = range.min
    if (range.max != null) params.salaryMax = range.max
  }
  return params
}

const mapJob = (item) => ({
  id: item.id,
  name: item.name,
  salary: item.salary,
  company: item.company,
  size: item.companySize,
  // 后端 tags 是逗号分隔字符串，这里拆成数组供标签渲染
  tags: String(item.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean),
  location: item.location,
  education: item.education,
  experience: item.experience
})

const loadJobs = async () => {
  // 快速输入时只保留最后一次请求的结果
  const seq = ++requestSeq
  loading.value = true
  loadError.value = ''
  try {
    const list = await get('/api/job/list', buildParams())
    if (seq !== requestSeq) return
    jobList.value = (list || []).map(mapJob)
  } catch (e) {
    if (seq !== requestSeq) return
    loadError.value = e.message || '职位加载失败'
    uni.showToast({ title: loadError.value, icon: 'none', duration: 3000 })
  } finally {
    if (seq === requestSeq) loading.value = false
  }
}

// 每次进入求职页都按当前条件重新查询
onShow(loadJobs)

// 输入关键词后 300ms 自动查询
watch(keyword, () => {
  if (activeTag.value && keyword.value.trim() !== activeTag.value) {
    activeTag.value = ''
  }
  clearTimeout(searchTimer)
  searchTimer = setTimeout(loadJobs, 300)
})

const selectTag = (tag) => {
  if (activeTag.value === tag) {
    activeTag.value = ''
    keyword.value = ''
  } else {
    activeTag.value = tag
    keyword.value = tag
  }
}

const goToJobDetail = (item) => {
  // 查询中列表可能还是上一批结果，避免点进与筛选条件不符的职位
  if (loading.value) return
  const query = [
    `id=${item.id}`,
    `name=${encodeURIComponent(item.name)}`,
    `salary=${encodeURIComponent(item.salary)}`,
    `company=${encodeURIComponent(item.company)}`,
    `location=${encodeURIComponent(item.location)}`,
    `education=${encodeURIComponent(item.education || '')}`,
    `experience=${encodeURIComponent(item.experience || '')}`,
    `companySize=${encodeURIComponent(item.size || '')}`,
    `tags=${encodeURIComponent((item.tags || []).join(','))}`
  ].join('&')
  uni.navigateTo({ url: `/pages/jobDetail/jobDetail?${query}` })
}
const switchTab = (index, url) => {
  uni.reLaunch({ url })
}
// 求职与首页同为 tab 页，用 reLaunch 而非 navigateBack
const goHome = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}

const goAreaSelect = () => {
  uni.navigateTo({ url: '/pages/area/area' })
}

const goFilter = () => {
  uni.navigateTo({ url: '/pages/filter/filter' })
}

// 区域选择页回传 { label, location }；兼容旧版只传字符串的情况
const onAreaSelected = (payload) => {
  if (!payload) return
  if (typeof payload === 'string') {
    areaLabel.value = payload
    areaFilter.value = payload === '不限' ? '' : payload
    return
  }
  areaLabel.value = payload.label || '区域选择'
  areaFilter.value = payload.location || ''
}

// 筛选页回传 { education: ['大专'], salary: ['20-50K'], ... }
const onFilterConfirmed = (result) => {
  const pick = (list) => {
    if (!Array.isArray(list)) return ''
    return list.find((item) => item && item !== '不限') || ''
  }
  filters.value = {
    education: pick(result && result.education),
    salary: pick(result && result.salary),
    experience: pick(result && result.experience),
    size: pick(result && result.size),
    financing: pick(result && result.financing)
  }
  const count = Object.values(filters.value).filter(Boolean).length
  filterLabel.value = count ? `筛选 (${count})` : '筛选'
  // 返回求职页时 onShow 会按新条件重新查询
}

onMounted(() => {
  uni.$on('areaSelected', onAreaSelected)
  uni.$on('filterConfirmed', onFilterConfirmed)
})

// 页面销毁时移除监听，避免重复注册
onUnmounted(() => {
  clearTimeout(searchTimer)
  uni.$off('areaSelected', onAreaSelected)
  uni.$off('filterConfirmed', onFilterConfirmed)
})
</script>

<style scoped>
/* 手机壳内做纵向 flex 布局，让内容区成为「有确定高度」的滚动容器。
   原来只写 height:100%，一旦该百分比解析不出确定高度，overflow-y:auto 就不生效，
   超长内容会被 .phone-shell 的 overflow:hidden 直接裁掉且无法滚动。
   padding-bottom 需大于底部 tabbar 的 100rpx，否则最后一张卡片会被压在导航栏下面。 */
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

/* 顶部背景（白色） */
.header-bg {
  background: #fff;
  padding: 20rpx 30rpx 0;
}

/* 状态栏（求职页用深色） */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #333; /* 深色文字 */
}
.status-icon {
  width: 32rpx;
  height: 24rpx;
  margin-left: 10rpx;
  filter: brightness(0.2); /* 让白色图标变深 */
}

/* 自定义导航栏 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}
.nav-title { font-size: 34rpx; font-weight: bold; }
.nav-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 搜索与筛选 */
.search-section {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
}
.search-box {
  flex: 1;
  background: #f0f2f5;
  border-radius: 30rpx;
  padding: 15rpx 20rpx;
  display: flex;
  align-items: center;
}
.search-icon-inner {
  width: 28rpx;
  height: 28rpx;
  margin-right: 10rpx;
}
.search-input { flex: 1; font-size: 26rpx; }
.empty-tip { text-align: center; font-size: 26rpx; color: #999; padding: 60rpx 0; }
.filter-icon-box {
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.filter-icon {
  width: 40rpx;
  height: 40rpx;
}

/* 快捷标签 */
.tags-row {
  display: flex;
  padding: 10rpx 30rpx 20rpx;
  background: #fff;
  overflow-x: auto;
  white-space: nowrap;
}
.tag-item {
  font-size: 24rpx;
  padding: 10rpx 24rpx;
  background: #f0f2f5;
  color: #666;
  border-radius: 12rpx;
  margin-right: 15rpx;
}
.tag-item.active {
  background: #e0e7ff;
  color: #4f6bff;
  font-weight: bold;
}

/* 筛选下拉 */
.dropdown-row {
  display: flex;
  padding: 20rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}
.dropdown-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #4f6bff;
  margin-right: 40rpx;
  background: #eef2ff;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
}
.dropdown-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 8rpx;
}
.dropdown-arrow {
  width: 20rpx;
  height: 20rpx;
  margin-left: 8rpx;
}

/* 职位列表 */
.job-list { padding: 20rpx 30rpx; }
.job-card { background: #fff; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03); }
.job-header { display: flex; justify-content: space-between; margin-bottom: 15rpx; }
.job-name { font-size: 32rpx; font-weight: bold; color: #333; }
.job-salary { font-size: 30rpx; color: #4f6bff; font-weight: bold; }
.job-company { font-size: 24rpx; color: #666; margin-bottom: 15rpx; }
.job-tags { display: flex; flex-wrap: wrap; margin-bottom: 15rpx; }
.job-tag { font-size: 20rpx; background: #f5f6fa; color: #666; padding: 4rpx 12rpx; border-radius: 8rpx; margin-right: 10rpx; margin-bottom: 10rpx; }

/* 职位地点与学历/经验 */
.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.job-location {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #999;
}
.location-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 6rpx;
}
.job-require {
  flex-shrink: 0;
  margin-left: 12rpx;
  font-size: 22rpx;
  color: #999;
}

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
