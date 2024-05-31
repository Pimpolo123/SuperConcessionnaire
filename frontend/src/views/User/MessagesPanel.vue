<template>
    <div class="container-fluid w-90 p-2">
      <TabMenu :model="tabItems" />
      <Inbox v-if="currentTab == 'inbox'"></Inbox>
      <OutBox v-if="currentTab == 'outbox'"></OutBox>
    </div>
</template>
  
<script>
    import Inbox from './Inbox.vue';
    import OutBox from './OutBox.vue';
    import TabMenu from 'primevue/tabmenu';
    
    export default {
        name: 'MessagesPanel',
        data() {
            return {
                content: '',
                currentUser: JSON.parse(localStorage.getItem('user')),
                currentTab: 'inbox',
                tabItems: [
                    {
                        label: 'Messages reçus',
                        icon: 'pi pi-envelope',
                        command: () => {
                            this.currentTab = 'inbox';
                        }
                    },
                    {
                        label: 'Messages envoyés',
                        icon: 'pi pi-send',
                        command: () => {
                            this.currentTab = 'outbox'
                        }
                    }
                ]
            };
        },
        components: {
            Inbox,
            TabMenu,
            OutBox,
        },
        mounted() {
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