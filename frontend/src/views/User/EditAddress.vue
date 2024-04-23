<template>
    <div class="col-md-12">
      <div class="card ml-5 mr-5">
        <Form @submit="onSubmit">
            <div class="form-row">
                <div class="form-group col-md-3">
                    <label for="country">Pays : </label>
                    <Field name="country" v-model="country" class="form-select bg-light" as="select" @input="setSelectedCountry">
                        <option value="" disabled><p v-if="user.address.country">{{ user.address.country }}</p></option>
                        <option v-for="country in countryList" :value="country.id">{{ country.countryName }}</option>
                    </Field>
                    <ErrorMessage name="country" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-3">
                    <label for="region">Région :</label>
                    <Field name="region" class="form-select bg-light" as="select" @input="setSelectedRegion">
                        <option value="" disabled><p v-if="user.address.region">{{ user.address.region }}</p></option>
                        <option v-for="region in regionList" :value="region.id">{{ region.regionName }}</option>
                    </Field>
                    <ErrorMessage name="country" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-3">
                    <label for="city">Ville :</label>
                    <Field name="city" v-model="user.address.city" :rules="validateCity" class="form-control bg-light"/>
                    <ErrorMessage name="city" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-3">
                    <label for="postcode">Code postal :</label>
                    <Field name="postcode" v-model="user.address.postcode" :rules="validatePostcode" class="form-control bg-light"/>
                    <ErrorMessage name="postcode" class="form-control text-danger"/>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="street">Rue :</label>
                    <Field name="street" v-model="user.address.street" :rules="validateStreet" class="form-control bg-light"/>
                    <ErrorMessage name="street" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-4">
                    <label for="housenumber">Numéro :</label>
                    <Field name="housenumber" v-model="user.address.housenumber" :rules="validateHouseNumber" class="form-control bg-light"/>
                    <ErrorMessage name="housenumber" class="form-control text-danger"/>
                </div>
                <div class="form-group col-md-4">
                    <label for="boxnumber">Numéro de boîte (optionnel) :</label>
                    <Field name="boxnumber" v-model="user.address.boxnumber" :rules="validateBoxNumber" class="form-control bg-light" />
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
    import vSelect from 'vue-select';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import '@vuepic/vue-datepicker/dist/main.css';
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
                countryList: [],
                regionList: [],
                country: ''
            };
        },
        components: {
            Form,
            Field,
            ErrorMessage,
            FontAwesomeIcon,
            vSelect,
        },
        mounted() {
            this.$store.dispatch('user/getcountrylist').then(
                res => {
                    this.countryList = this.sortByKey(res.data, 'countryName');
                }
            )
        },
        methods: {
            onSubmit(values) {
                this.submitted = true;
                for (const v in values) {
                  if(!v){
                    this.isValid = false;
                  }
                }
                if(this.isValid){
                    this.$store.dispatch('user/editaddress', this.user).then(
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
            validateCity(value){
                const regex = /^[a-zA-Z ]+$/i;
                if(!value){
                    return "Veuillez saisir une ville"
                }
                if (!regex.test(value)) {
                    return "Nom de ville invalide";
                }
                return true;
            },
            validatePostcode(value){
                const regex = /^[0-9]{3,7}\b$/i;
                if(!value){
                    return "Veuillez saisir un code postal"
                }
                if (!regex.test(value)) {
                    return "Code postal invalide";
                }
                return true;
            },
            validateStreet(value){
                const regex = /^[a-zA-Z ]{2,100}$/i;
                if (!regex.test(value)) {
                    return "Format du nom de rue invalide";
                }
                if(!value){
                    return "Veuillez saisir un nom de rue"
                }
                return true;
            },
            validateHouseNumber(value){
                const regex = /^[0-9]{1,4}\b$/i;
                if(!value){
                    return "Veuillez saisir un numéro de maison"
                }
                if (!regex.test(value)) {
                    return "Numéro de maison invalide";
                }
                return true;
            },
            validateBoxNumber(value){
                if(!value){
                    value = '';
                }
                const regex = /^$/i;
                const regexFull = /^[0-9]{0,4}\b$/i;
                if (!regex.test(value) && !regexFull.test(value)) {
                    return "Numéro de boite invalide";
                }
                return true;
            },
            switchVisibility(){
                if (this.fieldType == "password") {
                    this.fieldType = "text";
                } else 
                    this.fieldType = "password";
            },
            sortByKey(array, key) {
                return array.sort(function(a, b) {
                    var x = a[key];
                    var y = b[key];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
            },
            setSelectedCountry(country) {
                this.user.address.country = this.countryList.find(
                    element => element.id === parseInt(country.target.value)).countryName;

                this.$store.dispatch('user/getregionlist', {id:parseInt(country.target.value)}).then(
                    res => {
                        this.regionList = res;
                    }
                )
                return true;
            },
            setSelectedRegion(region) {
                this.user.address.region = this.regionList.find(
                    element => element.id === parseInt(region.target.value)).regionName;
                return true;
            }
        },
    };
</script>

<style scoped>
    @import "vue-select/dist/vue-select.css";
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