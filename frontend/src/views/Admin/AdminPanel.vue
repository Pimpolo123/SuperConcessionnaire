<template>
    <header v-if="!isAdmin()" class="jumbotron">
        <h3>{{content}}</h3>
    </header>
    <div v-if="isAdmin()" class="container-fluid w-90 p-2">
      <TabMenu :model="tabItems" />
      <UserManagement v-if="currentTab == 'userManagement'"></UserManagement>
      <CarManagement v-if="currentTab == 'stockManagement'"></CarManagement>
      <BidManagement v-if="currentTab == 'bidManagement'"></BidManagement>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';
    import UserManagement from './UserManagement.vue';
    import CarManagement from './CarManagement.vue';
    import BidManagement from './BidManagement.vue';
    import TabMenu from 'primevue/tabmenu';
    
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
                        label: 'Gestion des Enchères',
                        icon: 'pi pi-book',
                        command: () => {
                            this.currentTab = 'bidManagement'
                        }
                    }
                ]
            };
        },
        components: {
            UserManagement,
            TabMenu,
            CarManagement,
            BidManagement
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