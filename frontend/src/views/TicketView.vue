<template>
    <div class="card">
        <ConfirmDialog></ConfirmDialog>
        <Toast/>
        <DataView :value="data" paginator :rows="5">
            <template #empty>
                <div class="p-text-center p-text-secondary p-text-bold p-text-uppercase p-text-italic">Aucun ticket</div>
            </template>
            <template #header>
                <h3>Tickets en cours</h3>
                <Button label="Nouveau ticket" icon="pi pi-plus" class="mr-2 p-button" @click="openNew" />
            </template>
            <template #list="slotProps">
                <div class="container-fluid p-0 m-0">
                    <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                        <div :class="['p-4', 'gap-3', 'align-items-center', 'd-flex', 'column', { 'bg-success': item.adminResponded}]">
                            <div class="col">
                                <div class="font-weight-bold">Sujet : 
                                    <span class="font-weight-normal">{{ getSubjectLabel(item.subject) }}</span>
                                </div>
                            </div>
                            <div class="col">
                                <div class="font-weight-bold">Date d'envoi : 
                                    <span class="font-weight-normal">{{ item.createdAt }}</span>
                                </div>
                            </div>
                            <!-- <div class="col">
                                <div class="font-weight-bold">Nom du client : 
                                    <span class="font-weight-normal">{{ item.user.name }} {{ item.user.surname }}</span>
                                </div>
                                <div class="font-weight-bold">Numéro de téléphone du client : 
                                    <span class="font-weight-normal" v-if="item.user.phonenumber">{{ item.user.phonenumber }}</span>
                                    <span class="font-weight-normal" v-else>N/A</span>
                                </div>
                            </div> -->
                            <div class="d-flex gap-5">
                                <div class="d-flex gap-2">
                                    <Button icon="pi pi-eye" label="Voir le ticket" class="flex-auto md:flex-initial white-space-nowrap" @click="openViewTicket(item)"></Button>
                                    <Button icon="pi pi-trash" label="Supprimer le ticket" class="flex-auto md:flex-initial white-space-nowrap" @click="confirmDeleteTicket(item)"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
        <Dialog v-model:visible="ticketDialog" :style="{width: '100%'}" header="Créer un ticket" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog">
            <div class="p-field">
                <label for="subject">Sujet</label>
                <Dropdown v-model="selectedSubject" :options="subjects" optionLabel="label" placeholder="Sujet" @change="onSubjectChange()" />
            </div>
            <div class="p-field">
                <label for="message">Message</label>
                <Textarea id="message" v-model="message" autoResize rows="5" :autoComplete="false" />
            </div>
            <template #footer>
                <Button label="Envoyer" icon="pi pi-check" @click="confirmSendTicket"/>
                <Button label="Fermer" icon="pi pi-times" text @click="hideDialog"/>
            </template>
        </Dialog>
        <Dialog v-model:visible="ticketViewDialog" :style="{width: '100%'}" header="Ticket" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog">
            <div class="p-field">
                <h5>Sujet : {{ getSubjectLabel(openTicket.subject) }}</h5>
            </div>
            <div class="p-field">
                <li v-for="message in openTicket.messages">{{ message.user?.surname }} {{ message.user?.name }} : {{ message.content }}</li>
            </div>
            <div class="p-field">
                <Textarea id="response" v-model="responseMessage" autoResize rows="5" :autoComplete="false" class="mt-3" placeholder="Votre réponse"/>
            </div>
            <template #footer>
                <Button label="Répondre" icon="pi pi-check" @click="confirmSendResponse"/>
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
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import 'primeicons/primeicons.css';

