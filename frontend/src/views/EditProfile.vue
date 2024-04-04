<template>
    <div class="col-md-12">
      <div class="card card-container">
        <img
          id="profile-img"
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          class="profile-img-card"
        />
        <Form @submit="onSubmit">
            <div class="form-group">
                <label for="username">Nom d'utilisateur :</label>
                <Field name="username" type="username" v-model="user.username" class="form-control bg-light" :disabled=true />
                <ErrorMessage name="username" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="email">Email :</label>
                <Field name="email" type="email" v-model="user.email" class="form-control bg-light" :disabled=true />
                <ErrorMessage name="email" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="surname">Prénom :</label>
                <Field name="surname" v-model="user.surname" type="username" :rules="validateName" class="form-control bg-light"/>
                <ErrorMessage name="surname" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="name">Nom :</label>
                <Field name="name" v-model="user.name" type="username" :rules="validateName" class="form-control bg-light"/>
                <ErrorMessage name="name" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="phone">Numéro de téléphone :</label>
                <Field name="phone" v-model="user.phonenumber" type="username" :rules="validatePhone" class="form-control bg-light"/>
                <ErrorMessage name="phone" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="birthdate">Date de naissance :</label>
                <Datepicker name="birthdate" v-model="user.birthdate" menu-class-name="dp-custom-input" :format="format" :enable-time-picker="false"/>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe :</label>
                <div class="d-flex">
                    <Field name="password" :type="fieldType" :rules="validatePassword" v-model="user.password" class="form-control bg-light" placeholder=" Mot de passe actuel" />
                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                </div>
                <ErrorMessage name="password" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <div class="d-flex">
                    <Field name="newpassword" :type="fieldType" v-model="newpassword" class="form-control bg-light" placeholder=" Nouveau mot de passe" />
                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                </div>
                <ErrorMessage name="confirm" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <div class="d-flex">
                    <Field name="confirm" :type="fieldType" rules="confirmed:@newpassword" class="form-control bg-light" placeholder="Confirmation"/>
                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                </div>
                <ErrorMessage name="confirm" class="form-control text-danger"/>
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
    import UserService from '../services/user.service';
    import { ref } from 'vue';
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import User from '../models/user';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { defineRule } from 'vee-validate';
    
    defineRule('confirmed', (value, [target]) => {
        if (value === target) {
            return true;
        }
        return 'Les mots de passe ne sont pas identique';
    });

    export default {
        name: 'EditProfile',
        data() {
            return {
                user: JSON.parse(localStorage.getItem('user')),
                content: '',
                submitted: false,
                successful: false,
                message: '',
                newpassword: undefined,
                isValid: true,
                fieldType: 'password',
                format: (date) => {
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();

                    return `${day}/${month}/${year}`;
                }
            };
        },
        components: {
            Form,
            Field,
            ErrorMessage,
            Datepicker,
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
                    this.$store.dispatch('user/editprofile', {user: this.user, newpassword: this.newpassword}).then(
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
            validateName(value){
                if(!value){
                    return "Ce champ est obligatoire"
                }
                const regex = /^.{3,20}\b$/i;
                if (!regex.test(value)) {
                    return "Le nom doit faire entre 3 et 20 caractères";
                }
                return true;
            },
            validatePhone(value){
                const regex1 = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i;
                if(value==undefined || value==''){
                    return true;
                }
                if (!regex1.test(value)) {
                    return "Numéro de téléphone invalide";
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