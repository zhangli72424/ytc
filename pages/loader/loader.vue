<template>
	<view>
		<view class="leader-board">
			<u-navbar :is-back="true" 
			backIconColor="#ffffff"
			:background="background"  />
			<image src="../../static/imgs/leader-top.png" mode="widthFix" lazy-load class="leader-top-img"></image>
			
			<view class="nav-list">
				<view :class="{'active':navindex==0}" @tap.stop="selectNav(0)">{{i18n.Team_performance}}(U)</view>
				<view :class="{'active':navindex==1}" @tap.stop="selectNav(1)">{{i18n.Direct_performance}}(U)</view>
				<view :class="{'active':navindex==2}" @tap.stop="selectNav(2)">{{i18n.Personally_held}}(T)</view>
			</view>
			
			<view class="leader-board-title">
				<text>{{i18n.Rank}}</text>
				<text>{{i18n.user}}ID</text>
				<text>{{i18n.quantity}}</text>
			</view>
			<block v-for="(item,index) in leaderList" :key="index">
				<view class="leader-board-item" :class="{'nex-bg':(index%2!=0)}">
					<image :class="[index>2?(index==9?'pri':'nex'):'']" :src="'../../static/imgs/leader0'+(index+1)+'.png'" mode="widthFix" lazy-load></image>
					<text>{{item.username}}</text>
					<text>{{navindex==1?(item.z_ztyeji?(item.z_ztyeji):0):navindex==2?(item.z_ths?(item.z_ths):0):(item.z_yeji?(item.z_yeji):0)}}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {pageto, showToast, fetch, updownLine, forceUpdate, diff_txt, _updataTabBar} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	export default {
		data() {
			return {
				background:'transparent',
				navindex:0,
				type:1, //	1团队业绩2直推业绩3个人持有
				leaderList:[]
			};
		},
		computed:{
			formatParsefloat(val){
				if ((!val && val != 0) || val == null || val == undefined || val == 'undefined') {
					return 0
				}
				return parseFloat(val)
			},
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLangType',
				'getLogin',
				'getLoginInfo',
				'getTextArr'
			])
		},
		onShow(){
			this.getLeader()
		},
		methods:{
			selectNav(index){
				this.navindex=index;
				this.type=index+1
				this.getLeader();
			},
			getLeader(){
				// POST api/user/user_phb
				fetch('/api/user/user_phb',{type:this.type},'post')
					.then(res=>{
						if(res.statusCode == 200 && res.data.code == 1){
							this.leaderList=res.data.data
						}else{
							
						}
					})
			}
		}
	}
</script>

<style lang="scss">
	.leader-top-img{
		width: 750rpx;
		height: 736rpx;
		flex-shrink: 0;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		z-index: -1;
	}
	.nav-list{
		display: flex;
		align-items: center;
		margin-top: 405upx;
		view{
			color: $text-gray-color1;
			padding: 0 0 50upx;
			font-size: 27rpx;
			flex: 1;
			text-align: center;
			&.active{
				color: $white;
				position: relative;
				&::after{
					content: '';
					background: #02E26F;
					width: 60rpx;
					height: 4rpx;
					border-radius: 2rpx;
					position: absolute;
					left: 50%;
					top: 44rpx;
					transform: translateX(-50%);
				}
			}
		}
	}
	.leader-board{
		.leader-board-bi{
			padding: 55upx 0 50upx;
			text-align: center;
			image{
				width: 550upx;
				height: 34upx;
			}
		}
		.leader-board-title{
			display: flex;
			padding: 0 64upx;
			justify-content: space-between;
			align-items: center;
			background: $page-bg-color5;
			border-top-left-radius: 20upx;
			border-top-right-radius: 20upx;
			text{
				line-height: 110upx;
				display: block;
				color: #516986;
			}
		}
		.leader-board-item{
			display: flex;
			padding: 0 64upx;
			justify-content: space-between;
			align-items: center;
			background: #061f48;
			&.nex-bg{
				background: $page-bg-color5;
			}
			image{
				width: 55upx;
				height: 45upx;
				flex-shrink: 0;
				&.nex{
					width: 20upx;
					height: 29upx;
				}
				&.pri{
					width: 40upx;
					height: 29upx;
				}
			}
			text{
				font-size: 34upx;
				color: $white;
				display: block;
				line-height: 110upx;
			}
		}
	}
</style>
