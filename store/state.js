const state = {
	requestUrl: "http://aomen.wantengex.com", ///  ant 域名
	// requestUrl: "http://www.enjoybyall.com",
	incode: uni.getStorageSync('code') || {code: 86, name: "中国"},
	lang_type: uni.getStorageSync('lang') || 'chs',
	area: uni.getStorageSync('area') || {},
	loginInfo: uni.getStorageSync('loginInfo') || {},
	login: uni.getStorageSync('login') || {},
	textArr: {
		chs: [ "首页", "交易",  "资产", "资讯", "我的" ],
		en: [ "Home", "Transaction", "Assets", "News", "Mine" ]
	},
	coins:'',
	bulletin:''
}
export default state