<!-- TODO: make font sizes appropriate -->
<!-- TODO: fix formatting for long answer responses -->
<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl font-sans tracking-widest text-center mt-10 text-brick">
        Social Intake
      </h1>
    </div>
    <div class="m-5">
      <!-- @submit.prevent stops the submit event from reloading the page-->
      <form>
        <section>
          <section>
            <div class="flex gap-x-2">
            <h3 class="inline font-bold">Date of Interaction:</h3>
            <input type="date" name="interactionDate">
            </div>
          </section>

          <section class="flex mt-10">

            <div class="flex flex-col">
              <label class="self-start font-bold" for="interactionType">
                Type of Interaction
              </label>
              <input type="text" list="interactionTypes">
              <datalist id="interactionTypes">
                    <option value="In Office">In Office</option>
                    <option value="Correctional Facility">Correctional Facility</option>
                    <option value="In Field">In Field</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                </datalist>
            </div>
          </section>

          <section>
            <div class="flex flex-col">
                <label class="self-start font-bold" for="clientGoals">
                  Client Goals
                </label>
                  <input type="checkbox" id="goal1" name="goal1" value="">Access to stable housing
                  <input type="checkbox" id="goal2" name="goal2" value="">Access to reliable transportation
                  <input type="checkbox" id="goal3" name="goal3" value="">Clothing
                  <input type="checkbox" id="goal4" name="goal4" value="">Complete job training
                  <input type="checkbox" id="goal5" name="goal5" value="">Desired relationship with family
                  <input type="checkbox" id="goal6" name="goal6" value="">Educational attainment
                  <input type="checkbox" id="goal7" name="goal7" value="">Financial stability
                  <input type="checkbox" id="goal8" name="goal8" value="">Improve quality of life in correctional facility
                  <input type="checkbox" id="goal9" name="goal9" value="">Mental wellness
                  <input type="checkbox" id="goal10" name="goal10" value="">Occupational satisfaction
                  <input type="checkbox" id="goal11" name="goal11" value="">Overcome substance use disorder
                  <input type="checkbox" id="goal12" name="goal12" value="">Spiritual wellness
                  <input type="checkbox" id="goal13" name="goal13" value="">Other
            </div>
          </section>

          <section class="flex mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="support">
                Please describe the client's goals and their immediate needs </label>
              <input name="needs" type="text">

            </div>
          </section>

          <section class="flex">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="attorneyComms">
                  How is your communication with your Attorney?
                </label>
                    <input type="checkbox" id="ref1" name="ref1" value="">Adelphoi Program
                    <input type="checkbox" id="ref2" name="ref2" value="">Assistance with ID
                    <input type="checkbox" id="ref3" name="ref3" value="">Child Care
                    <input type="checkbox" id="ref4" name="ref4" value="">Clothing
                    <input type="checkbox" id="ref5" name="ref5" value="">CPS Involvement
                    <input type="checkbox" id="ref6" name="ref6" value="">Employment
                    <input type="checkbox" id="ref7" name="ref7" value="">Family Support
                    <input type="checkbox" id="ref8" name="ref8" value="">Food Benefit
                    <input type="checkbox" id="ref9" name="ref9" value="">Health Care Benefits
                    <input type="checkbox" id="ref10" name="ref10" value="">Housing
                    <input type="checkbox" id="ref11" name="ref11" value="">Mental Health Counseling
                    <input type="checkbox" id="ref12" name="ref12" value="">Nutrition
                    <input type="checkbox" id="ref13" name="ref13" value="">Social Security Card
                    <input type="checkbox" id="ref14" name="ref14" value="">SSI/SSDI
                    <input type="checkbox" id="ref15" name="ref15" value="">Substance Use Counseling/Group
                    <input type="checkbox" id="ref16" name="ref16" value="">Transportation
                    <input type="checkbox" id="ref17" name="ref17" value="">WIC
                    <input type="checkbox" id="ref18" name="ref18" value="">Social Security Card
              </div>
          </section>

          <section>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="adelphoiComms">
                  Organization(s) referred to:
                </label>
                    <input type="checkbox" id="org1" name="org1" value="AA/NA">
                    <input type="checkbox" id="org2" name="org2" value="Alethia Counseling">
                    <input type="checkbox" id="org3" name="org3" value="Harris Center">
                    <input type="checkbox" id="org4" name="org4" value="Houston Food Bank">
                    <input type="checkbox" id="org5" name="org5" value="Lord of the Streets">
                    <input type="checkbox" id="org6" name="org6" value="Workforce">
                    <input type="checkbox" id="org7" name="org7" value="Other">
              </div>
          </section>

          <section>
              <div class="flex flex-col">
                <label class="self-start font-bold" for="counselorComms">
                  Summary of Encounter
                </label>
                <input name="sumEncounter" type="text">
              </div>
          </section>

          <section class="flex">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="services">
                Social Services Follow-up Items
              </label>
              <input name="followups"/>
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