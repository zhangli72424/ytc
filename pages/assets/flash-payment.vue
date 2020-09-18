<template>
	<view class="app-flash">
		<u-navbar :is-back="true" backIconColor="#ffffff" :title="i18n.f_exchange" :background="background" titleColor="#ffffff"/>
		<view class="top">
			
			<view class="top-bg"></view>
			<!-- <view class="page_f_title">{{i18n.flash}}</view> -->
			<view class="flash-area">
				<view class="rate-txt">
					<!-- 汇率 -->
					{{i18n.rate}}<text class="rate-num">{{rate | formatParsefloat}}</text>
					<!-- 手续费 -->
					<block v-if="sd__scf__">
						{{i18n.sxf}}<text class="rate-num">{{sd__scf__}}({{RightCoin}})</text>
					</block>
				</view>
				<view class="rate-body">
					<view class="left">
						<view class="innert-t">
							<view class="title">{{leftCoin}}</view>
							<view class="txt">({{i18n.AvailableBalance}}: {{usdt_balance | formatParsefloat}})</view>
						</view>
						<input type="text" class="inner-b" v-model="falshnum" :disabled="false" :placeholder="i18n.transfer__out__num">
					</view>
					<view class="center" @tap="roateImage">
						<image :style="{transform: 'rotate(' + rotate + 'deg)'}" src="/static/image/flash-double-arrow.png"></image>
					</view>
					<view class="right">
						<view class="innert-t">
							<view class="title">{{RightCoin}}</view>
							<view class="txt">({{i18n.AvailableBalance}}: {{gfa_balance | formatParsefloat}})</view>
						</view>
						<input type="text" class="inner-b" :disabled="true" :placeholder="i18n.receive__num" v-model="receivenum">
					</view>
				</view>
				<view class="rate-footer" hover-class="hover-transform1" @tap="clickfastflash">
					<image src="/static/image/flash.png"></image><text>{{i18n.f_exchange}}</text>
				</view>
			</view>
		</view>
		<view class="bottom">
			<view class="flash-log-title">{{i18n.flas_history}}</view>
			<template v-if="list.length > 0">
				<view class="list">
					<view class="li" v-for="(item, index) in list" :key="index">
						<view class="left">
							<view class="time">{{item.time}}</view>
							<view class="cointype"><text style="width: 34px;display: inline-block;">{{item.typeStr}}</text> <text class="extra">--></text> <text>{{item.typeStr == "USDT" ? "GFA" : "USDT"}}</text></view>
						</view>
						<view class="right">
							<view class="txt">{{i18n.quantity}}</view>
							<view class="num">+{{item.amount | formatParsefloat}} <text>{{item.typeStr == "USDT" ? "GFA" : "USDT"}}</text></view>
						</view>
					</view>
					
				</view>
			</template>
			<template v-else>
				<view v-if="list.length == 0" class="nodata" style="width: 100%;">
					{{i18n.nodata}}
				</view>
			</template>
			
		</view>
		
		<pay-pwd
		:maxlength="6" 
		:isPwd="true" 
		:isSHow="shows" 
		:isShows="isshows"
		:isShowss="showss"
		@close="close"
		@input-again="inputAgain"
		@finish="finish"></pay-pwd>
		<load v-if="showLoadings"></load>
	</view>
</template>

