<template>
	<view class="app-ecology">
		
		<u-navbar 
		:is-back="true" 
		title="我的矿机" 
		:background="background" 
		backIconColor="#000000"
		titleColor="#000000">
			
		<!-- 	<view slot="right" class="right-nav-color" hover-class="active" @tap.stop="pages">
				收益记录
			</view> -->
		</u-navbar>
		<view class="mining-top">
			<view class="mining-top-item">
				<text>{{i18n.income_investment}}</text>
				<view>{{topInfo.hour_income || 0 }}</view>
			</view>
			<view class="mining-top-item">
				<text>{{i18n.Total_revenue}}</text>
				<view>{{topInfo.all_income || 0}}</view>
			</view>
			<!-- <view class="mining-top-item">
				<text>余额(ETH)</text>
				<view>{{topInfo.balance}}</view>
			</view> -->
		</view>
	<!-- 	<view class="mining-top-list">
			<view class="mining-top-list-item">
				<text>活动矿机数</text><text>{{topInfo.a}}台</text>
			</view>
			<view class="mining-top-list-item">
				<text>累计矿机数</text><text>{{topInfo.b}}台</text>
			</view>
		</view> -->
		
		
		<view class="content">
			
			<view class="content-nav">
				<view class="content-nav-item" @tap.stop="ChangeNav('0')" :class="{'active':navIndex==0}">{{i18n.Financial_income}}</view>
				<view class="content-nav-item" @tap.stop="ChangeNav('1')" :class="{'active':navIndex==1}">{{i18n.income_investments}}</view>
				<!-- <view class="content-nav-item" @tap.stop="ChangeNav('2')" :class="{'active':navIndex==2}">待确认</view>
				<view class="content-nav-item" @tap.stop="ChangeNav('3')" :class="{'active':navIndex==3}">已驳回</view> -->
			</view>
			
			
			<block v-for="(item,index) in list" :key="index">
				<view class="list">
					<view class="list-t">
						<view class="title">{{item.typeStr}}</view>
						<view class="time">{{item.time}}</view>
					</view>
					<view class="list-r">
						<view class="status">{{item.status==1?'未结算':'已结算'}}</view>
						<view class="prise">{{Nums}}<text>USDT</text></view>
					</view>
					
					<!-- <image class="list-bg" :src="'../../static/image/ming'+(item.shop_id-1)+'.png'" mode="widthFix" lazy-load></image> -->
					<!-- <view class="list-title-ti">
						<text v-if="navIndex==0">{{i18n.Current_status}}:正常</text>
						<text v-if="navIndex!=0">{{i18n.Current_status}}:{{navIndex==1?'待付款':navIndex==2?"待确认":'已驳回'}}</text>
					</view>
					<view class="list-title">
						<view :style="{'color':item.shop_id==1?'#FED094':item.shop_id==2?'#21A8F6':item.shop_id==3?'#0DC9FF':'#3F4EAE'}">{{item.title}}</view>
						<view class="">
							<text>购买日:{{item.time}}</text> -->
							<!-- <text>产出到账:{{item.dtime}}</text> -->
							<!-- <text>订单编号:{{item.tradeid}}</text>
						</view>
					</view> -->
					<!-- <view class="list-li">
						<view class="list-li-item">
							<view :style="{'color':item.shop_id==1?'#FF4539':item.shop_id==2?'#27ce8a':item.shop_id==3?'#FCD45F':'#E67B2D'}">{{item.th_day}} 天</view>
							<text>服务周期</text>
						</view>
						<view class="list-li-item">
							<view :style="{'color':item.shop_id==1?'#FF4539':item.shop_id==2?'#27ce8a':item.shop_id==3?'#FCD45F':'#E67B2D'}">{{item.all_price}}</view>
							<text>购置成本(CNY)</text>
						</view>
						<view class="list-li-item">
							<view :style="{'color':item.shop_id==1?'#FF4539':item.shop_id==2?'#27ce8a':item.shop_id==3?'#FCD45F':'#E67B2D'}">{{item.num | formatParsefloat}}</view>
							<text>购买数量</text>
						</view>
					</view> -->
					<!-- <template v-if="type==1">
						<view class="list-li">
							<view class="list-li-item">
								<view :style="{'color':item.shop_id==1?'#FF4539':item.shop_id==2?'#27ce8a':item.shop_id==3?'#FCD45F':'#E67B2D'}">{{item.income}}</view>
								<text>挖矿收益(ETH)</text>
							</view>
							<view class="list-li-item">
								<view :style="{'color':item.shop_id==1?'#FF4539':item.shop_id==2?'#27ce8a':item.shop_id==3?'#FCD45F':'#E67B2D'}">{{item.dtime}}</view>
								<text>截止时间</text>
							</view>
							<view class="list-li-item">
								<view :style="{'color':item.shop_id==1?'#FF4539':item.shop_id==2?'#27ce8a':item.shop_id==3?'#FCD45F':'#E67B2D'}">{{item.install_day}}</view>
								<text>装机时间(天)</text>
							</view>
						</view>
					</template> -->
					
					
					<!-- <view class="list-li-btn" v-if="type==1">
						<button type="default"  hover-class="active" @tap.stop="signature(item)">{{item.sign?'查看详情':'立即签名'}}</button>
					</view>
					<view class="list-li-btn" v-if="type==2">
						<button type="default"  hover-class="active" @tap.stop="Deliver(item)">前往付款</button>
					</view> -->
				</view>
			</block>
			<view class="nodata" v-if="noMores">
				{{i18n.No_more}}~
			</view>
		</view>
		<view class="nodata" v-if="list.length == 0">
			<image src="../../static/imgs/nodata.png" mode="widthFix" lazy-load></image>
		</view>
	</view>
