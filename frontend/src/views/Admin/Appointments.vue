<template>
    <div class="card">
        <ConfirmDialog></ConfirmDialog>
        <Toast/>
        <DataView :value="data" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5">
            <template #empty>
                <div class="p-text-center p-text-secondary p-text-bold p-text-uppercase p-text-italic">Aucun rendez-vous</div>
            </template>
            <template #header>
                header
            </template>
            <template #list="slotProps">
                <div class="container-fluid p-0 m-0">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                        <div class="d-flex column align-items-center p-4 gap-3">
                            <div class="col">
                                <div class="font-weight-bold">Numéro de réservation : 
                                    <span class="font-weight-normal">{{ item.id }}</span>
                                </div>
                                <div class="font-weight-bold">Date et heure du rendez-vous : 
                                    <span class="font-weight-normal">{{ item.day }} à {{ item.time }}:00</span>
                                </div>
                            </div>
                            <div class="col">
                                <div class="font-weight-bold">Nom du client : 
                                    <span class="font-weight-normal">{{ item.user.name }} {{ item.user.surname }}</span>
                                </div>
                                <div class="font-weight-bold">Numéro de téléphone du client : 
                                    <span class="font-weight-normal" v-if="item.user.phonenumber">{{ item.user.phonenumber }}</span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </div>
                            </div>
                            <div class="d-flex gap-5">
                                <div class="d-flex gap-2">
                                    <Button icon="pi pi-trash" label="Supprimer le rendez-vous" class="flex-auto md:flex-initial white-space-nowrap" @click="confirmDeleteAppointment(item)"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
        <Dialog v-model:visible="appointmentDialog" :style="{width: '100%'}" header="Détails du rendez-vous" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog">
            <template #footer>
                <Button label="Fermer" icon="pi pi-times" text @click="hideDialog"/>
            </template>
        </Dialog>
    </div>
</template>

<script>
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';
import Textarea from 'primevue/textarea';
import ConfirmDialog from 'primevue/confirmdialog';
import 'primeicons/primeicons.css';

export default {
    data() {
        return {
            currentUser: this.$store.state.auth.user,
            data: [],
            appointmentDialog: false,
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
            sortOrder: null,
            sortField: null,
            sortKey: null,
        };
    },
    mounted() {
        this.$store.dispatch('appointment/getall').then(
            res => {
                this.data = res.filter(item => {
                const appointmentDate = new Date(item.day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                return appointmentDate >= today;
            });
            },
        )
    },
    components: {
        DataView,
        Button,
        Toast,
        Dialog,
        Card,
        Textarea,
        ConfirmDialog
    },
    methods: {
        hideDialog() {
            this.appointmentDialog = false;
        },
        confirmDeleteAppointment(item){
            this.$confirm.require({
                message: `Voulez-vous vraiment supprimer ce rendez-vous ? L'utilisateur sera notifié`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Annuler',
                acceptLabel: 'Supprimer',
                accept: () => {
                    this.deleteAppointment(item);
                },
                reject: () => {
                    this.$toast.add({severity:'info', summary:'Annulé', detail:'Action annulée', life: 3000});
                }
            });
        },
        deleteAppointment(appointment) {
            this.$store.dispatch('appointment/deleteappointment', appointment.id).then(
                res => {
                    this.data = this.data.filter(item => item.id !== appointment.id);
                    this.$toast.add({severity:'success', summary:'Succès', detail:'Rendez-vous supprimé', life: 3000});
                    this.$store.dispatch('user/addmessage', {
                        content: `Votre rendez-vous du ${appointment.day} a été supprimé par l'administrateur`,
                        toUserId: appointment.user.id,
                        type: 'message',
                        userId: this.currentUser.id,
                    }).then(
                        res => {
                            console.log(res);
                            this.$toast.add({severity:'success', summary:'Succès', detail:'Message envoyé', life: 3000});
                        },
                        err => {
                            this.$toast.add({severity:'error', summary:'Erreur', detail:`Erreur lors de l'envoi du message`, life: 3000});
                        }
                    );
                },
                err => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail:'Erreur lors de la suppression du rendez-vous', life: 3000});
                }
            );
        }
    }
};
</script>