<!-- verifyAccWithEmailCode.vue - This component handles the email verification process for existing users. It presents a form to enter an email address and confirmation code, and submits the code to verify and activate the user's account. -->


<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" class="pb-0">
                <!-- Title asking the user to verify their email -->
                <h2 class="font-bold text-2xl text-custom-red tracking-widest">
                    {{$t('Verify Your Email')}}
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <!-- Description explaining the email verification process -->
                {{$t('Please enter your email address and the confirmation code received in your email to verify your account:')}}
            </v-col>
        </v-row>

        <!-- Form for entering the email and confirmation code -->
        <v-form ref="form" @submit.prevent="formSubmit">
        <v-row justify="center">
            <v-col cols="12" md="10">
                <v-sheet>
                        <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            :label="$t('Email:')"
                            class="mx-auto"
                            style="width: 100%;"
                        >
                        </v-text-field>
                </v-sheet>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="10"> 
                <v-sheet>
                        <v-text-field
                            v-model="code"
                            :rules="codeRules"
                            :label="$t('Confirmation Code:')"
                            class="mx-auto"
                            style="width: 100%;"
                        >
                        </v-text-field>
                        
                        <div class="d-flex justify-center align-center">
                            <!-- Back to Login Button -->
                            <v-btn 
                                @click="goBackToLogin"
                                class="mt-3 mr-2"
                            >{{$t('Back to Login')}}</v-btn>
                            <!-- Submit Button -->
                            <v-btn 
                                :loading="loading"
                                type="submit" 
                                class="mt-3 bg-custom-red text-white rounded"
                            >{{$t('Submit')}}</v-btn>
                        </div>
                </v-sheet>
            </v-col>
        </v-row>
        </v-form>
    </v-card-text>
</template>



<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from 'axios'
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "VerifyExisting",
  props: ["id"],
  data() {
    return {
      email: null,
      code: null,
      loading: false,
      // Validation rules for the email input
      emailRules: [
        v => {
            if (!v) {
                return this.$t('Email is required');
            } else if (!/.+@.+/.test(v)) {
                return this.$t('Email must be valid');
            }
            return true;
        }
      ],
      // Validation rules for the confirmation code input
      codeRules: [
        v => {
            if (!v) {
                return this.$t('Code is required')
            }
            return true;
        }
      ],
    };
  },
  methods: {
    // Called when Form is submitted. Activates the account if there are no errors in the form.
    formSubmit() {
        // Check if form has errors
        if (!this.code) {
            return;
        }
        this.activateAccount();
    },

    // Activates the account using an email and a verification code. On successful activation, navigates to the login page with a success toast message. If the activation fails due to an invalid email or code, displays an error toast. For expired codes, attempts to resend a new code.
    async activateAccount() {
        this.loading = true;
        let user = {
            email: this.email,
            code: this.code,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/verify-with-email`;
        try {
            const res = await axios.put(apiURL, user);

            if (res.status === 200) {
                useLoggedInUserStore().navigationData = {
                    toastType: 'success',
                    toastMessage: this.$t('Your account is activated! You may now login.'),
                    toastPosition: 'top-right',
                    toastCSS: 'Toastify__toast--create'
                };

                this.$router.push({
                    name: 'login'
                });
            }
        } catch (err) {
            if (err.response.data.title === 'Invalid') {
                toast.error(this.$t('Invalid Email or Code.'), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
            if (err.response.data.title === 'Expired') {
                try {
                    await this.sendNewCode();
                } catch (error) {
                    toast.error(this.$t('An error occurred. Please try again.'), {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete'
                    });
                }
            }
        } finally {
            this.loading = false;
        }
    },
    
    // Sends a request to generate and send a new verification code to the user's email. Notifies the user with a toast message when a new code is sent successfully.
    async sendNewCode() {
        let user = {
        email: this.email,
        error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/send-new-code`;

        axios.put(apiURL, user)
        .then((res) => {
            if (res.status == 200) {
                toast.error(this.$t('Your code has already expired. A new code has been sent! Please wait for email.'), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    autoClose: false,
                });
            } else {
                console.log('Unexpected response status:', res.status);
            }
        })
        .catch((err) => {
            this.handleError(err);
        });
    },

    // Navigate to Login screen
    goBackToLogin() {
        this.$router.push({name: 'login'});
    },
  }
}
</script>