<!-- passResetRequest.vue - This component allows users to initiate the password reset process by entering their email. If the email exists in the records, a confirmation code is sent to the user's email to proceed with resetting their password. -->


<template>
    <v-card-text>
            <v-row>
                <!-- Title for the password reset form -->
                <v-col cols="12" class="pb-0">
                    <h2 class="font-bold text-2xl text-custom-red tracking-widest">
                        {{$t('Password Reset')}}
                    </h2>
                </v-col>
            </v-row>

            <!-- Instructions for the user to enter their email -->
            <v-row>
                <v-col cols="12">
                    {{$t('Please enter your email. If it exists in our records, you will receive a confirmation code shortly to reset your password.')}}
                </v-col>
            </v-row>

                <!-- Form to capture the email address -->
                <v-row justify="center">
                    <v-col cols="12" md="10">
                        <v-sheet>
                            <v-form ref="emailForm" @submit.prevent="emailFormSubmit">
                                <v-text-field
                                    v-model="email"
                                    :rules="rules"
                                    :label="$t('Email:')"
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
            userID: "",
            loading: false,
            email: null,
            // Validation rules for the email input
            rules: [
                v => {
                    if (!v) {
                        return this.$t('Email is required');
                    } else if (!/.+@.+/.test(v)) {
                        return this.$t('Email must be valid');
                    }
                    return true;
                }
            ],
        };
    },
    methods: {
        
        // Validates the email form and initiates the password reset process for the given email. On successful initiation, stores the user ID and token received from the response, then navigates to the password reset code  verification page.
        async emailFormSubmit() {
            // Check if there are any errors in the form
            await this.$refs.emailForm.validate();
            const emailFormInvalid = this.$refs.emailForm.errors.length > 0;

            // If no errors, proceed with login
            if (!emailFormInvalid) {
                this.loading = true;
                let user = {
                    email: this.email,
                    error: this.error,
                };
                let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/password-reset/initiate`;

                try {
                    const response = await axios.put(apiURL, user);

                    if (response.status === 200) {
                        this.userID = response.data.userID;
                        // Grab the token from the response
                        this.token = response.data.token;
                    } else {
                        toast.error(this.$t('An error occurred. Please try again.'), {
                            position: 'top-right',
                            toastClassName: 'Toastify__toast--delete'
                        });
                    }
                } catch (error) {
                    toast.error(this.$t('An error occurred. Please try again.'), {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete'
                    });
                } finally {
                    this.loading = false;
                    useLoggedInUserStore().navigationData = {
                        userID: this.userID
                    };

                    this.$router.push({
                        name: 'passResetCode'
                    });


                }
            }
        },

        // Navigate to Login screen
        goBackToLogin() {
            this.$router.push({name: 'login'});
        },
    }
}
</script>