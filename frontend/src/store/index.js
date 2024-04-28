import Vue from 'vue';
import { createStore } from 'vuex'

import { auth } from './auth.module';
import { user } from './user.module';
import { admin } from './admin.module';
import { cars } from './cars.module';



const store = createStore({
  modules: {
    auth,
    user,
    admin,
    cars
  }
});

export default store;