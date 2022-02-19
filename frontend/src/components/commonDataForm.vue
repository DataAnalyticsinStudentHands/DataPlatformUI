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
      <form @submit.prevent="handleSubmitForm">
        <section>
          <section>
            <p class="text-left font-bold">Personal Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="birthDate"
                >Birth Date</label
              >
              <input v-model="data.birthdate" name="birthDate" type="date" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="ssNum"
                >Social Security Number</label
              >
              <input
                v-model="data.socialSecurity"
                name="ssNum"
                type="password"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="gender">Gender</label>
              <input
                type="radio"
                name="gender"
                id="man"
                value="man"
                v-model="data.gender"
              />
              <label for="man">Man</label>
              <input
                type="radio"
                name="gender"
                id="woman"
                value="woman"
                v-model="data.gender"
              />
              <label for="woman">Woman</label>
              <input
                type="radio"
                name="gender"
                id="other"
                value="other"
                v-model="data.gender"
              />
              <label for="other">Other</label>
              <input
                type="text"
                name="gender"
                id="otherText"
                v-model="data.gender"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="sex">Sex</label>
              <input
                type="radio"
                name="sex"
                id="male"
                value="male"
                v-model="data.sex"
              />
              <label for="man">Male</label>
              <input
                type="radio"
                name="sex"
                id="female"
                value="female"
                v-model="data.sex"
              />
              <label for="woman">Female</label>
            </div>
          </section>
          <section class="mt-5">
            <section class="flex space-x-10">
              <div class="flex flex-col">
                <label class="self-start font-bold" for="ethnicity"
                  >Ethnicity</label
                >
                <input
                  type="radio"
                  name="ethnicity"
                  id="hispanic"
                  value="hispanic/latino"
                  v-model="data.ethnicity"
                />
                <label for="hispanic">Hispanic/Latino</label>
                <input
                  type="radio"
                  name="ethnicity"
                  id="black"
                  value="black/african american"
                  v-model="data.ethnicity"
                />
                <label for="woman">Black / African American</label>
                <input
                  type="radio"
                  name="ethnicity"
                  id="white"
                  value="white/non-hispanic"
                  v-model="data.ethnicity"
                />
                <label for="other">White / Non-Hispanic</label>
                <input
                  type="radio"
                  name="ethnicity"
                  id="asian"
                  value="asian"
                  v-model="data.ethnicity"
                />
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
                <input
                  type="radio"
                  name="educated"
                  id="yesAttended"
                  value="true"
                  v-model="data.education[0].hasAttendedSchool"
                />
                <label for="yesAttended">Yes</label>
                <input
                  type="radio"
                  name="educated"
                  id="noAttended"
                  value="false"
                  v-model="data.education[0].hasAttendedSchool"
                />
                <label for="noAttended">No</label>
              </div>
              <label class="self-start font-bold" for="school">School</label>
              <input
                type="text"
                name="school"
                v-model="data.education[0].school"
              />
              <label class="self-start font-bold" for="lastGrade"
                >Last Grade</label
              >
              <input
                type="text"
                name="lastGrade"
                v-model="data.education[0].lastGrade"
              />
              <div class="flex flex-col">
                <label class="self-start font-bold" for="graduated"
                  >Have you graduated high school?</label
                >
                <input
                  type="radio"
                  name="graduated"
                  id="yesGraduated"
                  value="true"
                  v-model="data.education[0].hasGraduated"
                />
                <label for="yesGraduated">Yes</label>
                <input
                  type="radio"
                  name="graduated"
                  id="noGraduated"
                  value="false"
                  v-model="data.education[0].hasGraduated"
                />
                <label for="noGraduated">No</label>
              </div>

              <div class="flex flex-col">
                <label class="self-start font-bold" for="highestLevel"
                  >Highest Education Level</label
                >
                <input
                  type="radio"
                  name="highestLevel"
                  id="elementary"
                  value="elementary"
                  v-model="data.education[0].highestLevel"
                />
                <label for="elementary">Elementary (K-8)</label>
                <input
                  type="radio"
                  name="highestLevel"
                  id="highSchool/GED"
                  value="highschool / GED"
                  v-model="data.education[0].highestLevel"
                />
                <label for="highSchool/GED">Highschool / GED</label>
                <input
                  type="radio"
                  name="highestLevel"
                  id="attendCollege"
                  value="attend college"
                  v-model="data.education[0].highestLevel"
                />
                <label for="attendCollege">Attend College</label>
                <input
                  type="radio"
                  name="highestLevel"
                  id="technicalSchool"
                  value="technical school"
                  v-model="data.education[0].highestLevel"
                />
                <label for="technicalSchool">Technical School</label>
                <input
                  type="radio"
                  name="highestLevel"
                  id="associateDegree"
                  value="associate degree"
                  v-model="data.education[0].highestLevel"
                />
                <label for="associateDegree">Associate Degree</label>
                <input
                  type="radio"
                  name="highestLevel"
                  id="backelorDegree"
                  value="bachelor degree"
                  v-model="data.education[0].highestLevel"
                />
                <label for="bachelorDegree">Bachelor Degree</label>
                <input
                  type="radio"
                  name="highestLevel"
                  id="masterDegree"
                  value="master degree"
                  v-model="data.education[0].highestLevel"
                />
                <label for="masterDegree">Master Degree</label>
                <input
                  type="radio"
                  name="highestLevel"
                  id="phd"
                  value="phd"
                  v-model="data.education[0].highestLevel"
                />
                <label for="phd">PHD</label>
              </div>

              <label class="self-start font-bold" for="certificates"
                >Certifications</label
              >
              <input
                type="text"
                name="certificates"
                v-model="data.education[0].certificates"
              />
            </section>
          </section>
        </section>

        <section>
          <section>
            <p class="text-left font-bold mt-10">Health Insurance Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasInsurance"
                >Do you have insurance?</label
              >
              <input
                type="radio"
                name="hasInsurance"
                id="yesInsurance"
                value="true"
                v-model="data.healthInsurance[0].hasInsurance"
              />
              <label for="yesGraduated">Yes</label>
              <input
                type="radio"
                name="hasInsurance"
                id="noInsurance"
                value="false"
                v-model="data.healthInsurance[0].hasInsurance"
              />
              <label for="noGraduated">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="insuranceType"
                >Insurance Type</label
              >
              <input
                type="text"
                name="insuranceType"
                v-model="data.healthInsurance[0].insuranceType"
              />
            </div>
          </section>
        </section>
        <section>
          <section>
            <p class="text-left font-bold mt-10">Food Stamp Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasInsurance"
                >Do you receive food stamps?</label
              >
              <input
                type="radio"
                name="hasInsurance"
                id="yesFoodStamps"
                value="true"
                v-model="data.foodStamps[0].hasFoodStamps"
              />
              <label for="yesFoodStamps">Yes</label>
              <input
                type="radio"
                name="hasInsurance"
                id="noFoodStamps"
                value="false"
                v-model="data.foodStamps[0].hasFoodStamps"
              />
              <label for="noFoodStamps">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="noStampReason"
                >Why do you not have food stamps?</label
              >
              <input
                type="text"
                name="noStampReason"
                v-model="data.foodStamps[0].noFoodStampsReason"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="foodStampAmount"
                >Food Stamp Amount</label
              >
              <input
                type="number"
                name="foodStampAmount"
                v-model="data.foodStamps[0].foodStampsAmt"
              />
            </div>
          </section>
        </section>

        <section>
          <section>
            <p class="text-left font-bold mt-10">Income Details</p>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="houseHead"
                >Are you the head of your household?</label
              >
              <input
                type="radio"
                name="houseHead"
                id="yeshead"
                value="true"
                v-model="data.income[0].isHeadOfHousehold"
              />
              <label for="yesHead">Yes</label>
              <input
                type="radio"
                name="houseHead"
                id="nohead"
                value="false"
                v-model="data.income[0].isHeadOfHousehold"
              />
              <label for="noHead">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="monthlyIncome"
                >Monthly Income</label
              >
              <input
                type="number"
                name="monthlyIncome"
                v-model="data.income[0].monthlyIncome"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="otherIncome"
                >Other Income</label
              >
              <input
                type="number"
                name="otherIncome"
                v-model="data.income[0].otherIncome"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="spouseSupport"
                >Spouse Support</label
              >
              <input
                type="number"
                name="spouseSupport"
                v-model="data.income[0].spouseSupport"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="workersComp"
                >Worker's Comp</label
              >
              <input
                type="number"
                name="workersComp"
                v-model="data.income[0].workersComp"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="childSupport"
                >Child Support</label
              >
              <input
                type="number"
                name="childSupport"
                v-model="data.income[0].childSupport"
              />
            </div>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="TANF">T.A.N.F</label>
              <input type="number" name="TANF" v-model="data.income[0].TANF" />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="supplementalSecInco_"
                >Supplemental Second Income</label
              >
              <input
                type="number"
                name="supplementalSecInco_"
                v-model="data.income[0].supplementalSecInco_"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="unemployment"
                >Unemployment</label
              >
              <input
                type="number"
                name="unemployment"
                v-model="data.income[0].unemployment"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="other">Other</label>
              <input
                type="number"
                name="other"
                v-model="data.income[0].other"
              />
            </div>
          </section>
        </section>

        <section>
          <section>
            <h3 class="text-left font-bold mt-10">Employment Details</h3>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="houseHead"
                >Are you employed?</label
              >
              <input
                type="radio"
                name="employed"
                id="yesEmployed"
                value="true"
                v-model="data.employment[0].isEmployed"
              />
              <label for="yesEmployed">Yes</label>
              <input
                type="radio"
                name="employed"
                id="noEmployed"
                value="false"
                v-model="data.employment[0].isEmployed"
              />
              <label for="noEmployed">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="monthlyIncome"
                >Employment Duration (months)</label
              >
              <input
                type="number"
                name="employmentDuration"
                v-model="data.employment[0].employmentDuration"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="employer"
                >Employer</label
              >
              <input
                type="text"
                name="employer"
                v-model="data.employment[0].employer"
              />
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="occupation"
                >Occupation</label
              >
              <input
                type="text"
                name="occupation"
                v-model="data.employment[0].occupation"
              />
            </div>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="homeMaker"
                >Are you a homemaker?</label
              >
              <input
                type="radio"
                name="homeMaker"
                id="yesHomeMaker"
                value="true"
                v-model="data.employment[0].isHomeMaker"
              />
              <label for="yesHomeMaker">Yes</label>
              <input
                type="radio"
                name="homeMaker"
                id="noHomeMaker"
                value="false"
                v-model="data.employment[0].isHomeMaker"
              />
              <label for="noHomeMaker">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="homeMakerDuration"
                >Homemaker Duration (months)</label
              >
              <input
                type="number"
                name="homeMakerDuration"
                v-model="data.employment[0].homeMakerDuration"
              />
            </div>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="houseHead"
                >Are you retired?</label
              >
              <input
                type="radio"
                name="retired"
                id="yesRetired"
                value="true"
                v-model="data.employment[0].isRetired"
              />
              <label for="yesRetired">Yes</label>
              <input
                type="radio"
                name="retired"
                id="noRetired"
                value="false"
                v-model="data.employment[0].isRetired"
              />
              <label for="noRetired">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="retiredDuration"
                >Retired Duration (months)</label
              >
              <input
                type="number"
                name="retiredDuration"
                v-model="data.employment[0].retiredDuration"
              />
            </div>
          </section>
        </section>

        <section>
          <section>
            <h3 class="text-left font-bold mt-10">
              Priority Population Details
            </h3>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasMentalIllness"
                >Do you have a diagnosed mental illness?</label
              >
              <input
                type="radio"
                name="hasMentalIllness"
                id="yeshasMentalIllness"
                value="true"
                v-model="data.priorityPopulation[0].hasMentalIllness"
              />
              <label for="yeshasMentalIllness">Yes</label>
              <input
                type="radio"
                name="hasMentalIllness"
                id="nohasMentalIllness"
                value="false"
                v-model="data.priorityPopulation[0].hasMentalIllness"
              />
              <label for="nohasMentalIllness">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="hasADAHandicap"
                >Do you have an ADA Handicap?</label
              >
              <input
                type="radio"
                name="hasADAHandicap"
                id="yeshasADAHandicap"
                value="true"
                v-model="data.priorityPopulation[0].hasADAHandicap"
              />
              <label for="yeshasADAHandicap">Yes</label>
              <input
                type="radio"
                name="hasADAHandicap"
                id="nohasADAHandicap"
                value="false"
                v-model="data.priorityPopulation[0].hasADAHandicap"
              />
              <label for="nohasADAHandicap">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isElderlyOver55"
                >Are you over the age of 55?</label
              >
              <input
                type="radio"
                name="isElderlyOver55"
                id="yesisElderlyOver55"
                value="true"
                v-model="data.priorityPopulation[0].isElderlyOver55"
              />
              <label for="yesisElderlyOver55">Yes</label>
              <input
                type="radio"
                name="isElderlyOver55"
                id="noisElderlyOver55"
                value="false"
                v-model="data.priorityPopulation[0].isElderlyOver55"
              />
              <label for="noisElderlyOver55">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isVeteran"
                >Are you a veteran?</label
              >
              <input
                type="radio"
                name="isVeteran"
                id="yesVeteran"
                value="true"
                v-model="data.priorityPopulation[0].isVeteran"
              />
              <label for="yesVeteran">Yes</label>
              <input
                type="radio"
                name="isVeteran"
                id="noVeteran"
                value="false"
                v-model="data.priorityPopulation[0].isVeteran"
              />
              <label for="noVeteran">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isHarveyImpact"
                >Were you impacted by hurricane Harvey?</label
              >
              <input
                type="radio"
                name="isHarveyImpact"
                id="yesHarveyImpact"
                value="true"
                v-model="data.priorityPopulation[0].isHarveyImpact"
              />
              <label for="yesHarveyImpact">Yes</label>
              <input
                type="radio"
                name="isHarveyImpact"
                id="noHarveyImpact"
                value="false"
                v-model="data.priorityPopulation[0].isHarveyImpact"
              />
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
              <label class="self-start font-bold" for="houseHead"
                >What is your marital status?</label
              >
              <input
                type="radio"
                name="maritalStatus"
                id="single"
                value="single"
                v-model="data.additionalData[0].maritalStatus"
              />
              <label for="yeshasMentalIllness">Single</label>
              <input
                type="radio"
                name="maritalStatus"
                id="married"
                value="married"
                v-model="data.additionalData[0].maritalStatus"
              />
              <label for="married">Married</label>
              <input
                type="radio"
                name="maritalStatus"
                id="separated"
                value="separated"
                v-model="data.additionalData[0].maritalStatus"
              />
              <label for="separated">Separated</label>
              <input
                type="radio"
                name="maritalStatus"
                id="divorced"
                value="divorced"
                v-model="data.additionalData[0].maritalStatus"
              />
              <label for="divorced">Divorced</label>
              <input
                type="radio"
                name="maritalStatus"
                id="widowed"
                value="widowed"
                v-model="data.additionalData[0].maritalStatus"
              />
              <label for="widowed">Widowed</label>
              <input
                type="radio"
                name="maritalStatus"
                id="commonLaw"
                value="common law"
                v-model="data.additionalData[0].maritalStatus"
              />
              <label for="commonLaw">Common Law</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isSingleParent"
                >Are you a single parent?</label
              >
              <input
                type="radio"
                name="isSingleParent"
                id="yesSingleParent"
                value="true"
                v-model="data.additionalData[0].isSingleParent"
              />
              <label for="yesSingleParent">Yes</label>
              <input
                type="radio"
                name="isSingleParent"
                id="noSingleParent"
                value="false"
                v-model="data.additionalData[0].isSingleParent"
              />
              <label for="noSingleParent">No</label>
            </div>
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isTeenParent"
                >Are you a teen parent?</label
              >
              <input
                type="radio"
                name="isTeenParent"
                id="yesTeenParent"
                value="true"
                v-model="data.additionalData[0].isTeenParent"
              />
              <label for="yesTeenParent">Yes</label>
              <input
                type="radio"
                name="isTeenParent"
                id="noTeenParent"
                value="false"
                v-model="data.additionalData[0].isTeenParent"
              />
              <label for="noTeenParent">No</label>
            </div>
          </section>
          <section class="flex space-x-10 mt-10">
            <div class="flex flex-col">
              <label class="self-start font-bold" for="isPregnant"
                >Are you pregnant?</label
              >
              <input
                type="radio"
                name="isPregnant"
                id="yesPregnant"
                value="true"
                v-model="data.additionalData[0].isPregnant"
              />
              <label for="yesPregnant">Yes</label>
              <input
                type="radio"
                name="isPregnant"
                id="noPregnant"
                value="false"
                v-model="data.additionalData[0].isPregnant"
              />
              <label for="noPregnant">No</label>
            </div>
            <label class="self-start font-bold" for="deliveryDate"
              >Delivery Date</label
            >
            <input
              type="date"
              name="deliveryDate"
              v-model="data.additionalData[0].deliveryDate"
            />
          </section>
        </section>
        <div class="flex justify-between mt-10 mr-20">
          <button type="submit">Add Client</button>
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
      data: {
        client_id: "18006953666",
        birthdate: "",
        socialSecurity: "",
        gender: "",
        sex: "",
        ethnicity: "",
        education: [
          {
            hasAttendedSchool: "",
            school: "",
            lastGrade: "",
            hasGraduated: "",
            highestLevel: "",
            certificates: "",
          },
        ],
        healthInsurance: [
          {
            hasInsurance: "",
            insuranceType: "",
          },
        ],
        foodStamps: [
          {
            hasFoodStamps: "",
            noStampReason: "",
            foodStampAmt: "",
          },
        ],
        income: [
          {
            isHeadOfHousehold: "",
            monthlyIncome: "",
            otherIncome: "",
            spouseSupport: "",
            wokersComp: "",
            childSupport: "",
            TANF: "",
            supplementalSecInco_: "",
            unemployment: "",
            other: "",
          },
        ],
        employment: [
          {
            isEmployed: "",
            employmentDuration: "",
            employer: "",
            occupation: "",
            isHomeMaker: "",
            homeMakerDuration: "",
            isRetired: "",
            retiredDuration: "",
          },
        ],
        priorityPopulation: [
          {
            hasMentalIllness: "",
            hasADAHandicap: "",
            isElderlyOver55: "",
            isVeteran: "",
            isHarveyImpact: "",
          },
        ],
        additionalData: [
          {
            maritalStatus: "",
            isSingleParent: "",
            isTeenParent: "",
            isPregnant: "",
            deliveryDate: "",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmitForm() {
      console.log(this.data.ethnicity);
      console.log("AAAAAAAAAAAAA");
      let apiURL = "http://localhost:3000/commonData/";
      axios
        .post(apiURL, this.data)
        .then(() => {
          this.$router.push("/");
          this.data = {
            client_id: "",
            birthdate: "",
            socialSecurity: "",
            gender: "",
            sex: "",
            ethnicity: "",
            education: [
              {
                hasAttendedSchool: "",
                school: "",
                lastGrade: "",
                hasGraduated: "",
                highestLevel: "",
                certificates: "",
              },
            ],
            healthInsurance: [
              {
                hasInsurance: "",
                insuranceType: "",
              },
            ],
            foodStamps: [
              {
                hasFoodStamps: "",
                noStampReason: "",
                foodStampAmt: "",
              },
            ],
            income: [
              {
                isHeadOfHousehold: "",
                monthlyIncome: "",
                otherIncome: "",
                spouseSupport: "",
                wokersComp: "",
                childSupport: "",
                TANF: "",
                supplementalSecInco_: "",
                unemployment: "",
                other: "",
              },
            ],
            employment: [
              {
                isEmployed: "",
                employmentDuration: "",
                employer: "",
                occupation: "",
                isHomeMaker: "",
                homeMakerDuration: "",
                isRetired: "",
                retiredDuration: "",
              },
            ],
            priorityPopulation: [
              {
                hasMentalIllness: "",
                hasADAHandicap: "",
                isElderlyOver55: "",
                isVeteran: "",
                isHarveyImpact: "",
              },
            ],
            additionalData: [
              {
                maritalStatus: "",
                isSingleParent: "",
                isTeenParent: "",
                isPregnant: "",
                deliveryDate: "",
              },
            ],
          };
        })
        .catch((error) => {
          console.log(error);
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