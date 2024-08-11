<template>
    <div v-if="isAdmin()" class="container-fluid w-90 p-2">
      <TabMenu :model="tabItems" />
      <UserManagement v-if="currentTab == 'userManagement'"></UserManagement>
      <CarManagement v-if="currentTab == 'stockManagement'"></CarManagement>
      <StockHistory v-if="currentTab == 'stockHistory'"></StockHistory>
      <BidManagement v-if="currentTab == 'bidManagement'"></BidManagement>
      <SendMail v-if="currentTab == 'sendMail'"></SendMail>
      <Newsletter v-if="currentTab == 'newsletter'"></Newsletter>
      <DealerInformations v-if="currentTab == 'dealerInformations'"></DealerInformations>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';
    import UserManagement from './UserManagement.vue';
    import CarManagement from './CarManagement.vue';
    import BidManagement from './BidManagement.vue';
    import DealerInformations from './DealerInformations.vue';
    import StockHistory from './StockHistory.vue';
    import TabMenu from 'primevue/tabmenu';
    import SendMail from './SendMail.vue';
    import Newsletter from './Newsletter.vue';
    
    export default {
        name: 'Admin',
        data() {
            return {
                content: '',
                currentUser: JSON.parse(localStorage.getItem('user')),
                currentTab: 'userManagement',
                tabItems: [
                    {
                        label: 'Gestion des utilisateurs',
                        icon: 'pi pi-user',
                        command: () => {
                            this.currentTab = 'userManagement';
                        }
                    },
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
                    {
                        label: 'Envoyer un mail',
                        icon: 'pi pi-envelope',
                        command: () => {
                            this.currentTab = 'sendMail'
                        }
                    },
                    {
                        label: 'Newsletter',
                        icon: 'pi pi-envelope',
                        command: () => {
                            this.currentTab = 'newsletter'
                        }
                    },
                    {
                        label: 'Informations du concessionnaire',
                        icon: 'pi pi-info',
                        command: () => {
                            this.currentTab = 'dealerInformations'
                        }
                    },
                ]
            };
        },
        components: {
            UserManagement,
            TabMenu,
            CarManagement,
            BidManagement,
            DealerInformations,
            StockHistory,
            SendMail,
            Newsletter,
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