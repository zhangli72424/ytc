<template>
	<view class="app-login">
		<u-navbar :is-back="true" 
		:title="i18n.register"
		back-icon-color="#000000"
		:background="background" 
		titleColor="#000000"/>
		
		<view class="account-type">
			<view class="account-type-item" :class="[accountType==0?'active':'']" @tap="selectAccount('0')">
				{{i18n.phone_num}}
			</view>
			<view class="account-type-item" :class="[accountType==1?'active':'']" @tap="selectAccount('1')">
				{{i18n.email}}
			</view>
		</view>
		<view class="content">
			<template v-if="accountType==0">
				<view class="li">
					<input type="text" placeholder-class="other-pl-class" :placeholder="i18n.enter_username" v-model="username">
					<text class="iconfont icon-cha" @tap="username=''"></text>
				</view>
				<view class="li state" @tap="gotostate">
					<view class="left">+ {{getIncode.code}}</text></view>
					<view class="center">{{getLang == 1? getIncode.zh : getIncode.en}}</view>
					<view class="right iconfont icon-arrow-right"></view>
				</view>
				
				<view class="li">
					<input type="text" placeholder-class="other-pl-class" :placeholder="i18n.enter_phone" v-model="phone">
					<text class="iconfont icon-cha" @tap="phone=''"></text>
				</view>
			</template>
			<template v-else>
				<view class="li">
					<input type="text" placeholder-class="other-pl-class" :placeholder="i18n.enter_username" v-model="username">
					<text class="iconfont icon-cha" @tap="username=''"></text>
				</view>
				<view class="li">
					<input type="text" placeholder-class="other-pl-class" :placeholder="i18n.p_EmailAddressOfTheAccountToBeBound" v-model="phone">
					<text class="iconfont icon-cha" @tap="phone=''"></text>
				</view>
			</template>
			
			
	<!-- 		<view class="li">
				<input type="text" :placeholder="i18n.re_enter_phone" v-model="rephone">
				<text class="iconfont icon-cha" @tap="rephone=''"></text>
			</view> -->
			<view class="li">
				<input type="text" placeholder-class="other-pl-class" :placeholder="i18n.enter_vcode" v-model="vcode">
				<view class="v-code"><Vcode :account="phone"></Vcode></view>
			</view>
			<view class="li">
				<input :type="showiconyanjing1 ? 'password' : 'text'" placeholder-class="other-pl-class" :placeholder="i18n.enter_login_pass" v-model="pass">
				<text class="iconfont" :class="showiconyanjing1 ? 'icon-yanjing1' : 'icon-yanjing2'" @tap="showiconyanjing1 = !showiconyanjing1"></text>
			</view>
			<view class="li">
				<input :type="showiconyanjing2 ? 'password' : 'text'" placeholder-class="other-pl-class" :placeholder="i18n.enter_login_pass_again" v-model="repass">
				<text class="iconfont" :class="showiconyanjing2 ? 'icon-yanjing1' : 'icon-yanjing2'" @tap="showiconyanjing2 = !showiconyanjing2"></text>
			</view>
			<view class="li">
				<input type="text" :placeholder="i18n.enter_invitation" placeholder-class="other-pl-class" v-model="invitation">
			</view>
			<!-- <view class="tip">8-20个字符包含数字、字母或者符号, 字母区分大小写</view> -->
			<view class="btn-wrapper">
				<button type="default"
				:loading="showLoad"
				class="sell-btn"
				:class="{'active':!disable}" 
				:disabled="disable"
				@tap.stop="doRegister"
				>{{i18n.register}}</button>
			</view>
			<!-- <view class="btn-wrapper"><Btn :txt="i18n.register" @tapbtn="doRegister"></Btn></view> -->
		</view>
		<view class="goLogin"  @tap="goLogin">{{i18n.go_login}}</view>
	
		<load v-if="showLoad"></load>
	</view>
