import axios from 'axios';
import authHeader from './auth-header';


const API_URL = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}/`;

class UserService {
	getPublicContent() {
		return axios.get(API_URL + 'test/all');
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

	getUser(id) {
        return axios
            .post(API_URL + 'getuser', {
                userId: id
            },{
                headers: authHeader()
            })
            .then(response => {
                return response.data;
            });
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

	addFavorite(data) {
		return axios
			.post(API_URL + 'addfavorite', {
				userId: data.userId,
				carId: data.carId
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	getFavorites(userId) {
        return axios
            .get(API_URL + 'getfavorites', { 
                params: { userId: userId }, 
                headers: authHeader() 
            })
            .then(response => {
                return response.data;
            });
    }

	removeFavorite(data) {
		return axios
			.post(API_URL + 'removefavorite', {
				userId: data.userId,
				carId: data.carId
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	getMessagesFromUser(user) {
        return axios
            .get(API_URL + 'getmessagesfromuser', { 
                params: { userId: user.id }, 
                headers: authHeader() 
            })
            .then(response => {
                return response.data;
            });
    }

	getMessagesToUser(user) {
        return axios
            .get(API_URL + 'getmessagestouser', { 
                params: { toUserId: user.id }, 
                headers: authHeader() 
            })
            .then(response => {
                return response.data;
            });
    }

	getMessagesToRole(roleId) {
		return axios
			.get(API_URL + 'getmessagestorole', { 
				params: { toRoleId: roleId }, 
				headers: authHeader() 
			})
			.then(response => {
				return response.data;
			});
	}

	addMessage(data) {
		return axios
			.post(API_URL + 'addmessage', {
				toRoleId: data.toRoleId,
				toUserId: data.toUserId,
				content: data.content,
				responseTo: data.responseTo,
				read: false,
				type: data.type,
				isOk: data.isOk,
				pdfId: data.pdfId,
				userId: data.userId,
				carId: data.carId
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	markAsRead(messageId) {
		return axios
			.post(API_URL + 'markasread', {
				id: messageId
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	deleteMessage(messageId) {
		return axios
			.post(API_URL + 'deletemessage', {
				id: messageId
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	addTicket(data) {
		return axios
			.post(API_URL + 'addticket', {
				userId: data.userId,
				subject: data.subject,
				message: data.message
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	getTicketsForUser(userId) {
		return axios
			.get(API_URL + 'getticketsforuser', { 
				params: { userId: userId }, 
				headers: authHeader() 
			})
			.then(response => {
				return response.data;
			});
	}

	addMessageToTicket(message) {
		return axios
			.post(API_URL + 'addmessagetoticket', {
				ticketId: message.ticketId,
				content: message.content,
				userId: message.userId,
				adminResponded: message.adminResponded
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	getTicket(ticketId) {
		return axios
			.get(API_URL + 'getticket', {
				params: { ticketId: ticketId }, 
				headers: authHeader() 
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	deleteTicket(ticketId) {
		return axios
			.post(API_URL + 'deleteticket', {
				ticketId: ticketId
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}

	setPreferences(data) {
		return axios
			.post(API_URL + 'setpreferences', {
				userId: data.userId,
				emailPriceChange: data.emailPriceChange,
				emailCarSold: data.emailCarSold,
				emailBidWon: data.emailBidWon,
			},{ 
				headers: authHeader()
			}).then(res => {
				return res.data;
			});
	}
}

export default new UserService();