<template>
	<view>
		<u-navbar :is-back="true" backIconColor="#ffffff" :title="title" :background="background" titleColor="#ffffff">
		</u-navbar>
		<view class="info-top">
			<view class="info-top-t">
				{{shopInfo.price?shopInfo.price:'--'}}CNY
			</view>
			<!-- <view class="info-top-b">
				请在<text>09m47s</text>内付款
			</view> -->
		</view>
		<view class="info-content info-content-first">
			<view class="info-content-item">
				<view class="info-content-item-l">
					收款户名
				</view>
				<view class="info-content-item-r">
					<text>{{payment.name?payment.name:'--'}}</text>
					<button  @tap.stop="copy(payment.name)" hover-class="active">复制</button>
				</view>
			</view>
			<view class="info-content-item">
				<view class="info-content-item-l">
					银行卡号
				</view>
				<view class="info-content-item-r">
					<text>{{payment.card?payment.card:'--'}}</text>
					<button @tap.stop="copy(payment.card)" hover-class="active">复制</button>
				</view>
			</view>
			<view class="info-content-item">
				<view class="info-content-item-l">
					银行信息
				</view>
				<view class="info-content-item-r">
					<text>{{payment.bank?payment.bank:'--'}}</text>
					<button @tap.stop="copy(payment.bank)" hover-class="active">复制</button>
				</view>
			</view>
			<view class="info-content-tips">
				<i class="icon iconfont icon-tishi"></i>
				<view class="info-content-tips-c">
					如您已向平台线下转账付款，请务必点击下方“已付款”按钮，否则可能造成您的矿机无法购买成功。<text>打款时请务必备注“订单编号”</text>
				</view>
			</view>
		</view>
		
		<view class="info-content info-class">
			<view class="info-content-item">
				<view class="info-content-item-l">
					购买项目
				</view>
				<view class="info-content-item-r">
					<text>{{shopInfo.title?shopInfo.title:'--'}}</text>
				</view>
			</view>
			<view class="info-content-item">
				<view class="info-content-item-l">
					产品金额
				</view>
				<view class="info-content-item-r">
					<text>{{shopInfo.price?shopInfo.price:'--'}}CNY</text>
				</view>
			</view>
			<view class="info-content-item">
				<view class="info-content-item-l">
					订单编号
				</view>
				<view class="info-content-item-r">
					<text>{{shopInfo.trade?shopInfo.trade:'--'}}</text>
					<button @tap.stop="copy(shopInfo.trade)" hover-class="active">复制</button>
				</view>
			</view>
			
			<view class="info-content-item info-content-item-upload">
				<view class="info-content-item-l">
					上传打款截图
				</view>
				<view class="info-content-item-r" @tap.stop="uploadimgs">
					<template v-if="uploadImg">
						<image :src="uploadImg" lazy-load @tap.stop="priveImg(uploadImg)"></image>
					</template>
					<template v-else>
						<view class="info-content-item-upload-item-r">
							+
						</view>
					</template>
					
				</view>
			</view>
			
			
		</view>
		
		
		<view class="info-bottom">
			<button type="default" @tap.stop="cancelDetail">取消订单</button>
			<button type="default" @tap.stop="getDetail">我已付款</button>
		</view>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/common/js/img-tools.js';
	import Load from '@/components/common/load.vue';
	import Message from '@/components/common/message.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters, mapMutations} from 'vuex';
	export default {
		data() {
			return {
				background: {
					background:"#0c3be1"
				},
				title:"",
				curInfo:{},
				nums:'',
				uploadImg:'',
				isfast:false,
				addressData:'',
				payment:{},
				shopInfo:{},
				shopids:''
			}
		},
		onShow(){
			this.uploadImg=''
			this.title = this.getCurInfo.title	
			this.curInfo = this.getCurInfo
			this.nums = Number(this.getCurInfo.price)*Number(this.getCurInfo.buy_num)
			console.log(this.getCurInfo);
			if(this.getImgsrc){
				this.uploadImg = this.getImgsrc
			}
		},
		onLoad(){
			this.getInfos();
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
				'getCurInfo',
				'getImgsrc'
			])
		},
		methods:{
			...mapMutations(['setImgsrc', 'setCurInfo']),
			cancelDetail(){
				console.log(this.getCurInfo.tradeid);
				let shopids = this.getCurInfo.tradeid?this.getCurInfo.id:this.shopids
				console.log(shopids);
				fetch('/api/bee/canceltrade',{tradeid:shopids},'post')
					.then(res=>{
						showToast(res.data.msg)
						if(res.data.code==1){
							setTimeout(()=>{
								// uni.switchTab({
								// 	url:'/pages/mine/mine'
								// })
								uni.navigateBack({
									delta:1
								})
							},500)
						}
					})
					.catch(err=>{
						
					})
			},
			getInfos(){
				fetch('/api/bee/buymine',{
					shopid:this.getCurInfo.shopid,
					token_id:this.getCurInfo.token_id,
					num:this.getCurInfo.buy_num,
					tid:this.getCurInfo.tradeid?this.getCurInfo.id:'',
					tradeid:this.getCurInfo.tradeid,
				},'post')
					.then(res=>{
						if(res.data.code==1){
							this.payment = res.data.data.payment
							this.shopInfo  = res.data.data.shop
							this.shopids = res.data.data.shop.tradeid
							return
						}
						showToast(res.data.msg)
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
					})
					.catch(err=>{
						
					})
			},
			copy(obj){
				if (this.isfast) return;
				this.isfast = true;
				setTimeout(()=> {
					this.isfast = false;
				}, 1500)
				let  _this = this;
				uni.setClipboardData({
					data: obj,
					success: function () {
						showToast(_this.i18n.copy_success)
					}
				});
			},
			uploadimgs(){
				let _this = this
				uni.chooseImage({
					count: 1,
					sourceType: ["camera",'album'],
					sizeType: ['compressed'],
					success: res => {
						let file = res.tempFiles[0]
						let reg = /.+\.(jpeg|jpg|png)$/g
						if (file.size > 1024 * 1024) {
							showToast(_this.i18n.The_file_is_too_large)
							return
						} else if(!reg.test(file.path)) {
							showToast(_this.i18n.File_format_error)
							return
						} else {
							pathToBase64(file.path)
								.then(res => {
									this.setImgsrc(res)
									_this.uploadImg = res
								})
								.catch(err => {
									console.log(err)
								})
						}
					}
				})
			},
			priveImg(val){
				let list = []
				list.push(val)
				uni.previewImage({
					current:0,
					urls:list
				})
			},
			getDetail(){
				if(!this.getImgsrc){
					showToast('请选择打款截图')
					return
				}
				this.curInfo.nums = this.nums;
				this.curInfo.upimg = this.getImgsrc;
				
				fetch('/api/bee/paid',{
					tradeid:this.shopInfo.tradeid,
					img:this.getImgsrc
				},'post').then(res=>{
					if(res.data.code==1){
						this.setCurInfo(this.curInfo)
						showToast(res.data.msg)
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
					}
				})
				.catch(err=>{
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-top{
		background: #0c3be1;
		color: $white;
		text-align: center;
		padding-bottom: 124rpx;
		.info-top-t{
			line-height: 84rpx;
			font-size: 60rpx;
		}
		.info-top-b{
			line-height: 40rpx;
			font-size: 28rpx;
			text{
				color: #E98C00;
			}
		}
	}
	.info-content{
		margin: 0 30rpx 24rpx;
		background: $page-bg-color5;
		border-radius: 8rpx;
		padding-bottom: 40rpx;
		&.info-class{
			margin-bottom: 120rpx;
		}
		&.info-content-first{
			margin: -98rpx 30rpx 24rpx;
		}
		.info-content-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 28rpx 0 24rpx;
			border-bottom: 1rpx solid #242C3B;
			&.info-content-item-upload{
				align-items: flex-start;
				border-bottom:none;
				.info-content-item-upload-item-r{
					width: 240rpx;
					height: 240rpx;
					line-height: 240rpx;
					text-align: center;
					font-size: 50rpx;
					background: #242B3D;
					color: #3C455D;
					border-radius: 8rpx;
					margin-top: 42rpx;
				}
			}
			.info-content-item-l{
				font-size: 30rpx;
				color: #5D626E;
				line-height: 110rpx;
			}
			.info-content-item-r{
				display: flex;
				align-items: center;
				image{
					margin-top: 42rpx;
					width: 240rpx;
					height: 240rpx;
					border-radius: 8rpx;
					flex-shrink: 0;
				}
				text{
					font-size: 30rpx;
					color: $white;
					line-height: 110rpx;
				}
				button{
					margin-left: 10rpx;
					width: 72rpx;
					height: 34rpx;
					padding: 0;
					font-size: 20rpx;
					line-height: 34rpx;
					background: #0669DC;
					color: $white;
					border-radius: 4rpx;
					&::after{
						display: none;
					}
					&.active{
						background: #32b9ff;
					}
				}
			}
		}
		.info-content-tips{
			margin: 22rpx 28rpx 0;
			background: #282E3E;
			border-radius: 8rpx;
			padding: 12rpx 28rpx 20rpx 18rpx;
			display: flex;
			.icon-tishi{
				color: #5D626E;
			}
			.info-content-tips-c{
				margin-left: 8rpx;
				color: #5D626E;
				font-size: 20rpx;
				line-height: 30rpx;
				text{
					color: #EC0000;
				}
			}
		}
	}
	.info-bottom{
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		width: 750rpx;
		z-index: 5;
		display: flex;
		button{
			flex: 1;
			line-height: 100rpx;
			height: 100rpx;
			font-size: 30rpx;
			color: $white;
			background: #092FEE;
			&:first-of-type{
				background: #294AF1;
			}
			border: none;
			border-radius: 0;
			&::after{
				display: none;
			}
		}
	}


</style>
