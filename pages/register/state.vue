<template>
	<view class="app-area">
		
		<u-navbar 
		back-icon-color="#ffffff" 
		:is-back="true" :title="i18n.state" :background="background" titleColor="#ffffff"/>
		
		<!-- <UniNavBar :statusBar="true" leftIcon="back" :title="i18n.state" @clickLeft="back"></UniNavBar> -->
	<!-- 	<adNavBar :isRoot="true"
		:title="i18n.state" 
		bgColor="bg-wallet" 
		titleColor="#2A2A2F">
			<view class="baclIcon" slot="left" @tap.stop="back"><i class="icon iconfont icon-fanhui"></i></view>
		</adNavBar> -->
		<view v-for="part in areas" :key="part.title" class="lists">
			<h3 class="subtitle">{{part.title}}</h3>
			<view class="subline" v-for="item in part.data" :key="item.code" @tap="selectedArea(item)">
				<view class="text">{{cur_lang == 'chs' ? item.zh : item.en}} <text class="codenum">{{item.code}}</text></view>
				<text class="iconfont icon-arrow-right"></text>
			</view>
		</view>
	</view>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import {showToast, pageback, fetch} from '@/common/js/util.js'
// import adNavBar from '@/components/andy-ADNavBar/andy-ADNavBar.vue';
export default {
	data() {
		return {
			background:'linear-gradient(to right, #29F19C, #02A1F9)',
			areas: [],
			cur_lang: "chs"
		}
	},
	computed: {
		i18n () {  
			return this.$t('message')
		},
		...mapGetters([
			'getRequestUrl',
			'getLang'
		])
	},
	onShow() {
		this.cur_lang = uni.getStorageSync('lang') == 2 ? 'en' : 'chs';
	},
	onLoad() {
		this._getData();
	},
	methods: {
		_getData() {
			fetch('/api/Countries/Countries_2',{},'post')
				.then(res=>{
					if (res.data.code == 1) {
						this.areas = res.data.data
					} else {
						showToast(res.data.msg);
					}
				})
				.catch(err=>{
					showToast(this.i18n.request_fail);
				})
		},
		back() {
			pageback()
		},
		selectedArea(e) {
			this.setIncode(e);
			setTimeout(()=> {
				pageback()
			}, 500)
		},
		...mapMutations([
			'setIncode'
		])
	},
	components: {
		// adNavBar
	}
}
</script>

<style lang="scss">
@import "@/common/scss/variable.scss";
@import "@/common/scss/global.scss";
.bg-wallet{
	background-color: $white;
}
.baclIcon{
	color: $default-color;
}
.app-area {
	color: $black;
	.lists {
		h3 {
			font-size: 16px;
			padding: 0 30upx;
			height: 30px;
			line-height: 30px;
			background-color: $button-default-color;
			color: $white;
		}
		.subline {
			padding: 0 45upx;
			display: flex;
			flex-direction: row;
			height: 40px;
			background-color: $page-bg-color5;
			justify-content: space-between;
			border-bottom: 1upx solid $split-line-color1;
			color: $white;
			.iconfont {
				font-size: 14px;
				padding: 0 10px;
				margin: 0 -10px;
				line-height: 40px;
			}
			.text {
				line-height: 40px;
				font-size: 14px;
			}
			.codenum {
				margin-left: 10upx;
			}
		}
	}
}
</style>
