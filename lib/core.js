let Const = require('./const');
let Log = require('./log');
let Util = require('./util');

let Core = {
	ACTION: null,
    FUNCTION_GET_USER_BY_TOKEN: null,

    initContext: (req, res, next) => {
		let Context = {
            request: req,
            response: res,
            params: Util.merge(req.query, req.body),
            next: next,
            user: undefined,

            update: function ()
            {
                Context.params = Util.merge(Context.request.query, Context.request.params, Context.request.body);
                return Context;
            },

            errorFinish: function (code, message)
            {
                Context.response.json({
                    code: code,
                    message: message
                }).end();
            },

            finish: function (data)
            {
				let object = {
					code: 0,
				};

				if (data) {
					object.data = data;
				}
				Context.response.json(object).end();
            },

            processError: function (error)
            {
                if (error.hasOwnProperty('code') && error.hasOwnProperty('message'))
                {
                    return Context.errorFinish(error.code, error.message);
                }

                Context.errorFinish(Const.ERROR.ERROR_NOT_FOUND, '' + error);
            },

            canGuestAccess: function (route)
            {
                let action =  Core.getAction(route);
                return action && action.canGuestAccess;
            },
        };

        return Context;
    },

    auth: (context) => {
		let request = context.request;

        if (context.canGuestAccess(request.path))
        {
            return Promise.resolve();
        }
        if (request.body.token === undefined)
        {
            context.errorFinish(Const.ERROR.ERROR_NOT_AUTHORIZED, 'not authorized');
            return Promise.reject();
        }

		let token = context.params.token;
		if (typeof Core.FUNCTION_GET_USER_BY_TOKEN === "function")
		{
			return Core.FUNCTION_GET_USER_BY_TOKEN(token).then((user) =>
			{
				context.user = user;
			});
		}
		else
		{
			return Promise.reject(Util.makeError(Const.ERROR.ERROR_NOT_AUTHORIZED, 'auth service not defined'));
		}
    },

	install: (router, actionMap, getUserByTokenFunc) => {
		Core.FUNCTION_GET_USER_BY_TOKEN = getUserByTokenFunc;
		let ACTION = {};

		for (let route in actionMap)
		{
			if (actionMap.hasOwnProperty(route))
			{
				let canGuestAccess = route.startsWith('~');
				let action = actionMap[route];
				let func = action[0];
				let arg = action.slice(1);

				let argList = [];
				for (let i = 0; i < arg.length; i++)
				{
					argList.push(Util.parseApiKey(arg[i]));
				}

				route = Util.trim(route, '~');

				ACTION[route] = {
					func: func,
					argList: argList,
					canGuestAccess: canGuestAccess
				};

				router.get(route, Core.runAction);
				router.post(route, Core.runAction);
			}
		}
		Core.ACTION = ACTION;
	},

    hasAction: (route) => {
        return Core.ACTION.hasOwnProperty(route);
    },

    getAction: (route) => {
        return Core.ACTION[route];
    },

    runAction: (req, res, next) => {
		let path = req.route.path;
        path = Util.trimEnd(path, '/');

		Log.d("********* request data start *********");
		Log.d(Util.getFormattedJson({
			path: path,
			params: Util.merge(req.query, req.params, req.body)
		}));
		Log.d("********* request data end *********");

        if (Core.hasAction(path))
        {
			let context = Core.initContext(req, res, next);
            context = context.update();
            Core.auth(context).then(() =>
            {
				let {func, argList} = Core.getAction(path);
				let params = [context];
                for (let i = 0; i < argList.length; i++)
                {
					let {key, defaultValue} = argList[i];
					let value = undefined;
                    if (context.params.hasOwnProperty(key))
                    {
                        value = context.params[key];
                    }
                    else
                    {
                        if (defaultValue === undefined)
                        {
                            return context.errorFinish(Const.ERROR.ERROR_PARAM_NOT_SET, `param ${key} not set`);
                        }

                        value = defaultValue;
                    }

                    params.push(value);
                }
                func.apply(null, params);
            }).catch(context.processError);
        }
        else
        {
            next();
        }
    },

    errorHandler: (err, req, res, next) => {
        console.log(err);
        res.status(500).json({
            code: Const.ERROR.ERROR_INTERNAL_SERVER,
            message: 'an internal error occurred'
        }).end();
    },

    notFoundHandler: (req, res) => {
        res.status(404).json({
            code: Const.ERROR.ERROR_NOT_FOUND,
            message: 'not found'
        }).end();
    }
};

Core.Const = Const;
Core.Log = Log;
Core.Util = Util;

module.exports = Core;
