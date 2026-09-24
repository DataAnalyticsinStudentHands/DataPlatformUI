<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl text-brand-fg tracking-widest text-center mt-10"
      >
        Find Client
      </h1>
    </div>
    <div class="px-10 pt-20 native-fields">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
      >
        <h2 class="text-2xl font-bold">Search Client By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
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
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
              v-model="firstName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter first name"
            />
          </label>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Client Name'">
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
              v-model="lastName"
              v-on:keyup.enter="handleSubmitForm"
              placeholder="Enter last name"
            />
          </label>
        </div>
        <!-- Displays Client Number search field -->
        <div class="flex flex-col" v-if="searchBy === 'Client Number'">
          <input
            class="w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
            type="text"
            v-model="phoneNumber"
            v-on:keyup.enter="handleSubmitForm"
            placeholder="Enter Client Phone Number"
          />
        </div>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
      >
        <div></div>
        <div></div>
        <div class="mt-5 grid-cols-2">
          <button
            class="mr-10 border bg-surface rounded"
            @click="clearSearch"
            type="submit"
          >
            Clear Search
          </button>
          <button
            class="bg-primary text-white rounded"
            @click="handleSubmitForm"
            type="submit"
          >
            Search Client
          </button>
        </div>
      </div>
    </div>

    <hr class="mt-10 mb-10" />
    <!-- Display Found Data -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10"
    >
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Clients</h2>
        <h3 class="italic">Click table row to edit/display an entry</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Name</th>
              <th class="p-4 text-left">Phone number</th>
              <th class="p-4 text-left">City</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr
              @click="editClient(client._id)"
              v-for="client in queryData"
              :key="client._id"
            >
              <td class="p-2 text-left">
                {{ client.firstName + " " + client.lastName }}
              </td>
              <td class="p-2 text-left">
                {{ client.phoneNumbers[0] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
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
    axios
      .get(apiURL)
      .then(
        (resp) => {
          this.queryData = resp.data;
        },
        (err) => {
          if (err) {
            this.$router.push("/login");
          }
        }
      );
    window.scrollTo(0, 0);
  },
  methods: {
    handleSubmitForm() {
      let apiURL = "";
      if (this.searchBy === "Client Name") {
        apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/search/?firstName=${this.firstName}&lastName=${this.lastName}&searchBy=name`;
      } else if (this.searchBy === "Client Number") {
        apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/search/?phoneNumbers.primaryPhone=${this.phoneNumber}&searchBy=number`;
      }
      axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
      });
    },
    clearSearch() {
      //Resets all the variables
      this.searchBy = "";
      this.firstName = "";
      this.lastName = "";
      this.phoneNumber = "";

      //get all entries
      let apiURL = import.meta.env.VITE_ROOT_API + `/primarydata/`;
      axios.get(apiURL).then((resp) => {
        this.queryData = resp.data;
      });
    },
    editClient(clientID) {
      this.$router.push({ name: "updateclient", params: { id: clientID } });
    },
  },
};
</script>

<style scoped>
/* Native select and text fields. They draw no border in either theme (Vuetify's reset sets
   border-style: none) and index.css forces their fill transparent, so in dark nothing showed where a
   field was. native-field-fill is #FFFFFF in light (the white page behind them, so light is unchanged)
   and #262626 in dark. The wrapper class plus the scoped attribute outranks index.css's transparent
   rules, including their :focus versions. Same treatment as the other Basic pages. */
.native-fields select,
.native-fields [type="text"] {
  background-color: rgb(var(--v-theme-native-field-fill)) !important;
}
</style>
