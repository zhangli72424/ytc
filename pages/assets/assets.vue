<template>
	<view>
		<u-navbar :is-back="false" :background="background">
			<view class="index-top">
				{{i18n.My_assets}}
			</view>
		</u-navbar>
		<view class="assets-title animated bounceInUp fast">
			<view class="assets-title-top">
				<text>{{i18n.TotalAssets}}(USDT）</text> <i class="icon iconfont" @tap.stop="switchShow" :class="[isShow?'iconai-eye':'iconyanjing-bi']"></i>
			</view>
			<view class="assets-title-content">
				{{isShow?(total):'***'}}
			</view>
			<!-- <view class="assets-title-bottom">
				CPD 锁仓数量 : <text>{{curms.financial? (curms.financial| formatParsefloat):'0'}}</text>
			</view>
			<view class="assets-title-bottom">
				CPD 冻结数量 : <text>{{curms.giving? (curms.giving| formatParsefloat):'0'}}</text>
			</view> -->
			<image src="../../static/imgs/balance_bg.png"  lazy-load class="assets-title-img"></image>
		</view>
		
		<view class="assets-content">
			<view class="assets-content-title animated bounceInUp fast">{{i18n.Asset_list}}</view>
			<block v-for="(item,index) in list" :key="index">
				<view class="list animated bounceInUp fast" @tap.stop="clickDump(index)">
					<view class="list-top">
						<view class="_left">
							<image lazy-load :src="item.logo"></image>
							<view>
								<text>{{item.title_en}}</text>
								<!-- <text>{{item.title_zh}}</text> -->
							</view>
						</view>
						<!-- <view class="_right giving-text" v-if="item.id==1">
							<view class="">
								{{item.giving | formatParsefloat}}
							</view>
							<text>{{i18n.Frozen_quantity}}</text>
						</view> -->
						<view class="_right">
							<view class="">
								{{balance}}
							</view>
							<text>≈ {{usd_price}} (U)</text>
						</view>
					</view>
					<view class="list-bottom" v-if="item.show && (item.open_type.cb==1 || item.open_type.hz==1 || item.open_type.sf==1 || item.open_type.tb==1 || item.open_type.zd==1)" 
					:class="{'anima':item.show}">
						<view class="items" v-if="item.open_type.cb==1">
							<view @tap.stop="jumpReceive(index)">
								<image src="../../static/imgs/receive.png" mode="widthFix" lazy-load></image>{{i18n.Deposit}}
							</view>
						</view>
						<view class="items" v-if="item.open_type.tb==1"> 
							<view @tap.stop="jumpTurn(index)">
								<image src="../../static/imgs/turn.png" mode="widthFix" lazy-load></image>{{i18n.withdrawal}}
							</view>
						</view>
						<view class="items" v-if="item.open_type.sf==1">
							<view @tap.stop="jumpFlash(index)">
								<image src="../../static/imgs/exchange.png" mode="widthFix" lazy-load></image>{{i18n.Flash_payment}}
							</view>
						</view>
						<view class="items" v-if="item.open_type.hz==1">
							<view @tap.stop="jumpFlashment(index)">
								<image src="../../static/imgs/exchange.png" mode="widthFix" lazy-load></image>{{i18n.Transfer}}
							</view>
						</view>
						<view class="items" v-if="item.open_type.zd==1">
							<view @tap.stop="jumpHistory(index)">
								<image src="../../static/imgs/history.png" mode="widthFix" lazy-load></image>{{i18n.Bill}}
							</view>
						</view>
					</view>
				</view>
				
			</block>
		</view>
		
		<load v-if="showload"/>
	</view>
</template>

<script>
	import {pageto, showToast, fetch, _updataTabBar, forceUpdate} from '@/common/js/util.js';
	import {mapGetters,mapMutations} from "vuex";
	import Load from '@/components/common/load.vue';
	export default {
		components:{
			Load
		},
		computed:{
			formatParsefloat(val){
				if ((!val && val != 0) || val == null || val == undefined || val == 'undefined') {
					return 0
				}
				return parseFloat(val)
			},
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLangType',
				'getLogin',
				'getLoginInfo',
				'getTextArr'
			]),
		},
		onShow(){
			
			this.total=0
			this.isShow=false
			this.list=[]
			this.showload=false
			this.curms=[]
			this.balance=0
			this.usd_price=0
			
			forceUpdate(this.getLangType);
			_updataTabBar(this.getTextArr,this.getLangType);
			this.getList()
		},
		data() {
			return {
				total:0,
				isShow:false,
				list:[],
				showload:false,
				curms:[],
				background:"#F6F6F6",
				balance:0,
				usd_price:0
			};
		},
		methods:{
			switchShow(){this.isShow = !this.isShow;},
			getList(){
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token
				}
				this.showload = true;
				fetch('/api/wallet/wallet_list',data,'post')
					.then(res=>{
						this.showload = false;
						if(res.data.code){
							let total = res.data.data.total;
							this.total=parseInt(total)
							this.list = res.data.data.list;
							this.list.forEach((item,index)=>{
								let balance=this.list[index].balance
								this.balance=parseInt(balance)
								let usd_price=this.list[index].usd_price;
								this.usd_price=parseInt(usd_price)
							})
							
							let cus = this.list.filter((item,index)=>{
								return item.token_id==1;
							})
							this.curms = cus[0]
							 
							this.list.forEach((item,index)=>{
								this.list[index].type = (item.zdf>=0?true:false)
								this.list[index].show = false;
								item.zdf = (item.zdf*100)+'%';
								if(item.token_id==1){
									this.list[index].showFlase = true;
								}
							})
						}
					})
					.catch(error=>{
						this.showload = false;
					})
			},
			jumpReceive(index){
				let item = JSON.stringify(this.list[index]);
				uni.navigateTo({
					url:`/pages/assets/recharge?item=${item}`
				})
			},
			jumpFlashment(index){
				let item = JSON.stringify(this.list[index]);
				uni.navigateTo({
					url:`/pages/assets/flash-payment?item=${item}`
				})
			},
			jumpTurn(index){
				let item = JSON.stringify(this.list[index]);
				uni.navigateTo({
					url:`/pages/assets/coin?item=${item}`
				})
			},
			jumpHistory(index){
				let tokenId = this.list[index].token_id;
				uni.navigateTo({
					url:`/pages/assets/history?item=${JSON.stringify(this.list[index])}`
				})
			},
			jumpFlash(index){
				let tokenId = this.list[index].token_id;
				uni.navigateTo({
					url:`/pages/assets/flash?item=${JSON.stringify(this.list[index])}`
				})
			},
			clickDump(index){
				for	(let i = 0; i < this.list.length; i++){
					if(index == i && this.list[i].show==false){
						this.list[i].show = true
						this.$set(this.list, i,  this.list[i])
						// this.$forceUpdate();
					}else{
						this.list[i].show = false
						this.$set(this.list, i, this.list[i])
						// this.$forceUpdate();
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	u-navbar{
		background-color: #F6F6F6 !important;
		.index-top{
			padding-left: 36rpx;
			font-weight: bold;
			font-size: 40rpx;
		}
	}
	
	.assets-title{
		position: relative;
		// #ifdef MP-WEIXIN
		margin:0 30upx  40upx;
		// #endif
		// #ifdef APP-PLUS
		margin: 80upx 30upx 40upx;
		// #endif
		border-radius: 20upx;
		overflow: hidden;
		padding: 54upx 0 66upx 54upx;
		.assets-title-img{
			position: absolute;
			z-index: -1;
			width: 690upx;
			height: 300upx;
			flex-shrink: 0;
			left: 0;
			top: 0;
		}
		.assets-title-top{
			color: $white;
			display: flex;
			align-items: center;
			text{
				margin-right: 15upx;
			}
		}
		.assets-title-content{
			font-size: 42upx;
			color: $white;
			margin: 38upx 0 32upx;
		}
		.assets-title-bottom{
			font-size: 24upx;
			text{
				font-size: 30upx;
				margin-left: 10upx;
			}
		}
	}
	@-webkit-keyframes test-animation {
	  0% { 
		  border-top:none;
		  height: 0;
		  opacity: 1;
		  }
	  100% { 
		  border-top:1upx solid $split-line-color2;
		  height: 108upx;
		  margin-top: 38upx;
		  padding-top: 18upx;
		  padding-bottom: 10upx;
		  display: block !important;
		  }
	}
	@keyframes test-animation {
	  0% {
		  border-top:none;
		  height: 0;
		  opacity: 0;
		  }
	  100% { 
		  border-top:1upx solid $split-line-color2;
		  height: 108upx;
		  margin-top: 38upx;
		  padding-top: 18upx;
		  padding-bottom: 10upx;
		  display: block !important;
		  }
	}
	.assets-content{
		padding-top: 40rpx;
		.assets-content-title{
			padding:0 0 0 18rpx;
			margin: 0 30rpx 30rpx;
			font-size: 36upx;
			color: $black;
			font-weight: bold;
			&::before{
				content: "";
				position: absolute;
				width: 6rpx;
				height: 38rpx;
				background: #0D41DB;
				left: 0;
				top: 50%;
				transform: translateY(-50%)
			}
		}
		.list{
			background-color: $white;
			border-radius: 8upx;
			margin:0 30upx 20upx;
			box-shadow: 0 0 30rpx rgba(0,0,0,.05);
			.list-top{
				padding: 36upx 36upx 40upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				._left{
					display: flex;
					// justify-content: space-between;
					align-items: center;
					image{
						width: 75upx;
						height: 75upx;
						background: $white;
						border-radius: 37.5upx;
					}
					view{
						text{
							
							display: block;
							padding-left: 26upx;
							color: $black;
							font-size: 28upx;
							font-weight: bold;
							margin-bottom: 2upx;
							&:last-of-type{
								font-size: 24upx;
								color: $button-default-color;
							}
						}
					}
				}
				._right{
					&.giving-text{
						text-align: center;
						view{
							text-align: center;
						}
					}
					view{
						text-align: right;
						font-size: 34upx;
						font-weight: bold;
						color: $black;
						margin-bottom: 24upx;
					}
					text{
						font-size: 24upx;
						color: $button-default-color;
					}
				}
			}
			.list-bottom{
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 0;
				// height: 148upx;
				// margin-top: 38upx;
				overflow: hidden;
				&.anima{
					animation: test-animation 1s linear 0s 1 forwards;
				}
				.items{
					flex: 1;
					view{
						width: 120upx;
						margin: 0 auto;
						height: 54upx;
						border-radius: 10upx;
						background:$section-bg-color2;
						display: flex;
						align-items: center;
						font-size: 26upx;
						font-weight: 100;
						justify-content: center;
						color: $white;
						image{
							width: 32upx;
							height: 32upx;
							flex-shrink: 0;
							margin-right: 10upx;
						}
					}
				}
			}
		}
	}
</style>
