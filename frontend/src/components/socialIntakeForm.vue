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
            <section class="flex mt-5">
              <div class="flex gap-x-2">
                <label for="client" class="inline font-bold">Client ID:</label>
                <input type="text" name="client">
              </div>
            </section>
            <section class="flex mt-5">
              <div class="flex gap-x-2">
                <label for="interactionDate" class="inline font-bold">Date of Interaction:</label>
                <input type="date" name="interactionDate">
              </div>
            </section>
  
            <section class="flex mt-5">
              <div class="flex gap-x-2">
                <label class="inline font-bold" for="interactionTypes">Type of Interaction:</label>
                <select id="interactionTypes">
                      <option value="In Office">In Office</option>
                      <option value="Correctional Facility">Correctional Facility</option>
                      <option value="In Field">In Field</option>
                      <option value="Phone">Phone</option>
                      <option value="Email">Email</option>
                </select>
              </div>
            </section>
  
            <section class="flex mt-5">
              <div class="flex flex-col">
                <h3 class="font-bold">
                  Client Goals
                </h3>
                <div class="p-1">
                  <input type="checkbox" id="goal1" name="goal1" value="">
                  <label class="select-none p-1 align-middle" for="goal1">Access to stable housing</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal2" name="goal2" value="">
                  <label class="select-none p-1 align-middle" for="goal2">Access to reliable transportation</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal3" name="goal3" value="">
                  <label class="select-none p-1 align-middle" for="goal3">Clothing</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal4" name="goal4" value="">
                  <label class="select-none p-1 align-middle" for="goal4">Complete job training</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal5" name="goal5" value="">
                  <label class="select-none p-1 align-middle" for="goal5">Desired relationship with family</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal6" name="goal6" value="">
                  <label class="select-none p-1 align-middle" for="goal6">Educational attainment</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal7" name="goal7" value="">
                  <label class="select-none p-1 align-middle" for="goal7">Financial stability</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal8" name="goal8" value="">
                  <label class="select-none p-1 align-middle" for="goal8">Improve quality of life in correctional facility</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal9" name="goal9" value="">
                  <label class="select-none p-1 align-middle" for="goal9">Mental wellness</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal10" name="goal10" value="">
                  <label class="select-none p-1 align-middle" for="goal10">Occupational satisfaction</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal11" name="goal11" value="">
                  <label class="select-none p-1 align-middle" for="goal11">Overcome substance use disorder</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal12" name="goal12" value="">
                  <label class="select-none p-1 align-middle" for="goal12">Spiritual wellness</label>
                </div>
                <div class="p-1">
                  <input type="checkbox" id="goal13" name="goal13" value="">
                  <label class="select-none p-1 align-middle" for="goal13">Other</label>
                </div>
              </div>
            </section>
  
            <section class="mt-5">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="needs">
                  Please describe the client's goals and their immediate needs</label>
                  <textarea name="needs" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
  
              </div>
            </section>
  
            <section class="flex mt-5">
                <div class="flex flex-col">
                  <h3 class="self-start font-bold">
                    How is your communication with your Attorney?
                  </h3>
                  <div class="p-1">
                    <input type="checkbox" id="ref1" name="ref1" value="">
                    <label class="select-none p-1 align-middle" for="ref1">Adelphoi Program</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref2" name="ref2" value="">
                    <label class="select-none p-1 align-middle" for="ref2">Assistance with ID</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref3" name="ref3" value="">
                    <label class="select-none p-1 align-middle" for="ref3">Child Care</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref4" name="ref4" value="">
                    <label class="select-none p-1 align-middle" for="ref4">Clothing</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref5" name="ref5" value="">
                    <label class="select-none p-1 align-middle" for="ref5">CPS Involvement</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref6" name="ref6" value="">
                    <label class="select-none p-1 align-middle" for="ref6">Employment</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref7" name="ref7" value="">
                    <label class="select-none p-1 align-middle" for="ref7">Family Support</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref8" name="ref8" value="">
                    <label class="select-none p-1 align-middle" for="ref8">Food Benefit</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref9" name="ref9" value="">
                    <label class="select-none p-1 align-middle" for="ref9">Health Care Benefits</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref10" name="ref10" value="">
                    <label class="select-none p-1 align-middle" for="ref10">Housing</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref11" name="ref11" value="">
                    <label class="select-none p-1 align-middle" for="ref11">Mental Health Counseling</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref12" name="ref12" value="">
                    <label class="select-none p-1 align-middle" for="ref12">Nutrition</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref13" name="ref13" value="">
                    <label class="select-none p-1 align-middle" for="ref13">Social Security Card</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref14" name="ref14" value="">
                    <label class="select-none p-1 align-middle" for="ref14">SSI/SSDI</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref15" name="ref15" value="">
                    <label class="select-none p-1 align-middle" for="ref15">Substance Use Counseling/Group</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref16" name="ref16" value="">
                    <label class="select-none p-1 align-middle" for="ref16">Transportation</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref17" name="ref17" value="">
                    <label class="select-none p-1 align-middle" for="ref17">WIC</label>
                  </div>
                  <div class="p-1">
                    <input type="checkbox" id="ref18" name="ref18" value="">
                    <label class="select-none p-1 align-middle" for="ref18">Social Security Card</label>
                  </div>
                </div>
            </section>
  
            <section class="flex mt-5">
                <div class="flex flex-col">
                  <h3 class="self-start font-bold">
                    Organization(s) referred to:
                  </h3>
                    <div class="p-1">
                      <input type="checkbox" id="org1" name="org1" value="">
                      <label class="select-none p-1 align-middle" for="org1">AA/NA</label>
                    </div>
                    <div class="p-1">
                      <input type="checkbox" id="org2" name="org2" value="">
                      <label class="select-none p-1 align-middle" for="org2">Alethia Counseling</label>
                    </div>
                    <div class="p-1">
                      <input type="checkbox" id="org3" name="org3" value="">
                      <label class="select-none p-1 align-middle" for="org3">Harris Center</label>
                    </div>

                    <div class="p-1">
                      <input type="checkbox" id="org4" name="org4" value="">
                      <label class="select-none p-1 align-middle" for="org4">Houston Food Bank</label>
                    </div>
                    <div class="p-1">
                      <input type="checkbox" id="org5" name="org5" value="">
                      <label class="select-none p-1 align-middle" for="org5">Lord of the Streets</label>
                    </div>
                    <div class="p-1">
                      <input type="checkbox" id="org6" name="org6" value="Workforce">
                      <label class="select-none p-1 align-middle" for="org6">Workforce</label>
                    </div>
                    <div class="p-1">
                      <input type="checkbox" id="org7" name="org7" value="">
                      <label class="select-none p-1 align-middle" for="org7">Other</label>
                    </div>
                </div>
            </section>
  
            <section class="mt-5">
                <div class="flex flex-col">
                  <label class="self-start font-bold" for="summary">
                    Summary of Encounter
                  </label>
                  <textarea name="summary" style="resize: none;" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'"></textarea>
                </div>
            </section>
  
            <!-- <section class="mt-5">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="followups">
                  Social Services Follow-up Items
                </label>
                <input name="followups"/>
              </div>
            </section> -->
  
          </section>
          <div class="flex justify-between mt-10 mr-20">
            <button @click.prevent class="bg-white text-brick border-brick border rounded" type="reset">Clear Form</button>
            <button class="bg-brick text-white rounded" type="submit">Add Client</button>
          </div>
        </form>
      </div>
    </main>
  </template>
<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import axios from "axios";
export default {
  setup() {
    return { v$: useVuelidate({ $autoDirty: true }) };
  },
  data() {
    return {
      date: "",
      interactionType: "",
      goals: [],
      goalNotes: "",
      attorneyCommunication: [],
      orgRef: [],
      summary: "",
    };
  },
  methods: {
    async handleSubmitForm() {
      // Checks to see if there are any errors in validation
      const isFormCorrect = await this.v$.$validate();
      // If no errors found. isFormCorrect = True then the form is submitted
      if (isFormCorrect) {
        this.event.services = this.checkedServices;
        let apiURL = import.meta.env.VITE_ROOT_API + `/socialData`;
        axios
          .post(apiURL, this.event)
          .then(() => {
            
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
  // sets validations for the various data properties
  validations() {
    return {
      event: {
        date: { required },
        interactionType: { required },
      },
    };
  },
};
</script>
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