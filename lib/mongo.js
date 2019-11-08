const mongoose = require('mongoose');

let Config = require('./config');
let Log = require('./log');

let Mongo = {
	init: () => {
		mongoose.connect(Config.MONGO_CONNECT_URI, Config.MONGO_CONNECT_OPTION, function (error) {
			if (error) {
				Log.e(error);
			}
		});
	}
};

module.exports = Mongo;

