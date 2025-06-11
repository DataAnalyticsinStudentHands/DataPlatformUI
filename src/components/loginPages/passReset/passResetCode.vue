<!--
passResetCode.vue - Password Reset Code Verification Component

This component handles the second step of the password reset process where users enter
the verification code sent to their email. It validates the code against the server,
and upon successful verification, redirects users to the password reset entry page.
The component includes navigation options to return to login or register for a new account
if users haven't received the reset email.
-->

<template>
    <v-card-text>
            <v-row>
                <v-col cols="12" class="pb-0">
                    <!-- Title asking the user to input the reset code -->
                    <h2 class="font-bold text-2xl text-custom-red tracking-widest">
                        {{$t('Password Reset Code')}}
                    </h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <!-- Instructions to input the password reset code -->
                    {{$t('Please check your email and input the password reset code.')}}
                    <br>
                    {{$t('If you do not see an email, please check your Spam folder, or ')}}
                    <span 
                        class="font-semibold text-custom-red cursor-pointer"
                        @click="$router.push('/register')"
                    >{{$t('Register for an Account.')}}</span>
                </v-col>

            <!-- Form to enter the reset code -->
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

                                <!-- Button container for navigating back to login and submitting the code -->
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
        // Component state for reset code verification
        return {
            userID: null,
            loading: false,
            code: null,
            rules: [
                // Required field validation for reset code
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
        // Retrieve user ID from navigation data if available
        if (useLoggedInUserStore().navigationData && useLoggedInUserStore().navigationData.userID) {
            this.userID = useLoggedInUserStore().navigationData.userID; 
        }
    },
    methods: {
        // Validates and submits the password reset code for verification
        async passFormSubmit() {
            // Validate form fields
            await this.$refs.passForm.validate();
            const passFormInvalid = this.$refs.passForm.errors.length > 0;

            const loggedInUserStore = useLoggedInUserStore();

            if (!passFormInvalid) {
                this.loading = true;
                
                let requestData = {
                    userID: this.userID,
                    confirmationCode: this.code 
                };

                let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/password-reset/verify-code`;

                try {
                    const response = await axios.post(apiURL, requestData);

                    if (response.status === 200) {
                        // Set authentication token for password reset
                        loggedInUserStore.setTokenHeader(response.data.token);

                        // Prepare success notification for next page
                        useLoggedInUserStore().navigationData = {
                            userID: this.userID,
                            toastType: 'success',
                            toastMessage: this.$t('Success! You may now reset your password.'),
                            toastPosition: 'top-right',
                            toastCSS: 'Toastify__toast--create'
                        };

                        // Navigate to password reset entry page
                        this.$router.push({
                            name: 'passResetNewEntry'
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

        // Navigate back to login page
        goBackToLogin() {
            this.$router.push({name: 'login'});
        },
    }
}
</script>