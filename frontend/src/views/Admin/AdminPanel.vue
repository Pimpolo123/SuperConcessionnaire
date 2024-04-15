<template>
    <div class="container">
      <header class="jumbotron">
        <h3>{{content}}</h3>
      </header>
      <TabMenu :model="tabItems" />
      <UserManagement v-if="currentTab == 'userManagement'"></UserManagement>
      <h1 v-if="currentTab == 'stockManagement'">stockstockstock</h1>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';
    import UserManagement from './UserManagement.vue';
    import TabMenu from 'primevue/tabmenu';
    
    export default {
        name: 'Admin',
        data() {
            return {
                content: '',
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
                    }
                ]
            };
        },
        components: {
            UserManagement,
            TabMenu
        },
        mounted() {
        UserService.getAdminBoard().then(
            response => {
                console.log(response);
                this.content = response.data;
            },
            error => {
            this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
        );
        }
    };
</script>