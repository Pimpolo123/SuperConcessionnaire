<template>
    <ConfirmDialog></ConfirmDialog>
    <Toast/>
    <DataView :value="data" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5">
        <template #empty>
            <div class="p-text-center p-text-secondary p-text-bold p-text-uppercase p-text-italic">Aucune enchère</div>
        </template>
        <template #header>
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier" @change="onSortChange($event)" />
        </template>
        <template #list="slotProps">
            <div class="container-fluid p-0 m-0">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div class="d-flex column align-items-center p-4 gap-3">
                        <div class="col">
                            <img :src="getImageSource(item.carpictures[0]?.base64url)" alt="photo" width="100"/>
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
                                    <vue-countdown :time="item.bid.time" :interval="100" v-slot="{ days, hours, minutes, seconds, milliseconds }">
                                        {{ days }} jours, {{ hours }} heures, {{ minutes }} minutes, {{ seconds }} secondes.
                                    </vue-countdown>
                                </span>
                            </div>
                            <div class="font-weight-bold" v-else>Commence dans : 
                                <span class="font-weight-normal">
                                    <vue-countdown :time="item.bid.time" :interval="100" v-slot="{ days, hours, minutes, seconds, milliseconds }">
                                        {{ days }} jours, {{ hours }} heures, {{ minutes }} minutes, {{ seconds }} secondes.
                                    </vue-countdown>
                                </span>
                            </div>
                        </div>
                        <div class="d-flex gap-5">
                            <span class="text-xl font-semibold text-900 align-self-center">€{{ item.bid.currentPrice }}</span>
                            <div class="d-flex gap-2">
                                <Button icon="pi pi-trash" outlined rounded class="mr-2" severity="danger" @click="confirmDeleteBid(item)" v-tooltip.top="'Supprimer l\'enchère'"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>
</template>

<script>
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import VueCountdown from '@chenfengyuan/vue-countdown';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

export default {
    name: "CarManagement",
    data() {
        return {
            data: [],
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
            now: new Date()
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
        ConfirmDialog,
        Toast
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
        confirmDeleteBid(car) {
            this.$confirm.require({
                message: 'Etes-vous sur de vouloir enchérir ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Annuler',
                acceptLabel: 'Enchèrir',
                accept: () => {
                    this.deleteBid(car.bid);
                    this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Enchère envoyée', life: 3000 });
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulé', detail: 'Action annulée', life: 1000 });
                }
            });
        },
        deleteBid(bid) {
            console.log(bid);
            this.$store.dispatch('bid/deletebid', bid).then(
                res => {
                    this.data = this.data.filter(item => item.bid.id !== bid.id);
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
                }
            );
        },
    }
}
</script>