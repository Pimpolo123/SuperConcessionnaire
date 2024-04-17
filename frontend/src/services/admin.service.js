import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}/admin/`;

class AdminService {
    getAllUsers() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        return axios
            .post(API_URL + 'getallusers', {
                userId: currentUser.id
            } , { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    editProfile(user) {
		return axios
			.post(API_URL + 'editprofile', {
				username: user.username,
				email: user.email,
				birthdate: user.birthdate,
				phonenumber: user.phonenumber,
				name: user.name,
				surname: user.surname,
                roles: user.roles
			},{
				headers: authHeader(user.accessToken)
			}).then(response => {
				return response.data;
			});
	}
}

export default new AdminService();