<template>
	<view class="content">
		<view class="min-top-img">
				<image src="../../static/imgs/miner-top.png" mode="widthFix" lazy-load></image>
			</view>
		<!-- #ifdef APP-PLUS -->
		<uni-status-bar bgcolor="transparent"></uni-status-bar>
		<!-- #endif -->
		<view class="miner-top">
			<image src="../../static/imgs/miner-bg.png" mode="widthFix" lazy-load></image>
			<view class="miner-top-l">
				<text>{{i18n.Cumulative_dynamic_income}}</text>
				<view>
					{{dt_sy?dt_sy:0}}
				</view>
			</view>
			<view class="miner-top-r" @tap.stop="toRecord">
				<i class="icon iconfont icon-dingdan"></i>
				{{i18n.Purchase_History}}
			</view>
		</view>
		<view class="miner-nav">
			<view class="miner-nav-item" :class="{'active':navIndex==0}" @tap.stop="selectNav('0')">
				{{i18n.Buy_miner}}
			</view>
			<view class="miner-nav-item" :class="{'active':navIndex==1}" @tap.stop="selectNav('1')">
				{{i18n.Lease_computing_power}}
			</view>
		</view>
		<block v-for="(item,index) in list" :key="index">
			<view class="miner-list animated backInLeft fast" :class="[navIndex==0?'nex-bg':'one-bg']">
				<view class="miner-list-title">
					<view>{{item.title}}</view>
					<text>{{navIndex==0?i18n.Trust_period:i18n.Lease_by_time}}：{{item.th_day}}{{i18n.day}}</text>
				</view>
				<view class="miner-list-co">
					<view class="miner-list-co-l">
						<view>{{item.rcb | formatParsefloat}} FIL/T</view>
						<text>{{i18n.Hashing_power_of_the_last_trading_day}}({{item.coin_name}})</text>
					</view>
					<view class="miner-list-co-r">
						<u-button 
						@click="selectInfo(item)"
						:customStyle="somebuttomn" 
						:ripple="true" rippleBgColor="#28f09e">{{item.price | formatParsefloat}} USDT {{navIndex==0?i18n.buy:i18n.lease}}</u-button>
						<!-- <view>原价：500USDT</view> -->
					</view>
				</view>
			</view>
		</block>
		
		<view class="popule" v-if="showpopule" :class="{'animated bounceInUp ':showpopule}" @tap.stop="closet">
			<view class="popule-content" @tap.stop="''">
				<view class="popule-list">
					<view>{{info.title}}</view>
					<text>{{i18n.price}}：{{info.price}}{{info.type==1?`USDT/${i18n.station}`:'USDT/T'}}</text>
				</view>
				<view class="popule-list popule-list-lac" v-if="info.type==1">
					<text>T{{i18n.value}}：{{info.th}} T/{{i18n.station}}</text>
				</view>
				<!-- <view class="popule-list-real">
					<text>{{i18n.Actual_price_paid}}</text>
					<view>{{normal}}</view>
				</view> -->
				<view class="popule-num-content">
					<text v-if="info.type==1">{{i18n.Buy_by_quantity}}（{{i18n.station}}）</text>
					<text v-if="info.type==2">{{i18n.Lease_by_quantity}}（T）</text>
					<view class="popule-num">
						<button type="default" @tap.stop="less" hover-class="active">-</button>
						<input type="number" v-model="num">
						<button type="default" @tap.stop="add" hover-class="active">+</button>
					</view>
				</view>
				<view class="popule-list-real" v-if="info.type==1">
					<text>{{i18n.Total_T_value}}:</text>
					<view>{{num*info.th}}</view>
				</view>
				<view class="popule-list-real">
					<text>{{i18n.total}}</text>
					<view v-if="info.type==1">{{num*info.price | formatParsefloat}} USDT</view>
					<view v-if="info.type==2">{{num*info.price}} USDT</view>
				</view>
				<view class="popule-meg">
					<text>{{i18n.AvailableBalance}}：</text>
					<view >{{usdt_balance ?(usdt_balance | formatParsefloat):0}} USDT</view>
				</view>
				<view class="popule-nav">
					<view>
						<button type="default" hover-class="active" @tap.stop="closet">{{i18n.cancel}}</button>
					</view>
					<view>
						<button type="default" hover-class="active" :loading="loadings" @tap.stop="comfirm">{{i18n.Place_an_order}}</button>
					</view>
				</view>
			</view>
		</view>
		<load v-if="loadings"></load>
		<pay-pwd 
		:maxlength="6" 
		:isPwd="true" 
		:isSHow="showpwd" 
		:isShows="isshows"
		:isShowss="showss"
		@close="close"
		@input-again="inputAgain"
		@finish="finish"></pay-pwd>
		<message
		:shows="showMess" 
		:message="message"
		@jump="closeMess"
		@close="closeMess"></message>
	</view>
