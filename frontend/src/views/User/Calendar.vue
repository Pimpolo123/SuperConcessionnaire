<template>
    <ConfirmDialog></ConfirmDialog>
    <Toast></Toast>
    <div class="d-flex flex-column align-items-center justify-content-center">
        <VDatePicker v-model="date" :attributes="attrs" mode="dateTime" :rules="rules" :time-accuracy="1" expanded is24hr @dayclick="onClickDay" :select-attribute="selectAttribute" ></VDatePicker>
        <Button label="Prendre rendez-vous"  class="d-flex w-30 mt-3" @click="confirmBookAppointment"/>
    </div>
    <!-- <v-calendar :attributes="attrs" expanded/> -->
</template>

<script>
import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

export default {
    data() {
        return {
            highlight: {
                color: 'blue',
                fillMode: 'light',
            },
            attrs: [],
            date: new Date(),
            appointmentInfos: {
                availableHours: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            },
            rules: {
                hours: (hour, { date }) => {
                    const weekday = this.weekdays.find(weekday => 
                        date?.getFullYear() === weekday.date?.getFullYear() &&
                        date.getMonth() === weekday.date.getMonth() &&
                        date.getDate() === weekday.date.getDate()
                    );
                    
                    if (weekday) {
                        return weekday.hours.includes(hour);
                    }

                    return false;
                }
            },
            weekdays: [],
            bookedAppointments: [],
            selectAttribute: {
                dot: true,
            },
        };
    },
    components: {
        Button,
        ConfirmDialog,
        Toast,
    },
    mounted() {
        this.getWeekdaysUntilEndOfYear();
        const availableHours = this.appointmentInfos.availableHours; 
        this.weekdays.forEach(weekday => {
            weekday.hours = [...this.appointmentInfos.availableHours];
        });

        
        this.$store.dispatch('appointment/getall').then(
            res => {
                this.bookedAppointments = res;
                this.weekdays.forEach((weekday) => {
                    // Vérifiez si la date du weekday correspond à une date dans bookedAppointments
                    this.bookedAppointments.forEach(appointment => {
                        if (
                            new Date(appointment.day).getFullYear() === weekday.date.getFullYear() &&
                            new Date(appointment.day).getMonth() === weekday.date.getMonth() &&
                            new Date(appointment.day).getDate() === weekday.date.getDate()
                        ) {
                            const index = weekday.hours.indexOf(appointment.time);
                            if (index > -1) {
                                weekday.hours.splice(index, 1);
                            }
                        }
                    });

                    // Ajouter l'attribut pour la date
                    if (weekday.hours.length === 0) {
                        this.attrs.push({
                            highlight: {
                                color: 'red',
                                fillMode: 'light',
                            },
                            dates: weekday.date
                        });
                    } else {
                        this.attrs.push({
                            highlight: this.highlight,
                            dates: weekday.date
                        });
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
    },
    methods: {
        confirmBookAppointment() {
            this.$confirm.require({
                message: 'Voulez-vous prendre rendez-vous ?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.bookAppointment();
                    this.$toast.add({severity:'success', summary:'Succès', detail:'Rendez-vous réservé', life: 3000});
                },
                reject: () => {
                    this.$toast.add({severity:'info', summary:'Info', detail:'Opération annulée', life: 3000});
                }
            });
        },
        bookAppointment(){
            this.$store.dispatch('appointment/addappointment', {
                day: this.date,
                time: this.date.getHours(),
            }).then(
                res => {
                    console.log(res);

                const weekday = this.weekdays.find(weekday => 
                    this.date.getFullYear() === weekday.date.getFullYear() &&
                    this.date.getMonth() === weekday.date.getMonth() &&
                    this.date.getDate() === weekday.date.getDate()
                );
                
                if (weekday) {
                    const index = weekday.hours.indexOf(this.date.getHours());
                    if (index > -1) {
                        weekday.hours.splice(index, 1); 
                    }
                    if (weekday.hours.length === 0) {
                        // Trouver l'attribut correspondant dans `attrs`
                        const attrIndex = this.attrs.findIndex(attr => 
                            attr.dates.getFullYear() === weekday.date.getFullYear() &&
                            attr.dates.getMonth() === weekday.date.getMonth() &&
                            attr.dates.getDate() === weekday.date.getDate()
                        );

                        if (attrIndex !== -1) {
                            // Modifier le `highlight` de cet attribut particulier
                            this.attrs[attrIndex] = {
                                ...this.attrs[attrIndex],
                                highlight: {
                                    ...this.attrs[attrIndex].highlight,
                                    color: 'red'
                                }
                            };
                        }
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
        getWeekdaysUntilEndOfYear() {
            const today = new Date();
            const endOfYear = new Date(today.getFullYear(), 11, 31); 

            let currentDate = new Date(today);

            while (currentDate <= endOfYear) {
                const dayOfWeek = currentDate.getDay();

                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    this.weekdays.push({
                        date: new Date(currentDate), 
                        hours: this.appointmentInfos.availableHours
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        },
        onClickDay() {
            // console.log(this.date);
            const weekday = this.weekdays.find(weekday =>
                this.date?.getFullYear() === weekday.date.getFullYear() &&
                this.date.getMonth() === weekday.date.getMonth() &&
                this.date.getDate() === weekday.date.getDate()
            );
            // console.log(weekday);
            

            if (weekday) {
                // Trouver l'index de l'attribut correspondant dans attrs
                const attrIndex = this.attrs.findIndex(attr =>
                    attr.dates.getFullYear() === weekday.date.getFullYear() &&
                    attr.dates.getMonth() === weekday.date.getMonth() &&
                    attr.dates.getDate() === weekday.date.getDate()
                );

                if(weekday.hours.length === 0) {
                    console.log('test');
                    this.$toast.add({severity:'warn', summary:'Attention', detail:`Aucune tranche horaire disponible pour le ${weekday.date.getDate()}`, life: 3000});
                }
            }
        }
    }
};
</script>