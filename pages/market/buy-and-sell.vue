<template>
	<view class="content">
		<view class="container">
			<view class="title _flex _flex_align_items_center _flex_justify_content">
				<view class="items-left">
					<view class="items-left-title _flex _flex_align_items_center">
						{{item.username}} {{item.lv=='V'?'V0':item.lv}}
						<!-- <image src="../../static/image/grade.png" lazy-load mode="widthFix"> -->
					</view>
					<view class="items-left-i _flex _flex_align_items_center">
						{{i18n.release}}{{i18n.quantity}} <text>{{item.num | formatParsefloat}} {{curInfo.token_id_name}}</text>
					</view>
					<view class="items-left-i _flex _flex_align_items_center">
						{{i18n.Limit}} <text>{{item.minnum | formatParsefloat}} {{curInfo.token_id_name}}</text>
					</view>
					<view class="items-left-i _flex _flex_align_items_center">
						{{i18n.The_remaining_amount}} <text>{{item.cnum | formatParsefloat}} {{curInfo.token_id_name}}</text>
					</view>
				</view>
				<view class="items-right">
					<!-- <view class="items-right-i">
						已成交<text>687</text>
					</view> -->
					<view class="items-right-i">{{i18n.price}}({{curInfo.buy_token_id_name}})</view>
					<view class="items-right-c">{{item.price}}</view>
				</view>
			</view>
			
			<view class="cont">
				<view class="cont-nav">
					<text>{{type==1?i18n.Buy_by_quantity01:i18n.Buy_by_quantity}}</text>
					<!-- <text :class="{'actice':tabIndex==1}" @tap.stop="selectnav('1')">按USDT购买</text> -->
				</view>
				
				<view class="input-item _flex _flex_align_items_center _flex_justify_content">
					<input type="number" v-model="number" :placeholder="i18n.Please_enter_quantity">
					<!-- <text v-if="tabIndex==1">USDT</text> -->
				</view>
				<!-- <view class="cont-nav"> -->
					<!-- <text>{{i18n.yanzhengma}}</text> -->
					<!-- <text :class="{'actice':tabIndex==1}" @tap.stop="selectnav('1')">按USDT购买</text> -->
				<!-- </view> -->
				<!-- <view class="input-item _flex _flex_align_items_center _flex_justify_content"> -->
					<!-- <input type="number" v-model="yzm" :placeholder="i18n.enter_vcode" maxlength="6"> -->
					<!-- <text v-if="tabIndex==1">USDT</text>
					 -->
					 <!-- <view> -->
					 	<!-- <vcode :account="phone"></vcode> -->
					 <!-- </view> -->
				<!-- </view> -->
				<!-- <view class="list _flex _flex_align_items_center _flex_justify_content">
					<view>{{i18n.yanzhengma}}</view>
					<view class="item-input  _flex _flex_align_items_center">
						<input type="number" :placeholder="i18n.enter_vcode" v-model="yzm" maxlength="6">
						<view>
							<vcode :account="phone"></vcode>
						</view>
					</view>
				</view> -->
				
				
				<view class="cont-info _flex _flex_align_items_center _flex_justify_content">
					<view class="cont-info-items">
						<text>{{i18n.Account_Balance}}：</text>
						<view>{{type==1?(curInfo.token_id_balance):(curInfo.buy_token_id_balance)}} {{type==1?curInfo.token_id_name:curInfo.buy_token_id_name}}</view>
					</view>
					<view class="cont-info-items">
						<text>{{i18n.Handling_fee_ratio}}：{{curs.jysxf_cyf}}</text>
						<view>≈ {{feeNum}} {{type==1?curInfo.token_id_name:curInfo.buy_token_id_name}}</view>
					</view>
				</view>
				<view class="conten-num">
					{{i18n.Payable}}({{type==1?curInfo.token_id_name:curInfo.buy_token_id_name}}):<text>{{totalnum}}</text>
				</view>
				
			</view>
			
		</view>
		<button type="default"
		:loading="shows" 
		:class="{'active':!disable}" 
		:disabled="disable"
		@tap.stop="confirms"
		class="sell-btn">{{i18n.immediately}}{{type=='1'?i18n.Sell:i18n.buy}}</button>
		<pay-pwd
		:maxlength="6" 
		:isPwd="true" 
		:isSHow="ashows" 
		:isShows="isshows"
		:isShowss="showss"
		@close="close"
		@input-again="inputAgain"
		@finish="finish"></pay-pwd>
		<load v-if="laoding"></load>

		<message
		:shows="showPo" 
		:message="showMesg"
		@jump="toModifypwd"
		@close="closeMess"></message>
		
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from "vuex";
	import {pageto, showToast, fetch, pageback} from '@/common/js/util.js';
	import Load from '@/components/common/load.vue';
	import payPwd from '@/components/pay-pwd/pay-pwd.vue';
	import vcode from '@/components/vcode/vcode.vue';
	import message from '@/components/common/message.vue';
	export default {
		components:{
			Load,vcode,payPwd,message
		},
		computed: {
			feeNum(){
				 
				if(this.type==1){
					return this.number?((parseInt(this.number*this.curs.jysxf_cyf*100000000)/100000000).toFixed(4)):'0';
				}else{
					return this.number?((parseInt(this.number*this.item.price*this.curs.jysxf_cyf*100000000)/100000000).toFixed(4)):'0';
				}
			}, 
			totalnum(){
				if(this.type==1){
					return this.number?((parseInt(this.number*(1+parseFloat(this.curs.jysxf_cyf))*100000000)/100000000).toFixed(4)):'0';
				}else{
				return this.number?((parseInt(this.number*this.item.price*(1+parseFloat(this.curs.jysxf_cyf))*100000000)/100000000).toFixed(4)):'0';
				}
			},
			i18n () {
				return this.$t('message')
			},
			...mapGetters([
				'getLangType',
				'getRequestUrl',
				'getLoginInfo',
				'getLang',
				'getTextArr'
			])
		},
		data() {
			return {
				ashows:false,
				isshows:false,
				showss:false,
				isPwd:true,
				maxlength:6,
				shows:false,
				tabIndex:0,
				number:'',
				disable:true,
				laoding:false,
				codeIndex: 1, //下标
				codeArr: [],
				val:'',//输入框的值
				populed:false,
				populed0:false,
				populed1:false,
				paypwd:'',
				yzm:'',
				phone:'',
				//传过来的数据
				type:'',
				cur:{},
				curs:{},
				item:{},
				curInfo:{},
				isCheck:false,
				showMesg:'',
				showPo:false
			}
		},
		watch:{
			number(val){
				this.change()
			},
			yzm(val){
				this.change()
			}
		},
		onLoad(e){
			this.phone = this.getLoginInfo.email;
			this.type = e.type;
			this.cur = JSON.parse(e.cur);
			this.item = JSON.parse(e.item);
			console.log(this.item);
			console.log(this.cur);
			this.curs  = JSON.parse(e.curs)
			this.clear();
			this.getMarkInfo();
		},
		methods:{
			toModifypwd(){
				this.showPo = false;
			},
			closeMess(){
				this.showPo = false;
			},
			getMarkInfo(){
				let data = {
					token_id:this.cur.token_id,
					buy_token_id:this.cur.buy_token_id
				}
				if(this.isCheck) return
				this.isCheck  = true;
				this.laoding = true;
				fetch('/api/shop/marketInfo',data,'post')
					.then(res=>{
						this.isCheck  = false;
						this.laoding = false;
						if(res.data.code){
							this.curInfo = res.data.data
						}
					})
					.catch(err=>{
						this.isCheck  = false;
						this.laoding = false;
					})
			},
			clear(){
				this.isshows = false;
				this.showss = false;
				this.ashows = false;
				this.yzm = '';
				this.number = "";
			},
			inputAgain(){
				this.isshows = false;
				this.ashows = true;
			},
			close(val){
				console.log(val);
				if(val==1){
					this.isshows = false;
					this.showss = false;
					this.ashows = false;
				}else{
					this.isshows = val;
					this.ashows = val;
					this.showss = val
				}
			},
			change(){
				if(this.number){
					return this.disable=false
				}
				this.disable = true;
			},
			confirms(){
				if(!(this.number.match(/^\d+$/))){
					showToast(this.i18n.p_enter_zh)
					return
				}
				if(this.number=='' || !this.number){
					showToast(this.i18n.Please_enter_quantity)
					return
				}
				if(this.number > parseFloat(this.item.num)){
					showToast(this.i18n.buy_adn_sell_tip0)
					this.number = '';
					return
				}
				if(this.totalnum > parseFloat(this.curInfo.buy_balance)){
					showToast(this.i18n.buy_adn_sell_tip1) 
					this.number = '';
					return
				}
				
				// if(this.yzm=='' || !this.yzm){
				// 	showToast(this.i18n.enter_vcode)
				// 	return
				// }
				// this.laoding = true;
				this.ashows = true;
			},
			// selectnav(w){this.tabIndex=w},
			finish(val){
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					lang_type:this.getLangType=='chs'?1:2,
					num:this.number,
					paypwd:val,
					market_id:this.item.id,
					code:this.yzm,
					yzmtype:1
				}
				this.laoding = true;
				if(this.isCheck) return
				this.isCheck  = true;
				fetch('/api/shop/coinTransaction',data,'post')
					.then(res=>{
						this.isCheck  = false;
						this.laoding = false;
						if(res.data.code){
							showToast(res.data.msg)
							this.yzm = ''
							this.number='';
							this.isshows = false;
							setTimeout(()=>{
								uni.navigateBack({
									delta:1
								})
							},500)
						}else if(res.data.code=='0'){
							this.showMesg = res.data.msg
							this.showPo = true
						}
					})
					.catch(err=>{
						this.isCheck  = false;
						this.laoding = false;
					})
			}
		}
	}
