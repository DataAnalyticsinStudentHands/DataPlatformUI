<!--'/updateUserData' this page will allow user data changes-->
<template>
  <main>
    <v-container style="width: 90%; margin: 0 auto;">
      <p class="font-weight-black text-h5 text--primary">User Information Update Form</p>
      <p class="text-subtitle-1">{{$t("Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these details again.")}}</p>
    </v-container>
    <div v-if="loading" class="loading-container">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else>
    <v-form @submit.prevent="handleSubmitForm">
      <v-container style="width: 90%; margin: 0 auto;">
        <v-col cols="12" md="6">
          <v-text-field v-model="firstName" :label="$t('New First Name')"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="lastName" :label="$t('New Last Name')"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="email" :label="$t('New Email')"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-radio-group v-model="languagePreference" :label="$t('New Language Preference')" row>
            <v-radio :label="$t('English')" value="English" color="black"></v-radio>
            <v-radio :label="$t('Spanish')" value="Spanish" color="black"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" md="6">
          <p>{{$t('Please enter your password to confirm your changes:')}}</p>
          <v-text-field v-model="confirmPassword" :label="$t('Password')" type="password"></v-text-field>
        </v-col>
        <v-btn @click="handleSubmitForm">{{$t('Submit')}}</v-btn>
      </v-container>
    </v-form>
  </div>
  </main>
</template>


  <script>
  import axios from "axios";
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  export default {
    data() {
      return {
        userData: [],
        firstName: '',
        lastName: '',
        email: '',
        languagePreference: '',
        confirmPassword: ''
      };
    },
    mounted() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/user/`;

      try {
        useLoggedInUserStore().startLoading();

        axios.get(apiURL, { headers: { token } })
          .then((resp) => {
            this.userData = resp.data.user;
            this.firstName = this.userData.firstName;
            this.lastName = this.userData.lastName;
            this.email = this.userData.email;
            this.languagePreference = this.userData.languagePreference;
          })
          .catch((error) => {
            this.handleError(error);
          })
          .finally(() => {
            useLoggedInUserStore().stopLoading();
          });

        window.scrollTo(0, 0);
      } catch (error) {
        this.handleError('Error:', error);
        useLoggedInUserStore().stopLoading();
      }
    },

    computed: {
      loading() {
        const store = useLoggedInUserStore();
        return store.loading;
      }
    },
    methods: {
      async handleSubmitForm() {
        const user = useLoggedInUserStore();
        let token = user.token;
        let apiURL = import.meta.env.VITE_ROOT_API + `/userdata/updateUserData`;
        const destination = user.role === 'Student' ? 'studentDashboard' : user.role === 'Instructor' ? 'instructorDash' : '';

        
        axios.put(apiURL, {firstName: this.firstName, lastName: this.lastName, email: this.email, languagePreference: this.languagePreference, password: this.confirmPassword}, {headers: { token }})
        .then(() => {
          console.log('this.languagePreference: ', this.languagePreference);
          user.setLanguagePreference(this.languagePreference);
          let toastMessage = "";
          if (user.languagePreference === 'English') {
            toastMessage = 'User information updated!';
          } else if (user.languagePreference === 'Spanish') {
            toastMessage = '¡Información del Usuario actualizada!';
          }
          this.$router.push({ 
              name: destination,
              params: {
                toastType: 'info',
                toastMessage: toastMessage,
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--update'
            }
          });
        })
        .catch((error) => {
            this.handleError(error);
        });
      }
    }
  }
  </script>