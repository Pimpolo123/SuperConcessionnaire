import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/admin/';

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
}

export default new AdminService();