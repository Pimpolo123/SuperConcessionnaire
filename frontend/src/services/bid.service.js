import axios from 'axios';
import authHeader from './auth-header';

const API_URL = `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_PORT_BACK}/bid/`;

class BidService {
    getAllBids() {
        return axios
            .get(API_URL + 'getallbids', { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    getBid(carId) {
        return axios
            .get(API_URL + 'getbid', { 
                params: { carId: carId }, 
                headers: authHeader() 
            })
            .then(response => {
                return response.data;
            });
    }

    addBid(bid) {
        return axios
            .post(API_URL + 'addbid', bid, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }
}

export default new BidService();