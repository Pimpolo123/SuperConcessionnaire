<template>
    <ConfirmDialog></ConfirmDialog>
    <Toast></Toast>
    <Card>
        <template #title>Paramètres de la newsletter</template>
        <template #content>
        <div v-if="isAdmin()" class="container-fluid w-90 p-2">
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <InputSwitch v-model="newsToggle" class="w-full md:w-40rem" />
                    <p class="d-inline-flex">Activer la newsletter <Button icon="pi pi-info" class="rounded btn-sm float-right" style="margin-left: 30px;" @click="openInfo"></Button></p>
                </div>
                <div class="col-md-4" v-if="newsToggle">
                    <Dropdown name="frequency" v-model="frequency" :options="frequencies" optionLabel="name" 
                            placeholder="Sélectionner la période" class="w-full md:w-40rem" />
                </div>
                <div class="col-md-4" v-if="newsToggle">
                    <Datepicker v-model="time" placeholder="Sélectionner l'heure" class="w-full md:w-40rem" time-picker/>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-md-4" v-if="newsToggle">
                    <Dropdown name="dayWeek" v-model="dayWeek" :options="daysOfWeek" optionLabel="name" v-if="frequency && frequency.code === 'W'"
                            placeholder="Sélectionner le jour" class="w-full md:w-40rem" />
                    <Dropdown name="dayMonth" v-model="dayMonth" :options="daysOfMonth" optionLabel="name" v-if="frequency && frequency.code === 'M'"
                            placeholder="Sélectionner le jour" class="w-full md:w-40rem" />
                </div>
                <div class="col-md-4">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <Button label="Sauvegarder"  class="flex-auto md:flex-initial whitespace-nowrap w-30" @click="confirmSaveFrequency"/>
                </div>
            </div>
        </div>
        </template>
    </Card>
    <OverlayPanel ref="op">
            <div class="flex flex-column gap-3 w-25rem">
                <div class="row">
                    <div class="col-md-12">
                        <h5>Newsletter</h5>
                        <p>Les clients recevront un mail qui présente tous les nouveaux véhicules publiés pendant la période choisie</p>
                    </div>
                </div>
            </div>
        </OverlayPanel>
</template>

<script>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import OverlayPanel from 'primevue/overlaypanel';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    name: "Newsletter",
    data() {
        return {
            data: [],
            currentUser: JSON.parse(localStorage.getItem('user')),
            frequencies: [
                {name: 'Journalier', code: 'D'},
                {name: 'Hebdomadaire', code: 'W'},
                {name: 'Mensuel', code: 'M'}
            ],
            daysOfWeek: [
                {name: 'Lundi', code: 'MON'},
                {name: 'Mardi', code: 'TUE'},
                {name: 'Mercredi', code: 'WED'},
                {name: 'Jeudi', code: 'THU'},
                {name: 'Vendredi', code: 'FRI'},
                {name: 'Samedi', code: 'SAT'},
                {name: 'Dimanche', code: 'SUN'}
            ],
            daysOfMonth: [
                {name: '1', code: 1},
                {name: '2', code: 2},
                {name: '3', code: 2},
                {name: '4', code: 4},
                {name: '5', code: 5},
                { name: '6', code: 6 },
                { name: '7', code: 7 },
                { name: '8', code: 8 },
                { name: '9', code: 9 },
                { name: '10', code: 10 },
                { name: '11', code: 11 },
                { name: '12', code: 12 },
                { name: '13', code: 13 },
                { name: '14', code: 14 },
                { name: '15', code: 15 },
                { name: '16', code: 16 },
                { name: '17', code: 17 },
                { name: '18', code: 18 },
                { name: '19', code: 19 },
                { name: '20', code: 20 },
                { name: '21', code: 21 },
                { name: '22', code: 22 },
                { name: '23', code: 23 },
                { name: '24', code: 24 },
                { name: '25', code: 25 },
                { name: '26', code: 26 },
                { name: '27', code: 27 },
                { name: '28', code: 28 }
            ],
            frequency: null,
            dayWeek: null,
            dayMonth: null,
            newsToggle: false,
            time: null
        }
    },
    created() {
    },
    mounted() {
        this.$store.dispatch('mailing/getnewsletterinfos').then(
            res => {
                if(res){
                    this.newsToggle = res.isOn;
                    this.frequency = this.frequencies.find(f => f.code === res.frequency);
                    this.dayWeek = this.daysOfWeek.find(d => d.code === res.dayOfWeek);
                    this.dayMonth = this.daysOfMonth.find(d => d.code === res.dayOfMonth);
                    if(res.time){
                        this.time = {hours: res.time.split(':')[0], minutes: res.time.split(':')[1], seconds: res.time.split(':')[2]}
                    }
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
    components: {
        Button,
        ConfirmDialog,
        Toast,
        Dialog,
        Textarea,
        InputText,
        Card,
        Dropdown,
        InputSwitch,
        OverlayPanel,
        Datepicker
    },
    methods: {
        isAdmin() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
        openInfo() {
            this.$refs.op.toggle(event);
        },
        confirmSaveFrequency() {
            if(this.newsToggle && (!this.frequency || !this.time || (this.frequency.code === 'W' && !this.dayWeek) || (this.frequency.code === 'M' && !this.dayMonth))) {
                this.$toast.add({severity:'error', summary:'Erreur', detail:'Veuillez remplir tous les champs', life: 3000});
                return;
            }
            this.$confirm.require({
                message: 'Voulez-vous vraiment sauvegarder les modifications ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Annuler',
                acceptLabel: 'Sauvegarder',
                accept: () => {
                    this.saveFrequency()
                    this.$toast.add({severity:'success', summary:'Succès', detail:'Modifications sauvegardées', life: 3000});
                },
                reject: () => {
                    this.$toast.add({severity:'info', summary:'Info', detail:'Opération annulée', life: 3000});
                }
            });
        },
        saveFrequency() {
            // this.$store.dispatch('cars/setcarsasold').then(
            //     res => {
            //         console.log(res);
            //     },
            //     error => {
            //         this.message = (error.response && error.response.data.message) ||
            //                                 error.message ||
            //                                 error.toString();
            //                                 this.successful = false;
            //     }
            // );
            if(this.newsToggle){
                if(this.frequency.code === 'W'){
                    this.dayMonth = null;
                } else if(this.frequency.code === 'M'){
                    this.dayWeek = null;
                }
                this.$store.dispatch('mailing/setnewsletterinfos', {
                    id: 1,
                    isOn: true,
                    frequency: this.frequency?.code,
                    dayOfWeek: this.dayWeek?.code,
                    dayOfMonth: this.dayMonth?.code,
                    time: this.time
                }).then(
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
            } else {
                this.$store.dispatch('mailing/setnewsletterinfos', {
                    id: 1,
                    isOn: false
                }).then(
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
            }
        }
    }
}
</script>