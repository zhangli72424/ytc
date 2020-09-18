<template>
	<view class="popule-message">
		<view class="mask" v-if="shows" @tap.stop="clear"></view>
		<view class="popule-pwd-err02" v-if="shows" @tap.stop="''">
			<view class="popule-pwd-err-content">
				<view class="close" @tap.stop="clear"><i class="iconfont icon icon-cha"></i></view>
				<view class="popule-pwd-err-c">
					{{message}}
				</view>
				<view class="popule-pwd-err-nav">
					<u-button size="default" :customStyle="somebuttomn" :ripple="true" rippleBgColor="#28f09e" type="primary" @click="jump">{{i18n.confirm}}</u-button>
					<!-- <view  hover-class="active" @tap.stop="jump">{{i18n.confirm}}</view> -->
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				somebuttomn: {
					background:'#ffffff',
					color:'#28f09e',
					width:'100% !important'
				}
			}
		},
		props:{
			shows:{
				type: Boolean,
				default: false
			},
			message:{
				type: String,
				default: ''
			}
		},
		computed:  {
			i18n() {
				return this.$t('message');
			}
		},
		methods:{
			clear(){
				this.$emit('close',1);
			},
			jump(){
				this.$emit('jump',1);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.popule-message{
		.mask{
			position: fixed;
			top:0;  
			left:0;  
			z-index:88;  
			width:100%;  
			height:100vh;  
			background:rgba(0,0,0,0.4); 
		}
		.popule-pwd-err02{
			position: fixed;
			left: 50%;
			top: 30%;
			transform: translate(-50%);
			z-index: 99;
			.popule-pwd-err-content{
				background-color: $white;
				border-radius: 20upx;
				width: 640upx;
				padding: 94upx 0 0;
				position: relative;
				overflow: hidden;
				.close{
					position: absolute;
					right: 30upx;
					top: 30upx;
					color: #a6a7ab;
				}
				.popule-pwd-err-c{
					font-size: 34upx;
					color: #333333;
					width: 440upx;
					margin: 0 auto;
					margin-bottom: 56upx;
					text-align: center;
				}
				.popule-pwd-err-nav{
					border-top: 1upx solid #ACACAC;
					padding-top: 2upx;
					width: 100%;
				}
			}
		}
	}
	
</style>
