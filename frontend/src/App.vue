<template>
    <div id="app">
      <nav class="navbar navbar-expand-lg bg-primary">
        <div class="container">
          <h3 class="navbar-brand mb-0 mt-0">SC2000</h3>
          <Button label="Menu" icon="pi pi-caret-down" class="navbar-toggler p-button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          </Button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/home" class="nav-link">
                  <font-awesome-icon icon="home" class="pr-1"/> Accueil
                </router-link>
              </li>
              <li v-if="showAdminBoard" class="nav-item">
                <router-link to="/admin" class="nav-link">
                  <font-awesome-icon icon="user-tie" /> Panel Admin
                </router-link>
              </li>
              <li v-if="showModeratorBoard" class="nav-item">
                <router-link to="/mod" class="nav-link">
                   Panel Modérateur
                </router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="currentUser" to="/favorites" class="nav-link">
                  <font-awesome-icon icon="heart" /> Voir les favoris
                </router-link>
              </li>
              <li class="nav-item">
                <router-link v-if="currentUser" to="/messages" class="nav-link">
                  <font-awesome-icon icon="envelope" /> Boîte de réception
                </router-link>
              </li>
            </ul>
          </div>
    
          <div v-if="!currentUser" class="navbar-nav ml-auto">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/register" class="nav-link">
                  <font-awesome-icon icon="user-plus" class="pr-1"/>S'inscrire
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/login" class="nav-link">
                  <font-awesome-icon icon="sign-in-alt" class="pr-1"/>Se connecter
                </router-link>
              </li>
            </ul>
          </div>
    
          <div v-if="currentUser" class="navbar-nav ml-auto">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/profile" class="nav-link">
                  <font-awesome-icon icon="user" class="pr-1"/>
                  {{ currentUser.username }}
                </router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link" href @click.prevent="logOut">
                  <font-awesome-icon icon="sign-out-alt" class="pr-1" />Se déconnecter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  
      <div class="container-fluid mt-3">
        <router-view />
      </div>
    </div>
</template>
  
<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import 'primeicons/primeicons.css';
    import Button from 'primevue/button';

    export default {
        computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
        showAdminBoard() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
        showModeratorBoard() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_MODERATOR');
            }
            return false;
        }
        },
		components: {
            FontAwesomeIcon,
            Button
        },
        methods: {
            logOut() {
              this.$store.dispatch('auth/logout');
              this.$router.push('/login');
        	}
      	}
    };
</script>

<style scoped>
    .navbar {
        height: 80px; /* Adjust the height as needed */
    }
    .navbar-brand, .nav-link, .navbar-toggler {
        font-size: 1.25rem; /* Adjust the font size as needed */
    }
    .navbar-toggler .pi {
        font-size: 1.25rem; /* Adjust the icon size as needed */
    }
    .nav-link .fa, .nav-link .pi {
        font-size: 1.25rem; /* Adjust the icon size as needed */
    }
</style>