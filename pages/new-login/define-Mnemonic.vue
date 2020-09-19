<template>
	<view class="content">
		<view class="define-title">
			<view><!-- {{i18n.Backup_tips}} -->备份提示</view>
			<text><!-- {{i18n.define_mnemo_tip0}} -->请按顺序抄写助记词，确保备份正确</text>
		</view>
		<view class="define-content">
			<block v-for="(item,index) in list" :key="index">
				<view class="define-li" :class="{'no-border':(index+1)%3==0}">
					<text>{{index+1}}</text>
					{{item.mnemonic}}
				</view>
			</block>
			
			
		</view>
		<view class="tips-con">
			<view class="tips-con-i">
				<!-- {{i18n.define_mnemo_tip1}} -->妥善保管助记词至隔离网络的安全地方。
			</view>
			<view class="tips-con-i">
				<!-- {{i18n.define_mnemo_tip2}} -->请勿将助记词在联网环境下分享和存储，比如 邮件、相册、社交应用等。
			</view>
		</view>
		
		
		<view class="tips-bottom-button">
			<button hover-class="active" @tap.stop="jump">我以备份</button>
		</view>
		
		
	</view>
</template>

<script>
	import Load from '../../components/common/load.vue';
	import {fetch, _updataTabBar, showToast, pageto, forceUpdate} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	export default {
		data() {
			return {
				list:[]
			};
		},
		computed:  {
			i18n() {
				return this.$t('message');
			},
			...mapGetters([
				'getRequestUrl',
				"getLoginInfo",
				'getTextArr',
				'getLangType',
				'getLang'
			])
		},
		onShow(){
			this.getAvarte();
		},
		methods:{
			getAvarte(){
				let url =  '/api/index/mnemonic';
				let data  ={
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token
				}
				this.list = [{0:'earth'},{0:'earth'},{0:'eye'},{0:'mouth'},{0:'egg'},{0:'tab'},{0:'up'},{0:'down'},{0:'sister'},{0:'earth'},{0:'earth'},{0:'earth'}]
				// return
				fetch(url,data,"POST").then(res=>{
					if(res.data.code){
						this.list = res.data.data
					}
				})
			},
			jump(){
				console.log(11);
				uni.navigateTo({
					url:`/pages/new-login/verification-Mnemonic?list=${JSON.stringify(this.list)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		height: 100vh;
		background-color: #FFFFFF;
		padding: 0 30upx;
		.tips-bottom-button{
			position: fixed;
			width: 690upx;
			left: 30upx;
			bottom: 100upx;
			button{
				width: 690upx;
				line-height: 88upx;
				height: 88upx;
				color: #FFFFFF;
				background-color: #337BFD;
				&.active{
					transform: scale(.9);
					opacity: .9;
				}
			}
		}
		.define-title{
			padding-top: 32upx;
			view{
				font-size: 32upx;
				color: #141414;
				font-weight: bold;
			}
			text{
				margin-top: 32upx;
				font-size: 26upx;
				color: #FF5050;
				display: inline-block;
			}
		}
		.define-content{
			margin-top: 26upx;
			border: 1upx solid #DFE5FB; 
			background: #fafbff;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-radius: 10upx;
			.define-li{
				// width: 197upx;
				width: 33.3%;
				padding-top: 36upx;
				line-height: 80upx;
				position: relative;
				font-size: 32upx;
				padding-left: 32upx;
				border-bottom: 1upx solid #DFE5FB;
				border-right: 1upx solid #DFE5FB;
				&.no-border{
					border-right: none;
				}
				text{
					position: absolute;
					right: 16upx;
					top: 0;
					font-size: 26upx;
				}
			}
		}
		.tips-con{
			margin-top: 66upx;
			.tips-con-i{
				color: #535353;
				font-size: 26upx;
				padding-left: 54upx;
				position: relative;
				&::before{
					content: "";
					position: absolute;
					width: 8upx;
					height: 8upx;
					background-color: #337BFD;
					border-radius: 4upx;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
				&:first-of-type{
					margin-bottom: 48upx;
				}
			}
		}
	}
</style>
