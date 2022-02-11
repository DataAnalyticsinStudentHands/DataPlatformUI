  <!-- TODO: make font sizes appropriate -->
<template>
  <main>
    <div>
      <h1
        class="font-bold text-4xl font-sans tracking-widest text-center mt-10"
        style="color: #7d0d15"
      >
        Common Data Form
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
              <label class="self-start font-bold" for="birthDate"
                >Birth Date</label
              >
              <input v-model="client.birthdate" name="birthDate" type="date" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="ssNum"
                >Social Security Number</label
              >
              <input v-model="client.socialSecurity" name="ssNum" type="password" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="gender"
                >Gender</label
              >
              <input type="radio" name="gender" id="man" value="man" v-model="gender"/>
              <label for="man">Man</label>
              <input type="radio" name="gender" id="woman" value="woman" v-model="gender">
              <label for="woman">Woman</label>
              <input type="radio" name="gender" id="other" value="other" v-model="gender">
              <label for="other">Other</label>
              <input type="text" name="gender" id="otherText" v-model="gender">
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="ethnicity">Ethnicity</label>
                <input type="radio" name="ethnicity" id="hispanic" value="hispanic/latino" v-model="ethnicity"/>
                <label for="hispanic">Hispanic/Latino</label>
                <input type="radio" name="ethnicity" id="black" value="black/african american" v-model="ethnicity">
                <label for="woman">Black / African American</label>
                <input type="radio" name="ethnicity" id="white" value="white/non-hispanic" v-model="ethnicity">
                <label for="other">White / Non-Hispanic</label>
                <input type="radio" name="ethnicity" id="asian" value="asian" v-model="ethnicity">
                <label for="other">Asian</label>
              </div>
            </section>
