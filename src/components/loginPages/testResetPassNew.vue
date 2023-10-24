<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" class="pb-0">
                <h2 class="font-bold text-2xl text-red-700 tracking-widest">
                    Update Password
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                Please enter your new password:
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="8">
                <v-sheet>
                    <v-form ref="passForm" @submit.prevent="passFormSubmit">
                        <!-- New Password Field with prepend icon -->
                        <v-text-field
                            v-model="newPassword"
                            type="password"
                            :rules="newPassRules"
                            label="New Password:"
                            class="mx-auto"
                            style="width: 100%;"
                            prepend-icon="mdi-lock"
                        ></v-text-field>

                        <!-- Re-enter Password Field -->
                        <v-text-field
                            v-model="reEnterPassword"
                            type="password"
                            :rules="reEnterPassRules"
                            label="Re-enter Password:"
                            class="mx-auto"
                            style="width: 100%;"
                            prepend-icon="mdi-lock"
                        ></v-text-field>

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
            newPassword: null,
            reEnterPassword: null,
            newPassRules: [
                v => {
                    if (!v) {
                        return 'Password is required';
                    }
                    if (v.length < 8) {
                        return 'Password must be at least 8 characters long';
                    }
                    return true;
                },
                v => {
                    if (v !== this.reEnterPassword) {
                        return 'Passwords must match';
                    }
                    return true;
                }
            ],


            reEnterPassRules: [
                v => {
                    if (!v) {
                        return 'Re-entered password is required';
                    }
                    if (v.length < 8) {
                        return 'Password must be at least 8 characters long';
                    }
                    return true;
                },
                v => {
                    if (v !== this.newPassword) {
                        return 'Passwords must match';
                    }
                    return true;
                }
            ],

        };
    },
    mounted() {
        if (this.$route.params.toastMessage) {
            toast.success(this.$route.params.toastMessage, {
                position: this.$route.params.toastPosition || 'top-right',
                toastClassName: this.$route.params.toastClassName || 'Toastify__toast'
            });
        }
    },
    // clear out the temporary token when user leaves view
    beforeDestroy() {
        const loggedInUserStore = useLoggedInUserStore();
        loggedInUserStore.removeTokenHeader();
    },
    watch: {
        newPassword(newVal, oldVal) {
            if (newVal !== oldVal) {
                // Validate reEnterPassword when newPassword changes
                this.$refs.passForm.validate('reEnterPassword');
            }
        },
        reEnterPassword(newVal, oldVal) {
            if (newVal !== oldVal) {
                // Validate newPassword when reEnterPassword changes
                this.$refs.passForm.validate('newPassword');
            }
        }
    },
    methods: {
        async passFormSubmit() {
            // Check if there are any errors in the form
            await this.$refs.passForm.validate();
            const passFormInvalid = this.$refs.passForm.errors.length > 0;

            // Instantiate the store
            const loggedInUserStore = useLoggedInUserStore();

            console.log('loggedInUserStore.token: ', loggedInUserStore.token);

            // If no errors, proceed with updating the password
            if (!passFormInvalid) {
                console.log('pass form is valid');
                this.loading = true;
                
                // We're sending the new password for reset, no need to send email
                let dataToSend = {
                    password: this.newPassword,
                };

                let apiURL = import.meta.env.VITE_ROOT_API + `/userData/resetPassNew`;

                try {
                    const response = await axios.put(apiURL, dataToSend, {
                        headers: {
                            'token': loggedInUserStore.token
                        }
                    });

                    if (response.status === 200) {


                        // Redirecting the user to login after password reset
                        this.$router.push({ 
                            name: 'testLogin',
                            params: { 
                                toastMessage: 'Password Reset! You may now login.',
                                toastPosition: 'top-right',
                                toastClassName: 'Toastify__toast--create'
                            }

                        });
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