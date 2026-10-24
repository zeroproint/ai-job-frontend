<template>
  <view class="phone-shell">

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
        <text class="nav-title">筛选</text>
        <image class="nav-icon" src="/static/shaixuan.png" mode="aspectFit" @click="clearAll"></image>
      </view>
    </view>

    <!-- 左分类 + 右选项（右侧一次性展示全部分组，整体上下滚动） -->
    <view class="body">
      <!-- 左侧分类导航：点击跳到对应分组 -->
      <view class="sidebar">
        <view
          class="cat-item"
          :class="{ 'cat-active': cat.key === activeKey }"
          v-for="cat in categories"
          :key="cat.key"
          @click="scrollToSection(cat.key)"
        >
          <view class="cat-bar"></view>
          <image class="cat-icon" :src="cat.icon" mode="aspectFit"></image>
          <text class="cat-name">{{ cat.name }}</text>
        </view>
      </view>

      <!-- 右侧选项 -->
      <scroll-view
        class="options"
        scroll-y
        :scroll-into-view="scrollTarget"
        :scroll-with-animation="true"
        @scroll="onOptionsScroll"
      >
        <view
          class="options-section"
          v-for="cat in categories"
          :key="cat.key"
          :id="'section-' + cat.key"
        >
          <view class="options-title">
            <image class="options-icon" :src="cat.icon" mode="aspectFit"></image>
            <text>{{ cat.title }}</text>
          </view>

          <view class="option-grid">
            <view
              class="option-chip"
              :class="{ 'chip-active': isSelected(cat.key, option) }"
              v-for="option in cat.options"
              :key="option"
              @click="selectOption(cat.key, option)"
            >
              <text>{{ option }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 底部固定操作栏 -->
    <view class="bottom-bar">
      <view class="clear-btn" @click="clearAll">
        <text class="btn-icon">✕</text>
        <text>清除</text>
      </view>
      <view class="confirm-btn" @click="confirmFilter">
        <text class="btn-icon">✓</text>
        <text>确定</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'

const categories = [
  {
    key: 'education',
    name: '学历',
    icon: '/static/xueye.png',
    title: '学历要求',
    options: ['不限', '初中及以下', '中专/中技', '高中', '大专', '本科', '硕士', '博士']
  },
  {
    key: 'salary',
    name: '薪资',
    icon: '/static/pipeidu.png',
    title: '薪资范围',
    options: ['不限', '3K 以下', '3-5K', '5-10K', '10-20K', '20-50K', '50K 以上']
  },
  {
    key: 'experience',
    name: '经验',
    icon: '/static/shichang.png',
    title: '工作经验',
    options: ['不限', '在校生', '应届生', '1 年以内', '1-3 年', '3-5 年', '5-10 年', '10 年以上']
  },
  {
    key: 'size',
    name: '公司规模',
    icon: '/static/gongsi.png',
    title: '公司规模',
    options: ['不限', '0-20 人', '20-99 人', '100-499 人', '500-999 人', '1000-9999 人', '10000 人以上']
  },
  {
    key: 'financing',
    name: '融资',
    icon: '/static/fazhanqianjing.png',
    title: '融资阶段',
    options: ['不限', '未融资', '天使轮', 'A 轮', 'B 轮', 'C 轮', 'D 轮及以上', '已上市', '不需要融资']
  }
]

const activeKey = ref('education')
const scrollTarget = ref('')
// 各分组相对滚动内容顶部的偏移，用于滚动时反向高亮左侧分类
const sectionTops = ref([])

// 每个分类单选，初始均为「不限」
const selectedMap = ref(
  categories.reduce((acc, cat) => {
    acc[cat.key] = ['不限']
    return acc
  }, {})
)

const isSelected = (key, option) => selectedMap.value[key].includes(option)

const selectOption = (key, option) => {
  selectedMap.value[key] = [option]
}

const scrollToSection = (key) => {
  activeKey.value = key
  // scroll-into-view 只在值变化时生效，先清空再赋值，保证重复点击同一分类也能定位
  scrollTarget.value = ''
  nextTick(() => {
    scrollTarget.value = `section-${key}`
  })
}

// 分组高度是固定的，挂载后量一次即可
const measureSections = () => {
  const query = uni.createSelectorQuery()
  query.selectAll('.options-section').boundingClientRect()
  query.select('.options').boundingClientRect()
  query.select('.options').scrollOffset()
  query.exec((res) => {
    const rects = res[0] || []
    const container = res[1]
    const offset = res[2]
    if (!rects.length || !container || !offset) return
    sectionTops.value = rects.map(r => r.top - container.top + offset.scrollTop)
  })
}

onMounted(() => {
  nextTick(measureSections)
})

const onOptionsScroll = (e) => {
  // 未量到偏移时不做反高亮，避免误把第一个分类点亮
  if (!sectionTops.value.length) return
  const top = e.detail.scrollTop
  let idx = 0
  sectionTops.value.forEach((offsetTop, i) => {
    if (top >= offsetTop - 10) idx = i
  })
  activeKey.value = categories[idx].key
}

const clearAll = () => {
  categories.forEach(cat => {
    selectedMap.value[cat.key] = ['不限']
  })
  uni.showToast({ title: '已清除筛选条件', icon: 'none' })
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

const confirmFilter = () => {
  const result = {}
  categories.forEach(cat => {
    result[cat.key] = selectedMap.value[cat.key].slice()
  })
  uni.$emit('filterConfirmed', result)
  uni.showToast({ title: '筛选已应用', icon: 'none' })
  // 等提示显示完再返回，否则 toast 会随页面一起被销毁
  setTimeout(() => {
    if (getCurrentPages().length > 1) {
      uni.navigateBack()
    }
  }, 800)
}
</script>

<style scoped>
/* 手机壳内纵向 flex：头部/底部固定，中间区域自适应 */
.phone-shell {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* 顶部区域（浅色底，状态栏白图标需转深色） */
.header-bg {
  flex-shrink: 0;
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

/* 主体：左分类 + 右选项 */
.body {
  flex: 1;
  min-height: 0;
  display: flex;
}

/* 左侧分类导航 */
.sidebar {
  width: 200rpx;
  flex-shrink: 0;
  background-color: #f5f6fa;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.sidebar::-webkit-scrollbar {
  display: none;
}
.cat-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0 30rpx 20rpx;
}
.cat-bar {
  width: 6rpx;
  height: 36rpx;
  border-radius: 3rpx;
  background-color: transparent;
  flex-shrink: 0;
  margin-right: 12rpx;
}
.cat-active .cat-bar {
  background-color: #4f6bff;
}
.cat-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
  flex-shrink: 0;
}
.cat-name {
  font-size: 26rpx;
  color: #666;
}
.cat-active .cat-name {
  color: #4f6bff;
  font-weight: bold;
}

/* 右侧选项：scroll-view 需要确定高度才能滚动 */
.options {
  flex: 1;
  min-width: 0;
  height: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding: 30rpx 30rpx 0;
}
.options-section {
  padding-bottom: 40rpx;
  margin-bottom: 10rpx;
  border-bottom: 1rpx solid #f5f6fa;
}
.options-section:last-child {
  border-bottom: none;
}
.options-title {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}
.options-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 12rpx;
  flex-shrink: 0;
}
.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.option-chip {
  height: 64rpx;
  padding: 0 24rpx;
  border-radius: 32rpx;
  background-color: #f0f2f5;
  color: #666;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 预留边框，避免选中时尺寸跳动 */
  border: 2rpx solid transparent;
  box-sizing: border-box;
}
.chip-active {
  background-color: #eef2ff;
  border-color: #4f6bff;
  color: #4f6bff;
  font-weight: bold;
}

/* 底部固定操作栏 */
.bottom-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
}
.clear-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  background-color: #f0f2f5;
  color: #666;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.confirm-btn {
  flex: 2;
  height: 80rpx;
  border-radius: 40rpx;
  background: linear-gradient(135deg, #4f6bff, #6a82fb);
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 16rpx rgba(79, 107, 255, 0.3);
}
.btn-icon {
  font-size: 26rpx;
  margin-right: 8rpx;
  line-height: 1;
}
</style>
