  <!-- TODO: make font sizes appropriate -->
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        Client Intake Form
      </h1>
    </div>
    <div class="m-5">
      <form>
        <section>
          <section>
            <p class="text-left font-bold">Personal Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="firstName"
                >First Name</label
              >
              <input name="firstName" type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="middleName"
                >Middle Name</label
              >
              <input name="middleName" type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="lastName"
                >Last Name</label
              >
              <input name="lastName" type="text" />
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="email">Email</label>
                <input name="email" type="text" />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="phoneNumber"
                  >Phone Number</label
                >
                <input name="phoneNumber" type="text" />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for=""
                  >Alternative Phone Number</label
                >
                <input type="text" />
              </div>
            </section>
          </section>
        </section>

        <section>
          <section>
            <p class="text-left font-bold mt-10">Address Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Address 1</label>
              <input type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Address 2</label>
              <input type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">City</label>
              <input type="text" />
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">County</label>
                <input type="text" />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">Zip Code</label>
                <input type="text" />
              </div>
            </section>
          </section>
        </section>
        <div class="flex justify-between mt-10 mr-20">
          <button @click="handleSubmitForm" type="submit">Add Client</button>
          <button @click.prevent type="reset">Clear Form</button>
        </div>
      </form>
    </div>
  </main>
</template>
<script>
// import axios from "axios";
export default {
  data() {
    return {};
  },
  methods: {
    handleSubmitForm() {
      this.$router.push("/");
    },
  },
};
</script>
<style>
input,
select {
  border: 1px solid #cfd4d9;
  /* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
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