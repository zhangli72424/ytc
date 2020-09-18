<template>
	<view class="list">
		<view class="list-title">
			<!-- <text>置顶</text> -->
			{{item.title}}
		</view>
		<view class="list-content">
			{{item.name}}
		</view>
		<view class="list-bottom">
			<view class="list-bottom-l">
				<view class="list-bottom-left">
					<text>{{item.price}} ZXB/条</text>
				</view>
				<view class="list-bottom-l-r">
					<view class="list-bottom-i">{{item.yz}}人参与</view>
					<view class="list-bottom-i">剩余{{item.sy}}</view>
				</view>
			</view>
			<view class="list-bottom-b">
				<button type="default" @tap.stop="getDetail(index)">领取任务</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'listItem',
		props:{
			item:{
				type: Object,
				default: ''
			},
			index:{
				type: Number,
				default: ''
			}
		},
		methods:{
			getDetail(index){
				this.$emit('get-detail',index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.list{
		margin: 20upx 32upx 0;
		background: $page-bg-color5;
		border-radius: 20upx;
		padding: 34upx 30upx 48upx;
		.list-title{
			display: flex;
			text{
				background-color: #00a8ff;
				padding: 4upx;
				font-size: 24upx;
				line-height: 26upx;
				color: $white;
				margin-right: 8upx;
			}
			color: $default-color;
			font-weight: bold;
			font-size: 34upx;
		}
		.list-content{
			color: $text-gray-color1;
			font-size: 26upx;
			line-height: 42upx;
			margin: 20upx 0 28upx;
		}
		.list-bottom{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.list-bottom-l{
				.list-bottom-left{
					color: $text-gray-color4;
					font-size: 30upx;
					text{
						font-size: 42upx;
						font-weight: bold;
					}
				}
				.list-bottom-l-r{
					display: flex;
					align-items: center;
					.list-bottom-i{
						color: $text-gray-color1;
						font-size: 23upx;
					}
				}
				
			}
			
			.list-bottom-b{
				button{
					background: $text-gray-color4;
					border-radius: 8upx;
					font-size: 24upx;
					padding: 0;
					color: $white;
					text-align: center;
					width: 136upx;
					height: 54upx;
					list-style-position: 54upx;
				}
			}
		}
	}
</style>
