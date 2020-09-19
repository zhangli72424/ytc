<template>
	<view> 
		<!-- <uni-status-bar bgcolor="transparent"></uni-status-bar> -->
		<uni-nav-bar leftIcon="back" color="#ffffff" :fixed="true" @click-left="clickleft"  backgroundColor="transparent" :border="false">
			<view class="leftIcon" slot="left" @tap.stop="clickleft">
				<!-- #ifdef APP-PLUS -->
				<i class="icon iconfont icon-arrow-left" ></i>
				<!-- #endif -->
			</view>		
		</uni-nav-bar>
		<image src="../../static/imgs/new-register-bg.png" mode="widthFix" lazy-load class="new-register-bg"></image>
		<view class="register-content">
			<view class="register-content-title">
				{{i18n.Login_wallet}}
			</view>
			<view class="register-content-view">
				<view class="input-view">
					<image src="../../static/imgs/register-icon-01.png" mode="widthFix" lazy-load></image>
					<input type="text" :placeholder="i18n.Please_enter_the_wallet_name" v-model="username">
				</view>
				<view class="input-view">
					<image src="../../static/imgs/register-icon-02.png" mode="widthFix" lazy-load></image>
					<input type="text" password :placeholder="i18n.Please_enter_the_wallet_password" v-model="password">
				</view>
			</view>
		</view>
		<view class="forget-pwd" @tap.stop="forgester">
			<text>{{i18n.forget}}？</text>
		</view>
		<view class="register-bottom-btn">
			<button type="default" :class="{'acv':isUp}" :disabled="!isUp" @tap.stop="comfirm">{{i18n.Login_wallet}}</button>
		</view>
		<view class="to-register">
			{{i18n.no_wallet}}?<text @tap.stop="register">{{i18n.Create_immediately}}></text>
		</view>
		<load v-if="showLoad"></load>
	</view>
</template>

<script>
	// import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue';
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	import {mapGetters, mapMutations} from 'vuex'
	import Load from '../../components/common/load.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js'
	export default {
		components:{
			uniStatusBar,Load
		},
		data() {
			return {
				showLoad:false,
				isUp:false,
				username:'',
				password:''
			};
		},
		computed: {
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLang',
				'getIncode',
				'getLoginInfo',
				'getLogin',
				'getLangType'
			])
		},
		watch:{
			username(val){
				this.change();
			},
			password(val){
				this.change();
			}
		},
		onShow(){
			forceUpdate(this.getLangType)
			if(this.getLogin.username){
				this.username = this.getLogin.username
				this.password = this.getLogin.password
			}else if(this.getLoginInfo.email){
				this.username = this.getLoginInfo.email
				this.password = this.getLoginInfo.userpaypwd
			}
			
		},
		methods:{
			...mapMutations([
				'setLoginInfo',
				'setLogin',
				'setLoginTime',
				'setLangType'
			]),
			comfirm(){
				if (!this.username) {
					showToast(this.i18n.enter_phone)
					return
				}
				if (!this.password) {
					showToast(this.i18n.enter_login_pass)
					return
				}
				this.showLoad = true
				let _data = {
					username: this.username,
					password: this.password,
					lang_type: this.getLang
				}
				fetch('/api/login/login', _data, "post")
					.then(res => {
						this.showLoad = false
						if (res.statusCode == 200 && res.data.code == 1) {
							console.log(res)
							let {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode, pay_key} = res.data.data
							let loginfo = {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode, pay_key}
							let time = res.data.time;
							loginfo.userpaypwd = this.password
							console.log(loginfo);
							this.setLoginInfo(loginfo)
							this.setLogin({
								username: this.phone,
								password: this.pass
							})
							
							this.setLoginTime(time);
							pageto('/pages/index/index', true)
						}else if(res.statusCode == 200 && res.data.code == 3) {
							// showToast(res.data.msg)
							let {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode} = res.data.data
							let loginfo = {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode}
							let time = res.data.time;
							this.setLoginInfo(loginfo)
							this.setLogin({
								username: this.phone,
								password: this.pass
							})		
							this.setLoginTime(time);
							uni.navigateTo({
								url:'/pages/new-login/Mnemonic-tips'
							})
						}else {
							showToast(res.data.msg)
						}
					})
					.catch(err => {
						this.showLoad = false
						console.log(err)
					})
			},
			change(){
				if(this.username && this.password){
					this.isUp = true;
					return
				}
				this.isUp = false;
			},
			forgester(){
				uni.navigateTo({
					url:'/pages/new-login/Import-wallet'
				})
			},
			register(){
				uni.navigateTo({
					url:'/pages/new-login/new-register'
				})
			},
			clickleft(){
				console.log('11');
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.leftIcon{
		padding-left: 30upx;
		line-height: 88upx;
		.iconfont{
			display: block;
			line-height: 88upx;
		}
	}
.new-register-bg{
	position: fixed;
	left: 0;
	top: 0;
	z-index: -1;
	width: 750upx;
	height: 417upx;
}
.to-register{
	margin-top: 120upx;
	text-align: center;
	font-size: 30upx;
	text{
		color: #007DFF;
	}
}
.forget-pwd{
	padding: 40upx 30upx 60upx;
	text-align: right;
	color: #007DFF;
	font-size: 30upx;
}
.register-bottom-btn{
	width: 690upx;
	margin: 0 auto;
	button{
		width: 690upx;
		height: 88upx;
		line-height: 88upx;
		background-color: #D1D1D1;
		color: #FFFFFF;
		&.acv{
			background-color: #00a2ff;
		}
	}
}
.register-content{
	padding: 0 30upx;
	.register-content-title{
		font-size: 54upx;
		font-weight: bold;
		color: #FFFFFF;
		margin-bottom: 40upx;
	}
	.register-content-view{
		background-color: #FFFFFF;
		border-radius: 20upx;
		padding: 80upx 30upx;
		box-shadow: 2upx 5upx 20upx #f5f7fa;
		.input-view{
			line-height: 92upx;
			height: 92upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 25upx;
			background-color: #F9F9F9;
			border-radius: 46upx;
			margin-bottom: 40upx;
			image{
				width: 50upx;
				height: 50upx;
				flex-shrink: 0;
				margin-right: 23upx;
			}
			input{
				flex: 1;
				line-height: 92upx;
				height: 92upx;
			}
		}
	}
}
</style>
