<template>
	<view class="app-login">
		<u-navbar :is-back="false" :title="i18n.login" :background="background" titleColor="#000000">
			
			<view slot="right" class="right-nav-color" hover-class="active" @tap.stop="goRegister">
				{{i18n.register}}
			</view>
		</u-navbar>
		<view class="login-header">
			<!-- <image src="../../static/imgs/login01.png" mode="widthFix" lazy-load></image> -->
			<view class="login-title">
				{{i18n.hello}}
			</view>
			<view class="login-title-op">
				{{i18n.welcome_to}}
			</view>
		</view>
		<!-- <view class="greeting">
			<view class="hello">Welcome</view>
			<view class="welcome">{{i18n.welcome_to}}</view>
		</view> -->
		<view class="lang">
			<text class="chs" :class="{active: curLang == 'chs'}" @tap="switchlang('chs')">{{i18n.chs}}</text> 
			<text class="hline">|</text>
			<text class="en" :class="{active: curLang == 'en'}" @tap="switchlang('en')">{{i18n.en}}</text>
		</view>
		<view class="content">
			<!-- <view class="login-title">登录</view> -->
			<!-- <view class="li state">
				<view class="left">+ 86</view>
				<view class="center">中国</view>
				<view class="right iconfont icon-arrow-right"></view>
			</view> -->
		<!-- 	<view class="li">
				<input type="text" placeholder="请输入用户名" v-model="name">
				<text class="iconfont icon-cha" @tap="name=''"></text>
			</view> -->
			<view class="li">
				<input type="text" placeholder-class="other-pl-class" :placeholder="i18n.enter_account" v-model="phone">
				<text class="iconfont icon-cha" @tap="phone=''"></text>
			</view>
			<view class="li">
				<input :type="showiconyanjing1 ? 'password' : 'text'" placeholder-class="other-pl-class" :placeholder="i18n.enter_login_pass" v-model="pass">
				<text class="iconfont" :class="showiconyanjing1 ? 'icon-yanjing1' : 'icon-yanjing2'" @tap="showiconyanjing1 = !showiconyanjing1"></text>
			</view>
			<view class="forget" @tap.stop="forget">{{i18n.forget}}</view>
			<view class="btn-wrapper">
				<!-- <Btn 
			backgroundColor="#333333" 
			:txt="i18n.login" 
			@tapbtn="doLogin"></Btn> -->
				<button type="default"
				:loading="showLoad"
				class="sell-btn"
				:class="{'active':!disable}" 
				:disabled="disable"
				@tap.stop="doLogin"
				>{{i18n.login}}</button>
			</view>
		</view>
<!-- 		<view class="goLogin" @tap.stop="forget">{{i18n.forget}}</view> -->
		<load v-if="showLoad"></load>
		
		
	<!-- 	<view class="login-bottom-bg">
			<image src="../../static/imgs/login-bottom-bg.png" mode="widthFix" lazy-load></image>
		</view> -->
		<label class="Registration-Agreement">
			<checkbox-group  @change="checkboxChange">
				<checkbox value="isChoose"  :checked="isChoosed"/>
			</checkbox-group>
			<view>{{i18n.I_have_read_and_agree}}<text @tap.stop="Agreement">{{i18n.Registration_Agreement}}</text></view>
		</label>
	</view>
</template>

<script>
	import Load from '@/components/common/load.vue';
	import {mapGetters, mapMutations} from 'vuex'
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js'
	let I18N = null
	export default {
		data() {
			return {
				isChoosed:false,
				background:'transparent',
				name:'',
				showLoad:false,
				phone: '',
				pass: '',
				curLang: 'chs',
				showiconyanjing1: true,
				disable:true,
				type:'',
				isCheck:false
			}
		},
		computed: {
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLang',
				'getIncode',
				'getLogin',
				'getLangType',
				'getLoginInfo'
			])
		},
		onLoad(e){
			if(e.type){
				this.type = e.type
			}
		},
		onShow() {
			console.log(this.getLogin);
			forceUpdate(this.getLangType)
			this.name = this.getLoginInfo.username
			this.phone = this.getLogin.username
			this.pass = this.getLogin.password
			this.curLang = this.$i18n.locale
			// console.log(this.$i18n)
			// I18N = this.$i18n
			// console.log(this.getLoginInfo);
			if(this.getLoginInfo.email){
				if(this.getLoginInfo.token){
					if(this.type==2){
						let {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode} = this.getLoginInfo
						let loginfo = {email, id, incode, password, paypwd, salt, status, token:'', username, gespwd, yqcode}
						this.setLoginInfo(loginfo)
						return false;
					}
					let data = {
						id:this.getLoginInfo.id,
						token:this.getLoginInfo.token
					}
					this.showLoad = true
					fetch('/api/index/index',data,'POST').then(res=>{
						this.showLoad = false 
						if(res.data.code == 1){
							// return
							uni.switchTab({
								url:'/pages/index/index'
							})
						}
					}).catch(err=>{
						this.showLoad = false
					})
				}
			}
		},
		methods: {
			Agreement(){
				uni.navigateTo({
					url:'/pages/setting/protocol'
				})
			},
			checkboxChange(evt){
				if(evt.detail.value[0]=="isChoose"){
					this.isChoosed = true;
					return
				}
				this.isChoosed = false;
				console.log(evt);
			},
			change(){
				if(this.phone && this.pass){
					this.disable = false;
					return false;
				}
				this.disable  = true;
			},
			doLogin() {
				if(!this.isChoosed){
					showToast(this.i18n.Registration_Agreement_01)
					return
				}
				if (!this.phone) {
					showToast(this.i18n.enter_account)
					return
				}
				if (!this.pass) {
					showToast(this.i18n.enter_login_pass)
					return
				}
				this.showLoad = true
				let _data = {
					username: this.phone,
					password: this.pass,
					lang_type: this.getLang
				}
				if(this.isCheck) return
				this.isCheck  = true;
				fetch('/api/login/login', _data, "post")
					.then(res => {
						this.isCheck  = false;
						this.showLoad = false
						if (res.statusCode == 200 && res.data.code == 1) {
							let {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode} = res.data.data
							let loginfo = {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode}
							let time = res.data.time;
							this.setLoginInfo(loginfo)
							this.setLogin({
								username: this.phone,
								password: this.pass
							})
							uni.switchTab({
								url:'/pages/index/index'
							})
							// pageto('/pages/index/index', true)
						} else {
							showToast(res.data.msg)
						}
					})
					.catch(err => {
						this.isCheck  = false;
						this.showLoad = false
					})
			},
			goRegister() {
				pageto('/pages/register/register')
			},
			switchlang(str) {
				this.curLang  = str
			},
			forget() {
				// console.log('forget')
				pageto('/pages/forget/forget')
			},
			...mapMutations([
				'setLoginInfo',
				'setLogin',
				'setLangType'
			])
		},
		components: {
			Load
		},
		watch: {
			curLang(newv) {
				this.$i18n.locale = newv
				this.setLangType(newv)
			},
			phone(val){
				this.change()
			},
			pass(val){
				this.change()
			}
		}
	}
