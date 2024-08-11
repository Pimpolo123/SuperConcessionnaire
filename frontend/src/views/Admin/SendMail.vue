<template>
    <ConfirmDialog></ConfirmDialog>
    <Toast></Toast>
    <Card>
        <template #title>Envoyer un mail aux clients</template>
        <template #content>
        <div v-if="isAdmin()" class="container-fluid w-90 p-2">
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2">
                    <InputText v-model="mail.subject" placeholder="Sujet" class="w-100"/>
                    <small class="p-error" v-if="submitted && !mail.subject">Sujet requis</small>
                </div>
                <div class="col-md-10">
                    <Textarea v-model="mail.message" placeholder="Message" rows="10" cols="100" class="w-100"/>
                    <small class="p-error" v-if="submitted && !mail.message">Corps du mail requis</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <Button label="Envoyer aux clients qui ont souscrit" @click="confirmSendMail" class="flex-auto md:flex-initial whitespace-nowrap w-30"/>
                </div>
            </div>
        </div>
        </template>
    </Card>
</template>

<script>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';

export default {
    name: "SendMail",
    data() {
        return {
            currentUser: JSON.parse(localStorage.getItem('user')),
            data: [],
            mail: {},
            mailingList: [],
            submitted: false,
        }
    },
    created() {
    },
    mounted() {
        this.$store.dispatch('admin/getallusers').then(
            res => {
                res = res.filter(user => user.user.emailoptin === true);
                res.forEach(user => {
                    this.mailingList.push(user.user.email);
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
        Button,
        ConfirmDialog,
        Toast,
        Dialog,
        Textarea,
        InputText,
        Card
    },
    methods: {
        isAdmin() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
        sendMail(mail) {
            console.log(mail);
            this.$store.dispatch('mailing/sendemail', {mail: this.mail, addresses: this.mailingList}).then(
                res => {
                    console.log(res);
                },
                error => {
                    this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
                }
            );
        },
        confirmSendMail() {
            this.submitted = true;
            if (!this.mail.subject || !this.mail.message) {
                return;
            }
            this.$confirm.require({
                message: `Etes-vous sur de vouloir envoyer l'email ?`,
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectClass: 'p-button-secondary p-button-outlined',
                rejectLabel: 'Annuler',
                acceptLabel: 'Envoyer',
                accept: () => {
                    this.sendMail(this.mail);
                    this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Email envoyé', life: 3000 });
                },
                reject: () => {
                    this.$toast.add({ severity: 'info', summary: 'Annulé', detail: 'Action annulée', life: 1000 });
                }
            });
        },
    }
}
</script>