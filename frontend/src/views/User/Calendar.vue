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
            currentUser: JSON.parse(localStorage.getItem('user')),
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
        this.$store.dispatch('appointment/getavailability').then(
            res => {
                res.forEach(element => {
                    let formattedDays = [];
                    let formattedHours = [];
                    
                    element.openingDays.split(';').forEach(day => {
                        formattedDays.push(parseInt(day));
                    });
                    element.availableHours.split(';').forEach(hour => {
                        formattedHours.push(parseInt(hour));
                    });
                    
                    if(element.year){
                        this.getWeekdaysUntilEndOfYear([...formattedDays], element.year, [...formattedHours]);
                    }
                    if(element.month){
                        this.getWeekdaysUntilEndOfMonth([...formattedDays], element.month, [...formattedHours]);
                    }
                    if(element.week){
                        this.getWeekdaysUntilEndOfWeek([...formattedDays], element.week, [...formattedHours]);
                    }
                    if(element.day){
                        this.addTodayToWeekdays([...formattedDays], element.day, [...formattedHours]);
                    }
                })
            },
            error => {
                this.message = (error.response && error.response.data.message) ||
                                        error.message ||
                                        error.toString();
                                        this.successful = false;
            }
        );
        
        this.$store.dispatch('appointment/getall').then(
            res => {
                this.bookedAppointments = res;
                this.weekdays.forEach((weekday) => {
                    let hoursClone = [...weekday.hours];
                    this.bookedAppointments.forEach(appointment => {
                        if (
                            new Date(appointment.day).getFullYear() === weekday.date.getFullYear() &&
                            new Date(appointment.day).getMonth() === weekday.date.getMonth() &&
                            new Date(appointment.day).getDate() === weekday.date.getDate()
                        ) {
                            const index = hoursClone.indexOf(appointment.time);
                            if (index > -1) {
                                hoursClone.splice(index, 1);
                            }
                        }
                    });
                    weekday.hours = hoursClone;

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
                rejectLabel: 'Annuler',
                acceptLabel: 'Oui',
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
                userId: this.currentUser.id,
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
                            const attrIndex = this.attrs.findIndex(attr => 
                                attr.dates.getFullYear() === weekday.date.getFullYear() &&
                                attr.dates.getMonth() === weekday.date.getMonth() &&
                                attr.dates.getDate() === weekday.date.getDate()
                            );

                            if (attrIndex !== -1) {
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
        getWeekdaysUntilEndOfYear(openingDays, year, formattedHours) {
            const today = new Date();
            const endOfYear = new Date(year, 11, 31); 

            let currentDate = new Date(today);
            currentDate.setHours(0, 0, 0, 0); 

            while (currentDate <= endOfYear) {
                let dayOfWeek = currentDate.getDay();
                if(dayOfWeek === 0){
                    dayOfWeek = 7;
                }

                if (openingDays.includes(dayOfWeek)) {
                    const existingIndex = this.weekdays.findIndex(weekday => 
                        weekday.date.getFullYear() === currentDate.getFullYear() &&
                        weekday.date.getMonth() === currentDate.getMonth() &&
                        weekday.date.getDate() === currentDate.getDate()
                    );

                    if (existingIndex !== -1) {
                        this.weekdays.splice(existingIndex, 1);
                    }
                    this.weekdays.push({
                        date: new Date(currentDate), 
                        hours: formattedHours
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        },
        getWeekdaysUntilEndOfMonth(openingDays, month, formattedHours) {
            const today = new Date();
            const year = today.getFullYear();
            const endOfMonth = new Date(year, month, 0); 
            console.log(endOfMonth);
            

            let currentDate = new Date(today);
            currentDate.setHours(0, 0, 0, 0); 

            if (currentDate.getMonth() + 1 > month) {
                return; 
            }

            if (currentDate.getMonth() + 1 !== month) {
                currentDate = new Date(year, month - 1, 1);
            }

            while (currentDate <= endOfMonth) {
                console.log(currentDate);
                
                let dayOfWeek = currentDate.getDay();
                if(dayOfWeek === 0){
                    dayOfWeek = 7;
                }

                if (openingDays.includes(dayOfWeek)) {
                    const existingIndex = this.weekdays.findIndex(weekday => 
                        weekday.date.getFullYear() === currentDate.getFullYear() &&
                        weekday.date.getMonth() === currentDate.getMonth() &&
                        weekday.date.getDate() === currentDate.getDate()
                    );

                    if (existingIndex !== -1) {
                        this.weekdays.splice(existingIndex, 1);
                    }
                    this.weekdays.push({
                        date: new Date(currentDate),
                        hours: formattedHours
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
            console.log(this.weekdays);
            
        },
        getWeekdaysUntilEndOfWeek(openingDays, weekNumber, formattedHours) {
            const today = new Date();
            const year = today.getFullYear(); 

            const firstDayOfWeek = new Date(year, 0, 1 + (weekNumber) * 7);
            while (firstDayOfWeek.getDay() !== 1) { 
                firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 1);
            }

            let currentDate = new Date(today);
            currentDate.setHours(0, 0, 0, 0); 

            if (currentDate < firstDayOfWeek) {
                currentDate = new Date(firstDayOfWeek);
            }

            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

            while (currentDate <= lastDayOfWeek) {
                let dayOfWeek = currentDate.getDay();
                if(dayOfWeek === 0){
                    dayOfWeek = 7;
                }

                if (openingDays.includes(dayOfWeek)) {

                    const existingIndex = this.weekdays.findIndex(weekday => 
                        weekday.date.getFullYear() === currentDate.getFullYear() &&
                        weekday.date.getMonth() === currentDate.getMonth() &&
                        weekday.date.getDate() === currentDate.getDate()
                    );

                    if (existingIndex !== -1) {
                        this.weekdays.splice(existingIndex, 1);
                    }
                    this.weekdays.push({
                        date: new Date(currentDate),
                        hours: formattedHours
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }
        },
        addTodayToWeekdays(openingDays, targetDate, formattedHours) {
            const today = new Date();
            const target = new Date(targetDate);

            if (
                today.getFullYear() === target.getFullYear() &&
                today.getMonth() === target.getMonth() &&
                today.getDate() === target.getDate()
            ) {
                let dayOfWeek = today.getDay();
                if(dayOfWeek === 0){
                    dayOfWeek = 7;
                }
                
                if (openingDays.includes(dayOfWeek)) {
                    const existingIndex = this.weekdays.findIndex(weekday => 
                        weekday.date.getFullYear() === currentDate.getFullYear() &&
                        weekday.date.getMonth() === currentDate.getMonth() &&
                        weekday.date.getDate() === currentDate.getDate()
                    );

                    if (existingIndex !== -1) {
                        this.weekdays.splice(existingIndex, 1);
                    }
                    this.weekdays.push({
                        date: new Date(today),
                        hours: formattedHours
                    });
                }
            }
        },
        onClickDay() {
            const weekday = this.weekdays.find(weekday =>
                this.date?.getFullYear() === weekday.date.getFullYear() &&
                this.date.getMonth() === weekday.date.getMonth() &&
                this.date.getDate() === weekday.date.getDate()
            );
            

            if (weekday) {
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