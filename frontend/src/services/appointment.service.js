import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}/appointment/`;

class AppointmentService {
    addAppointment(appointment) {
        return axios
            .post(API_URL + 'addappointment', {
                appointment: appointment
            } , { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAll() {
        return axios
            .get(API_URL + 'getall', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    setAvailability(availability) {
        return axios
            .post(API_URL + 'setavailability', {
                availability: availability
            } , { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAvailability() {
        return axios
            .get(API_URL + 'getavailability', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }
}

export default new AppointmentService();