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
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data.user)" v-tooltip.top="'Editer l\'utilisateur'"/>
                        <Button icon="pi pi-trash" outlined rounded class="mr-2" severity="danger" @click="confirmDeleteUser(slotProps.data.user)" v-tooltip.top="'Supprimer l\'utilisateur'"/>
                        <Button icon="pi pi-ban" outlined rounded severity="danger" @click="confirmBanUser(slotProps.data.user)" v-tooltip.top="'Bannir l\'utilisateur'"/>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Détails de l'utilisateur" :modal="true" class="p-fluid">
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="username">Nom d'utilisateur</label>
                    <InputText id="username" v-model.trim="user.username" required="true" autofocus :invalid="submitted && !user.username"/>
                    <small class="p-error" v-if="submitted && !user.username">Name is required.</small>
                </FloatLabel>
            </div>
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="name">Nom</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus :invalid="submitted && !user.name"/>
                    <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
                </FloatLabel>
            </div>
            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="surname">Prénom</label>
                    <InputText id="surname" v-model.trim="user.surname" required="true" autofocus :invalid="submitted && !user.surname"/>
                    <small class="p-error" v-if="submitted && !user.surname">Name is required.</small>
                </FloatLabel>
            </div>

            <div class="field">
                <FloatLabel class="mt-5">
                    <label for="roles" class="mb-3">Rôles</label>
                    <MultiSelect name="roles" v-model="user.roles" :options="roles" optionLabel="label" :value="user.roles"
                        placeholder="Sélectionner les roles" :maxSelectedLabels="3" class="w-full md:w-20rem" />
                </FloatLabel>
			</div>

            <div class="field">
                <label class="mb-3">Category</label>
                <div class="formgrid grid">
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
                        <label for="category1">Accessories</label>
                    </div>
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                        <label for="category2">Clothing</label>
                    </div>
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
                        <label for="category3">Electronics</label>
                    </div>
                    <div class="field-radiobutton col-6">
                        <RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
                        <label for="category4">Fitness</label>
                    </div>
                </div>
            </div>

            <div class="formgrid grid">
                <div class="field col">
                    <label for="price">Price</label>
                    <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" />
                </div>
                <div class="field col">
                    <label for="quantity">Quantity</label>
                    <InputNumber id="quantity" v-model="product.quantity" integeronly />
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
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
import 'primeicons/primeicons.css';


export default {
    data() {
        return {
            data: null,
            userDialog: false,
            deleteUserDialog: false,
            deleteUsersDialog: false,
            banUserDialog: false,
            banUsersDialog: false,
            product: '',
            user: {},
            selectedUsers: null,
            filters: {},
            submitted: false,
            imgSrc: "",
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
        MultiSelect
    },
    methods: {
        openNew() {
            this.product = {};
            this.submitted = false;
            this.userDialog = true;
        },
        hideDialog() {
            this.userDialog = false;
            this.submitted = false;
        },
        saveProduct() {
            this.submitted = true;

			if (this.product?.name?.trim()) {
                if (this.product.id) {
                    this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value: this.product.inventoryStatus;
                    this.products[this.findIndexById(this.product.id)] = this.product;
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
                }
                else {
                    this.product.id = this.createId();
                    this.product.code = this.createId();
                    this.product.image = 'product-placeholder.svg';
                    this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                    this.products.push(this.product);
                    this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
                }

                this.userDialog = false;
                this.user = {};
            }
        },
        editUser(user) {
            this.user = {...user};
            this.userDialog = true;
            console.log('DATA', this.data);
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
        findIndexById(id) {
            let index = -1;
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === id) {
                    index = i;
                    break;
                }
            }

            return index;
        },
        createId() {
            let id = '';
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for ( var i = 0; i < 5; i++ ) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return id;
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
            if(!imgUrl){
                return "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            } else {
                return 'data:image/png;base64,' + imgUrl;
            }
        }
    }
}
</script>

