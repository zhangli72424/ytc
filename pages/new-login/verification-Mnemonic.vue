<template>
	<view class="content">
		<view class="define-title">
			<view>{{i18n.Backup_tips}}</view>
			<text>{{i18n.define_mnemo_tip0}}</text>
		</view>
		<view class="define-content">
			<block v-for="(item,index) in selectList" :key="index">
				<view class="define-li " :class="[item.status==2?'other-class':item.status==1?'err-class':'',(index+1)%3==0?'no-border':'']">
					<text>{{index+1}}</text>
					<i v-if="item.data && item.status==1" class="close" @tap.stop="exit(item,index)">X</i>
					{{item.data?item.data:''}}
				</view>
			</block>
		</view>
		
		<view class="varification-content">
			<block v-for="(item,index) in list" :key="index">
				<view class="define-li " :class="{'no-border':(index+1)%3==0,'ischeck':item.ischeck}" @tap.stop="select(item,index)">
					{{item.name}}
				</view>
			</block>
		</view>
		<view class="tips-bottom-button">
			<button hover-class="active" :disabled="!isShow" :class="{'show':isShow}" @tap.stop="comfirm">立即验证</button>
		</view>
	</view>
</template>

<script>
	import Load from '../../components/common/load.vue';
	import {fetch, _updataTabBar, showToast, pageto, forceUpdate} from '@/common/js/util.js'
	import {mapGetters, mapMutations} from 'vuex' 
	export default {
		data() {
			return {
				selectList:[{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''}],
				list:[]
			};
		},
		computed:  {
			i18n() {
				return this.$t('message');
			},
			...mapGetters([
				'getRequestUrl',
				"getLoginInfo",
				'getTextArr',
				'getLangType',
				'getLang',
			]),
			isShow(){
				let list = this.selectList.filter((item,index)=>{
					return item.data==''
				})
				if(list.length==0){
					return true;
				}else{
					return false
				}
			}
		},
		onLoad(e){
			let lss = JSON.parse(e.list)
			let lsss = lss.sort(function(a, b) {
				return Math.random() > 0.5 ? -1 : 1;
			});
			var json = [];
			for (var i = 0; i < lsss.length; i++) {
				var j = {}
				j.name = lsss[i].mnemonic
				j.index = lsss[i].id
				j.order = lsss[i].order
				j.isshow = false
				j.curms = null
				// 这里还可以继续添加属性 j.属性 = 值
				json.push(j)
			}
			this.list = json
			console.log(this.list);
		},
		onShow(){
			// this.selectList=[{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''},{data:''}]
			//this.list = [{0:'earth'},{0:'earth'},{0:'eye'},{0:'mouth'},{0:'egg'},{0:'tab'},{0:'up'},{0:'down'},{0:'sister'},{0:'earth'},{0:'earth'},{0:'earth'}]
		},
		methods:{
			exit(val,index){
				this.list[this.selectList[index].index].ischeck=false
				this.selectList[index].data = '';
				this.selectList[index].status=0
				this.$forceUpdate();
			},
			select(val,index){
				console.log(val,index);
				if(this.list[index].ischeck==true){
					return
				}
				this.list[index].ischeck = true;
				for (let i = 0; i < this.selectList.length; i++) {
					if(this.selectList[i].data=='' || this.selectList[i].data==null){
						this.selectList[i].data = val.name;
						this.selectList[i].index = index;
						let op = {
							id:this.getLoginInfo.id,
							token:this.getLoginInfo.token,
							mnemonic_id:val.index,
							key:i+1,
							mnemonic:val.name
						}   
						console.log(op);
						fetch(this.getRequestUrl +'/api/index/yz_mnemonic',op,'post').then(res=>{	
							this.selectList[i].status=res.data.code+1
							this.$forceUpdate();
							if(res.data.code==1){
								if(res.data.data==0){
									
								}else{
									uni.switchTab({
										url:'/pages/index/index'
									})
								}
							}else{
								showToast(res.data.msg)
							}
						})
						.catch(err=>{
							
						})
						return;
					}
				}
				
				
			},
			comfirm(){
				let list=''
				this.selectList.forEach((item,index)=>{
					list+=item.data
				})
				console.log(list);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background-color: #FFFFFF;
		height: 100vh;
		padding: 0 30upx;
		.tips-bottom-button{
			position: fixed;
			width: 690upx;
			left: 30upx;
			bottom: 40upx;
			button{
				width: 690upx;
				line-height: 88upx;
				height: 88upx;
				color: #FFFFFF;
				background-color: #D1D1D1;
				&.show{
					background-color: #337BFD;
				}
				&.active{
					transform: scale(.9);
					opacity: .9;
				}
			}
		}
		.define-title{
			padding-top: 32upx;
			view{
				font-size: 32upx;
				color: #141414;
				font-weight: bold;
			}
			text{
				margin-top: 32upx;
				font-size: 26upx;
				color: #FF5050;
				display: inline-block;
			}
		}
		.varification-content{
			margin-top: 26upx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-bottom: 128upx;
			.define-li{
				width: 180upx;
				border-radius: 8upx;
				background: #F9F9F9;
				line-height: 80upx;
				position: relative;
				font-size: 32upx;
				text-align: center;
				margin-bottom: 26upx;
				&.ischeck{
					background-color: #337BFD;
					color: #FFFFFF;
				}
				text{
					position: absolute;
					right: 16upx;
					top: 0;
					font-size: 26upx;
				}
			}
		}
		.define-content{
			margin-top: 26upx;
			border: 1upx solid #DFE5FB; 
			background: #fafbff;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-radius: 10upx;
			.define-li{
				// width: 197upx;
				width: 33.3%;
				padding-top: 36upx;
				line-height: 80upx;
				position: relative;
				font-size: 32upx;
				height: 80upx;
				line-height: 80upx;
				padding-left: 32upx;
				border-bottom: 1upx solid #DFE5FB;
				border-right: 1upx solid #DFE5FB;
				&.other-class{
					background-color: #cdedff;
				}
				&.err-class{
					background-color: #ffcdcd;
				}
				&.no-border{
					border-right: none;
				}
				i{
					position: absolute;
					width: 20upx;
					height: 20upx;
					border-radius: 10upx;
					background: #f00;
					color: #fff;
					right: 74upx;
					top: 40upx;
					line-height: 20upx;
					text-align: center;
					font-size: 16upx;
				}
				text{
					position: absolute;
					right: 16upx;
					top: 0;
					font-size: 26upx;
				}
			}
		}
	}
</style>
