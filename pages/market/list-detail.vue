<template>
	<view>
	<!-- 	<uni-nav-bar
		statusBar="true"
		:fixed="true" 
		:border="false" 
		bgcolor="#181a29"
		backgroundColor="#181a29">
			<view class="index-title-top">
				<view @tap.stop="back"><i class="icon iconfont icon-fanhui"></i></view>
				<view>{{i18n.Order_Details}}</view>
				<view @tap.stop="cancel(info)" class="Cancel-order">{{(info.status==1 && category=='1') ?i18n.Cancelled:''}}</view>
			</view>
		</uni-nav-bar> -->
		
		<u-navbar :is-back="true" 
		titleColor="#ffffff" 
		:title="i18n.Order_Details" 
		backIconColor="#ffffff"
		:background="background">
			
			<!-- <view slot="right" @tap.stop="selectNav">{{i18n.filter}} <i class="icon iconfont " :class="[showNav?'icon-sanjiaoshang':'icon-sanjiaoxia']"></i></view> -->
			<view slot="right" @tap.stop="cancel(info)" class="Cancel-order">{{(info.status==1 && category=='1') ?i18n.Cancelled:''}}</view>
		</u-navbar>
		
		
		<view class="content">
			<view class="list">
				<view class="item"><view>{{i18n.order_status}}</view><text>{{info.status==3?i18n.Cancelled_order:info.status==1?i18n.transaction:i18n.completed}}</text></view>
				<view class="item" v-if="category=='1'"><view>{{i18n.Release_Type}}</view><view>{{type=='1'?i18n.Pay:i18n.Sell_orders}}</view></view>
				
				<view class="item" v-if="category=='2'">
					<view>{{i18n.Release_Type}}</view>
					<view>
					{{type=='3'?i18n.Pay:i18n.Sell_orders}}
					</view>
				</view>
				
				<view class="item"><view>{{i18n.Release_number}}</view><view>{{info.order_no}}</view></view>
				<view class="item"><view>{{category==1?i18n.Release_time:i18n.release_times}}</view><view>{{info.time}}</view></view>
			</view>
			
			<view class="list">
				
				<template v-if="category==1">
					<view class="item"><view>{{i18n.quantity}}</view><text>{{info.num  | formatParsefloat}} {{info.token_id_name}}</text></view>
					<view class="item"><view>{{i18n.price}}</view><view>{{info.price}} {{info.buy_token_id_name}}</view></view>
				</template>
				
				<template v-if="category==2">
					<view class="item"><view>{{i18n.quantity}}</view><text>{{info.num  | formatParsefloat}} {{info.token_id}}</text></view>
					<view class="item"><view>{{i18n.price}}</view><view>{{info.price}} {{info.buy_token_id}}</view></view>
				</template>
				
				<view class="item" v-if="category=='1'"><view>{{i18n.total}}</view><view>{{info.total}} {{info.buy_token_id_name}}</view></view>
			</view>
			
			<view class="list" v-if="info.cnum">
				<view class="item"><view>{{i18n.Already_bought}}</view><text>{{(info.num-info.cnum) | formatParsefloat}} {{info.token_id_name}}</text></view>
				<view class="item" ><view>{{i18n.The_remaining_amount}}</view><view>{{info.cnum | formatParsefloat}} {{info.token_id_name}}</view></view>
			</view>
			
			<view class="list" v-if="category=='2'">
				<view class="item"><view>{{i18n.get}}:</view><text>{{(info.cyf_dd_num) | formatParsefloat}} {{info.cyf_dd_token}}</text></view>
				<view class="item"><view>{{i18n.Consume}}:</view><view>{{info.cyf_xh_num | formatParsefloat}} {{info.cyf_xh_token}}</view></view>
			</view>
			
		</view>
			<view class="transaction-record" v-if="category=='1'">
				<view class="record-title">{{i18n.Transaction_Details}}</view>
				<template v-if="list.length>0">
					<block v-for="(item,index) in list" :key="index">
						<view class="record-list">
							<view class="record-list-title">
								<text>{{i18n.Closing_time}}:{{item.time}}</text>
								<text>{{item.typeStr}}</text>
							</view>
							<view class="record-list-content">
								<view class="_left">
									<view>{{i18n.quantity}}<text>{{item.num | formatParsefloat}} {{item.token_id}}</text></view>
									<view>{{i18n.participants}}<text>{{item.buyuid}}</text></view>
									<view>{{i18n.get}} :<text>{{item.ddf_dd_num}} {{item.ddf_dd_token}}</text></view>
								</view>
								<view class="_right">
									<text>{{i18n.total_amount}}</text>
									<view>{{(parseInt(item.num*item.price*100000000))/100000000}} {{item.buy_token_id}}</view>
								</view>
							</view>
						</view>
					</block>
				</template>
				<template v-else>
					<view>{{i18n.nodata}}</view>
				</template>
			</view>
		
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from "vuex";
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js'
	import Load from '@/components/common/load.vue';
	// import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	let timer=null;
	export default {
		data() {
			return {
				background:'#001434',
				type:'',
				info:{},
				page:1,
				list:[],
				category:'',
				showLoad:false
			}
		},
		onPullDownRefresh() {
			//下拉刷新的时候请求一次数据
			// console.log('下拉了')
			if(this.category==1){
				this.page =1;
				this.list =[]
				this.getList();
			}
		},
		onReachBottom() {
			if(this.category==1){
				let _self = this
					//触底的时候请求数据，即为上拉加载更多
					//为了更加清楚的看到效果，添加了定时器
				if (timer != null) {
					clearTimeout(timer);
				}
				timer = setTimeout(function() {
					_self.getList();
				}, 1000);
			}	
					// 正常应为:
					// _self.getmorenews();
		},
		onLoad(event){
			console.log(event);
			this.type = event.type;
			this.info = JSON.parse(event.info)
			console.log(this.info);
			this.category = event.category;
			if(this.category==1){
				this.page =1;
				this.list =[]
				this.getList();
			}
		},
		components:{
			Load
			// ,uniNavBar
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
				'getLoginInfo'
			]),
		},
		onShow(){
			forceUpdate(this.getLangType);
		},
		methods:{
			cancel(item){
				let _self = this;
				let data = {
					id:_self.getLoginInfo.id,
					token:_self.getLoginInfo.token,
					lang_type:_self.getLangType=='chs'?1:2,
					market_id:item.id
				}
				uni.showModal({
				    title: _self.i18n.prompt,
				    content:  _self.i18n.prompt01,
				    success: function (re) {
				        if (re.confirm) {
							_self.showloading = true;
							fetch('/api/shop/marketCx',data,'POST')
								.then(res=>{
									_self.showloading = false;
									showToast(res.data.msg)
									if(res.data.code){
										setTimeout(()=>{
											uni.navigateBack({
												delta:1
											})
										},500)
									}
								})
								.catch(err=>{
									_self.showloading = false;
									showToast(err.data.msg)
								})
				        } else if (re.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			selectNav(){
				showToast(this.i18n.Cancelled)
			},
			back(){uni.navigateBack({delta:1})},
			getList(){
				this.showLoad = true;
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					lang_type:this.getLangType=='chs'?1:2, 
					page: this.page,
					rows: 10,
					order_no:this.info.order_no
				}
				fetch('/api/shop/myMarketCy', data, "post")
					.then(res=>{
						this.showLoad = false;
						if(res.data.data.length==0){
							showToast(this.i18n.nodata)
							uni.hideNavigationBarLoading();
							return;
						}
						if(res.data.code){
							if(this.page ==1){
								this.page ++;
								uni.stopPullDownRefresh();
								this.list = res.data.data;
							}else{
								this.page ++;
								let lists = res.data.data;
								lists.forEach((item,index)=>{
									lists[index].num = item.num
								})
								this.list = this.list.concat(lists)
							}
						}
					})
					.catch(err=>{
						this.showLoad = false;	
					})
					
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.Cancel-order{
		padding: 0 30upx 0 0;
		color: $theme-color;
		font-size: 28upx;
	}
	.content{
		.list{
			margin-top: 20upx;
			background-color: $page-bg-color5;
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: $white;
				font-size: 30upx;
				line-height: 120upx;
				height: 120upx;
				padding: 0 30upx;
				border-bottom: 1upx solid $split-line-color1;
				&:last-of-type{
					border-bottom: none;
				}
				text{
					color:$theme-color;
				}
			}
		}
	}
	.transaction-record{
		.record-title{
			font-size: 36upx;
			color: $white;
			padding: 0 30upx;
			line-height: 116upx;
		}
		.record-list{
			background-color: $page-bg-color5;
			margin-bottom: 20upx;
			.record-list-title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30upx;
				border-bottom: 1upx solid $split-line-color1;
				text{
					line-height: 72upx;
					height: 72upx;
					font-size: 26upx;
					color: $text-gray-color1;
				}
			}
			.record-list-content{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 40upx 30upx;
				._left{
					font-size: 26upx;
					color: $text-gray-color1;
					text{
						&:first-of-type{
							margin-bottom: 24upx;
						}
						margin-left: 10upx;
						color: $white;
					}
				}
				._right{
					text{
						font-size: 26upx;
						color: $text-gray-color1;
						display: block;
						text-align: right;
					}
					view{
						color: $theme-color;
						font-size: 48upx;
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
