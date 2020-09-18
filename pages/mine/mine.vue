<template>
	<view>
	<view class="min-top-img">
			<!-- <image src="../../static/imgs/mine-bg.png" mode="widthFix" lazy-load></image> -->
		</view>
		
		<view class="mine-top">
			<view class="mine-info">
				<image :src="'../../static/imgs/avatar'+imgCode+'.png'" mode="widthFix" lazy-load @tap.stop="jumpCneter"></image>
				<view class="mine-info-c">
					<text class="name">{{info.nickname?info.nickname:info.username}}</text>
					<view class="id">UID : {{info.id}}</view>
					<view class="info-grade">
						<view>{{i18n.user_level}}:{{info.name}}</view>
						<view v-if="info.lv_m_name">{{i18n.membership_level}}:{{info.lv_m_name}}</view>
					</view>
				</view>
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
			<view class="list-item" hover-class="active"  @tap.stop="">
				<image src="../../static/imgs/mine-nav0.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">激活生态</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active"  @tap.stop="">
				<image src="../../static/imgs/mine-nav1.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">我的抢单</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active"  @tap.stop="">
				<image src="../../static/imgs/mine-nav2.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">收益记录</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active"  @tap.stop="to('down')">
				<image src="../../static/imgs/mine-nav3.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">分享APP</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			
			<view class="list-item" hover-class="active"  @tap.stop="to('selectLang')">
				<image src="../../static/imgs/mine-nav4.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">语言设定</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active">
				<image src="../../static/imgs/mine-nav5.png" mode="widthFix" lazy-load></image>
				<view class="list-item-text">版本</view>
				<view class="list-item-text-r">
					<!-- <i class="icon iconfont iconxiangyou1"></i> -->
					{{version || '1.0.0'}}
				</view>
			</view>
			<view class="list-item" hover-class="active" @tap.stop="to('setting')">
				<view class="list-item-text">{{i18n.System_settings}}</view>
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
			</view>
			
			
			<view class="list-item" hover-class="active" @tap.stop="to('down')">
				<view class="list-item-text">{{i18n.download_link}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active" @tap.stop="to('authentication')">
				<view class="list-item-text">{{i18n.Contact_Customer_Service}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view>
			<view class="list-item" hover-class="active" @tap.stop="to('setting')">
				<view class="list-item-text">{{i18n.System_settings}}</view>
				<view class="list-item-text-r">
					<i class="icon iconfont iconxiangyou1"></i>
				</view>
			</view> -->
		
		
		
		
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
				version:''
			};
		},
		onShow() {
			console.log(this.getLoginInfo);
			forceUpdate(this.getLangType);
			_updataTabBar(this.getTextArr,this.getLangType);
			this.getMine();
			// this.getLvCk();
			this._getVersion();
		},
		methods:{
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
			jumpCneter(){
				uni.navigateTo({
					url:'/pages/info/info?imgCode='+this.imgCode
				})
			},
			to(val){
				switch (val){
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
							pageto(`/pages/bill/bili?tab=${JSON.stringify(this.tabInfo)}`);
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
	.min-top-img{
		position: absolute;
		left: 0;
		top: 0;
		width: 750upx;
		height: 307upx;
		background: #021A5C;
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
			.mine-info-c{
				display: block;
				.name{
					font-size: 40upx;
					color: $white;
					font-weight: bold;
				}
				.id{
					color: $white;
					font-size: 26upx;
					margin: 16upx 0;
				}
				.info-grade{
					display: flex;
					align-items: center;
					justify-content: center;
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
	