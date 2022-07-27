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
        <section v-for="b in buttons" :key="b.id">
          <button @click="routePush(b.routeName)" type="submit">{{b.name}}</button>
          <!-- <section v-html="htmlContSubmit">
            <button @click="routeFindClient" type="submit">Find A Client</button>
          </section>
          <section v-html="htmlContIntake">
            <button @click="routeIntakeForm" type="submit">Client Intake Form</button>
          </section>
          <section v-html="htmlContCreate">
            <button @click="routeUserCreation" type="submit">Register A User</button>
          </section>
          <section v-html="htmlContLogin">
            <button @click="routeUserLogin" type="submit">Login</button>
          </section> -->
        </section>
      </form>
    </div>
  </main>
</template>
<script>
import axios from "axios";
export default {
  props: ["id"],
// Store Client ID in a prop
  data() {
    return {
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumbers: [
          {
            primaryPhone: "",
            secondaryPhone: "",
          },
        ],
        username: "",
        password: "",
        association: "Kentucky Fried Chicken",
        genericAccessLevel: "",
        editOverride: "",
        viewOverride: "",
        canCreateUser:""
      },
      buttons: []
    };
  },
  async created() {
    if(localStorage.getItem("username")) {
      let apiURL = `http://localhost:3000/userData/dash`;
      this.queryData=[];
      const {data} = await axios.get(apiURL, {
        params: {
          _id:localStorage.getItem("username")
        }
      })

        let buttons= [{id: 1, name: "Login", routeName:"userLogin"}]
        buttons.push({id:2, name:"Find a Client", routeName:"findClient"})
        
        let writer = data[0].perms.orgWriteAccess > 0;
        let canCreateUser = data[0].perms.canCreateUser;


        if(writer > 0) {
          buttons.push({id:3, name: "Client Intake Form", routeName:"intakeForm"})
        } 
        if(canCreateUser == 1) {
          buttons.push({id:4, name: "Register a User", routeName:"userCreation"})
        }
        this.buttons = buttons;
    }
  },
  methods: {
    routePush(routeName) {
      this.$router.push({name: routeName})
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