<script>
	import {pageback, fetch, showToast, checkLogin} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex'
	import Load from '@/components/common/load.vue';
	export default {
		data() {
			return {
				background:'transparent',
				showLoadings:false,
				shows:false,
				isshows:false,
				showss:false,
				usdtIsLeft: false,
				rotate: 0,
				leftCoin: "ETHQ",
				RightCoin: "USDT",
				gfa_balance: 0,
				usdt_balance: 0,
				gfa_price: 0,
				falshnum: '',
				receivenum: '',
				loadings:false,
				page: 1,
				gfa_id: '',
				usdt_id: '',
				list: [],
				isCheck:false,
				sd_sxf: 0
			}
		},
		computed: {
			sd__scf__() {
				// if()
				return this.usdtIsLeft ? 0 : parseFloat((this.falshnum * this.rate * this.sd_sxf).toFixed(4))
			},
			i18n() {
				return this.$t('message')
			},
			rate() {
				return this.usdtIsLeft ? parseInt((1 / this.gfa_price)*100000000)/100000000 : this.gfa_price
			},
			...mapGetters([
				'getLoginInfo',
				'getRequestUrl'
			])
		},
		onShow() {
			this.getWallet();
			// checkLogin(this.getLoginInfo, this.getRequestUrl)
			this.page = 1
			this.list = []
			this._getDetails()
		},
		onLoad() {
			// let timers = setInterval(()=>{
			// 		// this.loadings = false;
			// 		let _data = {
			// 			id: this.getLoginInfo.id,
			// 			token: this.getLoginInfo.token,
			// 			token_x: 1,
			// 			token_y: 3,
			// 			thenum: 10,
			// 			pay_pwd: 111111
			// 		}
			// 	fetch("/api/Wallet/exchange", _data, "post")
			// 	.then(res=>{
					
			// 	})
			// },10)
		},
		methods: {
			closeMess(){this.showMess = !this.showMess;this.showpopule=!this.showpopule;this.loadings = false;},
			close(val){
				if(val==1){
					this.shows = false;
					this.showss = false;
					this.showpwd = false;
					this.loadings = false;
				}else{
					this.shows = val;
					this.showpwd = val;
					this.showss = val
				}
			},
			inputAgain(val){
				this.shows = false;
				this.showpwd = true;
				this.loadings = false;
			},
			finish(val){
				// this.loadings = false;
				let _data = {
					id: this.getLoginInfo.id,
					token: this.getLoginInfo.token,
					token_x: this.leftCoin == 'ETHQ' ? this.usdt_id : this.gfa_id,
					token_y: this.RightCoin == 'ETHQ' ? this.usdt_id : this.gfa_id,
					thenum: this.falshnum,
					pay_pwd: val
				}
				if(this.isCheck) return;
				this.isCheck = true;
				this.showLoadings = true;
				// console.log(_data)
				// return
				// uni.showLoading()
				fetch("/api/Wallet/exchange", _data, "post")
					.then(res => {
						// uni.hideLoading()
						this.showLoadings = false
						this.isCheck = false;
						console.log(res)
						showToast(res.data.msg)
						this.___init()
						if (res.statusCode == 200 && res.data.code == 1) {
							this._getDetails(1)
							this.getWallet();
						}
					})
					.catch(err => {
						this.isCheck = false;
						// uni.hideLoading()
						this.showLoadings = false
						console.log(err)
						this.___init()
						// this.showPopOver = false
					})
			},
			getWallet(){
				this.showLoadings = true
				fetch('/api/wallet/tokenList',{},'get')
					.then(res=>{
						this.showLoadings = false
						if(res.data.code==1){
							let ghb = res.data.data.filter(item=>{
								return item.title_en=='ETHQ'
							})
						//	let {balance, usdt_balance, price, id, usdt_id, txsxf} = ghb[0]
							let usdt_ = res.data.data.filter(item=>{
								return item.title_en=='USDT'
							})
							this.sd_sxf = ghb[0].sxf
							this.gfa_price = ghb[0].price
							this.gfa_balance = usdt_[0].user_balance
							this.gfa_id = usdt_[0].id
							this.usdt_balance = ghb[0].user_balance
							this.usdt_id = ghb[0].id
						}
					})
					.catch(err=>{
						this.showLoadings = false
					})
			},
			tapNavLeft() {
				uni.navigateBack({
					delta:1
				})
			},
			roateImage() {
				return;
				this.usdtIsLeft = !this.usdtIsLeft;
				this.rotate = this.usdtIsLeft ? 0 : 360;
				[this.leftCoin, this.RightCoin] = [this.RightCoin, this.leftCoin];
				[this.gfa_balance, this.usdt_balance] = [this.usdt_balance, this.gfa_balance];
				this.falshnum = '';
			},
			clickfastflash() {
				if (!this.falshnum) {
					showToast(this.i18n.Please_enter_the_number_of_transfers)
					return
				}
				this.shows = true;
			},
			_getDetails(page=this.page) {
				// console.log(this.page)
				let _data ={
					id: this.getLoginInfo.id,
					token: this.getLoginInfo.token,
					type: 3,
					page: page,
					rows: 10
				}
				this.showLoadings = true
				// console.log(_data)
				fetch('/api/User/detailed', _data, 'post')
					.then(res => {
						this.showLoadings = false
						console.log(res)
						if (res.statusCode == 200 && res.data.code == 1) {
							let innerData = res.data.data.data.data
							if(innerData.length ==0){
								return
							}
							if (page == 1) {
								this.list = innerData
								this.page++
							} else {
								this.list = this.list.concat(innerData)
								this.page++
							}
						} else {
							// showToast(res.data.msg)
						}
					})
					.catch(err => {
						this.showLoadings = false
						console.log(err)
					})
			},
			___init() {
				this.falshnum = ''
				this.password = ''
			}
		},
		components: {
			Load
		},
		watch: {
			falshnum(newv) {
				console.log(newv);
				let digit = parseFloat(newv)
				if (!digit) {
					this.falshnum = ''
					this.receivenum = ''
				} else {
					this.falshnum = digit
					this.receivenum = this.usdtIsLeft ? ( (parseInt(this.falshnum * this.rate*100000000))/100000000  + '(' + this.RightCoin +')') : ((parseInt(this.falshnum * this.rate * (1 - (this.sd_sxf))*100000000))/100000000 + '('+this.RightCoin+')')
				}
			}
		},
		onReachBottom() {
			this._getDetails()
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	@import '@/common/scss/global.scss';
	page{
		background-color: $page-bg-color2;
	}
	.nodata{
		color: #B7B7B9;
	}
	.app-flash {
		& > .bottom {
			width: 690upx;
			margin: 40upx auto 50upx;
			background-color: #FFFFFF;
			border-radius: 16upx;
			.flash-log-title {
				font-size: 15px;
				font-weight: bold;
				color: $text-gray-color4;
				line-height: 88upx;
				text-align: center;
			}
			.list {
				padding: 0 30upx 50upx;
				.li {
					height: 100upx;
					border-bottom: 1upx solid $split-line-color2;
					
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.time, .txt {
						font-size: 11px;
						color: $text-gray-color6;
						margin-bottom: 20upx;
					}
					.cointype {
						color: $text-gray-color4;
						font-size: 14px;
						font-weight: bold;
						.extra {
							font-weight: normal;
							margin: 0 20upx;
						}
					}
					.right {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						justify-content: center;
						.num {
							color: $adorn-orange;
							font-size: 16px;
							font-weight: bold;
							
							text {
								font-weight: normal;
								font-size: 12px;
								color: $text-gray-color4;
							}
						}
					}
				}
			}
		}
		.top {
			.top-bg {
				width: 750upx;
				height: 421upx;
				background-color: $theme-color;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				z-index: 1;
			}
			
			.uni-nav-wrapper {
				position: relative;
				z-index: 2;
			}
			
			.page_f_title {
				text-align: center;
				position: relative;
				font-size: 17px;
				line-height: 60upx;
				margin-bottom: 20upx;
				color: $white;
				z-index: 2;
			}
			
			.flash-area {
				background-color: #FFFFFF;
				width: 690upx;
				margin: 20upx 30upx 0;
				padding: 0 30upx 30upx;
				border-radius: 16upx;
				position: relative;
				z-index: 2;
			
				.rate-txt {
					padding: 36upx 0;
					font-size: 14px;
					color: $text-gray-color4;
					font-weight: bold;
					text-align: center;
					.rate-num {
						margin-right: 12upx;
					}
				}
			
				.rate-body {
					display: flex;
					flex-direction: row;
			
					.left,
					.right {
						width: 260upx;
						.innert-t {
							display: flex;
							flex-direction: column;
							align-items: flex-start;
							justify-content: center;
							padding-left: 30upx;
							padding-right: 30upx;
			
							.title {
								font-size: 12px;
								color: $text-gray-color4;
								font-weight: bold;
								margin-bottom: 5upx;
							}
			
							.txt {
								font-size: 10px;
								color: $text-gray-color2;
							}
						}
			
						.inner-b {
							margin-top: 30upx;
							
							font-size: 12px;
							text-align: center;
							color: $text-gray-color4;
							@include over-txt;
						}
			
						.innert-t,.inner-b {
							border: 1upx solid $text-gray-color2;
							height: 70upx;
							border-radius: 10upx;
							width: 260upx;
						}
					}
			
					.center {
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						color: $theme-color;
			
						image {
							width: 36upx;
							height: 36upx;
							transition: all .2s linear;
						}
					}
				}
				.rate-footer {
					width: 266upx;
					height: 77upx;
					margin: 56upx auto 0;
					border-radius: 10upx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: $theme-color;
					transition: all 0.2s linear;
					image {
						width: 17upx;
						height: 33upx;
						margin-right: 10upx;
					}
					text {
						font-weight: 400;
						color: $white;
						font-size: 12px;
					}
				}
			}
		}
		.popover {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background-color: rgba($color: $black, $alpha: .2);
			z-index: 3;
			display: flex;
			justify-content: center;
			align-items: center;
			.popover-content {
				background-color: #FFFFFF;
				width: 650upx;
				height: 360upx;
				border-radius: 16upx;
				.title {
					height: 88upx;
					line-height: 88upx;
					color: $text-gray-color4;
					font-weight: bold;
					font-size: 16px;
					text-align: center;
				}
				input {
					background-color: $page-bg-color2;
					height: 80upx;
					font-size: 13px;
					color: $text-gray-color4;
					margin: 0 40upx;
					padding: 0 30upx;
					border-radius: 10upx;
				}
				.btns {
					display: flex;
					justify-content: center;
					margin-top: 30upx;
					.cancel, .confirm {
						width: 260upx;
						height: 70upx;
						line-height: 70upx;
						border-radius: 10upx;
						color: $white;
						text-align: center;
						font-size: 13px;
					}
					.confirm {
						margin-left: 40upx;
						background-color: #FED094;
					}
					.cancel {
						background-color: $page-bg-color2;
						color: $text-gray-color4;
					}
				}
			}
		}
	}
</style>