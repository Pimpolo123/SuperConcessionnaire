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
            <div v-if="isLoading" class="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center" style="background-color: rgba(0,0,0,0.5); z-index: 1050;">
                <div class="bg-white p-4 border rounded">
                    <ProgressSpinner/>
                </div>
            </div>
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
                        <div v-if="slotProps.data.displacement">{{ slotProps.data.displacement }} cm³</div>
                        <div>{{ slotProps.data.year }}</div>
                    </template>
                </Column>
                <Column header="Image" style="max-width: 4rem;" :exportable="false">
                    <template #body="slotProps">
                        <img v-if="slotProps.data.carpictures.length > 0" :src="getImageSource(slotProps.data.carpictures[0]?.base64url)" alt="Photo de voiture" class="rounded-square" style="width: 200px" />
                        <img v-else src="../../assets/car-placeholder.png" alt="Photo de voiture" class="rounded-square" style="width: 100px" />
                    </template>
                </Column>
                <Column header="Informations" style="max-width: 14rem;">
                    <template #body="slotProps">
                        <div class="container">
                            <div class="d-flex justify-content-between">
                                <span class="font-weight-bold">Catégorie : 
                                    <span class="font-weight-normal" v-if="slotProps.data.category">{{ slotProps.data.category.name }}</span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </span>
                                <span class="font-weight-bold">Puissance : <span class="font-weight-normal">{{ slotProps.data.power }} kW</span></span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="font-weight-bold">Carburant : 
                                    <span class="font-weight-normal" v-if="slotProps.data.fueltype">{{ slotProps.data.fueltype.name }}</span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </span>
                                <span class="font-weight-bold">Kilométrage : <span class="font-weight-normal">{{ slotProps.data.kilometers }} km</span></span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="font-weight-bold">1ère immatriculation : 
                                    <span class="font-weight-normal" v-if="slotProps.data.firstReg">{{ slotProps.data.firstReg.split('-')[0] + '-' + slotProps.data.firstReg.split('-')[1] }}</span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </span>
                                <span class="font-weight-bold">Boite de vitesse : 
                                    <span class="font-weight-normal" v-if="slotProps.data.gearboxtype">{{ slotProps.data.gearboxtype.name }} <span v-if="slotProps.data.gearboxtype.name != 'CVT'">{{ slotProps.data.gears }} vitesses</span></span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </span>
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
                <InputSwitch v-model="isBid" class="mt-4 d-flex" v-tooltip.top="'Vente aux enchères'" @change="setBid"/>
                <div class="row mt-3" v-if="isBid">
                    <div class="col-md-3">
                        <FloatLabel class="mt-4">
                            <label for="startingPrice">Prix de départ</label>
                            <InputNumber id="startingPrice" v-model.trim="bid.startingPrice" :invalid="isBid && submitted && !bid.startingPrice" :disabled="bidDisabled"/>
                            <small class="p-error" v-if="isBid && submitted && !bid.startingPrice">Prix de départ requis</small>
                        </FloatLabel>
                    </div>
                    <div class="col-md-3">
                        <FloatLabel class="mt-4">
                            <label for="minimumBid">Enchère minimum</label>
                            <InputNumber id="minimumBid" v-model.trim="bid.minimumBid" :invalid="isBid && submitted && !bid.minimumBid" :disabled="bidDisabled"/>
                            <small class="p-error" v-if="isBid && submitted && !bid.minimumBid">Enchère minimum requise</small>
                        </FloatLabel>
                    </div>
                    <div class="col-md-3">
                        <Datepicker name="bidStartDate" v-model="bidDateRange" model-type="timestamp" menu-class-name="dp-custom-input" :teleport="true" ref="bidStartDate" id="bidStartDate"  :disabled="bidDisabled"
                             :enable-time-picker="true" :time-picker-inline="true" range placeholder="Période des enchères" class="mt-4"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 mt-3 mb-2">
                        <FileUpload name="carpictures[]" @select="onSelect" :multiple="true" accept="image/*" :maxFileSize="30000000" :fileLimit="20"
                            chooseLabel="Choisir" cancelLabel="Annuler" :showUploadButton="false"
                            invalidFileSizeMessage="Taille de fichier invalide, le fichier doit faire moins de {1}"
                            invalidFileTypeMessage="{0} : Type de fichier invalide, le fichier doit être une image"
                            invalidFileLimitMessage="{0} : Maximum 20 fichiers">
                            <template #content="{ files, removeFileCallback }">
                                <ProgressBar :value="(files.length*5) + (uploadedPicsLength*5)" class="m-2" :showValue="true" style="height: 20px; width: 98%;" ref="progressBar"> {{ files.length + uploadedPicsLength }}/20 </ProgressBar>
                                <div v-if="files.length > 0">
                                    <h5>En attente</h5>
                                    <div class="d-flex flex-wrap p-0 sm:p-5 gap-5">
                                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6 p-2 d-flex flex-column border-1 surface-border align-items-center gap-3">
                                            <div>
                                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" />
                                            </div>
                                            <span v-if="file.name.length > 15" class="font-semibold">{{ file.name.slice(0, 14) + '...' }}</span>
                                            <span v-else class="font-semibold">{{ file.name }}</span>
                                            <div>{{ formatSize(file.size) }}</div>
                                            <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined severity="danger" class="rounded-circle p-1"/>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        <template #empty>
                            <div class="d-flex align-items-center justify-content-center flex-column">
                                <i class="pi pi-cloud-upload border-2 border-circle p-1 text-5xl text-400 border-400"/>
                                <p class="mt-4 mb-0">Glisser-déposer les images ici.</p>
                            </div>
                        </template>
                        </FileUpload>
                    </div>
                </div>
                <div class="row">
                    <div v-if="isExistingCar">
                        <h5>Photos en ligne</h5>
                        <div class="d-flex flex-wrap p-0 sm:p-5 gap-5">
                            <div v-for="pic of car.carpictures" :key="pic.id" class="card m-0 px-6 p-2 d-flex flex-column border-1 surface-border align-items-center gap-3">
                                <div class="position-relative d-inline-block">
                                    <img :src="getImageSource(pic.base64url)" alt="Photo" class="img-fluid" width="100">
                                    <Button class="btn btn-danger d-flex justify-content-center align-items-center position-absolute top-2 end-2 p-0 m-0" @click="removePic(pic)" icon="pi pi-times"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <label for="makes" class="mb-1">Marque</label>
                        <Dropdown name="makes" v-model="car.make" :options="makes" optionLabel="name" :disabled="isExistingCar" @change="getModels" :invalid="submitted && !car.make"
                            placeholder="Sélectionner la marque" class="w-full md:w-40rem" />
                        <small class="p-error" v-if="submitted && !car.make">Marque requise</small>
                    </div>
                    <div class="col-md-3">
                        <label for="models" class="mb-1">Modèle</label>
                        <Dropdown v-if="!isExistingCar" name="models" v-model="car.model" :options="models" optionLabel="name"  :invalid="submitted && !car.model" ref="modelsDropdown"
                            placeholder="Sélectionner le modèle" class="w-full md:w-40rem" />
                        <InputText v-else name="models" v-model="car.model.name" disabled class="w-full md:w-40rem" />
                        <small class="p-error" v-if="submitted && !car.model">Modèle requis</small>
                    </div>
                    <div class="col-md-3">
                        <label for="category" class="mb-1">Catégorie</label>
                            <Dropdown name="category" v-model="car.category" :options="categories" optionLabel="name" @change="updateCar(car)"
                                placeholder="Sélectionner la catégorie" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-3">
                        <label for="gearboxtype" class="mb-1">Boite de vitesses</label>
                            <Dropdown name="gearboxtype" v-model="car.gearboxtype" :options="gearboxtypes" optionLabel="name" @change="updateCar(car)"
                                placeholder="Sélectionner le type de boite" class="w-full md:w-40rem" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <label for="fueltype" class="mb-1">Carburant</label>
                            <Dropdown name="fueltype" v-model="car.fueltype" :options="fueltypes" optionLabel="name" @change="updateCar(car)"
                                placeholder="Sélectionner le carburant" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-3">
                        <label for="color" class="mb-1">Couleur</label>
                            <Dropdown name="color" v-model="car.color" :options="colors" optionLabel="name" @change="updateCar(car)"
                                placeholder="Sélectionner la couleur" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-2">
                        <label for="drivetrain" class="mb-1">Transmission</label>
                            <Dropdown name="drivetrain" v-model="car.drivetrain" :options="drivetrains" optionLabel="name" @change="updateCar(car)"
                                placeholder="Sélectionner le type de transmission" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-2">
                        <label for="euro" class="mb-1">Classe EURO</label>
                            <Dropdown name="euro" v-model="car.euro" :options="euroclasses" optionLabel="name" @change="updateCar(car)"
                                placeholder="Sélectionner la classe d'émission" class="w-full md:w-40rem" />
                    </div>
                    <div class="col-md-2">
                        <label for="admissiontype" class="mb-1">Type d'admission</label>
                            <Dropdown name="admissiontype" v-model="car.admissiontype" :options="admissiontypes" optionLabel="name" @change="updateCar(car)"
                                placeholder="Sélectionner le type d'admission" class="w-full md:w-40rem" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="year">Année</label>
                            <InputNumber id="year" v-model.trim="car.year" :invalid="submitted && !car.year"/>
                            <small class="p-error" v-if="submitted && !car.year">Année requise</small>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="displacement">Cylindrée (cm³)</label>
                            <InputNumber id="displacement" v-model.trim="car.displacement"/>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="power">Puisance (kW)</label>
                            <InputNumber id="power" v-model.trim="car.power" :invalid="submitted && !car.power"/>
                            <small class="p-error" v-if="submitted && !car.power">Puissance requise</small>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="gears">Nombre de vitesses</label>
                            <InputNumber id="gears" v-model.trim="car.gears" :disabled="disableGears"/>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="cylinders">Nombre de cylindres</label>
                            <InputNumber id="cylinders" v-model.trim="car.cylinders"/>
                        </FloatLabel>
                    </div>
                    <div class="col-md-2">
                        <FloatLabel class="mt-4">
                            <label for="doors">Nombre de portes</label>
                            <InputNumber id="doors" v-model.trim="car.doors"/>
                        </FloatLabel>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-md-7">
                                <Datepicker name="firstReg" v-model="firstReg" menu-class-name="dp-custom-input" :teleport="true" ref="firstReg" id="firstReg"
                                    :format="format" :enable-time-picker="false" month-picker placeholder="Première immatriculation" class="mt-4"/>
                            </div>
                            <div class="col-md-5">
                                <FloatLabel class="mt-4">
                                    <label for="co2">Emissions CO2 (g/km)</label>
                                    <InputNumber id="co2" v-model.trim="car.co2"/>
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
                                        <InputNumber id="urbanCons" v-model.trim="car.urbanCons"/>
                                    </FloatLabel>
                                </div>
                                <div class="col-md-4">
                                    <FloatLabel class="mt-4">
                                        <label for="mixCons">Mixte</label>
                                        <InputNumber id="mixCons" v-model.trim="car.mixCons"/>
                                    </FloatLabel>
                                </div>
                                <div class="col-md-4">
                                    <FloatLabel class="mt-4">
                                        <label for="hwCons">Autoroute</label>
                                        <InputNumber id="hwCons" v-model.trim="car.hwCons"/>
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
                                    <InputNumber id="price" v-model.trim="car.price" :invalid="!isBid && submitted && !car.price" :disabled="priceDisabled"/>
                                    <small class="p-error" v-if="!isBid && submitted && !car.price">Prix requis</small>
                                </FloatLabel>
                            </div>
                            <div class="col-md-6">
                                <FloatLabel class="mt-4">
                                    <label for="kilometers">Kilométrage</label>
                                    <InputNumber id="kilometers" v-model.trim="car.kilometers" :invalid="submitted && !car.kilometers"/>
                                    <small class="p-error" v-if="submitted && !car.kilometers">Kilométrage requis</small>
                                </FloatLabel>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <FloatLabel class="mt-4">
                                    <label for="description">Description</label>
                                    <Textarea v-model="car.description" rows="5" cols="30" :invalid="submitted && !car.description"/>
                                    <small class="p-error" v-if="submitted && !car.description">Description requise</small>
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
                                <div v-for="option of options" :key="option.key" class="flex align-items-center">
                                    <Checkbox v-model="selectedOptions" :inputId="option.key" name="option" :value="option"/>
                                    <label :for="option.key" class="m-0 pl-2">{{ option.name }}</label>
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
import FileUpload from 'primevue/fileupload';
import Badge from 'primevue/badge';
import ProgressBar from 'primevue/progressbar';
import ProgressSpinner from 'primevue/progressspinner';
import InputSwitch from 'primevue/inputswitch';



