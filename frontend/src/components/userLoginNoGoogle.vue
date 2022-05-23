<template>
  <main>
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
  // Store Client ID in a prop
  methods: {
    handleLogin() {
      let apiURL = `http://localhost:3000/userData/login`;
      axios.get(apiURL, {
        params: {username: this.userData.username, password: this.userData.password},
      }).then((resp) => {
        let data = resp.data[0];
        alert(data)
        if(!data) {
          alert("Incorrect Login!");
        } else {
          alert("Successfully Logged in.");
          window.localStorage.setItem('username', data._id)

        }
      });
    },
    moveToCommon(idd) {
      console.log(idd);
      this.$router.push({ name: "commonDataForm", params: { id: idd } });
    },
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