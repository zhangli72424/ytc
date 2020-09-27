<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			// index:0,
			Mnemonic:uni.getStorageSync('Mnemonic')?JSON.parse(uni.getStorageSync('Mnemonic')):'',
			data:{},
			id:0
		},
	}
</script>

<style>
	@import url("/common/css/animate.css");
	@import url("/common/css/common.css");
	@import url("/common/css/font.css");
	page{
		background-color: #F6F6F6 !important;
	}
	/*每个页面公共css */
</style>
