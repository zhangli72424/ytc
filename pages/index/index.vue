<template>
	<view>
		<uni-status-bar bgcolor="transparent"></uni-status-bar>
		<!-- <u-navbar :is-back="false" :background="background"></u-navbar> -->
		<view class="index-top">
			<view class="index-top-l">
				<text>投资收益(YTC)</text>
				<view>{{i18n.index}}</view>
				<text>≈56234.00 CNY</text>
			</view>
			<u-button :ripple="true" :hair-line="false" @click="dump" ripple-bg-color="#909399" :custom-style="customStyle">查看详情</u-button>
		</view>
		<view class="index-top-img">
			
		</view>
		<!-- <image src="../../static/imgs/index-top-img.png" mode="widthFix" lazy-load class="index-top-img"></image> -->
		<view class="content">
			
			<!-- 菜单 -->
			<view class="index-nav-list">
				<block v-for="(item,index) in navList" :key="index">
					<view class="index-nav-list-item" hover-class="active" @tap.stop="jumpWeb(item.url)">
						<image :src="item.image" mode="widthFix" lazy-load></image>
						<text>{{item.text}}</text>
					</view>
				</block>
				
				
			</view>
			<!-- 菜单 end -->
			<view class="index-market">
				
				<view class="index-market-title">
					最新公告
				</view>
				
				<view class="bulletin">
					<!-- <image src="../../static/imgs/notice.png"></image> -->
					<swiper circular="true" vertical="true" :autoplay="true" :interval="3000" :duration="1000">
						<swiper-item v-for="(item, index) in news" :key="index">
							<view class="swiper-item" @tap.stop="jumDetail(index)">{{item.title}}</view>
						</swiper-item>
					</swiper>
					<text>更多</text>
				</view>
			</view>
			
			<view class="index-banner">
				<u-swiper :list="bannerList" mode="rect"></u-swiper>
			</view>
			
			<view class="index-market">
				
				<view class="index-market-title">
					24H{{i18n.Quotes}}
				</view>
				<view class="index-market-nav">
					<view>名称</view><view>最新价</view><view>涨跌幅</view>
				</view>
				<block v-for="(item,index) in list" :key="index">
					<view class="index-market-li">
						<view class="index-market-li-l">
							{{item.coin}}<text>/USDT</text>
						</view>
						<view class="index-market-li-c" :class="item.type?'green':'red'">
							{{item.last}}
						</view>
						<view class="index-market-li-r" :class="item.type?'green':'red'">
							<view>{{item.type?'+':'-'}}{{item.zdf}}</view>
						</view>
					</view>
				</block>
				<!-- <block v-for="(item,index) in list" :key="index">
					<market-list :item="item" :index="index"></market-list>
				</block> -->
			</view>
		</view>
		
		
		
		
		<load v-if="showLoad"/>
	</view>
</template>