</template>

<script>
	import {showToast,pageto,fetch,pageback,forceUpdate} from "../../common/js/util.js";
	import {mapGetters,mapMutations} from "vuex";
	import Load from '@/components/common/load.vue';
	import payPwd from '@/components/pay-pwd/pay-pwd.vue';
	import Message from '@/components/common/message.vue';
	var _self;	
	export default {
		data() {
			return {
				navIndex:0,
				background:{
					background:"linear-gradient(to right, #092FEE, #145AC2)"
				},
				laoding:false,
				list: [],
				buy_status:'',
				num1:'',
				num2:'',
				hy_qb:"",
				zj_qb:'',
				balace_info:{},
				loadings:false,
				showMesg:'',
				showPo:false,
				firCheck:false,
				lasCheck:false,
				noInput1:true,
				noInput2:true,
				showpopule:false,
				num:1,
				shows:false,
				isshows:false,
				showss:false,
				showMess:false,
				page:1,
				type:1,
				topInfo:{},
				noMores:false,
				rows:1,
				types:60,
				Nums:0
			}
		},
		computed: {
			formatParsefloat(val){
				if ((!val && val != 0) || val == null || val == undefined || val == 'undefined') {
					return 0
				}
				return parseFloat(val)
			},
			remaleNum(){
				if(this.num1 && !this.num2){
					return this.num1?(this.num1)+'ETHQ':'0 ETHQ';
				}else if(!this.num1 && this.num2){
					return this.num2?(this.num2)+'ETHQ':'0 ETHQ';
				}else if(this.num1 && this.num2){
					return this.num1+'ETHQ + '+this.num2+'ETHQ'
				}else{
					return '0 ETHQ'
				}
			},
			i18n () {
				return this.$t('message')
			},
			...mapGetters([
				'getLoginInfo',
				"getTextArr",
				'getLangType',
				'getRequestUrl'
			])
		},
		onShow() {
			this.noMores = false;
			this.navIndex = 0;
			forceUpdate(this.getLangType);
			this.page = 1;
			this.list =[]
			this._getList();
			this.getType();
			console.log(this.list,"listlist")
		},
		onReachBottom(){
			this._getList();
		},
		methods:{
			...mapMutations(['setCurInfo']),
			signature(item){
				this.setCurInfo(item)
				uni.navigateTo({
					url:'./info-detail'
				})
			},
			ChangeNav(index){
				this.navIndex = index
				this.type = Number(index)+1
				this.page = 1;
				this.list =[]
				this._getList();
			},
			toModifypwd(){},
			Deliver(item){
				// this.balace_info = item;
				// this.showpopule = !this.showpopule
				this.setCurInfo(item)
				uni.navigateTo({
					url:'./info'
				})
			},
			
			changeChecked(e){
				let value = e.detail.value
				if(value.includes('wallet')){
					this.firCheck = true
				}else{
					this.firCheck = false
					console.log('123123');
					this.num1=''
				}
				if(value.includes('contract')){
					this.lasCheck = true
				}else{
					this.lasCheck = false
					this.num2=''
				}
			},
			getType(){
				fetch('/api/index/index','','post')
					.then(res=>{
						this.tabInfo = res.data.data.zd_type;
					})
					.catch(err=>{
						console.log(err.data.msg);
					})
			},
			clickClose() {
				pageback()
			},
			pages(){
				console.log(this.tabInfo);
				if(this.tabInfo){
					pageto(`/pages/bill/bili?tab=${JSON.stringify(this.tabInfo)}&type=61`)
				}
			},
			getTo(e){
				pageto(`/pages/${e}/${e}`);
			},
			_updataTabBar() {
				_updataTabBar(this.getTextArr, this.getLangType);
			},
			_getList() {
				let data={
					type:this.navIndex==1?61:60,
					page:this.page,
					rows:10
				}
				fetch('/api/ytc/userwealth',data,'post').then(res=>{
					this.topInfo.hour_income = res.data.data.total
					this.topInfo.all_income = res.data.data.revenue
					console.log(res.data.code,"code")
					if(res.data.code==1){
						if(res.data.data.record.length==0)
						if(res.data.data.record.length<10){
							this.noMores = true;
							return
						}
						if(this.page==1){
							this.list = res.data.data.record;
							this.page++;
							this.list.forEach((item,index)=>{
								let res =this.list[index].num;
								this.Nums=parseInt(res)
							})
						}else{
							this.list = this.list.concat(res.data.data.record)
						}
					}
				})
			},
			getmima(e) {
				console.log(e)
				this.mima = e;
			},
			add0(m){return m<10?'0'+m:m },
			format(shijianchuo){
			//shijianchuo是整数，否则要parseInt转换
			var time = new Date(shijianchuo);
			var y = time.getFullYear();
			var m = time.getMonth()+1;
			var d = time.getDate();
			var h = time.getHours();
			var mm = time.getMinutes();
			var s = time.getSeconds();
			return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
			}
		},
		components: { 
			Load,payPwd,Message
		}
	}
