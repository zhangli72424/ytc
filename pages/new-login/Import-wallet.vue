<template>
	<view class="content">
		<view class="define-title">
			<view>{{i18n.Import_wallet}}</view>
			<text>{{i18n.import_wall_tip0}}</text>
		</view>
		<view class="define-content">
		<textarea value="" maxlength="-1" v-model="Mnemonic"  :placeholder="i18n.P_enter_a_mnemonic_0" />
		</view>
		<view class="define-title">
			<view>{{i18n.set_password}}</view>
		</view>
<!-- 		<view class="tips-con">
			<view class="tips-con-i">
				助記詞由英文單詞組成，請抄寫並妥善保管
			</view>
			<view class="tips-con-i">
				助記詞如丟失，無法找回，請務必備份助記詞
			</view>
		</view> -->
		<view class="register-content-view">
			<view class="input-view">
				<!-- <image src="../../static/imgs/register-icon-01.png" mode="widthFix" lazy-load></image> -->
				<input type="text" :placeholder="i18n.enter_username" v-model="username">
			</view>
			<view class="input-view">
				<!-- <image src="../../static/imgs/register-icon-01.png" mode="widthFix" lazy-load></image> -->
				<input type="text" :placeholder="i18n.Please_set_a_wallet_password" v-model="pass">
			</view>
			<view class="input-view">
				<!-- <image src="../../static/imgs/register-icon-02.png" mode="widthFix" lazy-load></image> -->
				<input type="text" :placeholder="i18n.Please_confirm_the_wallet_password" v-model="repass">
			</view>
		</view>
		
		<view class="tips-bottom-button">
			<button hover-class="active" @tap.stop="comfirm">{{i18n.Import_wallet}}</button>
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
				showLoad:false,
				username:'',
				Mnemonic:'',
				pass:'',
				repass:''
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

		},
		methods:{
			...mapMutations([
				'setLoginInfo',
				'setLogin',
				'setLoginTime',
				'setLangType'
			]),
			comfirm(){
				let _this = this
				// indoor,flower,dad,edge,fox,they,cement,come,unable,elbow,minimum,card
				if(_this.username==null || _this.username==''){
					showToast(this.i18n.enter_username)
					return
				}
				if(_this.Mnemonic=="" || _this.Mnemonic==null){
					showToast(this.i18n.P_enter_a_mnemonic)
					return 
				}
				if(_this.pass=="" || _this.pass==null){
					showToast(this.i18n.p_enter_word)
					return 
				}
				if(_this.repass=="" || _this.repass==null){
					showToast(this.i18n.p_enter_reword)
					return 
				}
				if(_this.pass != _this.repass){
					showToast(this.i18n.Two_passwords_are_inconsistent)
					return 
				}
				let op = {
					username:_this.username,
					mnemonic:_this.Mnemonic,
					new_pass:_this.pass,
					new_pass1:_this.repass,
					lang_type:_this.getLang
				}
				fetch('/api/Login/upPwd',op,'post')
					.then(res=>{
						if(res.statusCode == 200 && res.data.code == 1){
							showToast('修改成功')
							uni.showModal({
								title:'提示',
								content:'是否立即登錄',
								success:function(res){
									if(res.confirm){
										let _data = {
											username: _this.username,
											password: _this.pass,
											lang_type: _this.getLang
										}
										
										fetch( '/api/login/login', _data, "post")
											.then(res=>{
												_this.showLoad = false
												if (res.statusCode == 200 && res.data.code == 1) {
													console.log(res)
													let {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode} = res.data.data
													let loginfo = {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode}
													let time = res.data.time;
													loginfo.userpaypwd = _this.password
													console.log(loginfo);
													_this.setLoginInfo(loginfo)
													_this.setLogin({
														username: _this.phone,
														password: _this.pass
													})
													
													_this.setLoginTime(time);
													pageto('/pages/index/index', true)
												}else if(res.statusCode == 200 && res.data.code == 3) {
													// showToast(res.data.msg)
													let {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode} = res.data.data
													let loginfo = {email, id, incode, password, paypwd, salt, status, token, username, gespwd, yqcode}
													let time = res.data.time;
													_this.setLoginInfo(loginfo)
													_this.setLogin({
														username: _this.phone,
														password: _this.pass
													})		
													_this.setLoginTime(time);
													uni.navigateTo({
														url:'/pages/new-login/Mnemonic-tips'
													})
												}else {
													showToast(res.data.msg)
												}
											})
											.catch(err => {
												_this.showLoad = false
												console.log(err)
											})
										
									}else{
										setTimeout(()=>{
											uni.navigateBack({
												delta:1
											})
										},500)
									}
								}
							})
						}else{
							showToast(res.data.msg)
						}
					})
					.catch(err=>{
						
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 0 30upx;
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
			}
		}
		.define-content{
			margin-top: 26upx;
			border: 1upx solid #DFE5FB; 
			background: #FFFFFF;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-radius: 10upx;
			textarea{
				width: 100%;
				padding: 20upx;
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
