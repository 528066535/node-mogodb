let Const = {

    END_POINT: 3000,

    ERROR: {
        ERROR_NOT_AUTHORIZED: -1,

		ERROR_NOT_FOUND: -1,
		ERROR_INTERNAL_SERVER: -2,

        ERROR_PARAM_NOT_SET: 1,
        ERROR_WRONG_PARAM: 2,
        ERROR_TOKEN_INVALID: 3,
        ERROR_NOT_EXIST: 4,
        ERROR_ALREADY_EXISTS: 5,
    },

    AUTH: 1,

	PAGE_SIZE: 20,                           //分页
	MAX_FILE_SIZE: 10 * 1024 * 1024,         //文件上传最大为10M
	USER_TYPE_CLIENT: 1,
	USER_TYPE_ADMIN: 2,

    WEIGHT_NORMAL: 0,
    WEIGHT_DELETE: -1,
};

module.exports = Const;