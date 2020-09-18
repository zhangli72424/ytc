<template>
	<view class="">
		<u-navbar :is-back="true" backIconColor="#ffffff" title-color="#ffffff" :background="background" title="合同协议">
		</u-navbar>
		<view class="content">
			<scroll-view scroll-y="true" scroll-x="true">
				<u-parse :html="info"></u-parse>
			</scroll-view>
			
		</view>
		<view class="footer">
			我的签名:{{sign?sign:' '}}
		</view>
	</view>
</template>

<script>
	import Load from '@/components/common/load.vue';
	import Message from '@/components/common/message.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters, mapMutations} from 'vuex';
	export default {
		data() {
			return {
				background: {
					background:"#1a202f"
				},
				info:'',
				sign:"",
				content:'',
				tid:''
			}
		},
		computed:{
			i18n() {
				return this.$t('message');
			},
			...mapGetters([
				'getRequestUrl',
				"getLoginInfo",
				'getLangType'
			])
		},
		onLoad(e){
			console.log(e);
			this.tid = e.id
			this.sign = e.sign=='null'?'':e.sign
		},
		onShow(){
			this.contract();
		},
		methods:{
			contract(){
				
				fetch('/api/bee/contract',{tid:this.tid},'post')
					.then(res=>{
						if(res.data.code==1){
							// this.title='合同详情'
							// this.seeContract = true;
							// this.showModal = true;
							// this.content = res.data.data.contract.content
							// this.card = res.data.data.contract.card
							// this.name = res.data.data.contract.name
							
							this.info = res.data.data.contract.content
								.replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
								.replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
								.replace(/<p>/ig, '<p class="p_class">')
								.replace(/\<img/gi, '<img style="max-width:98%;height:auto" ')
								.replace(/\<table/gi, '<table style="border: 1px solid white;" ')
								.replace(/\<th/gi, '<th style="border: 1px solid white;" ')
								.replace(/\<td /gi, '<td  style="border: 1px solid white;" ')
							
							
						}
					})
					.catch(err=>{
						console.log(err.data.msg);
					})
			}
		}
	}
</script>

<style scoped lang="scss">
	.content{
		padding-bottom: 120rpx;
		font-size: 28rpx;
	}
	.footer{
		line-height: 110rpx;
		height: 110rpx;
		padding: 0 20rpx;
		background-color: #1a202f;
		color: $white;
		position: fixed;
		left: 0;
		line-height: 45rpx;
		font-size: 28rpx;
		bottom: 0;
		width: 100%;
		z-index: 10;
	}
</style>
