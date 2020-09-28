const state = {
	// requestUrl: "http://aomen.wantengex.com", ///  ant 域名
	// requestUrl: "http://www.enjoybyall.com",
	requestUrl:"http://ytc.wantengex.com",
	incode: uni.getStorageSync('code') || {code: 86, name: "中国"},
	lang_type: uni.getStorageSync('lang') || 'chs',
	area: uni.getStorageSync('area') || {},
	loginInfo: uni.getStorageSync('loginInfo') || {},
	login: uni.getStorageSync('login') || {},
	id:uni.getStorageSync('id')|| "",
	Mnemonic:uni.getStorageSync('Mnemonic')|| '',
	textArr: {
		chs: [ "首页", "币币", "资产", "我的" ],
		en: [ "Home",  "Coins", "Assets", "Mine" ]
	},
	coins:'',
	bulletin:'',
	isFirstJum:false,
	inTeam:false,
	userList:uni.getStorageSync('userList') ||[],
}
export default state