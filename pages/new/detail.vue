<template>
	<view class="app-aboutus">
		<u-navbar :is-back="true" backIconColor="#ffffff" :title="i18n.Details" :background="background" titleColor="#ffffff">
		</u-navbar>
		
		<view class="content">
			<view class='title' v-if="getBulletin.title">{{getBulletin.title}}</view>
			<rich-text class="p" :nodes="modifiedContent"></rich-text>
		</view>
	</view>
</template>

<script>
import {mapGetters} from 'vuex'
import {pageback} from '../../common/js/util.js'
export default {
	data() {
		return {
			background:'#001434',
			title: '',
			modifiedContent:''
		}
	},
	computed: {
		// modifiedContent() {
		// 	let str = this.getBulletin.content
		// 	return str.replace(/(\<img|\<image)/ig, '<img style="max-width:100% !important;width: 98% !important;"')
		// },
		i18n() {
			return this.$t('message')
		},
		...mapGetters([
			'getBulletin',
			'getLoginInfo',
			'getRequestUrl',
			'getLangType'
		])
	},
	methods: {
		tapNavLeft() {
			pageback();
		}
	},
	onLoad(e) {
		if(this.getLangType!='chs'){
			uni.setNavigationBarTitle({
				title:'Details'
			})
		}
	},
	onShow(){
		console.log(this.getBulletin);
		this.title = this.getBulletin.title;
		this.modifiedContent = this.getBulletin.content;
		this.modifiedContent.replace(/(\<img|\<image)/ig, '<img style="max-width:100% !important;width: 98% !important;"')
		console.log(typeof this.modifiedContent);
	},
	components: {
	}
}
</script>

<style lang="scss">
.app-aboutus {
	.index-top-nav-title{
		// padding-left: 30upx;
		width: 100%;
		font-size: 36upx;
		text-align: center;
		background: #FFFFFF;
		color: $black;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.leftIcon{
			width: 80upx;
		}
		.rightIcon{
			width: 80upx;
		}
		.index-top-nav-title-content{
			flex: 1;
		}
	}
	.content{
		margin: 30upx;
		.title{
			padding: 26upx 0 40upx 0;
			line-height: 1;
			font-size: 15px;
			font-weight: bold;
			text-align: center;
			color: $black;
		}
		.p{
			color: #999999;
			font-size: 14px;
			line-height: 22px;
			margin-bottom: 30upx;
			width: 750upx;
		}
	}
	image {
		width: 750upx !important;
	}
	img {
		width: 750upx !important;
	}
}
</style>
