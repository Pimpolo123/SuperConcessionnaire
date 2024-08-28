<template>
    <div v-if="isAdmin()" class="container-fluid w-100 p-2">
        <TabMenu :model="tabItems" :scrollable="true"/>
        <Appointments v-if="currentTab == 'appointments'"></Appointments>
        <Availability v-if="currentTab == 'availability'"></Availability>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';  
    import Appointments from './Appointments.vue';
    import Availability from './Availability.vue';
    import TabMenu from 'primevue/tabmenu';
    
    export default {
        name: 'Admin',
        data() {
            return {
                content: '',
                currentUser: JSON.parse(localStorage.getItem('user')),
                currentTab: 'availability',
                tabItems: [
                    {
                        label: 'Mes disponibilités',
                        icon: 'pi pi-calendar',
                        command: () => {
                            this.currentTab = 'availability'
                        }
                    },
                    {
                        label: 'Mes rendez-vous',
                        icon: 'pi pi-calendar',
                        command: () => {
                            this.currentTab = 'appointments'
                        }
                    },
                ]
            };
        },
        components: {
            TabMenu,
            Appointments,
            Availability,
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