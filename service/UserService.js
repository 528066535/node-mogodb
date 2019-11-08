let Util = require('../lib/util');
let Const = require('../lib/const');

let User = require('../model/mongo/user');
let Token = require('../model/mongo/token');
let TokenService = require('./TokenService');

let Log = require('../lib/log');

function page() {
	Log.d(2);
	return {
		page: 1,
		pageSize: 30,
		rows: [
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
			{id: 43,col:{name:'123',id:43}},
		],
		total:31
	}
}

function login(username, password) {
	let userModel;

	let query = {
		username: username.toString(),
		weight: {$gte: Const.WEIGHT_NORMAL}
	};

	return User.findOne(query).exec()
		.then((user) => {
			if (!user) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_EXIST, '用户不存在'));
			}

			if (Util.md5(password) !== user.password) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_EXIST, '密码错误'))
			}

			user.last_login_time = Math.floor(Date.now() / 1000);
			return user.save();
		})
		.then((user) => {
			user = user._doc;
			delete user.password;
			delete user.__v;

			userModel = user;
			return TokenService.makeToken(user._id, Const.USER_TYPE_CLIENT);
		})
		.then((token) => {
			return {
				token: token,
				user: userModel
			};
		});
}

function register(username, password) {
	return User.findOne({username: username}).exec()
		.then((user) => {
			if (user) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_ALREADY_EXISTS, '电话号已经被注册，请登录'));
			}

			let userModel = {
				username: username,
				password: Util.md5(password.toString())
			};

			return User.create(userModel);
		}).then((user) => {
			return User.processModel(user, User.detailAttributes);
		}).then((user) => {
			return {
				user: user
			};
		});
}

function getUserByToken(token) {
	let query = {
		token: token
	};

	return Token.findOne(query)
		.then((data) => {
			let userId = data.user_id;

			return User.findByIdOrFail(userId);
		})
}

function getUserList(page) {
	let query = {
		weight: {$gte: Const.WEIGHT_NORMAL}
	};

	page = page < 1 ? 1 : page;
	let limit = Const.PAGE_SIZE;
	let offset = (page - 1) * limit;
	let resultList;

	return User.find(query)
		.skip(offset)
		.limit(limit)
		.sort({create_time: -1})
		.exec()
		.then(docs => {
			return Util.formatModelList(docs, User.processModel, User.basicAttributes);
		})
		.then(list => {
			resultList = list;
			return User.count(query);
		})
		.then(count => {
			return {
				count: count,
				list: resultList
			};
		});
}

function getUserInfo(userId) {
	let user = User.findByIdOrFail(userId);
	return user.then(res => {
		return {
			user: User.processModel(res, User.detailAttributes)
		}
	})
}

module.exports = {
	page: page,
	login: login,
	register: register,
	getUserByToken: getUserByToken,
	getUserList: getUserList,
	getUserInfo: getUserInfo
};