</script>

<style scoped lang="scss">
	@import '@/common/scss/variable.scss';
	.content{
		.container{
			margin-bottom: 100upx;
			.title{
				padding: 56upx 30upx 40upx;
				.items-left{
					.items-left-title{
						font-size: 34upx;
						color: $white;
						font-weight: bold;
						margin-bottom: 42upx;
						image{
							margin-left: 10upx;
							width: 37upx;
							height: 37upx;
							flex-shrink: 0;
						}
					}
					.items-left-i{
						font-size: 24upx;
						color: #4A4B79;
						&:first-of-type{
							margin-bottom: 23upx;
						}
						text{
							color: $white;
							margin-left: 15upx;
						}
					}
				}
				.items-right{
					text-align: right;
					.items-right-i{
						font-size: 28upx;
						color: #4A4B79;
						&:first-of-type{
							margin-bottom: 34upx;
						}
						text{
							margin-left: 15upx;
						}
					}
					.items-right-c{
						font-size: 36upx;
						font-weight: bold;
						color: $theme-color;
					}
				}
			}
			.cont{
				background-color: $page-bg-color5;
				padding: 48upx 30upx 88upx;
				.list{
					border-bottom: 2upx solid $split-line-color1;
					padding: 46upx 30upx;
					.item-input{
						font-size: 28upx;
						input{
							text-align: left;
						}
						text{
							font-size: 24upx;
							margin-left: 15upx;
						}
						view{
							margin-left: 20upx;
						}
					}
				}
				.cont-nav{
					margin-bottom: 42upx;
					text{
						color: $white;
						font-size: 26upx;
						&:first-of-type{
							padding-right: 17upx;
							// border-right: 1upx solid #5631FD;
						}
						&:last-of-type{
							padding-left: 17upx;
						}
						// &.actice{
						// 	color: #5631FD;
						// }
					}
				}
				.input-item{
					font-size: 52upx;
					border-bottom: 1upx solid $split-line-color1;
					margin-bottom: 28upx;
					position: relative;
					view{
						position: absolute;
						right: 0;
						top: 0;
						line-height: 84upx;
					}
					input{
						font-weight: bold;
						color: $theme-color;
						line-height: 84upx;
						height: 84upx;
					}
					text{
						line-height: 84upx;
						color: $white;
					}
				}
				.cont-info{
					.cont-info-items{
						font-size: 24upx;
						text{
							color: #4A4B79;
						}
						view{
							color: $white;
							margin-top: 16upx;
						}
					}
				}
				.conten-num{
					text-align: right;
					margin-top: 28upx;
					font-size: 24upx;
					color: $theme-color;
					text{
						font-size: 36upx;
						font-weight: bold;
					}
				}
			}
		}
		.sell-btn{
			margin: 128upx 30upx 0;
			line-height: 88upx;
			height: 88upx;
			border-radius: 6upx;
			background: $button-default-color;
			color: $white;
			&.active{
				background: $button-color;
			}
		}
	}
</style>