export default {
    name: "CarManagement",
    data() {
        return {
            data: [],
            car: {},
            firstReg: {year: null, month: null},
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
            bidFormat: (date) => {
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const day = date.getDate();
                    const hour = date.getHours();
                    const minute = date.getMinutes();

                    return `${day}/${month}/${year} ${hour}:${minute}`;
            },
            imageFiles: [],
            makes: [],
            models: [],
            colors: [],
            gearboxtypes: [],
            drivetrains: [],
            euroclasses: [],
            admissiontypes: [],
            fueltypes: [],
            options: [],
            categories: [],
            selectedOptions: [],
            isLoading: false,
            disableGears: false,
            isBid: false,
            priceDisabled: false,
            bidDisabled: false,
            bid: {},
            bidDateRange: [],
            uploadedPicsLength: 0
        }
    },
    created() {
        this.initFilters();
    },
    mounted() {
        this.$store.dispatch('cars/getallcars').then(
            res => {
                this.data = res;
                this.data.forEach(car => {
                    if(car.gearboxtype?.name == "CVT"){
                        this.disableGears = true;
                        car.gears = 1;
                    }
                });
                console.log('DATA', this.data);
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
        ScrollPanel,
        FileUpload,
        Badge,
        ProgressBar,
        ProgressSpinner,
        InputSwitch
    },
    methods: {
        openNew() {
            this.getAll();
            this.car = {};
            this.bid = {};
            this.imgUrl = '';
            this.firstReg = {year: null, month: null};
            this.imageFiles = [];
            this.selectedOptions = [];
            this.isExistingCar = false;
            this.submitted = false;
            this.carDialog = true;
            this.$nextTick(() => {
                if (this.$refs.firstReg) {
                    this.$refs.firstReg.clearValue();
                }
            });
        },
        editCar(car){
            this.imgUrl = '';
            this.firstReg = {year: null, month: null};
            this.imageFiles = [];
            this.selectedOptions = [];
            this.isExistingCar = true;
            this.isLoading = true;
            if(car.firstReg){
                this.firstReg.year = parseInt(car.firstReg.split('-')[0]);
                this.firstReg.month =  parseInt(car.firstReg.split('-')[1]) - 1;
            }
            this.selectedOptions = car.options.map(option => {
                return {
                    id: option.id,
                    name: option.name
                };
            });
            this.$store.dispatch('cars/getcar', car.id).then(
                res => {
                    this.uploadedPicsLength = res.carpictures.length;
                    this.car = res;
                    if(this.car.isBid){
                        console.log(this.bidDateRange);
                        this.isBid = true;
                        this.bidDisabled = true;
                        this.$store.dispatch('bid/getbid', this.car.id).then(
                            res => {
                                this.bidDateRange = [new Date(res.bidStartDate), new Date(res.bidEndDate)];
                                this.bid = res;
                            },
                            error => {
                                this.message = (error.response && error.response.data.message) ||
                                                    error.message ||
                                                    error.toString();
                                                    this.successful = false;
                            }
                        );
                    }
                    this.getAll();
                    this.getModelsFromId(car.make.id);
                    this.carDialog = true;
                    this.$nextTick(() => {
                        if (this.$refs.firstReg) {
                            this.$refs.firstReg.clearValue();
                        }
                    });
                    this.submitted = false;
                    this.isLoading = false;
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                            error.message ||
                                            error.toString();
                                            this.successful = false;
                }
            );
        },
        saveCar(){
            if(this.isBid){
                this.car.isBid = true;
            }
            if(!this.isExistingCar){
                this.car.carpictures = [];
            }
            var index = this.data.findIndex(item => item.id === this.car.id);
            this.submitted = true;
            this.car.firstReg = this.firstReg?.year + '-' + (this.firstReg?.month + 1) + '-01';
            this.car.options = this.selectedOptions;
            this.car.imageFiles = this.imageFiles;
            Promise.all(this.imageFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result.split(',')[1];
                        resolve({ base64url: base64String });
                    };
                    reader.onerror = error => {
                        reject({ error });
                    };
                    reader.readAsDataURL(file);
                });
            }))
            .then(results => {
                results.forEach(result => {
                    if (result.error) {
                        console.log('Problème lors de la conversion de l\'image en base64', result.error);
                    } else {
                        this.car.carpictures.push(result);
                    }
                });
            })
            if(this.car?.make && this.car?.model && this.car?.year && this.car?.power && (this.car?.price || this.car?.price == 0) && this.car?.kilometers && this.car?.description?.trim()){
                if(this.car.description.length <= 2000){
                    if(this.car?.firstReg.startsWith('undefined')){
                        delete this.car.firstReg;
                    }
                    if(!this.isExistingCar){
                        this.$store.dispatch('cars/addcar', this.car).then(
                            res => {
                                if(this.isBid){
                                    this.bid.carId = res.id;
                                    this.bid.currentPrice = this.bid.startingPrice;
                                    this.bid.bidStartDate = this.bidDateRange[0];
                                    this.bid.bidEndDate = this.bidDateRange[1];
                                    this.$store.dispatch('bid/addbid', this.bid).then(
                                        res => {
                                            console.log(res);
                                        },
                                        error => {
                                            this.message = (error.response && error.response.data.message) ||
                                                                error.message ||
                                                                error.toString();
                                                                this.successful = false;
                                            this.$toast.add({ severity: 'error', summary: 'Erreur', detail: this.message, life: 3000 });
                                        }
                                    );
                                }
                                this.$toast.add({severity:'success', summary: 'Succès', detail: res.message, life: 3000});
                                this.car.id = res.id;
                                this.data.push(this.car);
                                this.car = {};
                                this.isBid = false;
                                this.bid = {};
                                this.carDialog = false;
                            },
                            error => {
                                this.message = (error.response && error.response.data.message) ||
                                                    error.message ||
                                                    error.toString();
                                                    this.successful = false;
                                this.$toast.add({ severity: 'error', summary: 'Erreur', detail: this.message, life: 3000 });
                            }
                        );
                        this.imgUrl = '';
                        this.firstReg = {};
                        this.imageFiles = [];
                        this.selectedOptions = [];
                    } else {
                        this.$store.dispatch('cars/editcar', this.car).then(
                            res => {
                                if(this.isBid){
                                    this.bid.carId = this.car.id;
                                    this.bid.currentPrice = this.bid.startingPrice;
                                    this.bid.bidStartDate = this.bidDateRange[0];
                                    this.bid.bidEndDate = this.bidDateRange[1];
                                    this.$store.dispatch('bid/addbid', this.bid).then(
                                        res => {
                                            console.log(res);
                                        },
                                        error => {
                                            this.message = (error.response && error.response.data.message) ||
                                                                error.message ||
                                                                error.toString();
                                                                this.successful = false;
                                            this.$toast.add({ severity: 'error', summary: 'Erreur', detail: this.message, life: 3000 });
                                        }
                                    );
                                }
                                this.isBid = false;
                                this.bid = {};
                                this.$toast.add({severity:'success', summary: 'Succès', detail: res.message, life: 3000});
                                this.data.splice(index, 1, this.car);
                                this.car = {};
                                this.carDialog = false;
                            },
                            error => {
                                this.message = (error.response && error.response.data.message) ||
                                                    error.message ||
                                                    error.toString();
                                                    this.successful = false;
                                this.$toast.add({ severity: 'error', summary: 'Erreur', detail: this.message, life: 3000 });
                            }
                        );
                        this.imgUrl = '';
                        this.firstReg = {};
                        this.imageFiles = [];
                        this.selectedOptions = [];
                        this.bidDisabled = false;
                    }
                } else {
                    this.$toast.add({severity:'error', summary: 'Erreur', detail: 'La description ne doit pas dépasser 2000 caractères', life: 3000});
                }
            } else {
                this.$toast.add({severity:'error', summary: 'Erreur', detail: 'Informations obligatoires manquantes', life: 3000});
            }
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
            this.data = this.data.filter(val => !this.selectedCars.includes(val));
            this.$store.dispatch('cars/deletecars', this.selectedCars).then(
                res => {
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
            this.firstReg = {year: null, month: null};
            this.car = {};
            this.bid = {};
            this.isBid = false;
            this.bidDisabled = false;
            this.imgUrl = '';
            this.submitted = false;
            this.imageFiles = [];
            this.selectedOptions = [];
        },
        getModels(event){
            this.$store.dispatch('cars/getmodels', event.value.id).then(
                res => {
                    this.models = res;
                    this.models.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
        },
        getModelsFromId(id){
            this.$store.dispatch('cars/getmodels', id).then(
                res => {
                    this.models = res;
                    this.models.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
        },
        onSelect(event){
            event.files.forEach(file => {
                this.imageFiles.push(file);
            });
        },
        formatSize(bytes) {
            const k = 1024;
            const dm = 3;
            const sizes = this.$primevue.config.locale.fileSizeTypes;

            if (bytes === 0) {
                return `0 ${sizes[0]}`;
            }

            const i = Math.floor(Math.log(bytes) / Math.log(k));
            const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

            return `${formattedSize} ${sizes[i]}`;
        },
        onRemoveTemplatingFile(file, removeFileCallback, index) {
            removeFileCallback(index);
            this.totalSize -= parseInt(this.formatSize(file.size));
            this.totalSizePercent = this.totalSize / 10;
        },
        getAll(){
            this.$store.dispatch('cars/getallmakes').then(
                res => {
                    this.makes = res;
                    this.makes.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getallcategories').then(
                res => {
                    this.categories = res;
                    this.categories.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getallcolors').then(
                res => {
                    this.colors = res;
                    this.colors.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getallgearboxtypes').then(
                res => {
                    this.gearboxtypes = res;
                    this.gearboxtypes.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getalldrivetrains').then(
                res => {
                    this.drivetrains = res;
                    this.drivetrains.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getalleuros').then(
                res => {
                    this.euroclasses = res;
                    this.euroclasses.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getalladmissiontypes').then(
                res => {
                    this.admissiontypes = res;
                    this.admissiontypes.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getallfueltypes').then(
                res => {
                    this.fueltypes = res;
                    this.fueltypes.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
            this.$store.dispatch('cars/getalloptions').then(
                res => {
                    this.options = res;
                    this.options.sort((a, b) => a.name.localeCompare(b.name));
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            });
        },
        removePic(pic){
            this.car.carpictures = this.car.carpictures.filter(picture => picture.id != pic.id);
        },
        updateCar(car){
            this.car = car;
            if(this.car.gearboxtype?.name == "CVT"){
                this.car.gears = 1;
                this.disableGears = true;
            } else {
                this.disableGears = false;
            }
        },
        setBid(){
            if(this.isBid){
                this.car.price = 0;
                this.priceDisabled = true;
            }
        }
    }
}
</script>