<template>
	<view class="">
		<l-barrage ref="lBarrage" @end="" maxTop="20"> </l-barrage>
	</view>
</template>

<script>
	import lBarrage from '@/components/l-barrage/l-barrage.vue'
	export default {
		components:{lBarrage},
		data() {
			return {
			}
		},
		onShow(){
			this.$refs.lBarrage.start([
			    '新年到，祝福来报到：大财、小财、意外财，财源滚滚',
			    '亲情、爱情、朋友情，份份真情',
			    '官运、财运、桃花运，运运亨通',
			    '爱人、亲人、家里人，人人平安',
			    '福气多多','快乐连连','万事圆圆','微笑甜甜',
			    '一帆风顺','二龙腾飞','三羊开泰','四季平安','五福临门','六六大顺','七星高照','八方来财','九九同心','十全十美！',
			    '新年快乐',
			]);
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
