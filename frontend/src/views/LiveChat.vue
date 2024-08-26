<template>
    <div class="container-fluid">
        <Card class="p-card-content d-flex justify-content-end" v-if="isAdmin()">
            <template #title>Chats en cours :</template>
            <template #content >
                <TabView class="chat" @tab-change="tabChange">
                    <TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
                        <div id="chat" class="chat">
                        <ul id="messages">
                            <li v-for="(message, index) in messages" :key="index">
                                <strong>{{ message.user }} :</strong> {{ message.text }}
                            </li>
                        </ul>
                    </div>
                    <InputText v-model="newMessage" @keyup.enter="sendMessage" placeholder="Tapez votre message ici"/>
                    </TabPanel>
                </TabView>
            </template>
        </Card>
        <Card class="p-card-content d-flex justify-content-end" v-if="!isAdmin()">
            <template #title>Chat avec un admin :</template>
            <template #content >
                <div id="chat" class="chat">
                    <ul id="messages">
                        <li v-for="(message, index) in messages" :key="index">
                            <strong>{{ message.user }} :</strong> {{ message.text }}
                        </li>
                    </ul>
                </div>
                <InputText v-model="newMessage" @keyup.enter="sendMessage" placeholder="Tapez votre message ici"/>
            </template>
        </Card>
    </div>
</template>

<script>
import io from 'socket.io-client';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default {
data() {
    return {
        currentUser: JSON.parse(localStorage.getItem('user')),
        socket: null,
        messages: [],
        newMessage: '',
        tabs: [
        ],
        rooms: [],
        selectedRoom: null
    };
},
mounted() {
    this.socket = io('http://localhost:8080');

    if(!this.isAdmin()) {
        this.socket.emit('join room', this.currentUser.id);

        this.socket.on('chat message', (msg) => {
            console.log('Message reçu:', msg);
            this.messages.push(msg);
        });
    } else {
        this.socket.emit('get rooms');
        this.socket.on('chat message', (msg) => {
            console.log('Message reçu:', msg);
            this.messages.push(msg);
        });
        // Recevoir la liste des rooms
        this.socket.on('rooms list', (rooms) => {
            
            rooms.forEach(room => {
                this.socket.emit('join room', room);
                this.tabs.push({ title: room, content: '' });
            });
            this.selectedRoom = rooms[0];
            this.rooms = rooms;
            console.log('Rooms:', rooms);
        });
    }
},
beforeUnmount() {
    this.socket.emit('leave room', this.currentUser.id);
},
components: {
    InputText,
    Card,
    TabView,
    TabPanel
},
methods: {
    sendMessage() {
        if(this.selectedRoom === null) {
            this.selectedRoom = this.currentUser.id;
        }
        
        console.log('Envoi du message:', this.newMessage);
        
        if (this.newMessage.trim() !== '') {
            const message = {
                user: this.currentUser.name,
                text: this.newMessage,
                roomId: this.selectedRoom // Utilisation de l'ID de l'utilisateur comme roomId
            };

            // Envoyer un message au serveur dans la room spécifique
            this.socket.emit('chat message', message);
            this.newMessage = '';
        }
    },
    isAdmin() {
        if (this.currentUser && this.currentUser.roles) {
            return this.currentUser.roles.includes('ROLE_ADMIN');
        }
        return false;
    },
    tabChange(e) {
        console.log(this.tabs[e.index].title);
        this.selectedRoom = this.tabs[e.index].title;
    }
}
};
</script>
<style scoped>
.p-card-content {
    display: flex;
    flex-direction: column;
    height: 80vh; /* Hauteur de la carte */
}
.chat {
    height: 63vh;
}
</style>