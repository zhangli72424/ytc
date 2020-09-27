<template>
	<view>
		<view class="trans-top">
			<view class="trans-top-title">
				<view class="trans-top-li">
					<image src="../../static/imgs/setting.png" mode="widthFix" lazy-load></image>
					<view>BTC/USDT</view>
				</view>
				<view class="trans-top-li">
					<image src="../../static/imgs/polyline.png" mode="widthFix" lazy-load></image>
				</view>
			</view>
			<view class="trans-top-content">
				<view class="trans-top-l">
					
					<view class="trans-top-l-nav">
						<view class="trans-top-l-nav-item" :class="{'active':buyIndex==0}" @tap.stop="selectNav('0')">买入</view>
						<view class="trans-top-l-nav-item" :class="{'active':buyIndex==1}" @tap.stop="selectNav('1')">卖出</view>
					</view>
					
					<view class="pick-nav">
						<view>市场委托</view>
						<i class="icon iconfont icon-sanjiaoxia"></i>
					</view>
				</view>
				<view class="trans-top-r">
					adas
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				buyIndex:0
			};
		},
		methods:{
			selectNav(index){
				this.buyIndex = index
			}
		}
	}
</script>

<style lang="scss" scoped>
.trans-top{
	padding: 0 30rpx;
	.trans-top-title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.trans-top-li{
			display: flex;
			align-items: center;
			&:first-of-type{
				image{
					width: 33rpx;
					height: 33rpx;
					flex-shrink: 0;
				}
			}
			view{
				margin-left: 20rpx;
				color: #262631;
				font-size: 36rpx;
				line-height: 100rpx;
			}
			image{
				width: 37rpx;
				height: 26rpx;
				flex-shrink: 0;
			}
		}
	}
	.trans-top-content{
		display: flex;
		align-items: center;
		.trans-top-l{
			flex: 1;
			margin-right: 72rpx;
			.trans-top-l-nav{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.trans-top-l-nav-item{
					text-align: center;
					font-size: 32rpx;
					color: #262631;
					width: 120rpx;
					line-height: 60rpx;
					height: 60rpx;
					background: #e4e6f5;
					&:first-of-type{
						border-top-left-radius: 4rpx;
						border-bottom-left-radius: 4rpx;
						position: relative;
						&::after{
							content: "";
							left: 120rpx;
							bottom: 0;
							position: absolute;
							width: 0;
							height: 0;
							border-bottom: 60rpx solid #e4e6f5;
							border-right: 60rpx solid transparent;
						}
					}
					&:last-of-type{
						position: relative;
						border-top-right-radius: 4rpx;
						border-bottom-right-radius: 4rpx;
						&::after{
							content: "";
							right: 120rpx;
							bottom: 0;
							position: absolute;
							width: 0;
							height: 0;
							border-top: 60rpx solid #e4e6f5;
							border-left: 60rpx solid transparent;
						}
					}
					&.active{
						color: $white;
						&:first-of-type{
							background: #45C98F;
							&::after{
								border-bottom: 60rpx solid #45C98F;
							}
						}
						&:last-of-type{
							background: #E64747;
							&::after{
								border-top: 60rpx solid #E64747;
							}
						}
					}
				}
			}
			.pick-nav{
				display: flex;
				align-items: center;
				width: 340rpx;
				line-height: 60rpx;
				height: 60rpx;
				border: 1rpx solid #BED0DC;
				border-radius: 4rpx;
				margin: 20rpx 0 0;
				justify-content: space-between;
				padding: 0 14rpx;
				view{
					color: #262631;
					font-size: 24rpx;
					line-height: 60rpx;
				}
				.icon{
					color: #BED0DC;
				}
			}
		}
		.trans-top-r{
			flex: 1;
		}
	}

}





</style>
