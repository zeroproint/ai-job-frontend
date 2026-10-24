<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 网页背景 */
	page {
		background-color: #e0e0e0;
		height: 100%;
	}

	/* 全局手机外壳样式（所有页面共用） */
	.phone-shell {
		width: 375px;
		height: 812px;
		background-color: #f5f6fa;
		border-radius: 40px;
		border: 12px solid #222;
		box-shadow: 0 20px 50px rgba(0,0,0,0.3);
		overflow: hidden; /* 让内部滚动，外壳不滚 */
		margin: 40px auto;
		position: relative;
		transform: scale(0.85); /* 👈 缩小手机壳，解决“太大”的问题 */
		transform-origin: top center;
	}

	/* 全局底部导航栏样式（所有页面共用） */
	.custom-tabbar {
		position: absolute; /* 绝对定位，贴在手机壳底部 */
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-top: 1rpx solid #eee;
		border-bottom-left-radius: 28px;
		border-bottom-right-radius: 28px;
		z-index: 9999;
	}
	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}
	.tab-item.active {
		color: #4f6bff;
	}
	.tab-icon-img {
		width: 48rpx;
		height: 48rpx;
		margin-bottom: 4rpx;
	}
</style>
