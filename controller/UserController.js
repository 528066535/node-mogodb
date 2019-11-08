let UserService = require('../service/UserService');
let Log = require('../lib/log');

function page(context) {
	Log.d(1);
	let data = {
		page: 1,
		pageSize: 30,
		rows: [
			{name:'123',id:23},
			{name:'123',id:13},
			{name:'123',id:33},
			{name:'123',id:243},
			{name:'123',id:4323},
			{name:'123',id:423},
			{name:'123',id:41233},
			{name:'123',id:43},
			{name:'123',id:423},
			{name:'123',id:434},
			{name:'123',id:123},
			{name:'123',id:423},
			{name:'123',id:12},
			{name:'123',id:42},
			{name:'123',id:453},
			{name:'123',id:56},
			{name:'123',id:7},
			{name:'123',id:5},
			{name:'123',id:90},
			{name:'123',id:80},
			{name:'123',id:70},
			{name:'123',id:50},
			{name:'123',id:346},
			{name:'123',id:507},
			{name:'123',id:213123},
			{name:'123',id:214123},
			{name:'123',id:213123},
			{name:'123',id:421},
			{name:'123',id:351},
			{name:'123',id:341},
			{name:'123',id:562},
			{name:'123',id:547},
			{name:'123',id:679},
		],
		total:31
	};
	context.finish(data);
}

function login(context, username, password) {
	UserService.login(username, password)
		.then((data) => context.finish(data))
		.catch((error) => context.processError(error));
}

function register(context, username, password) {
	UserService.register(username, password)
		.then((data) => context.finish(data))
		.catch((error) => context.processError(error))
}

function userInfo(context) {
	let userId = context.user ? context.user._id : 0;
	UserService.getUserInfo(userId)
		.then(data => context.finish(data))
		.catch(error => context.processError(error));
}

function userList(context, page) {
	UserService.getUserList(page)
		.then((data) => context.finish(data))
		.catch((error) => context.processError(error));
}

let User = {
	page: page,
	login: login,
	register: register,
	userInfo: userInfo,
	userList: userList
};

module.exports = User;