<script>
	import marketList from '@/components/common/market-list.vue';
	import Load from '@/components/common/load.vue';
	import {pageto, showToast, fetch, updownLine, forceUpdate, diff_txt, _updataTabBar} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	export default {
		components:{
			marketList,Load,uniStatusBar
		},
		data() {
			return {
				customStyle:{
					width:'154rpx',
					height:"52rpx",
					lineHeight:"52rpx",
					background:"#0E39B8",
					color:"#ffffff",
					borderRadius:"8rpx",
					fontSize:"22rpx",
					padding:"0",
					border:"none"
				},
				showLoad:false,
				title: 'Hello',
				background:'transparent',
				list:[],
				news:[],
				leaderList:[],
				wangnuozongsuanli:0,
				liutongliang:0,
				suanli:0,
				yitouru:0,
				bannerList:[],
				navList:[]
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
			this.navList = [
				{
					image:require('../../static/imgs/index-nav0.png'),
					text:'转账',
					url:''
					
				},
				{
					image:require('../../static/imgs/index-nav1.png'),
					text:'矿池',
					url:''
				},
				{
					image:require('../../static/imgs/index-nav2.png'),
					text:'账本',
					url:''
				},
				{
					image:require('../../static/imgs/index-nav3.png'),
					text:'收款',
					url:''
				},
				{
					image:require('../../static/imgs/index-nav4.png'),
					text:'投资',
					url:''
					
				},
				{
					image:require('../../static/imgs/index-nav5.png'),
					text:'DEFI',
					url:''
				},
				{
					image:require('../../static/imgs/index-nav6.png'),
					text:'激活',
					url:''
				},
				{
					image:require('../../static/imgs/index-nav7.png'),
					text:'质押',
					url:''
				}
			]
			this.getMarket()
			this.getNotice();
			this.getLun();
		},
		methods: {
			...mapMutations([
				'setBulletin'
			]),
			dump(){
				showToast('12313')
			},
			jumpWeb(url){
				if(url){
					uni.navigateTo({
						url:url
					})
				}else{
					showToast(`${this.i18n.in_development}...`)
				}
			},
			jumDetail(e){
				this.setBulletin(this.news[e]);
				uni.navigateTo({
					url:'/pages/new/detail'
				})
			},
			getNotice(){
				this.showLoad = true;
				fetch('/api/User/notice', {}, "post").then(res=>{
					this.showLoad = false;
					if(res.data.code){
						this.news = res.data.data;
						this.news.forEach(item => {
							item.time = diff_txt(item.time, this.i18n.today, this.i18n.yesterday, this.i18n.b_yesterday);
							item.content = item.content
							  .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
							  .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
							  .replace(/<p>/ig, '<p class="p_class">')
							  .replace(/\<img/gi, '<img style="max-width:98%;height:auto" ')
						})
					}
				}).catch(err=>{ 
					this.showLoad = false;
				})
			},
			getLun(){
				this.showLoad = true;
				fetch('/api/user/lun', {}, "post").then(res=>{
					this.showLoad = false;
					if(res.data.code==1){
						this.bannerList = res.data.data
						this.bannerList.forEach((item,index)=>{
							this.bannerList[index].image = this.getRequestUrl+'/uploads/'+item.img
						})
					}
				}).catch(err=>{ 
					this.showLoad = false;
				})
			},
			getMarket(){
				this.showLoad = true;
				fetch('/api/wallet/getCoinMarket', {}, "post").then(res=>{
					this.showLoad = false;
					if(res.data.code){
						this.list = res.data.data;
						this.list.forEach((item,index)=>{
							this.list[index].title_en = item.coin;
							this.list[index].balance = item.last;
							this.list[index].usd_price = item.last;
							this.list[index].zdfisshow = true;
							if(Number(item.percentChange)>=0){
								this.list[index].zdf = item.percentChange + '%';
								this.list[index].type = true
							}else{
								this.list[index].zdf = -(item.percentChange) + '%';
								this.list[index].type = false
							}
						})
					}
				}).catch(err=>{
					this.showLoad = false;
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.index-top-img{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		flex-shrink: 0;
		z-index: -1;
		width: 750upx;
		height: 435upx;
		background: linear-gradient(to right, #145AC2, #092FEE);
	}
	.index-top{
		padding: 72rpx 30upx 90rpx;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		color: $white;
		.index-top-l{
			flex: 1;
			text{
				font-size: 22rpx;
				&:first-of-type{
					color: #72A4F7;
				}
			}
			view{
				font-size: 48upx;
				font-weight: bold;
				padding: 24rpx 0 22rpx;
			}
		}
	}
	.content{
		padding: 36upx 0 0;
		background: $white;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		.index-market-nav{
			display: flex;
			align-items: center;
			border-top: 1rpx solid #E4E6F5;
			view{
				flex: 1;
				line-height: 70rpx;
				font-size: 24rpx;
				color: #BED0DC;
				text-align: center;
				&:first-of-type{
					text-align: left;
				}
				&:last-of-type{
					text-align: right;
				}
			}
		}
		.index-market-li{
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #E4E6F5;
			&:last-of-type{
				border-bottom: none;
			}
			.index-market-li-l{
				line-height: 120rpx;
				flex: 1;
				text-align: left;
				color: #262631;
				font-size: 30rpx;
				font-weight: bold;
				text{
					font-size: 20rpx;
					color: #BED0DC;
					font-weight: lighter;
				}
			}
			.index-market-li-c{
				line-height: 120rpx;
				flex: 1;
				text-align: center;
				&.green{
					color:#45C98F;
				}
				&.red{
					color: #E64747;
				}
			}
			.index-market-li-r{
				flex: 1;
				// text-align: right;
				view{
					margin: 0 0 0 auto;
					width: 160rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					color: $white;
					font-size: 30rpx;
					font-weight: bold;
				}
				&.green{
					view{
						background: #45C98F;
					}
				}
				&.red{
					view{
						background: #E64747;
					}
				}
			}
		}
		.index-banner{
			padding: 0 30rpx;
		}
		.bulletin {
			z-index: 10;
			height: 58upx;
			line-height: 58upx;
			display: flex;
			overflow: hidden;
			align-items: center;
			margin-bottom: 40upx;
			background: #f7f7f7;
			border-radius: 29rpx;
			// padding:34rpx 0 27rpx;
			text{
				font-size: 26rpx;
				color: #000000;
				padding-right:27rpx ;
			}
			swiper {
				height: 74upx;
				flex: 1;	
				padding: 0 30rpx;
				overflow: hidden;
				display: flex;
				align-items: center;
				text-overflow: ellipsis;
				white-space: nowrap;
				.swiper-item {
					color: $light_gray;
					font-size: 24upx;
					height: 74upx;
					line-height: 74upx;
				}
			}
		}
		
	}
	.index-nav-list{
		// padding: ;
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		.index-nav-list-item{
			width: 25%;
			// flex: 2;
			padding: 5rpx 0 20rpx;
			text-align: center;
			&.active{
				background: rgba(255,255,255,.1);
				border-radius: 4upx;
			}
			image{
				width: 70upx;
				height: 70upx;
				flex-shrink: 0;
			}
			text{
				display: block;
				color: $black;
				font-size: 26upx;
			}
		}
	}
	.index-market{
		padding: 40upx 30upx 0;
		// border-top: 2upx #2b2860 solid;
		.index-market-title{
			font-size: 34upx;
			font-weight: bold;
			color: $black;
			padding-bottom: 30upx;
		}
	}
</style>
