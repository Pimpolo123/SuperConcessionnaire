<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Nouveau" icon="pi pi-plus" class="mr-2 p-button" @click="openNew" />
                    <Button label="Supprimer" icon="pi pi-trash" class="mr-2 p-button" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                    <Button label="Ban" icon="pi pi-ban" severity="danger" @click="confirmBanSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                </template>
                <template #end>
                    <Button label="Export" icon="pi pi-upload" @click="exportCSV($event)" rounded />
                </template>
            </Toolbar>
            <Toast/>
            <DataTable ref="dt" :value="data" v-model:selection="selectedUsers" dataKey="user.id" removableSort sortField="user.username" :sortOrder="1"
                :paginator="true" :rows="10" :filters="filters" 
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Affichage de {first} à {last} de {totalRecords} utilisateurs">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Gestion des utilisateurs</h4>
						<IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Recherche..." />
                        </IconField>
					</div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="getImageSource(slotProps.data.imgUrl)" alt="Photo de profil" class="rounded-circle" style="width: 64px" />
                    </template>
                </Column>
                <Column field="user.username" header="Nom d'utilisateur" sortable style="min-width:12rem"></Column>
                <Column field="user.name" header="Nom" sortable style="min-width:12rem"></Column>
                <Column field="user.surname" header="Prénom" sortable style="min-width:12rem"></Column>
                <Column field="user.banned" header="Statut" sortable style="min-width:12rem">
                    <template #body="slotProps">
                        <Tag :value="getBannedValue(slotProps.data.user.banned)" :severity="getStatusLabel(slotProps.data.user.banned)" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" v-tooltip.top="'Editer l\'utilisateur'"/>
                        <Button icon="pi pi-trash" outlined rounded class="mr-2" severity="danger" @click="confirmDeleteUser(slotProps.data.user)" v-tooltip.top="'Supprimer l\'utilisateur'"/>
                        <Button icon="pi pi-ban" outlined rounded severity="danger" @click="confirmBanUser(slotProps.data.user)" v-tooltip.top="'Bannir l\'utilisateur'"/>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Détails de l'utilisateur" :modal="true" class="p-fluid" @after-hide="hideDialog">
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="username">Nom d'utilisateur</label>
                    <InputText id="username" v-model.trim="user.username" autofocus :disabled="isExistingUser" />
                    <small class="p-error" v-if="submitted && !user.username">Nom d'utilisateur requis.</small>
                </FloatLabel>
            </div>
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="name">Nom</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus :invalid="submitted && !user.name"/>
                    <small class="p-error" v-if="submitted && !user.name">Nom requis.</small>
                </FloatLabel>
            </div>
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="surname">Prénom</label>
                    <InputText id="surname" v-model.trim="user.surname" required="true" :invalid="submitted && !user.surname"/>
                    <small class="p-error" v-if="submitted && !user.surname">Prénom requis.</small>
                </FloatLabel>
            </div>
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="phonenumber">Numéro de téléphone</label>
                    <InputText id="phonenumber" v-model.trim="user.phonenumber" required="true" :invalid="submitted && !user.phonenumber"/>
                    <small class="p-error" v-if="submitted && !user.phonenumber">Numéro requis.</small>
                </FloatLabel>
            </div>
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="roles" class="mb-3">Rôles</label>
                    <MultiSelect name="roles" v-model="userRoles" :options="roles" optionLabel="label"
                        placeholder="Sélectionner les roles" :maxSelectedLabels="3" class="w-full md:w-20rem" />
                </FloatLabel>
			</div>

            <Panel header="Adresse" class="mt-3 mb-3" :collapsed=true toggleable @toggle="addressToggle">
                <div class="field">
                    <label for="country">Pays</label>
                    <Dropdown v-model="selectedCountry" :options="countryList" optionLabel="countryName" placeholder="Sélectionnez un pays" 
                    class="w-full md:w-14rem" :invalid="submitted && addressRequired && !selectedCountry" @change="getRegions"/>
                    <small class="p-error" v-if="submitted && addressRequired && !selectedCountry">Pays requis.</small>
                </div>
                <div class="field">
                    <label for="region">Région</label>
                    <Dropdown v-model="selectedRegion" :options="regionList" optionLabel="regionName" placeholder="Sélectionnez une région" 
                    class="w-full md:w-14rem" :invalid="submitted && addressRequired && !selectedRegion"/>
                    <small class="p-error" v-if="submitted && addressRequired && !selectedRegion">Région requise.</small>
                </div>
                <div class="field">
                    <FloatLabel class="mt-4">
                        <label for="city">Ville</label>
                        <InputText id="city" v-model.trim="address.city" :required="addressRequired" :invalid="submitted && addressRequired && !address.city"/>
                        <small class="p-error" v-if="submitted && addressRequired && !address.city">Ville requise.</small>
                    </FloatLabel>
                </div>
                <div class="field">
                    <FloatLabel class="mt-4">
                        <label for="postcode">Code Postal</label>
                        <InputNumber id="postcode" v-model.trim="address.postcode" required="true" :invalid="submitted && addressRequired && !address.postcode" integeronly type="number"/>
                        <small class="p-error" v-if="submitted && addressRequired && !address.postcode">Code postal requis.</small>
                    </FloatLabel>
                </div>
                <div class="field">
                    <FloatLabel class="mt-4">
                        <label for="street">Rue</label>
                        <InputText id="street" v-model.trim="address.street" required="true" :invalid="submitted && addressRequired && !address.street"/>
                        <small class="p-error" v-if="submitted && addressRequired && !address.street">Nom de rue requis.</small>
                    </FloatLabel>
                </div>
                <div class="field">
                    <FloatLabel class="mt-4">
                        <label for="housenumber">Numéro de maison</label>
                        <InputNumber id="housenumber" v-model.trim="address.housenumber" required="true" :invalid="submitted && addressRequired && !address.housenumber" integeronly/>
                        <small class="p-error" v-if="submitted && addressRequired && !address.housenumber">Numéro de maison requis.</small>
                    </FloatLabel>
                </div>
                <div class="field">
                    <FloatLabel class="mt-4">
                        <label for="boxnumber">Numéro de boîte</label>
                        <InputNumber id="boxnumber" v-model.trim="address.boxnumber" required="true" integeronly/>
                    </FloatLabel>
                </div>
            </Panel>
            <template #footer>
                <Button label="Annuler" icon="pi pi-times" text @click="hideDialog"/>
                <Button label="Sauvegarder" icon="pi pi-check" text @click="saveUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="user">Etes-vous sûr de vouloir supprimer <b>{{user.username}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Non" icon="pi pi-times" text @click="deleteUserDialog = false"/>
                <Button label="Oui" icon="pi pi-check" text @click="deleteUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="banUserDialog" :style="{width: '450px'}" header="Confirmation" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="user">Etes-vous sûr de vouloir bannir <b>{{user.username}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Non" icon="pi pi-times" text @click="banUserDialog = false"/>
                <Button label="Oui" icon="pi pi-check" text @click="banUser" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteUsersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="user">Etes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?</span>
            </div>
            <template #footer>
                <Button label="Non" icon="pi pi-times" text @click="deleteUsersDialog = false"/>
                <Button label="Oui" icon="pi pi-check" text @click="deleteSelectedUsers" />
            </template>
        </Dialog>

        <Dialog v-model:visible="banUsersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="user">Etes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?</span>
            </div>
            <template #footer>
                <Button label="Non" icon="pi pi-times" text @click="banUsersDialog = false"/>
                <Button label="Oui" icon="pi pi-check" text @click="banSelectedUsers" />
            </template>
        </Dialog>
	</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import DataTable from 'primevue/datatable';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Tooltip from 'primevue/tooltip';
