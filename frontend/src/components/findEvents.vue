<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">List of Events</h1>
    </div>
    <div class="px-10 py-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        <h2 class="text-2xl font-bold">Search Event By</h2>
        <!-- Displays Client Name search field -->
        <div class="flex flex-col">
          <select
            class="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            v-model="searchBy"
          >
            <option value="Event Name">Event Name</option>
            <option value="Event Date">Event Date</option>
          </select>
        </div>
        <div class="flex flex-col" v-if="searchBy === 'Event Name'">
          <label class="block">
            <input
              type="text"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              v-model="eventName"
              v-on:keyup.enter="handleSubmitForm"
            />

            <span class="text-gray-700">Please Event Name</span>
          </label>
        </div>
      </div>
      <hr class="mt-10 mb-10" />
      <!-- Display Found Data -->
      <table class="min-w-full shadow-md rounded">
        <thead class="bg-gray-50 text-xl">
          <tr>
            <th class="p-4 text-left">Event Name</th>
            <th class="p-4 text-left">Event Date</th>
            <th class="p-4 text-left">Event Address</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          <tr @click="editEvent(event._id)" v-for="event in queryData" :key="event._id">
            <td class="p-2 text-left">{{ event.eventName }}</td>
            <td class="p-2 text-left">{{ event.date }}</td>
            <td class="p-2 text-left">{{ event.address.line1 }}</td>
            <td class="p-2 text-left">
              <button class="bg-red-700 text-white rounded">Details/Edit</button>
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
      queryData: [],
      //Parameter for search to occur
      searchBy: "",
      eventName: "",
      eventDate: "",
    };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
    this.queryData = [];
    axios.get(apiURL).then((resp) => {
      let data = resp.data;
      for (let i = 0; i < data.length; i++) {
        this.queryData.push(data[i]);
      }
      for (let i = 0; i < data.length; i++) {
        let formattedDate = new Date(this.queryData[i].date);
        let month = formattedDate.getMonth() + 1;
        let day = formattedDate.getDate() + 1;
        let year = formattedDate.getFullYear();
        this.queryData[i].date = month + "/" + day + "/" + year;
      }
    });
    window.scrollTo(0, 0);
  },
  methods: {
    handleSubmitForm() {
      let apiURL = "";
      //Checks which filters are needed for URL structure
      if (this.searchBy === "Event Name") {
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/events/?firstName=${this.firstName}&lastName=${this.lastName}&searchBy=name`;
      } else if (this.searchBy === "Event Date") {
        apiURL =
          import.meta.env.VITE_ROOT_API +
          `/events/?phoneNumbers.primaryPhone=${this.phoneNumber}&searchBy=number`;
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
    editEvent(eventID) {
      this.$router.push({ name: "eventdetails", params: { id: eventID } });
    },
  },
};
</script>