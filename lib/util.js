let crypto = require('crypto');
let _ = require('lodash');

function isPhoneNumber(val) {
	let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    return (reg.test(val));
}

function md5(content) {
	let hasher = crypto.createHash("md5");
    hasher.update(content);
    return hasher.digest('hex');
}

function makeError(code, message)
{
    return {
        code: code,
        message: message
    }
}

function parseApiKey(key) {
	let [part1, part2] = key.split(',').map(item => _.trim(item));
    return {
        key: part1,
        defaultValue: part2
    };
}

function formatModel(model, keys) {
    if (!(keys instanceof Array) || keys.length == 0)
    {
        return null;
    }

	let object = {};
    keys.forEach(key => {
        object[key] = key in model ? model[key] : null;
    });

    if (model instanceof require('mongoose').Document)
    {
        object['id'] = model.id;
    }

    return object;
}

function formatModelList(modelList, func, keys) {
    if (!(modelList instanceof Array) || keys.length == 0)
    {
        return null;
    }

    return modelList.map(model => func(model, keys));
}

function getFormattedJson(object) {
	if (object instanceof Error)
	{
		return JSON.stringify({ message: object.message, stack: split(object.stack, "\n") }, null, 4)
	}

	return JSON.stringify(object, null, 4);
}

let Util = {
	merge: _.merge,
	trim: _.trim,
	trimEnd: _.trimEnd,

    isPhoneNumber: isPhoneNumber,
    md5: md5,
    parseApiKey: parseApiKey,
    makeError: makeError,
    formatModel: formatModel,
    formatModelList: formatModelList,

	getFormattedJson: getFormattedJson
};

module.exports = Util;