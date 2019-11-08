const mongoose = require('mongoose');
let Util = require('../../lib/util');
let LibConst = require('../../lib/const');

let AdminSchema = mongoose.Schema({
	username: {type: String, index: true},
	password: {type: String},
	nickname: {type: String},
	last_login_time: {type: Number, default: 0},
	weight: {type: Number, default: 0},                       					 //权重
	create_time: {type: Number, default: Math.floor(Date.now() / 1000)},         //创建时间
	update_time: {type: Number, default: Math.floor(Date.now() / 1000)}          //更新时间
}, {
	collection: 'admin'
});

let Admin = mongoose.model('admin', AdminSchema);

Admin.basicAttributes = ['username', 'nickname', 'last_login_time', 'create_time'];
Admin.detailAttributes = ['username', 'password', 'nickname', 'weight', 'create_time', 'update_time'];

Admin.processModel = (model, keys) => {
	model = Util.formatModel(model, keys);

	if (model) {
	}

	return model;
};


Admin.findByIdOrFail = (id) => {
	let query = {
		_id: id,
		weight: {$gte: LibConst.WEIGHT_NORMAL}
	};

	return Admin.findOne(query).exec()
		.then(admin => {
			if (!admin) {
				return Promise.reject(Util.makeError(LibConst.ERROR.ERROR_NOT_EXIST, '管理员不存在'));
			}

			return Promise.resolve(admin);
		});
};

const Const = {
	STATUS_INVALID: 0,
	STATUS_VALID: 1
};

module.exports = Admin;
module.exports.Const = Const;