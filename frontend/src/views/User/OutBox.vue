<template>
    <ConfirmDialog></ConfirmDialog>
    <Toast/>
    <DataView :value="messages" :sortOrder="sortOrder" :sortField="sortField" paginator :rows="5" v-if="isAdmin()">
        <template #empty>
            <div class="p-text-center p-text-secondary p-text-bold p-text-uppercase p-text-italic">Aucun message</div>
        </template>
        <template #header>
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Trier" @change="onSortChange($event)" />
        </template>
        <template #list="slotProps">
            <div class="container-fluid p-0 m-0">
                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12">
                    <div :class="['p-4', 'gap-3', 'align-items-center', 'd-flex', 'column']">
                        <div class="col">
                            <div class="font-weight-bold">Destinataire :
                                <span class="font-weight-normal"> {{ item.toRoleId }}</span>
                            </div>
                            <div class="font-weight-bold">Date d'envoi :
                                <span class="font-weight-normal"> {{ item.createdAt }}</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="font-weight-bold">Aperçu du message :
                                <span class="font-weight-normal"> {{ item.content.substring(0, 50) + '...' }}</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2 col">
                            <Button icon="pi pi-envelope" label="Marquer comme lu" class="flex-auto md:flex-initial white-space-nowrap" @click="markAsRead(item)"></Button>
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
                    <div :class="['p-4', 'gap-3', 'align-items-center', 'd-flex', 'column']">
                        <div class="col">
                            <div class="font-weight-bold">Destinataire :
                                <span class="font-weight-normal"> Administrateur</span>
                            </div>
                            <div class="font-weight-bold">Date d'envoi :
                                <span class="font-weight-normal"> {{ item.createdAt }}</span>
                            </div>
                        </div>
                        <div class="col">
                            <div class="font-weight-bold">Aperçu du message :
                                <span class="font-weight-normal"> {{ item.content.substring(0, 100) + '...' }}</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2 col">
                            <Button icon="pi pi-trash" label="Supprimer" class="flex-auto md:flex-initial white-space-nowrap" @click="confirmDeleteMessage(item)"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </DataView>
</template>

<script>
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

export default {
    data() {
        return {
            currentUser: this.$store.state.auth.user,
            messages: [],
            sortOptions: [
                { label: 'Plus récent', value: '!createdAt' },
                { label: 'Plus ancien', value: 'createdAt' }
            ],
            sortOrder: 1,
            sortField: null,
            sortKey: null,
        };
    },
    created() {
    },
    mounted() {
        console.log(this.currentUser);
        this.$store.dispatch('user/getmessagesfromuser', this.currentUser).then( //recup les messages avec toUserId = currentUser.id
            res => {
                this.messages = res;
                this.messages.forEach(message => {
                    message.createdAt = new Date(message.createdAt).toLocaleString();
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
    },
    components: {
        DataView,
        Dropdown,
        Button,
        ConfirmDialog,
        Toast
    },
    methods: {
        confirmDeleteMessage(message) {
            console.log(message);
            this.$confirm.require({
                message: 'Voulez-vous vraiment supprimer ce message ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.deleteMessage(message);
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulation', detail: 'Suppression annulée', life: 3000 });
                }
            });
        },
        deleteMessage(message) {
            // this.$store.dispatch('user/deletemessage', message).then(
            //     res => {
            //         this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Message supprimé', life: 3000 });
            //         this.messages = this.messages.filter(m => m.id !== message.id);
            //     },
            //     error => {
            //         this.$toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression du message', life: 3000 });
            //     }
            // );
        },
        isAdmin() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
    }
};
</script>