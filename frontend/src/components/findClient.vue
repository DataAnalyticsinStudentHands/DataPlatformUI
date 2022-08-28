<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Find Client</h1>
    </div>
    <div class="px-10 py-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Search Client By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy"
          >
            <option value="Client Name">Client Name</option>
            <option value="Client Number">Client Number</option>
          </select>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Client Name'">
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="firstName"
              v-on:keyup.enter="handleSubmitForm"
            />

            <span class="text-gray-700">Please Enter First Name</span>
          </label>
        </div>
        <div>
          <div class="flex flex-col" v-if="searchBy === 'Client Name'">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="lastName"
              v-on:keyup.enter="handleSubmitForm"
            />
            <label class="block">
              <span class="text-gray-700">Please Enter Last Name</span>
            </label>
          </div>
          <!-- Displays Client Number search field -->
          <div class="flex flex-col" v-if="searchBy === 'Client Number'">
            <input
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              type="text"
              v-model="phoneNumber"
              v-on:keyup.enter="handleSubmitForm"
            />
            <label class="block">Please Enter Client Phone Number</label>
          </div>
          <div class="flex flex-col">
            <button
              style="width: 10em"
              class="self-end bg-red-700 text-white rounded"
              @click="handleSubmitForm"
              type="submit"
            >Search Client</button>
          </div>
        </div>
      </div>
      <hr class="mt-10 mb-10" />
      <!-- Display Found Data -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">List of Clients</h2>
        <div class="flex flex-col col-span-3">
          
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Name</th>
              <th class="p-4 text-left">City</th>
              <th class="p-4 text-left">Phone number</th>
              <th></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="editClient(client._id)" v-for="client in queryData" :key="client._id">
              <td class="p-2 text-left">{{ client.firstName + " " + client.lastName }}</td>
              <td class="p-2 text-left">{{ client.address[0]["city"] }}</td>
              <td class="p-2 text-left">{{ client.phoneNumbers[0].primaryPhone }}</td>
              <td class="p-2 text-left">
                <button class="bg-red-700 text-white rounded">Details/Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
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
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/`;
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
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/primarydata/users/?firstName=${this.firstName}&lastName=${this.lastName}&searchBy=name`;
      } else if (this.searchBy === "Client Number") {
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/primarydata/users/?phoneNumbers.primaryPhone=${this.phoneNumber}&searchBy=number`;
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
button {
  padding: 10px 10px;
}
</style>