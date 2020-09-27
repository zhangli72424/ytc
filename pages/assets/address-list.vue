<template>
	<view class="content">
		<u-navbar :is-back="true" :title="i18n.addressList" :background="background" titleColor="#000000" backIconColor="#000000">
			
			<view slot="right" class="right-nav-color" hover-class="active" @tap.stop="toAdd">
				{{i18n.add}}
			</view>
		</u-navbar>
		<block v-for="(item,index) in lists" :key="index">
			<view class="list" @tap.stop="select(item)">
				<view class="title">
					{{i18n.remark}}:{{item.tag}}
				</view>
				<view class="adddress">
					<text>{{i18n.address}}:</text> <view>{{item.address}}</view>
				</view>
				<view class="btn-list">
					<button type="default" hover-class="active" @tap.stop="delect(item)">{{i18n.delete}}</button>
				</view>
			</view>
		</block>
		
		
		<view class="popule" @tap.stop="showPopule=!showPopule" v-if="showPopule" :class="{'animated bounceInUp fast':showPopule}">
			<view class="popule-content" @tap.stop="''">
				<view class="popule-title">{{i18n.address_list_tip}}</view>
				<view class="popule-top">
					{{i18n.remark}}：{{cur.tag}}
				</view>
				<view class="popule-cont">
					<text>{{i18n.address}}:</text> <view>{{cur.address}}</view>
				</view>
				<view class="popule-btn">
					<view class="" hover-class="active" @tap.stop="showPopule=!showPopule">{{i18n.cancel}}</view>
					<view class="" hover-class="active" @tap.stop="showPopu">{{i18n.delete}}</view>
				</view>
			</view>
		</view>
		<load v-if="laoding"></load>
	</view>
</template>

<script>
	import {pageto, showToast, fetch, forceUpdate} from '@/common/js/util.js';
	import {mapGetters, mapMutations} from 'vuex' 
	import Load from '@/components/common/load.vue';
	export default {
		components:{
			Load
		},
		data() {
			return {
				background:'#ffffff',
				showPopule:false,
				curInfo:{},
				laoding:false,
				page:1,
				lists:[],
				cur:{}
			}
		},
		computed:{
			i18n() {
				return this.$t('message')
			},
			...mapGetters(['getLoginInfo','getLangType'])
		},
		onLoad(e){
			this.curInfo = JSON.parse(e.item)
		},
		onShow() {
			forceUpdate(this.getLangType);
			this.list();
		},
		methods: {
			toAdd(){
				uni.navigateTo({
					url:`/pages/assets/add-address?item=${JSON.stringify(this.curInfo)}`
				})
			},
			...mapMutations(['setCoin']),
			select(item){
				this.setCoin(item);
				setTimeout(()=>{
					uni.navigateBack({
						delta:1
					})
				},500)
			},
			delect(item,index){
				this.cur = item;
				console.log(this.cur);
				this.cur.index = index
				this.showPopule = !this.showPopule;
			},
			showPopu(){
				this.showPopule = !this.showPopule;
				this.laoding = true;
				console.log(this.cur);
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					lang_type:this.getLangType=='chs'?1:2,
					addid:this.cur.id
				}
				fetch('/api/wallet/delAddr',data,'POST')
					.then(res=>{
						this.laoding = false;
						showToast(res.data.msg)
						if(res.data.code){
							this.lists.splice(this.cur.index,1)
						}
					})
					.catch(err=>{
						this.laoding = false;
					})
			},
			list(){
				this.laoding = true;
				
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					lang_type:this.getLangType=='chs'?1:2,
					token_id:this.curInfo.token_id,
					rows:10,
					page:this.page
				}
				this.laoding = true;
				fetch('/api/wallet/addrList',data,'POST')
					.then(res=>{
						this.laoding = false;
						let mList = res.data.data.data
						mList.filter((item,index)=>{
								return  item.title_en==this.curInfo.title_en
						})
						
						if(mList.length==0) return;
						if(res.data.code){
							this.lists = mList;
							this.page++;
						}
					})
					.catch(err=>{
						this.laoding = false;
					})
			},
			moreList(){
				this.laoding = true;
				let data = {
					id:this.getLoginInfo.id,
					token:this.getLoginInfo.token,
					lang_type:this.getLangType=='chs'?1:2,
					token_id:this.curInfo.token_id,
					rows:10,
					page:this.page
				}
				this.laoding = true;
				fetch('/api/wallet/addrList',data,'POST')
					.then(res=>{
						this.laoding = false;
						let mList = res.data.data.data
						mList.filter((item,index)=>{
								return  item.title_en==this.curInfo.title_en
						})
						if(mList==0) return;
						if(res.data.code){
							this.lists = this.lists.concat(mList);
							this.page++;
						}
					})
					.catch(err=>{
						this.laoding = false;
					})
			}
		}
	}
