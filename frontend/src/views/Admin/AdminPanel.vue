<template>
    <div v-if="isAdmin()" class="container-fluid w-90 p-2">
        <TabMenu :model="tabItems" :scrollable="true"/>
        <UserManagement v-if="currentTab == 'userManagement'"></UserManagement>
        <StockPanel v-if="currentTab == 'stockPanel'"></StockPanel>
        <MailsPanel v-if="currentTab == 'mailsPanel'"></MailsPanel>
        <DealerInformations v-if="currentTab == 'dealerInformations'"></DealerInformations>
        <AppointmentsPanel v-if="currentTab == 'appointmentsPanel'"></AppointmentsPanel>
        <Statistics v-if="currentTab == 'statistics'"></Statistics>
        <AdminTicketView v-if="currentTab == 'tickets'"></AdminTicketView>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';
    import UserManagement from './UserManagement.vue';
    import StockPanel from './StockPanel.vue';
    import DealerInformations from './DealerInformations.vue';
    import TabMenu from 'primevue/tabmenu';
    import MailsPanel from './MailsPanel.vue';
    import AppointmentsPanel from './AppointmentsPanel.vue';
    import Statistics from './Statistics.vue';
    import AdminTicketView from './AdminTicketView.vue';
    
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
                        label: 'Gestion des voitures',
                        icon: 'pi pi-book',
                        command: () => {
                            this.currentTab = 'stockPanel'
                        }
                    },
                    {
                        label: 'Mails',
                        icon: 'pi pi-envelope',
                        command: () => {
                            this.currentTab = 'mailsPanel'
                        }
                    },
                    {
                        label: 'Informations du concessionnaire',
                        icon: 'pi pi-info',
                        command: () => {
                            this.currentTab = 'dealerInformations'
                        }
                    },
                    {
                        label: 'Rendez-vous',
                        icon: 'pi pi-calendar',
                        command: () => {
                            this.currentTab = 'appointmentsPanel'
                        }
                    },
                    {
                        label: 'Statistiques',
                        icon: 'pi pi-chart-bar',
                        command: () => {
                            this.currentTab = 'statistics'
                        }
                    },
                    {
                        label: 'Tickets',
                        icon: 'pi pi-eye',
                        command: () => {
                            this.currentTab = 'tickets'
                        }
                    },
                ]
            };
        },
        components: {
            UserManagement,
            TabMenu,
            DealerInformations,
            MailsPanel,
            AppointmentsPanel,
            StockPanel,
            Statistics,
            AdminTicketView
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