<section>
              <section>
                <p class="text-left font-bold mt-10">Education Details</p>
              </section>


              <div class="flex flex-col">
                <label class="self-start font-bold" for="educated"
                  >Have you attended school?</label
                >
                <input type="radio" name="educated" id="yesAttended" value="true" v-model="hasAttendedSchool"/>
                <label for="yesAttended">Yes</label>
                <input type="radio" name="educated" id="noAttended" value="false" v-model="hasAttendedSchool"/>
                <label for="noAttended">No</label>
              </div>
              <label class="self-start font-bold" for="school">School</label>
              <input type="text" name="school" v-model="school">
              <label class="self-start font-bold" for="lastGrade">Last Grade</label>
              <input type="text" name="lastGrade" v-model="lastGrade">
              <div class="flex flex-col">
              <label class="self-start font-bold" for="graduated"
                  >Have you graduated high school?</label
                >
                <input type="radio" name="graduated" id="yesGraduated" value="true" v-model="hasGraduated"/>
                <label for="yesGraduated">Yes</label>
                <input type="radio" name="graduated" id="noGraduated" value="false" v-model="hasGraduated"/>
                <label for="noGraduated">No</label>
              </div>

                <div class="flex flex-col">
                <label class="self-start font-bold" for="highestLevel">Highest Education Level</label>
                <input type="radio" name="highestLevel" id="elementary" value="elementary" v-model="highestLevel"/>
                <label for="elementary">Elementary (K-8)</label>
                <input type="radio" name="highestLevel" id="highSchool/GED" value="highschool / GED" v-model="highestLevel"/>
                <label for="highSchool/GED">Highschool / GED</label>
                <input type="radio" name="highestLevel" id="attendCollege" value="attend college" v-model="highestLevel"/>
                <label for="attendCollege">Attend College</label>
                <input type="radio" name="highestLevel" id="technicalSchool" value="technical school" v-model="highestLevel"/>
                <label for="technicalSchool">Technical School</label>
                <input type="radio" name="highestLevel" id="associateDegree" value="associate degree" v-model="highestLevel"/>
                <label for="associateDegree">Associate Degree</label>
                <input type="radio" name="highestLevel" id="backelorDegree" value="bachelor degree" v-model="highestLevel"/>
                <label for="bachelorDegree">Bachelor Degree</label>
                <input type="radio" name="highestLevel" id="masterDegree" value="master degree" v-model="highestLevel"/>
                <label for="masterDegree">Master Degree</label>
                <input type="radio" name="highestLevel" id="phd" value="phd" v-model="highestLevel"/>
                <label for="phd">PHD</label>
              </div>

              <label class="self-start font-bold" for="certificates">Certifications</label>
              <input type="text" name="certificates" v-model="certificates">
            </section>
          </section>
        </section>

        <section>
          <section>
            <p class="text-left font-bold mt-10">Health Insurance Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasInsurance">Do you have insurance?</label>
                <input type="radio" name="hasInsurance" id="yesInsurance" value="true" v-model="hasInsurance"/>
                <label for="yesGraduated">Yes</label>
                <input type="radio" name="hasInsurance" id="noInsurance" value="false" v-model="hasInsurance"/>
                <label for="noGraduated">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="insuranceType">Insurance Type</label>
              <input type="text" name="insuranceType" v-model="insuranceType"/>
            </div>
          </section>
        </section>
        <section>
          <section>
            <p class="text-left font-bold mt-10">Food Stamp Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasInsurance">Do you receive food stamps?</label>
              <input type="radio" name="hasInsurance" id="yesFoodStamps" value="true" v-model="hasFoodStamps"/>
                <label for="yesFoodStamps">Yes</label>
                <input type="radio" name="hasInsurance" id="noFoodStamps" value="false" v-model="hasFoodStamps"/>
                <label for="noFoodStamps">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="noStampReason">Why do you not have food stamps?</label>
              <input type="text" name="noStampReason" v-model="noFoodStampsReason"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="foodStampAmount">Food Stamp Amount</label>
              <input type="number" name="foodStampAmount" v-model="foodStampsAmt"/>
            </div>
          </section>
        </section>

        <section>
          <section>
            <p class="text-left font-bold mt-10">Income Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="houseHead">Are you the head of your household?</label>
              <input type="radio" name="houseHead" id="yeshead" value="true" v-model="isHeadOfHousehold"/>
                <label for="yesHead">Yes</label>
                <input type="radio" name="houseHead" id="nohead" value="false" v-model="isHeadOfHousehold"/>
                <label for="noHead">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="monthlyIncome">Monthly Income</label>
              <input type="number" name="monthlyIncome" v-model="monthlyIncome"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="otherIncome">Other Income</label>
              <input type="number" name="otherIncome" v-model="otherIncome"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="spouseSupport">Spouse Support</label>
              <input type="number" name="spouseSupport" v-model="spouseSupport"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="workersComp">Worker's Comp</label>
              <input type="number" name="workersComp" v-model="workersComp"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="childSupport">Child Support</label>
              <input type="number" name="childSupport" v-model="childSupport"/>
            </div>
            </section>
            <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="TANF">T.A.N.F</label>
              <input type="number" name="TANF" v-model="TANF"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="supplementalSecInco_">Supplemental Second Income</label>
              <input type="number" name="supplementalSecInco_" v-model="supplementalSecInco_"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="unemployment">Unemployment</label>
              <input type="number" name="unemployment" v-model="unemployment"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="other">Other</label>
              <input type="number" name="other" v-model="other"/>
            </div>
          </section>
        </section>

        <section>
          <section>
            <h3 class="text-left font-bold mt-10">Employment Details</h3>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="houseHead">Are you employed?</label>
              <input type="radio" name="employed" id="yesEmployed" value="true" v-model="isEmployed"/>
                <label for="yesEmployed">Yes</label>
                <input type="radio" name="employed" id="noEmployed" value="false" v-model="isEmployed"/>
                <label for="noEmployed">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="monthlyIncome">Employment Duration (months)</label>
              <input type="number" name="employmentDuration" v-model="employmentDuration"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="employer">Employer</label>
              <input type="text" name="employer" v-model="employer"/>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="occupation">Occupation</label>
              <input type="text" name="occupation" v-model="occupation"/>
            </div>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="homeMaker">Are you a homemaker?</label>
              <input type="radio" name="homeMaker" id="yesHomeMaker" value="true" v-model="isHomeMaker"/>
                <label for="yesHomeMaker">Yes</label>
                <input type="radio" name="homeMaker" id="noHomeMaker" value="false" v-model="isHomeMaker"/>
                <label for="noHomeMaker">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="homeMakerDuration">Homemaker Duration (months)</label>
              <input type="number" name="homeMakerDuration" v-model="homeMakerDuration"/>
            </div>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="houseHead">Are you retired?</label>
              <input type="radio" name="retired" id="yesRetired" value="true" v-model="isRetired"/>
                <label for="yesRetired">Yes</label>
                <input type="radio" name="retired" id="noRetired" value="false" v-model="isRetired"/>
                <label for="noRetired">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="retiredDuration">Retired Duration (months)</label>
              <input type="number" name="retiredDuration" v-model="retiredDuration"/>
            </div>
            </section>
        </section>


        <section>
          <section>
            <h3 class="text-left font-bold mt-10">Priority Population Details</h3>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasMentalIllness">Do you have a diagnosed mental illness?</label>
              <input type="radio" name="hasMentalIllness" id="yeshasMentalIllness" value="true" v-model="hasMentalIllness"/>
                <label for="yeshasMentalIllness">Yes</label>
                <input type="radio" name="hasMentalIllness" id="nohasMentalIllness" value="false" v-model="hasMentalIllness"/>
                <label for="nohasMentalIllness">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasADAHandicap">Do you have an ADA Handicap?</label>
              <input type="radio" name="hasADAHandicap" id="yeshasADAHandicap" value="true" v-model="hasADAHandicap"/>
                <label for="yeshasADAHandicap">Yes</label>
                <input type="radio" name="hasADAHandicap" id="nohasADAHandicap" value="false" v-model="hasADAHandicap"/>
                <label for="nohasADAHandicap">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isElderlyOver55">Are you over the age of 55?</label>
              <input type="radio" name="isElderlyOver55" id="yesisElderlyOver55" value="true" v-model="isElderlyOver55"/>
                <label for="yesisElderlyOver55">Yes</label>
                <input type="radio" name="isElderlyOver55" id="noisElderlyOver55" value="false" v-model="isElderlyOver55"/>
                <label for="noisElderlyOver55">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isVeteran">Are you a veteran?</label>
              <input type="radio" name="isVeteran" id="yesVeteran" value="true" v-model="isVeteran"/>
                <label for="yesVeteran">Yes</label>
                <input type="radio" name="isVeteran" id="noVeteran" value="false" v-model="isVeteran"/>
                <label for="noVeteran">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isHarveyImpact">Were you impacted by hurricane Harvey?</label>
              <input type="radio" name="isHarveyImpact" id="yesHarveyImpact" value="true" v-model="isHarveyImpact"/>
                <label for="yesHarveyImpact">Yes</label>
                <input type="radio" name="isHarveyImpact" id="noHarveyImpact" value="false" v-model="isHarveyImpact"/>
                <label for="noHarveyImpact">No</label>
            </div>
        </section>
        </section>

        <section>
          <section>
            <h3 class="text-left font-bold mt-10">Additional Details</h3>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="houseHead">What is your marital status?</label>
              <input type="radio" name="maritalStatus" id="single" value="single" v-model="maritalStatus"/>
                <label for="yeshasMentalIllness">Single</label>
                <input type="radio" name="maritalStatus" id="married" value="married" v-model="maritalStatus"/>
                <label for="married">Married</label>
                <input type="radio" name="maritalStatus" id="separated" value="separated" v-model="maritalStatus"/>
                <label for="separated">Separated</label>
                <input type="radio" name="maritalStatus" id="divorced" value="divorced" v-model="maritalStatus"/>
                <label for="divorced">Divorced</label>
                <input type="radio" name="maritalStatus" id="widowed" value="widowed" v-model="maritalStatus"/>
                <label for="widowed">Widowed</label>
                <input type="radio" name="maritalStatus" id="commonLaw" value="common law" v-model="maritalStatus"/>
                <label for="commonLaw">Common Law</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isSingleParent">Are you a single parent?</label>
              <input type="radio" name="isSingleParent" id="yesSingleParent" value="true" v-model="isSingleParent"/>
                <label for="yesSingleParent">Yes</label>
                <input type="radio" name="isSingleParent" id="noSingleParent" value="false" v-model="isSingleParent"/>
                <label for="noSingleParent">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isTeenParent">Are you a teen parent?</label>
              <input type="radio" name="isTeenParent" id="yesTeenParent" value="true" v-model="isTeenParent"/>
                <label for="yesTeenParent">Yes</label>
                <input type="radio" name="isTeenParent" id="noTeenParent" value="false" v-model="isTeenParent"/>
                <label for="noTeenParent">No</label>
            </div>

          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isPregnant">Are you pregnant?</label>
              <input type="radio" name="isPregnant" id="yesPregnant" value="true" v-model="isPregnant"/>
                <label for="yesPregnant">Yes</label>
                <input type="radio" name="isPregnant" id="noPregnant" value="false" v-model="isPregnant"/>
                <label for="noPregnant">No</label>
            </div>
            <label class="self-start font-bold" for="deliveryDate">Delivery Date</label>
            <input type="date" name="deliveryDate" v-model="deliveryDate">
            
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
import axios from "axios";
export default {
  data() {
    return {
      client: {
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        secPhone: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        county: "",
        zipcode: "",
      },
    };
  },
  methods: {
    handleSubmitForm() {
      let apiURL = "http://localhost:3000/primarydata";
      axios.post(apiURL, this.client).then(() => {
        this.client = {
          firstName: "",
          middleName: "",
          lastName: "",
          phoneNumber: "",
          secPhone: "",
          email: "",
          address1: "",
          address2: "",
          city: "",
          county: "",
          zipcode: "",
        };
      });
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