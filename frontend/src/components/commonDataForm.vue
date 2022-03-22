// TODO MAKE RESPONSIVE
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
        <!-- PERSONAL DETAILS SECTION -->
        <section>
          <div>
            <h2 class="text-left text-lg font-bold">Personal Details</h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="birthDate">Birth Date</label>
              <input v-model="data.birthdate" name="birthDate" type="date" />
            </div>
            <div>
              <label class="flex flex-col font-bold" for="ssNum"
                >Social Security Number</label
              >
              <input
                v-model="data.socialSecurity"
                name="ssNum"
                type="password"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="gender">Gender</label>
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="sex">Sex</label>
              <div class="flex gap-x-2 items-center">
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
            </div>

            <div class="flex flex-col">
              <label class="font-bold" for="ethnicity">Ethnicity</label>
              <div class="flex gap-x-2 items-center">
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
                <label for="white">White / Non-Hispanic</label>
                <input
                  type="radio"
                  name="ethnicity"
                  id="asian"
                  value="asian"
                  v-model="data.ethnicity"
                />
                <label for="asian">Asian</label>
                <input
                  type="radio"
                  name="ethnicity"
                  id="other"
                  value="other"
                  v-model="data.ethnicity"
                />
                <label for="other">Other</label>
              </div>
            </div>
          </section>
        </section>

        <!-- EDUCATION DETAILS SECTION -->
        <section>
          <div>
            <h2 class="text-lg text-left font-bold mt-10">Education Details</h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="educated"
                >Have you attended school?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="school">School</label>
              <input
                type="text"
                name="school"
                v-model="data.education[0].school"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="lastGrade">Last Grade</label>
              <input
                type="text"
                name="lastGrade"
                v-model="data.education[0].lastGrade"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="graduated"
                >Have you graduated high school?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>

            <div class="flex flex-col">
              <label class="font-bold" for="highestLevel"
                >Highest Education Level</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="certificates">Certifications</label>
              <input
                type="text"
                name="certificates"
                v-model="data.education[0].certificates"
              />
            </div>
          </section>
        </section>

        <!-- HEALTH INSURANCE DETAILS -->
        <section>
          <div>
            <h2 class="text-left text-lg font-bold mt-10">
              Health Insurance Details
            </h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="hasInsurance"
                >Do you have insurance?</label
              >
              <div class="flex gap-x-2 items-center">
                <input
                  type="radio"
                  name="hasInsurance"
                  id="yesInsurance"
                  value="true"
                  v-model="data.healthInsurance[0].hasInsurance"
                />
                <label for="yesInsurance">Yes</label>
                <input
                  type="radio"
                  name="hasInsurance"
                  id="noInsurance"
                  value="false"
                  v-model="data.healthInsurance[0].hasInsurance"
                />
                <label for="noInsurance">No</label>
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="insuranceType"
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

        <!-- FOOD STAMP DETAILS -->
        <section>
          <div>
            <h2 class="text-left text-lg font-bold mt-10">
              Food Stamp Details
            </h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="hasInsurance"
                >Do you receive food stamps?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="noStampReason"
                >Why do you not have food stamps?</label
              >
              <div>
                <input
                  type="text"
                  name="noStampReason"
                  v-model="data.foodStamps[0].noFoodStampsReason"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="foodStampAmount"
                >Food Stamp Amount</label
              >
              <div>
                <input
                  type="number"
                  name="foodStampAmount"
                  v-model="data.foodStamps[0].foodStampsAmt"
                />
              </div>
            </div>
          </section>
        </section>

        <!-- INCOME DETAILS SECTION -->
        <section>
          <div>
            <h2 class="text-left text-lg font-bold mt-10">Income Details</h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="houseHead"
                >Are you the head of your household?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="monthlyIncome"
                >Monthly Income</label
              >
              <div>
                <input
                  type="number"
                  name="monthlyIncome"
                  v-model="data.income[0].monthlyIncome"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="otherIncome">Other Income</label>
              <div>
                <input
                  type="number"
                  name="otherIncome"
                  v-model="data.income[0].otherIncome"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="spouseSupport"
                >Spouse Support</label
              >
              <div>
                <input
                  type="number"
                  name="spouseSupport"
                  v-model="data.income[0].spouseSupport"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="workersComp">Worker's Comp</label>
              <div>
                <input
                  type="number"
                  name="workersComp"
                  v-model="data.income[0].workersComp"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="childSupport">Child Support</label>
              <div>
                <input
                  type="number"
                  name="childSupport"
                  v-model="data.income[0].childSupport"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="TANF">T.A.N.F</label>
              <div>
                <input
                  type="number"
                  name="TANF"
                  v-model="data.income[0].TANF"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="supplementalSecInco_"
                >Supplemental Second Income</label
              >
              <div>
                <input
                  type="number"
                  name="supplementalSecInco_"
                  v-model="data.income[0].supplementalSecInco_"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="unemployment">Unemployment</label>
              <div>
                <input
                  type="number"
                  name="unemployment"
                  v-model="data.income[0].unemployment"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="other">Other</label>
              <div>
                <input
                  type="number"
                  name="other"
                  v-model="data.income[0].other"
                />
              </div>
            </div>
          </section>
        </section>

        <!-- EMPLOYEMENT DETAILS SECTION -->
        <section>
          <div>
            <h2 class="text-left text-lg font-bold mt-10">
              Employment Details
            </h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="houseHead">Are you employed?</label>
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="monthlyIncome"
                >Employment Duration (months)</label
              >
              <input
                type="number"
                name="employmentDuration"
                v-model="data.employment[0].employmentDuration"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="employer">Employer</label>
              <input
                type="text"
                name="employer"
                v-model="data.employment[0].employer"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="occupation">Occupation</label>
              <input
                type="text"
                name="occupation"
                v-model="data.employment[0].occupation"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="homeMaker"
                >Are you a homemaker?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="homeMakerDuration"
                >Homemaker Duration (months)</label
              >
              <input
                type="number"
                name="homeMakerDuration"
                v-model="data.employment[0].homeMakerDuration"
              />
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="houseHead">Are you retired?</label>
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="retiredDuration"
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

        <!-- PRIORITY POPULATION DETAILS SECTION -->
        <section>
          <div>
            <h2 class="text-left text-lg font-bold mt-10">
              Priority Population Details
            </h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="hasMentalIllness"
                >Do you have a diagnosed mental illness?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="hasADAHandicap"
                >Do you have an ADA Handicap?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="isElderlyOver55"
                >Are you over the age of 55?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="isVeteran"
                >Are you a veteran?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="isHarveyImpact"
                >Were you impacted by hurricane Harvey?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
          </section>
        </section>

        <!-- ADDITIONAL DETAILS SECTION -->
        <section>
          <div>
            <h2 class="text-left font-bold mt-10">Additional Details</h2>
          </div>
          <section class="flex gap-x-8 gap-y-4 flex-wrap mt-2">
            <div class="flex flex-col">
              <label class="font-bold" for="houseHead"
                >What is your marital status?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="isSingleParent"
                >Are you a single parent?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="isTeenParent"
                >Are you a teen parent?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="isPregnant"
                >Are you pregnant?</label
              >
              <div class="flex gap-x-2 items-center">
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
            </div>
            <div class="flex flex-col">
              <label class="font-bold" for="deliveryDate">Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                v-model="data.additionalData[0].deliveryDate"
              />
            </div>
          </section>
          <section class="space-x-10 mt-10"></section>
        </section>
        <div class="flex justify-between mt-10 mr-20">
          <button type="submit">Update Client</button>
          <button type="reset" @click="$router.go(-1)">Go back</button>
        </div>
      </form>
    </div>
  </main>
