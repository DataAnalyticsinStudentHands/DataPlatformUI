<!-- TODO: make font sizes appropriate -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        Bio-Psycho-Social Follow-up
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form @submit.prevent="handleSubmitForm">
        <section>
          <div
          class="flex gap-x-2"
          :style="[!$store.state.isResponsive ? 'width:42%' : 'width: 100%']"
          :class="{ 'flex-col': $store.state.isResponsive }"
        >
          <h3 class="inline font-bold">Type/Location of Contact:</h3>
          <select
            v-model="searchBy"
            :class="{ 'w-2/5': $store.state.isResponsive }"
          >
            <option value="Phone">Phone</option>
            <option value="In Person - Office">In Person - Office</option>
            <option value="In Person - Probation Office">In Person - Probation Office</option>
            <option value="In Person - Correctional Facility">In Person - Correctional Facility</option>
            <option value="In Person - Email">In Person - Email</option>
            <option value="In Person - Commnity Agency">In Person - Community Agency</option>
          </select>
        </div>
          <section
            class="flex mt-10"
            :class="{
              responsive: $store.state.isResponsive,
              'space-x-10': !$store.state.isResponsive,
            }"
          >
            <div class="flex flex-col">
              <label class="self-start font-bold" for="mood"
                >How are you feeling today? (Describe mood and health)
              </label>
              <input
                name="mood"
                :class="{ 'w-2/5': $store.state.isResponsive }"
                type="text"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="concerns"
                > Do you have any concerns? </label
              >
              <input
                name="concerns"
                type="text"
                :class="{ 'w-2/5': $store.state.isResponsive }"
              />
            </div>
            </section>

            <section
              class="flex mt-10"
              :class="{
                responsive: $store.state.isResponsive,
                'space-x-10': !$store.state.isResponsive,
              }"
            >
            <div class="flex flex-col">
              <label class="self-start font-bold" for="support"
                >How would you describe your support system? </label
              >
              <input
                name="support"
                type="text"
                :class="{ 'w-2/5': $store.state.isResponsive }"
              />
            </div>
          </section>
          
          <section>
            <section
              class="flex"
              :class="{
                responsive: $store.state.isResponsive,
                'space-x-10 mt-5': !$store.state.isResponsive,
              }"
            >
              <div class="flex flex-col">
                <label class="self-start font-bold" for="attorneyComms">How is your communication with your Attorney?</label>
                <input
                  name="attorneyComms"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
              </div>

              <div class="flex flex-col">
                <label class="self-start font-bold" for="adelphoiComms">How is your communication with your Adelphoi?</label>
                <input
                  name="adelphoiComms"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="counselorComms">How is your communication with your counselor?</label>
                <input
                  name="counselorComms"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
              </div>
              </section>

              <section
              class="flex"
              :class="{
                responsive: $store.state.isResponsive,
                'space-x-10 mt-5': !$store.state.isResponsive,
              }"
            >
              <div class="flex flex-col">
                <label class="self-start font-bold" for="services">How has it been accessing the services that I referred you too? </label>
                <input
                  name="services"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
              </div>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="goals">What can I do to better help you reach you reach your goals? </label>
                <input
                  name="goals"
                  :class="{ 'w-2/5': $store.state.isResponsive }"
                />
              </div>
            </section>
          </section>
        </section>
        <section>
        </section>
        <div class="flex justify-between mt-10 mr-20">
          <button @click.prevent class="bg-white text-brick border-brick border rounded" type="reset">Clear Form</button>
          <button class="bg-brick text-white rounded" type="submit">Add Client</button>
          
        </div>
      </form>
    </div>
  </main>
</template>

<style>
input,
select {
  border: 1px solid #cfd4d9;
  border-radius: 4px;
}

button{
  padding: 10px 16px;
}

.responsive {
  flex-direction: column;
  margin-left: 0;
}
</style>