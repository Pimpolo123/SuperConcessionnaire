import CarsService from '../services/cars.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const cars = {
    namespaced: true,
    state: initialState,
    actions: {
        getallcars({ commit }) {
            return CarsService.getAllCars().then(
                cars => {
                    return Promise.resolve(cars);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getcars({ commit }, id) {
            return CarsService.getCar(id).then(
                cars => {
                    return Promise.resolve(cars);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        addcar({ commit }, car) {
            return CarsService.addCar(car).then(
                car => {
                    return Promise.resolve(car);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        }
    }
};