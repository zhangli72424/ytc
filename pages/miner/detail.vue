<template>
	<view>
		<u-navbar :is-back="true" backIconColor="#ffffff" :title="title" :background="background" titleColor="#ffffff">
		</u-navbar>
		
		<view class="detail-top-con"></view>
		<view class="detail-top">
			<view class="detail-top-title">
				<view class="detail-top-title-i">
					<text>预期收益</text>
					<view class="">
						{{curInfo.expinc}} <text>ETH</text>
					</view>
				</view>
				<view class="detail-top-title-i">
					<text>单价</text>
					<view class="">
						{{curInfo.price}} <text>CNY</text>
					</view>
				</view>
				<view class="detail-top-title-i">
					<text>服务周期</text>
					<view class="">
						{{curInfo.th_day}} <text>天</text>
					</view>
				</view>
				<view class="detail-top-title-i">
					<text>装机时间</text>
					<view class="">
						{{curInfo.install_day}} <text>天</text>
					</view>
				</view>
			</view>
		<!-- 	<view class="detail-top-prpgress">
				<u-line-progress :striped="true" 
				:percent="curInfo.prograss" :striped-active="true"
				 height="12"
				 :show-percent="false"
				active-color="#ffffff" inactive-color="rgba(255,255,255,.2)" ></u-line-progress>
			</view>
			
			<view class="detai-top-batt">
				<view>已购金额：{{curInfo.buystock}} USDT</view>
				<view>剩余额度：{{curInfo.stock}} USDT</view>
			</view> -->
			
		</view>
		
		<view class="detail-contant">
			<view class="detail-title">
				收益规则
			</view>
			<view class="detail-rule">
				<view class="detail-rule-l">
					<view class="detail-rule-l-t">
						<view>购买日</view>
						<text>{{curInfo.time}}</text>
					</view>
					<view class="detail-rule-l-line"></view>
				</view>
				<view class="detail-rule-r">
					<view class="detail-rule-r-t">
						<view class="detail-rule-r-t-l">
							<view>产出到账</view>
							<text>{{curInfo.ctime}}</text>
						</view>
						<view class="detail-rule-r-t-r">
							<view>服务期结束</view>
							<text>{{curInfo.dtime}}</text>
						</view>
					</view>
					
					<view class="detail-rule-r-line"></view>
				</view>
			</view>
			
			<view class="detail-title">
				产品参数
			</view>
			<view class="product-parameter">
				<view class="product-parameter-li">
					<view class="product-parameter-li-item-l">
						产品类型
					</view>
					<view class="product-parameter-li-item-r">
						ETH矿机
					</view>
				</view>
				<view class="product-parameter-li">
					<view class="product-parameter-li-item-l">
						产品周期
					</view>
					<view class="product-parameter-li-item-r">
						{{curInfo.th_day}}天
					</view>
				</view>
				<view class="product-parameter-li">
					<view class="product-parameter-li-item-l">
						挖矿到账方式
					</view>
					<view class="product-parameter-li-item-r">
						根据算力每日转入余额
					</view>
				</view>
				<view class="product-parameter-li">
					<view class="product-parameter-li-item-l">
						到期处理方式
					</view>
					<view class="product-parameter-li-item-r">
						折旧出售公司或者寄回
					</view>
				</view>
			</view>
			
			
			
			
			<view class="detail-title">
				产品详情
			</view>
			<view class="product-details">
				<view class="product-details-li">
					1.该产品为实体矿机，购买后自动委托矿场挖矿所获得的ETH收益
				</view>
				<view class="product-details-li">
					2.用户购买的矿机产品，平台保障用户的产品安全
				</view>
				<view class="product-details-li">
					3.收益发放根据每天算力和难度自动产出发放至余额
				</view>
				<view class="product-details-li">
					4.会员下单前，请认真了解产品详情，一经下单，表示已认可产品，概不退款
				</view>
			</view>
			
			
			
			<view class="detail-title">
				购买流程
			</view>
			<view class="product-process">
				<view class="product-process-li">
					<view class="product-process-li-l">
						1
					</view>
					<view class="product-process-li-r">
						<view class="">
							注册帐号
						</view>
						<text>注册帐号</text>
					</view>
				</view>
				<view class="product-process-li">
					<view class="product-process-li-l">
						2
					</view>
					<view class="product-process-li-r">
						<view class="">
							打款购买
						</view>
						<text>打款到指定账户</text>
					</view>
				</view>
				<view class="product-process-li">
					<view class="product-process-li-l">
						3
					</view>
					<view class="product-process-li-r">
						<view class="">
							完成购买
						</view>
						<text>购买矿机</text>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-btn">
			<u-button
			:customStyle="somebuttomn"
			:ripple="true" rippleBgColor="#a7a1a1"
			:hair-line="false"
			@click="buyItem"
			>立即购买</u-button>
		</view>
		
		
		
		
		<view class="popule-metexts" v-if="showpopule" :class="{'animated bounceInUp ':showpopule}" @tap.stop="closet">
			<view class="popule-content" @tap.stop="''">
				<view class="popule-list">
					<view>{{curInfo.title}}</view>
					<!-- <text>{{i18n.price}}：{{info.price}}{{info.type==1?`USDT/${i18n.station}`:'USDT/T'}}</text> -->
				</view>
			<!-- 	<view class="popule-list popule-list-lac" v-if="info.type==1">
					<text>T{{i18n.value}}：{{info.th}} T/{{i18n.station}}</text>
				</view> -->
					<view class="popule-list popule-list-lac">
						<text>单价：{{curInfo.price}}CNY</text>
					</view>
					<view class="popule-list popule-list-lac">
						<text>服务周期：{{curInfo.th_day}}天</text>
					</view>
					<!-- <view class="popule-list popule-list-lac">
						<text>溢价率：{{curInfo.premium}}%</text>
					</view>
					<view class="popule-list popule-list-lac">
						<text>最低投资额：{{Number(curInfo.lowbetting)}}</text>
					</view> -->
				<!-- <view class="popule-list-real">
					<text>{{i18n.Actual_price_paid}}</text>
					<view>{{normal}}</view>
				</view> -->
				<view class="popule-num-content">
					<!-- <text v-if="info.type==1">{{i18n.Buy_by_quantity}}（{{i18n.station}}）</text>
					<text v-if="info.type==2">{{i18n.Lease_by_quantity}}（T）</text> -->
					<text>数量</text>
					<view class="popule-num">
						<button type="default" @tap.stop="less" hover-class="active">-</button>
						<input type="number" v-model="num">
						<button type="default" @tap.stop="add" hover-class="active">+</button>
					</view>
				</view>
