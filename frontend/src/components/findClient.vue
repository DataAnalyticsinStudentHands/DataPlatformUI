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
            <th id="cityName">City</th>
            <th>Phone number</th>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="editClient(client._id)"
            v-for="client in queryData"
            :key="client._id"
          >
            <td class="text-left">
              {{ client.firstName + " " + client.lastName }}
            </td>
            <td id="cityList">
              {{ client.address[0]["city"] }}
            </td>
            <td>
              {{ client.phoneNumbers[0].primaryPhone }}
            </td>
            <td class="text-left" id="viewClient">
              <button class="btn">
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
  mounted() {
    let apiURL = `http://${this.$store.state.ipAddress}:3000/primarydata/`;
    console.log(apiURL);
    //Resets the list of queried data
    this.queryData = [];
    axios.get(apiURL).then((resp) => {
      let data = resp.data;
      for (let i = 0; i < data.length; i++) {
        this.queryData.push(data[i]);
      }
    });
    window.scrollTo(0, 0);
  },
  methods: {
    handleSubmitForm() {
      let apiURL = "";
      //Checks which filters are needed for URL structure
      if (this.searchBy === "Client Name") {
        apiURL = `http://${this.$store.state.ipAddress}:3000/primarydata/users/?firstName=${this.firstName}&lastName=${this.lastName}&searchBy=name`;
      } else if (this.searchBy === "Client Number") {
        apiURL = `http://${this.$store.state.ipAddress}:3000/primarydata/users/?phoneNumbers.primaryPhone=${this.phoneNumber}&searchBy=number`;
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
  border-radius: 2px;
}
button[type="submit"] {
  background-color: #7d0d15;
  border-radius: 4px;
  padding: 5px 10px;
  color: white;
}
.btn {
  border-radius: 4px;
  background-color: #7d0d15;
  color: white;
  padding: 5px 5px;
  font-size: 0.8em;
  min-width: 200px;
  max-width: 200px;
  border: 1px solid #7d0d15;
}
.btn:hover {
  background-color: white;
  color: #7d0d15;
  border: 1px solid #7d0d15;
}
td,
th,
tr {
  padding: 0 40px;
}
tr > td {
  padding-bottom: 0.5em;
}
@media only screen and (max-width: 900px) {
  #viewClient,
  #cityList,
  #cityName {
    display: none;
  }
}
</style>