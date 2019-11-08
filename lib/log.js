const Config = require('./config.js');

const LOG_LEVEL_DEBUG = 5;
const LOG_LEVEL_TRACE = 4;
const LOG_LEVEL_INFO = 3;
const LOG_LEVEL_WARN = 2;
const LOG_LEVEL_ERROR = 1;

const LevelMap = {
    error: LOG_LEVEL_ERROR,
    warn: LOG_LEVEL_WARN,
    info: LOG_LEVEL_INFO,
    trace: LOG_LEVEL_TRACE,
    debug: LOG_LEVEL_DEBUG
};

function getLevelName(level)
{
    for (let i in LevelMap)
    {
        if (LevelMap.hasOwnProperty(i))
        {
			let l = LevelMap[i];
            if (l == level)
            {
                return i;
            }
        }
    }

    return '';
}

function rawLog()
{
	let configLevel = Config.LOG_LEVEL.toLowerCase();
    configLevel = LevelMap.hasOwnProperty(configLevel) ? LevelMap[configLevel] : LOG_LEVEL_INFO;

	let args = Array.prototype.slice.call(arguments);
	let level = args.shift();
	let levelName = getLevelName(level);

    if (level > configLevel)
    {
        return;
    }

    args.unshift(`[${levelName}]`);
    args.unshift(new Date().toString());
    console.log.apply(null, args);
}

function debug(){
	let args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_LEVEL_DEBUG);
    rawLog.apply(null, args);
}

function trace(){
	let args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_LEVEL_TRACE);
    rawLog.apply(null, args);
}

function info(){
	let args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_LEVEL_INFO);
    rawLog.apply(null, args);
}

function warn(){
	let args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_LEVEL_WARN);
    rawLog.apply(null, args);
}

function error(){
	let args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_LEVEL_ERROR);
    rawLog.apply(null, args);
}

let log = {
    debug: debug,
    d: debug,

    info: info,
    i: info,

    warn: warn,
    w: warn,

    error: error,
    e: error,

    trace: trace,
    t: trace
};

module.exports = log;