<!-- 
				<view class="popule-meg">
					<text>{{i18n.AvailableBalance}}：</text>
					<view >{{curInfo.balance ?(curInfo.balance | formatParsefloat):0}} USDT</view>
				</view> -->
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
		<load v-if="loadings"/>
	</view>
</template>

<script>
	import Load from '@/components/common/load.vue';
	import Message from '@/components/common/message.vue';
	import payPwd from '@/components/pay-pwd/pay-pwd.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters, mapMutations} from 'vuex';
	export default {
		components:{Load,Message,payPwd},
		data() {
			return {
				loadings:false,
				showpopule:false,
				showpwd:false,
				shows:false,
				showss:false,
				isshows:false,
				showMess:false,
				message:'',
				usdt_balance:'',
				info:{},
				title:'',
				background: {
					background:"linear-gradient(to right,#145AC2,#092FEE)"
				},
				somebuttomn:{
					"line-height":"100rpx",
					height:"100rpx",
					width:'100%',
					background:"linear-gradient(to right, #145AC2, #092FEE)",
					color:"#ffffff",
					"font-size":"30rpx",
					"border":"none",
					"border-radius":"0"
				},
				num:1,
				noPaypwd:false,
				curInfo:{}
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
				'getTextArr',
				'getCurInfo'
			])
		},
		onShow(){
			this.noPaypwd = false;
			this.loadings = false;
			this.showpopule = false;
			this.showpwd = false;
			this.shows = false;
			this.showss = false;
			this.isshows = false;
			this.showMess = false;
			this.message = ''
			this.title = this.getCurInfo.title
			this.num = 1
			this.getDetail()
		},
		methods:{
			...mapMutations(['setCurInfo', 'setImgsrc']),
			getDetail(){
				fetch('/api/bee/buydetails',{shopid:this.getCurInfo.shopid},'post')
					.then(res=>{
						if(res.data.code==1){
							this.curInfo = res.data.data
							this.curInfo.ycb = parseInt(Number(this.curInfo.rcb)*10000)/100
							this.curInfo.price = parseInt(Number(this.curInfo.price)*10000)/10000
							this.curInfo.prograss = parseInt(Number(this.curInfo.buystock)/(Number(this.curInfo.buystock)+Number(this.curInfo.stock))*1000000)/10000
							this.curInfo.premium = parseInt(Number(this.curInfo.premium)*10000)/100
							console.log(this.curInfo);
							
						}
					})
					.catch(err=>{
						
					})
			},
			closeMess(){
				this.showMess = false
				setTimeout(()=>{
					if(this.noPaypwd){
						uni.navigateTo({
							url:"/pages/modify-pwd/modify-pwd"
						})
					}
				},500)
				
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
			closet(){this.showpopule = false;},
			buyItem(){
				this.showpopule = true
			},
			close(val){
				if(val==1){
					this.isshows = false;
					this.showss = false;
					this.showpwd = false;
					this.loadings = false;
				}else{
					this.isshows = val;
					this.showpwd = val;
					this.showss = val
				}
			},
			inputAgain(val){
				this.isshows = false;
				this.showpwd = true;
				this.loadings = false;
			},
			finish(val){
				this.loadings = false;
				let data = {
					shopid:this.curInfo.id,
					num:this.num,
					paypwd:val,
					token_id:this.getCurInfo.token_id
				}
				this.laoding = true;
				if(this.isCheck) return;
				this.isCheck = true;
				fetch('/api/shop/buymine',data,'POST')
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
			},
			comfirm(){
				// if(!this.getLoginInfo.paypwd){
				// 	this.showMess = true;
				// 	this.showpopule = false;
				// 	this.message = this.getLangType=='chs'?'请先设置交易密码':'Please set transaction password first'
				// 	this.noPaypwd = true;
				// 	return 
				// }
				// if(!Number(this.curInfo.balance)){
				// 	// showToast('余额不足');
				// 	this.showMess = true;
				// 	this.showpopule = false;
				// 	this.message = this.getLangType=='chs'?'余额不足':'Insufficient balance'
				// 	return
				// }
				this.showpopule = false;
				// this.showpwd = true;
				
				
				this.curInfo.buy_num = this.num
				this.setImgsrc('')
				
				
				this.curInfo.shopid = this.getCurInfo.shopid
				this.setCurInfo(this.curInfo)
				uni.navigateTo({
					url:'./info'
				})
				
				
				return
				if(this.info.type==1){
					
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
		}
	}
</script>

<style lang="scss" scoped>
	.detail-top{
		padding: 72rpx 30rpx 30rpx;
		.detail-top-title{
			display: flex;
			align-items: center;
			// position: relative;
			// &::after{
			// 	content: "";
			// 	position: absolute;
			// 	width: 2rpx;
			// 	height: 36rpx;
			// 	background: $white;
			// 	left: 264rpx;
			// 	bottom: 30rpx;
			// }
			.detail-top-title-i{
				flex: 25%;
				text{
					font-size: 24rpx;
					color: rgba(255,255,255,.5);
				}
				view{
					line-height: 84rpx;
					color: $white;
					font-size: 40rpx;
					text{
						font-size: 20rpx;
						color: $white;
					}
				}
			}
		}
		.detail-top-prpgress{
			margin-top: 40rpx;
		}
		.detai-top-batt{
			display: flex;
			align-items: center;
			justify-content: space-between;
			view{
				font-size: 24rpx;
				line-height: 44rpx;
				color: rgba(255,255,255,.5);
			}
		}
	}
	
	.detail-top-con{
		background: linear-gradient(to right,#145AC2,#092FEE);
		width: 750rpx;
		height: 550rpx;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		z-index: -1;
	}
	
	.detail-contant{
		padding: 82rpx 40rpx 0;
		// margin: 82rpx 0 0;
		background-color: $page-bg-color5;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		overflow: hidden;
		.detail-title{
			padding-left: 18rpx;
			position: relative;
			color: $white;
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
		.detail-rule{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 38rpx;
			border-bottom: 1rpx solid #474F5F;
			margin-bottom: 60rpx;
			.detail-rule-l{
				width: 218rpx;
				margin-right: 4rpx;
				position: relative;
				.detail-rule-l-t{
					padding-left: 14rpx;
					view{
						font-size: 28rpx;
						font-weight: bold;
						color: $default-color;
						margin-bottom: 15rpx;
					}
					text{
						font-size: 20rpx;
						color: #C7C7C7;
					}
				}
				&::after{
					content: "";
					position: absolute;
					left: 0;
					bottom: 18rpx;
					width: 2rpx;
					height: 54rpx;
					background: #0669DC;
				}
				&::before{
					content: "";
					position: absolute;
					left: 0;
					bottom: 68rpx;
					height: 2rpx;
					width: 4rpx;
					background: #0669DC;
				}
				.detail-rule-l-line{
					margin-top: 50rpx;
					background: #3987E2;
					width: 100%;
					height: 10rpx;
				}
			}
			.detail-rule-r{
				flex: 1;
				.detail-rule-r-t{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.detail-rule-r-t-l{
						view{
							font-size: 28rpx;
							font-weight: bold;
							color: $default-color;
							margin-bottom: 15rpx;
						}
						text{
							font-size: 20rpx;
							color: #C7C7C7;
						}
						padding-left: 14rpx;
						position: relative;
						&::after{
							content: "";
							position: absolute;
							left: 0;
							top: 61rpx;
							width: 2rpx;
							height: 54rpx;
							background: #0669DC;
						}
						&::before{
							content: "";
							position: absolute;
							left: 0;
							top: 61rpx;
							height: 2rpx;
							width: 4rpx;
							background: #0669DC;
						}
					}
					.detail-rule-r-t-r{
						text-align: right;
						padding-right: 14rpx;
						view{
							font-size: 28rpx;
							font-weight: bold;
							color: #0669DC;
							margin-bottom: 15rpx;
						}
						text{
							font-size: 20rpx;
							color: #0669DC;
						}
						position: relative;
						&::after{
							content: "";
							position: absolute;
							right: 0;
							top: 61rpx;
							width: 2rpx;
							height: 54rpx;
							background: #0669DC;
						}
						&::before{
							content: "";
							position: absolute;
							right: 0;
							top: 61rpx;
							height: 2rpx;
							width: 4rpx;
							background: #0669DC;
						}
					}
				}
				.detail-rule-r-line{
					margin-top: 50rpx;
					background: #0669DC;
					width: 100%;
					height: 10rpx;
				}
			}
		}
		.product-parameter{
			margin-bottom: 60rpx;
			font-size: 28rpx;
			.product-parameter-li{
				font-size: 28rpx;
				display: flex;
				align-items: center;
				.product-parameter-li-item-l{
					width: 200rpx;
					line-height: 70rpx;
					color: #5D626E;
				}
				.product-parameter-li-item-r{
					flex: 1;
					line-height: 70rpx;
					color: $default-color;
					font-weight: bold;
				}
			}
		}
		.product-details{
			font-size: 28rpx;
			margin-bottom: 20rpx;
			.product-details-li{
				padding-bottom: 40rpx;
				font-size: 28rpx;
				font-weight: bold;
				color: $default-color;
			}
		}
		.product-process{
			display: flex;
			align-items: center;
			padding: 30rpx 0 150rpx;
			.product-process-li{
				flex: 1;
				display: flex;
				align-items: center;
				.product-process-li-l{
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					border-radius: 20rpx;
					text-align: center;
					background: #0669DC;
					color: $white;
					font-size: 26rpx;
					margin-right: 10rpx;
				}
				.product-process-li-r{
					view{
						color: $default-color;
						font-size: 26rpx;
						font-weight: bold;
					}
					text{
						font-size: 22rpx;
						color: #5D626E;
					}
				}
			}
		}
		
		
	}
	
	.footer-btn{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	
	.popule-metexts{
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
					color: $default-color; 
				}
				text{
					font-size: 26upx;
					color: $text-gray-color1;
				}
				&.popule-list-lac{
					text{
						font-size: 30rpx;
						color: $default-color;
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
				color: $default-color;
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
						color: $default-color;
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
						color:$default-color;
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
					color: $default-color;
					view{
						font-weight: bold;
					} 
					text{
						color: $default-color;
						font-size: 36upx;
						font-weight: bold;
					}
				}
			}
			.popule-meg{
				padding: 20upx 0;
				color: $default-color;
				text{
					font-size: 26upx;
					color: $default-color;
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
