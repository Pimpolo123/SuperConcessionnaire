<template>
    <div v-if="isAdmin()">
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="Nouveau" icon="pi pi-plus" class="mr-2 p-button" @click="openNew" />
                    <Button label="Supprimer" icon="pi pi-trash" class="mr-2 p-button" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedCars || !selectedCars.length" />
                </template>
                <template #end>
                    <Button label="Export" icon="pi pi-upload" @click="exportCSV($event)" rounded />
                </template>
            </Toolbar>
            <Toast />
            <ConfirmDialog></ConfirmDialog>
            <DataTable ref="dt" :value="data" v-model:selection="selectedCars" dataKey="id" removableSort sortField="id" :sortOrder="1"
                :paginator="true" :rows="10" :filters="filters" showGridlines
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Affichage de {first} à {last} de {totalRecords} voitures">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Gestion des voitures</h4>
						<IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Recherche..." />
                        </IconField>
					</div>
                </template>
                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="make.name" header="Marque/modèle" sortable style="max-width:5rem">
                    <template #body="slotProps">
                        <div class="font-weight-bold">{{ slotProps.data.make.name }}</div>
                        <div class="font-weight-bold">{{ slotProps.data.model.name }}</div>
                        <div>{{ slotProps.data.displacement }} L</div>
                        <div>{{ slotProps.data.year }}</div>
                    </template>
                </Column>
                <Column header="Image" style="max-width: 4rem;" :exportable="false">
                    <template #body="slotProps">
                        <img :src="getImageSource(slotProps.data.carpictures[0].base64url)" alt="Photo de voiture" class="rounded-square" style="width: 64px" />
                    </template>
                </Column>
                <Column header="Informations" style="max-width: 14rem;">
                    <template #body="slotProps">
                        <div class="container">
                            <div class="d-flex justify-content-between">
                                <span class="font-weight-bold">Catégorie : <span class="font-weight-normal">{{ slotProps.data.category.name }}</span></span>
                                <span class="font-weight-bold">Puissance : <span class="font-weight-normal">{{ slotProps.data.power }} kW</span></span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="font-weight-bold">Carburant : <span class="font-weight-normal">{{ slotProps.data.fueltype.name }}</span></span>
                                <span class="font-weight-bold">Kilométrage : <span class="font-weight-normal">{{ slotProps.data.kilometers }} km</span></span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="font-weight-bold">1ère immatriculation : <span class="font-weight-normal">{{ slotProps.data.firstReg }}</span></span>
                                <span class="font-weight-bold">Boite de vitesse : <span class="font-weight-normal">{{ slotProps.data.gearboxtype.name }} {{ slotProps.data.gears }} vitesses</span></span>
                            </div>
                        </div>
                    </template>
                </Column>
                <Column :exportable="false" style="width:8rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCar(slotProps.data)" v-tooltip.top="'Editer la voiture'"/>
                        <Button icon="pi pi-trash" outlined rounded class="mr-2" severity="danger" @click="confirmDeleteCar(slotProps.data)" v-tooltip.top="'Supprimer la voiture'"/>
                    </template>
                </Column>
            </DataTable>
        </div>
	</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import 'primeicons/primeicons.css';

export default {
    name: "CarManagement",
    data() {
        return {
            data: [],
            car: {},
            currentUser: JSON.parse(localStorage.getItem('user')),
            selectedCars: [],
            imgUrl: "",
            filters: {},
            deleteCarsDialog: false,
            message: '',
        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
        this.$store.dispatch('cars/getallcars').then(
            res => {
                console.log(res);
                this.data = res;
            },
            error => {
                this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            }
        );
    },
    components: {
        Toolbar,
        DataTable,
        Column,
        Button,
        InputText,
        InputIcon,
        IconField,
        ConfirmDialog,
        Toast
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
        initFilters() {
            this.filters = {
                global: {value: null, matchMode: FilterMatchMode.CONTAINS},
                name: {value: null, matchMode: FilterMatchMode.STARTS_WITH},
            }
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        isAdmin() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
        getImageSource(imgUrl){
            if(!imgUrl || Object.keys(imgUrl).length == 0){
                return "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            } else {
                return 'data:image/png;base64,' + imgUrl;
            }
        },
        confirmDeleteSelected() {
            this.$confirm.require({
                message: 'Etes-vous sur de vouloir supprimer les voitures sélectionnées ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Annuler',
                acceptLabel: 'Supprimer',
                accept: () => {
                    this.deleteSelectedCars();
                    this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Voitures supprimées', life: 3000 });
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulé', detail: 'Action annulée', life: 1000 });
                }
            });
        },
        deleteSelectedCars() {
            this.$store.dispatch('cars/deletecars', this.selectedCars).then(
                res => {
                    this.data = this.data.filter(val => !this.selectedCars.includes(val));
                    this.selectedCars = [];
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
                    this.$toast.add({ severity: 'error', summary: 'Erreur', detail: this.message, life: 1000 });
                }
            );
            this.selectedCars = [];
        },
        confirmDeleteCar(car) {
            this.car = car;
            this.$confirm.require({
                message: 'Etes-vous sur de vouloir supprimer la voiture ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Annuler',
                acceptLabel: 'Supprimer',
                accept: () => {
                    this.deleteCar();
                    this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Voiture supprimée', life: 3000 });
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulé', detail: 'Action annulée', life: 1000 });
                }
            });
        },
        deleteCar(){
            this.$store.dispatch('cars/deletecar', this.car.id).then(
                res => {
                    console.log(res);
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
                    this.$toast.add({ severity: 'error', summary: 'Erreur', detail: this.message, life: 1000 });
                }
            );
            this.data = this.data.filter(val => val.id != this.car.id);
            this.car = {};
        }
    }
}
</script>