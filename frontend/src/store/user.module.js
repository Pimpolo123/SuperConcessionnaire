import UserService from '../services/user.service';

const currentUser = JSON.parse(localStorage.getItem('user'));
const initialState = currentUser
  ? { status: { edited: true }, currentUser }
  : { status: { edited: false }, currentUser: null };

export const user = {
	namespaced: true,
	state: initialState,
	actions: {
		editprofile({ commit }, data) {
			return UserService.editProfile(data.user, data.newpassword).then(
				user => {
					commit('editSuccess', user);
					return Promise.resolve(user);
				},
				error => {
					commit('editFailure');
					return Promise.reject(error);
				}
			);
		},
		editaddress({ commit }, data) {
			return UserService.editAddress(data).then(
				user=> {
					commit('editSuccess', user);
					return Promise.resolve(user);
				},
				error => {
					commit('editFailure');
					return Promise.reject(error);
				}
			)
		},
		getcountrylist({ commit }) {
			return UserService.getCountryList().then(
				countries => {
					return Promise.resolve(countries);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getuser({ commit }, id) {
			return UserService.getUser(id).then(
				user => {
					return Promise.resolve(user);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getregionlist({ commit }, data) {
			return UserService.getRegionList(data).then(
				regions => {
					return Promise.resolve(regions);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		uploadpicture({ commit }, pictureObject) {
			return UserService.uploadPicture(pictureObject).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		deleteuser({ commit }, data) {
			return UserService.deleteUser(data).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		addfavorite({ commit }, data) {
			return UserService.addFavorite(data).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getfavorites({ commit }, userId) {
			return UserService.getFavorites(userId).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		removefavorite({ commit }, data) {
			return UserService.removeFavorite(data).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getmessagestouser({ commit }, user) {
			return UserService.getMessagesToUser(user).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getmessagesfromuser({ commit }, user) {
			return UserService.getMessagesFromUser(user).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		getmessagestorole({ commit }, roleId) {
			return UserService.getMessagesToRole(roleId).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		addmessage({ commit }, data) {
			return UserService.addMessage(data).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		markasread({ commit }, data) {
			return UserService.markAsRead(data).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		},
		deletemessage({ commit }, data) {
			return UserService.deleteMessage(data).then(
				res => {
					return Promise.resolve(res);
				},
				error => {
					return Promise.reject(error);
				}
			)
		}
	},
	mutations: {
		editSuccess(state, user) {
			state.status.edited = true;
			state.currentUser = currentUser;
		},
		editFailure(state) {
			state.status.edited = false;
			state.currentUser = null;
		}
	}
};