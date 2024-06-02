<template>
    <Toast></Toast>
    <Card>
        <template #title>Informations du concessionaire</template>
        <template #content>
            <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <InputText class="w-100 mt-3" placeholder="Nom de l'entreprise" v-model="informations.dealershipName" id="dealershipName" :invalid="submitted && !informations.dealershipName"/>
                    <small class="p-error" v-if="submitted && !informations.dealershipName">Nom requis</small>
                </div>
                <div class="col-md-4">
                    <InputText class="w-100 mt-3" placeholder="Numéro de compte" v-model="informations.bankAccount" id="street" :invalid="submitted && !informations.bankAccount"/>
                    <small class="p-error" v-if="submitted && !informations.bankAccount">Numéro de compte requis</small>
                </div>
                <div class="col-md-4">
                    <InputNumber class="w-100 mt-3" placeholder="Numéro de téléphone" v-model="informations.phoneNumber" id="phoneNumber" :invalid="submitted && !informations.phoneNumber"/>
                    <small class="p-error" v-if="submitted && !informations.phoneNumber">Numéro de téléphone requis</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                        <Dropdown class="w-100 mt-3" :options="countryList" optionLabel="countryName" :placeholder="country" v-model="informations.country" 
                        @change="getRegions" id="country" :invalid="submitted && !informations.country"/>
                    <small class="p-error" v-if="submitted && !informations.country">Pays requis</small>
                </div>
                <div class="col-md-4">
                        <Dropdown class="w-100 mt-3" :options="regionList" optionLabel="regionName" :placeholder="region" v-model="informations.region" 
                        id="region" :invalid="submitted && !informations.region"/>
                    <small class="p-error" v-if="submitted && !informations.region">Région requise</small>
                </div>
                <div class="col-md-4">
                    <InputNumber class="w-100 mt-3" placeholder="Code postal" v-model="informations.postcode" id="postcode" :invalid="submitted && !informations.postcode"/>
                    <small class="p-error" v-if="submitted && !informations.postcode">Code postal requis</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <InputText class="w-100 mt-3" placeholder="Ville" v-model="informations.city" id="postcode" :invalid="submitted && !informations.city"/>
                    <small class="p-error" v-if="submitted && !informations.city">Ville requise</small>
                </div>
                <div class="col-md-4">
                    <InputText class="w-100 mt-3" placeholder="Rue" v-model="informations.street" id="street" :invalid="submitted && !informations.street"/>
                    <small class="p-error" v-if="submitted && !informations.street">Rue requise</small>
                </div>
                <div class="col-md-4">
                    <InputNumber class="w-100 mt-3" placeholder="Numéro" v-model="informations.number" id="number" :invalid="submitted && !informations.number"/>
                    <small class="p-error" v-if="submitted && !informations.number">Numéro requis</small>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <Button icon="pi pi-save" type="button" label="Enregistrer" class="mt-3" @click="submit"></Button>
                </div>
            </div>
        </div>
        </template>
    </Card>
</template>

<script>
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import FloatLabel from 'primevue/floatlabel';

export default {
    data() {
        return {
            currentUser: this.$store.state.auth.user,
            informations: {},
            countryList: [],
            regionList: [],
            submitted: false,
            country: 'Pays',
            region: 'Région'
        };
    },
    created() {
    },
    mounted() {
        this.$store.dispatch('user/getcountrylist').then(
            res => {
                this.countryList = this.sortByKey(res.data, 'countryName');
            }
        );
        this.$store.dispatch('admin/getdealerinformations').then(
            res => {
                if(res){
                    console.log(res);
                    this.informations = res;
                    this.country = this.informations.country;
                    this.region = this.informations.region;
                }
            },
            error => {
                console.log(error);
            }
        );
    },
    components: {
        Toast,
        Card,
        Dropdown,
        Button,
        InputText,
        InputNumber,
        FloatLabel
    },
    methods: {
        isAdmin() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
        sortByKey(array, key) {
            return array.sort(function(a, b) {
                var x = a[key];
                var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
        getRegions(event) {
            this.$store.dispatch('user/getregionlist', {id:parseInt(event.value.id)}).then(
                res => {
                    this.regionList = res;
                }
            )
        },
        submit() {
            console.log(this.informations);
            this.submitted = true;
            if(this.informations.dealershipName && this.informations.bankAccount && (this.informations.country.countryName || this.country != 'Pays') && (this.informations.region.regionName || this.region != 'Région') && this.informations.postcode 
                && this.informations.city && this.informations.street && this.informations.number && this.informations.phoneNumber) {
                this.$store.dispatch('admin/updatedealerinformations', {
                    id: 1,
                    dealershipName: this.informations.dealershipName,
                    bankAccount: this.informations.bankAccount,
                    country: this.informations.country?.countryName ?? this.country,
                    region: this.informations.region?.regionName ?? this.region,
                    postcode: this.informations.postcode,
                    city: this.informations.city,
                    street: this.informations.street,
                    number: this.informations.number,
                    phoneNumber: this.informations.phoneNumber
                }).then(
                    res => {
                        this.$toast.add({severity:'success', summary: 'Succès', detail: 'Informations mises à jour', life: 3000});
                    },
                    error => {
                        this.$toast.add({severity:'error', summary: 'Erreur', detail: 'Erreur lors de la mise à jour des informations', life: 3000});
                    }
                );
            } else {
                this.$toast.add({severity:'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs', life: 3000});
            }
        },
    }
};
</script>