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

    banUser(user) {
		return axios
			.post(API_URL + 'banuser', {
				id: user.id,
                banned: user.banned
			},{
				headers: authHeader(user.accessToken)
			}).then(response => {
				return response.data;
			});
	}

    deleteUser(user) {
		return axios
			.post(API_URL + 'deleteuser', {
				id: user.id,
			},{
				headers: authHeader(user.accessToken)
			}).then(response => {
				return response.data;
			});
	}

    editAddress(data) {
        console.log(data);
		return axios
			.post(API_URL + 'editaddress', {
                user: {
                    username: data.user.username,
                    email: data.user.email,
                    birthdate: data.user.birthdate,
                    phonenumber: data.user.phonenumber,
                    name: data.user.name,
                    surname: data.user.surname,
                    password: data.user.password,
                    roles: data.user.roles
                },
                address: {
                    country: data.address.country,
                    region: data.address.region,
                    city: data.address.city,
                    postcode: data.address.postcode,
                    street: data.address.street,
                    housenumber: data.address.housenumber,
                    boxnumber: data.address.boxnumber,
                }
			},{
				headers: authHeader(data.accessToken)
			}).then(response => {
				return response.data;
			});
	}

	updateDealerInformations(data) {
		return axios
			.post(API_URL + 'updatedealerinformations', {
				dealershipName: data.dealershipName,
				bankAccount: data.bankAccount,
				country: data.country,
				region: data.region,
				postcode: data.postcode,
				city: data.city,
				street: data.street,
				number: data.number,
				phoneNumber: data.phoneNumber
			},{
				headers: authHeader(data.accessToken)
			}).then(response => {
				return response.data;
			});
	}

	getDealerInformations() {
		return axios
			.get(API_URL + 'getdealerinformations', {
				headers: authHeader()
			}).then(response => {
				return response.data;
			});
	}

	addPdfInfos(data) {
		return axios
			.post(API_URL + 'addpdfinfos', {
				fileName: data.fileName,
				dealershipName: data.dealershipName,
				deliveryDate: data.deliveryDate,
				promiseDate: data.promiseDate,
				promiseLocation: data.promiseLocation,
				deposit: data.deposit,
				bankAccount: data.bankAccount,
				userId: data.userId,
				carId: data.carId
			},{
				headers: authHeader()
			}).then(response => {
				return response.data;
			});
	}

	generatePDF(pdfId) {
		return axios
			.post(API_URL + 'downloadpdf', {
				id: pdfId
			},{
				headers: authHeader(),
				responseType: 'blob'
			}).then(response => {
				return response;
			});
	}

	getAllTickets() {
		return axios
			.get(API_URL + 'getalltickets', {
				headers: authHeader()
			}).then(response => {
				return response.data;
			});
	}
}

export default new AdminService();