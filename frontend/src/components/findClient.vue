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
      <!-- Display Found Data -->
      <table class="table-auto mx-auto text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in queryData" :key="client._id">
            <td>{{ client.firstName + " " + client.lastName }}</td>
            <td>
              {{ client.address[0]["city"] }}
            </td>
            <td>
              {{ client.phoneNumbers[0].primaryPhone }}
            </td>
            <td>
              <button @click="editClient(client._id)">
                View {{ client.firstName + " " + client.lastName }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
    editClient(clientID) {
      this.$router.push({ name: "clientdetails", params: { id: clientID } });
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
td,
th,
tr {
  padding: 0 40px;
}
</style>