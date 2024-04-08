import axios from 'axios';

const API_URL = 'http://localhost:8080/auth/';

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
            }
            return response.data;
        });
  }

  logout() {
    localStorage.removeItem('user');
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
            phonenumber: user.phonenumber
    });
  }
}

export default new AuthService();