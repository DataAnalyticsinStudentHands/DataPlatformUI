<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        List of Events
      </h1>
    </div>
    <router-link to="/eventform"><button class="bg-white text-brick border-brick border rounded">Add New Event</button></router-link>
    <hr class="mt-10 border-solid border border-brick" />
    <div>
      <table class="table-auto mx-auto text-center">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Event Date</th>
            <th>Event Address</th>
          </tr>
        </thead>
        <tbody>
          <tr
            @click="editEvent(event._id)"
            v-for="event in queryData"
            :key="event._id"
          >
            <td>{{ event.eventName }}</td>
            <td>{{ event.date }}</td>
            <td>{{ event.address[0].line1 }}</td>
            <td>
              <button>View {{ event.eventName }}</button>
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
    };
  },
  mounted() {
    let apiURL = process.env.VUE_APP_ROOT_API + `/eventdata/`;
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
    editEvent(eventID) {
      this.$router.push({ name: "eventdetails", params: { id: eventID } });
    },
  },
};
</script>
<style>
input,
select {
  border: 1px solid #cfd4d9;
  border-radius: 4px;
}

button {
  padding: 10px 16px;
}
</style>