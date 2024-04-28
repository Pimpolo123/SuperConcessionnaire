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

    addCar(car) {
        var formData = new FormData();
		formData.append("files", car.files);
        formData.append("car", car);
		// formData.append("power", car.power);
        // formData.append("year", car.year);
        // formData.append("price", car.price);
        // formData.append("description", car.description);
        // formData.append("firstReg", car.firstReg);
        // formData.append("displacement", car.displacement);
        // formData.append("gears", car.gears);
        // formData.append("cylinders", car.cylinders);
        // formData.append("doors", car.doors);
        // formData.append("co2", car.co2);
        // formData.append("urbanCons", car.urbanCons);
        // formData.append("mixCons", car.mixCons);
        // formData.append("hwCons", car.hwCons);
        // formData.append("makeId", car.makeId);
        // formData.append("modelId", car.modelId);
        // formData.append("admissiontypeId", car.admissiontypeId);
        // formData.append("categoryId", car.categoryId);
        // formData.append("colorId", car.colorId);
        // formData.append("gearboxtypeId", car.gearboxtypeId);
        // formData.append("fueltypeId", car.fueltypeId);
        // formData.append("drivetrainId", car.drivetrainId);
        // formData.append("euroId", car.euroId);
        return axios
            .post(API_URL + 'addcar', formData, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }
}

export default new CarsService();