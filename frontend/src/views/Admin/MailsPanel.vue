<template>
    <div v-if="isAdmin()" class="container-fluid w-100 p-2">
        <TabMenu :model="tabItems" :scrollable="true"/>
        <SendMail v-if="currentTab == 'sendMail'"></SendMail>
        <Newsletter v-if="currentTab == 'newsletter'"></Newsletter>
    </div>
</template>
  
<script>
    import UserService from '../../services/user.service';  
    import SendMail from './SendMail.vue';
    import Newsletter from './Newsletter.vue';
    import TabMenu from 'primevue/tabmenu';
    
    export default {
        name: 'Admin',
        data() {
            return {
                content: '',
                currentUser: JSON.parse(localStorage.getItem('user')),
                currentTab: 'sendMail',
                tabItems: [
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
                ]
            };
        },
        components: {
            TabMenu,
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