<!-- TODO: make font sizes appropriate -->
<!-- TODO: fix formatting for long answer responses -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        Bio-Psycho-Social Follow-up
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form>
        <section>
          <div class="flex gap-x-2">
          <h3 class="inline font-bold">Type/Location of Contact:</h3>
          <select>
            <option value="Phone">Phone</option>
            <option value="In Person - Office">In Person - Office</option>
            <option value="In Person - Probation Office">In Person - Probation Office</option>
            <option value="In Person - Correctional Facility">In Person - Correctional Facility</option>
            <option value="In Person - Email">In Person - Email</option>
            <option value="In Person - Commmunity Agency">In Person - Community Agency</option>
          </select>
        </div>
          <section class="flex mt-10">

            <div class="flex flex-col">
              <label class="self-start font-bold" for="mood">
                How are you feeling today? (Describe mood and health)
              </label>
              <input name="mood" type="text"/>
            </div>

            <div class="flex flex-col">
              <label class="self-start font-bold" for="concerns">
                Do you have any concerns?
              </label>
              <input name="concerns" type="text"/>
            </div>
            </section>

            <section class="flex mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="support"
                >How would you describe your support system? </label
              >
              <input
                name="support"
                type="text"
              />
            </div>
          </section>
          
          <section>
            <section class="flex">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="attorneyComms">
                  How is your communication with your Attorney?
                </label>
                <input name="attorneyComms"/>
              </div>

              <div class="flex flex-col">
                <label class="self-start font-bold" for="adelphoiComms">
                  How is your communication with your Adelphoi?
                </label>
                <input name="adelphoiComms"/>
              </div>

              <div class="flex flex-col">
                <label class="self-start font-bold" for="counselorComms">
                  How is your communication with your counselor?
                </label>
                <input name="counselorComms"/>
              </div>
            </section>

            <section class="flex">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="services">
                  How has it been accessing the services that I referred you too?
                </label>
                <input name="services"/>
              </div>

              <div class="flex flex-col">
                <label class="self-start font-bold" for="goals">
                  What can I do to better help you reach you reach your goals?
                </label>
                <input name="goals"/>
              </div>
            </section>
          </section>
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