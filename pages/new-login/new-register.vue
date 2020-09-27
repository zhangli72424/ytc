<template>
	<view> 
		<uni-status-bar bgcolor="transparent"></uni-status-bar>
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
				注册
			</view>
			<view class="register-content-view">
				<view class="input-view">
					<image src="../../static/imgs/register-icon-01.png" mode="widthFix" lazy-load></image>
					<input type="text" placeholder="请设置用户名" v-model="username">
				</view>
				<view class="input-view">
					<image src="../../static/imgs/register-icon-02.png" mode="widthFix" lazy-load></image>
					<input type="text" placeholder="请设置密码" v-model="password" :password="password1">
					<i class="iconfont"
					 :class="[password1?'icon-yanjing1':'icon-yanjing2']"
					 @tap.stop="password1=!password1"></i>
				</view>
				<view class="input-view">
					<image src="../../static/imgs/register-icon-02.png" mode="widthFix" lazy-load></image>
					<input type="text" placeholder="请确认密码" v-model="repassword" :password="password2">
					<i class="iconfont "
					 :class="[password2?'icon-yanjing1':'icon-yanjing2']"
					 @tap.stop="password2=!password2"></i>
				</view>
				<!-- <view class="input-view">
					<image src="../../static/imgs/register-icon-03.png" mode="widthFix" lazy-load></image>
					<input type="text" :placeholder="i18n.Fill_in_the_invitation_code" v-model="refer">
				</view> -->
			</view>
		</view>
		<view class="register-bottom-btn">
			<button type="default" :disabled="!upClass" :class="{'act':upClass}" @tap.stop="comfirm">立即注册</button>
		</view>
		<load v-if="showLoad"></load>
	</view>
</template>

<script>
	// import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue';
	import app from '../../App.vue'
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	import {mapGetters, mapMutations} from 'vuex'
	import Load from '../../components/common/load.vue';
	import {pageto, showToast, fetch} from '@/common/js/util.js'
	export default {
		components:{
			uniStatusBar,Load
		},
		data() {
			return {
				showLoad:false,
				upClass:false,
				username:'',
				password:'',
				repassword:'',
				refer:'',
				list:'',
				password1:true,
				password2:true
			};
		},
		watch:{
			username(val){
				this.change()
			},
			password(val){
				this.change()
			},
			repassword(val){
				this.change()
			}
		},
		onShow(){
			this.clear();
		},
		computed: {
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLang',
				'getIncode',
				'getLoginInfo'
			])
		},
		methods:{
			change(){
				if(this.username && this.password && this.repassword){
					this.upClass = true;
					return
				}
				this.upClass = false;
			},
			clear(){
				this.username = ''
				this.password = ''
				this.repassword = ''
				this.refer= ''
			},
			comfirm(){
				if(!this.username) {
					showToast(this.i18n.enter_phone)
					return
				}
				if (!this.password) {
					showToast(this.i18n.enter_login_pass)
					return
				}
				if (!this.repassword) {
					showToast(this.i18n.enter_input_pass_again)
					return
				}
				if (this.password != this.repassword) {
					showToast(this.i18n.login_pass_inconsistent)
					return
				}
				app.globalData.data= {
					email: this.username,
					password: this.password,
					password1: this.repassword,
					lang_type: this.getLang,
					username: this.username,
					zjc:''
				}
				fetch('/api/login/check_username',{username:this.username},'post').then(res=>{
					showToast(res.data.msg)
					if(res.data.code==1){
						uni.navigateTo({
							url:'/pages/new-login/Mnemonic-tips'
						})
					}
				}).then(err=>{
					
				})
				return
				
				this.showLoad = true;
				let _data = {
					email: this.username,
					password: this.password,
					password1: this.repassword,
					lang_type: this.getLang,
					username: this.username,
					zjc:this.list
				}
			
				fetch('/api/login/register', _data, "post")
					.then(res=>{
						this.showLoad = false;
						showToast(res.data.msg)
						if(res.data.code){
							this.getLogin(this.username,this.password)
							this.setLogin({
								username: this.username,
								password: this.password
							})
						}
					})
					.catch(err=>{
						this.showLoad = false;
						uni.navigateTo({
							// url:'/pages/new-login/new-register'
							url:'/pages/new-login/Mnemonic-tips'
						})
					})
				uni.navigateTo({
					url:'/pages/new-login/Mnemonic-tips'
				})
			},
			getLogin(name,pwd){
				let _data = {
					username: name,
					password: pwd,
					lang_type: this.getLang
				}
				fetch(this.getRequestUrl + '/api/login/login', _data, "post")
					.then(res => {
						this.showLoad = false
						if (res.statusCode == 200 && res.data.code == 1) {

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
			...mapMutations([
				'setLogin','setLoginInfo','setLoginTime'
			]),
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
.register-bottom-btn{
	width: 690upx;
	position: fixed;
	left: 30upx;
	bottom: 42upx;
	button{
		width: 690upx;
		height: 88upx;
		line-height: 88upx;
		background-color: #D1D1D1;
		color: #FFFFFF;
		&.act{
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
