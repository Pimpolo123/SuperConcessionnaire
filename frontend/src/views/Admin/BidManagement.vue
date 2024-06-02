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
                            <div class="font-weight-bold" v-else-if="!item.bid.isStarted && item.bid.isOver">Enchère terminée
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
                                <Button icon="pi pi-envelope" rounded class="mr-2" @click="contactWinner(item)" v-tooltip.top="'Contacter le gagnant'" v-if="item.bid.isOver"/>
                                <Button icon="pi pi-trash" outlined rounded class="mr-2" severity="danger" @click="confirmDeleteBid(item)" v-tooltip.top="'Supprimer l\'enchère'"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>
    <Dialog v-model:visible="bidMessageDialog" :style="{width: '100%'}" header="Envoyer un message au gagnant" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog">
        <div class="container-fluid">
            <div class="row mt-3">
                <div class="col-md-12">
                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="font-weight-bold">Destinataire : 
                                <span class="font-weight-normal">{{ this.car.biggestBidder.name }} {{ this.car.biggestBidder.surname }}</span>
                            </div>
                            <div class="font-weight-bold">Véhicule : 
                                <span class="font-weight-normal">{{ this.car.make.name }} {{ this.car.model.name }} {{ this.car.year }}</span>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="font-weight-bold">Votre message : 
                                <Textarea v-model="messageContent" rows="5" cols="100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button icon="pi pi-envelope" type="button" label="Envoyer" class="flex-auto md:flex-initial white-space-nowrap ml-3" @click="confirmSendMessage(this.car)"></Button>
            <Button label="Fermer" icon="pi pi-times" text @click="hideDialog"/>
        </template>
    </Dialog>
</template>

<script>
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import VueCountdown from '@chenfengyuan/vue-countdown';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

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
            bidMessageDialog: false,
            messageContent: `Vous avez remporté l\'enchère, veuillez me contacter pour finaliser la transaction.`,
            dealerInformations: {}
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
                        } else if ((bid.bidStartDate.getTime() < this.now.getTime()) && (bid.bidEndDate.getTime() > this.now.getTime())){
                            bid.isStarted = true;
                            bid.time = bid.bidEndDate.getTime() - this.now.getTime();
                        } else if(bid.bidEndDate.getTime() < this.now.getTime()){
                            bid.isStarted = false;
                            bid.isOver = true;
                            bid.time = this.now.getTime() - bid.bidEndDate.getTime();
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
        this.$store.dispatch('admin/getdealerinformations').then(
            res => {
                this.dealerInformations = res;
                this.messageContent = `Vous avez remporté l\'enchère, veuillez me contacter au ${this.dealerInformations.phoneNumber} pour finaliser la transaction.`
            },
            error => {
                console.log(error.response);
            }
        );
    },
    components: {
        DataView,
        Button,
        Dropdown,
        VueCountdown,
        ConfirmDialog,
        Toast,
        Dialog,
        Textarea
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
            this.car = {};
            this.bidMessageDialog = false;
        },
        confirmDeleteBid(car) {
            this.$confirm.require({
                message: 'Etes-vous sur de vouloir enchérir ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Annuler',
                acceptLabel: 'Supprimer',
                accept: () => {
                    this.deleteBid(car.bid);
                    this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Enchère supprimée', life: 3000 });
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
                    this.$store.dispatch('cars/setbid', {carId: bid.carId, isBid: false}).then(
                        res => {
                            console.log('Voiture mise à jour : ', res)
                            this.$toast.add({ severity: 'info', summary: 'Annulé', detail: 'Enchère annulée, n\'oubliez pas de remettre un prix a la voiture', life: 5000 });
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
        contactWinner(car) {
            this.bidMessageDialog = true;
            console.log(car);
            this.car = car;
        },
        confirmSendMessage(){
            this.$confirm.require({
                message: 'Etes-vous sur de vouloir envoyer ce message ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Annuler',
                acceptLabel: 'Envoyer',
                accept: () => {
                    this.sendMessage();
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulé', detail: 'Action annulée', life: 1000 });
                }
            });
        },
        sendMessage(){
            console.log(this.car);
            this.$store.dispatch('user/addmessage', {
                content: this.messageContent,
                toUserId: this.car.biggestBidder.id,
                type: 'bidwin',
                userId: this.currentUser.id,
                carId: this.car.id
            }).then(
                res => {
                    this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                    this.hideDialog();
                },
                error => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                    this.hideDialog();
                }
            );
        }
    }
}
</script>