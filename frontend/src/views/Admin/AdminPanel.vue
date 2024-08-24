<template>
    <div v-if="isAdmin()" class="container-fluid w-90 p-2">
        <TabMenu :model="tabItems" :scrollable="true"/>
        <UserManagement v-if="currentTab == 'userManagement'"></UserManagement>
        <StockPanel v-if="currentTab == 'stockPanel'"></StockPanel>
        <SendMail v-if="currentTab == 'sendMail'"></SendMail>
        <Newsletter v-if="currentTab == 'newsletter'"></Newsletter>
        <DealerInformations v-if="currentTab == 'dealerInformations'"></DealerInformations>
        <Availability v-if="currentTab == 'availability'"></Availability>
        <Appointments v-if="currentTab == 'appointments'"></Appointments>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';
    import UserManagement from './UserManagement.vue';
    import StockPanel from './StockPanel.vue';
    import DealerInformations from './DealerInformations.vue';
    import TabMenu from 'primevue/tabmenu';
    import SendMail from './SendMail.vue';
    import Newsletter from './Newsletter.vue';
    import Availability from './Availability.vue';
    import Appointments from './Appointments.vue';
    
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
                    {
                        label: 'Disponibilités',
                        icon: 'pi pi-calendar',
                        command: () => {
                            this.currentTab = 'availability'
                        }
                    },
                    {
                        label: 'Rendez-vous',
                        icon: 'pi pi-calendar',
                        command: () => {
                            this.currentTab = 'appointments'
                        }
                    }
                ]
            };
        },
        components: {
            UserManagement,
            TabMenu,
            DealerInformations,
            SendMail,
            Newsletter,
            Availability,
            Appointments,
            StockPanel
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