<template>
	<view class="page">
		<view class="tips-content">
			<image src="../../static/imgs/mnemonic-tips.png" mode="widthFix" lazy-load></image>
			<view class="tips-title">
				<view><!-- {{i18n.Backup_tips}} -->备份提示</view>
				<text><!-- {{i18n.define_mnemo_tip3}} -->获得助记词等于拥有钱包资产所有权</text>
			</view>
			<view class="tips-con">
				<view class="tips-con-i">
					<!-- {{i18n.define_mnemo_tip1}} -->助记词由英文单词组成，请抄写并妥善保管
				</view>
				<view class="tips-con-i">
					<!-- {{i18n.define_mnemo_tip2}} -->助记词如丢失，无法找回，请务必备份助记词
				</view>
			</view>
			
		</view>
		<view class="tips-bottom-button">
			<button hover-class="active" @tap.stop="jump"><!-- {{i18n.Create_now}} -->下一步</button>
		</view>
	</view>
</template>

<script>
	// import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue';
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	import {mapGetters, mapMutations} from 'vuex'
	import Load from '../../components/common/load.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js'
	export default {
		components:{
			
		},
		data() {
			return {
			
			};
		},
		computed: {
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLang',
				'getIncode',
				'getLoginInfo',
				'getLogin',
				'getLangType',
			])
		},
		methods:{
			// getid(id){
			// 	console.log(id,"#################")
			// },
			jump(){
				console.log('111');
				uni.navigateTo({
					url:'/pages/new-login/define-Mnemonic'
				})
			}
		},
		onShow(){
			// this.getid()
		}
	}
</script>

<style lang="scss">
	.page{
		height: 100vh;
		background-color: #FFFFFF;
	}
	.tips-bottom-button{
		position: fixed;
		width: 690upx;
		left: 32upx;
		bottom: 100upx;
		button{
			font-size: 30rpx;
			width: 690upx;
			line-height: 88upx;
			height: 88upx;
			color: #FFFFFF;
			background-color: #337BFD;
			&.active{
				transform: scale(.9);
				opacity: .9;
			}
		}
	}
	.tips-content{
		padding: 50upx 58upx;
		image{
			width: 276upx;
			height: 276upx;
			flex-shrink: 0;
			margin-left:50%;
			transform: translateX(-50%);
			margin-top: 164rpx;
		}
		.tips-title{
			margin-top: 112rpx;
			border-bottom: 1upx solid #BEBEBE;
			margin-bottom: 22upx;
			font-size: 32rpx;
			view{
				color: #151515;
				font-weight: bold;
				font-size: 32upx;
			}
			text{
				color: #545454;
				font-size: 26upx;
				line-height: 112upx;
			}
		}
		.tips-con{
			.tips-con-i{
				color: #545454;
				font-size: 26upx;
				padding-left: 54upx;
				position: relative;
				&::before{
					content: "";
					position: absolute;
					width: 8upx;
					height: 8upx;
					background-color: #0E45D8;
					border-radius: 4upx;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
				&:first-of-type{
					margin-bottom: 48upx;
				}
			}
		}
	}
</style>
