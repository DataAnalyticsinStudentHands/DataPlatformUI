<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        Event Details
      </h1>
    </div>
    <div>
      <form @submit.prevent="handleEventUpdate">
        <section>
          <div>
            <label> Event Name </label>
            <input v-model="event.eventName" type="text" />
          </div>
          <div>
            <label> Associated Organization </label>
            <select v-model="event.associatedOrgID">
              <option value="9b88d0c0-b169-11ec-97ce-b161ea009544">
                Bread of Life
              </option>
              <option value="7d479b50-b169-11ec-97ce-b161ea009544">
                Community Family Center
              </option>
            </select>
          </div>
          <div
            v-if="
              event.associatedOrgID === '9b88d0c0-b169-11ec-97ce-b161ea009544'
            "
          >
            <h3>Services</h3>
            <label for="MCFSD">
              Monthly Community Food and Supplies Distribution
            </label>
            <input
              v-model="event.services"
              id="MCFSD"
              name="MCFSD"
              value="MCFSD"
              type="checkbox"
            />
          </div>
          <div
            v-if="
              event.associatedOrgID === '7d479b50-b169-11ec-97ce-b161ea009544'
            "
          >
            <h3>Services</h3>
            <label for="FSS"> Family Support Services</label>
            <input
              v-model="event.services"
              id="FSS"
              name="FSS"
              value="Family Support Services"
              type="checkbox"
            />
            <br />
            <label for="AE">Adult Education</label>
            <input
              v-model="event.services"
              id="AE"
              name="AE"
              value="Adult Education"
              type="checkbox"
            />
            <br />
            <label for="YSP">Youth Services Program</label>
            <input
              v-model="event.services"
              id="YSP"
              name="YSP"
              value="Youth Services Program"
              type="checkbox"
            />
            <br />
            <label for="ECE">Early Childhood Education</label>
            <input
              v-model="event.services"
              id="ECE"
              name="ECE"
              value="Early Childhood Education"
              type="checkbox"
            />
          </div>
          <div>
            <label>Date</label>
            <input v-model="event.date" type="date" />
          </div>
          <div>
            <h3>Address</h3>
            <section>
              <div>
                <label>Address 1</label>
                <input v-model="event.address[0].line1" type="text" />
              </div>
              <div>
                <label>Address 2</label>
                <input v-model="event.address[0].line2" type="text" />
              </div>
              <div>
                <label>City</label>
                <input v-model="event.address[0].city" type="text" />
              </div>

              <div>
                <label>County</label>
                <input v-model="event.address[0].county" type="text" />
              </div>
              <div>
                <label>Zip Code</label>
                <input v-model="event.address[0].zipcode" type="text" />
              </div>
            </section>
          </div>
          <div>
            <label> Description</label>
            <input v-model="event.description" type="text" />
          </div>
          <div class="flex justify-between mt-10 mr-20">
            <button type="submit" class="bg-brick text-white rounded">Update Event</button>
            <button type="reset" class="bg-white text-brick border-brick border rounded" @click="$router.go(-1)">Go back</button>
          </div>
        </section>
      </form>
      <section>
        <div>
          <h2>List of Attendes</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              <tr
                @click="editClient(client._id)"
                v-for="client in attendeeData"
                :key="client._id"
              >
                <td>
                  {{ client.attendeeFirstName + " " + client.attendeeLastName }}
                </td>

                <td>{{ client.attendeeCity }}</td>
                <td>{{ client.attendeePhoneNumber }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
</template>
<script>
import axios from "axios";
export default {
  props: ["id"],
  data() {
    return {
      attendeeIDs: [],
      attendeeData: [],
      event: {
        eventName: "",
        associatedOrgID: "",
        services: [],
        date: "",
        address: [
          {
            line1: "",
            line2: "",
            city: "",
            county: "",
            zipcode: "",
          },
        ],
        description: "",
      },
    };
  },
  beforeMount() {
    axios
      .get(
        `http://${this.$store.state.ipAddress}:3000/eventdata/eventdetails/`,
        { params: { id: this.id } }
      )
      .then((resp) => {
        let data = resp.data[0];
        let formattedDate = new Date(data.date);
        let month = formattedDate.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        let day = formattedDate.getDate() + 1;
        let year = formattedDate.getFullYear();
        this.event.date = year + "-" + month + "-" + day;
        this.event.eventName = data.eventName;
        this.event.associatedOrgID = data.associatedOrgID;
        this.event.services[0] = data.services[0];
        this.event.address = data.address;
        this.event.description = data.description;
        this.attendeeIDs = data.attendees;
        for (let i = 0; i < this.attendeeIDs.length; i++) {
          axios
            .get(
              `http://${this.$store.state.ipAddress}:3000/primarydata/clientdetails/`,
              {
                params: { id: this.attendeeIDs[i] },
              }
            )
            .then((resp) => {
              let data = resp.data[0];

              this.attendeeData.push({
                attendeeFirstName: data.firstName,
                attendeeLastName: data.lastName,
                attendeeCity: data.address[0].city,
                attendeePhoneNumber: data.phoneNumbers[0].primaryPhone,
              });
            });
        }
      });
  },
  methods: {
    handleEventUpdate() {
      let apiURL = `http://${this.$store.state.ipAddress}:3000/eventdata/${this.id}`;
      axios.put(apiURL, this.event).then(() => {
        alert("Update has been saved.");
        this.$router.back().catch((error) => {
          console.log(error);
        });
      });
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

button{
  padding: 10px 16px;
}

</style>