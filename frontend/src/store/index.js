import Vue from 'vue';
import { createStore } from 'vuex'

import { auth } from './auth.module';
import { user } from './user.module';
import { admin } from './admin.module';
import { cars } from './cars.module';
import { bid } from './bid.module';
import { mailing } from './mailing.module';




const store = createStore({
  modules: {
    auth,
    user,
    admin,
    cars,
    bid,
    mailing
  }
});

export default store;