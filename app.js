let Log = require('./lib/log');
let Core = require('./lib/core');
let ActionMap = require('./api');
let Const = require('./lib/const');

let Mongo           = require('./lib/mongo');

let TokenService  = require('./service/tokenService');

let express = require('express');
let app = express();
let router = express.Router();
let bodyParser = require('body-parser');

Mongo.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

Core.install(router, ActionMap, TokenService.getUserByToken);

app.use('/static', express.static('static'));

app.use(router);
app.use(Core.errorHandler);
app.use(Core.notFoundHandler);

let server = app.listen(Const.END_POINT, function () {
	let host = server.address().address;
	let port = server.address().port;
    Log.i(`app listening at http://${host}:${port}`);
});

