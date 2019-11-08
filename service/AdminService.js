let Util = require('../lib/util');
let Const = require('../lib/const');

let Admin = require('../model/mongo/admin');
let TokenService = require('./TokenService');

function login(username, password) {
	let query = {
		username: username.toString(),
		weight: { $gte: Const.WEIGHT_NORMAL }
	};

	let adminMap;

	return Admin.findOne(query).exec()
		.then(doc => {
			if (!doc) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_EXIST, '管理员不存在'));
			}

			if (Util.md5(password) !== doc.password) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_EXIST, '密码错误'))
			}

			doc.last_login_time = Math.floor(Date.now() / 1000);

			return doc.save();
		})
		.then(admin => {
			adminMap = {
				admin_id: admin._id,
				username: admin.username,
				nickname: admin.nickname
			};

			return TokenService.makeToken(admin._id, Const.USER_TYPE_ADMIN);
		})
		.then(token => {
			return {
				admin: adminMap,
				token: token
			};
		})
}

function addAdmin(username, password, nickname) {
	let query = {
		username: username,
		weight: { $gte: Const.WEIGHT_NORMAL }
	};
	return Admin.findOne(query).exec()
		.then(doc => {
			if (doc) {
				return Promise.reject(Util.makeError(Const.ERROR.ERROR_ALREADY_EXISTS, '管理员已存在'));
			}

			let adminModel = {
				username: username,
				password: Util.md5(password.toString()),
				nickname: nickname ? nickname : username,
			};

			return Admin.create(adminModel);
		});
}

function updateAdmin(adminId, nickname) {
	return Admin.findByIdOrFail(adminId)
		.then(doc => {
			doc.nickname = nickname;
			return doc.save();
		})
}

function getAdminList(page) {
	let query = {
		weight: { $gte: Const.WEIGHT_NORMAL }
	};

	page = page < 1 ? 1 : page;
	let limit = Const.PAGE_SIZE;
	let offset = (page - 1) * limit;
	let resultList;

	return Admin.find(query)
		.skip(offset)
		.limit(limit)
		.sort({create_time: -1})
		.exec()
		.then(docs => {
			return Util.formatModelList(docs, Admin.processModel, Admin.basicAttributes);
		})
		.then(list => {
			resultList = list;
			return Admin.count(query);
		})
		.then(count => {
			return {
				count: count,
				list: resultList
			};
		});
}

function deleteAdmin(adminId) {
	return Admin.findByIdOrFail(adminId)
		.then(doc => {
			doc.weight = Const.WEIGHT_DELETE;
			return doc.save();
		})
}

function updateAdminPassword(adminId, newPassword) {
	return Admin.findByIdOrFail(adminId)
		.then(doc => {
			doc.password = Util.md5(newPassword.toString());
			return doc.save();
		});
}

module.exports = {
	login: login,
	addAdmin: addAdmin,
	updateAdmin: updateAdmin,
	getAdminList: getAdminList,
	deleteAdmin: deleteAdmin,
	updateAdminPassword: updateAdminPassword
};