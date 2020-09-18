<template>
	<view>
	<!-- 	<uni-nav-bar
		statusBar="true"
		:fixed="true" 
		:border="false" 
		bgcolor="#1B2640"
		backgroundColor="#1B2640">
			<view class="index-title-top">
				<view @tap.stop="back">
					<i class="icon iconfont icon-fanhui"></i>
				</view>
				<view>{{i18n.Order_Details}}</view>
				
			</view>
		</uni-nav-bar> -->
		<u-navbar :is-back="true" 
		titleColor="#ffffff" 
		backIconColor="#ffffff"
		:title="i18n.Order_Details" 
		:background="background">
			
			<view slot="right" @tap.stop="selectNav" class="index-top-right">
			{{i18n.filter}} 
			<i class="icon iconfont " :class="[showNav?'icon-sanjiaoshang':'icon-sanjiaoxia']"></i>
			</view>
			
		</u-navbar>
		
		
		
		
		<view class="popule-nav " v-if="showNav" :class="{'animated lightSpeedIn fast':showNav}">
			<view class="popule-nav-content">
				<view class="popule-nav-contents">
					<view class="items" hover-class="active" @tap.stop="selectV('0')">{{i18n.transaction}}</view>
					<view class="items" hover-class="active" @tap.stop="selectV('1')">{{i18n.completed}}</view>
					<view class="items" hover-class="active" @tap.stop="selectV('2')">{{i18n.Cancelled_order}}</view>
				</view>
			</view>
		</view>
		
		<view class="list-nav">
			<view class="" :class="{'active':navIndex==0}" @tap.stop="selectNa('0')">{{i18n.Pay}}</view>
			<view class="" :class="{'active':navIndex==1}" @tap.stop="selectNa('1')">{{i18n.Sell_orders}}</view>
		</view>
		<view class="list-content">
			<template v-if="list.length>0">
			
				<template v-if="navIndex==0">
						<!-- 1 -->
						<block v-for="(item,index) in list" :key="index">
							<view class="list-item" :class="{'animated bounceInUp fast':navIndex==1}" @tap.stop="jumpDetail(item)">
								<view class="list-item-time">{{i18n.release_time}}:{{item.time}}</view>
								<view class="list-item-content">
									<view class="_left">
										<view class="">
											{{i18n.quantity}} <text>{{item.num | formatParsefloat}} {{item.token_id_name}}</text>
										</view>
										<view class="">
											{{i18n.price}} <text>{{item.price}} {{item.buy_token_id_name}}</text>
										</view>
									</view>
									<view class="_right">
										<text>{{i18n.total}}</text>
										<view class="">{{item.total}}</view>
									</view>
								</view>
								<view class="list-item-bottom">
									<text>{{item.status==1?i18n.transaction:item.status==2?i18n.completed:i18n.Cancelled_order}}</text>
									<template v-if="item.status==1">
										<button type="default" hover-class="active" @tap.stop="cancel(item)">{{i18n.Cancelled}}</button>
									</template>
								</view>
							</view>
						</block>
						<!-- 1 -->
				</template>
				
				
				<template v-if="navIndex==1">
					<view>
						<!-- 1 -->
						
						<block v-for="(item,index) in list" :key="index">
							<view class="list-item" :class="{'animated bounceInUp fast':navIndex==1}" @tap.stop="jumpDetail(item)">
								<view class="list-item-time">{{i18n.release_time}}:{{item.time}}</view>
								<view class="list-item-content">
									<view class="_left">
										<view class="">
											{{i18n.quantity}}  <text>{{item.num}} {{item.token_id_name}}</text>
										</view>
										<view class="">
											{{i18n.price}} <text>{{item.price}} {{item.buy_token_id_name}}</text>
										</view>
									</view>
									<view class="_right">
										<text>{{i18n.total}}</text>
										<view class="">{{item.total}}</view>
									</view>
								</view>
								<view class="list-item-bottom">
									<text>{{item.status==1?i18n.transaction:item.status==2?i18n.completed:i18n.Cancelled_order}}</text>
									<template v-if="item.status==1">
										<button type="default" hover-class="active" @tap.stop="cancel(item)">{{i18n.Cancelled}}</button>
									</template>
								</view>
							</view>
						</block>
						
						<!-- 1 -->
						
					</view>
				</template>
			</template>
			<template v-else>
				<view class="no-data">
					<image src="../../static/imgs/nodata.png" mode="widthFix" lazy-load></image>
				</view>
			</template>
			
			
		</view>
		
		
		<view class="mask" v-if="showNav" @tap.stop="selectNav"></view>
		<load v-if="showloading"></load>
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from "vuex";
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js'
	import Load from '@/components/common/load.vue';
	// import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	let timer=null;
	export default{
		data() {
			return {
				background:'#1b2640',
				showloading:false,
				showNav:false,
				navIndex:0,
				page:1,
				status:0,
				type:1,
				curInfo:[],
				list:[],
				isCheck:false
			}
		},
		components:{
			Load
			// ,uniNavBar
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLangType',
				'getLogin',
				'getLoginInfo'
			]),
		},
		onLoad(e){
			console.log(e);
			this.curInfo = JSON.parse(e.info)
		},
		onShow(){
			forceUpdate
			this.page = 1;
			this.status=0;
			this.list =[];
			this.getList();
		},
		onPullDownRefresh() {
					//下拉刷新的时候请求一次数据
					// console.log('下拉了')
			this.page =1;
			this.list =[];
			this.status=0;
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
			cancel(item){
				let _self = this;
				if(_self.isCheck) return;
				let data = {
					market_id:item.id
				}
				uni.showModal({
				    title: _self.i18n.prompt,
				    content: _self.i18n.prompt01,
				    success: function (re) {
				        if (re.confirm) {
				            console.log('用户点击确定');
							_self.showloading = true;
							fetch('/api/shop/marketCx',data,'POST')
								.then(res=>{
									_self.isCheck = false;
									_self.showloading = false;
									showToast(res.data.msg)
									if(res.data.code){
										_self.page = 1;
										_self.list =[];
										_self.status=1;
										_self.getList();
									}
								})
								.catch(err=>{
									_self.isCheck = false;
									_self.showloading = false;
									showToast(err.data.msg)
								})
				        } else if (re.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			getList(){
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					lang_type:this.getLangType=='chs'?1:2,
					page:this.page,
					rows:10,
					type:this.type,  ///1买单2卖单
					status:this.status, //1进行中2已完成3已撤销
					self:1
				}
				if(this.isCheck) return;
				this.isCheck = true;
				this.showloading = true;
				fetch('/api/shop/markert_list1',data,'POST')
					.then(res=>{
						this.showloading = false
						this.isCheck = false;
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
									this.curInfo.forEach((i,n)=>{
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
									this.curInfo.forEach((i,n)=>{
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
						this.isCheck = false;
						this.showloading = false
					})
			},
			jumpDetail(event){
				uni.navigateTo({
					url:`/pages/market/list-detail?info=${JSON.stringify(event)}&type=${this.type}&category=1`
				})
			},
			selectV(e){
				//1进行中2已完成3已撤销   0 1 2 
				this.page=1;
				this.list=[];
				this.status = e==1?2:e==2?3:1;
				this.getList();
				setTimeout(()=>{
					this.showNav=!this.showNav
				},200)
				console.log(e);
			},
			selectNa(e){
				//1买单2卖单
				this.navIndex=e;
				this.type = e==1?2:1
				this.page=1;
				this.list=[];
				this.status=0;
				this.getList();
			},
			selectNav(){this.showNav=!this.showNav},
			back(){uni.navigateBack({delta:1})}
		}
	}
</script>
<style>
	page{
		position: relative;
		width: 100%;
		height: 100vh;
	}
</style>
<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.index-top-right{
		color: $white;
		padding-right: 30upx;
		display: flex;
		justify-content: end;
	}
	.no-data{
		margin-top: 130upx;
		text-align: center ;
		image{
			margin: 0 auto;
			width: 620upx;
			height: 620upx;
			flex-shrink: 0;
		}
	}
	.mask{
		content: "";
		position: fixed;  
		top:0;  
		left:0;  
		z-index:1;  
		width:100%;  
		height:100vh;  
		background:rgba(0,0,0,0.4); 
	}
	.index-title-top{
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #1B2640;
		color: $white;
		padding: 0 30upx;
		view{
			// flex: 1;
			&:last-of-type{
				font-size: 28upx;
			}
		}
	}
	.popule-nav{
		position: fixed;
		z-index: 2;
		right: 20upx;
		top: 170upx;
		width: 250upx;
		.popule-nav-content{
			position: relative;
			padding-top: 30upx;
			.popule-nav-contents{
				background-color: $page-bg-color5;
				border-radius: 20upx;
				view{
					text-align: center;
					line-height: 80upx;
					font-size: 28upx;
					color: $white;
					border-bottom: 1upx solid $split-line-color1;
					&:last-of-type{
						border-bottom: none;
					}
					&.active{
						color: $theme-color;
					}
				}
			}
			&::before{
				position: absolute;
				width: 0; 
				height: 0;
				right: 10upx;
				top:-15upx;
				content: "";
				border-width: 30upx;
				border-style: solid;
				border-color: transparent $page-bg-color5 transparent transparent;
				transform: rotate(90deg); /*顺时针旋转90°*/
				
			}
		}
		
	}
	.list-nav{
		background-color: #1B2640;
		display: flex;
		align-items: center;
		view{
			flex: 1;
			text-align: center;
			position: relative;
			color: $white;
			&.active{
				color: $theme-color;
				font-size: 34upx;
				padding: 20upx 0;
				&::after{
					position: absolute;
					content:"";
					background-color: #1B2640;
					width: 60upx;
					height: 3upx;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
				}
			}
			
		}
	}
	.list-content{
		.list-item{
			background-color: #1B2640;
			margin-top: 20upx;
			.list-item-time{
				line-height: 72upx;
				padding-left: 30upx;
				font-size: 26upx;
				color: $text-gray-color1;
				border-bottom: 1upx solid $split-line-color1;
			}
			.list-item-content{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding:  40upx 30upx;
				border-bottom: 1upx solid $split-line-color1;
				._left{
					view{
						font-size: 26upx;
						color: $text-gray-color1;
						text{
							color: $white;
						}
						&:first-of-type{
							margin-bottom: 34upx;
						}
					}
				}
				._right{
					text{
						color: $text-gray-color1;
						font-size: 26upx;
						margin-bottom: 16upx;
					}
					view{
						font-weight: bold;
						font-size:48upx;
						color: $theme-color;
					}
				}
			}
			.list-item-bottom{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24upx 30upx;
				line-height: 60upx;
				text{
					font-size: 34upx;
					color: $theme-color;
					font-weight: bold;
					line-height: 60upx;
					flex: 1;
				}
				button{
					background: $button-color;
					font-size: 30upx;
					color: #E9E9F4;
					width: 180upx;
					height: 60upx;
					line-height: 60upx;
					text-align: center;
					border-radius:6upx;
					&.active{
						background: #58627D;
						color: $theme-color;
					}
				}
			}
		}
	}
</style>