</template>
<script>
import axios from "axios";
export default {
  mounted() {
    window.scrollTo(0, 0);
  },
  props: ["id"],
  data() {
    return {
      exists: true,
      data: {
        client_id: this.id,
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

  beforeMount() {
    //Loads resp data into Vue Data properties
    axios
      .get(
        `http://${this.$store.state.ipAddress}:3000/commondata/commondataform/`,
        {
          params: { id: this.id },
        }
      )
      .then((resp) => {
        let datu = resp.data[0];
        if (datu != undefined) {
          // this.client.firstName = data.firstName;
          // this.client.address[0].line1 = data.address[0].line1;

          this.data.birthdate = new Date(datu.birthdate);
          this.data.socialSecurity =
            datu.socialSecurity; /*###CHANGE THIS SOMEHOW LATER!!!###*/
          this.data.gender = datu.gender;
          this.data.sex = datu.sex;
          this.data.ethnicity = datu.ethnicity;
          this.data.education[0].hasAttendedSchool =
            datu.education[0].hasAttendedSchool;
          this.data.education[0].school = datu.education[0].school;
          this.data.education[0].lastGrade = datu.education[0].lastGrade;
          this.data.education[0].hasGraduated = datu.education[0].hasGraduated;
          this.data.education[0].highestLevel = datu.education[0].highestLevel;
          this.data.education[0].certificates = datu.education[0].certificates;
          this.data.healthInsurance[0].hasInsurance =
            datu.healthInsurance[0].hasInsurance;
          this.data.healthInsurance[0].insuranceType =
            datu.healthInsurance[0].insuranceType;
          this.data.foodStamps[0].hasFoodStamps =
            datu.foodStamps[0].hasFoodStamps;
          this.data.foodStamps[0].noStampReason =
            datu.foodStamps[0].noStampReason;
          this.data.foodStamps[0].foodStampAmt =
            datu.foodStamps[0].foodStampAmt;
          this.data.income[0].isHeadOfHousehold =
            datu.income[0].isHeadOfHousehold;
          this.data.income[0].monthlyIncome = datu.income[0].monthlyIncome;
          this.data.income[0].otherIncome = datu.income[0].otherIncome;
          this.data.income[0].spouseSupport = datu.income[0].spouseSupport;
          this.data.income[0].wokersComp = datu.income[0].wokersComp;
          this.data.income[0].childSupport = datu.income[0].childSupport;
          this.data.income[0].TANF = datu.income[0].TANF;
          this.data.income[0].supplementalSecInco_ =
            datu.income[0].supplementalSecInco_;
          this.data.income[0].unemployment = datu.income[0].unemployment;
          this.data.income[0].other = datu.income[0].other;
          this.data.employment[0].isEmployed = datu.employment[0].isEmployed;
          this.data.employment[0].employmentDuration =
            datu.employment[0].employmentDuration;
          this.data.employment[0].employer = datu.employment[0].employer;
          this.data.employment[0].occupation = datu.employment[0].occupation;
          this.data.employment[0].isHomeMaker = datu.employment[0].isHomeMaker;
          this.data.employment[0].homeMakerDuration =
            datu.employment[0].homeMakerDuration;
          this.data.employment[0].isRetired = datu.employment[0].isRetired;
          this.data.employment[0].retiredDuration =
            datu.employment[0].retiredDuration;
          this.data.priorityPopulation[0].hasMentalIllness =
            datu.priorityPopulation[0].hasMentalIllness;
          this.data.priorityPopulation[0].hasADAHandicap =
            datu.priorityPopulation[0].hasADAHandicap;
          this.data.priorityPopulation[0].isElderlyOver55 =
            datu.priorityPopulation[0].isElderlyOver55;
          this.data.priorityPopulation[0].isVeteran =
            datu.priorityPopulation[0].isVeteran;
          this.data.priorityPopulation[0].isHarveyImpact =
            datu.priorityPopulation[0].isHarveyImpact;
          this.data.additionalData[0].maritalStatus =
            datu.additionalData[0].maritalStatus;
          this.data.additionalData[0].isSingleParent =
            datu.additionalData[0].isSingleParent;
          this.data.additionalData[0].isTeenParent =
            datu.additionalData[0].isTeenParent;
          this.data.additionalData[0].isPregnant =
            datu.additionalData[0].isPregnant;
          this.data.additionalData[0].deliveryDate =
            datu.additionalData[0].deliveryDate;
          this.exists = true;
        } else {
          this.exists = false;
        }
      });
  },

  methods: {
    handleSubmitForm() {
      if (this.exists != true) {
        let apiURL = `http://${this.$store.state.ipAddress}:3000/commonData/`;
        axios
          .post(apiURL, this.data)
          .then(() => {
            this.$router.push("/");
            this.data = {
              client_id: this.id,
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
      } else {
        let apiURL = `http://${this.$store.state.ipAddress}:3000/commonData/update`;
        axios
          .post(apiURL, this.data)
          .then(() => {
            this.$router.push("/");
            this.data = {
              client_id: this.id,
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
      }
    },
  },
};
</script>
<style>
input,
select {
  border: 1px solid #cfd4d9;
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
h2 {
  color: #bb2b35;
}
</style>