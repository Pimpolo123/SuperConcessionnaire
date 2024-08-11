<template>
    <ConfirmDialog></ConfirmDialog>
    <Toast/>
    <DataView :value="messagesToAdmin" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5" v-if="isAdmin()">
        <template #empty>
            <div class="p-text-center p-text-secondary p-text-bold p-text-uppercase p-text-italic">Aucun message</div>
        </template>
        <template #header>
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier" @change="onSortChange($event)" />
        </template>
        <template #list="slotProps">
            <div class="container-fluid p-0 m-0">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div :class="['p-4', 'gap-3', 'align-items-center', 'd-flex', 'column', { 'bg-success': !item.read }]">
                        <div class="col">
                            <div class="font-weight-bold">De :
                                <span class="font-weight-normal"> {{ item.user.surname }} {{ item.user.name }}</span>
                            </div>
                            <div class="font-weight-bold">Date d'envoi :
                                <span class="font-weight-normal"> {{ item.updatedAt }}</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="font-weight-bold" v-if="!item.showFullMessage">Aperçu du message :
                                <span class="font-weight-normal"> {{ item.content.substring(0, 100) + '...' }}<span class="font-weight-normal" @click="showFullMessage(item)">plus</span></span>
                            </div>
                            <div class="font-weight-bold" v-else>Aperçu du message :
                                <span class="font-weight-normal"> {{ item.content }}</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2 col">
                            <Button icon="pi pi-envelope" label="Marquer comme lu" class="flex-auto md:flex-initial white-space-nowrap" @click="markAsRead(item)"></Button>
                            <Button icon="pi pi-envelope" label="Répondre" class="flex-auto md:flex-initial white-space-nowrap" @click="openResponseDialog(item)"></Button>
                            <Button icon="pi pi-trash"  class="flex-auto md:flex-initial white-space-nowrap w-20" @click="confirmDeleteMessage(item)" v-tooltip.top="'Supprimer le message'"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>
    <DataView :value="messages" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5" v-else>
        <template #empty>
            <div class="p-text-center p-text-secondary p-text-bold p-text-uppercase p-text-italic">Aucun message</div>
        </template>
        <template #header>
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier" @change="onSortChange($event)" />
        </template>
        <template #list="slotProps">
            <div class="container-fluid p-0 m-0">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div :class="['p-4', 'gap-3', 'align-items-center', 'd-flex', 'column', { 'bg-success': !item.read }]">
                        <div class="col">
                            <div class="font-weight-bold">De :
                                <span class="font-weight-normal"> Administrateur </span>
                            </div>
                            <div class="font-weight-bold">Date d'envoi :
                                <span class="font-weight-normal"> {{ item.updatedAt }}</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="font-weight-bold" v-if="!item.showFullMessage">Aperçu du message :
                                <span class="font-weight-normal"> {{ item.content.substring(0, 100) + '...' }} <span class="font-weight-normal" @click="showFullMessage(item)">plus</span></span>
                            </div>
                            <div class="font-weight-bold" v-else>Aperçu du message :
                                <span class="font-weight-normal"> {{ item.content }}</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2 col">
                            <Button icon="pi pi-download" class="flex-auto md:flex-initial white-space-nowrap" @click="downloadPromise(item)" v-tooltip.top="'Télécharger'" v-if="item.type == 'pdf'"></Button>
                            <Button icon="pi pi-envelope" label="Marquer comme lu" class="flex-auto md:flex-initial white-space-nowrap" @click="markAsRead(item)"></Button>
                            <Button icon="pi pi-envelope" label="Répondre" class="flex-auto md:flex-initial white-space-nowrap" @click="openUserResponseDialog(item)"></Button>
                            <Button icon="pi pi-trash"  class="flex-auto md:flex-initial white-space-nowrap w-20" @click="confirmDeleteMessage(item)" v-tooltip.top="'Supprimer le message'"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>
    <Dialog v-model:visible="responseDialog" :style="{width: '100%'}" header="Envoyer une réponse" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog" v-if="isAdmin()">
        <div class="d-flex gap-2 m-4 justify-content-center">
            <Button icon="pi pi-envelope" label="Envoyer la promesse de vente" class="w-30 h-10" @click="promise"></Button>
            <Button icon="pi pi-envelope" label="Répondre par un message" class="w-30 h-10" @click="respond"></Button>
        </div>
        <div class="container-fluid" v-if="isPromiseResponse">
            <div class="row mt-3">
                <div class="col-md-8">
                    <div class="font-weight-bold">Destinataire : 
                        <span class="font-weight-normal">{{ this.selectedMessage?.user.surname }} {{ this.selectedMessage?.user.name }}</span>
                    </div>
                    <div class="font-weight-bold">Véhicule : 
                        <span class="font-weight-normal">{{ this.selectedMessage?.car.make.name }} {{ this.selectedMessage?.car.model.name }} {{ this.selectedMessage?.car.year }}</span>
                    </div>
                </div>
                <div class="col-md-4">
                    <InputNumber class="w-100 m-3" placeholder="Montant de l'accompte demandé" v-model="deposit" id="deposit" :invalid="submitted && !deposit"/>
                    <small class="p-error" v-if="submitted && !deposit">Montant de l'accompte requis</small>
                </div>
            </div>
        </div>
        <div class="container-fluid" v-if="isMessageReponse">
            <div class="row mt-3">
                <div class="col-md-12">
                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="font-weight-bold">Destinataire : 
                                <span class="font-weight-normal">{{ this.selectedMessage?.user.surname }} {{ this.selectedMessage?.user.name }}</span>
                            </div>
                            <div class="font-weight-bold">Véhicule : 
                                <span class="font-weight-normal">{{ this.selectedMessage?.car.make.name }} {{ this.selectedMessage?.car.model.name }} {{ this.selectedMessage?.car.year }}</span>
                            </div>
                            <div class="font-weight-bold">Message : 
                                <span class="font-weight-normal">{{ this.selectedMessage?.content }}</span>
                            </div>
                            <div class="font-weight-bold">Véhicule toujours disponible : 
                                <div class="d-flex flex-wrap gap-3">
                                    <div class="d-flex align-items-center">
                                        <RadioButton v-model="isAvailable" inputId="yes" name="isAvailable" :value="true" @change="changeDefaultText"/>
                                        <label for="yes" class="ml-2">Oui</label>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <RadioButton v-model="isAvailable" inputId="no" name="isAvailable" :value="false" @change="changeDefaultText"/>
                                        <label for="no" class="ml-2">Non</label>
                                    </div>
                                </div>
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
            <Button icon="pi pi-envelope" type="button" label="Envoyer" class="flex-auto md:flex-initial white-space-nowrap ml-3" @click="sendResponse(this.selectedMessage)" v-if="isMessageReponse"></Button>
            <Button icon="pi pi-envelope" type="button" label="Envoyer" class="flex-auto md:flex-initial white-space-nowrap ml-3" @click="confirmSendPromise(this.selectedMessage)" v-if="isPromiseResponse"></Button>
            <Button label="Fermer" icon="pi pi-times" text @click="hideDialog"/>
        </template>
    </Dialog>
    <Dialog v-model:visible="userResponseDialog" :style="{width: '100%'}" header="Faire une demande" :modal="true" class="container p-fluid m-0 p-0" @after-hide="hideDialog">
        <div class="container-fluid">
            <div class="row mt-3">
                <div class="col-md-12">
                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="font-weight-bold">Destinataire : 
                                <span class="font-weight-normal">Administrateur</span>
                            </div>
                            <div class="font-weight-bold">Véhicule : 
                                <span class="font-weight-normal">{{ this.car.make.name }} {{ this.car.model.name }} {{ this.car.year }}</span>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="font-weight-bold">Votre message : 
                                <Textarea v-model="responseContent" rows="5" cols="100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button icon="pi pi-envelope" type="button" label="Envoyer" class="flex-auto md:flex-initial white-space-nowrap ml-3" @click="sendUserResponse(this.selectedMessage)"></Button>
            <Button label="Fermer" icon="pi pi-times" text @click="hideDialog"/>
        </template>
    </Dialog>
