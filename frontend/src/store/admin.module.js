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
		}
    }
};