<template>
    <div class="container" v-if="currentUser !== null">
      <header class="jumbotron">
        <h3>
          <strong>Profil de {{currentUser.surname + ' ' + currentUser.name}}</strong>
        </h3>
		</header>
		<!-- <p>
			<strong>Token:</strong>
			{{currentUser.accessToken.substring(0, 20)}} ... {{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}}
		</p> -->
		<p>
			<strong>Nom d'utilisateur :</strong>
			{{currentUser.username}}
		</p>
		<p>
			<strong>Email:</strong>
			{{currentUser.email}}
		</p>
		<p>
			<strong>Rôles:</strong>
			<ul>
				<li v-for="(role,index) in this.userRoles" :key="index">{{role}}</li>
			</ul>
		</p>
    </div>
	<div class="container">
		<router-link to="/editprofile" class="btn btn-primary btn-block" type="submit">
			<span>Modifier</span>
		</router-link>
	</div>
</template>
  
<script>
	import { toRaw } from 'vue';

    const DB_ROLES = ["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"];
	const visualRoles = ["Utilisateur", "Administrateur", "Modérateur"];
	const userRoles = [];

    export default {
        name: 'Profile',
		data() {
            return {
				userRoles: []
            };
        },
        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }
        },
        mounted() {
            for (const r in this.$store.state.auth.user.roles){
            	const raw = toRaw(this.$store.state.auth.user.roles);
				if(DB_ROLES.includes(raw[r])){
					this.userRoles.push(visualRoles[r]);
				}
			}
            if (!this.currentUser) {
                this.$router.push('/login');
            }
        }
    };
</script>