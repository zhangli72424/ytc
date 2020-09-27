<template>
	<view class="content">
		<u-navbar :is-back="false" titleColor="#ffffff" :title="i18n.market" :background="background"/>

		
	<!-- 	<view class="tuijian-cur">
			<view class="tui-item">
				<text>今日EKA指导价格</text>
				<view>{{EKA_zhi?(EKA_zhi):'--'}} USDT</view>
			</view>
			<view class="tui-item">
				<text>今日EKN指导价格</text>
				<view>{{EKN_zhi?(EKN_zhi):'--'}} USDT</view>
			</view>
		</view> -->
		
		
		<view class="market-content">
			<template v-if="curIndex==0">
				<view class="market-navs _flex _flex_align_items_center _flex_justify_content">
					<block v-for="(item,index) in tokenList" :key="index">
						<view :class="{'active':tabsIndex==index}" @tap.stop="selectNav(index)">{{item.tabName}}</view>
					</block> 
				</view>
				<view class="market-content-nav _flex _flex_align_items_center _flex_justify_content">
					<view class="market-content-nav-item  _flex _flex_align_items_center">
						<view class="items" :class="{'active':tabIndex==0}" @tap.stop="navSelect('0')">{{i18n.Pay}}</view>
						<view class="items" :class="{'active':tabIndex==1}" @tap.stop="navSelect('1')">{{i18n.Sell_orders}}</view>
					</view>
					<view class="market-content-nav-item  _flex _flex_align_items_center" @tap.stop="toList('jion')"><i class="icon iconfont icon-dingdan"></i>{{i18n.Participation_Details}}</view>
					<view class="market-content-nav-item  _flex _flex_align_items_center" @tap.stop="toList('fabu')"><i class="icon iconfont icon-dingdan"></i>{{i18n.My_release}}</view>
				</view>
				
				
				<view class="market-list">
					
					<template v-if="list.length>0">
						<block v-for="(item,index) in list" :key="index">
							<view class="list">
								<view class="list-title _flex _flex_align_items_center">
									{{item.username}} 
									<!-- {{item.lv=="V"?'V0':item.lv}} -->
									<!-- <image src="../../static/image/grade.png" lazy-load mode="widthFix"> -->
								</view>
								<view class="order_no_class">
									{{i18n.Order_number}}
									<text class="">{{item.order_no}}</text>
								</view>
								
								<view class="list-content _flex _flex_align_items_center _flex_justify_content">
									<view class="list-content-item">
										<view class="_flex _flex_align_items_center">
											{{i18n.release}}{{i18n.quantity}} <text>{{item.num | formatParsefloat}} {{tokenList[tabsIndex].token_id_name}} </text>
										</view>
										<view class="_flex _flex_align_items_center">
											{{i18n.Limit}} <text>{{item.minnum | formatParsefloat}} {{tokenList[tabsIndex].token_id_name}}</text>
										</view>
										<view class="_flex _flex_align_items_center">
											{{i18n.The_remaining_amount}} <text>{{item.cnum | formatParsefloat}} {{tokenList[tabsIndex].token_id_name}} </text>
										</view>
									</view>
									<view class="list-content-item">
										<text>{{i18n.price}}{{(tokenList[tabsIndex].buy_token_id_name)}}</text>
										<view>{{item.price}}</view>
									</view>
								</view>
								
								<view class="list-bottom _flex _flex_align_items_center _flex_justify_content">
									<view class="">
										<!-- 已成交 <text>687</text> -->
									</view>
									<view @tap.stop="sellOrBuy(item)">{{tabIndex==0?i18n.buy:i18n.Sell}}</view>
								</view>
							</view>
						</block>
						
					</template>
					<template v-else>
						<view class="nodata">
							<image src="../../static/imgs/nodata.png" mode="widthFix" lazy-load></image>
						</view>
					</template>
				
				</view>
			</template>
			<template v-if="curIndex==1 ||curIndex==2 ">
				<view class="nodata">
					<image src="../../static/imgs/in-development.png" mode="widthFix" lazy-load></image>
				</view>
			</template>
		</view>
		<view class="fixe-btn" @tap.stop="toSell">+</view>
		<!-- <view class="fixe-btn" @tap.stop="toSell">+</view> -->
		<load v-if="isLoading"></load>
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from "vuex";
	import {pageto, showToast, fetch, updownLine, forceUpdate, diff_txt, _updataTabBar} from '@/common/js/util.js';
	import Load from '@/components/common/load.vue';
	let timer = null;
	export default {
		data() {
			return {
				background:'linear-gradient(45deg, #2FB383, #22DE8E)',
				// true的时候是节点, false的时候是官方新闻
				currentTab: true,
				list: [],
				isLoading:false,
				curIndex:0,
				tabIndex:0,
				tokenList:[],
				tabsIndex:0,
				page:1,
				ischeck:false,
				EKA_zhi:'',
				EKN_zhi:'',
				messInfos:[]
			}
		},
		computed: {
			i18n () {
				return this.$t('message')
			},
			...mapGetters([
				'getLangType',
				'getRequestUrl',
				'getLoginInfo',
				'getLang',
				'getTextArr'
			])
		},
		onShow() {
			forceUpdate(this.getLangType);
			_updataTabBar(this.getTextArr,this.getLangType);
			this.tabIndex = 0;
			this.getToken();
			this.getTokenList();
		},
		onPullDownRefresh() {
					//下拉刷新的时候请求一次数据
					// console.log('下拉了')
			this.page =1;
			this.list =[];
		    this.getList();
		},
		onReachBottom() {
			let _self = this
				//触底的时候请求数据，即为上拉加载更多
				//为了更加清楚的看到效果，添加了定时器
		    if (timer != null) {
		        clearTimeout(timer);
		    }
		    timer = setTimeout(function() {
		        _self.getList();
		    }, 1000);
					
					// 正常应为:
					// _self.getmorenews();
		},
		methods:{
			getTokenList(){
				fetch('/api/shop/jyd',{},'POST')
					.then(res=>{
						if(res.data.code){
							this.tokenList  = res.data.data
							this.tabsIndex=0
							this.tokenList.forEach((item,index)=>{
								this.tokenList[index].tabName = item.title
								this.tokenList[index].id = item.buy_token_id
							})
							this.page =1;
							this.list =[];
							this.getList();
						}
					})
					.catch(err=>{
						
					})
				// api/shop/jyd
				
			},
			getList(){
				let data = {
					page:this.page,
					rows:10,
					type:this.tabIndex=='1'?1:2,  ///1买单2卖单
					status:1, //1进行中2已完成3已撤销
					self:2,
					token_id:this.tokenList[this.tabsIndex].token_id
				}
				if(this.ischeck) return
				this.ischeck  = true;
				this.showloading = true;
				fetch('/api/shop/markert_list1',data,'POST')
					.then(res=>{
						this.ischeck = false;
						this.showloading = false
						uni.stopPullDownRefresh();
						if(res.data.data.length ==0){
							showToast(this.i18n.nodata)
							uni.hideNavigationBarLoading();
							return;
						}
						if(res.data.code){
							if(this.page==1){
								this.page++;
								uni.stopPullDownRefresh();
								this.list = res.data.data;
								this.list.forEach((item,index)=>{
									this.list[index].total = ((parseInt((item.num*item.price)*100000000))/100000000).toFixed(4)
									this.tokenList.forEach((i,n)=>{
										if(item.buy_token_id==i.id){
											this.list[index].title_en = i.title_en
										}
									})
								})
								console.log(this.list);
							}else{
								this.page++;
								
								res.data.data.forEach((item,index)=>{
									res.data.data[index].total = ((parseInt((item.num*item.price)*100000000))/100000000).toFixed(4);
									this.tokenList.forEach((i,n)=>{
										if(item.buy_token_id==i.id){
											res.data.data[index].title_en = i.title_en
										}
									})
								})
								
								this.list = this.list.concat(res.data.data);
							}
						}
					})
					.catch(err=>{
						uni.stopPullDownRefresh();
						this.ischeck = false;
						this.showloading = false
					})
			},
			selectNav(index){
				this.tabsIndex = index;
				this.page =1;
				this.list =[];
				this.getList();
			},
			toList(e){
				if(!this.tokenList[this.tabsIndex])return;
				if(e=='fabu'){
					pageto(`/pages/market/list?info=${JSON.stringify(this.tokenList)}`)
				}else{
					console.log('fabu');
					pageto(`/pages/market/participate?info=${JSON.stringify(this.tokenList)}`)
				}
				
			},
			navSelect(e){
				this.tabIndex = e;
				this.page =1;
				this.list =[];
				this.getList();
			},
			selectTab(e){this.curIndex = e},
			toSell(){
				if(!this.tokenList[this.tabsIndex])return;
				pageto(`/pages/market/sell?type=${this.tabIndex}&info=${JSON.stringify(this.tokenList[this.tabsIndex])}`)
				},
			sellOrBuy(item){
				let curinfo = JSON.stringify(this.tokenList[this.tabsIndex])
				console.log(curinfo);
				let curs
				let curinfos
				if(this.tabIndex==1){
					curs = this.messInfos.filter((item,index)=>{
						return item.id == this.tokenList[this.tabsIndex].token_id
					})
					curinfos = JSON.stringify(curs[0])
				}else{
					curs = this.messInfos.filter((item,index)=>{
						return item.id == this.tokenList[this.tabsIndex].buy_token_id
					})
					curinfos = JSON.stringify(curs[0])
				}

				pageto(`/pages/market/buy-and-sell?type=${this.tabIndex}&cur=${curinfo}&item=${JSON.stringify(item)}&curs=${curinfos}`)
			},
			getToken(){
					this.showLoad = true;
					fetch('/api/Wallet/tokenList', {}, "post").then(res=>{
						this.showLoad = false;
						if(res.data.code){
							 this.ischeck  = false;
							 let tokenlist = res.data.data
							tokenlist.forEach((item,index)=>{
								if(item.title_en=='EKA'){
									this.EKA_zhi = (parseInt(item.price*1000))/1000
									console.log(this.EKA_zhi );
								}else if(item.title_en=='EKN'){
									this.EKN_zhi = (parseInt(item.price*1000))/1000
								}
							})
							this.messInfos = tokenlist
						}
					}).catch(err=>{ 
						this.ischeck  = false;
						this.showLoad = false;
					})
			}
		},
		components: {
			Load
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.tuijian-cur{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: $page-bg-color5;
		padding: 20upx 0;
		margin-bottom: 15upx;
		.tui-item{
			flex: 1;
			text-align: center;
			text{
				color: $text-gray-color1;
				font-size: 26upx;
			}
			view{
				color: $white;
				font-size: 30upx;
			}
		}
	}
	.nodata{
		width: 620upx;
		margin: 0 auto;
		image{
			width: 134rpx;
			height: 161upx;
			flex-shrink: 0;
			margin: 0 auto;
		}
	}
	.content{
		.nav-bar-title{
			width: 500upx;
			margin: 0 auto;
			background-color: $page-bg-color5;
			border-radius: 10upx;
			view{
				flex: 1;
				text-align: center;
				color: $white;
				font-size: 25upx;
				&.active{
					background: $theme-color;
					border-radius: 10upx;
				}
			}
		}
		.market-content{
			.market-navs{
				background: $page-bg-color5;
				margin-top: 20upx;
				view{
					line-height: 100upx;
					text-align: center;
					flex: 1;
					color: $white;
					&.active{
						color: $theme-color;
						position: relative;
						&::after{
							position: absolute;
							content:"";
							left: 50%;
							bottom:0;
							width: 100upx;
							height: 3upx;
							background: $theme-color;
							transform: translateX(-50%);
						}
					}
				}
			}
			.market-content-nav{
				padding: 52upx 30upx 40upx;
				.market-content-nav-item{
					font-size: 22upx;
					color: $white;
					view{
						margin-right: 10upx;
						font-size: 24upx;
						&.items{
							font-size: 32upx;
							color: $white;
							margin-right: 52upx;
							&.active{
								color: $theme-color;
								font-weight: bold;
								font-size: 47upx;
							}
						}
					}
				}
			}
			.market-list{
				.list{
					padding: 36upx 30upx 26upx;
					background-color: $page-bg-color5;
					border-bottom: 1upx solid $split-line-color1;
					&:last-of-type{
						border-bottom: none;
					}
					.order_no_class{
						font-size: 24upx;
						color:  $text-gray-color1;
						margin: 0 0 20upx;
						text{
							margin-left: 10upx;
							color: $white;
						}
					}
					.list-title{
						font-size: 34upx;
						color: $white;
						margin-bottom: 30upx;
						font-weight: bold;
						image{
							margin-left: 10upx;
							width: 37upx;
							height: 37upx;
							flex-shrink: 0;
						}
					}
					.list-content{
						.list-content-item{
							view{
								font-size: 24upx;
								color:  $text-gray-color1;
								line-height: 44upx;
								text{
									margin-left: 20upx;
									color: $white;
								}
							}
							&:last-of-type{
								text-align: right;
								text{
									color:  $text-gray-color1;
								}
								view{
									font-size: 36upx;
									font-weight: bold;
									color: $theme-color;
								}
							}
						}
					}
					.list-bottom{
						padding-top: 36upx;
						view{
							font-size: 28upx;
							color:  $text-gray-color1;
							text{
								margin-left: 20upx;
							}
							&:last-of-type{
								color: $white;
								width: 180upx;
								height: 60upx;
								line-height: 60upx;
								text-align: center;
								background: $button-color;
								border-radius: 6upx;
								font-size: 28upx;
							}
						}
					}
				}
			}
		}
		.fixe-btn{
			position: fixed;
			right: 30upx;
			bottom: 100upx;
			width: 100upx;
			height: 100upx;
			border-radius: 50upx;
			background: $button-color;
			font-size: 80upx;
			z-index: 99;
			font-weight: 100;
			color: $white;
			text-align: center;
			line-height: 100upx;
		}
	}
	
</style>
	