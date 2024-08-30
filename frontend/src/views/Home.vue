<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-4">
                <div class="square-button" @click="goToPage('/carlist')">
                    <h4>Voir les véhicules disponibles</h4>
                </div>
            </div>
            <div class="col-4">
                <div class="square-button" @click="goToPage('/bidlist')">
                    <h4>Voir les enchères en cours</h4>
                </div>
            </div>
            <div class="col-4">
                <div class="square-button" @click="goToPage('/tickets')">
                    <h4>Support</h4>
                </div>
            </div>
        </div>
        <div class="row">
            <!-- <div class="col-6">
                <div class="square-button" @click="goToPage()">
                    <h4>Vendez votre véhicule</h4>
                </div>
            </div> -->
        </div>
    </div>
</template>
  
<script>
    import UserService from '../services/user.service';
    
    export default {
        name: 'Home',
        data() {
            return {
                content: '',
                hovered: null
            };
        },
        mounted() {
            UserService.getPublicContent().then(
                response => {
                    this.content = response.data;
                },
                error => {
                    this.content =
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString();
                }
            );
        },
        methods: {
            goToPage(route) {
                this.$router.push(route);
            }
        }
    };
</script>
<style scoped>
    .square-button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 12vh;
        line-height: 12vh;
        margin: 1rem; 
        background-color: var(--bs-primary);
        color: white;
        text-align: center;
        border-radius: 15px;
    }
    .square-button:hover {
        cursor: pointer;
    }

    .square-button h4 {
        transition: transform 0.3s ease-in-out;
    }

    .square-button:hover h4 {
        transform: scale(1.2);
    }
</style>