<template>
	<view class="app-setting">
		<u-navbar :is-back="true" 
		:title="i18n.setting"
		backIconColor="#000000"
		:background="background" 
		titleColor="#000000">
		</u-navbar>
		<view class="list">
			<view class="li" hover-class="hover-transform2" @tap="navigateTo(0)">
				<text class="txt">{{i18n.modify_login}}</text>
				<text class="iconfont icon-arrow-right"></text>
			</view>
			<view class="li" hover-class="hover-transform2" @tap="navigateTo(1)">
				<text class="txt">{{i18n.modify_pwd}}</text>
				<text class="iconfont icon-arrow-right"></text>
			</view>
			<!-- <view class="li" hover-class="hover-transform2" @tap="pageto('/pages/setting/modify-email')">
				<text class="txt"> {{getLoginInfo.incode=='0'?i18n.Bind_mailbox_modification:'绑定手机号码修改'}}</text>
				<text class="iconfont icon-arrow-right"></text>
			</view> -->
			<!-- <view class="li" hover-class="hover-transform2">
				<text class="txt">{{i18n.current_version}}</text>
				<text class="version">{{version?version:'1.0.0'}}</text>
			</view> -->
		</view>
		<view class="setting-bottom-btn">
			<u-button
			type="success"
			:custom-style="customStyle" 
			size="default" :ripple="true"
			 @click="exit"
			ripple-bg-color="#f00">{{i18n.exit_login}}</u-button>
		</view>
		
		<!-- <Btn :txt="i18n.exit_login" @tapbtn="exit" backgroundColor="#E93841"></Btn> -->
		<!-- <SwitchLang :isSHow="isSHow" @cancel="cancel"></SwitchLang> -->
	</view>
</template>

<script>
	import {pageback, checkLogin, pageto, forceUpdate} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from "vuex"
	export default {
		data() {
			return {
				isSHow:false,
				customStyle:{
					backgroundColor:'#E93841'
				},
				background:'#FFFFFF',
				version: ''
			}
		},
		created(){
			this._getVersion()
		},
		onShow() {
			// checkLogin(this.getLoginInfo, this.getRequestUrl)
			
		},
		computed: {
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getLoginInfo',
				'getRequestUrl',
				"getLang",
				'getLangType',
			])
		},
		onShow(){
			// getid()
			forceUpdate(this.getLangType);
		},
		methods: {
			// getid(id){
			// 	console.log(id,"#################")
			// },
			navigateTo(id) {
				console.log(id)
				if(id==0){
					console.log(1234)
					uni.navigateTo({
						url:`/pages/new-login/verification-Mnemonic?id=${1}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/new-login/verification-Mnemonic?id=${2}`
					})
				}
			},
			back() {
				pageback()
			},
			selectLang() {
				this.isSHow  = true
			},
			exit() {
				this.setLoginInfo('');
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			_getVersion() {
				// console.log(plus.runtime.version);
				// #ifdef APP-PLUS
				this.version = plus.runtime.version
				// #endif
			},
			...mapMutations([
				'setLoginInfo'
			])
		},
		components: {
			
		}
	}
</script>
<style lang="scss">
@import '@/common/scss/variable.scss';
@import '@/common/scss/global.scss';
.setting-bottom-btn{
	width: 300upx;
	margin: 0 auto;
}
.app-setting {
	.list {
		margin: 20upx 0 200upx;
		.li {
			padding:0 30upx;
			background-color: $white;
			border-bottom: 1upx solid $split-line-color2;
			&:last-of-type{
				border-bottom: none;
			}
			height: 100upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.txt {
				font-size: 14px;
				color: $black;
			}
			.lang_txt {
				flex: 1;
				text-align: right;
				font-size: 14px;
				margin-right: -50upx;
				color: $black;
			}
			.version {
				flex: 1;
				text-align: right;
				font-size: 12px;
				margin-right: 15upx;
				color: $black;
			}
			.iconfont {
				font-size: 15px;
				color: $black;
				width: 88upx;
				height: 88upx;
				line-height: 88upx;
				text-align: right;
			}
		}
	}
}
</style>
