<template>
	<view class="">
		<u-navbar 
		:is-back="true" 
		backIconColor="#ffffff"
		title="矿机详情" 
		:background="background" titleColor="#ffffff">
		</u-navbar>
		<view class="info-detail-content">
			<view class="info-detail-item">
				<text>矿机型号</text>
				<text>{{curinfo.title}}</text>
			</view>
			<view class="info-detail-item">
				<text>购买时间</text>
				<text>{{curinfo.time}}</text>
			</view>
			<view class="info-detail-item">
				<text>订单编号</text>
				<text>HY95284</text>
			</view>
			<view class="info-detail-item">
				<text>打款时间</text>
				<text>{{curinfo.dtime}}</text>
			</view>
			<view class="info-detail-item">
				<text>交易金额(元)</text>
				<text>{{curinfo.all_price}}</text>
			</view>
			
			<view class="info-detail-item">
				<text>打款截图</text>
				<view class="img-up">
					<image :src="curinfo.img" @tap.stop="priveImg(curinfo.img)"  mode="" lazy-load></image>
				</view>
			</view>
		</view>
		
		<view class="view-contract" hover-class="active" @tap.stop="contract">
			查看电子合同<i class="icon iconfont iconxiangyou1"></i>
		</view>
		
		<view class="info-bottom" v-if="!curinfo.sign">
			<button type="default" @tap.stop="signature" hover-class="active">签名确认</button>
		</view>
		
		<view class="popule-info" v-if="showModal" @tap.stop="closeModal">
			<view class="popule-info-contant" @tap.stop="''">
				<view class="popule-info-content">
					<i class="icon iconfont icon-cha"  @tap.stop="closeModal"></i>
					<view class="popule-info-title">
						{{title}}
					</view>
					<template v-if="seeContract">
						
						<view class="po-content">
							姓名:{{name}}
						</view>
						<view class="po-content">
							身份证号:{{card}}
						</view>
						<view class="po-content po-content-t">
							<scroll-view scroll-y="true" style="height: 500rpx;">
								<u-parse :html="content"></u-parse>
							</scroll-view>
							
							<!-- {{content}} -->
						</view>
						<view class="po-content" >
							我的签名:{{curinfo.sign?curinfo.sign:''}}
						</view>
					</template>
					<template v-else>
						<view class="input-item">
							<text>签名</text>
							<input type="text" placeholder="请输入签名" v-model="username">
						</view>
						<button type="default" @tap.stop="comfimSigin">确定</button>
						
					</template>
					
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Load from '@/components/common/load.vue';
	import Message from '@/components/common/message.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters, mapMutations} from 'vuex';
	export default {
		data() {
			return {
				background: {
					background:"#1a202f"
				},
				curinfo:{},
				showModal:false,
				seeContract:false,
				title:'',
				customStyle:{
					background:"#1A202F",
					color:"#ffffff"
				},
				content:'',
				username:'',
				card:'',
				name:''
			}
		},
		onShow(){
			this.seeContract = false;
			this.curinfo = this.getCurInfo
			console.log(this.getCurInfo);
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
		methods:{
			comfimSigin(){
				//确认签名
				fetch('/api/bee/sign',{
					bid:this.curinfo.id,
					sign:this.username
				},'post')
					.then(res=>{
						showToast(res.data.msg);
						this.showModal = false;
						if(res.data.code==1){
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},500)
						}
					})
					.catch(err=>{
						console.log(err.data.msg);
					})
				
			},
			closeModal(){
				this.showModal = false;
			},
			signature(){
				this.seeContract = false;
				this.showModal = true;
				this.title='请输入签名'
			},
			contract(){
				
				uni.navigateTo({
					url:`./contract-detail?sign=${this.getCurInfo.sign}&id=${this.getCurInfo.id}`
				})
				// fetch('/api/bee/contract','','post')
				// 	.then(res=>{
				// 		if(res.data.code==1){
				// 			this.title='合同详情'
				// 			this.seeContract = true;
				// 			this.showModal = true;
				// 			this.content = res.data.data.contract.content
				// 			this.card = res.data.data.contract.card
				// 			this.name = res.data.data.contract.name
				// 		}
				// 	})
				// 	.catch(err=>{
				// 		console.log(err.data.msg);
				// 	})
				
				return
				
				this.title='合同详情'
				this.content =  `
					<p>露从今夜白，月是故乡明</p>
					<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />
				`
			},
			priveImg(val){
				let list = []
				list.push(val)
				uni.previewImage({
					current:0,
					urls:list
				})
			},
			backs(){
				uni.switchTab({
					url:'/pages/mine/mine'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.popule-info{
		background: rgba(0,0,0,.4);
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		.popule-info-contant{
			background: rgba(0,0,0,.4);
			position: fixed;
			left: 50%;
			top: 50%;
			width: 600rpx;
			background: $page-bg-color5;
			transform: translate(-50%,-50%);
			.popule-info-content{
				position: relative;
				color: $white;
				.icon-cha{
					position: absolute;
					right: 30rpx;
					top: 30rpx;
					color: $white;
				}
				.popule-info-title{
					line-height: 110rpx;
					text-align: center;
					border-bottom: 1rpx solid #242C3B;
				}
				.po-content{
					padding: 20rpx 30rpx;
					&.po-content-t{
						text-indent: 40rpx;
					}
				}
				.input-item{
					padding: 0 30rpx;
					text{
						line-height: 90rpx;
						color: #5D626E;
						font-size: 30rpx;
					}
					input{
						padding: 0 20rpx;
						background: #242B3D;
						border-radius: 8rpx;
						line-height: 90rpx;
						height: 90rpx;
					}
				}
				button{
					width: 200rpx;
					line-height: 90rpx;
					height: 90rpx;
					background-color: #145AC2;
					color: $white;
					margin: 20rpx auto;
				}
			}
		}
	}
	.info-detail-content{
		margin-top: 24rpx;
		background: $page-bg-color5;
		.info-detail-item{
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #242C3B;
			&:last-of-type{
				border-bottom: none;
			}
			text{
				line-height: 120rpx;
				color: $white;
				font-size: 30rpx;
			}
			.img-up{
				width: 240rpx;
				height: 240rpx;
				flex-shrink: 0;
				border-radius: 8rpx;
				margin: 51rpx 0 68rpx;
				image{
					width: 240rpx;
					height: 240rpx;
					flex-shrink: 0;
					border-radius: 8rpx;
				}
			}
		}
	}
	.view-contract{
		width: 240rpx;
		height: 58rpx;
		line-height: 58rpx;
		border: 1rpx solid #0669DC;
		color: #0669DC;
		border-radius: 16rpx;
		font-size: 28rpx;
		margin: 33rpx auto 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		&.active{
			background: #0669DC;
			border: none;
			color: $white;
			.icon{
				color: $white;
			}
		}
		.icon{
			margin-left: 15rpx;
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
			background: linear-gradient(to right, #092FEE, #145AC2);
			border: none;
			border-radius: 0;
			&::after{
				display: none;
			}
			&.active{
				background: $theme-color;
			}
		}
	}
	
	
	
	
</style>
