<template>
    <div v-if="isAdmin()">
        <div class="card container-fluid p-0">
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
            <Dialog v-model:visible="carDialog" :style="{width: '100%'}" header="Détails de la voiture" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog">
                <div class="row">
                    <div class="col-md-3">
                        <label for="makes" class="mb-1">Marque</label>
                        <Dropdown name="makes" v-model="car.make" :options="makes" optionLabel="name" :disabled="isExistingCar"
                            placeholder="Sélectionner la marque" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-3">
                        <label for="models" class="mb-1">Modèle</label>
                        <Dropdown name="models" v-model="car.model" :options="models" optionLabel="name" :disabled="isExistingCar"
                            placeholder="Sélectionner le modèle" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-3">
                        <label for="category" class="mb-1">Catégorie</label>
                            <Dropdown name="category" v-model="car.category" :options="categories" optionLabel="name" :disabled="isExistingCar"
                                placeholder="Sélectionner la catégorie" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-3">
                        <label for="gearboxtype" class="mb-1">Boite de vitesses</label>
                            <Dropdown name="gearboxtype" v-model="car.gearboxtype" :options="gearboxtypes" optionLabel="name" :disabled="isExistingCar"
                                placeholder="Sélectionner le type de boite" class="w-full md:w-40rem" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <label for="gearboxtype" class="mb-1">Carburant</label>
                            <Dropdown name="gearboxtype" v-model="car.gearboxtype" :options="gearboxtypes" optionLabel="name" :disabled="isExistingCar"
                                placeholder="Sélectionner le type de boite" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-3">
                        <label for="color" class="mb-1">Couleur</label>
                            <Dropdown name="color" v-model="car.color" :options="colors" optionLabel="name" :disabled="isExistingCar"
                                placeholder="Sélectionner la couleur" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-2">
                        <label for="drivetrain" class="mb-1">Transmission</label>
                            <Dropdown name="drivetrain" v-model="car.drivetrain" :options="drivetrains" optionLabel="name" :disabled="isExistingCar"
                                placeholder="Sélectionner le type de transmission" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-2">
                        <label for="euro" class="mb-1">Classe EURO</label>
                            <Dropdown name="euro" v-model="car.euro" :options="euroclasses" optionLabel="name" :disabled="isExistingCar"
                                placeholder="Sélectionner la classe d'émission" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-2">
                        <label for="admissiontype" class="mb-1">Type d'admission</label>
                            <Dropdown name="admissiontype" v-model="car.admissiontype" :options="admissiontype" optionLabel="name" :disabled="isExistingCar"
                                placeholder="Sélectionner le type d'admission" class="w-full md:w-40rem" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="year">Année</label>
                            <InputNumber id="year" v-model.trim="car.year" :disabled="isExistingCar" :invalid="submitted && !car.year"/>
                            <small class="p-error" v-if="submitted && !car.year">Année requise</small>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="displacement">Cylindrée (cm³)</label>
                            <InputNumber id="displacement" v-model.trim="car.displacement" :disabled="isExistingCar"/>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="power">Puisance (kW)</label>
                            <InputNumber id="power" v-model.trim="car.power" :disabled="isExistingCar" :invalid="submitted && !car.power"/>
                            <small class="p-error" v-if="submitted && !car.power">Puissance requise</small>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="gears">Nombre de vitesses</label>
                            <InputNumber id="gears" v-model.trim="car.gears" :disabled="isExistingCar" :invalid="submitted && !car.gears"/>
                            <small class="p-error" v-if="submitted && !car.gears">Nombre de vitesses requis</small>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="cylinders">Nombre de cylindres</label>
                            <InputNumber id="cylinders" v-model.trim="car.cylinders" :disabled="isExistingCar"/>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="doors">Nombre de portes</label>
                            <InputNumber id="doors" v-model.trim="car.doors" :disabled="isExistingCar"/>
                        </FloatLabel>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-7">
                                <Datepicker name="firstReg" v-model="car.firstReg" menu-class-name="dp-custom-input" :teleport="true" 
                                    :format="format" :enable-time-picker="false" month-picker placeholder="Première immatriculation" class="mt-4"/>
                            </div>
                            <div class="col-md-5">
                                <FloatLabel class="mt-4">
                                    <label for="co2">Emissions CO2 (g/km)</label>
                                    <InputNumber id="co2" v-model.trim="car.co2" :disabled="isExistingCar"/>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="row text-center mt-3">
                            <label class="h6 text-muted">Consommation (l/100km)</label>
                        </div>
                        <div class="row border pb-2">
                                <div class="col-md-4">
                                    <FloatLabel class="mt-4">
                                        <label for="urbanCons">Urbaine</label>
                                        <InputNumber id="urbanCons" v-model.trim="car.urbanCons" :disabled="isExistingCar"/>
                                    </FloatLabel>
                                </div>
                                <div class="col-md-4">
                                    <FloatLabel class="mt-4">
                                        <label for="mixCons">Mixte</label>
                                        <InputNumber id="mixCons" v-model.trim="car.mixCons" :disabled="isExistingCar"/>
                                    </FloatLabel>
                                </div>
                                <div class="col-md-4">
                                    <FloatLabel class="mt-4">
                                        <label for="hwCons">Autoroute</label>
                                        <InputNumber id="hwCons" v-model.trim="car.hwCons" :disabled="isExistingCar"/>
                                    </FloatLabel>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="row">
                            <div class="col-md-6">
                                <FloatLabel class="mt-4">
                                    <label for="price">Prix</label>
                                    <InputNumber id="price" v-model.trim="car.price" :disabled="isExistingCar"/>
                                </FloatLabel>
                            </div>
                            <div class="col-md-6">
                                <FloatLabel class="mt-4">
                                    <label for="kilometers">Kilométrage</label>
                                    <InputNumber id="kilometers" v-model.trim="car.kilometers" :disabled="isExistingCar"/>
                                </FloatLabel>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <FloatLabel class="mt-4">
                                    <label for="description">Description</label>
                                    <Textarea v-model="car.description" rows="5" cols="30" />
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="row text-center mt-3">
                            <label class="h6 text-muted">Options</label>
                        </div>
                        <div class="row border pb-2 mb-2 mt-0">
                            <ScrollPanel style="width: 100%; height: 19vh">
                                <div v-for="category of categories" :key="category.key" class="flex align-items-center">
                                    <Checkbox v-model="selectedCategories" :inputId="category.key" name="category" :value="category.name" />
                                    <label :for="category.key" class="m-0 pl-2">{{ category.name }}</label>
                                </div>
                            </ScrollPanel>
                        </div>
                    </div>
                </div>
                <template #footer>
                    <Button label="Annuler" icon="pi pi-times" text @click="hideDialog"/>
                    <Button label="Sauvegarder" icon="pi pi-check" text @click="saveCar" />
                </template>
            </Dialog>
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
import Dialog from 'primevue/dialog';
import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Textarea from 'primevue/textarea';
import ScrollPanel from 'primevue/scrollpanel';

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
            isExistingCar: false,
            carDialog: false,
            submitted: false,
            car: {},
            format: (date) => {
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();

                    return `${month}/${year}`;
            },
            categories: [
                { name: "Accounting", key: "A" },
                { name: "Marketing", key: "M" },
                { name: "Production", key: "P" },
                { name: "Research", key: "R" },
                { name: "Accounting", key: "yaya" },
                { name: "Marketing", key: "yuyu" },
                { name: "Production", key: "yiyi" },
                { name: "Research", key: "yoyo" },
                { name: "Accounting", key: "yi" },
                { name: "Marketing", key: "yu" },
                { name: "Production", key: "ya" },
                { name: "Research", key: "yo" }
            ],
            selectedCategories: [],
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
        Toast,
        Dialog,
        FloatLabel,
        Dropdown,
        Datepicker,
        InputNumber,
        Checkbox,
        Textarea,
        ScrollPanel
    },
    methods: {
        openNew() {
            //store getmakes and getmodels
            this.car = {};
            this.isExistingCar = false;
            this.submitted = false;
            this.carDialog = true;
        },
        editCar(car){
            this.car = {...car};
            this.isExistingCar = true;
            this.submitted = false;
            this.carDialog = true;
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
        },
        hideDialog() {
            this.carDialog = false;
            this.car = {};
            this.imgUrl = '';
            this.submitted = false;
        },
        saveCar(){
            console.log('save car');
        },
    }
}
</script>