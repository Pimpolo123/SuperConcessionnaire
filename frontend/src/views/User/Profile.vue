<template>
    <div class="container" v-if="currentUser !== null">
	<Toast/>
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
		<a class="btn btn-primary" href @click.prevent="confirmDeleteAccount">
            <span>Supprimer le compte</span>
        </a>
	</div>
	<Dialog v-model:visible="deleteAccountDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="user">Etes-vous sûr de vouloir supprimer votre compte ? L'action est irréversible</span>
            </div>
            <template #footer>
                <Button label="Non" icon="pi pi-times" text @click="deleteAccountDialog = false"/>
                <Button label="Oui" icon="pi pi-check" text @click="deleteAccount" />
            </template>
        </Dialog>
</template>
  
<script>
	import { toRaw } from 'vue';
	import Dialog from 'primevue/dialog';
	import Button from 'primevue/button';
	import 'primeicons/primeicons.css';
	import Toast from 'primevue/toast';

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
				imgSrc: '',
				deleteAccountDialog: false
            };
        },
        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }
        },
		components: {
			Dialog,
			Button,
			Toast
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
        },
		methods: {
			confirmDeleteAccount(){
				this.deleteAccountDialog = true;
			},
			deleteAccount() {
				this.$store.dispatch('user/deleteuser', this.user).then(
					response => {
						this.$toast.add({severity:'success', summary: 'Succès', detail: response, life: 3000});
						this.$store.dispatch('auth/logout');
						this.$router.push('/home');
					},
					error => {
						this.loading = false;
						this.message = (error.response && error.response.data.message) ||
						error.message ||
						error.toString();
					}
				)
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