import Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue';
import Login from './views/Auth/Login.vue';
import Register from './views/Auth/Register.vue';

// Vue.use(Router);

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {   
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/home',
            component: Home
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/register',
            component: Register
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/User/Profile.vue')
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('./views/Admin/AdminPanel.vue')
        },
        {
            path: '/mod',
            name: 'moderator',
            component: () => import('./views/BoardModerator.vue')
        },
        {
            path: '/user',
            name: 'user',
            component: () => import('./views/BoardUser.vue')
        },
        {
            path: '/editprofile',
            name: 'editprofile',
            component: () => import('./views/User/EditProfile.vue')
        },
        {
            path: '/editaddress',
            name: 'editaddress',
            component: () => import('./views/User/EditAddress.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/home'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    if (authRequired && !loggedIn) {
        next('/login');
    } else {
        next();
    }
});