</script>
<style>
	page{
		background: #f6f6f6 !important;
	}
</style>
<style lang="scss" scoped>
	@import '@/common/scss/variable.scss';
	.right-nav-color{
		padding: 0 30upx 0 0;
		color: $black;
		font-size: 26rpx;
	}
	.content{
		padding: 20upx 0 20upx;
		.popule{
			position: fixed;
			top:0;  
			left:0;  
			z-index:8;  
			width:100%;  
			height:100vh;  
			background:rgba(0,0,0,0.4); 
			.popule-content{
				width: 620upx;
				margin: 0 auto;
				margin-top: 70%;
				transform: translateY(-50%);
				background-color: $white;
				border-radius: 20upx;
				overflow: hidden;
				.popule-title{
					color: #262631;
					font-size: 36upx;
					line-height: 118upx;
					border-bottom: 1upx solid #E4E6F5;
					text-align: center;
				}
				.popule-top{
					font-size: 34upx;
					color: #262631;
					margin-bottom: 26upx;
					padding: 0 30upx;
					font-weight: bold;
				}
				.popule-cont{
					padding: 0 30upx;
					color: #4A4B79;
					font-size: 26upx;
					overflow: hidden;
					border-bottom: 1upx solid #E4E6F5;
					padding-bottom: 26upx;
					text{
						display: block;
						float: left;
						width: 80upx;
					}
					view{
						float: right;
						// flex: 1;
						width: 464upx;
						word-wrap: break-word;
					}
				}
				.popule-btn{
					display: flex;
					justify-content: center;
					align-items: center;
					view{
						flex: 1;
						color: #262631;
						font-size: 36upx;
						line-height: 100upx;
						text-align: center;
						background-color: $white;
						&.active{
							background: #8884B7;
							color: #0F0C39;
						}
						&:last-of-type{
							background-color: $theme-color;
							color: $white;
						}
					}
				}
			}
		}
		.list{
			background-color: $white;
			margin-bottom: 20upx;
			.title{
				color: $page-bg-color5;
				line-height: 104upx;
				font-size: 30upx;
				padding: 0 30upx;
			}
			.adddress{
				color: #4A4B79;
				font-size: 26upx;
				overflow: hidden;
				border-bottom: 1upx solid $split-line-color2;
				padding: 0 30upx 18upx;
				text{
					display: block;
					float: left;
					width: 80upx;
				}
				view{
					float: right;
					// flex: 1;
					width: 610upx;
					word-wrap: break-word;
				}
			}
			.btn-list{
				display: flex;
				padding-bottom: 20upx;
				// align-items: center;
				justify-content : flex-end;
				text-align: right;
				button{
					width: 140upx;
					font-size: 30upx;
					height: 52upx;
					line-height: 52upx;
					background: $button-color;
					color: $white;
					margin-top: 20upx;
					margin-left: 80%;
					transform: translateX(-50%);
					&.active{
						background: #8884B7;
						color: #0F0C39;
					}
				}
			}
			
		}
	}
</style>
