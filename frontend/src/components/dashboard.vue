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
  // async created() {
  //   if(localStorage.getItem("username")) {
  //     let apiURL = `http://localhost:3000/userData/dash`;
  //     this.queryData=[];
  //     await axios.get(apiURL, {
  //       params: {
  //         _id:localStorage.getItem("username")
  //       }
  //     }).then((resp) => {
  //       let data = resp.data;
  //       for(let i=0; i<data.length; i++) {
  //         this.queryData.push(data[i]);
  //       }

  //       let buttons= [{id: 1, name: "Login", routeName:"userLogin"}]
        
  //       let genAccessLevel = this.queryData[0].genericAccessLevel;
  //       let editOverride = this.queryData[0].editOverride;
  //       let canCreateUser = this.queryData[0].canCreateUser;

  //       if(!genAccessLevel) {
  //         buttons.push(JSON.parse(`id:2, name:"Find a Client", routeName:"findClient"`))
  //       }
  //       if(genAccessLevel >= 2 || editOverride >= 2) {
  //         buttons.push(JSON.parse(`id:3, name: "Client Intake Form", routeName:"intakeForm"`))
  //       } 
  //       if(canCreateUser == 1) {
  //         buttons.push(JSON.parse(`id:4, name: "Register a User", routeName:"userCreation"`))
  //       }
  //       this.buttons = buttons;
  //     }) 
  //   }
  // },
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
        
        let genAccessLevel = data[0].genericAccessLevel;
        let editOverride = data[0].editOverride;
        let canCreateUser = data[0].canCreateUser;

        if(!genAccessLevel) {
          buttons.push({id:2, name:"Find a Client", routeName:"findClient"})
        }
        if(genAccessLevel >= 2 || editOverride >= 2) {
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
    // routeFindClient() {
    //   this.$router.push({ name: "findClient"});
    // },
    // routeIntakeForm() {
    //   this.$router.push({ name: "intakeForm"});
    // },
    // routeUserCreation() {
    //   this.$router.push({ name: "userCreation"});
    // },
    // routeUserLogin() {
    //   alert("AAAAAAAAA")
    //   this.$router.push({ name: "userLogin"});
    // },
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