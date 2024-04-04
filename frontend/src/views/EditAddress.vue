<template>
    <div class="col-md-12">
      <div class="card ml-5 mr-5">
        <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
        />
        <Form @submit="onSubmit">
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="country">Pays : </label>
                    <Field name="country" v-model="user.address.country" class="form-control bg-light" />
                    <ErrorMessage name="country" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-4">
                    <label for="region">Région :</label>
                    <Field name="region" v-model="user.address.region" class="form-control bg-light" />
                    <ErrorMessage name="region" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-4">
                    <label for="city">Ville :</label>
                    <Field name="city" v-model="user.address.city" class="form-control bg-light"/>
                    <ErrorMessage name="city" class="form-control text-danger"/>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="street">Rue :</label>
                    <Field name="street" v-model="user.address.street" class="form-control bg-light"/>
                    <ErrorMessage name="street" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-4">
                    <label for="housenumber">Numéro :</label>
                    <Field name="housenumber" v-model="user.address.housenumber" class="form-control bg-light"/>
                    <ErrorMessage name="housenumber" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-4">
                    <label for="boxnumber">Numéro de boîte :</label>
                    <Field name="boxnumber" v-model="user.address.boxnumber" class="form-control bg-light" />
                    <ErrorMessage name="boxnumber" class="form-control text-danger"/>
                </div>
            </div>
            <div class="form-group col-md-3">
                <label for="password">Mot de passe :</label>
                <div class="d-flex">
                    <Field name="password" :type="fieldType" :rules="validatePassword" v-model="user.password" class="form-control bg-light" placeholder=" Mot de passe actuel" />
                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                </div>
                <ErrorMessage name="password" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-block" type="submit">
                    <span>Enregistrer</span>
                </button>
            </div>
        </Form>
        <div
          v-if="message"
          class="alert mt-2"
          :class="successful ? 'alert-success' : 'alert-danger'"
        >{{message}}</div>
      </div>
    </div>
</template>
  
<script>
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import User from '../models/user';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import UserService from '../services/user.service';
    import { ref } from 'vue';
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import { defineRule } from 'vee-validate';
    export default {
        name: 'EditAddress',
        data() {
            return {
                user: JSON.parse(localStorage.getItem('user')),
                content: '',
                submitted: false,
                successful: false,
                message: '',
                isValid: true,
                fieldType: 'password',
            };
        },
        components: {
            Form,
            Field,
            ErrorMessage,
            FontAwesomeIcon
        },
        mounted() {
        },
        methods: {
            onSubmit(values) {
                console.log('VALUES', values);
                this.submitted = true;
                for (const v in values) {
                  if(!v){
                    this.isValid = false;
                  }
                }
                if(this.isValid){
                    this.$store.dispatch('user/editaddress', {user: this.user, address: this.user.address}).then(
                        data => {
                            this.message = data.message;
                            this.successful = true;
                            setTimeout( () => this.$router.push('/profile'), 1500);
                        },
                        error => {
                            this.message = (error.response && error.response.data.message) ||
                            error.message ||
                            error.toString();
                            this.successful = false;
                        }
                    )
                }
            },
            validatePassword(value){
                if(!value){
                    return "Entrez votre mot de passe actuel pour confirmer"
                }
                return true;
            },
            switchVisibility(){
                if (this.fieldType == "password") {
                    this.fieldType = "text";
                } else 
                    this.fieldType = "password";
            }
        },
    };
</script>

<style scoped>
    label {
        display: block;
        margin-top: 10px;
    }
    
    .card-container.card {
        max-width: 350px !important;
        padding: 40px 40px;
    }
    
    .card {
        background-color: #f7f7f7;
        padding: 20px 25px 30px;
        margin: 0 auto 25px;
        margin-top: 50px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    }
    
    .profile-img-card {
        width: 96px;
        height: 96px;
        margin: 0 auto 10px;
        display: block;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
    }
</style>