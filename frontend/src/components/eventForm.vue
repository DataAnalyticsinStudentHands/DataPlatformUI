<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        Create New Event
      </h1>
    </div>
    <div>
      <form @submit.prevent="handleSubmitForm">
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
            <button type="submit">Add New Event</button>
            <button type="reset" @click="$router.go(-1)">Go back</button>
          </div>
        </section>
      </form>
    </div>
  </main>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
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
  methods: {
    async handleSubmitForm() {
      let apiURL = `http://${this.$store.state.ipAddress}:3000/eventdata`;
      axios
        .post(apiURL, this.event)
        .then(() => {
          alert("Event has been added. Returning to homescreen");
          this.$router.push("/");
          this.client = {
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
          };
        })
        .catch((error) => {
          console.log(error);
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

button[type="submit"] {
  background-color: #7d0d15;
  border-radius: 4px;
  padding: 10px 16px;
  color: white;
}

button[type="reset"] {
  border: 1px solid #7d0d15;
  border-radius: 4px;
  padding: 10px 16px;
  color: #7d0d15;
}
</style>