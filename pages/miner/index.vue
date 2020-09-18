<template>
	<view>
<!-- 		<u-navbar :is-back="false" backIconColor="#ffffff" :background="background">
			<view class="assets-top-index">
				<view class="assets-top-index-l">
					矿机产品
				</view>
				<view class="assets-top-index-r" @tap.stop="getHistory">
					查看我矿机<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
		</u-navbar> -->
		<view class="min-top-img">
				<image src="../../static/imgs/miner-top.png" mode="widthFix" lazy-load></image>
		</view>
		<view class="about-content">
			<view class="about-content-title">
				<text>了解抢购规则</text><i class="icon iconfont iconxiangyou1"></i><i class="icon iconfont iconxiangyou1"></i>
			</view>
			<view class="about-contant">
				<view class="about-item">
					<image src="../../static/miner/0.png" mode="widthFix" lazy-load></image>
				</view>
				<view class="about-item-line">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
				<view class="about-item">  
					<image src="../../static/miner/1.png" mode="widthFix" lazy-load></image>
				</view>
				<view class="about-item-line">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
				<view class="about-item">
					<image src="../../static/miner/2.png" mode="widthFix" lazy-load></image>
				</view>
			</view>
			
		</view>
		
		
		
		<template v-if="list.length>0">
			<view class="list-content">
				<view class="list-title">
					投资抢购
				</view>
				<block v-for="(item,index) in list" :key="index">
					<view class="list-cantant">
						<view class="list-cantant-t">
							<view>{{item.title}}</view>
							<text>{{item.tips}}</text>
						</view>
						
						<view class="list-cantant-c">
							<view class="list-cantant-c-item">
								<view>{{item.expinc}}</view>
								<text>预期收益(ETH)</text>
							</view>
							<view class="list-cantant-c-item">
								<view>{{item.price}}</view>
								<text>矿机售价(CNY)</text>
							</view>
							<view class="list-cantant-c-item">
								<u-button
								:customStyle="somebuttomn" 
								:ripple="true" 
								rippleBgColor="#009CF4"
								@click="details(item)"
								shape="circle"
								>查看详情</u-button>
							</view>
						</view>
					</view>
				</block>
			</view>
		</template>
		<load v-if="showLoad"/>
	</view>
</template>

<script>
	import Load from '@/components/common/load.vue';
	import {pageto, showToast, fetch, updownLine, forceUpdate, diff_txt, _updataTabBar} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	export default {
		data() {
			return {
				showLoad:false,
				background:{
					background:'#0f1622'
				},
				somebuttomn:{
					'padding':'0 !important',
					width:'164rpx',
					background:'linear-gradient(to right, #FFBB6D, #E6D2A2)',
					color:'#594422',
					'line-height':'58rpx !important',
					height:'58rpx !important',
					'font-size':'24rpx !important'
					
				},
				list:[]
			}
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLangType',
				'getLogin',
				'getLoginInfo',
				'getTextArr'
			])
		},
		onShow(){
			this.showLoad = false;
			this.getList()
			
		},
		methods:{
			getHistory(){
				uni.navigateTo({
					url:'/pages/miner/mining'
				})
			},
			jumps(val){
				switch (val){ 
					case 'invited':
						uni.navigateTo({
							url:'/pages/invite/advertising'
						})
						break;
					default:
						break;
				}
			},
			...mapMutations(['setCurInfo']),
			details(item){ 
				this.setCurInfo(item)
				uni.navigateTo({
					url:'/pages/miner/detail'
				})
			},
			getList(){
				
				let res = {"code":1,"msg":"成功","time":1600410008,"data":[{"id":1,"title":"ETH矿机","status":1,"details":null,"rcb":"0.1000","premium":"0.00009600","type":1,"th_day":1460,"token_id":2,"stock":0,"buystock":0,"lowbetting":12,"th":230,"price":"16800.00","install_day":30,"expinc":"30","power":"218.06","diff":"2.92","shopid":1}]}
				
				if(res.code==1){
					this.list = res.data
					this.list.forEach((item,index)=>{
						this.list[index].tips = index=='0'?'限时限量':index==1?'稳健热销':index==2?'热销明星':index==3?'稳健成长':'额度稀缺'
						this.list[index].titles='真矿宝联合挖矿'
						this.list[index].fee = Number(item.rcb)*100000000/1000000+'%'
						this.list[index].price = Number(item.price)*100000000/100000000
						this.list[index].day = item.month+'月'
					})
				}
				return
				fetch('/api/bee/shoclist',{},'post')
					.then(res=>{
						if(res.data.code==1){
							this.list = res.data.data
							this.list.forEach((item,index)=>{
								this.list[index].tips = index=='0'?'限时限量':index==1?'稳健热销':index==2?'热销明星':index==3?'稳健成长':'额度稀缺'
								this.list[index].titles='真矿宝联合挖矿'
								this.list[index].fee = Number(item.rcb)*100000000/1000000+'%'
								this.list[index].price = Number(item.price)*100000000/100000000
								this.list[index].day = item.month+'月'
							})
						}
					})
					.catch(err=>{
						
					})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.min-top-img{
		width: 750upx;
		height: 400upx;
		// margin: 0 30rpx;
		image{
			width: 750upx;
			height: 400upx;
			flex-shrink: 0;
		}
	}
	.assets-top-index{
		// #ifdef APP-PLUS
		width: 750rpx;
		// #endif
		// #ifdef MP-WEIXIN
		width: 650rpx;
		// #endif
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.assets-top-index-l{
			font-weight: bold;
			font-size: 40rpx;
			color: $black;
		}
		.assets-top-index-r{
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: #009CF4;
		}
	}
	
	.about-content{
		margin-top: 40rpx;
		.about-content-title{
			display: flex;
			align-items: center;
			justify-content: center;
			color: #1687F9;
			padding-bottom: 24rpx;
			font-size: 22rpx;
			.icon{
				font-size: 24rpx;
				color: #1687F9;
			}
		}
		.about-contant{
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.about-item-line{
				.icon{
					color: 	#1687F9;
				}
			}
			.about-item{
				position: relative;
				padding-left: 14rpx;
				width: 206rpx;
				height: 160rpx;
				view{
					line-height: 66rpx;
					color: $white;
					font-size: 24rpx;
				}
				text{
					display: block;
					font-size: 20rpx;
					color: #70cdc1;
				}
				image{
					width: 220rpx;
					height: 160rpx;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-50%);
					z-index: -1;
				}
			}
		}
	}
	.list-content{
		padding: 0 40rpx;
		margin: 82rpx 0 0;
		.list-title{
			padding-left: 18rpx;
			position: relative;
			color: $black;
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 34rpx;
			&::before{
				content: "";
				position: absolute;
				width: 6rpx;
				height: 38rpx;
				background: $theme-dark-color;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		.list-cantant{
			padding: 28rpx 32rpx;
			background-color: $page-bg-color5;
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			.list-cantant-t{
				display: flex;
				align-items: center;
				view{
					color: #D4BE91;
					line-height: 56rpx;
					font-size: 40rpx;
					margin-right: 15rpx;
				}
				text{
					background: #4F4F52;
					padding: 6rpx 10rpx;
					border-radius: 20rpx;
					color: #D4BE91;
					font-size: 20rpx;
				}
			}
			.list-cantant-c{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 28rpx 0 0;
				.list-cantant-c-item{
					view{
						font-size: 44rpx;
						font-weight: bold;
						color:#D4BE91;
						margin-bottom: 8rpx;
						line-height: 60rpx;
					}
					text{
						font-size: 24rpx;
						color: #474F5F;
					}
				}
			}
		}
	}
</style>
