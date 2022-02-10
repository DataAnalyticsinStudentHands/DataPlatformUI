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
      <div>
        <section class="flex flex-row justify-center mt-10">
          <h3 class="mr-20">Name</h3>
          <h3 class="mr-20">City</h3>
          <h3 class="mr-20">Phone Number</h3>
        </section>
        <section
          class="flex flex-row mt-10"
          style="margin-left: 23%; margin-right: 34%"
        >
          <ul>
            <li class="mr-20" v-for="client in queryData" :key="client._id">
              {{ client.firstName }}
            </li>
          </ul>
        </section>
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