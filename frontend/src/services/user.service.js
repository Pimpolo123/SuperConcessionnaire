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

	deleteUser(data) {
		return axios
			.post(API_URL + 'deleteuser', {
				id: data.id
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	getAdminBoard() {
		return axios.get(API_URL + 'admin/board', { headers: authHeader() });
	}

	getCountryList(){
		return axios.get(API_URL + 'getcountrylist', { headers: authHeader() });
	}

	uploadPicture(pictureObject){
		var formData = new FormData();
		formData.append("file", pictureObject.file);
		formData.append("username", pictureObject.username);
		return axios
			.post(API_URL + 'uploadpicture', formData, { 
					headers: authHeader(), 'Content-Type': 'multipart/form-data'
				}).then(res => {
					return res.data;
				});
	}

	getRegionList(data){
		return axios
			.post(API_URL + 'getregionlist', {
				id: data.id
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	editAddress(user) {
		return axios
			.post(API_URL + 'editaddress', {
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
					password: user.password,
					birthdate: user.birthdate,
					name: user.name,
					surname: user.surname
				},
				address: {
					country: user.address.country,
					region: user.address.region,
					city: user.address.city,
					postcode: user.address.postcode,
					street: user.address.street,
					housenumber: user.address.housenumber,
					boxnumber: user.address.boxnumber
				}
			},{
				headers: authHeader(user.accessToken)
			}).then(response => {
				if (response.data) {
					localStorage.setItem('user', JSON.stringify(response.data));
				}
				return response.data;
			});
	}

	editProfile(user, newpassword) {
		return axios
			.post(API_URL + 'editprofile', {
				username: user.username,
				email: user.email,
				password: user.password,
				birthdate: user.birthdate,
				phonenumber: user.phonenumber,
				name: user.name,
				surname: user.surname,
				newpassword: newpassword,
			},{
				headers: authHeader(user.accessToken)
			}).then(response => {
				if (response.data) {
					localStorage.setItem('user', JSON.stringify(response.data));
				}
				return response.data;
			});
	}
}

export default new UserService();