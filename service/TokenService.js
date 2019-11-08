const UUID = require('node-uuid');

let Util = require('../lib/util');
let Const = require('../lib/const');

let Token = require('../model/mongo/token');
let User = require('../model/mongo/user');
let Admin = require('../model/mongo/admin');

function makeToken(userId, userType) {
	let token = UUID.v1();
	token = token.replace(/-/g, '');

	let data = {
		token: token,
		user_id: userId,
		user_type: userType
	};

	return Token.create(data).then(() => {
		return token;
	});
}

function getUserByToken(token) {
	let query = {token: token};

	return Token.findOne(query)
		.exec()
		.then(res => {
			if (!res) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_TOKEN_INVALID, 'token invalid'));
			}

			let userId = res.user_id;
			let userType = res.user_type;

			if (userType === undefined) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_TOKEN_INVALID, 'token invalid'));
			}

			// 判断是管理员token还是客户端
			switch (parseInt(userType)) {
				case Const.USER_TYPE_CLIENT:
					return User.findByIdOrFail(userId);
				case Const.USER_TYPE_ADMIN:
					return Admin.findByIdOrFail(userId);
				default:
					break;
			}

			return null;
		})
}

module.exports = {
	makeToken: makeToken,
	getUserByToken: getUserByToken
};