<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        {{ client.firstName }}'s Details
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <section>
          <section>
            <p class="text-left font-bold">Personal Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="firstName"
                >First Name</label
              >
              <input v-model="client.firstName" name="firstName" type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="middleName"
                >Middle Name</label
              >
              <input
                v-model="client.middleName"
                name="middleName"
                type="text"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="lastName"
                >Last Name</label
              >
              <input v-model="client.lastName" name="lastName" type="text" />
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="email">Email</label>
                <input v-model="client.email" name="email" type="text" />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="phoneNumber"
                  >Phone Number</label
                >
                <input
                  v-model="client.phoneNumbers[0].primaryPhone"
                  name="phoneNumber"
                  type="text"
                />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for=""
                  >Alternative Phone Number</label
                >
                <input
                  v-model="client.phoneNumbers[0].secondaryPhone"
                  name="secPhone"
                  type="text"
                />
              </div>
            </section>
          </section>
        </section>
        <section>
          <section>
            <p class="text-left font-bold mt-10">Address Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Address 1</label>
              <input v-model="client.address[0].line1" type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Address 2</label>
              <input v-model="client.address[0].line2" type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">City</label>
              <input v-model="client.address[0].city" type="text" />
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">County</label>
                <input v-model="client.address[0].county" type="text" />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">Zip Code</label>
                <input v-model="client.address[0].zipcode" type="text" />
              </div>
            </section>
          </section>
        </section>
        <div class="flex justify-between mt-10 mr-20">
          <button @click="handleClientUpdate" type="submit">
            Update Client
          </button>
        </div>
        <div class="flex justify-between mt-10 mr-20">
          <button @click="moveToCommon(this.id)" type="submit">
            Edit Common Information
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
      client: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumbers: [
          {
            primaryPhone: "",
            secondaryPhone: "",
          },
        ],
        address: [
          {
            type: "currentAddress",
            line1: "",
            line2: "",
            city: "",
            county: "",
            zipcode: "",
          },
        ],
      },
    };
  },
  // Store Client ID in a prop
  beforeMount() {
    //Loads resp data into Vue Data properties
    axios
      .get("http://localhost:3000/primarydata/clientdetails/", {
        params: { id: this.id },
      })
      .then((resp) => {
        let data = resp.data[0];
        this.client.firstName = data.firstName;
        this.client.middleName = data.middleName;
        this.client.lastName = data.lastName;
        this.client.email = data.email;
        this.client.phoneNumbers[0].primaryPhone =
          data.phoneNumbers[0].primaryPhone;
        this.client.phoneNumbers[0].secondaryPhone =
          data.phoneNumbers[0].secondaryPhone;
        this.client.address[0].line1 = data.address[0].line1;
        this.client.address[0].line2 = data.address[0].line2;
        this.client.address[0].city = data.address[0].city;
        this.client.address[0].county = data.address[0].county;
        this.client.address[0].zipcode = data.address[0].zipcode;
      });
  },
  methods: {
    handleClientUpdate() {
      let apiURL = `http://localhost:3000/primarydata/users/${this.id}`;
      axios.put(apiURL, this.client).then(() => {
        alert("Update has been saved.");
        this.$router.back().catch((error) => {
          console.log(error);
        });
      });
    },
    moveToCommon(idd) {
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