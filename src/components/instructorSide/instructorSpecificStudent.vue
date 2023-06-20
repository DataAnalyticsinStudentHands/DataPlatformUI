<template>
    <br><p class="font-weight-black text-h5" style="text-align: center;">Student's Information</p>
    <v-form disabled>
        <v-container>
            <v-row>
                <v-text-field v-model="userData.firstName" label="First Name"></v-text-field>
                <v-text-field v-model="userData.lastName" label="Last Name"></v-text-field>
            </v-row>
            <v-row>
                <v-text-field v-model="userData.phoneNumber" label="Phone Number"></v-text-field>
                <v-text-field v-model="userData.email" label="Email"></v-text-field>
            </v-row>
        </v-container>
    </v-form>
{{ this.studentData }}
</template>

<script>
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
  data() {
    return {
        userData: [],
        studentData: []
    };
  },
  beforeMount() {
    const user = useLoggedInUserStore();
    let token = user.token;
    let url = import.meta.env.VITE_ROOT_API + `/studentSideData/studentInformation`;
    axios.get(url + `/${this.$route.params.userID}`, { headers: { token },})
      .then((resp) => {
        this.userData = resp.data.userData;
        this.studentData = resp.data.studentData;
      });
  },
  methods: {

  }
}
</script>