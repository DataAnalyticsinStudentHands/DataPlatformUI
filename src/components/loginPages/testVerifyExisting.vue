<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" class="pb-0">
                <h2 class="font-bold text-2xl text-red-700 tracking-widest">
                    {{$t('Verify Your Email')}}
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                {{$t('Please enter your email address and the confirmation code received in your email to verify your account:')}}
            </v-col>
        </v-row>
        <v-form ref="form" @submit.prevent="formSubmit">
        <v-row justify="center">
            <v-col cols="8">
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
            <v-col cols="8"> 
                <v-sheet>
                        <v-text-field
                            v-model="code"
                            :rules="codeRules"
                            :label="$t('Confirmation Code:')"
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
                                class="mt-3 bg-red-700 text-white rounded"
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
    formSubmit() {
        // Check if form has errors
        if (!this.code) {
            return;
        }
        this.activateAccount();
    },
    async activateAccount() {
        this.loading = true;
        let user = {
            email: this.email,
            code: this.code,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/verifyExisting`;
        try {
            const res = await axios.put(apiURL, user);

            if (res.status === 200) {
                this.$router.push({
                    name: 'testLogin',
                    params: {
                        toastType: 'success',
                        toastMessage: 'Your account is activated! You may now login.',
                        toastPosition: 'top-right',
                        toastCSS: 'Toastify__toast--create'
                    }
                });
            }
        } catch (err) {
            console.log('err: ', err.message);
            if (err.response.data.title === 'Invalid') {
                toast.error("Invalid Email or Code.", {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
            if (err.response.data.title === 'Expired') {
                try {
                    await this.sendNewCode();
                } catch (error) {
                    toast.error("An unexpected error occurred. Please try again.", {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete'
                    });
                }
            }
        } finally {
            this.loading = false;
        }
    },


    async sendNewCode() {
        let user = {
        email: this.email,
        error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/sendNewCode`;

        axios.put(apiURL, user)
        .then((res) => {
            if (res.status == 200) {
                toast.error('Your code has already expired. A new code has been sent! Please wait for email.', {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete',
                    autoClose: false,
                });
            } else {
                console.log('Unexpected response status:', res.status);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    },

    goBackToLogin() {
        this.$router.push({name: 'testLogin'});
    },
  }
}
</script>