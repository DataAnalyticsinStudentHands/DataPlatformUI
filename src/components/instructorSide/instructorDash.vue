<!-- /instructorDash page for instructor's dashboard -->
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10"
      >
        Welcome {{ firstName }} {{ lastName }} {{ this.role }}  {{  res}}
      </h1>
      <br>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
      </div>
      <!-- removing b/c WIP <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Experience Name</th>
              <th class="p-4 text-left">Number of Students</th>
              <th class="p-4 text-left">Number of Non-Honor Students</th>
              <th class="p-4 text-left">Number of Students Who Submitted Their Goals</th>
              <th class="p-4 text-left">Number of Students Who Submitted Their Exit Survey</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr v-for="event in queryData" :key="event._id">
              <td class="p-2 text-left">{{ event.eventName }}</td>
              <td class="p-2 text-left">{{ formattedDate(event.date) }}</td>
              <td class="p-2 text-left">{{ event.attendees }}</td>
            </tr>
          </tbody>
        </table>
      </div> -->
    </div>
    </div>
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
