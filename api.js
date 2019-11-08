let UserController = require('./controller/UserController');
let AdminController = require('./controller/AdminController');

/**
 * ~ 开头表示无需验证token
 */
let ApiList = {

    /*============================================================
     User相关Api
     ============================================================*/
    '~/v1/user/login':                           [UserController.login, 'username', 'password'],
    '~/v1/user/page':                            [UserController.page],
    '~/v1/user/register':                        [UserController.register, 'username', 'password'],
    '/v1/user/detail':                           [UserController.userInfo],
    '/v1/user/list':                             [UserController.userList, 'page, 1'],
	/*============================================================
	 Admin相关Api
	 ============================================================*/
	'~/v1/admin/login':                          [AdminController.login, 'username', 'password'],
	'~/v1/admin/add':                            [AdminController.adminAdd, 'username', 'password', 'nickname'],
	'/v1/admin/list':                            [AdminController.adminList, 'page, 1'],
	'/v1/admin/update':                          [AdminController.adminUpdate, 'admin_id', 'nickname'],
	'/v1/admin/delete':                          [AdminController.adminDelete, 'admin_id'],
	'/v1/admin/password-update':                 [AdminController.adminPasswordUpdate, 'admin_id', 'new_password'],
};

module.exports = ApiList;