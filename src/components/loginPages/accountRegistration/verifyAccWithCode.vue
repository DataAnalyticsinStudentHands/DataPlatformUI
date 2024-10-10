<!-- verifyAccWithCode.vue - This component handles the email verification process for users. It presents a form to enter a confirmation code and submits the code to verify and activate the user's account. -->


<template>
    <v-card-text>
        <v-row>
            <v-col cols="12" class="pb-0">
                <!-- Title asking the user to verify their email -->
                <h2 class="font-bold text-2xl text-custom-red tracking-widest">
                    {{$t('Please Verify Your Email')}}
                </h2>
            </v-col>
        </v-row>

        <!-- Description of the email verification process -->
        <v-row>
            <v-col cols="12">
                {{$t('If your email address is not already associated with an account, you will receive a confirmation code to verify your email. This process may take a few minutes.')}}
            </v-col>
        </v-row>
        <!-- Form for entering the confirmation code -->
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
        // Validation rules for the confirmation code field
        value => {
            if (value) return true
            return this.$t('Code is required.')
        },
      ],
    };
  },
  mounted() {
    // Set the user ID if available in navigation data
    if (useLoggedInUserStore().navigationData && useLoggedInUserStore().navigationData.id) {
        this.userID = useLoggedInUserStore().navigationData.id;
    }
  },
  methods: {
    // Official Form Submission. Checks if there are errors. If not, proceed to activating account.
    formSubmit() {
        // Check if form has errors
        if (!this.code) {
            return;
        }
        this.activateAccount();
    },

    // Activates the account using a verification code and user ID. On successful account activation, updates user status, retrieves full name, sets the user as logged in, and navigates to the appropriate dashboard based on the user's role. If the account activation fails due to an expired or invalid code, attempts to send a new code and notifies the user accordingly.
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
                console.log("res.data: ", res.data)
                if (res.data.action && res.data.action === 'password-reset') {
                    console.log('action is password reset');

                    // Update store and localStorage with the new token that includes password-reset action
                    store.$patch({
                        token: res.data.token
                    });
                    localStorage.setItem("token", res.data.token);
                    store.setTokenHeader(res.data.token);

                    // Redirect to password reset page if the token action is 'password-reset'
                    this.$router.push("/passResetNewEntry");
                } else {
                    // Update store and localStorage with new JWT for regular account activation
                    store.$patch({
                        role: res.data.userRole,
                        userId: res.data.userID,
                        token: res.data.token,
                        languagePreference: res.data.languagePreference,
                        permissions: res.data.permissions // Include permissions if necessary
                    });

                    // Save the new token to localStorage
                    localStorage.setItem("token", res.data.token);

                    // Set the global default header for axios
                    store.setTokenHeader(res.data.token);

                    await store.getFullName();
                    store.isLoggedIn = true;

                    // Navigate to the appropriate dashboard based on the user's role
                    if (store.role === 'Instructor' || store.role === 'Group Instructor' || store.role === 'Group Admin' || store.role === 'Org Admin') {
                        this.$router.push("/instructorDash");
                    } else if (store.role === 'Student') {
                        console.log('store verifyAccWithCode: ', store.permissions);
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
                }
            } else {
                toast.error(this.$t('An error occurred. Please try again.'), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
        } catch (err) {
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
                toast.error(this.$t('An error has occurred. Please try again.'), {
                    position: 'top-right',
                    toastClassName: 'Toastify__toast--delete'
                });
            }
        } finally {
            this.loading = false;
        }
    },

// Sends a request to reissue a new verification code for the user, identified by userID. On successful request, the userID is extracted from the response.
    async sendNewCode() {
        let user = {
        userID: this.userID,
        error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/send-new-code`;

        axios.put(apiURL, user)
        .then((res) => {
            if (res.status == 200) {
            let userID = res.data.userID; // Extract the userID from the response
            } else {
            console.log('Unexpected response status:', res.status);
            }
        })
        .catch((err) => {
            this.handleError(err);
        });
    },
  }
}
</script>