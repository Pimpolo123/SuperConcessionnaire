<template>
    <div class="container-fluid">
        <Card>
            <template #title>Statistiques du site :</template>
            <template #content>
                <Chart type="bar" :data="chartData" :options="chartOptions"/>
                <h5>Clients connectés : {{ connectedClients }}</h5>
            </template>
        </Card>
    </div>
</template>

<script>
import Chart from 'primevue/chart';
import Card from 'primevue/card';
import io, { connect } from 'socket.io-client';

export default {
    data() {
        return {
            chartData: null,
            chartOptions: null,
            cars: [],
            users: [],
            sales: [],
            socket: null,
            connectedClients: 0
        };
    },
    mounted() {
        this.socket = io('http://localhost:8080');
        this.socket.emit('get connected clients');
        this.socket.on('connected clients', (clients) => {
            console.log('Clients connectés:', clients);
            this.connectedClients = clients;
        });
        this.$store.dispatch('cars/getallcars').then(
            cars => {
                this.cars = cars;
                this.$store.dispatch('cars/getsales').then(
                    sales => {
                        this.sales = sales;
                        this.$store.dispatch('admin/getallusers').then(
                            res => {
                                this.users = res;
                                this.chartData = this.setChartData();
                                this.chartOptions = this.setChartOptions();
                            }
                        );
                    }
                );
            }
        );
        
    },
    components: {
        Chart,
        Card
    },
    methods: {
        setChartData() {
            const documentStyle = getComputedStyle(document.documentElement);

            return {
                labels: this.getMonthsUntilNow(),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Comptes créés',
                        backgroundColor: documentStyle.getPropertyValue('--gray-500'),
                        data: this.getUsersCreatedByMonth()
                    },
                    {
                        type: 'bar',
                        label: 'Ventes réalisées',
                        backgroundColor: documentStyle.getPropertyValue('--green-500'),
                        data: this.getSalesByMonth()
                    },
                    {
                        type: 'bar',
                        label: 'Véhicules ajoutés',
                        backgroundColor: documentStyle.getPropertyValue('--orange-500'),
                        data: this.getAddedCarsByMonth()
                    }
                ]
            };
        },
        setChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--content-border-color');

            return {
                maintainAspectRatio: true,
                aspectRatio: 2.5,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
        },
        getMonthsUntilNow() {
            const months = [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ];

            const currentMonth = new Date().getMonth();
            
            return months.slice(0, currentMonth + 1);
        },
        getUsersCreatedByMonth() {
            const usersCreatedByMonth = Array(12).fill(0);

            this.users.forEach(user => {
                const createdAt = new Date(user.user.createdAt);
                const month = createdAt.getMonth(); 

                usersCreatedByMonth[month]++;
            });

            return usersCreatedByMonth;
        },
        getSalesByMonth() {
            const salesByMonth = Array(12).fill(0);

            this.sales.forEach(sale => {
                const createdAt = new Date(sale.createdAt);
                const month = createdAt.getMonth();

                salesByMonth[month]++;
            });

            return salesByMonth;
        },
        getAddedCarsByMonth() {
            const addedCarsByMonth = Array(12).fill(0);

            this.cars.forEach(car => {
                const createdAt = new Date(car.createdAt);
                const month = createdAt.getMonth();

                addedCarsByMonth[month]++;
            });

            return addedCarsByMonth;
        }
    }
};
</script>
