<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        Create New Event
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <section>
          <section>
            <p class="text-left font-bold">Event Details</p>
          </section>
          
          <div class="grid grid-cols-1 gap-4">
            <label class="self-start" for="eventName">
              Event Name</label>
            <input v-model="event.eventName" type="text" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <label class="self-start" for="eventName">
              Services Offered:</label>
            <input v-model="event.eventName" type="text" />
          </div>
          
            <label> </label> {{ ccheckedServices }}
            <input type="checkbox" id="familyservices" value="Family Support" v-model="checkedServices">
            <label for="familyservices">Family Support</label>
            <input type="checkbox" id="adulteducation" value="Adult Education" v-model="checkedServices">
            <label for="adulteducation">Adult Education</label>
            <input type="checkbox" id="youthservicesprogram" value="Youth Services Program" v-model="checkedServices">
            <label for="youthservicesprogram">Youth Services Program</label>
            <input type="checkbox" id="earlychildhoodeducation" value="Early Childhood Education" v-model="checkedServices">
            <label for="earlychildhoodeducation">Early Childhood Education</label>
         

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
            <button class="bg-brick text-white rounded" type="submit">Add New Event</button>
            
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
      checkedServices: [],
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
      let apiURL = process.env.VUE_APP_ROOT_API + `/eventdata`;
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

button {
  padding: 10px 16px;
}
</style>