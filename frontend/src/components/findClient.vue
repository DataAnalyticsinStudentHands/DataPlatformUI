<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        Find Client
      </h1>
    </div>
    <div class="m-5">
      <div class="flex flex-col">
        <!-- Displays Client Name search field -->
        <div class="flex justify-between" style="width: 42%">
          <h3 class="inline font-bold">Search Client By:</h3>
          <select v-model="searchBy">
            <option value="Client Name">Client Name</option>
            <option value="Client Number">Client Number</option>
          </select>
        </div>
        <div
          v-if="searchBy === 'Client Name'"
          class="flex justify-between gap-5 mt-5"
          style="width: 42%"
        >
          <section class="flex flex-col">
            <label> Please Enter <b>First</b> Name</label>
            <input
              class=""
              type="text"
              v-model="firstName"
              v-on:keyup.enter="handleSubmitForm"
            />
          </section>
          <section>
            <label>Please Enter <b>Last</b> Name</label>
            <input
              class=""
              type="text"
              v-model="lastName"
              v-on:keyup.enter="handleSubmitForm"
            />
          </section>
          <div class="self-end">
            <button
              style="width: 10em"
              class="self-end"
              @click="handleSubmitForm"
              type="submit"
            >
              Search Client
            </button>
          </div>
        </div>
        <!-- Displays Client Number search field -->
        <div
          v-if="searchBy === 'Client Number'"
          class="flex justify-between gap-5 mt-5"
          style="width: 42%"
        >
          <section class="flex flex-col">
            <label> Please Enter Client Phone Number</label>
            <input
              class=""
              type="text"
              v-model="phoneNumber"
              v-on:keyup.enter="handleSubmitForm"
            />
          </section>
          <div class="self-end">
            <button
              style="width: 10em"
              class="self-end"
              @click="handleSubmitForm"
              type="submit"
            >
              Search Client
            </button>
          </div>
        </div>
      </div>
      <hr class="mt-10 border-solid border-1" style="border-color: #7d0d15" />
      <div class="mx-10 whitespace-nowrap">
        <div class="grid gap-1 grid-cols-4 mt-10">
          <h3 class="mr-20 font-bold">
            Name
            <ul class="mt-5 font-normal">
              <li v-for="client in queryData" :key="client._id">
                {{ client.firstName + " " + client.lastName }}
              </li>
            </ul>
          </h3>
          <h3 class="font-bold">
            City
            <ul class="mt-5 font-normal">
              <li v-for="client in queryData" :key="client._id">
                {{ client.address[0]["city"] }}
              </li>
            </ul>
          </h3>
          <h3 class="font-bold">
            Phone Number
            <ul class="mt-5 font-normal">
              <li v-for="client in queryData" :key="client._id">
                {{ client.phoneNumbers[0].primaryPhone }}
              </li>
            </ul>
          </h3>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      //All the data recieved from the query
      queryData: [],
      //Parameter for search to occur
      searchBy: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };
  },
  methods: {
    handleSubmitForm() {
      let apiURL = "";
      //Checks which filters are needed for URL structure
      if (this.searchBy === "Client Name") {
        apiURL = `http://localhost:3000/primarydata/users/?firstName=${this.firstName}&lastName=${this.lastName}&searchBy=name`;
      } else if (this.searchBy === "Client Number") {
        apiURL = `http://localhost:3000/primarydata/users/?phoneNumbers.primaryPhone=${this.phoneNumber}&searchBy=number`;
      }
      //Resets the list of queried data
      this.queryData = [];
      axios.get(apiURL).then((resp) => {
        let data = resp.data;
        for (let i = 0; i < data.length; i++) {
          this.queryData.push(data[i]);
        }
      });
      //Resets all the variables
      this.searchQuery = "";
      this.firstName = "";
      this.lastName = "";
      this.phoneNumber = "";
    },
  },
};
</script>
<style>
input,
select {
  border: 1px solid #cfd4d9;
  /* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
  border-radius: 2px;
}
button[type="submit"] {
  background-color: #7d0d15;
  border-radius: 4px;
  padding: 5px 10px;
  color: white;
}
</style>