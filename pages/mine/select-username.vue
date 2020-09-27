<template>
	<view>
		<u-navbar title="切换账户" 
		:background="background">
		<view slot="right" class="right-nav-color" hover-class="active" @tap.stop="toAdd">
			编辑
		</view></u-navbar>
		<view class="user-list">
			<block v-for="(item,index) in list" :key="index">
				<view class="user-list-item" hover-class="active" @tap.stop="Switch_account(item,index)">
					
					<view class="list-l">
						<view class="list-l-radio  animated fast fadeIn" v-if="showDetele && index!=indexs">
							<i class="icon iconfont" :class="[item.choose?'iconxianshi_xuanzetianchong':'iconxuanze']"></i>
						</view>
						<image src="../../static/imgs/avatar.png" mode="widthFix" lazy-load></image>
						<text>{{item.username}}</text>
					</view>
					<i class="icon iconfont icon-gouxuan" v-if="item.istrue && !showDetele"></i>
				</view>
			</block>
		</view>
		<view class="change-list change-list-other" hover-class="active"  @tap.stop="modify_pwd" v-if="!showDetele">
			<view class="list-l">
				<text>{{i18n.modify_pwd}}</text>
			</view>
			<i class="icon iconfont iconxiangyou1"></i>
			
		</view>
	<!-- 	<view class="change-list" hover-class="active"  @tap.stop="exit" v-if="!showDetele">
			<view class="list-l">
				<text>切换账户</text>
			</view>
			<i class="icon iconfont iconxiangyou1"></i>
			
		</view> -->
		<load v-if="showLoad"/>
		<view class="footer-btn animated fast fadeIn" v-if="showDetele">
			<button type="default" @tap.stop="showDetele=!showDetele">{{i18n.cancel}}</button>
			<button type="default" @tap.stop="deleteItem">删除</button>
		</view>
	</view>
</template>

<script>
	import marketList from '@/components/common/market-list.vue';
	import Load from '@/components/common/load.vue';
	import {pageto, showToast, fetch, updownLine, forceUpdate, diff_txt, _updataTabBar} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	export default {
		components:{Load},
		data() {
			return {
				showDetele:false,
				background:'#ffffff',
				list:[],
				showLoad:false,
				isCheck:false,
				indexs:0
			}
		},
		onShow(){
			this.indexs = 0
			this.showDetele = false;
			this.isCheck = false;
			this.showLoad=false;
			console.log(this.getLogin);
			console.log(this.getLoginInfo);
			this.list = this.getUserList
			this.list.forEach((item,index)=>{
				this.list[index].choose = false;
				if(item.username==this.getLoginInfo.username){
					this.indexs = index;
					this.list[index].istrue = true;
				}else{
					this.list[index].istrue = false;
				}
			})
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLangType',
				'getLogin',
				'getLoginInfo',
				'getUserList',
				'getLang'
			])
		},
		methods:{
			modify_pwd(){
				uni.navigateTo({
					url:`/pages/modify-pwd/verification-mnemonic?phone=${this.getLoginInfo.username}`
				})
			},
			deleteItem(){
				let lsit  = this.list.filter(item=>item.choose==false)
				this.setUserList(lsit)
				showToast('删除成功')
				setTimeout(()=>{
					this.indexs = 0
					this.showDetele = false;
					this.isCheck = false;
					this.showLoad=false;
					this.list = this.getUserList
					this.list.forEach((item,index)=>{
						this.list[index].choose = false;
						if(item.username==this.getLoginInfo.username){
							this.indexs = index;
							this.list[index].istrue = true;
						}else{
							this.list[index].istrue = false;
						}
					})
				},500)
			},
			...mapMutations(['setUserList','setLoginInfo','setLogin']),
			toAdd(){
				this.showDetele = !this.showDetele;
			},
			exit() {
				this.setLoginInfo('');
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			Switch_account(item,index){
				if(this.showDetele==true){
					console.log(this.list[index].choose);
					this.list[index].choose = !this.list[index].choose;
					this.$set(this.list, index, this.list[index])
					return
				}
				if(item.istrue==true)return;
				this.setLoginInfo('');
				this.setLogin('');
				this.showLoad = true
				let _data = {
					username: item.username,
					zjc: item.zjc,
					lang_type: this.getLang
				}
				if(this.isCheck) return
				this.isCheck  = true;
				fetch('/api/login/login', _data, "post")
					.then(res => {
						this.isCheck  = false;
						this.showLoad = false
						if (res.statusCode == 200 && res.data.code == 1) {
							let  {id,username,zjc,paypwd,status,user_sn,token,ip} = res.data.data
							let loginfo = {id,username,zjc,paypwd,status,user_sn,token,ip}

							this.setLoginInfo(loginfo)
							this.setLogin({
								username: this.phone,
								password: this.pass
							})
							uni.reLaunch({
								url:"/pages/first/first"
							})
							// uni.switchTab({
							// 	url:'/pages/index/index'
							// })
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
		}
	}
</script>

<style scoped lang="scss">
	.footer-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		line-height: 100rpx;
		padding: 10rpx 0;
		background: $white;
		box-shadow: 0 0 20rpx rgba(0,0,0,.1);
		button{
			line-height: 80rpx;
			height: 80rpx;
			text-align: center;
			width: 200rpx;
			border-radius:10rpx;
			background: #FF5050;
			color: $default-color;
			&:first-of-type{
				background: #5a5a5a;
				margin-right: 40rpx;
			}
		}
		
	}
	.right-nav-color{
		padding: 0 30upx 0 0;
		color: $black;
	}
	.user-list{
		margin-top: 20rpx;
		color: $black;
		.user-list-item{
			border-bottom: 1rpx solid $split-line-color2;
			&.active{
				background: #f2f2f6;
			}
			&:last-of-type{
				border-bottom: none;
			}
			background: $white;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 30rpx;
			.list-l{
				display: flex;
				align-items: center;
				.list-l-radio{
					.icon{
						font-size: 40rpx;
						margin-right: 15rpx;
					}
				}
				image{
					width: 50rpx;
					height: 50rpx;
					border-radius: 25rpx;
					margin-right: 15rpx;
				}
			}
		}
	}
	.change-list{
		&.change-list-other{
			margin-bottom: 0;
		}
		&.active{
			background: #f2f2f6;
		}
		color: $black;
		margin-top: 50rpx;
		background: $white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		margin-bottom: 110rpx;
		.list-l{
			display: flex;
			align-items: center;
			text{
				line-height: 50rpx;
			}
			image{
				width: 50rpx;
				height: 50rpx;
				border-radius: 25rpx;
				margin-right: 15rpx;
			}
		}
	}
</style>
