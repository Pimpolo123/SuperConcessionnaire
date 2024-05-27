import BidService from '../services/bid.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const bid = {
    namespaced: true,
    state: initialState,
    actions: {
        getallbids({ commit }) {
            return BidService.getAllBids().then(
                bids => {
                    return Promise.resolve(bids);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getbid({ commit }, carId) {
            return BidService.getBid(carId).then(
                bid => {
                    return Promise.resolve(bid);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        addbid({ commit }, bid) {
            return BidService.addBid(bid).then(
                bid => {
                    return Promise.resolve(bid);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
    }
};