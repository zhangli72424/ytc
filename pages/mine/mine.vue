<template>
	<view>
	<view class="min-top-img">
			<image src="../../static/imgs/mine-bg.png" mode="widthFix" lazy-load></image>
		</view>
		
		<view class="mine-top">
			<view class="mine-info">
				<image :src="'../../static/imgs/head.png'" mode="widthFix" lazy-load></image>
				<text class="jihuo" v-if="uuid" style="background-color: #AEAEAE;">{{i18n.not_active}}</text>
				<text class="jihuo" v-else>{{i18n.Activated}}</text>
				<view class="mine-info-c">
					<text class="name">{{info.nickname?info.nickname:info.username}}</text>
					<view class="Invitation">
						<view class="id">{{i18n.Invitation_code}} : {{info.user_sn || ''}} </view>
						<view class="copy"  @click="copy" >
							<u-button type="primary" size="mini"class="btn"  @click="copy">{{i18n.copy}}</u-button>
						</view>
					</view>
					<view class="info-grade">
						<view>{{i18n.user_level}}:{{info.lv +''|| ''}}</view>
						<view v-if="info.lv_m_name">{{i18n.membership_level}}:{{info.lv_m_name || ''}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="mine-nav">
			<view class="mine-nav-item">
				<view>0 VFI</view>
				<text>昨日快照</text>
			</view>
			<view class="mine-nav-item">
				<view>0 VFI</view>
				<text>存币挖矿</text>
			</view>
		</view>
		
		
		
		
	<!-- 	<view class="mine-nav-list">
			<view class="mine-nav-list-item" @tap.stop="chat">
				<image src="../../static/imgs/mine-nav0.png" mode="widthFix" lazy-load></image>
				<view>{{i18n.announcement}}</view>
			</view>
			<view class="mine-nav-list-item" @tap.stop="to('history-list')">
				<image src="../../static/imgs/mine-nav1.png" mode="widthFix" lazy-load></image>
				<view>{{i18n.Bill}}</view>
			</view>
			<view class="mine-nav-list-item" @tap.stop="to('team')">
				<image src="../../static/imgs/mine-nav2.png" mode="widthFix" lazy-load></image>
				<view>{{i18n.team}}</view>
			</view>
		</view> -->
		
		<view class="list-content">
			<view class="list-item" hover-class="active"  @tap.stop="advertising">
				<image src="../../static/imgs/mine-nav0.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">{{i18n.Activate_ecology}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active"  @tap.stop="to('team')">
				<image src="../../static/imgs/mine-nav1.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">我的团队</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
		<!-- 	<view class="list-item" hover-class="active"  @tap.stop="to('team')">
				<image src="../../static/imgs/partner.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">团队</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view> -->
			<view class="list-item" hover-class="active"  @tap.stop="to('history-list')">
				<image src="../../static/imgs/mine-nav2.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">{{i18n.Revenue_records}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active"  @tap.stop="to('manage')">
				<image src="../../static/imgs/mine-nav3.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">账户管理</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active"  @tap.stop="to('down')">
				<image src="../../static/imgs/mine-nav4.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">{{i18n.Share_App}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active">
				<image src="../../static/imgs/mine-nav5.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">{{i18n.edition}}</view>
				<view class="list-item-text-r">
					<!-- <i class="icon iconfont iconxiangyou1"></i> -->
					{{version || '1.0.0'}}
				</view>
			</view>
			<view class="list-item" hover-class="active" @tap.stop="to('setting')">
				<image src="../../static/imgs/set-up.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">{{i18n.System_settings}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active" v-if="info.zzlv==5"  @tap.stop="selectInfo">
				<image src="../../static/imgs/partner.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">{{i18n.Becoming}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			
			
			
			
			
			<!-- 
			<view class="list-item" hover-class="active"  @tap.stop="to('selectLang')">
				<view class="list-item-text">{{i18n.Language_switch}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active"  @tap.stop="to('invite')">
				<view class="list-item-text">{{i18n.invite_friends}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			
			<view class="list-item" hover-class="active" @tap.stop="to('xieyi')">
				<view class="list-item-text">{{i18n.protocol}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>-->
		

		<u-modal class="show" v-model="show" @confirm="input" :title="i18n.Activate_account">
			<view class="slot-content">
				<view class="ipt">
					<input type="text" v-model='value' :placeholder="i18n.Please_activation_code"/>
				</view>
			</view>
		</u-modal>
		
		<u-modal v-model="showpopule" :title="i18n.Upgrade_requirements" @confirm="par" >
			<view class="slot-content">
				<view>USDT</view>
				<view>{{i18n.quantity}} ：{{info.zzbalance}}</view>
			</view>
		</u-modal>
		
	
		</view>
		<SwitchLang :isSHow="isSHow" @cancel="cancel"></SwitchLang>
	</view>
</template>

<script>
	import {pageto, showToast, fetch, updownLine, forceUpdate, _updataTabBar} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	import SwitchLang from '@/components/switchlang/switchLang.vue'
	export default {
		components:{
			SwitchLang
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters(['getLoginInfo','getTextArr','getLangType'])
		},
		data() {
			return {
				isSHow:false,
				tabInfo:{},
				info:{},
				imgCode:'',
				version:'',
				show:false,
				Activation:'',
				uuid:false,
				showpopule:false,
				num:1,
				value:'',
				status:'',
			};
		},
		onLoad(){
			this.getMine();
		},
		onShow() {
			this.status=''
			this.Activation=this.getLoginInfo.yqcode;
			forceUpdate(this.getLangType);
			_updataTabBar(this.getTextArr,this.getLangType);
			// this.getLvCk();
			this._getVersion();
			this.getInfo();
		},
		methods:{
			...mapMutations(['setInTeam']),
			input(){
				fetch('/api/ytc/useractivation',{code:this.value},'post').then(res=>{
					this.value=''
					showToast(res.data.msg)
				})
			},
			par(){
				fetch('/api/ytc/userpartner',{},'post').then(res=>{
					showToast(res.data.msg)
				})
			},
			selectInfo(){
				this.showpopule=true;
			},
			copy(){
				if(this.Activation){
					uni.setClipboardData({
						data: this.info.user_sn,
						success: function () {
							wx.showToast({
								title: '已复制到剪贴板'
							});
						}
					});
				}else{
					wx.showToast({
						title: '复制失败',
						icon:"none"
					});
				}
			},
			mining(){
				uni.navigateTo({
					url:'/pages/miner/mining'
				})
			},
			bill(){
				console.log(121)
				uni.navigateTo({
					url:'pages/bill/bili'
				})
			},
			// status(){
			// 	fetch('/api/ytc/useractivation',{code:100218},"post").then(res=>{
			// 		console.log(res,"resresresresres")
			// 		if(res.data.code==1){
						
			// 		}
			// 	})
			// },
			cancel(){
				this.show=false;
			},
			_getVersion() {
				// #ifdef APP-PLUS
				this.version = plus.runtime.version
				// #endif
			},
			cancel() {
				this.isSHow = false
			},
			chat(){
				uni.navigateTo({
					url:'/pages/new/notice'
				})
			},
			// jumpCneter(){
			// 	uni.navigateTo({
			// 		url:'/pages/info/info?imgCode='+this.imgCode
			// 	})
			// },
			getInfo(){
				fetch('/api/ytc/user',{},"post").then(res=>{
					this.status=res.data.data.status;
					if(res.data.code==1){
						this.info=res.data.data
						if(this.info.uuid==0){
							this.uuid=true
						}else{
							this.uuid=false
						}
					}
				}).catch(err=>{
					
				})
			},
			to(val){
				switch (val){
					case 'manage':
						pageto('/pages/mine/select-username')
						break;
					case 'authentication':
					showToast(`${this.i18n.in_development}...`)
					return
						pageto('/pages/authentication/index')
						break;
					case 'member':
						pageto('/pages/member/member')
						break;
					case 'setting':
						pageto('/pages/setting/setting')
						break;
					case 'spoc':
						// pageto('/pages/developing/developing')
						pageto('/pages/hash-card/hash-card')
						break;
					case 'team':
						this.setInTeam(true)
						pageto('/pages/team/team');
						break;
					case 'time':
						pageto('/pages/mine/timestamp');
						break;
					case 'invite': 
						// if(this.info.lv=='0'){
						// 	this.showpopule = true;
						// 	return
						// }
						pageto('/pages/invite/advertising');
						break;
					case "xieyi":
						pageto('/pages/setting/protocol');
						break;
					case 'down':
						pageto(`/pages/down/down`);
						break;
					case 'history-list':
						if(this.tabInfo){
							pageto(`/pages/bill/bili?tab=${JSON.stringify(this.tabInfo)}&status=${this.status}`);
						}
						break;
					case 'contribution':
						pageto('/pages/team/team');
						break;
					case 'power':
					pageto('/pages/application/miner');
						break;
					case 'selectLang':
						this.isSHow = true;
						break;
					default:
						break;
				}
			},
			advertising(){
				this.show=true;
			},
			getLvCk(){
				fetch('/api/index/lv_ck', '', "post").then(res=>{
					
				})
				.catch(err=>{
					
				})
			},
			getMine(){
				this.showLoad = true;
				fetch('/api/index/index', '', "post").then(res=>{
					this.showLoad = false;
					if(res.data.code){
						// console.log(res);
						this.info = res.data.data;
						let avatar = res.data.data.avatar
						this.tabInfo = res.data.data.zd_type;
						if(!avatar){
							this.imgCode = ''
						}else{
							this.imgCode = avatar+''
						}
					}
				}).catch(err=>{
					this.showLoad = false;
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.mine-nav{
		margin: 0 30rpx;
		background: $white;
		display: flex;
		align-items: center;
		border-radius: 10rpx;
		.mine-nav-item{
			padding: 54rpx 0 56rpx;
			flex: 1;
			text-align: center;
			view{
				font-size: 46rpx;
				color: #FEB626;
				font-weight: bold;
			}
			text{
				color: #AEAEAE;
				font-size: 24rpx;
			}
		}
	}
	.u-size-mini {
		height: 35rpx;
	}
	.slot-content {
		font-size: 28rpx;
		color: $u-content-color;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40rpx 60rpx;
		.ipt{
			background-color: #F6F6F6;
			padding: 10rpx 20rpx;
			border-radius: 5rpx;
		}
		
	}
	.min-top-img{
		position: absolute;
		left: 0;
		top: 0;
		width: 750upx;
		height: 307upx;
		// background: #021A5C;
		z-index: -1;
		image{
			width: 750upx;
			height: 409upx;
			flex-shrink: 0;
		}
		
	}
	.mine-top{
		padding-top: 90upx;
		position: relative;
		.chat-icon{
			position: absolute;
			top: 80upx;
			right: 30upx;
			color: $white;
			i{
				font-size: 48upx;
			}
		}
		.mine-info{
			padding:0 30upx 46upx;
			text-align: center;
			display: flex;
			align-items: center;
			image{
				width: 124upx;
				height: 124upx;
				border-radius: 62upx;
				border: 2upx solid $white;
				margin-right: 26upx;
			}
			.jihuo{
				background-color: #FFC64C;
				border-radius: 10rpx;
				width: 88rpx;
				height: 24rpx;
				position: absolute;
				bottom: 17%;
				left: 7%;
				font-size: 18rpx;
				line-height: 26rpx;
			}
			.mine-info-c{
				display: block;
				flex: 1;
				text-align: left;
				.name{
					font-size: 40upx;
					color: $white;
					font-weight: bold;
				}
				.Invitation{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.id{
						color: $white;
						font-size: 26upx;
						margin: 16upx 0;
					}
					.copy{
						width: auto;
						height: auto;
						padding: 20rpx;
					}
				}
				.info-grade{
					display: flex;
					align-items: center;
					view{
						padding: 0 18upx;
						line-height: 36upx;
						background-color: $theme-color;
						font-size: 22upx;
						color: $white;
						border-radius: 28upx;
						margin-right: 10upx;
					}
				}
			}
		}
	}
	.mine-nav-list{
		margin: 0 30upx;
		background: $page-bg-color5;
		border-radius: 20upx;
		display: flex;
		align-items: center;
		.mine-nav-list-item{
			padding: 64upx 0 40upx;
			flex: 1;
			text-align: center;
			image{
				width: 100upx;
				height: 100upx;
				flex-shrink: 0;
			}
			view{
				font-size: 28rpx;
				color: $white;
			}
		}
	}
	.list-content{
		margin: 60rpx 0;
		background: $white;
		// border-radius: 20rpx;
		overflow: hidden;
		.list-item{
			display: flex;
			padding: 0 35rpx;
			justify-content: space-between;
			align-items: center;
			position: relative;
			image{
				width: 50rpx;
				height: 50rpx;
				flex-shrink: 0;
				margin-right: 10rpx;
			}
			// border-bottom: 1upx solid $split-line-color1;
			&.active{
				background: #bebebe;
				.list-item-text{
					color: #0F0C39;
					border-bottom: none;
				}
			}
			.list-item-text{
				flex: 1;
				font-size: 30upx;
				color: $black;
				line-height: 60upx;
				padding: 25upx 0;
			}
			.list-item-text-r{
				display: flex;
				align-items: center;
				font-size: 26rpx;
				color: $text-gray-color1;
			}
		}
	}
</style>
	