export default {
    data() {
        return {
            currentUser: JSON.parse(localStorage.getItem('user')),
            data: [],
            ticketDialog: false,
            ticketViewDialog: false,
            newTicket: {},
            message: '',
            selectedSubject: null,
            openTicket: {},
            subjects: [
                { label: 'Problème technique', value: 'technical' },
                { label: 'Problème de connexion', value: 'connection' },
                { label: 'Question à propos des véhicules', value: 'vehicle' },
                { label: 'Autre', value: 'other' },
            ],
            responseMessage: '',
        };
    },
    mounted() {
        this.$store.dispatch('user/getticketsforuser', this.currentUser.id).then(
            res => {
                console.log(res);
                
                this.data = res;
                this.data.forEach(ticket => {
                    ticket.createdAt = new Date(ticket.createdAt).toLocaleDateString();
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
        ConfirmDialog,
        Dropdown,
        InputText,
    },
    methods: {
        hideDialog() {
            this.ticketDialog = false;
            this.ticketViewDialog = false;
            this.newTicket = {};
            this.openTicket = {};
            this.message = '';
        },
        openNew() {
            this.ticketDialog = true;
        },
        onSubjectChange() {
            console.log(this.selectedSubject);
            
            
        },
        confirmSendTicket() {
            this.$confirm.require({
                message: `Voulez-vous envoyer le ticket ?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Annuler',
                acceptLabel: 'Envoyer',
                accept: () => {
                    this.sendTicket(this.newTicket);
                },
                reject: () => {
                    this.$toast.add({severity:'info', summary:'Annulé', detail:'Action annulée', life: 3000});
                }
            });
        },
        sendTicket(ticket) {
            ticket.subject = this.selectedSubject.value;
            ticket.userId = this.currentUser.id;
            ticket.message = this.message;
            ticket.messages = [];
            ticket.messages.push({
                content: this.message,
                userId: this.currentUser.id,
            });
            ticket.createdAt = new Date().toLocaleDateString();

            this.$store.dispatch('user/addticket', ticket).then(
                res => {
                    ticket.id = res.ticket.id;
                    this.data.push(ticket);
                    this.$toast.add({severity:'success', summary:'Succès', detail:'Ticket envoyé', life: 3000});
                    this.hideDialog();
                    console.log(ticket);
                }
            );
        },
        getSubjectLabel(value) {
            const subject = this.subjects.find(subject => subject.value === value);
            return subject ? subject.label : 'Sujet inconnu';
        },
        openViewTicket(ticket) {
            console.log(ticket);
            this.$store.dispatch('user/getticket', ticket.id).then(
                res => {
                    this.openTicket = res;
                    this.openTicket.messages.forEach(message => {
                        this.$store.dispatch('user/getuser', message.userId).then(
                            user => {
                                message.user = user;
                            }
                        );
                    });
                    this.ticketViewDialog = true;
                }
            );
        },
        confirmSendResponse() {
            console.log(this.openTicket);
            
            this.$confirm.require({
                message: `Voulez-vous envoyer le ticket ?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Annuler',
                acceptLabel: 'Envoyer',
                accept: () => {
                    this.sendResponse();
                },
                reject: () => {
                    this.$toast.add({severity:'info', summary:'Annulé', detail:'Action annulée', life: 3000});
                }
            });
        },
        sendResponse(){
            console.log(this.responseMessage);
            this.openTicket.messages.push({content: this.responseMessage, user: this.currentUser, userId: this.currentUser.id});
            this.$store.dispatch('user/addmessagetoticket', {
                content: this.responseMessage,
                ticketId: this.openTicket.id,
                userId: this.currentUser.id,
                adminResponded: false,
            }).then(
                res => {
                    console.log(res);
                    const ticket = this.data.find(ticket => ticket.id === this.openTicket.id);
                    if (ticket) {
                        ticket.adminResponded = false;
                    }
                    this.responseMessage = '';
                }
            );
        },
        confirmDeleteTicket(ticket) {
            this.$confirm.require({
                message: `Voulez-vous supprimer le ticket ?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Annuler',
                acceptLabel: 'Supprimer',
                accept: () => {
                    this.deleteTicket(ticket);
                },
                reject: () => {
                    this.$toast.add({severity:'info', summary:'Annulé', detail:'Action annulée', life: 3000});
                }
            });
        },
        deleteTicket(ticket) {
            this.$store.dispatch('user/deleteticket', ticket.id).then(
                res => {
                    console.log(res);
                    this.data = this.data.filter(item => item.id !== ticket.id);
                    this.$toast.add({severity:'success', summary:'Ticket supprimé', detail:'Le ticket a été supprimé avec succès', life: 3000});
                }
            );
        },
    }
};
</script>