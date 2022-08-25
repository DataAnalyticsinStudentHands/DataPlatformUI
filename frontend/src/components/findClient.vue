<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        Find Client
      </h1>
    </div>
    <div class="m-5">
      <div class="flex flex-col">
        <!-- Displays Client Name search field -->
        <div
          class="flex gap-x-2"
          :style="[!$store.state.isResponsive ? 'width:42%' : 'width: 100%']"
          :class="{ 'flex-col': $store.state.isResponsive }"
        >
          <h3 class="inline font-bold">Search Client By:</h3>
          <select
            v-model="searchBy"
            :class="{ 'w-2/5': $store.state.isResponsive }"
          >
            <option value="Client Name">Client Name</option>
            <option value="Client Number">Client Number</option>
          </select>
        </div>
        <div
          :class="{ 'flex flex-col': $store.state.isResponsive }"
          :style="[!$store.state.isResponsive ? 'width:42%' : 'width:100%']"
          v-if="searchBy === 'Client Name'"
          class="flex justify-between gap-5 mt-5"
        >
          <section class="flex flex-col">
            <label> Please Enter <b>First</b> Name</label>
            <input
              :class="{ 'w-2/5': $store.state.isResponsive }"
              type="text"
              v-model="firstName"
              v-on:keyup.enter="handleSubmitForm"
            />
          </section>
          <section class="flex flex-col">
            <label>Please Enter <b>Last</b> Name</label>
            <input
              :class="{ 'w-2/5': $store.state.isResponsive }"
              type="text"
              v-model="lastName"
              v-on:keyup.enter="handleSubmitForm"
            />
          </section>
          <div :class="{ 'self-end': !$store.state.isResponsive }">
            <button
              style="width: 10em"
              class="self-end bg-brick text-white rounded"
              @click="handleSubmitForm"
              type="submit"
            >
              Search Client
            </button>
          </div>
        </div>
        <!-- Displays Client Number search field -->
        <div
          :class="{ 'flex flex-col': $store.state.isResponsive }"
          v-if="searchBy === 'Client Number'"
          class="flex justify-between gap-5 mt-5"
          :style="[!$store.state.isResponsive ? 'width:42%' : 'width:100%']"
        >
          <section class="flex flex-col">
            <label> Please Enter Client Phone Number</label>
            <input
              :class="{ 'w-2/5': $store.state.isResponsive }"
              type="text"
              v-model="phoneNumber"
              v-on:keyup.enter="handleSubmitForm"
            />
          </section>
          <div :class="{ 'self-end': !$store.state.isResponsive }">
            <button
              style="width: 10em"
              :class="{ 'self-end': !$store.state.isResponsive }"
              @click="handleSubmitForm"
              type="submit"
            >
              Search Client
            </button>
          </div>
        </div>
      </div>
      <hr class="mt-10 border-solid border-1" style="border-color: #960C22" />
      <!-- Display Found Data -->
      <table class="table-auto mx-auto text-center">
        <thead>
          <tr
            :style="[
              $store.state.isResponsive ? 'padding: 0' : 'padding: 0 40px',
            ]"
          >
            <th
              class="text-left"
              :style="[
                $store.state.isResponsive ? 'padding: 0' : 'padding: 0 40px',
              ]"
            >
              Name
            </th>
            <th
              :style="[
                $store.state.isResponsive ? 'padding: 0' : 'padding: 0 40px',
              ]"
              id="cityName"
            >
              City
            </th>
            <th
              :style="[
                $store.state.isResponsive ? 'padding: 0' : 'padding: 0 40px',
              ]"
            >
              Phone number
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="editClient(client._id)"
            v-for="client in queryData"
            :key="client._id"
          >
            <td
              :style="[
                $store.state.isResponsive
                  ? 'padding: 0 1em 1em 0'
                  : 'padding: 0 40px',
              ]"
              class="text-left whitespace-nowrap"
              style
            >
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
    let apiURL = process.env.VUE_APP_ROOT_API + `/primarydata/`;
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
        apiURL = process.env.VUE_APP_ROOT_API + `/primarydata/users/?firstName=${this.firstName}&lastName=${this.lastName}&searchBy=name`;
        console.log(apiURL)
      } else if (this.searchBy === "Client Number") {
        apiURL = process.env.VUE_APP_ROOT_API + `/primarydata/users/?phoneNumbers.primaryPhone=${this.phoneNumber}&searchBy=number`;
        console.log(apiURL)
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
      this.$router.push({ name: "updateclient", params: { id: clientID } });
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
button {
  padding: 5px 10px;
}
.btn {
  border-radius: 4px;
  background-color: #960C22;
  color: white;
  padding: 5px 5px;
  font-size: 0.8em;
  min-width: 200px;
  max-width: 200px;
  border: 1px solid #960C22;
}
.btn:hover {
  background-color: white;
  color: #960C22;
  border: 1px solid #960C22;
}

@media only screen and (max-width: 900px) {
  #viewClient,
  #cityList,
  #cityName {
    display: none;
  }
}
</style>