<!-- passResetCode.vue - This component handles the password reset code verification process. Users input the code sent to their email, and the code is verified before allowing them to reset their password. -->


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
        return {
            userID: null,
            loading: false,
            code: null,
            rules: [
                // Validation rule for the reset code
                v => {
                    if (!v) {
                        return this.$t('Code is required');
                    }
                    return true;
                }
            ],
        };
    },
    
    // When the component is mounted, retrieve the user ID from the store's navigation data
    mounted() {
        if (useLoggedInUserStore().navigationData && useLoggedInUserStore().navigationData.userID) {
            this.userID = useLoggedInUserStore().navigationData.userID; 
        }
    },
    methods: {

        // Validates the password reset form and, if no errors are found, submits a request to verify the password reset code. On successful verification, updates the user token in the store and navigates to the password reset entry page with a success toast message.
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

                let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/password-reset/verify-code`;

                try {
                    const response = await axios.post(apiURL, requestData);

                    if (response.status === 200) {
                        // Set token as global header
                        loggedInUserStore.setTokenHeader(response.data.token);

                        useLoggedInUserStore().navigationData = {
                            userID: this.userID,
                            toastType: 'success',
                            toastMessage: this.$t('Success! You may now reset your password.'),
                            toastPosition: 'top-right',
                            toastCSS: 'Toastify__toast--create'
                        };

                        
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

        // Navigate to Login screen.
        goBackToLogin() {
            this.$router.push({name: 'login'});
        },
    }
}
</script>