</script>
<style lang="scss">
@import '@/common/scss/variable.scss';
@import '@/common/scss/global.scss';

	.Registration-Agreement{
		display: flex;
		align-items: center;
		justify-content: center;
		checkbox-group{
		}
		view{
			color: $light_gray;
			text{
				text-decoration: underline;
				color: $theme-color;
			}
		}
	}
	.login-header{
		padding:100upx 0 0 100upx;
		image{
			width: 87upx;
			height: 96upx;
		}
		.login-title{
			margin-top: 40upx;
			font-size: 48upx;
		}
		.login-title-op{
			margin-top: 20upx;
			font-size: 32upx;
		}
	}
	.adnav-title-mi{
		padding-left: 80upx;
		width: 100%;
		display: block;
		text-align: center;
	}
	.right-nav-color{
		padding-right: 30upx;
	}
	.messageage{
		width: 80upx;
	}
	.login-bottom-bg{
		width: 750upx;
		height: 268upx;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: -1;
		image{
			width: 750upx;
			height: 268upx;
			flex-shrink: 0;
		}
	}
	.bg-wallet{
		background: #FFFFFF;
	}
	.rightIcon{
		&.active{
			color: $text-gray-color4;
		}
	}
	.title{
		background: #1e1652;
		.title-text{
			line-height: 78upx;
			text-align: center;
			position: relative;
			font-size: 36upx;
			text{
				position: absolute;
				right: 30upx;
				top: 0;
				line-height: 78upx;
				display: block;
				font-size: 26upx;
				z-index: 99;
			}
		}
}
.app-login {
	
	.greeting {
		color: $text-gray-color4;
		margin-left: 30upx;
		margin-top: 20upx;
		font-weight: bold;
		.hello {
			font-size: 30px;
			margin-bottom: 16upx;
			color: $text-gray-color4;
		}
		.welcome {
			font-size: 15px;
			color: $text-gray-color4;
		}
	}
	.lang {
		text-align: right;
		margin-right: 86upx;
		margin-top: 60upx;
		.hline {
			margin: 0 20upx;
			color: $theme-color;
			font-weight: 200;
			font-size: 12px;
		}
		.chs, .en {
			width: 60upx;
			height: 60upx;
			font-size: 14px;
			color: #606060;
			display: inline-block;
			text-align: center;
			line-height: 60upx;
			&.active {
				color: $theme-color;
				font-weight: bold;
			}
		}
	}
	.content {
		width: 690upx;
		margin-left: 30upx;
		height: 540upx;
		border-radius: 16upx;
		// background-color: $page-bg-color5;
		padding: 40upx 30upx;
		// box-shadow: 0 5px 2px 0px $page-bg-color3;
		.login-title {
			font-size: 14px;
			color: $split-line-color1;
			text-align: center;
			padding: 40upx 0 20upx;
		}
		.li {
			height: 84upx;
			position: relative;
			z-index: 1;
			position: relative;
			// background-color: #EDEDED;
			border-radius: 8upx;
			border: 1upx solid $black;
			input {
				height: 84upx;
				font-size: 12px;
				padding-left: 40upx;
			}
			.iconfont {
				position: absolute;
				right: 20upx;
				top: 0;
				width: 80upx;
				height: 84upx;
				line-height: 84upx;
				z-index: 5;
				text-align: center;
			}
			&+.li {
				margin-top: 30upx;
			}
		}
		.forget {
			font-size: 12px;
			font-weight: bold;
			text-align: right;
			margin-top: 29upx;
			margin-right: 40upx;
		}
		.btn-wrapper {
			.sell-btn{
				margin-top: 120upx;
				background: $theme-dark-color;
				color: $white;
				margin: 128upx 30upx 0;
				line-height: 88upx;
				height: 88upx;
				border-radius: 6upx;
				&.active{
					background: $theme-color;
				}
			}
		}
	}
	.goLogin {
		width: 328upx;
		height: 86upx;
		color: $text-gray-color4;
		line-height: 86upx;
		text-align: center;
		font-size: 13px;
		margin: 60upx auto;
	}
}
</style>

