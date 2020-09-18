<template>
	<view class="">
		<u-navbar :is-back="true" 
		:title="i18n.Participation_Details" 
		backIconColor="#ffffff"
		:background="background" titleColor="#ffffff">
		</u-navbar>
		<view class="title">
			<view class="title-info">
				<view class="item" :class="{'active':index==0}" @tap.stop="selectnav('0')">{{i18n.Pays}}</view>
				<view class="item" :class="{'active':index==1}" @tap.stop="selectnav('1')">{{i18n.Sell_orderss}}</view>
			</view>
		</view>
		<view class="list-content">
			<template v-if="list.length>0">
				<block v-for="(item,index) in list" :key="index">
					<view class="list-item" :class="{'animated bounceInUp fast':navIndex==1}" @tap.stop="jumpDetail(item)">
						<view class="list-item-time">{{i18n.release_times}}:{{item.time}}</view>
						<view class="list-item-content">
							<view class="_left">
								<view class="">
									{{i18n.quantity}} <text>{{item.num | formatParsefloat}} {{item.cyf_dd_token}}</text>
								</view>
								<view class="">
									{{i18n.price}} <text>{{item.price}} {{item.buy_token_id}}</text>
								</view>
							</view>
							<view class="_right">
								<text>{{i18n.total}}</text>
								<view class="">{{item.total}} {{item.buy_token_id}}</view>
							</view>
						</view>
						<view class="list-item-bottom">
							<text>{{i18n.completed}}</text>
							<!-- <template v-if="item.status==1">
								<button type="default" hover-class="active" @tap.stop="cancel(item)">撤单</button>
							</template> -->
						</view>
					</view>
				</block>		
			</template>
			<template v-else>
				<view class="no-data">
					<image src="../../static/imgs/nodata.png" mode="widthFix" lazy-load></image>
				</view>
			</template>
		</view>
		<load v-if="laoding"></load>
	</view>
</template>

<script>
	var timer;
	// import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import Load from '@/components/common/load.vue';
	import {mapGetters} from "vuex";
	export default {
		components:{
			// uniStatusBar,
			Load
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
		data() {
			return {
				background:'#1b2640',
				navIndex:0,
				laoding:false,
				index:0,
				list:[],
				type:4,
				curInfo:'',
				isCheck:false
			}
		},
		onLoad(e){
			console.log(e);
			this.curInfo = JSON.parse(e.info)
		},
		onShow(){
			forceUpdate(this.getLangType);
			this.page=1;
			this.list = []
			this.getList()
		},
		onPullDownRefresh() {
					//下拉刷新的时候请求一次数据
					// console.log('下拉了')
			this.page =1;
			this.list =[]
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
			jumpDetail(event){
				uni.navigateTo({
					url:`/pages/market/list-detail?info=${JSON.stringify(event)}&type=${this.type}&category=2`
				})
			},
			selectnav(val){
				this.type = val=='1'?3:4
				this.index=val;
				this.page =1;
				this.list =[]
				this.getList();
			},
			getList(){
				this.showLoad = true;
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					lang_type:this.getLangType=='chs'?1:2, 
					page: this.page,
					rows: 10,
					type: this.type
				}
				if(this.isCheck) return;
				this.isCheck = true;
				fetch('/api/shop/markert_list2', data, "post").then(res=>{
					this.showLoad = false;
					this.isCheck = false;
					if(res.data.data.length ==0){
						showToast(this.i18n.nodata)
						uni.hideNavigationBarLoading();
						return;
					}
					if(res.data.code){
						if(this.page ==1){
							this.page ++;
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
						}else{
							this.page ++;
							let lists = res.data.data;
							lists.forEach((item,index)=>{
								lists[index].total = ((parseInt((item.num*item.price)*100000000))/100000000).toFixed(4)
								this.curInfo.forEach((i,n)=>{
									if(item.buy_token_id==i.id){
										lists[index].title_en = i.title_en
									}
								})
								// lists[index].pcs = _self.i18n.BlockPackage
							})
							// this.day_sum = res.data.data.day_sum+"";
							this.list = this.list.concat(lists)
							// console.log(this.lists)
						}
					}
				}).catch(err=>{ 
					this.isCheck = true;
					this.showLoad = false;
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
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
	.title{
		background: #1b2640;
		color: $white;
		.title-text{
			line-height: 78upx;
			text-align: center;
		}
		.title-info{
			padding: 48upx 0 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.item{
				flex: 1;
				padding-bottom: 20upx;
				text-align: center;
				font-size: 34upx;
				color: $white;
				position: relative;
				&.active{
					color: $theme-color;
					&::after{
						content: "";
						position: absolute;
						left: 50%;
						bottom: 0;
						transform: translateX(-50%);
						height: 3upx;
						width: 160upx;
						background-color: $theme-color;
					}
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
						background: #8884B7;
						color: #0F0C39;
					}
				}
			}
		}
	}
</style>
