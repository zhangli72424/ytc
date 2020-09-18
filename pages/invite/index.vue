<template>
	<view>
		<view class="addvertising-bg">
			<image :src="imgsrc" mode="widthFix" lazy-load></image>
		</view>
		<view class="advertising-content">
			<view class="image-logo">
				<image src="../../static/image/advertising-title.png" mode="widthFix" lazy-load></image>
			</view>
			<view class="image-content">
				<image src="../../static/image/advertising-tip.png" mode="widthFix" lazy-load></image>
			</view>
			
			<text>{{i18n.my_share_address}}</text>
			<view class="advertising-content-t">
				<view>{{addressData}}</view>
				<button type="default" hover-class="active" @tap.stop="copy">{{i18n.copy}}</button>
			</view>
			<view class="advertising-content-btn">
				<button type="default" hover-class="active" @tap.stop="save">{{i18n.Download_poster}}</button>
			</view>
		</view>
		
		<view class="advertising-card">
			<image :src="qrSrc" mode="widthFix" lazy-load></image>
			<view>{{i18n.Scan_code_registration}}</view>
		</view>
		<load v-if="showLoadings"></load>
	</view>
</template>

<script>
	import Load from '@/components/common/load.vue';
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters,mapMutations} from "vuex";
	export default {
		components:{
			Load
		},
		data() {
			return {
				imgsrc:'../../static/image/advertising-bg.png',
				isfast:false,
				addressData:'',
				qrSrc:'',
				showLoadings:false,
				isCheck:false
			};
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters([
				'getRequestUrl',
				'getLangType',
				'getLogin',
				'getLoginInfo',
				'getCoin'
			]),
		},
		onShow(){
			forceUpdate(this.getLangType);
			this._getAddress();
		},
		onLoad(){
			this.qrSrc = this.getRequestUrl+'/static/zhifu_img/username_'+this.getLoginInfo.username+'.png';
		},
		methods:{
			_getAddress() {
				let _data = {
						id: this.getLoginInfo.id,
						token: this.getLoginInfo.token
					}
					if(this.isCheck) return
					this.isCheck  = true;
					this.showLoadings = true
				fetch('/api/user/userQrcode', _data, 'post')
					.then(res => {
						this.isCheck  = false;
						this.showLoadings = false
						if (res.data.code) {
							this.addressData = res.data.data.qrcode;
						} else {
							showToast(res.data.msg);
						}
					})
					.catch(res=> {
						this.isCheck  = false;
						this.showLoadings = false
						showToast(this.i18n.request_fail);
					})
			},
			copy() {
				if (this.isfast) return;
				this.isfast = true;
				setTimeout(()=> {
					this.isfast = false;
				}, 1500)
				let  _this = this;
				uni.setClipboardData({
					data: this.addressData,
					success: function () {
						uni.showModal({
							title: _this.i18n.copy_success,
							content:  _this.i18n.copy_success_message, 
							showCancel:false,
							success: function(res) {
								if (res.confirm) {											 
									//console.log('用户点击确定');
								} else if (res.cancel) {
									//console.log('用户点击取消');
								}
							}
						});
					}
				});
			},
			save () {
				//#ifdef APP-PLUS
				var pages = getCurrentPages();  
			    var page = pages[pages.length - 1];
			    var bitmap=null;  
				// 获得当前webview对象
			    var currentWebview = page.$getAppWebview();
				// 要绘制的图片对象
			    bitmap = new plus.nativeObj.Bitmap('amway_img');  
			    // 将webview内容绘制到Bitmap对象中  
			    currentWebview.draw(
					bitmap,
					// 成功的回调函数
					function(){
						bitmap.save(
						// 要保存的图片路径 相对路径URL(RelativeURL) - 以"_"开头的相对路径
						// 因为内容可能改变 所以使用随机数作为文件的名字
						"_doc/"+Math.random()+".jpg"  
						// 可设置保存图片的格式，压缩质量等参数。
						,{}  
						,function(i){
							uni.saveImageToPhotosAlbum({  
								filePath: i.target,  
								success: function () {  
									bitmap.clear(); //销毁Bitmap图片  
									uni.showToast({  
										title: '保存图片成功',  
										duration: 1500,
										icon: "none"
									});  
								}  
							});  
						}  
						,function(e){
							uni.showToast({  
								title: '保存图片失败',  
								duration: 1500,
								icon: "none"
							});
						});  
					},
					// 失败的回调函数
					function(e){
						uni.showToast({  
							title: '保存图片失败',
							duration: 1500,
							icon: "none"
						});
					}
				);
				// #endif
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: linear-gradient(to bottom, #01041c, #05053e);
	}
	@import '@/common/scss/variable.scss';
	.addvertising-bg{
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom:0;
		width: 100%;
		height: 100vh;
		z-index: -1;
		overflow: hidden;
		image{
			width: 750upx;
			margin-top: 226upx;
			flex-shrink: 0;
		}
	}
	.advertising-content{
		padding: 100upx 0 164upx 60upx;
		.image-logo{
			text-align: right;
			padding: 0 60upx 65upx;
			image{
				width: 250upx;
				height: 65upx;
				flex-shrink: 0;
			}
		}
		.image-content{
			image{
				width: 503upx;
				height: 270upx;
				flex-shrink: 0;
			}
		}
		text{
			color: $white;
			font-size: 30upx;
		}
		.advertising-content-t{
			margin: 22upx 0 44upx;
			width: 460upx;
			background: rgba(63, 65, 142,.6);
			border-radius: 8upx;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			align-items: center;
			view{
				flex: 1;
				line-height: 62upx;
				font-size: 24upx;
				text-align: center;
				padding: 0 20upx;
				overflow: hidden;
				text-overflow:ellipsis; 
				white-space:nowrap;
			}
			button{
				background: rgba(63, 65, 142,0);
				// background-color: red;
				width: 140upx;
				line-height: 62upx;
				text-align: center;
				height: 62upx;
				font-size: 24upx;
				color: $white;
				&.active{
					background: #603de6;
					color: #02051d;
				}
			}
		}
		.advertising-content-btn{
			text-align: left;
			button{
				margin-left: 0;
				width: 268upx;
				height: 84upx;
				line-height: 84upx;
				text-align: center;
				border-radius: 8upx;
				background: linear-gradient(to right, #755fe1, #5b37e7);
				color: $white;
				&.active{
					background: rgba(63, 65, 142,.9);
					color: #02051d;
				}
			}
		}
	}
	.advertising-card{
		width: 250upx;
		margin: 0 auto;
		image{
			width: 250upx;
			height: 250upx;
			background-color: $white;
			flex-shrink: 0;
		}
		view{
			font-size: 26upx;
			color: $white;
			margin-top: 30upx;
			text-align: center;
		}
	}
</style>
