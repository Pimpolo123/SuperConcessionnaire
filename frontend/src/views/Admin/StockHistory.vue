<template>
    <div class="card">
        <ConfirmDialog></ConfirmDialog>
        <Toast/>
        <DataView :value="data" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5">
            <template #empty>
                <div class="p-text-center p-text-secondary p-text-bold p-text-uppercase p-text-italic">Aucune voiture</div>
            </template>
            <template #header>
                Ventes terminées
            </template>
            <template #list="slotProps">
                <div class="container-fluid p-0 m-0">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                        <div class="d-flex column align-items-center p-4 gap-3">
                            <div class="col">
                                <img :src="getImageSource(item.carpictures[0]?.base64url)" alt="photo" width="200"/>
                            </div>
                            <div class="col">
                                <div class="font-weight-bold">Véhicule : 
                                    <span class="font-weight-normal">{{ item.make.name }} {{ item.model.name }} de {{ item.year }}</span>
                                </div>
                                <div class="font-weight-bold">Client : 
                                    <span class="font-weight-normal">{{ item.sale?.user.name }} {{ item.sale?.user.surname }}</span>
                                </div>
                            </div>
                            <div class="col">
                                <div class="font-weight-bold">Date de vente : 
                                    <span class="font-weight-normal">{{ item.sale?.date }}</span>
                                </div>
                                <div class="font-weight-bold">Numéro de la vente : 
                                    <span class="font-weight-normal">{{ item.sale?.id }}</span>
                                </div>
                                <div class="font-weight-bold">Montant : 
                                    <span class="font-weight-normal">{{ item.price }} €</span>
                                </div>
                            </div>
                            <div class="d-flex gap-5">
                                <div class="d-flex gap-2">
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
import ConfirmDialog from 'primevue/confirmdialog';
import 'primeicons/primeicons.css';

export default {
    data() {
        return {
            currentUser: this.$store.state.auth.user,
            userFavorites: [],
            data: [],
            staticData: [],
            sortKey: null,
            sortOrder: null,
            sortField: null,
            car: {},
            carDialog: false,
            sales: [],
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
        };
    },
    beforeCreate() {
        this.$store.dispatch('cars/getallcars').then(
            cars => {
                this.data = cars;
                this.$store.dispatch('cars/getsales').then(
                    sales => {
                        this.sales = sales;
                        this.data.forEach(car => {
                            if(car.gearboxtype?.name == "CVT"){
                                car.gears = 1;
                            }
                            if(!car.sold){
                                this.data = this.data.filter(item => item.id !== car.id);
                            }
                            const sale = sales.find(s => s.carId === car.id);
                            if (sale) {
                                sale.date = new Date(sale.createdAt).toLocaleDateString();
                                car.sale = sale; 
                            }
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
        ConfirmDialog
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
            this.messageContent = '';
            this.car = {};
            this.images = [];
        },
        next() {
            this.activeIndex = this.activeIndex === this.images.length - 1 ? this.images.length - 1 : this.activeIndex + 1;
        },
        prev() {
            this.activeIndex = this.activeIndex === 0 ? 0 : this.activeIndex - 1;
        },
    }
};
</script>
<style>
.p-galleria-thumbnail-container button{
    display: none;
}
</style>

