<template>
    <div class="card">
        <Toast />
        <DataView :value="data" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5">
            <template #header>
                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier" @change="onSortChange($event)" />
                <Button icon="pi pi-filter" type="button" label="Filtrer" class="flex-auto md:flex-initial white-space-nowrap ml-3" @click="openFilters"></Button>
                <Button icon="pi pi-filter-slash" type="button" label="Réinitialiser les filtres" class="flex-auto md:flex-initial white-space-nowrap ml-3" @click="resetFilters"></Button>
            </template>
            <template #list="slotProps">
                <div class="container-fluid p-0 m-0">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                        <div class="d-flex column align-items-center p-4 gap-3">
                            <div class="col">
                                <img :src="getImageSource(item.carpictures[0]?.base64url)" alt="photo" width="100"/>
                            </div>
                            <div class="col">
                                <div class="font-weight-bold">Modèle : 
                                    <span class="font-weight-normal">{{ item.make.name }} {{ item.model.name }} de {{ item.year }}</span>
                                </div>
                                <div class="font-weight-bold">Kilométrage : 
                                    <span class="font-weight-normal">{{ item.kilometers }} Km</span>
                                </div>
                                <div class="font-weight-bold">Carburant : 
                                    <span class="font-weight-normal" v-if="item.fueltype">{{ item.fueltype.name }}</span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </div>
                            </div>
                            <div class="col">
                                <div class="font-weight-bold">1ère immatriculation : 
                                    <span class="font-weight-normal" v-if="item.firstReg">{{ item.firstReg.split('-')[0] + '-' + item.firstReg.split('-')[1] }}</span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </div>
                                <div class="font-weight-bold">Boite de vitesse : 
                                    <span class="font-weight-normal" v-if="item.gearboxtype">{{ item.gearboxtype.name }} <span v-if="item.gearboxtype.name != 'CVT'">{{ item.gears }} vitesses</span></span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </div>
                            </div>
                            <div class="d-flex gap-5">
                                <span class="text-xl font-semibold text-900 align-self-center">€{{ item.price }}</span>
                                <div class="d-flex gap-2">
                                    <Button :icon="getFavIcon(item)" outlined @click="fav(item)"></Button>
                                    <Button icon="pi pi-eye" label="Voir le véhicule" class="flex-auto md:flex-initial white-space-nowrap" @click="openDetails(item)"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
        <Dialog v-model:visible="carDialog" :style="{width: '100%'}" header="Détails de la voiture" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog">
            <div class="container-fluid">
                <div class="row mt-3" name="baseInfos">
                    <div class="col-md-12">
                        <Card>
                            <template #title>Informations de base</template>
                            <template #content>
                                <div class="row mt-4">
                                    <div class="col-md-4">
                                        <div class="font-weight-bold">Modèle : 
                                            <span class="font-weight-normal">{{ car.make.name }} {{ car.model.name }} de {{ car.year }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="font-weight-bold">Prix : 
                                            <span class="font-weight-normal">{{ car.price }} €</span>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="font-weight-bold">Kilométrage : 
                                            <span class="font-weight-normal">{{ car.kilometers }} Km</span>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="font-weight-bold">Première immatriculation : 
                                            <span class="font-weight-normal" v-if="car.firstReg">{{ car.firstReg.split('-')[0] + '-' + car.firstReg.split('-')[1] }}</span>
                                            <span class="font-weight-normal" v-else>N/A</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="font-weight-bold">Description : 
                                            <span class="font-weight-normal">{{ car.description }}</span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
                <div class="row mt-3" name="addInfos">
                    <Card>
                        <template #title>Informations complémentaires</template>
                        <template #content>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="font-weight-bold">Catégorie : 
                                        <span class="font-weight-normal" v-if="car.category">{{ car.category.name }}</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="font-weight-bold">Boîte de vitesses : 
                                        <span class="font-weight-normal" v-if="car.gearboxtype">{{ car.gearboxtype.name }} <span v-if="car.gearboxtype.name != 'CVT'">{{ car.gears }} vitesses</span></span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="font-weight-bold">Transmission : 
                                        <span class="font-weight-normal" v-if="car.drivetrain">{{ car.drivetrain.name }}</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="font-weight-bold">Carburant : 
                                        <span class="font-weight-normal" v-if="car.fueltype">{{ car.fueltype.name }}</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="font-weight-bold">Puissance : 
                                        <span class="font-weight-normal" v-if="car.power">{{ car.power }} kW</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="font-weight-bold">Type d'admission : 
                                        <span class="font-weight-normal" v-if="car.admissiontype">{{ car.admissiontype.name }}</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="font-weight-bold">Couleur : 
                                        <span class="font-weight-normal" v-if="car.color">{{ car.color.name }}</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="font-weight-bold">Cylindrée : 
                                        <span class="font-weight-normal" v-if="car.displacement">{{ car.displacement }} cm³</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <span class="font-weight-bold" v-if="car.cylinders">{{ car.cylinders }} cylindres</span>
                                    <span class="font-weight-bold" v-else></span>
                                </div>
                                <div class="col-md-3">
                                    <span class="font-weight-bold" v-if="car.doors">{{ car.doors }} portes</span>
                                    <span class="font-weight-bold" v-else></span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="font-weight-bold">Options : 
                                        <span class="font-weight-normal" v-if="car.options">{{ car.options.map(option => option.name).join(', ') }}</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
                <div class="row mt-3" name="consInfos">
                    <Card>
                        <template #title>Consommation et émissions</template>
                        <template #content>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="font-weight-bold">Emissions de CO2 (g/km) : 
                                        <span class="font-weight-normal" v-if="car.co2">{{ car.co2 }} g/km</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="font-weight-bold">Catégorie EURO : 
                                        <span class="font-weight-normal" v-if="car.euro">{{ car.euro.name }}</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="font-weight-bold">Consommation </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="font-weight-bold">Urbaine (l/100km) :
                                        <span class="font-weight-normal" v-if="car.urbanCons">{{ car.urbanCons }} l/100km</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="font-weight-bold">Mixte (l/100km) :
                                        <span class="font-weight-normal" v-if="car.mixCons">{{ car.mixCons }} l/100km</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="font-weight-bold">Autoroute (l/100km) : 
                                        <span class="font-weight-normal" v-if="car.hwCons">{{ car.hwCons }} l/100km</span>
                                        <span class="font-weight-normal" v-else>N/A</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
                <div class="row mt-3" name="pictures">
                    <Card>
                        <template #title>Photos</template>
                        <template #content>
                            <div class="col-md-12">
                                <div class="mb-3 d-flex justify-content-center">
                                    <Button icon="pi pi-arrow-left" @click="prev" class="ml-2 mt-2"/>
                                    <Button icon="pi pi-arrow-right" @click="next" class="ml-2 mt-2" />
                                </div>
                                <Galleria v-model:activeIndex="activeIndex" :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 100%">
                                    <template #item="slotProps">
                                        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" height="300"/>
                                    </template>
                                    <template #thumbnail="slotProps">
                                        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" width="50">
                                    </template>
                                </Galleria>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
            <template #footer>
                <Button label="Fermer" icon="pi pi-times" text @click="hideDialog"/>
            </template>
        </Dialog>

        <OverlayPanel ref="op">
            <div class="flex flex-column gap-3 w-25rem">
                <div class="row">
                    <label for="makesDrop" class="mb-1">Marque</label>
                    <Dropdown name="makesDrop" v-model="filteredMake" :options="makes" optionLabel="name" placeholder="Sélectionner une marque" class="w-full md:w-40rem mb-3" @change="filterByMake"/>
                </div>
                <div class="row">
                    <label for="categoriesDrop" class="mb-1">Catégorie</label>
                    <Dropdown name="categoriesDrop" v-model="filteredCategory" :options="categories" optionLabel="name" placeholder="Sélectionner une catégorie" class="w-full md:w-40rem mb-3" @change="filterByCategory(filteredCategory)"/>
                </div>
                <div class="row">
                    <label for="colorDrop" class="mb-1">Couleur</label>
                    <Dropdown name="colorDrop" v-model="filteredColor" :options="colors" optionLabel="name" placeholder="Sélectionner une couleur" class="w-full md:w-40rem mb-3" @change="filterByColor"/>
                </div>
                <div class="row">
                    <label for="gearboxDrop" class="mb-1">Boîte de vitesses</label>
                    <Dropdown name="gearboxDrop" v-model="filteredGearbox" :options="gearboxtypes" optionLabel="name" placeholder="Sélectionner un type de boîte" class="w-full md:w-40rem mb-3" @change="filterByGearboxtype"/>
                </div>
                <div class="row">
                    <label for="drivetrainDrop" class="mb-1">Transmission</label>
                    <Dropdown name="drivetrainDrop" v-model="filteredDrivetrain" :options="drivetrains" optionLabel="name" placeholder="Sélectionner une transmission" class="w-full md:w-40rem mb-3" @change="filterByDrivetrain"/>
                </div>
                <div class="row">
                    <label for="euroDrop" class="mb-1">Catégorie EURO</label>
                    <Dropdown name="euroDrop" v-model="filteredEuro" :options="euroclasses" optionLabel="name" placeholder="Sélectionner une catégorie EURO" class="w-full md:w-40rem mb-3" @change="filterByEuro"/>
                </div>
                <div class="row">
                    <label for="fueltypeDrop" class="mb-1">Carburant</label>
                    <Dropdown name="fueltypeDrop" v-model="filteredFueltype" :options="fueltypes" optionLabel="name" placeholder="Sélectionner un carburant" class="w-full md:w-40rem mb-3" @change="filterByFueltype"/>
                </div>
            </div>
        </OverlayPanel>
    </div>
</template>

<script>
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Galleria from 'primevue/galleria';
import Card from 'primevue/card';
import OverlayPanel from 'primevue/overlaypanel';
import 'primeicons/primeicons.css';

export default {
    data() {
        return {
            currentUser: this.$store.state.auth.user,
            userFavorites: [],
            data: null,
            staticData: null,
            sortKey: null,
            sortOrder: null,
            sortField: null,
            car: {},
            carDialog: false,
            activeIndex: 0,
            files: [],
            images: [],
            responsiveOptions: [
                {
                    breakpoint: '1300px',
                    numVisible: 4
                },
                {
                    breakpoint: '575px',
                    numVisible: 1
                }
            ],
            sortOptions: [
                { label: 'Prix décroissant', value: '!price' },
                { label: 'Prix croissant', value: 'price' },
                { label: 'Kilométrage décroissant', value: '!kilometers' },
                { label: 'Kilométrage croissant', value: 'kilometers' },
                { label: 'Année décroissante', value: '!year' },
                { label: 'Année croissante', value: 'year' },
                { label: 'Puissance décroissante', value: '!power' },
                { label: 'Puissance croissante', value: 'power' },
            ],
            makes: [],
            colors: [],
            gearboxtypes: [],
            drivetrains: [],
            euroclasses: [],
            admissiontypes: [],
            fueltypes: [],
            options: [],
            categories: [],
            filteredMake: null,
            filteredCategory: null,
            filteredColor: null,
            filteredGearbox: null,
            filteredDrivetrain: null,
            filteredEuro: null,
            filteredFueltype: null,
        };
    },
    mounted() {
        this.getAll();
        this.$store.dispatch('cars/getallcars').then(
            res => {
                this.data = res;
                console.log('DATA', this.data);
                this.staticData = res;
            },
            error => {
                this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            }
        );
        this.$store.dispatch('user/getfavorites', this.currentUser.id).then(
            res => {
                this.userFavorites = res;
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
        DataView,
        Dropdown,
        Button,
        Toast,
        Dialog,
        Galleria,
        Card,
        OverlayPanel
    },
    methods: {
        openDetails(car) {
            this.$store.dispatch('cars/getcar', car.id).then(
                res => {
                    this.carDialog = true;
                    this.car = res;
                    res.carpictures.forEach(pic => {
                        this.images.push({
                            itemImageSrc: 'data:image/png;base64,' + pic.base64url,
                            thumbnailImageSrc: 'data:image/png;base64,' + pic.base64url,
                            alt: "Photo " + pic.id
                        });
                    });
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
                }
            );
        },
        onSortChange(event) {
            const value = event.value.value;
            const sortValue = event.value;

            if (value.indexOf('!') === 0) {
                this.sortOrder = -1;
                this.sortField = value.substring(1, value.length);
                this.sortKey = sortValue;
            } else {
                this.sortOrder = 1;
                this.sortField = value;
                this.sortKey = sortValue;
            }
        },
        getImageSource(imgUrl){
            if(!imgUrl || Object.keys(imgUrl).length == 0){
                return "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            } else {
                return 'data:image/png;base64,' + imgUrl;
            }
        },
        hideDialog() {
            this.carDialog = false;
            this.filterDialog = false;
            this.car = {};
            this.images = [];
        },
        next() {
            this.activeIndex = this.activeIndex === this.images.length - 1 ? this.images.length - 1 : this.activeIndex + 1;
        },
        prev() {
            this.activeIndex = this.activeIndex === 0 ? 0 : this.activeIndex - 1;
        },
        openFilters() {
            this.$refs.op.toggle(event);
        },
        resetFilters(filter = '') {
            this.data = this.staticData;
            if (filter !== 'make') {
                this.filteredMake = null;
            }
            if (filter !== 'category') {
                console.log('TEST');
                this.filteredCategory = null;
            }
            if (filter !== 'color') {
                this.filteredColor = null;
            }
            if (filter !== 'gearboxtype') {
                this.filteredGearbox = null;
            }
            if (filter !== 'drivetrain') {
                this.filteredDrivetrain = null;
            }
            if (filter !== 'euroclass') {
                this.filteredEuro = null;
            }
            if (filter !== 'fueltype') {
                this.filteredFueltype = null;
            }
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
        filterByMake(){
            this.resetFilters('make');
            this.data = this.staticData.filter(car => car.make.id == this.filteredMake.id);
        },
        filterByCategory(f){
            this.resetFilters('category');
            this.data = this.staticData.filter(car => car.categoryId == this.filteredCategory.id);
        },
        filterByColor(){
            this.resetFilters('color');
            this.data = this.staticData.filter(car => car.colorId == this.filteredColor.id);
        },
        filterByGearboxtype(){
            this.resetFilters('gearboxtype');
            this.data = this.staticData.filter(car => car.gearboxtypeId == this.filteredGearbox.id);
        },
        filterByDrivetrain(){
            this.resetFilters('drivetrain');
            this.data = this.staticData.filter(car => car.drivetrainId == this.filteredDrivetrain.id);
        },
        filterByEuro(){
            this.resetFilters('euroclass');
            this.data = this.staticData.filter(car => car.euroId == this.filteredEuro.id);
        },
        filterByFueltype(){
            this.resetFilters('fueltype');
            this.data = this.staticData.filter(car => car.fueltypeId == this.filteredFueltype.id);
        },
        fav(car){
            this.$store.dispatch('user/getfavorites', this.currentUser.id).then(
                res => {
                    this.userFavorites = res;
                    console.log('BEFORE',this.userFavorites);
                    if(!this.userFavorites.some(favorite => favorite.carId === car.id && favorite.userId === this.currentUser.id)){
                        this.addFavorite(car.id);
                    } else {
                        this.removeFavorite(car.id);
                    }
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                            error.message ||
                                            error.toString();
                                            this.successful = false;
                }
            );
        },
        addFavorite(carId){
            this.$store.dispatch('user/addfavorite', {carId: carId, userId: this.currentUser.id}).then(
                res => {
                    if(res.newFavorite[1]){
                        this.userFavorites.push(res.newFavorite[0]);
                        this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                        console.log('ADDED',this.userFavorites);
                    } else {
                        this.$toast.add({severity:'error', summary:'Erreur', detail: 'Déja en favori', life: 3000});
                    }
                },
                error => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                }
            );
        },
        removeFavorite(carId){
            this.$store.dispatch('user/removefavorite', {carId: carId, userId: this.currentUser.id}).then(
                res => {
                    this.userFavorites = this.userFavorites.filter(favorite => favorite.carId !== carId);
                    this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                    console.log('REMOVED',this.userFavorites);
                },
                error => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                }
            );
        },
        getFavIcon(item){
            if(this.userFavorites.some(favorite => favorite.carId === item.id && favorite.userId === this.currentUser.id)){
                return 'pi pi-heart-fill';
            } else {
                return 'pi pi-heart';
            }
        }
    }
};
</script>

