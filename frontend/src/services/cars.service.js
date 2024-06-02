import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}/cars/`;

class CarsService {
    getAllCars() {
        return axios
            .get(API_URL + 'getallcars', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getCar(id) {
        return axios
            .get(API_URL + 'getcar', { 
                params: { id: id }, 
                headers: authHeader() 
            })
            .then(response => {
                return response.data;
            });
    }

    deleteCar(id) {
        return axios
            .get(API_URL + 'deletecar', { 
                params: { id: id }, 
                headers: authHeader() 
            })
            .then(response => {
                return response.data;
            });
    }

    deleteCars(carList) {
        return axios
            .post(API_URL + 'deletecars', {
                cars: carList
            },{
                headers: authHeader()
            })
            .then(response => {
                return response.data;
            });
    }

    addCar(car) {
        var formData = new FormData();
        car.imageFiles.forEach(file => {
            formData.append("files", file);
        });
        formData.append("car", JSON.stringify(car));
        return axios
            .post(API_URL + 'addcar', formData, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    editCar(car) {
        var formData = new FormData();
        car.imageFiles.forEach(file => {
            formData.append("files", file);
        });
        formData.append("car", JSON.stringify(car));
        return axios
            .post(API_URL + 'editcar', formData, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllMakes() {
        return axios
            .get(API_URL + 'getallmakes', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getModels(makeId) {
        return axios
            .get(API_URL + 'getmodels', { 
                params: { makeId: makeId }, 
                headers: authHeader() 
            })
            .then(response => {
                return response.data;
            });
    }

    setBid(infos) {
        return axios
            .post(API_URL + 'setbid', infos, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }


    getAllCategories() {
        return axios
            .get(API_URL + 'getallcategories', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllAdmissionTypes() {
        return axios
            .get(API_URL + 'getalladmissiontypes', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllColors() {
        return axios
            .get(API_URL + 'getallcolors', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllDrivetrains() {
        return axios
            .get(API_URL + 'getalldrivetrains', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllFuelTypes() {
        return axios
            .get(API_URL + 'getallfueltypes', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllGearboxTypes() {
        return axios
            .get(API_URL + 'getallgearboxtypes', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllEuros() {
        return axios
            .get(API_URL + 'getalleuros', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getAllOptions() {
        return axios
            .get(API_URL + 'getalloptions', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }
}

export default new CarsService();