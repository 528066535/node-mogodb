const mongoose = require('mongoose');

let TokenSchema = mongoose.Schema({
    token: {type: String},
    user_id: {type: String},
	user_type: {type: Number},
    expire_time: {type: Number, default: 0},
    create_time: {type: Number, default: Math.floor(Date.now() / 1000)},      //创建时间
    update_time: {type: Number, default: Math.floor(Date.now() / 1000)}       //更新时间
}, {
    collection: 'token'
});

let Token = mongoose.model('token', TokenSchema);

module.exports = Token;