</script>
<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.mining-top{
		display: flex;
		flex-wrap: wrap;
		padding-top: 40rpx;
		background: linear-gradient(to right, #092FEE, #145AC2);
		.mining-top-item{
			width: 50%;
			padding-bottom: 40rpx;
			text{
				margin-left: 60rpx;
				font-size: 22rpx;
				color: #C7C8E8;
			}
			view{
				color: $white;
				font-size: 48rpx;
				margin: 10rpx 0 0 60rpx;
			}
		}
	}
	.mining-top-list{
		background: linear-gradient(to right, #092FEE, #145AC2);
		border-top: 1rpx solid #6D4CFF;
		display: flex;
		.mining-top-list-item{
			flex: 1;
			text-align: center;
			font-size: 28rpx;
			&:first-of-type{
				border-right: 1rpx solid #6D4CFF;
			}
			text{
				line-height: 104rpx;
				color: $white;
				&:first-of-type{
					color: #C7C8E8;
					margin-right: 20rpx;
				}
			}
		}
	}
.app-ecology {
	.right-nav-color{
		padding-right: 30upx;
		display: flex;
		align-items: center;
		font-size: 26upx;
	}
	.show-mes-popule{
		position: fixed;
		top:0;  
		left:0;  
		z-index:22;  
		width:100%;  
		height:100vh;  
		background:rgba(0,0,0,0.4); 
		.show-mes-popule-content{
			position: fixed;
			top:50%;  
			left:50%;  
			z-index:22;  
			width:600upx;  
			background: #262C45;
			color: $white;
			transform: translate(-50%,-50%);
			border-radius: 20upx;
			overflow: hidden;
			.show-mes-popule-con{
				position: relative;
				padding: 20upx 0 0;
				.show-mes-popule-close{
					position: absolute;
					right: 20upx;
					top: 20upx;
				}
				.show-mes-popule-con-title{
					line-height: 88upx;
					font-size: 28upx;
					text-align: center;
					border-bottom: 1upx solid #454C5D;
				}
				.show-mes-popule-con-c{
					font-size: 36upx;
					padding: 40upx 0 ;
					text-align: center;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.show-mes-popule-button{
					display: flex;
					justify-content: space-between;
					align-items: center;
					button{
						flex: 1;
						line-height: 78upx;
						font-size: 26upx;
						border: none;
						border-radius: 0;
						&.active{
							background-color: $text-gray-color3;
						}
						&::after{
							border: none;
							border-radius: 0;
						}
						&:last-of-type{
							color: $white;
							background: linear-gradient(to right, #EFCD69, #EFCD69);
							&.active{
								background: #58627D;
								color: #FED094;
							}
						}
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
			width: 630upx;
			position: fixed;
			z-index: 9;
			left: 0;
			bottom: 0;
			padding: 40upx 60upx 20upx;
			background-color: #262C45;
			border-top-left-radius: 30upx;
			border-top-right-radius: 30upx;
			.popule-list{
				padding-bottom: 20upx;
				border-bottom: 1upx solid #2B2860;
				view{
					font-size: 36upx;
					font-weight: bold;
					padding-bottom: 25upx;
				}
				text{
					font-size: 26upx;
					color: #4A4B79;
				}
			}
			.popule-list-info{
				padding: 34upx  0 54upx;
				border-bottom: 1upx solid #2B2860;
				view{
					font-size: 26upx;
					margin-top: 10upx;
					text{
						color: #FED094;
						margin: 0 15upx;
					}
				}
			}
			.popule-combination-num{
				padding: 20upx 0 10upx;
				.popule-combination-num-title{
					font-size: 26upx;
					color: #4A4B79;
				}
				.combination-content{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.combination-li{
						padding-top: 15upx;
						flex: 1;
						text-align: left;
						&:first-of-type{
							margin-right: 15upx;
						}
						input{
							margin-top: 15upx;
							border: 1upx solid #1d2437;
							border-radius: 4upx;
							line-height: 88upx;
							height: 88upx;
							padding: 0 15upx;
						}
					}
				}
			}
			.popule-list-real{
				padding: 20upx 0 10upx;
				text{
					font-size: 26upx;
					color: #4A4B79;
				}
				view{
					margin-top: 10upx;
					font-size: 46upx;
					font-weight: bold;
				}
			}
			.list{
				padding: 20upx 0 0;
				&:last-of-type{
					.input-item{
						border-bottom: none;
					}
				}
				.title{
					font-size: 30upx;
					color: $white;
					background: #FED094;
				}
				.input-item{
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-bottom: 1upx solid #FED094;
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
					color: #4A4B79;
				}
				.popule-num{
					margin-top: 15upx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 475upx;
					line-height: 80upx;
					height: 80upx;
					border: 1upx solid #FED094;
					border-radius: 8upx;
					overflow: hidden;
					button{
						&:first-of-type{
							border-right: 1upx solid #FED094;
						}
						&:last-of-type{
							border-left: 1upx solid #FED094;
						}
						&.active{
							background: #58627D;
							color: #FED094;
						}
						font-size: 60upx;
						border-radius: 0; 
						width: 80upx;
						height: 80upx;
						color: #FFFFFF;
						line-height: 80upx;
						text-align: center;
						font-weight: normal;
						background: linear-gradient(to right, #EFCD69, #EFCD69);
	
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
					color: #4A4B79; 
				}
				.popule-voucher-content{
					border-radius: 8upx;
					margin-top: 22rpx;
					background: linear-gradient(to right, #EFCD69, #EFCD69);
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
							background: #cfb56a;
						}
					}
					&:last-of-type{
						button{
							background: linear-gradient(to right, #EFCD69, #EFCD69);
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
							background: #58627D;
							color: #FED094;
						}
					}
				}
			}
		}
	}
	.nodata{
		margin-top: 30upx;
		text-align: center ;
		image{
			margin: 0 auto;
			width: 134rpx;
			height: 161upx;
			flex-shrink: 0;
		}
	}
	.content {
		padding: 20upx 30upx;
		.content-nav{
			display: flex;
			align-items: center;
			.content-nav-item{
				font-size: 26rpx;
				margin-right: 57rpx;
				line-height: 110rpx;
				color: #000000;
				&.active{
					color: #0669DC;
					margin-right: 44rpx;
					font-size: 40rpx;
					font-weight: bold;
				}
			}
		}
		.list{
			border-radius: 20upx;
			position: relative;
			padding-bottom: 30upx;
			background-color:#FFFFFF;
			margin-bottom: 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 20rpx;
			font-size: 26rpx;
				.time,.prise{
					margin-top: 20rpx;
				}
				.prise{
					color: #FD8002;
					font-size: 30rpx;
					text{
						color: #000000;
						font-size: 26rpx;
					}
				}
				.title,.status{
					font-size: 26rpx;
				}
			.list-bg{
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: -1;
				width: 100%;
				height: 100%;
			}
			.list-li-btn{
				text-align: right;
				display: flex;
				margin-top: 30upx;
				padding-top: 30upx;
				border-top: 1upx solid #1d2437;
				button{
					width: 200upx;
					padding: 0;
					margin-right: 20upx;
					line-height: 88upx;
					height: 88upx;
					background: linear-gradient(to bottom,  #EFCD69, #EFCD69);
					color: #FFFFFF;
					font-size: 30upx;
					&.active{
						transform: scale(.9);
						opacity: .9;
					}
				}
			}
			.list-title-ti{
				padding: 20upx 20upx 0;
				font-size: 24upx;
				color: #58627D;
			}
			.list-title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20upx 30upx 0;
				view{
					line-height: 88upx;
					font-size: 40upx;
					text{
						line-height: 44upx;
						text-align: right;
						display: block;
						font-size: 24upx;
						color: #58627D;
					}
				}
				
			}
			.list-li{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 60upx;
				.list-li-item{
					flex: 1;
					text-align: center;
					view{
						font-size: 30upx;
					}
					text{
						font-size: 24upx;
						color: #727C97;
					}
				}
			}
		}
	}
}
</style>
