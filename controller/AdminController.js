let AdminService = require('../service/AdminService');

function login(context, username, password) {
	AdminService.login(username, password)
		.then(data => context.finish(data))
		.catch(error => context.processError(error));
}

function adminAdd(context, username, password, nickname) {
	AdminService.addAdmin(username, password, nickname)
		.then(() => context.finish())
		.catch(error => context.processError(error));
}

function adminList(context, page) {
	AdminService.getAdminList(page)
		.then(data => context.finish(data))
		.catch(error => context.processError(error));
}

function adminDelete(context, adminId) {
	AdminService.deleteAdmin(adminId)
		.then(() => context.finish())
		.catch(error => context.processError(error));
}

function adminUpdate(context, adminId, nickname) {
	AdminService.updateAdmin(adminId, nickname)
		.then(() => context.finish())
		.catch(error => context.processError(error));
}

function adminPasswordUpdate(context, adminId, newPassword) {
	AdminService.updateAdminPassword(adminId, newPassword)
		.then(() => context.finish())
		.catch(error => context.processError(error));
}

let AdminController = {
	login: login,
	adminAdd: adminAdd,
	adminList: adminList,
	adminDelete: adminDelete,
	adminUpdate: adminUpdate,
	adminPasswordUpdate: adminPasswordUpdate
};

module.exports = AdminController;