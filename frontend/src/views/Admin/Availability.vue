<template>
    <ConfirmDialog></ConfirmDialog>
    <Toast></Toast>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <Card>
                    <template #title>Jours d'ouverture</template>
                    <template #content>
                        <div v-for="day of days" :key="day.key" class="d-flex items-center">
                            <Checkbox v-model="selectedDays" :inputId="day.key" name="category" :value="day.key" />
                            <label :for="day.key">{{ day.name }}</label>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="col-md-3">
                <Card>
                    <template #title>Heures d'ouverture et de fermeture</template>
                    <template #content>
                        <Datepicker v-model="openingTime" :start-time="openingStartTime" time-picker :enable-minutes="false" @update:model-value="onChangeTime" placeholder="Ouverture" class="mb-3"/>
                        <Datepicker v-model="closingTime" :start-time="closingStartTime" time-picker :enable-minutes="false" @update:model-value="onChangeTime" placeholder="Fermeture"/>
                    </template>
                </Card>
            </div>
            <div class="col-md-4">
                <Card>
                    <template #title>Heures disponibles pour les rendez-vous</template>
                    <template #content>
                        <div v-for="hour of availableHours" :key="hour.key" class="d-flex items-center">
                            <Checkbox v-model="selectedHours" :inputId="hour.key" name="category" :value="hour.key" />
                            <label :for="hour.key">{{ hour.name }}</label>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <Card>
                    <template #title>Définir les disponibilités pour :</template>
                    <template #content>
                        <div class="d-flex row">
                            <Button label="Aujourd'hui"  class="w-20 mr-3 mb-3" @click="confirmSaveAvailability(1)"/>
                            <Button label="Cette semaine"  class="w-20 mr-3 mb-3" @click="confirmSaveAvailability(2)"/>
                            <Button label="Ce mois"  class="w-20 mr-3 mb-3" @click="confirmSaveAvailability(3)"/>
                            <Button label="Cette année"  class="w-20 mr-3 mb-3" @click="confirmSaveAvailability(4)"/>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    data() {
        return {
            data: null,
            days: [
                { name: 'Lundi', key: '1' },
                { name: 'Mardi', key: '2' },
                { name: 'Mercredi', key: '3' },
                { name: 'Jeudi', key: '4' },
                { name: 'Vendredi', key: '5' },
                { name: 'Samedi', key: '6' },
                { name: 'Dimanche', key: '7' },
            ],
            selectedDays: [],
            selectedHours: [],
            openingTime: null,
            closingTime: null,
            openingStartTime: {
                hours: 8,
                minutes: 0,
            },
            closingStartTime: {
                hours: 18,
                minutes: 0,
            },
            availableHours: [],
        }
    },
    components: {
        Button,
        ConfirmDialog,
        Toast,
        Checkbox,
        Card,
        Datepicker,
    },
    mounted() {
    },
    methods: {
        onChangeTime(time) {
            if (this.openingTime && this.closingTime) {
                for (let i = this.openingTime.hours; i < this.closingTime.hours; i++) {
                    this.availableHours.push({
                        key: i.toString(),
                        name: i + 'h - ' + (i + 1) + 'h',
                    });
                }
                console.log(this.availableHours);
            }
        },
        confirmSaveAvailability(type) {
            if(this.selectedDays.length > 0 && this.selectedHours.length > 0 && this.openingTime && this.closingTime) {
                this.$confirm.require({
                    message: 'Êtes-vous sûr de vouloir enregistrer ces disponibilités ?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    rejectLabel: 'Annuler',
                    acceptLabel: 'Sauvegarder',
                    accept: () => {
                        this.saveAvailability(type);
                    },
                    reject: () => {
                        this.$toast.add({ severity: 'info', summary: 'Annulation', detail: 'Vous avez annulé l\'enregistrement des disponibilités', life: 3000 });
                    }
                });
            } else {
                this.$toast.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez sélectionner au moins un jour et une heure', life: 3000 });
            }
        },
        saveAvailability(type) {
            let day = null;
            let week = null;
            let month = null;
            let year = null;
            if(type == 1) {
                day = new Date();
            } else if(type == 2) {
                week = this.getWeekNumber(new Date());
            } else if(type == 3) {
                month = new Date().getMonth() + 1;
            } else if(type == 4) {
                year = new Date().getFullYear();
            }
            this.data = {
                openingDays: this.selectedDays.join(';'),
                availableHours: this.selectedHours.join(';'),
                openingTime: this.openingTime.hours + ':' + this.openingTime.minutes + ':' + this.openingTime.seconds,
                closingTime: this.closingTime.hours + ':' + this.closingTime.minutes + ':' + this.closingTime.seconds,
                day: day,
                week: week,
                month: month,
                year: year,
            };
            this.$store.dispatch('appointment/setavailability', this.data).then(
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
            this.$toast.add({ severity: 'success', summary: 'Succès', detail: 'Disponibilités enregistrées', life: 3000 });
            console.log(this.data);
            console.log(this.getWeekNumber(new Date()));
        },
        getWeekNumber(date) {
            date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
            const dayNumber = Math.floor((date - yearStart) / (24 * 60 * 60 * 1000)) + 1;
            const weekNumber = Math.floor(dayNumber / 7);
            
            return weekNumber;
        }
    }
};
</script>