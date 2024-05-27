<template>
    <ConfirmDialog></ConfirmDialog>
    <DataView :value="data" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5">
        <template #header>
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier" @change="onSortChange($event)" />
        </template>
        <template #list="slotProps">
            <div class="container-fluid p-0 m-0">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div class="d-flex column align-items-center p-4 gap-3">
                        <div class="col">
                            <img :src="getImageSource(item.carpictures[0]?.base64url)" alt="photo" width="100" @click="openDetails(item)"/>
                        </div>
                        <div class="col">
                            <div class="font-weight-bold">Plus gros enchèrisseur : 
                                <span class="font-weight-normal" v-if="item.biggestBidder">{{ item.biggestBidder.name }} {{ item.biggestBidder.surname }}</span>
                                <span class="font-weight-normal" v-else>Pas d'enchères</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="font-weight-bold">Modèle : 
                                <span class="font-weight-normal">{{ item.make.name }} {{ item.model.name }} de {{ item.year }}</span>
                            </div>
                            <div class="font-weight-bold">Kilométrage : 
                                <span class="font-weight-normal">{{ item.kilometers }} Km</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="font-weight-bold" v-if="item.bid.isStarted">Temps restant : 
                                <span class="font-weight-normal">
                                    <vue-countdown :time="item.bid.time" :interval="100" v-slot="{ days, hours, minutes, seconds }">
                                        {{ days }} jours, {{ hours }} heures, {{ minutes }} minutes, {{ seconds }} secondes.
                                    </vue-countdown>
                                </span>
                            </div>
                            <div class="font-weight-bold" v-else>Commence dans : 
                                <span class="font-weight-normal">
                                    <vue-countdown :time="item.bid.time" :interval="100" v-slot="{ days, hours, minutes, seconds }">
                                        {{ days }} jours, {{ hours }} heures, {{ minutes }} minutes, {{ seconds }} secondes.
                                    </vue-countdown>
                                </span>
                            </div>
                        </div>
                        <div class="d-flex gap-5 col">
                            <div class="font-weight-bold"> Enchère actuelle : 
                                <span class="text-xl font-semibold font-weight-normal text-900 align-self-center">{{ item.bid.currentPrice }}€</span>
                            </div>
                            <div class="col">
                                <label for="bid">Enchère</label>
                                <InputNumber id="bid" type="number" class="col-2" :placeholder="item.bid.inputText" :invalid="item.bid.bidError" v-model="item.bid.newBid"/>
                                <small class="p-error" v-if="item.bid.bidError">Entrez une enchère valide</small>
                            </div>
                        </div>
                        <div class="d-flex gap-2 col">
                            <Button icon="pi pi-euro" outlined rounded class="ml-3" @click="confirmBid(item)" v-tooltip.top="'Enchèrir'"/>
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
                                    <div class="font-weight-bold">Enchère la plus haute : 
                                        <span class="font-weight-normal">{{ car.bid.currentPrice }} €</span>
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
</template>

<script>
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import VueCountdown from '@chenfengyuan/vue-countdown';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Galleria from 'primevue/galleria';
import ConfirmDialog from 'primevue/confirmdialog';

export default {
    name: "CarManagement",
    data() {
        return {
            data: [],
            car: {},
            currentUser: JSON.parse(localStorage.getItem('user')),
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
            sortKey: null,
            sortOrder: null,
            sortField: null,
            bids: [],
            now: new Date(),
            carDialog: false,
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
            images: [],
            activeIndex: 0,
            newBid: null,
        }
    },
    created() {
    },
    mounted() {
        this.$store.dispatch('bid/getallbids').then(
            res => {
                this.bids = res;
                this.bids.forEach(bid => {
                    this.$store.dispatch('cars/getcar', bid.carId).then(
                    res => {
                        bid.bidStartDate = new Date(bid.bidStartDate);
                        bid.bidEndDate = new Date(bid.bidEndDate);
                        bid.bidError = false;
                        bid.inputText = '(minimum ' + bid.minimumBid + '€ de plus)';
                        if(bid.bidStartDate.getTime() > this.now.getTime()){
                            bid.isStarted = false;
                            bid.time = bid.bidStartDate.getTime() - this.now.getTime();
                        } else {
                            bid.isStarted = true;
                            bid.time = bid.bidEndDate.getTime() - this.now.getTime();
                        }
                        this.$store.dispatch('user/getuser', bid.userId).then(
                            user => {
                                res.biggestBidder = user;
                                res.bid = bid; //ajoute le bid a la voiture
                                this.data.push(res);
                            }
                        );
                    }
                );
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
    components: {
        DataView,
        Button,
        Dropdown,
        VueCountdown,
        InputNumber,
        Dialog,
        Card,
        Galleria,
        ConfirmDialog,
    },
    methods: {
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
        openDetails(car) {
            console.log(car);
            this.$store.dispatch('cars/getcar', car.id).then(
                res => {
                    this.carDialog = true;
                    this.car = car;
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
        confirmBid(car) {
            car.bid.bidError = false;
            if(car.bid.newBid < (car.bid.minimumBid + car.bid.currentPrice)){
                car.bid.bidError = true;
                return;
            }
            this.$confirm.require({
                message: 'Etes-vous sur de vouloir enchérir ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Annuler',
                acceptLabel: 'Enchèrir',
                accept: () => {
                    car.bid.currentPrice = car.bid.newBid;
                    this.sendBid(car.bid);
                    this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Enchère envoyée', life: 3000 });
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulé', detail: 'Action annulée', life: 1000 });
                }
            });
        },
        sendBid(bid) {
            console.log(bid.id);
            console.log(bid.currentPrice);
        },
    }
}
</script>