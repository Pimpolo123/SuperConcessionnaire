<template>
    <div class="d-flex justify-content-center">
        <div class="col-md-6">
            <div class="card ml-5 mr-5">
                <img
                id="profile-img"
                :src="imgSrc"
                class="profile-img-card"
                />
                <div class="d-flex justify-content-center">
                    <FileUpload mode="basic" accept="image/*"
                        :maxFileSize="5000000" class="btn btn-primary btn-flex " chooseLabel="Choisir une image"
                        @select="onSelect"
                        invalidFileSizeMessage="Taille de fichier invalide, le fichier doit faire moins de {1}"
                        invalidFileTypeMessage="{0} : Type de fichier invalide, le fichier doit être une image">
                    </FileUpload>
                </div>
                <div class="d-flex justify-content-center">
                    <div v-if="picture">La photo changera lors de la prochaine connexion</div>
                </div>
                <Form @submit="onSubmit">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="username">Nom d'utilisateur :</label>
                            <Field name="username" type="username" v-model="user.username" class="form-control bg-light" :disabled=true />
                            <ErrorMessage name="username" class="form-control text-danger"/>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="email">Email :</label>
                            <Field name="email" type="email" v-model="user.email" class="form-control bg-light" :disabled=true />
                            <ErrorMessage name="email" class="form-control text-danger"/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="surname">Prénom :</label>
                            <Field name="surname" v-model="user.surname" type="username" :rules="validateName" class="form-control bg-light"/>
                            <ErrorMessage name="surname" class="form-control text-danger"/>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="name">Nom :</label>
                            <Field name="name" v-model="user.name" type="username" :rules="validateName" class="form-control bg-light"/>
                            <ErrorMessage name="name" class="form-control text-danger"/>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="phonenumber">Numéro de téléphone :</label>
                            <Field name="phonenumber" v-model="user.phonenumber" :rules="validatePhone" class="form-control bg-light"/>
                            <ErrorMessage name="phonenumber" class="form-control text-danger"/>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="birthdate">Date de naissance :</label>
                            <Datepicker name="birthdate" v-model="user.birthdate" menu-class-name="dp-custom-input" :format="format" :enable-time-picker="false"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <div class="d-flex">
                                    <Field name="newpassword" :type="fieldType" v-model="newpassword" class="form-control bg-light" placeholder=" Nouveau mot de passe" />
                                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                                </div>
                                <ErrorMessage name="confirm" class="form-control text-danger"/>
                            </div>
                            <div class="form-group col-md-6">
                                <div class="d-flex">
                                    <Field name="confirm" :type="fieldType" rules="confirmed:@newpassword" class="form-control bg-light" placeholder="Confirmation"/>
                                    <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                                </div>
                                <ErrorMessage name="confirm" class="form-control text-danger"/>
                            </div>
                        </div>
                        <label for="password">Mot de passe :</label>
                        <div class="d-flex">
                            <Field name="password" :type="fieldType" :rules="validatePassword" v-model="user.password" class="form-control bg-light" placeholder=" Mot de passe actuel" />
                            <button type="button" @click="switchVisibility" class="btn btn-primary ml-2"><font-awesome-icon icon="fa-solid fa-eye"/></button>
                        </div>
                        <ErrorMessage name="password" class="form-control text-danger"/>
                    </div>
                    <div class="form-group d-flex justify-content-center">
                        <button class="btn btn-primary btn-flex" type="submit">
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
    </div>
</template>
  
<script>
    import Datepicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { defineRule } from 'vee-validate';
    import FileUpload from 'primevue/fileupload';
    
    defineRule('confirmed', (value, [target]) => {
        if (value === target) {
            return true;
        }
        return 'Les mots de passe ne sont pas identiques';
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
                picture: false,
                newpassword: undefined,
                isValid: true,
                fieldType: 'password',
                imgSrc: '',
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
        components: {
            Form,
            Field,
            ErrorMessage,
            Datepicker,
            FontAwesomeIcon,
            FileUpload
        },
        mounted() {
            if(!this.user.imgUrl){
                this.imgSrc = "//ssl.gstatic.com/accounts/ui/avatar_2x.png";
            } else {
                this.imgSrc = 'data:image/png;base64,' + this.user.imgUrl;
            }
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
                            setTimeout( () => this.$router.push('/profile'), 2000);
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
            onSelect(value){
                this.picture = true;
                this.pictureObject.file = value.files[0];
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