</template>
<script>
	// import UniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue'
	import Load from '../../components/common/load.vue';
	// import Btn from '@/components/btn/btn2.vue'
	import Vcode from '@/components/vcode/vcode.vue'
	import {mapGetters, mapMutations} from 'vuex'
	// import adNavBar from '@/components/andy-ADNavBar/andy-ADNavBar.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js'
	export default {
		data() {
			return {
				background:'transparent',
				disable:true,
				accountType:0,
				showLoad:false,
				phone: '',
				rephone: '',
				vcode: '',
				pass: '',
				repass: '',
				invitation: '',
				showiconyanjing1: true,
				showiconyanjing2: true,
				isPhone: false,
				username: '',
				isCheck:false
			}
		},
		computed: {
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getLang',
				'getIncode',
				'getLoginInfo',
				'getLangType'
			])
		},
		onShow(){
			forceUpdate(this.getLangType);
		},
		onLoad() {
			this.username = '';
			this.phone = '';
			this.rephone = '';
			this.vcode = '';
			this.pass = '';
			this.repass = '';
			this.invitation = '';
			this.isPhone  = true
		},
		methods: {
			change(){
				if(this.username && this.phone && this.vcode && this.pass && this.repass && this.invitation){
					this.disable = false;
					return false;
				}
				this.disable  = true;
				
			},
			selectAccount(e){
				this.accountType = e;
				this.phone = '';
				this.rephone = '';
				this.vcode = '';
				this.pass = '';
				this.repass = '';
				this.invitation = '';
				if(e==1){
					this.isPhone = false
				}else{
					this.isPhone = true
				}
			},
			doRegister() {
				if(!this.username) {
					showToast(this.i18n.enter_username)
					return
				}
				// if(this.username.length<6){
				// 	showToast(this.i18n.enter_username_engli)
				// 	return
				// }
				
				if(!this.phone) {
					showToast(this.i18n.enter_account)
					return
				}
				// if(this.phone != this.rephone) {
				// 	showToast(this.i18n.Mailboxes_are_inconsistent)
				// 	return
				// }
				if(!this.vcode) {
					showToast(this.i18n.enter_vcode)
					return
				}
				
				if (!this.pass) {
					showToast(this.i18n.enter_login_pass)
					return
				}
				let msdts = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
				
				
				if(!msdts.test(this.pass)){
					showToast(this.getLangType=='chs'?'请输入6到20位数字字母组合登录密码':'Please enter 6 to 20 alphanumeric login passwords')
					return
				}
				if (!this.repass) {
					showToast(this.i18n.enter_login_pass_again)
					return
				}
				
				if (this.pass != this.repass) {
					showToast(this.i18n.login_pass_inconsistent)
					return
				}
				if(this.isCheck) return
				this.isCheck  = true;
				// uni.showLoading()
				this.showLoad = true;
				let _data = {
					email: this.phone,
					password: this.pass,
					password1: this.repass,
					yzm: this.vcode,
					refer: this.invitation,
					lang_type: this.getLang,
					type: this.isPhone ? 2 : 1,
					code: this.isPhone ? this.getIncode.code : '',
					username: this.username,
				}
				fetch('/api/login/register', _data, "post")
					.then(res => {
						this.isCheck  = false;
						console.log(res)
						// uni.hideLoading() 
						showToast(res.data.msg)
						this.showLoad = false;
						if (res.statusCode == 200 && res.data.code == 1) {
							this.setLogin({
								username: this.username,
								password: this.pass
							})
							this.username = '';
							this.phone = '';
							this.rephone = '';
							this.vcode = '';
							this.pass = '';
							this.repass = '';
							this.invitation = '';
							this.username = '';
							setTimeout(() => {
								pageto('/pages/login/login')
							}, 1500)
						}
						
					})
					.catch(err => {
						this.isCheck  = false;
						console.log(err);
						// uni.hideLoading()
						this.showLoad = false;
						console.log(err.data.msg)
					})
			},
			goLogin() {
				uni.navigateBack({
					delta:1
				})
			},
			gotostate() {
				pageto('./state')
			},
			...mapMutations([
				'setLogin'
			])
		},
		components: {
			// adNavBar,
			// UniStatusBar,
			// Btn,
			Vcode,
			Load
		},
		watch: {
			username() {
				this.change()
			},
			phone() {
				this.change()
			},
			vcode() {
				this.change()
			},
			pass() {
				this.change()
			},
			repass() {
				this.change()
			},
			invitation() {
				this.change()
			}
		}
	}
