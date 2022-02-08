  <!-- TODO: make font sizes appropriate -->
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest"
        style="color: #7d0d15"
      >
        Client Intake Form
      </h1>
    </div>
    <div class="m-5">
      <form action="">
        <section>
          <section>
            <p class="text-left font-bold">Personal Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">First Name</label>
              <input type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Middle Name</label>
              <input type="text" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="">Last Name</label>
              <input type="text" />
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">Email</label>
                <input type="text" />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="">Phone Number</label>
                <input type="text" />
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
        <div class="flex justify-between mt-10">
          <button @click.prevent type="submit">Add Client</button>
          <button @click.prevent type="reset">Clear Form</button>
        </div>
      </form>
    </div>
  </main>
</template>
<style>
input {
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