</template>

<script>
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	import Message from '@/components/common/message.vue';
	import payPwd from '@/components/pay-pwd/pay-pwd.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters, mapMutations} from 'vuex';
	export default {
		components:{
			Message,payPwd,uniStatusBar
		},
		data() {
			return {
				dt_sy:0,
				loadings:false,
				showpopule:false,
				showpwd:false,
				shows:false,
				showss:false,
				isshows:false,
				showMess:false,  //弹窗
				navIndex:0,
				list:[],
				num:1,
				info:{},
				balace_info:{},
				somebuttomn:{
					'padding':'10px !important',
					background:'linear-gradient(to right, #29F19C, #02A1F9)',
					color:'#ffffff',
					'line-height':'16px !important',
					height:'110rpx !important',
					'font-size':'16px !important'
				},
				type:1,
				usdt_balance:'',
				message:''
			};
		},
		computed:{
			normal(){
				if(this.num){
					return ((this.info.use_cpd)*this.num+'CPD +'+(this.info.use_usdt*this.num))+'USDT + '+this.num*this.info.use_voucher+this.i18n.computing_power_tip03;
				}else{
					return '0CPD'
				}
			},
			i18n() {
				return this.$t('message')
			},
			...mapGetters(['getLoginInfo','getLangType']),
			formatParsefloat(val){
				if ((!val && val != 0) || val == null || val == undefined || val == 'undefined') {
					return 0
				}
				return parseFloat(val)
			}
		},
		onShow(){
			this.showpwd = false
			this.isShows = false
			this.isShowss = false
			this.showMess = false
			this.showpopule = false
			this.shows = false
			this.showss = false
			this.isshows = false
			
			this.getSpoc()
			uni.showTabBar({ 
				animation:true,
				success:function(res){
					console.log(res);
				}
			})
		},
		methods:{
			selectInfo(info){
				console.log(info);
				this.info = info
				this.closet();
			},
			getSpoc(){
				fetch('/api/shop/spockj_list',{},'post')
					.then(res=>{
						if(res.data.code==1){
							this.dt_sy = res.data.data.dt_sy
							this.usdt_balance = res.data.data.usdt_balance
							let list = res.data.data.list
							this.list = list.filter(item=>{
								return item.type==this.type
							})
							console.log(this.list);
						}
					})
			},
			closet(){
				// this.showpopule =false;
				if(this.showpopule==false){
					this.num = 1
					this.showpopule = true;
					uni.hideTabBar({
						animation:true,
						success:function(res){
							console.log(res);
						}
					})
				}else{
					this.num = 1
					uni.showTabBar({
						animation:true,
						success:function(res){
							console.log(res);
						}
					})
					this.showpopule = false;
				}
			},
			comfirm(){
				if(!this.getLoginInfo.paypwd){
					this.showMess = true;
					this.showpopule = false;
					this.message = this.getLangType=='chs'?'请先设置交易密码':'Please set transaction password first'
					return 
				}
				if(this.info.type==1){
					if(parseInt(this.usdt_balance)<parseInt(this.info.price)){
						// showToast('余额不足');
						this.showMess = true;
						this.showpopule = false;
						this.message = this.getLangType=='chs'?'余额不足':'Insufficient balance'
						return
					}
				}else{
					if(parseInt(this.usdt_balance)<parseInt(this.num*this.info.price)){
						// showToast('余额不足');
						this.showMess = true;
						this.showpopule = false;
						this.message = this.getLangType=='chs'?'余额不足':'Insufficient balance'
						return
					}
				}
				
				this.showpopule = false;
				this.showpwd = true;
				// this.showpopule =true;
				
			},
			less(){
				if(this.num>1){
					this.num--;
					return
				}
				this.num=1
				
			},
			add(){
				this.num++
			},
			closeMess(){
				setTimeout(()=>{
					this.showMess = !this.showMess
					if(this.showMess == false){
						uni.showTabBar({
							animation:true,
							success:function(res){
								console.log(res);
							}
						})
					}else{
						uni.hideTabBar({
							animation:true,
							success:function(res){
								console.log(res);
							}
						})
					}
					
				},500)
				
			},
			selectNav(index){
				this.navIndex=index
				this.type=parseInt(index)+1
				this.getSpoc();
			},
			toRecord(){
				uni.navigateTo({
					url:'/pages/miner/mining'
				})
			},
			close(val){
				if(val==1){
					this.shows = false;
					this.showss = false;
					this.showpwd = false;
					this.loadings = false;
					uni.showTabBar({
						animation:true,
						success:function(res){
							console.log(res);
						}
					})
				}else{
					this.shows = val;
					this.showpwd = val;
					this.showss = val
					uni.showTabBar({
						animation:true,
						success:function(res){
							console.log(res);
						}
					})
				}
			},
			inputAgain(val){
				this.shows = false;
				this.showpwd = true;
				this.loadings = false;
			},
			finish(val){
				this.loadings = false;
				let data = {
					shopid:this.info.id,
					num:this.num*this.info.th,
					paypwd:val,
					token_id:3
				}
				this.laoding = true;
				if(this.isCheck) return;
				this.isCheck = true;
				fetch('/api/shop/spoc_buy',data,'POST')
					.then(res=>{
						this.isCheck = false;
						this.laoding = false;
						// showToast(res.data.msg)
						if(res.data.code==1){
							this.showpopule = false;
							this.showMess = true;
							this.showpwd = false;
							this.message = res.data.msg
							this.showss=false;
							this.isshows=false;
							// :isShows="isshows"
							// :isShowss="showss"
							
							this.getPower();
							this.num = 1;
							// this.yzm=''
						}else{
							this.isshows = false;
							this.showss = false;
							this.showpwd = false;
							if(res.data.msg=='支付密码错误！'){
								this.isshows = true;
							}else if(res.data.msg=='usdt不足'){
								this.isshows = false;
								this.showpwd = false;
								this.showss = true;
							}else{
								this.message = res.data.msg
								this.showMess = true;
							}
						}
					})
					.catch(err=>{
						this.isCheck = false;
						this.laoding = false;
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.min-top-img{
		position: absolute;
		left: 0;
		top: 0;
		width: 750upx;
		height: 409upx;
		z-index: -1;
		image{
			width: 750upx;
			height: 409upx;
			flex-shrink: 0;
		}
	}
	.content{
		padding: 0 30upx;
		.miner-top{
			margin-top: 20upx;
			position: relative;
			display: flex;
			justify-content: space-between;
			padding: 72upx 26upx 0;
			height: 300upx;
			.miner-top-l{
				text{
					color: $white;
					font-size: 26upx;
				}
				view{
					margin-top: 30upx;
					font-size: 64upx;
					font-weight: bold;
					color: $white;
					width: 450upx;
					word-break:break-all;
				}
			}
			.miner-top-r{
				color: $white;
				display: flex;
				font-size: 26upx;
			}
			image{
				width: 690upx;
				position: absolute;
				z-index: -1;
				left: 0;
				top: 0;
				height: 300upx;
				flex-shrink: 0;
			}
		}
		.miner-nav{
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 70upx 0 48upx;
			.miner-nav-item{
				color: $white;
				&:first-of-type{
					margin-right: 144upx;
				}
				&.active{
					color: $theme-color;
					position: relative;
					&::after{
						position: absolute;
						width: 40upx;
						height: 4upx;
						background-color: $theme-color;
						content: "";
						left: 50%;
						bottom: -20upx;
						transform: translateX(-50%);
					}
				}
			}
		}
		.miner-list{
			margin: 0 0 20upx;
			background-size: 100%;
			background-repeat: no-repeat;
			&.one-bg{
				background-image: url(/static/imgs/miner-list-0.png);
			}
			&.nex-bg{
				background-image: url(/static/imgs/miner-list-1.png);
			}
			.miner-list-title{
				padding: 0 30upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1upx solid $split-line-color1;
				color: $white;
				view{
					line-height: 100upx;
					font-size: 32upx;
				}
				text{
					font-size: 26upx;
				}
			}
			.miner-list-co{
				padding: 30upx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.miner-list-co-l{
					flex: 1;
					view{
						font-size: 56upx;
						font-weight: bold;
						color: $white;
						margin-bottom: 46upx;
					}
					text{
						color: #516986;
						font-size: 26upx;
					}
				}
				.miner-list-co-r{
					margin-left: 40upx;
					width: 200upx;
					view{
						margin-top: 18upx;
						font-size: 23upx;
						color: $white;
						text-decoration: line-through;
					}
				}
			}
		}
	}
	.popule{
		position: fixed;
		top:0;  
		left:0;  
		z-index:8;  
		width:100%;  
		height:100vh;  
		background:rgba(0,0,0,0.4); 
		.popule-content{
			width: 750upx;
			position: fixed;
			z-index: 9;
			left: 0;
			bottom: 0;
			padding: 60upx 60upx 40upx;
			background-color: $page-bg-color5;
			border-top-left-radius: 30upx;
			border-top-right-radius: 30upx;
			.popule-list{
				padding-bottom: 40upx;
				// border-bottom: 1upx solid $split-line-color1;
				view{
					font-size: 36upx;
					font-weight: bold;
					padding-bottom: 25upx;
					color: $white;
				}
				text{
					font-size: 26upx;
					color: $text-gray-color1;
				}
				&.popule-list-lac{
					text{
						font-size: 30rpx;
						color: $white;
					}
				}
			}
			.popule-list-real{
				padding: 20upx 0 10upx;
				text{
					font-size: 26upx;
					color: $text-gray-color1;
				}
				view{
					margin-top: 10upx;
					font-size: 46upx;
					font-weight: bold;
					color: $white;
				}
			}
			.list{
				padding: 20upx 0 0;
				color: $white;
				&:last-of-type{
					.input-item{
						border-bottom: none;
					}
				}
				.title{
					font-size: 30upx;
					color: $white;
					background: #1d184f;
				}
				.input-item{
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1upx solid $split-line-color1;
					input{
						line-height: 88upx;
						height: 88upx; 
						font-size: 28upx;
					}
					text{
						font-size: 28upx;
					}
				}
			}
			.popule-num-content{
				text{
					font-size: 26upx;
					color: $text-gray-color1;
				}
				.popule-num{
					margin-top: 15upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 475upx;
					line-height: 80upx;
					height: 80upx;
					border: 1upx solid $split-line-color1;
					border-radius: 8upx;
					overflow: hidden;
					button{
						&:first-of-type{
							border-right: 1upx solid $split-line-color1;
						}
						&:last-of-type{
							border-left: 1upx solid $split-line-color1;
						}
						&.active{
							background: #8884B7;
							color: $text-gray-color1;
						}
						font-size: 60upx;
						border-radius: 0; 
						width: 80upx;
						height: 80upx;
						color: $white;
						line-height: 80upx;
						text-align: center;
						font-weight: normal;
						background-color: $theme-color;
					}
					input{
						font-size: 40upx;
						font-weight: normal;
						flex: 1;
						line-height: 80upx;
						color:$white;
						text-align: center;
					}
				}
			}
			.popule-voucher{
				padding: 30upx 0;
				text{
					font-size: 26upx;
					color: $text-gray-color1; 
				}
				.popule-voucher-content{
					border-radius: 8upx;
					margin-top: 22rpx;
					background: $button-color;
					padding: 16upx 40upx;
					font-size: 36upx;
					font-weight: normal;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: $white;
					view{
						font-weight: bold;
					} 
					text{
						color: $white;
						font-size: 36upx;
						font-weight: bold;
					}
				}
			}
			.popule-meg{
				padding: 20upx 0;
				color: $white;
				text{
					font-size: 26upx;
					color: $white;
				}
			}
			.popule-nav{
				display: flex; 
				justify-content: space-between;
				align-items: center;
				padding: 10upx 0 0;
				view{
					flex: 1;
					text-align: center;
					&:first-of-type{
						button{
							background: $button-default-color;
						}
					}
					&:last-of-type{
						button{
							background: $button-color;
						}
					}
					button{
						width: 240upx; 
						line-height: 72upx;
						height:72upx;
						text-align: center;
						color: $white;
						font-size: 34upx;
						font-weight: bold;
						&.active{
							background: #8884B7;
							color: #0F0C39;
						}
					}
				}
			}
		}
	}
</style>
