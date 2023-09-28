<template>
  <main>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">
        Welcome {{ firstName }} {{ lastName }}
    </h1>
    <v-container style="width: 90%; margin: 0 auto;">
  </v-container>
</main>

</template>

  <script>
  import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  import { DateTime } from "luxon";
  import axios from "axios";
  export default {
    data() {
      return {
        queryData: [],
        firstName: "",
        lastName: ""
      };
    },
    mounted() {
      let token = localStorage.getItem("token");
      let url = import.meta.env.VITE_ROOT_API + `/userdata/user`;
      axios
        .get(url, {
          headers: {token},
        })
        .then(
          (res) => {
            this.firstName = res.data.user.firstName;
            this.lastName = res.data.user.lastName;
          },
          (err) => {
            if (err) {
              this.$router.push("/login");
            }
          }
        )
      let apiURL = import.meta.env.VITE_ROOT_API + `/dashboarddata/recentEvent/`;
      this.queryData = [];
      axios.get(apiURL,{
          headers: { token: localStorage.getItem("token") },
        }).then((resp) => {
        this.queryData = resp.data;
      });
      if (this.$route.params.toastType) {
      toast[this.$route.params.toastType](this.$route.params.toastMessage, { 
        position: this.$route.params.toastPosition,
        toastClassName: this.$route.params.toastCSS
      });
    }
    },
    computed: {
      hasCompletedEntryForm() {
        const store = useLoggedInUserStore();
        return store.hasCompletedEntryForm;
      }
    },
    methods: {
      routePush(routeName) {
        this.$router.push({ name: routeName });
      },
      formattedDate(datetimeDB) {
        return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString();
      },
    },
  };
  </script>
  
  
<style>
.list-item-no-padding {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
}

.no-right-margin {
    margin-right: 0.5rem !important; /* Remove the right margin */
}

.light-green-bg {
    background-color: #e6f7e9; /* This is a very light green color. Adjust if needed */
}

.light-red-bg {
    background-color: #ffe6e6; /* This is a very light red color. Adjust if needed */
}


</style>
