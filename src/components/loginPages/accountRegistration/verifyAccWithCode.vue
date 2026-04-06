<!--
verifyAccWithCode.vue - Email Verification Component

This component handles the email verification process for newly registered users or password reset requests.
Users enter a confirmation code sent to their email to activate their account. The component validates
the code, activates the account, and redirects users to the appropriate dashboard based on their role.
It also handles expired codes by automatically sending new ones and provides proper error messaging
for invalid codes. The component supports both account activation and password reset workflows.
-->

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
                <p>{{$t('A confirmation code has been sent to your email. Please enter the code below.')}}</p>
                <p>{{$t(' If you don\'t see an email, check your spam or junk folder.')}}</p>
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
    // Component state for verification code and form validation
    return {
      code: "",
      loading: false,
      userID: null,
      rules: [
        // Validation rule for required confirmation code
        value => {
            if (value) return true
            return this.$t('Code is required.')
        },
      ],
    };
  },
  mounted() {
    // Set the user ID from navigation data if available
    if (useLoggedInUserStore().navigationData && useLoggedInUserStore().navigationData.id) {
        this.userID = useLoggedInUserStore().navigationData.id;
    }
  },
  methods: {
    // Validates form and initiates account activation
    formSubmit() {
        if (!this.code) {
            return;
        }
        this.activateAccount();
    },

    // Activates the account using verification code and handles both regular activation and password reset flows
    async activateAccount() {
        this.loading = true;
        let user = {
            code: this.code,
            userID: this.userID,
            error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/verify`;
        const store = useLoggedInUserStore();

        try {
            const res = await axios.put(apiURL, user);

            if (res.status === 200) {
                if (res.data.action && res.data.action === 'password-reset') {
                    // Handle password reset flow
                    this.$router.push("/passResetNewEntry");
                } else {
                    // Handle regular account activation
                    store.$patch({
                        role: res.data.userRole,
                        userId: res.data.userID,
                        languagePreference: res.data.languagePreference,
                        permissions: res.data.permissions
                    });

                    await store.getFullName();
                    store.isLoggedIn = true;

                    // Navigate to appropriate dashboard based on user role
                    if (store.role === 'Instructor' || store.role === 'Group Instructor' || store.role === 'Group Admin' || store.role === 'Org Admin') {
                        this.$router.push("/instructorDash");
                    } else if (store.role === 'Student') {
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
            // Handle expired or invalid codes
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

    // Requests a new verification code for the user
    async sendNewCode() {
        let user = {
        userID: this.userID,
        error: this.error,
        };
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/send-new-code`;

        axios.put(apiURL, user)
        .then((res) => {
            if (res.status == 200) {
            let userID = res.data.userID;
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