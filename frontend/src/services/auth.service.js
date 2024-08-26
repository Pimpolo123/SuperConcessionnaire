import axios from 'axios';
import io from 'socket.io-client';
const socket = io(`http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}`);

const API_URL = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}/auth/`;

socket.on('openChat', () => {
  console.log('openChat');
  localStorage.setItem('isAdminConnected', true);
});
class AuthService {
	login(user) {
		return axios
			.post(API_URL + 'signin', {
				email: user.email,
				username: user.username,
				password: user.password
			})
			.then(response => {
				if (response.data.accessToken) {
					localStorage.setItem('user', JSON.stringify(response.data));
					socket.emit('authenticated', response.data);
				}
				return response.data;
			});
	}

	logout() {
		socket.emit('logout', JSON.parse(localStorage.getItem('user')));
		localStorage.removeItem('user');
	}

	disconnect() {
		socket.emit('disconnected', JSON.parse(localStorage.getItem('user')));
	}

	connect(user) {
		socket.emit('authenticated', user);
	}

	register(user) {
		return axios
			.post(API_URL + 'signup', {
				username: user.username,
				email: user.email,
				password: user.password,
				birthdate: user.birthdate,
				name: user.name,
				surname: user.surname,
				phonenumber: user.phonenumber,
				roles: user.roles,
				emailoptin: user.emailoptin
		});
	}
}

export default new AuthService();