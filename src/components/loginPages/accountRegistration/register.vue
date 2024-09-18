<!-- /registerForm -->
<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <h1 class="font-bold text-2xl text-custom-red tracking-widest mt-3 mb-5">
                    {{$t('Create Your Account')}}
                </h1>
            </v-col>
        </v-row>
        <form @submit.prevent="userSubmitForm">
            <v-row>
                <!-- First Name and Last Name -->
                <v-col cols="12" md="6">
                    <label for="firstName" class="block font-semibold">{{$t('First Name')}}</label>
                    <input
                    v-model="user.firstName"
                    type="text"
                    name="firstName"
                    id="firstName"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    :placeholder="$t('First Name')"
                    required="" />
                </v-col>
                <v-col cols="12" md="6">
                    <label for="lastName" class="block font-semibold">{{$t('Last Name')}}</label>
                    <input 
                    v-model="user.lastName"
                    type="text"
                    name="lastName"
                    id="lastName"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    :placeholder="$t('Last Name')"
                    required="" />
                </v-col>
                <!-- Email and Confirm Email -->
                <v-col cols="12" md="6">
                    <label for="email" class="block font-semibold">{{$t('Your email')}}</label>
                    <input 
                    v-model="user.email"
                    type="email"
                    name="email"
                    id="email"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="name@company.com"
                    required="" />
                </v-col>
                <v-col cols="12" md="6">
                    <label for="confirm_email" class="block font-semibold">{{$t('Confirm Email')}}</label>
                    <input 
                    v-model="user.confirm_email"
                    type="email"
                    name="confirn_email"
                    id="confirn_email"
                    placeholder="name@company.com"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required="" />
                </v-col>
                <!-- Language Preference -->
                <v-col cols="12">
                    <label class="block mb-2 font-semibold">{{$t('Preferred communication language')}}</label>
                    <v-row>
                        <v-col cols="6" md="3">
                            <label class="inline-flex items-center">
                            <input 
                            type="radio"
                                name="languagePreference"
                                value="English"
                                v-model="user.languagePreference"
                                required />
                            <span class="ml-2">{{$t('English')}}</span>
                            </label>
                        </v-col>
                        <v-col cols="6" md="3">
                            <label class="inline-flex items-center">
                            <input 
                            type="radio"
                                name="languagePreference"
                                value="Spanish"
                                v-model="user.languagePreference"
                                required />
                            <span class="ml-2">{{$t('Spanish')}}</span>
                            </label>
                        </v-col>
                    </v-row>
                </v-col>
                <!-- Password and Confirm Password -->
                <v-col cols="12" md="6">
                    <label for="password" class="block font-semibold">{{$t('Password')}}</label>
                    <div class="relative">
                      <input 
                      v-model="user.password"
                      :type="showPassword ? 'text' : 'password'"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required="" />
                      <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                          <i @click="showPassword = !showPassword" class="mdi mdi-eye cursor-pointer"></i>
                      </span>
                    </div>
                    <span class="text-custom-red" v-if="v$.user.password.$error">
                      <p v-for="error of v$.user.password.$errors" :key="error.$uid">{{ error.$message }}!</p>
                    </span>
                </v-col>
                <v-col cols="12" md="6">
                    <label for="confirm-password" class="block font-semibold">{{$t('Confirm password')}}</label>
                    <div class="relative">
                      <input 
                      v-model="user.confirm_pasword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="••••••••"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required="" />
                      <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                          <i @click="showConfirmPassword = !showConfirmPassword" class="mdi mdi-eye cursor-pointer"></i>
                      </span>
                    </div>
                </v-col>
            </v-row>
            <v-row>
              <!-- Submit Button -->
              <v-col cols="12">
                  <v-btn 
                    :loading="loading"
                    type="submit" 
                    class="bg-custom-red text-white rounded w-full py-2 hover:bg-red-600"
                  >{{$t('Create an account')}}</v-btn>
                  <p class="text-sm font-medium text-gray-500 mt-4 text-center">
                  {{$t('Already have an account?')}}
                  <!-- Updated this line to use @click and router.push -->
                  <span class="font-bold text-custom-red hover:underline cursor-pointer" @click="$router.push('/login')">{{$t('Login here')}}</span>
                  </p>
              </v-col>
          </v-row>
        </form>
    </v-container>
