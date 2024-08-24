<template>
    <div v-if="isAdmin()" class="container-fluid w-100 p-2">
        <TabMenu :model="tabItems" :scrollable="true"/>
        <CarManagement v-if="currentTab == 'stockManagement'"></CarManagement>
        <StockHistory v-if="currentTab == 'stockHistory'"></StockHistory>
        <BidManagement v-if="currentTab == 'bidManagement'"></BidManagement>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';  
    import CarManagement from './CarManagement.vue';
    import BidManagement from './BidManagement.vue';
    import StockHistory from './StockHistory.vue';
    import TabMenu from 'primevue/tabmenu';
    
    export default {
        name: 'Admin',
        data() {
            return {
                content: '',
                currentUser: JSON.parse(localStorage.getItem('user')),
                currentTab: 'stockManagement',
                tabItems: [
                    {
                        label: 'Gestion du Stock',
                        icon: 'pi pi-book',
                        command: () => {
                            this.currentTab = 'stockManagement'
                        }
                    },
                    {
                        label: 'Historique des Ventes',
                        icon: 'pi pi-history',
                        command: () => {
                            this.currentTab = 'stockHistory'
                        }
                    },
                    {
                        label: 'Gestion des Enchères',
                        icon: 'pi pi-dollar',
                        command: () => {
                            this.currentTab = 'bidManagement'
                        }
                    },
                ]
            };
        },
        components: {
            TabMenu,
            CarManagement,
            BidManagement,
            StockHistory,
        },
        mounted() {
        UserService.getAdminBoard().then(
            response => {
                this.content = response.data;
            },
            error => {
                // this.$router.push('/home');
                this.content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
            }
        );
        },
        methods: {
            isAdmin() {
                if (this.currentUser && this.currentUser.roles) {
                    return this.currentUser.roles.includes('ROLE_ADMIN');
                }
                return false;
            },
        }
    };
</script>