const mongoose = require('mongoose');
let Util = require('../../lib/util');
let LibConst = require('../../lib/const');

let UserSchema = mongoose.Schema({
    username: {type: String, index: true},              					//用户名, 手机号
    password: {type: String},                           					//登陆密码
    last_login_time: {type: Number, default: 0},        					//最近登录时间
    weight: {type: Number, default: 0},                 					//权重
    create_time: {type: Number, default: Math.floor(Date.now() / 1000)},   	//创建时间
    update_time: {type: Number, default: Math.floor(Date.now() / 1000)},   	//更新时间
}, {
    collection: 'user'
});

let User = mongoose.model('user', UserSchema);

User.basicAttributes = ['username'];
User.detailAttributes = ['username', 'last_login_time'];

User.processModel = (model, keys) => {
    model = Util.formatModel(model, keys);

    if (model) {

    }

    return model;
};

User.findByIdOrFail = (id) => {
	let query = {
		_id: id,
		weight: { $gte: LibConst.WEIGHT_NORMAL }
	};

	return User.findOne(query).exec()
		.then(user => {
			if (!user) {
				return Promise.reject(Util.makeError(LibConst.ERROR.ERROR_NOT_EXIST, '用户不存在'));
			}

			return Promise.resolve(user);
		});
};

module.exports = User;