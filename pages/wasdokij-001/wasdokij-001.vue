<template>
	<view class="content">
		<!-- <web-view  src="/hybrid/html/index.html"></web-view> -->
		<web-view @message="handleMessage" :webview-styles="webviewStyles" :src="url"></web-view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				webviewStyles:{},
				url:'/hybrid/html/index.html?data='
			}
		},
		onLoad(data) {
		　　　　　　　　　　//这里对要传入到webview中的参数进行encodeURIComponent编码否则中文乱码
				this.url+=encodeURIComponent(data.data)
			},
		methods: {
			handleMessage(event){
				console.log(event.detail.data);
			}
		}
	}
</script>

<style>
</style>
