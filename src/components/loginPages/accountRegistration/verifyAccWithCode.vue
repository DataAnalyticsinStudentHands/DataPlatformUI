<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" class="pb-0">
                <h2 class="font-bold text-2xl text-custom-red tracking-widest">
                    {{$t('Please Verify Your Email')}}
                </h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                {{$t('Please check your email for a confirmation code to verify your email address. This may take a few minutes.')}}
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-sheet>
                    <v-form ref="form" validate-on="submit lazy" @submit.prevent="formSubmit">
                        <v-text-field
                            v-model="code"
                            :rules="rules"
                            :label="$t('Confirmation Code:')"
                            class="mx-auto"
                            style="width: 100%;"
                        >
                        </v-text-field>
                        <v-row justify="center">
                            <v-col cols="6">
                                <v-btn 
                                    :loading="loading"
                                    type="submit" 
                                    block 
                                    class="mt-3 bg-custom-red text-white rounded"
                                >{{$t('Submit')}}</v-btn>
                            </v-col>
                       </v-row>
                    </v-form>
                </v-sheet>
            </v-col>
        </v-row>
    </v-card-text>
</template>



<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from 'axios'
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  name: "VerifyNew",
  props: ["id"],
  data() {
    return {
      code: "",
      loading: false,
      userID: null,
      rules: [
        value => {
            if (value) return true
            return this.$t('Code is required.')
        },
      ],
    };
  },
  mounted() {
    if (this.$route.params && this.$route.params.id) {
        this.userID = this.$route.params.id;
    }
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
            code: this.code,
            userID: this.userID,
            error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/verify`;
        const store = useLoggedInUserStore();
        let token = store.token;

        try {
            const res = await axios.put(apiURL, user, {
                headers: {
                    'token': token
                }
            });

            if (res.status === 200) {
                await store.verifyExistingAcc(res.data);
                await store.getFullName();
                store.isLoggedIn = true;
                // Navigate to the appropriate dashboard based on the user's role
                if (store.role === 'Instructor') {
                    this.$router.push("/instructorDash");
                } else if (store.role === 'Student') {
                    // After successful verification, check if the student has completed forms
                    await store.checkFormCompletion();
                    if (store.hasCompletedEntryForm) {
                    this.$router.push("/studentDashboard");
                    } else {
                    this.$router.push("/studentEntryForm");
                    }
                } else if (store.role === 'Basic') {
                    this.$router.push("/dashboard");
                } else {
                    this.$router.push("/");
                }
            } else {
                toast.error(this.$t('An error occurred. Please try again.'), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
        } catch (err) {
            console.log('err: ', err);
            if (err.response && err.response.status === 401) {
                if (err.response.data.title === 'Expired code') {
                    try {
                        await this.sendNewCode();
                        toast.error(this.$t('Your code has already expired. A new code has been sent! Please wait for email.'), {
                            position: 'top-right',
                            toastClassName: 'Toastify__toast--delete',
                            autoClose: false,
                        });
                    } catch (error) {
                        this.handleError(error);
                    }
                } else if (err.response.data.title === 'Invalid code') {
                    toast.error(this.$t('Invalid code.'), {
                        position: 'top-right',
                        toastClassName: 'Toastify__toast--delete'
                    });
                }
            } else {
                console.log(err);
                toast.error(this.$t('An error has occured. Please try again.'), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
        } finally {
            this.loading = false;
        }
    },


    async sendNewCode() {
        let user = {
        userID: this.userID,
        error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/sendNewCode`;

        axios.put(apiURL, user)
        .then((res) => {
            if (res.status == 200) {
            let userID = res.data.userID; // Extract the userID from the response
            } else {
            console.log('Unexpected response status:', res.status);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    },
  }
}
</script>