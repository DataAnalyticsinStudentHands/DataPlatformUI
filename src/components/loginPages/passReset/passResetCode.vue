<template>
    <v-card-text>
            <v-row>
                <v-col cols="12" class="pb-0">
                    <h2 class="font-bold text-2xl text-custom-red tracking-widest">
                        {{$t('Password Reset Code')}}
                    </h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    {{$t('Please check your email and input the password reset code.')}}
                    <br>
                    {{$t('If you do not see an email, please check your Spam folder, or ')}}
                    <span 
                        class="font-semibold text-custom-red cursor-pointer"
                        @click="$router.push('/register')"
                    >{{$t('Register for an Account.')}}</span>
                </v-col>
            </v-row>
                <v-row justify="center">
                    <v-col cols="12" md="8">
                        <v-sheet>
                            <v-form ref="passForm" @submit.prevent="passFormSubmit">
                                <v-text-field
                                    v-model="code"
                                    :rules="rules"
                                    :label="$t('Code:')"
                                    class="mx-auto"
                                    style="width: 100%;"
                                >
                                </v-text-field>

                                <!-- Flex container to center the buttons -->
                                <div class="d-flex justify-center align-center">
                                    <v-btn 
                                        @click="goBackToLogin"
                                        class="mt-3 mr-2"
                                    >{{$t('Back to Login')}}</v-btn>
                                    <v-btn 
                                        :loading="loading"
                                        type="submit" 
                                        class="mt-3 bg-custom-red text-white rounded"
                                    >{{$t('Submit')}}</v-btn>
                                </div>
                            </v-form>
                        </v-sheet>
                    </v-col>
                </v-row>
    </v-card-text>
</template>


<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
export default {
    data() {
        return {
            userID: null,
            loading: false,
            code: null,
            rules: [
                v => {
                    if (!v) {
                        return this.$t('Code is required');
                    }
                    return true;
                }
            ],
        };
    },
    mounted() {
        if (this.$route.params && this.$route.params.userID) {
            this.userID = this.$route.params.userID; 
        }
    },
    methods: {
        async passFormSubmit() {
            // Check if there are any errors in the form
            await this.$refs.passForm.validate();
            const passFormInvalid = this.$refs.passForm.errors.length > 0;

            // Instantiate the store
            const loggedInUserStore = useLoggedInUserStore();

            // If no errors, proceed
            if (!passFormInvalid) {
                this.loading = true;
                
                let requestData = {
                    userID: this.userID,
                    confirmationCode: this.code 
                };

                let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/passwordReset/verifyCode`;

                try {
                    const response = await axios.post(apiURL, requestData);

                    if (response.status === 200) {
                        // Set token as global header
                        loggedInUserStore.setTokenHeader(response.data.token);
                        
                        this.$router.push({
                            name: 'passResetNewEntry',
                            params: { 
                                userID: this.userID,
                                toastType: 'success',
                                toastMessage: this.$t('Success! You may now reset your password.'),
                                toastPosition: 'top-right',
                                toastCSS: 'Toastify__toast--create'
                            }
                        });

                    } else {
                        toast.error(this.$t('Invalid code. Please try again.'), {
                            position: 'top-right',
                            toastClassName: 'Toastify__toast--delete'
                        });
                    }
                } catch (error) {
                    toast.error(this.$t('Invalid code. Please try again.'), {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete'
                    });
                } finally {
                    this.loading = false;
                }
            }
        },
        goBackToLogin() {
            this.$router.push({name: 'login'});
        },
    }
}
</script>