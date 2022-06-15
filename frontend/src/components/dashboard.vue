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
            <button @click="routeFindClient" type="submit">Find A Client</button>
          </section>
          <section>
            <button @click="routeIntakeForm" type="submit">Client Intake Form</button>
          </section>
          <section>
            <button @click="routeUserCreation" type="submit">Register A User</button>
          </section>
          <section>
            <button @click="routeUserLogin" type="submit">Login</button>
          </section>
          
        </section>
      </form>
    </div>
  </main>
</template>
<script>
export default {
  props: ["id"],
// Store Client ID in a prop
  methods: {
    routeFindClient() {
      this.$router.push({ name: "findClient"});
    },
    routeIntakeForm() {
      this.$router.push({ name: "intakeForm"});
    },
    routeUserCreation() {
      this.$router.push({ name: "userCreation"});
    },
    routeUserLogin() {
      this.$router.push({ name: "userLogin"});
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