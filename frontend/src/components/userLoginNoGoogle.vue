<template>
  <main>
    <meta name="google-signin-client_id" content="803398262296-kd6rp2d50ttv3m68708fnk4jbkaopp4j.apps.googleusercontent.com">
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        Login
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <section>
          <section>
            <p class="text-left font-bold">Log In</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="username"
                >Username</label
              >
              <input 
                v-model="userData.username" 
                name="username" 
                type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="password"
                >Password</label
              >
              <input
                v-model="userData.password"
                name="password"
                type="password"/>
            </div>
          </section>
          <div class="g-signin2" data-onsuccess="onSignIn"></div>
        </section>
        <div class="flex justify-between mt-10 mr-20">
          <button @click="handleLogin" type="submit">
            Log In
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
<script>

import axios from "axios";
export default {
  props: ["id"],
  data() {
    return {
      // Client Data
      userData: {
        username: "",
        password: "",
      },
    };
  },
  mounted() {
      let loginScript = document.createElement('script')
      loginScript.setAttribute('src', 'https://apis.google.com/js/platform.js')
      document.head.appendChild(loginScript)
    },
  // Store Client ID in a prop
  methods: {
    handleLogin() {
      let apiURL = `http://localhost:3000/userData/login`;
      axios.get(apiURL, {
        params: {username: this.userData.username, password: this.userData.password},
      }).then((resp) => {
        let data = resp.data[0];
        if(!data) {
          alert("Incorrect Login!");
        } else {
          alert("Successfully Logged in.");
          window.localStorage.setItem('username', data._id);
          this.$router.push({ name: "dashboard"});
        }
      });
    },
    moveToCommon(idd) {
      console.log(idd);
      this.$router.push({ name: "commonDataForm", params: { id: idd } });
    },
    onSignIn(googleUser) {
      var profile =- googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      var id_token = googleUser.getAuthResponse().id_token;
      axios.post(`http://localhost:3000/userData/loginGoogle`, {
        params: {id: id_token}
      })
    }
  },
};
</script>
<style>
input,
select {
  border: 1px solid #cfd4d9;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 4px;
  color: linear-gradient(#e66465, #9198e5);
}
button[type="submit"] {
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  background-color: #7d0d15;
  border-radius: 4px;
  padding: 10px 16px;
  color: white;
}
button[type="reset"] {
  border: 1px solid #7d0d15;
  border-radius: 4px;
  padding: 10px 16px;
  color: linear-gradient(#e66465, #9198e5);
}
</style>