</script>
<!-- <style>
	page{
		background: linear-gradient(to top, #29F19C, #02A1F9) !important;
	}
</style> -->
<style lang="scss">
@import '@/common/scss/variable.scss';
@import '@/common/scss/global.scss';
.other-pl-class{
	// color: #f2f2f2;
}
.bg-wallet{
	background: #061F48 !important;
}
.app-login {
	.baclIcon{
		color: $black;
	}
	.greeting {
		color: $black;
		margin-left: 30upx;
		margin-top: 20upx;
		font-weight: bold;
		position: relative;
		// border: 1px solid red;
		.hello {
			font-size: 30px;
			margin-bottom: 16upx;
		}
		.welcome {
			font-size: 15px;
		}
		.iconfont {
			position: absolute;
			right: 30upx;
			top: 15upx;
			font-size: 20px;
			color: #606060;
		}
	}
	.account-type{
		display: flex;
		align-items: center;
		margin-top: 30upx;
		padding: 20upx 50upx 20upx 50upx;
		// background-color: #f3f2f9;
		.account-type-item{
			flex: 1;
			font-size: 30upx;
			font-weight: bold;
			// color: $white;
			text-align: center;
			&.active{
				color:$theme-color;
				font-size: 40upx;
			}
		}
	}
	.content {
		width: 690upx;
		margin-left: 30upx;
		margin-top: 20upx;
		border-radius: 16upx;
		// background-color: $page-bg-color5;
		padding: 20upx 30upx;
		// box-shadow: 0 5px 2px 0px $page-bg-color3;
		.login-title {
			font-size: 14px;
			color: $split-line-color1;
			text-align: center;
			// padding: 40upx 0 20upx;
			display: flex;
			flex-direction: row;
			.outer-text {
				flex: 1;
				display: inline-block;
				height: 70upx;
				line-height: 70upx;
				margin-top: 20upx;
				.inner-text {
					display: inline-block;
					width: 100%;
					// color: $white;
					&.active {
						font-size: 15px;
						font-weight: bold;
						color: $theme-color;
					}
				}
				&:last-child {
					.inner-text{
						border-left: 1upx solid $theme-color;
					}
				}
			}
		}
		.li.state {
			height: 84upx;
			// border-bottom: 1upx solid $split-line-color2;
			display: flex;
			justify-content: space-between;
			align-items: center;
			// color: $default-color;
			font-size: 14px;
			padding-left: 40upx;
			margin-top: 10upx;
			.left {
				height: 100%;
				line-height: 84upx;
				margin-right: 30upx;
				margin-left: 10upx;
			}
			.center {
				flex: 1;
				margin-left: 10px;
			}
			.right {
				width: 100upx;
				text-align: right;
				height: 100%;
				line-height: 80upx;
			}
		}
		.li {
			height: 84upx;
			// border-bottom: 1upx solid $split-line-color2;
			// background-color: #EDEDED;
			// border-bottom: 1upx solid $white;
			border: 1rpx solid $black;
			border-radius: 8rpx;
			// border-radius: 110upx;
			position: relative;
			z-index: 1;
			padding-left: 40upx;
			input {
				height: 84upx;
				font-size: 12px;
				// color: $default-color;
			}
			.v-code {
				position: absolute;
				right: 40upx;
				top: 0;
				height: 84upx;
				// color: $white;
				font-weight: bold;
				line-height: 84upx;
				font-size: 13px;
				padding: 0 10upx;
				width: 100px;
				text-align: right;
				z-index: 10;
			}
			.iconfont {
				position: absolute;
				right: 40upx;
				top: 0;
				width: 80upx;
				height: 84upx;
				line-height: 84upx;
				z-index: 5;
				text-align: right;
				// color: $white;
			}
			&+.li {
				margin-top: 30upx;
			}
		}
		.tip {
			font-size: 11px;
			color: $text-gray-color3;
			margin-bottom: 80upx;
			margin-top: 26upx;
		}
		.btn-wrapper {
			.sell-btn{
				background: $theme-dark-color;
				color: $white;
				margin: 50upx 30upx 0;
				line-height: 88upx;
				height: 88upx;
				border-radius: 6upx;
				&.active{
					color: $white;
					background: $theme-color;
				}
			}
		}
	}
	.goLogin {
		width: 690upx;
		height: 86upx;
		// color: $white;
		line-height: 86upx;
		text-align: center;
		font-size: 13px;
		margin-top: 50upx;
		margin-left: 30upx;
	}
}
</style>

