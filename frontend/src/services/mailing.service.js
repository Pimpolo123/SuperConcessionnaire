import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}/mailing/`;

class MailingService {
    sendEmail(email) {
        return axios
            .post(API_URL + 'sendemail', {
                email: email
            } , { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    setNewsletterInfos(newsletterInfos) {
        return axios
            .post(API_URL + 'setnewsletterinfos', {
                newsletterInfos: newsletterInfos
            } , { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getNewsletterInfos() {
        return axios
            .get(API_URL + 'getnewsletterinfos', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }
}

export default new MailingService();