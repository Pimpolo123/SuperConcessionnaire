import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/admin/';

class AdminService {
    getAllUsers() {
        return axios
            .get(API_URL + 'getallusers', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }
}

export default new AdminService();