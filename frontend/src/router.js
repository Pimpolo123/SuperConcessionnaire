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
            component: Home,
            meta: { title: "Accueil" }
        },
        {
            path: '/home',
            component: Home,
            meta: { title: "Accueil" } 
        },
        {
            path: '/login',
            component: Login,
            meta: { title: "Connexion" } 
        },
        {
            path: '/register',
            component: Register,
            meta: { title: "Inscription" } 
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('./views/User/Profile.vue'),
            meta: { title: "Profil" } 
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('./views/Admin/AdminPanel.vue'),
            meta: { title: "Panel Admin" } 
        },
        {
            path: '/mod',
            name: 'moderator',
            component: () => import('./views/BoardModerator.vue'),
            meta: { title: "user" } 
        },
        {
            path: '/editprofile',
            name: 'editprofile',
            component: () => import('./views/User/EditProfile.vue'),
            meta: { title: "Edition Profil" } 
        },
        {
            path: '/editaddress',
            name: 'editaddress',
            component: () => import('./views/User/EditAddress.vue'),
            meta: { title: "Edition adresse" } 
        },
        {
            path: '/carlist',
            name: 'carlist',
            component: () => import('./views/Cars/CarList.vue'),
            meta: { title: "Liste des voitures" } 
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: () => import('./views/User/Favorites.vue'),
            meta: { title: "Mes favoris" } 
        },
        {
            path: '/bidlist',
            name: 'bidlist',
            component: () => import('./views/Cars/BidList.vue'),
            meta: { title: "Enchères en cours" } 
        },
        {
            path: '/messages',
            name: 'messages',
            component: () => import('./views/User/MessagesPanel.vue'),
            meta: { title: "Boîte de réception" } 
        },
        {
            path: '/conditions',
            name: 'conditions',
            component: () => import('./views/Conditions.vue'),
            meta: { title: "Conditions d'utilisation" } 
        },
        {
            path: '/calendar',
            name: 'calendar',
            component: () => import('./views/User/Calendar.vue'),
            meta: { title: "Calendrier" } 
        },
        {
            path: '/livechat',
            name: 'livechat',
            component: () => import('./views/LiveChat.vue'),
            meta: { title: "Chat en direct" } 
        },
        {
            path: '/tickets',
            name: 'tickets',
            component: () => import('./views/TicketView.vue'),
            meta: { title: "Mes tickets" } 
        },
        
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/home', '/carlist', '/conditions'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    document.title = to.meta.title || "SuperConcessionnaire";

    if (authRequired && !loggedIn) {
        next('/login');
    } else {
        next();
    }
});