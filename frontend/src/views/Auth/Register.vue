<template>
    <div class="col-md-12">
      <div class="card card-container">
        <FileUpload mode="basic" accept="image/*"
            :maxFileSize="5000000" class="btn btn-primary btn-block" chooseLabel="Choisir une image"
            @select="onSelect"
            invalidFileSizeMessage="Taille de fichier invalide, le fichier doit faire moins de {1}"
            invalidFileTypeMessage="{0} : Type de fichier invalide, le fichier doit être une image">
        </FileUpload>
        <Form @submit="onSubmit">
            <div class="form-group">
                <label for="username">Nom d'utilisateur* :</label>
                <Field name="username" type="username" :rules="validateUsername" v-model="user.username" class="form-control bg-light"/>
                <ErrorMessage name="username" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="email">Email* :</label>
                <Field name="email" type="email" :rules="validateEmail" v-model="user.email" class="form-control bg-light"/>
                <ErrorMessage name="email" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="surname">Prénom* :</label>
                <Field name="surname" v-model="user.surname" type="username" :rules="validateName" class="form-control bg-light"/>
                <ErrorMessage name="surname" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="name">Nom* :</label>
                <Field name="name" v-model="user.name" type="username" :rules="validateName" class="form-control bg-light"/>
                <ErrorMessage name="name" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="phonenumber">Numéro de téléphone :</label>
                <Field name="phonenumber" v-model="user.phonenumber" type="username" :rules="validatePhone" class="form-control bg-light"/>
                <ErrorMessage name="phonenumber" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="birthdate">Date de naissance :</label>
                <Datepicker name="birthdate" v-model="user.birthdate" menu-class-name="dp-custom-input" :format="format" :enable-time-picker="false"/>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe* :</label>
                <div class="d-flex">
                    <Field name="password" :type="fieldType" :rules="validatePassword" v-model="user.password" class="form-control bg-light"/>
                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                </div>
                <ErrorMessage name="password" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="confirm">Confirmation* :</label>
                <div class="d-flex">
                    <Field name="confirm" :type="fieldType" rules="confirmed:@password" class="form-control bg-light"/>
                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                </div>
                <ErrorMessage name="confirm" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-block" type="submit">
                    <span>S'inscrire</span>
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
    import { ref } from 'vue';
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import User from '../../models/user';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { defineRule } from 'vee-validate';
    import FileUpload from 'primevue/fileupload';
    import 'primevue/resources/themes/bootstrap4-light-purple/theme.css'

    defineRule('confirmed', (value, [target]) => {
        if (value === target) {
            return true;
        }
        return 'Les mots de passe ne sont pas identiques';
    });

    export default {
        name: 'Register',
        data() {
            return {
                user: new User('', '', ''),
                submitted: false,
                successful: false,
                isValid: true,
                message: '',
                date: ref(new Date()),
                fieldType: "password",
                pictureObject: {
                    file: '',
                    username: ''
                },
                format: (date) => {
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();

                    return `${day}/${month}/${year}`;
                }
            };
        },
        props: {
            type: { type: String, default: "password" },
        },
        components: {
            Form,
            Field,
            ErrorMessage,
            Datepicker,
            FontAwesomeIcon,
            FileUpload
        },
        methods: {
            onSubmit(values) {
                console.log(values);
                this.submitted = true;
                for (const v in values) {
                  if(!v){
                    this.isValid = false;
                  }
                }
                if(this.isValid){
                    this.user.roles = [1];
                    this.$store.dispatch('auth/register', this.user).then(
                        data => {
                            this.message = data.message;
                            this.successful = true;
                            if(this.pictureObject.file && this.successful == true){
                                this.pictureObject.username = this.user.username;
                                this.$store.dispatch('user/uploadpicture', this.pictureObject).then(
                                    data => {
                                        console.log(data);
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
                        error => {
                        this.message = (error.response && error.response.data.message) ||
                            error.message ||
                            error.toString();
                            this.successful = false;
                        }
                    );
                }
            },
            onSelect(value){
                this.pictureObject.file = value.files[0];
            },
            validateEmail(value) {
                if (!value) {
                    return "Ce champ est obligatoire";
                }
                const regex = /^[A-Z0-9._%+-]{3,30}@[A-Z0-9.-]{2,20}\.[A-Z]{2,4}$/i;
                if (!regex.test(value)) {
                    return "Adresse e-mail invalide";
                }
                return true;
            },
            validateUsername(value){
                if(!value){
                    return "Ce champ est obligatoire"
                }
                const regex = /^[A-Z0-9._%+-@]{3,20}\b$/i;
                if (!regex.test(value)) {
                    return "Nom d'utilisateur invalide. Le nom doit faire entre 3 et 20 caractères et ne peut pas se terminer par un symbole (._%+-@)";
                }
                return true;
            },
            validatePassword(value){
                if(!value){
                    return "Ce champ est obligatoire"
                }
                return true;
            },
            validateName(value){
                if(!value){
                    return "Ce champ est obligatoire"
                }
                const regex = /^.{3,20}\b$/i;
                if (!regex.test(value)) {
                    return "Nom d'utilisateur invalide. Le nom doit faire entre 3 et 20 caractères et ne peut pas se terminer par un symbole (._%+-@)";
                }
                return true;
            },
            validatePhone(value){
                if(!value){
                    value = '';
                }
                const regex = /^$/i;
                const regex1 = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i;
                if (!regex.test(value) && !regex1.test(value)) {
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
        watch:{
            type(val){
                this.fieldType = val;
            }
        },
        mounted(){
            this.fieldType = this.type;
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