<template>
	<view class="content">
		<view class="list-content">
			<view class="list _flex _flex_align_items_center _flex_justify_content">
				<view>{{isSell?i18n.Sell_orders:i18n.Pay}}{{i18n.quantity}}</view>
				<view class="item-input  _flex _flex_align_items_center">
					<input type="number" :placeholder="i18n.Please_enter_quantity" v-model="sellnumber">
					<text>{{info.token_id_name}}</text>
				</view>
			</view>
			<view class="Currently-available">
			{{i18n.cur_balance}}{{marketInfo.buy_token_id_balance?(marketInfo.buy_token_id_balance):'-'}} {{buy_token_id_name}}
			</view>
			<view class="Currently-available">
			{{marketInfo.token_id_balance?(marketInfo.token_id_balance):'-'}}{{info.token_id_name}}
			</view>
			<view class="list _flex _flex_align_items_center _flex_justify_content">
				<view>{{isSell?i18n.Sell_orders:i18n.Pay}}{{i18n.price}}</view>
				<view class="item-input  _flex _flex_align_items_center">
					<input type="number" :placeholder="i18n.Please_enter_unit_price" v-model="sellprice">
					<text>{{buy_token_id_name}}</text>
				</view>
			</view>
			<view class="Currently-available">{{i18n.Unit_price_range}}:{{marketInfo.minPrice}} ~ {{marketInfo.maxPrice}} {{buy_token_id_name}}</view>
			<view class="list _flex _flex_align_items_center _flex_justify_content">
				<view>{{i18n.Single_Low}}</view>
				<view class="item-input  _flex _flex_align_items_center">
					<input type="number" :placeholder="i18n.Please_fill_in_the_minimum_single_transaction_amount" v-model="onenumber">
					<text>{{info.token_id_name}}</text>
				</view>
			</view>
			<!-- <view class="list _flex _flex_align_items_center _flex_justify_content">
				<view>{{i18n.yanzhengma}}</view>
				<view class="item-input  _flex _flex_align_items_center">
					<input type="number" :placeholder="i18n.enter_vcode" v-model="yzm" maxlength="6">
					<view>
						<vcode :account="phone"></vcode>
					</view>
				</view>
			</view> -->
				<view class="list-fee">
					<text>{{i18n.total}}：≈ {{total}}{{buy_token_id_name}}</text>
					<!-- <view>{{fee_balance}} {{isSell?buy_token_id_name:'CPD'}}</view> -->
				</view>
		<!-- 	<view class="list-fee">
				<text>{{i18n.sxf}}：{{marketInfo.cpdjysxf}}</text>
				<view>{{fee_balance}} {{isSell?buy_token_id_name:'CPD'}}</view>
			</view> -->
		</view>
		<button type="default" 
		:loading="laoding" 
		:class="{'active':!disable}" 
		:disabled="disable"
		@tap.stop="confirms"
		class="sell-btn">{{i18n.Post_now}}</button>
		<load v-if="laoding"></load>
		<pay-pwd 
		:maxlength="6" 
		:isPwd="true" 
		:isSHow="shows" 
		:isShows="isshows"
		:isShowss="showss"
		@close="close"
		@input-again="inputAgain"
		@finish="finish"></pay-pwd>
		<message
		:shows="showMess" 
		:message="mesInfo"
		@jump="closeMess"
		@close="closeMess"></message>
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from "vuex";
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js'
	import Load from '@/components/common/load.vue';
	import payPwd from '@/components/pay-pwd/pay-pwd.vue';
	import vcode from '@/components/vcode/vcode.vue';
	import message from '@/components/common/message.vue';
	export default{
		components:{
			Load,payPwd,vcode,message
		},
		data() {
			return {
				mesInfo:'',
				showMess:false,
				isSell:false,
				marketInfo:{},
				shows:false,
				showss:false,
				isshows:false,
				sellnumber:'',
				sellprice:'',
				onenumber:'',
				disable:true,
				laoding:false,
				yzm:'',
				info:{},
				phone:'',
				buy_token_id_name:'',
				isCheck:false
			}
		},
		watch:{
			sellnumber(val){
				this.change()
			},
			sellprice(val){
				this.change()
			},
			onenumber(val){
				this.change()
			},
			yzm(val){
				this.change()
			}
		},
		computed:{
			total(){
				return (this.sellnumber && this.sellprice)?((parseInt((this.sellnumber * this.sellprice)*100000000)/100000000).toFixed(4)):'0'
			},
			fee_balance(){
				if(this.sellnumber && this.sellprice){
					return  ((parseInt((this.sellnumber*this.marketInfo.cpdjysxf*this.sellprice)*100000000))/100000000).toFixed(4);
				}else{
					return '0';
				}
			},
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
				'getLoginInfo'
			]),
		},
		onShow(){
			forceUpdate(this.getLangType);
			this.getmarketInfo();
			this.showMess =false
		},
		onLoad(e){
			this.info = JSON.parse(e.info);
			console.log(this.info);
			this.phone = this.getLoginInfo.email;
			if(e.type=='1'){
				this.isSell = true
			}else{
				uni.setNavigationBarTitle({title:this.i18n.Post_purchase})
				this.isSell = false
			}
				
			// }
		},
		methods:{
			closeMess(){
				this.showMess = !this.showMess
			},
			getmarketInfo(){
				let data = {
					token_id:this.info.token_id,
					buy_token_id:this.info.buy_token_id
				}
				if(this.isCheck) return
				this.isCheck  = true;
				this.laoding = true;
				fetch('/api/shop/marketInfo', data, "post").then(res=>{
					this.laoding = false;
					this.isCheck  = false;
					// showToast(res.data.msg)
					if(res.data.code){
						
						this.marketInfo = res.data.data;
						this.buy_token_id_name = res.data.data.buy_token_id_name
						this.marketInfo.minPrice = (parseInt(res.data.data.price*(1-res.data.data.price_fd)*100000000)/100000000).toFixed(4)
						this.marketInfo.maxPrice = (parseInt(res.data.data.price*(1+parseFloat(res.data.data.price_fd))*100000000)/100000000).toFixed(4)
					}
				}).catch(error=>{
					this.isCheck  = false;
					this.laoding = false;
					console.log(error);
				})
			},
			inputAgain(val){
				this.isshows = false;
				this.shows = true;
			},
			close(val){
				if(val==1){
					this.isshows = false;
					this.showss = false;
					this.shows = false;
				}else{
					this.isshows = val;
					this.shows = val;
					this.showss = val
				}
			},
			finish(val){
				let data = {
					num:this.sellnumber,
					paypwd:val,
					price:this.sellprice,
					token_id:this.info.token_id,
					minnum:this.onenumber,
					type:this.isSell ?2:1,
					code:this.yzm,
					yzmtype:1,
					buy_token_id:this.info.buy_token_id
				}
				if(this.isCheck) return
				this.isCheck  = true;
				this.laoding = true;
				fetch('/api/shop/cpdMarket',data,'POST').then(res=>{
					this.laoding = false;
					this.isCheck  = false;
					if(res.data.code){
						this.showMess=true;
						this.mesInfo = res.data.msg
						// showToast(res.data.msg)
						setTimeout(()=>{
							uni.navigateBack({
								delta:1
							})
						},500)
						this.isshows = false;
						this.showss = false;
						this.shows = false;
						this.sellnumber='';
						this.sellprice='';
						this.onenumber='';
						this.yzm=''
						this.getmarketInfo();
					}else{
						this.isshows = false;
						this.showss = false;
						this.shows = false;
						if(res.data.msg=='支付密码错误！'){
							this.isshows = false;
							this.showss = false;
							this.shows = false;
							this.showMess=true;
							this.mesInfo = res.data.msg
						}else if(res.data.msg=='usdt不足'){
							this.isshows = false;
							this.showss = false;
							this.shows = false;
							this.showMess=true;
							this.mesInfo = res.data.msg
						}else{
							this.showMess=true;
							this.mesInfo = res.data.msg
							// showToast(res.data.msg)
							this.sellnumber='';
							this.sellprice='';
							this.onenumber='';
							this.yzm=''
						}
					}
				}).catch(error=>{
					this.isCheck  = false;
					this.laoding = false;
					this.isshows = false;
					this.showss = false;
					this.shows = false;
					this.sellnumber='';
					this.sellprice='';
					this.onenumber='';
					this.yzm=''
				})
			},
			//监听输入框
			change(){
				console.log(this.disable);
				if(this.sellnumber && this.sellnumber && this.onenumber){
					return this.disable=false;
				}
				this.disable = true;
			},
			toModifypwd(){
				uni.navigateTo({
					url:'/pages/modify-pwd/modify-pwd'
				})
			},
			confirms(){
				if(!this.getLoginInfo.paypwd){
					// toModifypwd\
					this.showMess = !this.showMess;
					this.mesInfo = '暂未设置支付密码,请立即前往设置'
					return
				}
				if(!(this.sellnumber.match(/^\d+$/))){
					showToast(this.i18n.p_enter_zh)
					return
				}
				if(!this.isSell){
					if((this.sellnumber*this.sellprice*(1+parseFloat(this.marketInfo.price_fd)))>this.marketInfo.cpd_balance){
						showToast(this.i18n.market_sell_tip0)
						return
					}
				}else{
					if((this.sellnumber*this.sellprice*(1+parseFloat(this.marketInfo.price_fd)))>this.marketInfo.usdt_balance){
						showToast(this.i18n.market_sell_tip0)
						return
					}
				}
				if(this.sellnumber>parseFloat(this.marketInfo.max)){
					showToast(`${this.i18n.market_sell_tip1}${this.marketInfo.max}`)
					return
				}
				if(this.sellprice<parseFloat(this.marketInfo.minPrice)){
					showToast(this.i18n.market_sell_tip2)
					return
				}
				if(this.sellprice> parseFloat(this.marketInfo.maxPrice)){
					showToast(this.i18n.market_sell_tip3)
					return
				}
				if(this.onenumber>this.sellnumber){
					if(this.isSell){
						showToast(this.i18n.market_sell_tip4)
					}else{
						showToast(this.i18n.market_sell_tip5)
					}
					
					return;
				}
				// this.isshows = true;return
				this.shows = true;
			}
		}
	}
</script>

<style scoped lang="scss">
	@import '@/common/scss/variable.scss';
	.content{
		.list-content{
			margin-top: 20upx;
			background-color: $page-bg-color5;
			.Currently-available{
				font-size: 24upx;
				text-align: right;
				padding:20upx 30upx;
				color: #4A4B79;
			}
			.list{
				border-bottom: 2upx solid $split-line-color1;
				padding: 46upx 30upx;
				view{
					color: $white;
				}
				.item-input{
					font-size: 28upx;
					input{
						color: $white;
						text-align: right;
					}
					text{
						color: $white;
						font-size: 24upx;
						margin-left: 15upx;
					}
					view{
						color: $white;
						margin-left: 20upx;
					}
				}
			}
			.list-fee{
				text-align: right;
				padding: 20upx 30upx 40upx;
				text{
					font-size: 24upx;
					color: $button-default-color;
				}
				view{
					color: $white;
					font-size: 24upx;
				}
			}
		}
		.sell-btn{
			margin: 128upx 30upx 0;
			line-height: 88upx;
			height: 88upx;
			border-radius: 6upx;
			background: #58627D;
			color: #0F0C39;
			&.active{
				background: $button-color;
				color: $white;
			}
		}
	}
</style>
