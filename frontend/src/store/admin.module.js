import AdminService from '../services/admin.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const admin = {
    namespaced: true,
    state: initialState,
    actions: {
        getallusers({ commit }) {
            return AdminService.getAllUsers().then(
                users => {
                    return Promise.resolve(users);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        editprofile({ commit }, data) {
			return AdminService.editProfile(data).then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
        editaddress({ commit }, data) {
			return AdminService.editAddress(data).then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
        deleteuser({ commit }, user) {
			return AdminService.deleteUser(user).then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
        banuser({ commit }, user) {
			return AdminService.banUser(user).then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		updatedealerinformations({ commit }, data) {
			return AdminService.updateDealerInformations(data).then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getdealerinformations({ commit }) {
			return AdminService.getDealerInformations().then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		addpdfinfos({ commit }, data) {
			return AdminService.addPdfInfos(data).then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		generatepdf({ commit }, pdfId) {
			return AdminService.generatePDF(pdfId).then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getalltickets({ commit }) {
			return AdminService.getAllTickets().then(
				data=> {
					return Promise.resolve(data);
				},
				error => {
					return Promise.reject(error);
				}
			)
		}
    }
};