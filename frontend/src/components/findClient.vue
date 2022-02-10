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
      <div class="flex flex-row justify-between">
        <section class="justify-self-end">
          <h3>Search Client By:</h3>
        </section>
        <section class="flex flex-col">
          <select name="" id="">
            <option value="Client Name">Client Name</option>
            <option value="Client Name">Client Number</option>
          </select>
          <input class="mt-4" type="text" />
        </section>
        <section>
          <button @click="handleSubmitForm" type="submit">Search Client</button>
        </section>
      </div>
      <div class="text-center">
        <div class="grid gap-1 grid-cols-3 mt-10">
          <h3 class="mr-20">
            Name
            <ul>
              <li v-for="client in queryData" :key="client._id">
                {{ client.firstName }}
              </li>
            </ul>
          </h3>
          <h3>
            City
            <ul>
              <li v-for="client in queryData" :key="client._id">
                {{ client.address[0].currentAddress.city }}
              </li>
            </ul>
          </h3>
          <h3>
            Phone Number
            <ul>
              <li v-for="client in queryData" :key="client._id">
                {{ client.phoneNumbers[0].primaryPhone }}
              </li>
            </ul>
          </h3>
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
      queryData: [],
    };
  },
  methods: {
    handleSubmitForm() {
      this.queryData = [];
      let apiURL = "http://localhost:3000/primarydata";
      axios.get(apiURL).then((resp) => {
        let data = resp.data;
        for (let i = 0; i < data.length; i++) {
          this.queryData.push(data[i]);
        }
      });
    },
  },
};
</script>
<style>
</style>