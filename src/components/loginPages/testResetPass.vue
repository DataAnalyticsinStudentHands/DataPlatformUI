<template>
    <v-card-text>
            <v-row>
                <v-col cols="12" class="pb-0">
                    <h2 class="font-bold text-2xl text-red-700 tracking-widest">
                        Password Reset
                    </h2>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    Please enter your email. If it exists in our records, you will receive a confirmation code shortly to reset your password.
                </v-col>
            </v-row>
                <v-row justify="center">
                    <v-col cols="8">
                        <v-sheet>
                            <v-form ref="emailForm" @submit.prevent="emailFormSubmit">
                                <v-text-field
                                    v-model="email"
                                    :rules="rules"
                                    label="Email:"
                                    class="mx-auto"
                                    style="width: 100%;"
                                >
                                </v-text-field>

                                <!-- Flex container to center the buttons -->
                                <div class="d-flex justify-center align-center">
                                    <v-btn 
                                        @click="goBackToLogin"
                                        class="mt-3 mr-2"
                                    >Back to Login</v-btn>
                                    <v-btn 
                                        :loading="loading"
                                        type="submit" 
                                        class="mt-3 bg-red-700 text-white rounded"
                                    >Submit</v-btn>
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
            awaitingEmailInput: true,
            awaitingConfirmationCode: false,
            userID: null,
            loading: false,
            email: null,
            rules: [
                v => {
                    if (!v) {
                        return 'Email is required';
                    } else if (!/.+@.+/.test(v)) {
                        return 'Email must be valid';
                    }
                    return true;
                }
            ],
        };
    },
    methods: {
        async emailFormSubmit() {
            // Check if there are any errors in the form
            await this.$refs.emailForm.validate();
            const emailFormInvalid = this.$refs.emailForm.errors.length > 0;

            // If no errors, proceed with login
            if (!emailFormInvalid) {
                console.log('email form is valid');
                this.loading = true;
                let user = {
                    email: this.email,
                    error: this.error,
                };
                let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/resetPassword`;

                try {
                    const response = await axios.put(apiURL, user);

                    if (response.status === 200) {
                        this.userID = response.data.userID;
                    } else {
                        toast.error("An error occurred. Please try again.", {
                            position: 'top-right',
                            toastClassName: 'Toastify__toast--delete'
                        });
                    }
                } catch (error) {
                    toast.error('An error occurred. Please try again.', {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete'
                    });
                } finally {
                    this.loading = false;
                    this.$emit('navigateTo', { route: '/testResetPassCode', userID: this.userID });


                }
            } else {
                console.log('form has errors');
            }
        },
        goBackToLogin() {
            // Assuming you have a route named 'login'
            this.$router.push({name: 'testLogin'});
        },
    }
}
</script>