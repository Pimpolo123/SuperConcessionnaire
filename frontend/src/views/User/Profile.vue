<template>
    <div class="container" v-if="currentUser !== null">
	<Toast/>
		<header class="jumbotron d-flex">
			<div>
			<img
			id="profile-img"
			:src="imgSrc"
			class="profile-img-card mb-2 img-max"
			/>
			<h3>
			<strong>Profil de {{currentUser.surname + ' ' + currentUser.name}}</strong>
			</h3>
			</div>
			<div class="ml-5">
				<Card class="p-4">
					<template #header>
						<h3>Je souhaite recevoir des mails : </h3>
					</template>
					<template #content>
						<div v-for="option of options" :key="option.key" class="d-flex items-center">
                            <Checkbox v-model="selectedMailOptions" :inputId="option.key" name="category" :value="option.key" />
                            <label :for="option.key">{{ option.name }}</label>
                        </div>
						<Button label="Enregistrer" class="mt-3" @click="setPreferences"/>
					</template>
				</Card>
			</div>
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
	import Checkbox from 'primevue/checkbox';
	import Card from 'primevue/card';

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
				deleteAccountDialog: false,
				options: [
					{key: 'priceChange', name: 'Quand un véhicule change de prix'},
					{key: 'vehicleSold', name: 'Quand un véhicule est vendu'},
					{key: 'bidWin', name: 'Quand une enchère est gagnée'}
				],
				selectedMailOptions: [],
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
			Toast,
			Checkbox,
			Card
		},
        mounted() {
			console.log(this.user);
			
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
			if(this.user.emailPriceChange){
				this.selectedMailOptions.push('priceChange');
			}
			if(this.user.emailCarSold){
				this.selectedMailOptions.push('vehicleSold');
			}
			if(this.user.emailBidWon){
				this.selectedMailOptions.push('bidWin');
			}
			console.log(this.selectedMailOptions);
			
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
			},
			setPreferences(){
				console.log(this.selectedMailOptions);
				
				this.$store.dispatch('user/setpreferences', {
					userId: this.user.id,
					emailPriceChange: this.selectedMailOptions.includes('priceChange'),
					emailCarSold: this.selectedMailOptions.includes('vehicleSold'),
					emailBidWon: this.selectedMailOptions.includes('bidWin')
				}).then(
					response => {
						this.$toast.add({severity:'success', summary: 'Succès', detail: response.message, life: 3000});
						let updatedUser = JSON.parse(localStorage.getItem('user'));
						updatedUser.emailPriceChange = this.selectedMailOptions.includes('priceChange');
						updatedUser.emailCarSold = this.selectedMailOptions.includes('vehicleSold');
						updatedUser.emailBidWon = this.selectedMailOptions.includes('bidWin');
						localStorage.setItem('user', JSON.stringify(updatedUser));
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