<template>
  <v-row justify="center" class="mt-5" :class="{'fill-height': $vuetify.display.xs}">
    <v-col cols="12" sm="10" md="8" lg="6">
      <v-card class="pa-5 fill-height" :elevation="$vuetify.display.xs ? 0 : 8">
        <v-tabs 
          v-model="tab" 
          centered 
          grow
          density="comfortable"
          slider-color="red-800"
        >
        <v-tab @click="changeRoute('/testLogin')" value="testLogin">
          <span class="font-semibold text-red-800">Login</span>
        </v-tab>
          <v-tab @click="changeRoute('/testRegister')" value="testRegister"> <!-- Updated this line -->
            <span class="font-semibold text-red-800">Register</span>
          </v-tab>
        </v-tabs>

        <router-view 
          v-slot="{ Component }" 
          @navigateTo="changeRoute"
        >
          <v-expand-transition>
              <component :is="Component" />
          </v-expand-transition>
        </router-view>

      </v-card>
    </v-col>
  </v-row>
</template>

  




<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import LoginForm from "@/components/loginPages/testLogin.vue";
import VerifyExisting from "@/components/loginPages/testVerifyExisting.vue";
import RegisterForm from "@/components/loginPages/testRegister.vue";

export default {
  name: "Login",
  emits: ["showDashboard"],
  components: {
    LoginForm,
    VerifyExisting,
    RegisterForm,
  },
  data() {
    return {
      tab: 'testLogin',
      forgotPassword: null,
      forgotPasswordColor: null,
    };
  },
  mounted() {
    if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
  },
  setup() {
    const store = useLoggedInUserStore()
    return {
      store,
    }
  },
  watch: {
    // Watch the route and update the tab accordingly
    '$route.path': {
      immediate: true, // Execute the handler function immediately upon registration
      handler(newValue) {
        if (newValue === '/testLogin') {
          this.tab = 'testLogin';
        } else if (newValue === '/testRegister') {
          this.tab = 'testRegister';
        }
      }
    }
  },
  methods: {
    async login() {
      try {
        // Attempt to login
        await this.store.login(this.email, this.password);
        // After successful login, check if the user has completed forms
        await this.store.checkFormCompletion();
      } catch (error) {
        console.log(error);
      }
    },
    changeRoute(payload) {
      if (typeof payload === 'string') {
        // For simple string routes (backward compatibility)
        this.$router.push(payload);
      } else if (payload && payload.route) {
        // If payload is an object containing the route and userID
        this.$router.push({
          path: payload.route,
          params: { userID: payload.userID } // passing userID as a route parameter
        });
      }
    },
  },
};
</script>