</template>

  
  <script>
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import useVuelidate from "@vuelidate/core";
  import { minLength, required } from "@vuelidate/validators";
  import axios from "axios";
  import swal from "sweetalert";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
  
  export default {
    name: "RegisterForm",
    setup() {
      return { v$: useVuelidate({ $autoDirty: true }) };
    },
    data() {
      return {
        isConfirmPasswordValid: false,
        isConfirmEmailValid: false,
        user: {
          firstName: "",
          lastName: "",
          email: "",
          languagePreference: "",
          password: "",
          role: "Basic",
        },
        errorr: "",
        loading: false,
        showPassword: false,
        showConfirmPassword: false,
      };
    },
    methods: {
      // Validates that the user's confirmed password and email match their respective inputs. Displays a toast notification if there is a mismatch.
      checkConfirmPassword() {
        this.isConfirmPasswordValid = true;
        this.isConfirmEmailValid = true;
        if (this.user.password !== this.user.confirm_pasword) {
          this.errorr = "Passwords do not match.";
          this.isConfirmPasswordValid = false;
          toast.error(this.$t('Passwords do not match!'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete'
          });
        } else if (this.user.email !== this.user.confirm_email) {
          this.errorr = "Emails do not match.";
          this.isConfirmEmailValid = false;
          toast.error(this.$t('Emails do not match!'), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete'
          });
        }
      },
      // Submits the user registration form after validating the entire form, confirming password and email match. On successful submission, displays a success message and clears the form, then redirects to verification with the user's ID. 
      async userSubmitForm() {
        // Checks to see if there are any errors in validation
        const isFormCorrect = await this.v$.$validate();
        this.checkConfirmPassword();
        // If no errors found. isFormCorrect = True then the form is submitted
        if (
          isFormCorrect &&
          this.isConfirmPasswordValid &&
          this.isConfirmEmailValid
        ) {
          this.loading = true;
          let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/register`;
          axios.post(apiURL, this.user).then(
            async (response) => {
              //using swal from sweetalert.js for customizeble alerts
              // swal(
              //   this.$t("You have registered successfully!"),
              //   this.$t("Please check your email and follow the steps to verify your account."),
              //   "success"
              // );

              this.user = {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "",
                error: "",
              };

              const userID = response.data.userID;

              const store = useLoggedInUserStore();

              await store.verifyExistingAcc(response.data);

              store.navigationData = {
                id: userID
              };

              this.$router.push({ 
                name: 'verifyAccWithCode'
              });
            },
            (err) => {
              if (err.response && err.response.data.title === 'Registration Failed.') {
                toast.error(this.$t(err.response.data.error), {
                  position: 'top-right',
                  toastClassName: 'Toastify__toast--delete'
                });
              } else {
                this.handleError(err);
              }
            }
          ).finally(() => {
            this.loading = false;
          });
        }
      },
    },
    validations() {
      return {
        user: {
          firstName: { required },
          lastName: { required },
          languagePreference: { required },
          password: {
            required,
            minLengthValue: minLength(8),
          },
          email: { required },
        },
      };
    },
  };
  </script>
  
  <style scoped>
  /* Style for the radio button itself */
  input[type="radio"] {
      appearance: none;
      border: 1px solid black;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      outline: none;
      margin-right: 4px; /* Reduced margin for proximity to the label */
      position: relative;
      background-color: white;
      transition: background 0.3s, border-color 0.3s;
  }
  
  /* Style when the radio button is checked */
  input[type="radio"]:checked {
      border: 2px solid #333; /* Darker border when checked */
      background-color: gray;
  }
  </style>
  