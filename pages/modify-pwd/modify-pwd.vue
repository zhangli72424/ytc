<template>
	<view class="app-forget">
		<view class="content">
			<!-- <view class="login-title">忘记密码</view> -->
			<view class="li">
				<input type="text" disabled :placeholder="i18n.enter_account" v-model="phone">
				<!-- <text class="iconfont icon-cha" @tap="phone=''"></text> -->
			</view>
		<!-- 	<view class="li">
				<input type="text" :placeholder="i18n.enter_vcode" v-model="vcode" maxlength="6">
				<view class="v-code"><Vcode :account="phone"></Vcode></view>
			</view> -->
			<view class="li">
				<input :type="showiconyanjing1 ? 'password' : 'text'" :placeholder="i18n.enter_new_pass" v-model="pass" maxlength="6">
				<text class="iconfont" :class="showiconyanjing1 ? 'icon-yanjing1' : 'icon-yanjing2'" @tap="showiconyanjing1 = !showiconyanjing1"></text>
			</view>
			<view class="li">
				<input :type="showiconyanjing2 ? 'password' : 'text'" :placeholder="i18n.enter_new_pass_again" v-model="repass" maxlength="6">
				<text class="iconfont" :class="showiconyanjing2 ? 'icon-yanjing1' : 'icon-yanjing2'" @tap="showiconyanjing2 = !showiconyanjing2"></text>
			</view>
			<view class="btn-wrapper">
				<u-button
				type="success"
				:custom-style="customStyle" 
				size="default" :ripple="true"
				 @click="doFetch"
				ripple-bg-color="#29f19c">{{i18n.confirm}}</u-button>
				<!-- <Btn :txt="i18n.confirm" @tapbtn="doFetch"></Btn> -->
				</view>
		</view>
		<load v-if="showLoad"></load>
	</view>
</template>

<script>
	import Load from '../../components/common/load.vue'
	import Vcode from '@/components/vcode/vcode.vue'
	import {mapGetters, mapMutations} from 'vuex'
	import {pageto, showToast, pageback, fetch, forceUpdate} from '@/common/js/util.js'
	export default {
		data() {
			return {
				customStyle:{
					background:'#0E45D8',
					width:"350rpx",
					margin:"0 auto"
				},
				showLoad:false,
				phone: '',
				username:'',
				vcode: '',
				pass: '',
				repass: '',
				invitation: '',
				showiconyanjing1: true,
				showiconyanjing2: true,
				isCheck:false,
			}
		},
		onLoad(e) {
			let str=JSON.parse(e.str)
			let arr=""
			str.forEach((item,index)=>{
				console.log(item.data)
				arr+=item.data
			})
			this.vcode=arr
			uni.setNavigationBarTitle({
				title:this.i18n.modify_pwd
			})
			this.username = this.getLoginInfo.username
			this.phone = this.getLoginInfo.username
		},
		onNavigationBarButtonTap(e){
			if(e.index=='0'){
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
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
				"getLoginInfo",
				'getLangType'
			])
		},
		methods: {
			doFetch() {
				if(!this.phone){
					showToast(this.i18n.enter_account)
					return
				}
				// if(!this.vcode){
				// 	showToast('请输入助记词')
				// 	return
				// }
				if(!this.pass){
					showToast(this.i18n.enter_new_pass)
					return
				}
				if(!this.repass){
					showToast(this.i18n.enter_new_pass_again)
					return
				}
				if(this.pass != this.repass){
					showToast(this.i18n.Inconsistent_payment_password)
					return
				}
				if(this.isCheck)
				this.isCheck  = true;
				this.showLoad = true;
				let _data = {
					id: this.getLoginInfo.id,
					token: this.getLoginInfo.token,
					username: this.getLoginInfo.username,
					yzm: this.vcode,
					// password: this.pass,
					lang_type: this.getLang,
					pwd: this.pass,
					pwd2: this.repass,
					lang_type: this.getLang,
					type: this.getLoginInfo.incode?2:1
				}
				console.log(_data)
				
				fetch('/api/user/setPaypwd', _data, 'POST')
					.then(res => {
						this.isCheck  = false;
						// console.log(res)
						// uni.hideLoading()
						this.showLoad = false;
						if(res.statusCode == 200 && res.data.code == 1){
							
							let {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode} = this.getLoginInfo
							let loginfo = {email, id, incode, password, paypwd:this.pass, salt, status, token, username, gespwd, yqcode}
							this.setLoginInfo(loginfo)
							// setTimeout(()=>{
							// 	pageback()
							// },500)
							uni.navigateBack({
								delta:3
							})
						}
						showToast(res.data.msg)
					})
					.catch(error => {
						this.isCheck  = false;
						// uni.hideLoading()
						this.showLoad = false;
						showToast(res.data.msg)
					})
			
				
					uni.navigateTo({
						url:'/pages/index/index'
					})
			},
			tappageback() {
				pageback()
			},
			...mapMutations([
				'setLogin',
				'setLoginInfo'
			])
		},
		components: {
			Vcode,
			Load
		}
	}
</script>

<style lang="scss" scoped>
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
			color: rgba($color: black, $alpha: .6);
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
		// width: 690upx;
		// margin-left: 30upx;
		// margin-top: 120upx;
		// height: 760upx;
		// border-radius: 16upx;
		border-top: 20rpx solid #f2f2f2;
		background-color: $white;
		padding: 40upx 30upx 0;
		// box-shadow: 0 5px 2px 0px $page-bg-color5;
		.login-title {
			font-size: 14px;
			color: $split-line-color1;
			text-align: center;
			padding: 40upx 0 20upx;
		}
		.li {
			height: 84upx;
			// border-bottom: 1upx solid $split-line-color2;
			position: relative;
			z-index: 1;
			border: 1upx solid $page-bg-color3;
			border-radius: 10rpx;
			padding-left: 40upx;
			input {
				height: 84upx;
				font-size: 12px;
				color: $black;
			}
			.v-code {
				position: absolute;
				right: 40upx;
				top: 0;
				height: 84upx;
				color: $theme-color;
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
				color: $theme-color;
			}
			&+.li {
				margin-top: 30upx;
			}
		}
		.btn-wrapper {
			margin-top: 80upx;
		}
	}
}
</style>

