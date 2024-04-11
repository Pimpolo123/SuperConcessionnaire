<template>
    <div class="container" v-if="currentUser !== null">
      <header class="jumbotron">
		<img
          id="profile-img"
          :src="imgSrc"
          class="profile-img-card mb-2 img-max"
        />
        <h3>
          <strong>Profil de {{currentUser.surname + ' ' + currentUser.name}}</strong>
        </h3>
		</header>
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
	<div class="container d-flex justify-content-around">
		<router-link to="/editprofile" class="btn btn-primary" type="submit">
			<span>Modifier</span>
		</router-link>
		<router-link to="/editaddress" class="btn btn-primary" type="submit">
			<span>Modifier/Ajouter l'adresse</span>
		</router-link>
	</div>
</template>
  
<script>
	import { toRaw } from 'vue';

	const ROLE_MAPPINGS = {
		"ROLE_USER": "Utilisateur",
		"ROLE_MODERATOR": "Modérateur",
		"ROLE_ADMIN": "Administrateur"
	}
    const DB_ROLES = ["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"];
	const visualRoles = ["Utilisateur", "Administrateur", "Modérateur"];
	const userRoles = [];

    export default {
        name: 'Profile',
		data() {
            return {
				user: JSON.parse(localStorage.getItem('user')),
				userRoles: [],
				imgSrc: ''
            };
        },
        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }
        },
        mounted() {
			const raw = toRaw(this.$store.state.auth.user.roles);
            for (const r in raw){
				this.userRoles.push(ROLE_MAPPINGS[raw[r]]);
			}
            if (!this.currentUser) {
                this.$router.push('/login');
            }
			if(!this.user.imgUrl){
                this.imgSrc = "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            } else {
                this.imgSrc = 'data:image/png;base64,' + this.user.imgUrl;
            }
        }
    };
</script>

<style scoped>
.img-max {
  max-width: 15vw;
  width:100%;
}
</style>