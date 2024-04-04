import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/';

class UserService {
	getPublicContent() {
		return axios.get(API_URL + 'test/all');
	}

	getUserBoard() {
		return axios.get(API_URL + 'test/user', { headers: authHeader() });
	}

	getModeratorBoard() {
		return axios.get(API_URL + 'test/mod', { headers: authHeader() });
	}

	getAdminBoard() {
		return axios.get(API_URL + 'test/admin', { headers: authHeader() });
	}

	editProfile(user, newpassword) {
		return axios
			.post(API_URL + 'editprofile', {
				username: user.username,
				email: user.email,
				password: user.password,
				birthdate: user.birthdate,
				name: user.name,
				surname: user.surname,
				newpassword: newpassword,
			},{
				headers: authHeader(user.accessToken)
			}).then(response => {
				console.log(response)
				if (response.data) {
					localStorage.setItem('user', JSON.stringify(response.data));
				}
				return response.data;
			});
	}
}

export default new UserService();