<template>
	<view> 
		<uni-status-bar bgcolor="transparent"></uni-status-bar>
		<uni-nav-bar leftIcon="back" color="#ffffff" :fixed="true" @click-left="clickleft"  backgroundColor="transparent" :border="false">
			<view class="leftIcon" slot="left" @tap.stop="clickleft">
				<!-- #ifdef APP-PLUS -->
				<i class="icon iconfont icon-arrow-left" ></i>
				<!-- #endif -->
			</view>		
		</uni-nav-bar>
		<image src="../../static/imgs/new-register-bg.png" mode="widthFix" lazy-load class="new-register-bg"></image>
		<view class="register-content">
			<view class="register-content-title">
				重置密码
			</view>
			<view class="register-content-view">
				<view class="input-view">
					<image src="../../static/imgs/register-icon-01.png" mode="widthFix" lazy-load></image>
					<input type="text" placeholder="请设置您的钱包密码">
				</view>
				<view class="input-view">
					<image src="../../static/imgs/register-icon-02.png" mode="widthFix" lazy-load></image>
					<input type="text" placeholder="请再次输入您的钱包密码">
				</view>
			</view>
		</view>
		<view class="register-bottom-btn">
			<button type="default">确定</button>
		</view>
	</view>
</template>

<script>
	// import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue';
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components:{
			uniStatusBar
		},
		data() {
			return {
				
			};
		},
		methods:{
			forgester(){
				uni.navigateTo({
					url:'/pages/new-login/forget-loginpwd'
				})
			},
			register(){
				uni.navigateTo({
					url:'/pages/new-login/new-register'
				})
			},
			clickleft(){
				console.log('11');
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.leftIcon{
		padding-left: 30upx;
		line-height: 88upx;
		.iconfont{
			display: block;
			line-height: 88upx;
		}
	}
.new-register-bg{
	position: fixed;
	left: 0;
	top: 0;
	z-index: -1;
	width: 750upx;
	height: 417upx;
}
.to-register{
	margin-top: 120upx;
	text-align: center;
	font-size: 30upx;
	text{
		color: #007DFF;
	}
}
.forget-pwd{
	padding: 40upx 30upx 60upx;
	text-align: right;
	color: #007DFF;
	font-size: 30upx;
}
.register-bottom-btn{
	width: 690upx;
	margin: 0 auto;
	button{
		width: 690upx;
		height: 88upx;
		line-height: 88upx;
		background-color: #D1D1D1;
		color: #FFFFFF;
	}
}
.register-content{
	padding: 0 30upx;
	.register-content-title{
		font-size: 54upx;
		font-weight: bold;
		color: #FFFFFF;
		margin-bottom: 40upx;
	}
	.register-content-view{
		background-color: #FFFFFF;
		border-radius: 20upx;
		padding: 80upx 30upx;
		box-shadow: 2upx 5upx 20upx #f5f7fa;
		.input-view{
			line-height: 92upx;
			height: 92upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 25upx;
			background-color: #F9F9F9;
			border-radius: 46upx;
			margin-bottom: 40upx;
			image{
				width: 50upx;
				height: 50upx;
				flex-shrink: 0;
				margin-right: 23upx;
			}
			input{
				flex: 1;
				line-height: 92upx;
				height: 92upx;
			}
		}
	}
}
</style>
