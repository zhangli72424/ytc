<template>
	<view>
		<view class="content">
			<view class="code">
				<qrcode
				:val="list"
				:size="260"
				:lv="3" 
				:onval="true"
				:loadMake="true"
				></qrcode>
			</view>
			<view class="title">
				{{list}}
			</view>
			<view class="btn" hover-class="active" @tap.stop="save">
				{{i18n.copy}}APP{{i18n.download}}{{i18n.copy_address}}1
			</view>
		</view>
		
		<view class="content" v-if="list2">
			<view class="code">
				<qrcode
				:val="list2"
				:size="260"
				:lv="3" 
				:onval="true"
				:loadMake="true"
				></qrcode>
			</view>
			<view class="title">
				{{list2}}
			</view>
			<view class="btn" hover-class="active" @tap.stop="save2">
				{{i18n.copy}}APP{{i18n.download}}{{i18n.copy_address}}2
			</view>
		</view>
		
		<view class="view-tip">
			* {{i18n.down_log1}}！！!*
		</view>
		
		
	</view>
</template>

<script>
	import Qrcode from "../../components/qrcode/qrcode.vue"
	import {fetch} from '@/common/js/util.js'
	import {mapGetters} from 'vuex'
	export default {
		computed:{
			i18n() {
				return this.$t('message');
			},
			...mapGetters([
				'getRequestUrl',
				"getLoginInfo",
				'getLangType'
			])
		},
		components:{
			Qrcode
		},
		data() {
			return {
				list:'',
				list2:''
			};
		},
		onShow() {
			this.getCode()
		},
		methods:{
			getCode(){
				fetch('/api/index/ve','',"POST").then(res=>{
					this.list = res.data.data.down;
					this.list2 = res.data.data.down2;
				})
			},
			save(){
				let _this = this
				uni.setClipboardData({
					data: this.list,
					success: function () {
						uni.showToast({
							title:_this.i18n.success_copy
						})
					}
				});
			},
			save2(){
				let _this = this
				uni.setClipboardData({
					data: this.list2,
					success: function () {
						uni.showToast({
							title:_this.i18n.success_copy
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.view-tip{
		background-color: #1d184f;
		margin: 20upx 30upx;
		padding: 30upx;
		color: #f00;
	}
	.content{
		width: 500upx; 
		margin: 0 auto ;
		text-align: center;
		padding-top: 30rpx;
		.btn{
			width: 350upx;
			line-height: 80upx;
			margin: 40upx auto;
			background-color: #F0AD4E;
			color: #FFFFFF;
			border-radius:40upx;
			text-align: center;
			font-size: 26upx;
			&.active{
				transform: scale(.9);
				opacity: .9;
			}
		}
		.code{
			width: 300upx;
			height: 300upx;
			margin:0 auto;
			background-color: #FFFFFF;
			border-radius:20upx;
			padding-top:20upx;
		}
		.title{
			font-size: 36upx;
			color: #FFFFFF;
			line-height: 44upx;
			margin-top:30upx;
		}
		text{
			color: #43e4ea;
			font-size:26upx;
			display: block;
		}
	}
</style>
