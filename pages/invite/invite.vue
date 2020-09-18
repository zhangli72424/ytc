<template>
	<view class="invite-page">
		<image class="invite-page-bg" src="../../static/image/invite-bg.png" mode="widthFix" lazy-load></image>
		<view class="title">
			<!-- #ifdef APP-PLUS -->
			<uni-status-bar bgcolor="transparent"></uni-status-bar>
			<!-- #endif -->
			<view class="title-text">
				{{i18n.My_invitation}}
			</view>
		</view>
		<view class="content">
			<view class="invite-process">
				<view class="invite-process-item">
					<image src="../../static/image/invite-process-01.png" mode="widthFix" lazy-load></image>
					<text>{{i18n.Send_invitation_to_friends}}</text>
				</view>
				<view class="invite-process-icon">
					<i class="icon iconfont iconjiantouarrow484"></i>
				</view>
				<view class="invite-process-item">
					<image src="../../static/image/invite-process-02.png" mode="widthFix" lazy-load></image>
					<text>{{i18n.Friends_complete_registration}}</text>
				</view>
				<view class="invite-process-icon">
					<i class="icon iconfont iconjiantouarrow484"></i>
				</view>
				<view class="invite-process-item">
					<image src="../../static/image/invite-process-03.png" mode="widthFix" lazy-load></image>
					<text>{{i18n.Get_lucky_timestamp}}</text>
				</view>
			</view>
			<view class="invite-card">
				<view class="invite-card-title">{{i18n.Promotional_rewards}}</view>
				<view class="invite-card-content">
					<view class="items">
						<view>{{myzt}}</view>
						<text>{{i18n.Promotion_number}}</text>
					</view>
					<view class="items">
						<view>{{jl_time}}</view>
						<text>{{i18n.Rewarded_lucky_timestamp}}</text>
					</view>
				</view>
				<view class="invite-card-bottom">
					<text>{{i18n.invite_tip01}}   {{i18n.Timestamp}}{{tgs}}</text>
				</view>
			</view>
		</view>
		<view class="invite-container">
			<view class="invite-container-title">{{i18n.Promotion_details}}</view>
			<view class="invite-container-list-title">
				<text>{{i18n.nickname}}</text><text>{{i18n.grade}}</text><text>{{i18n.time}}</text>
			</view>
			<block v-for="(item,index) in list" :key="index">
				<view class="invite-container-list">
					<view>{{item.username}}</view>
					<view>{{item.name=='V'?'V0':item.name}}</view>
					<view>{{item.freeze}}</view>
				</view>
			</block>
		</view>
		
		<view class="incite-bottom-btn">
			<button type="default" hover-class="active" @tap.stop="invite">{{i18n.Invite_now}}</button>
		</view>
		<load v-if="laoding"></load>

	</view>
</template>

<script>
	var timer;
	import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters, mapMutations} from 'vuex';
	import Load from '@/components/common/load.vue';
	export default {
		components:{
			uniStatusBar,Load
		},
		data() {
			return {
				laoding:false,
				page:1,
				list:[],
				tgs:'',
				jl_time:'',
				myzt:''
			}
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters(['getLoginInfo','getLangType'])
		},
		onPullDownRefresh() {
			this.page =1;
			this.list =[]
			this.getPower();
		},
		onReachBottom() {
			let _self = this
		    if (timer != null) {
		        clearTimeout(timer);
		    }
		    timer = setTimeout(function() {
				_self.getMoreList();
				uni.stopPullDownRefresh()
		    }, 1000);
		},
		onShow() {
			forceUpdate(this.getLangType);
			this.list=[];
			this.page=1;
			this.getPower();
		},
		methods:{ 
			invite(){
				uni.navigateTo({
					url:'/pages/invite/advertising'
				})
			},
			getPower(){
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					page:this.page,
					rows:10
				}
				this.laoding = true;
				fetch('/api/user/myZt',data,'POST')
					.then(res=>{
						this.laoding = false;
						this.tgs = res.data.data.tgs;
						this.jl_time = res.data.data.jl_time;
						this.myzt = res.data.data.myzt;
						if(res.data.data.myzt_list.data.length==0) return;
						if(res.data.code){
							this.page++;
							this.list = res.data.data.myzt_list.data
							
						}
					})
					.catch(err=>{
						this.laoding = false;
					})
			},
			getMoreList(){
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					page:this.page,
					rows:10
				}
				this.laoding = true;
				fetch('/api/user/myZt',data,'POST')
					.then(res=>{
						this.laoding = false;
						this.tgs = res.data.data.tgs;
						this.jl_time = res.data.data.jl_time;
						this.myzt = res.data.data.myzt;
						if(res.data.data.myzt_list.data.length==0) return;
						if(res.data.code){
							this.page++;
							this.list = this.list.concat(res.data.data.myzt_list.data)
						}
					})
					.catch(err=>{
						this.laoding = false;
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.invite-page{
		position: relative;
		.incite-bottom-btn{
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 100upx;
			button{
				width: 100%;
				height: 100upx;
				line-height: 100upx;
				border-radius: 0;
				background: linear-gradient(to right, #765fdf, #5d37e5);
				text-align: center;
				color: $white;
				&.active{
					background: #8884B7;
					color: #0F0C39;
				}
			}
		}
		.invite-page-bg{
			width: 750upx;
			height: 293upx;
			flex-shrink: 0;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
		}
		.title{
			// background: linear-gradient(to bottom, #6b4ffe, #5631fd);
			color: $white;
			.title-text{
				line-height: 78upx;
				text-align: center;
			}
		}
		.content{
			padding: 80upx 30upx 0;
			.invite-process{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 52upx 40upx;
				background-color: #1D184F;
				border-radius: 20upx;
				.invite-process-item{
					text-align: center;
					image{
						width: 65upx;
						height: 65upx;
					}
					text{
						display: block;
						word-wrap: break-word;
						font-size: 23upx;
					}
				}
				.invite-process-icon{
					margin: 0 54upx; 
					i{
						font-size: 60upx;
						color: #8c89ad;
					}
				}
			}
			.invite-card{
				background-color: #1e1750;
				border-radius: 20upx;
				margin-top: 40upx;
				.invite-card-title{
					line-height: 80upx;
					padding-left: 30upx;
					color: $white;
					font-size: 30upx;
					border-bottom: 1upx solid #2B2860;
				}
				.invite-card-content{
					display: flex;
					align-items: center;					.items{
						flex: 1;
						padding: 30upx 0 50upx 35upx; 
						view{
							font-size: 48upx;
							color: $white;
						}
						text{
							color: #4A4B79;
							font-size: 24upx;
						}
					}
				}
			}
			
			.invite-card-bottom{
				padding:0 0 56upx 35upx;
				text{
					display: block;
					font-size: 26upx;
					color: $white;
				}
				view{
					color: $white;
					font-size: 26upx;
					margin-top: 30upx;
				}
			}
			
		}
		.invite-container{
			padding-bottom: 100upx;
			.invite-container-title{
				padding: 40upx 30upx;
				line-height: 90upx;
			}
			.invite-container-list-title{
				background-color: #1c1850;
				color: #4A4B79;
				font-size: 26upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1upx solid #2B2860;
				text{
					flex: 1;
					text-align: center;
					display: block;
					line-height: 84upx;
				}
			}
			.invite-container-list{
				background-color: #1c1850;
				color: #4A4B79;
				font-size: 26upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1upx solid #2B2860;
				&:last-of-type{
					border-bottom: none;
				}
				view{
					flex: 1;
					text-align: center;
					display: block;
					line-height: 110upx;
					color: $white;
				}
			}
		}
	}
</style>
