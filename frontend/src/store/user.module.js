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
					commit('editSuccess');
					return Promise.resolve(countries);
				},
				error => {
					commit('editFailure');
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