import Toast from 'primevue/toast';
import FloatLabel from 'primevue/floatlabel';
import MultiSelect from 'primevue/multiselect';
import Panel from 'primevue/panel';
import 'primeicons/primeicons.css';


export default {
    name: "UserManagement",
    data() {
        return {
            data: [],
            userDialog: false,
            deleteUserDialog: false,
            deleteUsersDialog: false,
            banUserDialog: false,
            banUsersDialog: false,
            user: {},
            userRoles: [],
            address: {},
            addressRequired: false,
            selectedUsers: null,
            filters: {},
            selectedCountry: '',
            selectedRegion: '',
            countryList: [],
            regionList: [],
            submitted: false,
            isExistingUser: true,
            imgUrl: "",
            roles: [
                //a remplacer par getRoles
				{label: 'Admin', value: 'ROLE_ADMIN'},
				{label: 'Modérateur', value: 'ROLE_MODERATOR'},
				{label: 'Utilisateur', value: 'ROLE_USER'}
            ]
        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
        this.$store.dispatch('admin/getallusers').then(
            res => {
                this.data = res;
            }
        );
    },
    components: {
        Button,
        Toolbar, 
        InputIcon, 
        InputText, 
        IconField, 
        Column, 
        Tag, 
        DataTable, 
        Textarea, 
        Dropdown, 
        RadioButton, 
        InputNumber, 
        Dialog,
        Tooltip,
        Toast,
        FloatLabel,
        MultiSelect,
        Panel
    },
    methods: {
        openNew() {
            this.$store.dispatch('user/getcountrylist').then(
                res => {
                    this.countryList = this.sortByKey(res.data, 'countryName');
                }
            );
            this.isExistingUser = false;
            this.submitted = false;
            this.userDialog = true;
        },
        hideDialog() {
            this.userDialog = false;
            this.user = {};
            this.address = {};
            this.imgUrl = '';
            this.userRoles = [];
            this.selectedRegion = '';
            this.selectedCountry = '';
            this.submitted = false;
        },
        saveUser() {
            this.submitted = true;
            var newData = {};
            var dataToEdit = this.data.find((d) => d.user.id === this.user.id);
            var index = this.data.indexOf(dataToEdit);
            console.log(this.submitted);
            console.log(this.addressRequired);
            console.log(!this.selectedCountry);
            console.log(this.selectedCountry);

            //validation et suppression des données
            if(this.user?.name?.trim() && this.user?.surname?.trim() && this.user?.phonenumber?.trim() && this.user?.username?.trim()){
                if(this.addressRequired &&
                        (this.address?.country?.trim() || this.selectedCountry) &&
                        (this.address?.region?.trim() || this.selectedRegion) &&
                        this.address?.city?.trim() &&
                        this.address?.postcode &&
                        this.address?.street &&
                        this.address?.housenumber){
                    this.address.country = this.selectedCountry.countryName;
                    this.address.region = this.selectedRegion.regionName;
                    
                    if(dataToEdit && this.isExistingUser) {
                        dataToEdit.address = this.address;
                        dataToEdit.roles = this.userRoles;
                        dataToEdit.imgUrl = this.imgUrl;
                        dataToEdit.user = this.user;
                        //juste pour le front
                        //pour le back ce serait trop lourd avec bcp d'users
                        //juste envoyer dataToEdit et faire le traitement dans le back
                        this.data.splice(index, 1, dataToEdit);
                    }
                    if(!this.isExistingUser) {
                        newData.address = this.address;
                        newData.roles = this.userRoles;
                        newData.imgUrl = this.imgUrl;
                        newData.user = this.user;
                        this.data.push(newData);
                    }
                    this.userDialog = false;
                    this.user = {};
                    this.address = {};
                    this.selectedRegion = '';
                    this.selectedCountry = '';
                    this.imgUrl = '';
                } else if(!this.addressRequired) {
                    if(dataToEdit && this.isExistingUser) {
                        dataToEdit.address = this.address;
                        dataToEdit.roles = this.userRoles;
                        dataToEdit.imgUrl = this.imgUrl;
                        dataToEdit.user = this.user;
                        //juste pour le front
                        //pour le back ce serait trop lourd avec bcp d'users
                        //juste envoyer dataToEdit et faire le traitement dans le back
                        this.data.splice(index, 1, dataToEdit);
                    }
                    if(!this.isExistingUser) {
                        newData.address = this.address;
                        newData.roles = this.userRoles;
                        newData.imgUrl = this.imgUrl;
                        newData.user = this.user;
                        this.data.push(newData);
                    }

                    this.userDialog = false;
                    this.user = {};
                    this.address = {};
                    this.imgUrl = '';
                }
            } else {
                this.$toast.add({severity:'error', summary: 'Erreur', detail: 'Informations obligatoires manquantes', life: 3000});
            }
        },
        editUser(data) {
            this.$store.dispatch('user/getcountrylist').then(
                res => {
                    this.countryList = this.sortByKey(res.data, 'countryName');
                    if(Object.keys(this.selectedCountry).length == 0 && data.address.country){
                        this.selectedCountry = this.countryList.find((c) => c.countryName == data.address.country);
                        this.$store.dispatch('user/getregionlist', {id:this.selectedCountry.id}).then(
                        res => {
                            this.regionList = res;
                            if(Object.keys(this.selectedRegion).length == 0 && this.address.region){
                                this.selectedRegion = this.regionList.find((r) => r.regionName == this.address.region);
                            }
                        });
                    }
                }
            );
        
            this.user = {...data.user};
            this.address = {...data.address};
            this.imgUrl = {...data.imgUrl};
            this.userRoles = this.roles.filter(r => data.roles.includes(r.value));
            this.userDialog = true;
        },
        confirmDeleteUser(user) {
            this.user = user;
            this.deleteUserDialog = true;
        },
        confirmBanUser(user){
            this.user = user;
            this.banUserDialog = true;
        },
        deleteUser() {
            //faire la requète ici(delete userID)
            this.data = this.data.filter(val => val.user.id !== this.user.id);
            this.deleteUserDialog = false;
            this.user = {};
            this.$toast.add({severity:'success', summary: 'Succès', detail: 'Utilisateur supprimé', life: 3000});
        },
        banUser(){
            //faire la requète ici(userId.banned = true)
            this.user.banned = true;
            this.data.forEach(d => {
                if(d.user.id == this.user.id){
                    d.user = this.user;
                }
            });
            this.banUserDialog = false;
            this.user = {};
            this.$toast.add({severity:'success', summary: 'Succès', detail: 'Utilisateur banni', life: 3000});
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        confirmDeleteSelected() {
            this.deleteUsersDialog = true;
        },
        deleteSelectedUsers() {
            //faire la requète ici (delete users) (boucle et envoyer liste de userId)
            this.data = this.data.filter(val => !this.selectedUsers.includes(val));
            this.deleteUsersDialog = false;
            this.selectedUsers = null;
            this.$toast.add({severity:'success', summary: 'Succès', detail: 'Utilisateurs Supprimés', life: 3000});
        },
        confirmBanSelected(){
            this.banUsersDialog = true;
        },
        banSelectedUsers(){
            //faire la requète ici (userId.banned = true)
            this.data.forEach(d => {
                if(this.selectedUsers.includes(d)){
                    d.user.banned = true
                }
            });
            this.banUsersDialog = false;
            this.selectedUsers = null;
            this.$toast.add({severity:'success', summary: 'Succès', detail: 'Utilisateurs Bannis', life: 3000});
        },
        initFilters() {
            this.filters = {
                global: {value: null, matchMode: FilterMatchMode.CONTAINS},
                name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            }
        },
        addressToggle(collapsed){
            this.addressRequired = !collapsed.value;
            this.submitted = false;
        },
        getStatusLabel(status) {
            if(status){
                return 'danger';
            } else {
                return 'success';
            }
        },
        getRoleLabel(status) {
            console.log(status);
            if(status ){
                return 'danger';
            } else {
                return 'success';
            }
        },
        getBannedValue(status){
            if(status){
                return 'Banni';
            } else {
                return 'OK';
            }
        },
        getImageSource(imgUrl){
            if(!imgUrl || Object.keys(imgUrl).length == 0){
                return "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            } else {
                return 'data:image/png;base64,' + imgUrl;
            }
        },
        getRegions(country){
            this.$store.dispatch('user/getregionlist', {id:parseInt(country.value.id)}).then(
                res => {
                    this.regionList = res;
                }
            );
            return true;
        },
        sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
    }
}
</script>

