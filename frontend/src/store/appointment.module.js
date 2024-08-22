import AppointmentService from '../services/appointment.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const appointment = {
    namespaced: true,
    state: initialState,
    actions: {
        addappointment({ commit }, appointment) {
            return AppointmentService.addAppointment(appointment).then(
                appointment => {
                    return Promise.resolve(appointment);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getall({ commit }) {
            return AppointmentService.getAll().then(
                appointments => {
                    return Promise.resolve(appointments);
                },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        setavailability({ commit }, availability) {
            return AppointmentService.setAvailability(availability).then(
                availability => {
                    return Promise.resolve(availability);
                },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getavailability({ commit }) {
            return AppointmentService.getAvailability().then(
                availability => {
                    return Promise.resolve(availability);
                },
                error => {
                    return Promise.reject(error);
                }
            );
        }
    }
};