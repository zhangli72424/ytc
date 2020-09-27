<template>
	<view>
		<image src="../../static/imgs/Render_2.gif"
		:style="'height:'+ screenHeight +'px !important;'"
		 lazy-load class="ethq-index-bg"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				screenHeight:''
			};
		},
		 onLoad() {
			 this.screenHeight = uni.getSystemInfoSync().windowHeight;
			 setTimeout(()=>{
				uni.reLaunch({
					url:'/pages/login/login'
				})
			 },3000)
		},
		onShow(){
		},
		methods:{
			
		}
	}
</script>
<style>
	page{
		background: #000 !important;
		width: 750upx;
		height: 100vh;
	}
</style>
<style lang="scss">
	
	.ethq-index-bg{
		width: 100%;
		min-height: 100%;
	}
</style>
