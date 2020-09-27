<template>
	<view>
		<view class="index-banner">
			<u-swiper :list="bannerList" height="220" mode="rect"></u-swiper>
		</view>

		<view class="bulletin">
			<image src="../../static/imgs/notice.png"></image>
			<swiper circular="true" vertical="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="(item, index) in news" :key="index">
					<view class="swiper-item" @tap.stop="jumDetail(index)">{{item.title}}</view>
				</swiper-item>
			</swiper>
			<i class="icon iconfont icongengduo"></i>
		</view>
		<view class="nav-content">
			<block v-for="(item,index) in navList" :key="index">
				<view class="nav-item">
					<image :src="item.img" mode="widthFix" lazy-load></image>
					<view>{{item.text}}</view>
				</view>
			</block>
			
		</view>
		<view class="markt-content">
			<view class="markt-nav">
				<view class="mark-nav-item" :class="{'active':navIndex==0}" @tap.stop="selectnav(0)">涨跌榜</view>
				<view class="mark-nav-item" :class="{'active':navIndex==1}" @tap.stop="selectnav(1)">成交榜</view>
			</view>
			<view class="markt-li-title">
				<text>名称</text>
				<text>最新价</text>
				<text>涨跌幅</text>
			</view>
			<block v-for="(item,index) in list" :key="index">
				<view class="markt-li" @tap.stop="select(item)">
					<view class="markt-li-l">
						{{item.coin}}<text>/USDT</text>
					</view>
					<view class="markt-li-c" :class="[item.type?'color-green':'color-red']">{{item.last}}</view>
					<view class="markt-li-r" :class="[item.type?'color-green':'color-red']">
						{{item.type?'+':'-'}}{{item.zdf}}
					</view>
				</view>
			</block>
			
		</view>
		
		
		<load v-if="showLoad"/>
	</view>
</template>

<script>
	import App from '../../App.vue'
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
				showLoad:false,
				bannerList:[],
				news:[],
				navList:[],
				navIndex:0,
				list:[]
			}
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLangType',//
				'getLogin',
				'getLoginInfo',
				'getTextArr',//,
			])
		},
		onShow(){
			this.showLoad=false;
			this.navList = [
				{img:require('../../static/imgs/index-nav0.png'),text:'转账激活',url:''},
				{img:require('../../static/imgs/index-nav1.png'),text:'邀请好友',url:''},
				{img:require('../../static/imgs/index-nav2.png'),text:'孵化器',url:''},
				{img:require('../../static/imgs/index-nav3.png'),text:'十二星系',url:''},
				{img:require('../../static/imgs/index-nav4.png'),text:'DEFI',url:''},
				{img:require('../../static/imgs/index-nav5.png'),text:'矿池',url:''},
				{img:require('../../static/imgs/index-nav6.png'),text:'申购',url:''},
				{img:require('../../static/imgs/index-nav7.png'),text:'DAPP',url:''},
			]
			this.getMarket();
			this.getLun()
			this.getNotice()
		},
		methods: {
			select(item){
				// encodeURIComponent(data.data)
				
				uni.navigateTo({
					url:`/pages/wasdokij-001/wasdokij-001?data=${item.coin}`
				})
			},
			selectnav(index){
				this.navIndex = index
			},
			...mapMutations([
				'setBulletin','setIsFirstJum'
			]),
		
			jumDetail(e){
				this.setBulletin(this.news[e]);
				uni.navigateTo({
					url:'/pages/new/detail'
				})
			},
			getMarket(){
				this.list=[];
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
			
		}
	}
</script>

<style scoped lang="scss">
	.index-banner{
		padding: 140rpx 30rpx 0;
	}
	.bulletin {
		z-index: 10;
		height: 58upx;
		line-height: 58upx;
		padding: 10rpx 30rpx;
		display: flex;
		overflow: hidden;
		align-items: center;
		margin-bottom: 40upx;
		background: #f7f7f7;
		border-radius: 29rpx;
		// padding:34rpx 0 27rpx;
		image{
			width: 35rpx;
			height: 34rpx;
			margin-right: 16rpx;
			flex-shrink: 0;
		}
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
	.nav-content{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding-bottom: 34rpx;
		border-bottom: 20rpx solid #f2f2f6;
		.nav-item{
			width: 25%;
			margin-top: 54rpx;
			text-align: center;
			image{
				width: 65rpx;
				height: 65rpx;
				flex-shrink: 0;
			}
			view{
				font-size: 26rpx;
			}
		}
	}
	.markt-content{
		padding: 0 30rpx;
		.markt-nav{
			display: flex;
			align-items: center;
			.mark-nav-item{
				font-size: 30rpx;
				color: #C0C1CE;
				line-height: 110rpx;
				font-weight: bold;
				&.active{
					font-size: 40rpx;
					color: #1C72DC;
				}
				&:first-of-type{
					margin-right: 36rpx;
				}
			}
		}
		.markt-li-title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			text{
				display: block;
				line-height: 110rpx;
				font-size: 26rpx;
				color: #C0C1CE;
			}
		}
		.markt-li{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 60rpx;
			.markt-li-l{
				color: #040404;
				font-size: 30rpx;
				text{
					font-size: 26rpx;
					color: #C0C1CE;
				}
			}
			.markt-li-c{
				font-size: 30rpx;
				font-weight: bold;
				&.color-green{
					color: #45C98F;
				}
				&.color-red{
					color: #E64747;
				}
			}
			.markt-li-r{
				color: #FFFFFF;
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				border-radius: 4rpx;
				&.color-green{
					background-color: #45C98F;
				}
				&.color-red{
					background-color: #E64747;
				}
			}
		}
		
	}
	
	
	
	
	
	
</style>
