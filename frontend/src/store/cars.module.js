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
        getcar({ commit }, id) {
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
        },
        editcar({ commit }, car) {
            return CarsService.editCar(car).then(
                car => {
                    return Promise.resolve(car);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        deletecar({ commit }, id) {
            return CarsService.deleteCar(id).then(
                res => {
                    return Promise.resolve(res);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        deletecars({ commit }, cars) {
            return CarsService.deleteCars(cars).then(
                car => {
                    return Promise.resolve(car);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getallmakes({ commit }) {
            return CarsService.getAllMakes().then(
                makes => {
                    return Promise.resolve(makes);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getmodels({ commit }, makeId) {
            return CarsService.getModels(makeId).then(
                models => {
                    return Promise.resolve(models);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getallcategories({ commit }) {
            return CarsService.getAllCategories().then(
                categories => {
                    return Promise.resolve(categories);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getalladmissiontypes({ commit }) {
            return CarsService.getAllAdmissionTypes().then(
                admissiontypes => {
                    return Promise.resolve(admissiontypes);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getallcolors({ commit }) {
            return CarsService.getAllColors().then(
                colors => {
                    return Promise.resolve(colors);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getalldrivetrains({ commit }) {
            return CarsService.getAllDrivetrains().then(
                drivetrains => {
                    return Promise.resolve(drivetrains);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getallfueltypes({ commit }) {
            return CarsService.getAllFuelTypes().then(
                fueltypes => {
                    return Promise.resolve(fueltypes);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getalloptions({ commit }) {
            return CarsService.getAllOptions().then(
                options => {
                    return Promise.resolve(options);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getallgearboxtypes({ commit }) {
            return CarsService.getAllGearboxTypes().then(
                gearboxtypes => {
                    return Promise.resolve(gearboxtypes);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getalleuros({ commit }) {
            return CarsService.getAllEuros().then(
                euros => {
                    return Promise.resolve(euros);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
    }
};