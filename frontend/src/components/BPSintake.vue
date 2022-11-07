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
            <h3 class="flex-col font-bold">Type/Location of Contact:</h3>
            <select>
              <option>Select One</option>
              <optgroup label="Virtual">
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
              </optgroup>
              <optgroup label="In Person">
                <option value="Office">Office</option>
                <option value="Probation Office">Probation Office</option>
                <option value="Correctional Facility">Correctional Facility</option>
                <option value="Commmunity Agency">Community Agency</option>
              </optgroup>
            </select>
          </div>

          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="mood">
                How are you feeling today? (Describe mood and health)
              </label>
              <textarea name="mood" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>

          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="concerns">
                Do you have any concerns?
              </label>
              <textarea name="concerns" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>

          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="support">
                How would you describe your support system?
              </label>
              <textarea name="support" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>

          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="attorneyComms">
                How is your communication with your Attorney?
              </label>
              <textarea name="attorneyComms" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>

          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="adelphoiComms">
                How is your communication with your Adelphoi?
              </label>
              <textarea name="adelphoiComms" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>

          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="counselorComms">
                How is your communication with your counselor?
              </label>
              <textarea name="counselorComms" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>

          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="services">
                How has it been accessing the services that I referred you too?
              </label>
              <textarea name="services" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>
          
          <section class="flex mt-8">
            <div class="flex flex-col w-10/12">
              <label class="self-start font-bold" for="goals">
                What can I do to better help you reach you reach your goals?
              </label>
              <textarea name="goals" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
            </div>
          </section>

          <section class="flex mt-8">
            <div class="flex flex-col w-5/12">
              <label class="self-start font-bold" for="emergencyFinancial">
                Do you feel that you need emergency financial help at this time?
              </label>
              <select name="emergencyFinancial">
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="NA">N/A (Already Recieved)</option>
              </select>
            </div>
            <div class="flex flex-col w-5/12">
              <label class="self-start font-bold" for="emergencyTransportation">
                Are you having a transportation emergency?
              </label>
              <select name="emergencyTransportation">
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="NA">N/A (Already Recieved)</option>
              </select>
            </div>
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
select,
textarea {
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