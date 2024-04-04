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
                <label for="email">Email ou Nom d'utilisateur:</label>
                <Field name="email" type="email" v-model="user.email" :rules="checkEmailOrUsername" class="form-control bg-light"/>
                <ErrorMessage name="email" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <label for="password">Mot de passe :</label>
                <Field name="password" type="password" v-model="user.password" :rules="validatePassword" autocomplete="current-password" class="form-control bg-light"/>
                <ErrorMessage name="password" class="form-control text-danger"/>
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-block" :disabled="loading">
                    <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                    <span>Login</span>
                </button>
            </div>
        </Form>
        <div
            v-if="message"
            class="alert"
            :class="successful ? 'alert-success' : 'alert-danger'"
            >{{message}}</div>
      </div>
    </div>
</template>
  
<script>
    import { Form, Field, ErrorMessage } from 'vee-validate';
    import User from '../models/user'

    export default {
        name: 'Login',
        data() {
            return {
                user: new User('', ''),
                loading: false,
                message: '',
                isValid: true,
            };
        },
        components: {
            Form,
            Field,
            ErrorMessage,
        },
        methods: {
            onSubmit(values) {
                console.log(values);
                this.loading = true;
                for (const v in values) {
                    if(!values[v]){
                        this.isValid = false;
                    }
                }
                if(this.isValid){
                    this.$store.dispatch('auth/login', this.user).then(
                        () => {
                            this.$router.push('/profile');
                        },
                        error => {
                            this.loading = false;
                            this.message = (error.response && error.response.data.message) ||
                            error.message ||
                            error.toString();
                        }
                    )
                }
            },
            checkEmailOrUsername(value) {
                if (!value) {
                    return "Ce champ est obligatoire";
                }
                const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                if (!regex.test(value)) {
                    this.user.username = this.user.email;
                }
                return true;
            },
            validatePassword(value){
                if(!value){
                    return "Ce champ est obligatoire"
                }
                return true;
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