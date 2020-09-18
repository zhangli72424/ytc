<template>
	<view>
<!-- 		<u-navbar :is-back="false" backIconColor="#ffffff" :background="background">
			<view class="assets-top-index">
				<view class="assets-top-index-l">
					矿机产品
				</view>
				<view class="assets-top-index-r" @tap.stop="getHistory">
					查看我矿机<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
		</u-navbar> -->
		<view class="min-top-img">
				<image src="../../static/imgs/miner-top.png" mode="widthFix" lazy-load></image>
		</view>
		<view class="about-content">
			<view class="about-content-title">
				<text>了解抢购规则</text><i class="icon iconfont iconxiangyou1"></i><i class="icon iconfont iconxiangyou1"></i>
			</view>
			<view class="about-contant">
				<view class="about-item">
					<image src="../../static/miner/0.png" mode="widthFix" lazy-load></image>
				</view>
				<view class="about-item-line">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
				<view class="about-item">  
					<image src="../../static/miner/1.png" mode="widthFix" lazy-load></image>
				</view>
				<view class="about-item-line">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
				<view class="about-item">
					<image src="../../static/miner/2.png" mode="widthFix" lazy-load></image>
				</view>
			</view>
			
		</view>
		
		
		
		<template v-if="list.length>0">
			<view class="list-content">
				<view class="list-title">
					投资抢购
				</view>
				<block v-for="(item,index) in list" :key="index">
					<view class="list-cantant">
						<view class="list-cantant-t">
							<view>{{item.title}}</view>
							<view>抢单时间 <text>{{item.time}}</text></view>
							
						</view>
						
						<view class="list-cantant-c">
							<view class="list-cantant-c-item">
								<view>{{item.price}}<text>USDT</text></view>
								<text>投资金额</text>
							</view>
							<!-- <view class="list-cantant-c-item">
								<view>{{item.price}}</view>
								<text>矿机售价(CNY)</text>
							</view> -->
							<view class="list-cantant-c-item">
								<u-button
								:customStyle="somebuttomn" 
								:ripple="true" 
								rippleBgColor="#009CF4"
								@click="details(item)"
								shape="circle"
								>立即抢购</u-button>
							</view> 
						</view>
						
						<view class="list-cantant-footer">
							<view :class="{'green':item.status==2}">{{item.status==1?'未质押暂无抢购资格':'已质押保证金等待抢购'}}</view>
							<view class="list-cantant-footer-item" v-if="item.status==1">去质押<i class="icon iconfont iconxiangyou1"></i><i class="icon iconfont iconxiangyou1"></i></view>
						</view>
					</view>
				</block>
			</view>
		</template>
		<load v-if="showLoad"/>
		
		
		
		
		
		
		
		
		
		
		<view class="popule-metexts" v-if="showpopule" :class="{'animated bounceInUp ':showpopule}" @tap.stop="closet">
					<view class="popule-content" @tap.stop="''">
						<view class="popule-list">
							<view>{{curInfo.title}}</view>
						</view>
							<view class="popule-list popule-list-lac">
								<text>保证金：{{curInfo.price}}USDT</text>
							</view>
						<view class="popule-list-real"> 
							<text>实际支付价格</text>
							<view>{{num*curInfo.price}} USDT</view>   
						</view>
						<view class="popule-num-content">
							<text>质押数量</text>
							<view class="popule-num">
								<button type="default" @tap.stop="less" hover-class="active">-</button>
								<input type="number" v-model="num">
								<button type="default" @tap.stop="add" hover-class="active">+</button>
							</view>
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
	import Load from '@/components/common/load.vue';
	import {pageto, showToast, fetch, updownLine, forceUpdate, diff_txt, _updataTabBar} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	export default {
		data() {
			return {
				loadings:false,
				showpwd:false,
				isshows:false,
				showss:false,
				showMess:false,
				message:'',
				showpopule:false,
				showLoad:false,
				background:{
					background:'#0f1622'
				},
				somebuttomn:{
					'padding':'0 !important',
					width:'164rpx',
					background:'#ffffff',
					color:'#FF9000',
					border:"2rpx solid #FF9000",
					'line-height':'58rpx !important',
					height:'58rpx !important',
					'font-size':'24rpx !important'
					
				},
				list:[],
				curInfo:{},
				num:1
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
			this.loadings = false;
			this.showLoad = false;
			this.showpwd= false;
			this.isshows= false;
			this.showss= false;
			this.showMess= false;
			this.message=''
			this.showpopule= false;
			
			this.getList()
			uni.showTabBar()
		},
		methods:{
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
			closet(){
				this.showpopule = false;
				uni.showTabBar()
			},
			getHistory(){
				uni.navigateTo({
					url:'/pages/miner/mining'
				})
			},
			jumps(val){
				switch (val){ 
					case 'invited':
						uni.navigateTo({
							url:'/pages/invite/advertising'
						})
						break;
					default:
						break;
				}
			},
			...mapMutations(['setCurInfo']),
			details(item){ 
				
				if(item.status==1){
					this.curInfo = item;
					this.showpopule = true;
					uni.hideTabBar()
					return
				}
				this.setCurInfo(item)
				
				uni.navigateTo({
					url:'/pages/miner/detail'
				})
			},
			getList(){
				
				let res = {"code":1,"msg":"成功","time":1600410008,"data":[
					{"id":1,"title":"抢单上午场","token_id":3,"status":1,"time":"10:00-11:00","details":null,"rcb":"0.1000","premium":"0.00009600","type":1,"th_day":1460,"token_id":2,"stock":0,"buystock":0,"lowbetting":12,"th":230,"price":"16800.00","install_day":30,"expinc":"30","power":"218.06","diff":"2.92","shopid":1},
					{"id":2,"title":"投资下午场","token_id":3,"status":2,"time":"15:00-16:00","details":null,"rcb":"0.1000","premium":"0.00009600","type":1,"th_day":1460,"token_id":2,"stock":0,"buystock":0,"lowbetting":12,"th":230,"price":"16800.00","install_day":30,"expinc":"30","power":"218.06","diff":"2.92","shopid":1},
					{"id":3,"title":"投资晚上场","token_id":3,"status":1,"time":"20:00-21:00","details":null,"rcb":"0.1000","premium":"0.00009600","type":1,"th_day":1460,"token_id":2,"stock":0,"buystock":0,"lowbetting":12,"th":230,"price":"16800.00","install_day":30,"expinc":"30","power":"218.06","diff":"2.92","shopid":1},
					]}
				
				if(res.code==1){
					this.list = res.data
					this.list.forEach((item,index)=>{
						this.list[index].titles='真矿宝联合挖矿'
						this.list[index].fee = Number(item.rcb)*100000000/1000000+'%'
						this.list[index].price = Number(item.price)*100000000/100000000
						this.list[index].day = item.month+'月'
					})
				}
				return
				fetch('/api/bee/shoclist',{},'post')
					.then(res=>{
						if(res.data.code==1){
							this.list = res.data.data
							this.list.forEach((item,index)=>{
								this.list[index].tips = index=='0'?'限时限量':index==1?'稳健热销':index==2?'热销明星':index==3?'稳健成长':'额度稀缺'
								this.list[index].titles='真矿宝联合挖矿'
								this.list[index].fee = Number(item.rcb)*100000000/1000000+'%'
								this.list[index].price = Number(item.price)*100000000/100000000
								this.list[index].day = item.month+'月'
							})
						}
					})
					.catch(err=>{
						
					})
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
					token_id:this.curInfo.token_id
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
				this.showpopule = false;
				this.showpwd = true;
			},
		}
	}
</script>
<style lang="scss" scoped>
	
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
			background-color: $white;
			border-top-left-radius: 30upx;
			border-top-right-radius: 30upx;
			.popule-list{
				// padding-bottom: 40upx;
				// border-bottom: 1upx solid $split-line-color1;
				view{
					font-size: 36upx;
					font-weight: bold;
					padding-bottom: 25upx;
					color: $black; 
				}
				text{
					font-size: 26upx;
					color: $text-gray-color1;
				}
				&.popule-list-lac{
					border-bottom: 1rpx solid $split-line-color2;
					padding-bottom: 40rpx;
					text{
						font-size: 30rpx;
						color: $text-gray-color1;
					}
				}
			}
			.popule-list-real{
				padding: 20upx 0 50upx;
				text{
					font-size: 26upx;
					color: $text-gray-color1; 
				}
				view{
					margin-top: 10upx;
					font-size: 46upx;
					font-weight: bold;
					color: #FDA14E;
				}
			}
			.list{
				padding: 20upx 0 0;
				color: $black;
				&:last-of-type{
					.input-item{
						border-bottom: none;
					}
				}
				.title{
					font-size: 30upx;
					color: $black;
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
				padding-bottom: 80rpx;
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
					border: 4upx solid $black;
					border-radius: 8upx;
					overflow: hidden;
					button{
						&:first-of-type{
							border-right: 4upx solid $black;
						}
						&:last-of-type{
							border-left: 4upx solid $black;   
						}
						&.active{
							background: #C5C5C5;
							color: $text-gray-color1;
						}
						font-size: 60upx;
						border-radius: 0; 
						width: 80upx;
						height: 80upx;
						color: $black;
						line-height: 74upx;
						text-align: center;
						font-weight: normal;
						background-color: $white;
					}
					input{
						font-size: 40upx;
						font-weight: normal;
						flex: 1;
						line-height: 80upx;
						color:$black;
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
					color: $black;
					view{
						font-weight: bold;
					} 
					text{
						color: $black;
						font-size: 36upx;
						font-weight: bold;
					}
				}
			}
			.popule-meg{
				padding: 20upx 0;
				color: $black;
				text{
					font-size: 26upx;
					color: $black;
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
							background: #C5C5C5;
							color: $white;
						}
					}
					&:last-of-type{
						button{
							background: $button-color;
							color: $white;   
						}
					}
					button{
						width: 240upx; 
						line-height: 72upx;
						height:72upx;
						text-align: center;
						color: $black;
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
	
	
	
	.min-top-img{
		width: 750upx;
		height: 400upx;
		// margin: 0 30rpx;
		image{
			width: 750upx;
			height: 400upx;
			flex-shrink: 0;
		}
	}
	.assets-top-index{
		// #ifdef APP-PLUS
		width: 750rpx;
		// #endif
		// #ifdef MP-WEIXIN
		width: 650rpx;
		// #endif
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.assets-top-index-l{
			font-weight: bold;
			font-size: 40rpx;
			color: $black;
		}
		.assets-top-index-r{
			display: flex;
			align-items: center;
			font-size: 22rpx;
			color: #009CF4;
		}
	}
	
	.about-content{
		margin-top: 40rpx;
		.about-content-title{
			display: flex;
			align-items: center;
			justify-content: center;
			color: #1687F9;
			padding-bottom: 24rpx;
			font-size: 22rpx;
			.icon{
				font-size: 24rpx;
				color: #1687F9;
			}
		}
		.about-contant{
			padding: 0 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.about-item-line{
				.icon{
					color: 	#1687F9;
				}
			}
			.about-item{
				position: relative;
				padding-left: 14rpx;
				width: 206rpx;
				height: 160rpx;
				view{
					line-height: 66rpx;
					color: $white;
					font-size: 24rpx;
				}
				text{
					display: block;
					font-size: 20rpx;
					color: #70cdc1;
				}
				image{
					width: 220rpx;
					height: 160rpx;
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%,-50%);
					z-index: -1;
				}
			}
		}
	}
	.list-content{
		padding: 0 40rpx;
		margin: 82rpx 0 0;
		.list-title{
			padding-left: 18rpx;
			position: relative;
			color: $black;
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 34rpx;
			&::before{
				content: "";
				position: absolute;
				width: 6rpx;
				height: 38rpx;
				background: #0D41DB;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
			}
		}
		.list-cantant{
			padding: 28rpx 32rpx;
			background-color: $white;
			margin-bottom: 30rpx;
			box-shadow: 0 0 20rpx rgba(0,0,0,.1);
			border-radius: 20rpx;
			.list-cantant-t{
				display: flex;
				align-items: center;
				justify-content: space-between;
				view{
					&:last-of-type{
						font-size: 22rpx;
						color: $black;
						font-weight: lighter;
					}
					color: $black;
					line-height: 56rpx;
					font-size: 30rpx;
					font-weight: bold;
				}
				text{
					padding: 6rpx 10rpx;
					border-radius: 20rpx;
					color: #FF9000;
					font-size: 22rpx;
				}
			}
			.list-cantant-c{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 28rpx 0 0;
				.list-cantant-c-item{
					view{
						font-size: 44rpx;
						font-weight: bold;
						color:#FD8002;
						margin-bottom: 8rpx;
						line-height: 60rpx;
						text{
							font-size: 26rpx;
							color: $black;
						}
					}
					text{
						font-size: 24rpx;
						color: #9EA4AA;
					}
				}
			}
			.list-cantant-footer{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 50rpx;
				view{
					line-height: 100rpx;
					display: flex;
					align-items: center;
					font-size: 26rpx;
					font-weight: bold;
					&.green{
						color: #45C98F;
					}
					&.list-cantant-footer-item{
						color: #E64747;
					}
				}
			}
		}
	}
</style>
