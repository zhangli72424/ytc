<template>
	<view class="app-forget">
		<!-- <view class="greeting">
			<view class="hello">Welcome</view>
			<view class="welcome">{{i18n.welcome_to}}</view>
			<view @tap="tappageback" class="iconfont icon-cha"></view>
		</view> -->
		<u-navbar :is-back="true"
		:title="i18n.forget"
		back-icon-color="#ffffff"
		:background="background" 
		titleColor="#ffffff"/>
		<view class="content">
			<!-- <view class="login-title">忘记密码</view> -->
			<view class="li">
				<input type="text" :placeholder="i18n.enter_account" v-model="phone" :disabled="ischeck">
				
				<view class="v-code" @tap.stop="check">{{i18n._check_in}}</view>
			</view>
			<view class="li-tip" v-if="username">
				{{i18n.Current_mailbox}}：{{username}}
			</view>
			<view class="li">
				<input type="text" :placeholder="i18n.enter_vcode" v-model="vcode">
				<view class="v-code"><Vcode :account="username" type="forget"></Vcode></view>
			</view>
			<view class="li">
				<input :type="showiconyanjing1 ? 'password' : 'text'" :placeholder="i18n.enter_new_pass" v-model="pass">
				<text class="iconfont" :class="showiconyanjing1 ? 'icon-yanjing1' : 'icon-yanjing2'" @tap="showiconyanjing1 = !showiconyanjing1"></text>
			</view>
			<view class="li">
				<input :type="showiconyanjing2 ? 'password' : 'text'" :placeholder="i18n.enter_new_pass_again" v-model="repass">
				<text class="iconfont" :class="showiconyanjing2 ? 'icon-yanjing1' : 'icon-yanjing2'" @tap="showiconyanjing2 = !showiconyanjing2"></text>
			</view>
			<view class="btn-wrapper">
				<button type="default"
				@tap.stop="doFetch"
				:class="{'active':!disable}"
				:disabled="disable"
				>{{i18n.confirm}}</button>
			</view>
		</view>
		<load v-if="showLoad"></load>
	</view>
</template>

<script>
	import Vcode from '@/components/vcode/vcode.vue'
	import Load from '../../components/common/load.vue';
	import {mapGetters, mapMutations} from 'vuex'
	import {pageto, showToast, pageback, fetch, forceUpdate} from '@/common/js/util.js'
	export default {
		data() {
			return {
				background:'linear-gradient(45deg, #2FB383, #22DE8E)',
				showLoad:false,
				disable:true,
				phone: '',
				vcode: '',
				pass: '',
				repass: '',
				username:'',
				invitation: '',
				showiconyanjing1: true,
				showiconyanjing2: true,
				ischeck:false
			}
		},
		watch:{
			vcode(val){this.change()},
			pass(val){this.change()},
			repass(val){this.change()}
		},
		onLoad() {
			// this.phone = this.getLogin.username
		},
		onShow() {
			forceUpdate(this.getLangType);
		},
		computed: {
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLang',
				'getLogin',
				'getLangType'
			])
		},
		methods: {
			change(){
				if(this.vcode && this.pass && this.repass){
					this.disable = false;
					return false;
				}
				this.disable  = true;
			},
			check(){
				if(this.ischeck){ return }
				this.ischeck  = false;
				if(!this.phone){
					showToast(this.i18n.enter_account)
					return
				}
				let _data = {
					username : this.phone,
					lang_type: this.getLang
				}
				fetch('/api/login/phone_verify', _data, 'POST')
					.then(res=>{
						showToast(res.data.msg)
						if(res.data.code){
							this.username = res.data.data;
							this.ischeck  = true;
						}
					})
					.catch(err=>{
						showToast(err.data.msg)
					})
			},
			doFetch() {
				// console.log('111');return
				if(!this.ischeck){
					showToast(this.i18n.p_enter_check_in)
					return
				}
				// console.log(13456)
				if(!this.phone){
					showToast(this.i18n.enter_account)
					return
				}
				if(!this.vcode){
					showToast(this.i18n.enter_vcode)
					return
				}
				if(!this.pass){
					showToast(this.i18n.enter_new_pass)
					return
				}
				if(!this.repass){
					showToast(this.i18n.enter_new_pass_again)
					return
				}
				if(this.pass != this.repass){
					showToast(this.i18n.inconsistent_login_password)
					return
				}
				// 13750430574
				this.showLoad = true;
				let _data = {
					username: this.phone,
					yzm: this.vcode,
					password: this.pass,
					lang_type: this.getLang
				}
				// console.log(_data)
				fetch('/api/login/resetpswd', _data, 'POST')
					.then(res => {
						// console.log(res)
						this.showLoad = false;
						if(res.statusCode == 200 && res.data.code == 1){
							// this.setLogin({
							// 	username: this.phone,
							// 	password: this.pass
							// })
							setTimeout(()=>{
								pageback()
							},500)
						}
						showToast(res.data.msg)
					})
					.catch(error => {
						this.showLoad = false;
						console.log(error)
					})
			},
			tappageback() {
				pageback()
			},
			...mapMutations([
				'setLogin'
			])
		},
		components: {
			Vcode,
			Load
		}
	}
</script>

<style lang="scss">
@import '@/common/scss/variable.scss';
@import '@/common/scss/global.scss';
.app-forget {
	.greeting {
		color: $white;
		margin-left: 30upx;
		margin-top: 20upx;
		position: relative;
		font-weight: bold;
		.iconfont {
			width: 80upx;
			height: 80upx;
			color: $white;
			position: absolute;
			right: 30upx;
			top: 50%;
			transform: translateY(-50%);
			text-align: center;
			line-height: 80upx;
			font-size: 26px;
			// color: rgba($color: black, $alpha: .6);
		}
		.hello {
			font-size: 30px;
			margin-bottom: 16upx;
		}
		.welcome {
			font-size: 15px;
		}
	}
	.content {
		width: 690upx;
		margin-left: 30upx;
		margin-top: 120upx;
		height: 760upx;
		border-radius: 16upx;
		background-color: $page-bg-color5;
		padding:40upx 30upx 0;
		box-shadow: 0 5px 2px 0px $page-bg-color5;
		.login-title {
			font-size: 14px;
			color: $split-line-color1;
			text-align: center;
			padding: 40upx 0 20upx;
		}
		.li-tip{
			font-size: 26upx;
			color: #E9E9F4;
			margin: 20upx 0;
		}
		.li {
			height: 84upx;
			position: relative;
			z-index: 1;
			position: relative;
			// background-color: #EDEDED;
			// border-radius: 55upx;
			border-bottom: 1upx solid $page-bg-color3;
			input {
				height: 84upx;
				font-size: 12px;
				color: $white;
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
				color: $text-gray-color7;
			}
			.v-code {
				position: absolute;
				right: 40upx;
				top: 0;
				height: 84upx;
				color: $text-gray-color4;
				font-weight: bold;
				line-height: 84upx;
				font-size: 13px;
				padding: 0 10upx;
				width: 100px;
				text-align: right;
				z-index: 10;
			}
			&+.li {
				margin-top: 30upx;
			}
		}
		.btn-wrapper {
			margin-top: 80upx;
			button{
				margin-top: 120upx;
				background: $text-gray-color1;
				color: $white;
				margin: 128upx 30upx 0;
				line-height: 88upx;
				height: 88upx;
				border-radius: 6upx;
				&.active{
					color: $white;
					background: $button-color;
				}
			}
		}
	}
}
</style>

