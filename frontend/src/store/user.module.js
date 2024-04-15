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