</template>

<script>
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';

export default {
    data() {
        return {
            currentUser: this.$store.state.auth.user,
            messages: [],
            messagesToAdmin: [],
            sortOptions: [
                { label: 'Plus récent', value: '!createdAt' },
                { label: 'Plus ancien', value: 'createdAt' }
            ],
            sortOrder: 1,
            sortField: null,
            sortKey: null,
            responseDialog: false,
            selectedMessage: {},
            isMessageReponse: false,
            isPromiseResponse: false,
            messageContent: 'Le véhicule n\'est plus disponible',
            isAvailable: false,
            dealerInformations: {},
            deposit: null,
            submitted: false,
            images: [],
            userResponseDialog: false,
            responseContent: 'Je souhaite acheter le véhicule',
        };
    },
    created() {
    },
    mounted() {
        if(this.isAdmin()){
            this.$store.dispatch('user/getmessagestorole', 3).then( //recup les messages avec toRoleId = admin
                res => {
                    this.messagesToAdmin = res;
                    this.messagesToAdmin.forEach(message => {
                        message.createdAt = new Date(message.createdAt).toLocaleString();
                        message.updatedAt = new Date(message.updatedAt).toLocaleString();
                        if(message.content.length < 100){
                            message.showFullMessage = true;
                        } else {
                            message.showFullMessage = false;
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
            this.$store.dispatch('admin/getdealerinformations').then(
                res => {
                    if(res){
                        this.dealerInformations = res;
                    }
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            this.$store.dispatch('user/getmessagestouser', this.currentUser).then( //recup les messages avec toUserId = currentUser.id
                res => {
                    this.messages = res;
                    this.messages.forEach(message => {
                        message.createdAt = new Date(message.createdAt).toLocaleString();
                        message.updatedAt = new Date(message.updatedAt).toLocaleString();
                        if(message.content.length < 100){
                            message.showFullMessage = true;
                        } else {
                            message.showFullMessage = false;
                        }
                    });
                    console.log(this.messages);
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                            error.message ||
                                            error.toString();
                                            this.successful = false;
                }
            );
        }
    },
    components: {
        DataView,
        Dropdown,
        Button,
        ConfirmDialog,
        Toast,
        Dialog,
        Textarea,
        RadioButton,
        InputNumber
    },
    methods: {
        markAsRead(item) {
            item.read = true;
            this.$store.dispatch('user/markasread', item.id).then(
                res => {
                    this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                },
                error => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                }
            );
        },
        isAdmin() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
        openResponseDialog(item) {
            console.log(item);
            this.responseDialog = true;
            this.selectedMessage = item;
            this.$store.dispatch('cars/getcar', item.car.id).then(
                res => {
                    this.selectedMessage.car = res;
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
                }
            );
        },
        respond() {
            this.isMessageReponse = true;
            this.isPromiseResponse = false;
        },
        promise() {
            this.isPromiseResponse = true;
            this.isMessageReponse = false;
        },
        confirmSendPromise() {
            this.submitted = true;
            if(this.deposit) {
                this.$store.dispatch('admin/getdealerinformations').then(
                    res => {
                        this.$confirm.require({
                            message: 'Voulez-vous vraiment envoyer le PDF de promesse de vente ?',
                            header: 'Confirmation',
                            icon: 'pi pi-exclamation-triangle',
                            accept: () => {
                                this.sendPromise(this.selectedMessage);
                            },
                            reject: () => {
                                this.$toast.add({ severity: 'info', summary: 'Annulation', detail: 'Envoi annulé', life: 3000 });
                            }
                        });
                    },
                    error => {
                        if(error.response.status == 404){
                            this.$toast.add({severity:'error', summary:'Erreur', detail: 'Vous devez d\'abord remplir les informations du concessionnaire depuis le panel admin', life: 6000});
                        }
                        console.log(error.response.status);
                    }
                );
            } else {
                this.$toast.add({severity:'error', summary:'Erreur', detail: 'Montant de l\'accompte requis', life: 3000});
            }
        },
        sendPromise(item) {
            this.$store.dispatch('admin/addpdfinfos', {
                fileName: 'promesse_de_vente_' + item.user.username + '.pdf',
                dealershipName: this.dealerInformations.dealershipName,
                promiseDate: new Date(),
                promiseLocation: this.dealerInformations.city,
                deposit: this.deposit,
                bankAccount: this.dealerInformations.bankAccount,
                userId: item.userId,
                carId: item.carId,
            }).then(
                res => {
                    console.log(res);
                    this.$store.dispatch('user/addmessage', {
                        content: 'Vous pouvez télécharger la promesse de vente',
                        isOk: true,
                        responseTo: item.id,
                        toUserId: item.userId,
                        type: 'pdf',
                        pdfId: res.infos.id,
                        userId: this.currentUser.id,
                        carId: item.carId
                    }).then(
                        res => {
                            this.responseDialog = false;
                            this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                            console.log(res);
                        },
                        error => {
                            this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                        }
                    );
                },
                error => {
                    console.log(error);
                }
            );
            this.markAsRead(item);
        },
        sendResponse(messageToRespond) {
            messageToRespond.read = true;
            this.$store.dispatch('user/addmessage', {
                content: this.messageContent,
                isOk: this.isAvailable,
                responseTo: messageToRespond.id,
                toUserId: messageToRespond.userId,
                type: 'response',
                userId: this.currentUser.id,
                carId: messageToRespond.carId
            }).then(
                res => {
                    this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                    this.responseDialog = false;
                },
                error => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                }
            );
            this.markAsRead(messageToRespond);
        },
        confirmDeleteMessage(item) {
            this.$confirm.require({
                message: 'Supprimer le message ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.deleteMessage(item);
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulation', detail: 'Action annulée', life: 3000 });
                }
            });
        },
        deleteMessage(item) {
            this.$store.dispatch('user/deletemessage', item.id).then(
                res => {
                    if(this.isAdmin())
                        this.messagesToAdmin = this.messagesToAdmin.filter(m => m.id !== item.id);
                    else
                        this.messages = this.messages.filter(m => m.id !== item.id);
                    this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                },
                error => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                }
            );
        },
        hideDialog() {
            this.responseDialog = false;
            this.selectedMessage = {};
            this.isMessageReponse = false;
            this.isPromiseResponse = false;
            this.userResponseDialog = false;
            this.deposit = null;
            this.submitted = false;
        },
        changeDefaultText(){
            if(this.dealerInformations.phoneNumber){
                this.messageContent = this.isAvailable ? `Le véhicule est toujours disponible, contactez-moi au ${this.dealerInformations.phoneNumber} ou en répondant à ce message pour recevoir une promesse de vente.` : 'Le véhicule n\'est plus disponible.';
            } else {
                this.messageContent = this.isAvailable ? 'Le véhicule est toujours disponible, contactez-moi en répondant à ce message pour recevoir une promesse de vente.' : 'Le véhicule n\'est plus disponible.';
            }
        },
        openUserResponseDialog(message){
            console.log(message);
            this.selectedMessage = message;
            this.$store.dispatch('cars/getcar', message.car.id).then(
                res => {
                    console.log(res);
                    this.car = res;
                    this.$nextTick(() => {
                        this.userResponseDialog = true;
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
        sendUserResponse(messageToRespond) {
            console.log(messageToRespond);
            console.log(this.responseContent);
            messageToRespond.read = true;
            this.$store.dispatch('user/addmessage', {
                content: this.responseContent,
                responseTo: messageToRespond.id,
                toRoleId: 3,
                type: 'response',
                userId: this.currentUser.id,
                carId: messageToRespond.carId
            }).then(
                res => {
                    this.$toast.add({severity:'success', summary:'Succès', detail: res.message, life: 3000});
                    this.responseDialog = false;
                },
                error => {
                    this.$toast.add({severity:'error', summary:'Erreur', detail: error.message, life: 3000});
                }
            );
            this.markAsRead(messageToRespond);
            this.hideDialog();
        },
        showFullMessage(item){
            item.showFullMessage = true;
        },
        downloadPromise(item){
            console.log(item);
            this.$store.dispatch('admin/generatepdf', item.pdfId).then(
                res => {
                    const blob = new Blob([res.data], { type: 'application/pdf' })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'document.pdf');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                },
                error => {
                    console.log(error.response.status);
                }
            );
        }
    }
};
</script>