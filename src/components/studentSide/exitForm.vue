<!-- /exitForm need to connect matrix to data actvititys x contributions-->
<template>


<!-- Exit Form: {{ exitForm }} -->



  <v-container>
    <v-form ref="exitForm">
    <!-- Title -->
    <v-row dense>
      <v-col cols="12">
        <p class="font-weight-black text-h5 text--primary">Exit Form</p>
      </v-col>
    </v-row>

    <!-- Current Semester -->
    <v-row dense>
      <v-col cols="12">
        <p class="font-weight-black text-h8">Current Semester:</p>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-text-field v-model="exitForm.semester" readonly></v-text-field>
      </v-col>
    </v-row>

    <!-- Experience -->
    <v-row dense>
      <v-col cols="12">
        <p class="font-weight-black text-h8">Experience:</p>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-text-field v-model="exitForm.experience.experienceName" readonly></v-text-field>
      </v-col>
    </v-row>

    <!-- Aspirations -->
    <div v-if="goalFormExists">

    <v-row dense>
      <v-col cols="12">
        <p class="font-weight-black text-h8">At the beginning of the semester, we asked you to share two to three aspirations. Now we would like to know whether you feel you made progress towards these aspirations. Below is a list of your aspirations from the beginning of the semester.</p>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-list density="compact">
          <template v-for="(aspiration, index) in [exitForm.aspiration1, exitForm.aspiration2, exitForm.aspiration3]">
            <v-list-item v-if="aspiration" :key="index">
              <v-list-item-title>
                <span class="font-weight-black"> Aspiration {{ index + 1 }}: </span>
              </v-list-item-title>
              {{ aspiration }}
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>

    <!-- Aspirations Progress Table -->
    <v-row>
      <v-col cols="12">
        <p :class="{'text-custom-red': isAspirationProgressInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">For each aspiration listed, please pick the option that best describes the progress you made.</p>
      </v-col>
    </v-row>

    <!-- Mobile View -->
    <v-row class="d-sm-none">
      <v-col cols="12">
        <div v-if="exitForm.aspiration1">
          <div class="font-semibold italic">“{{ exitForm.aspiration1 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.aspirationOneProgressSelected" :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.aspirationOneProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="exitForm.aspiration2">
          <div class="font-semibold italic">“{{ exitForm.aspiration2 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.aspirationTwoProgressSelected"  :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.aspirationTwoProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="exitForm.aspiration3">
          <div class="font-semibold italic">“{{ exitForm.aspiration3 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.aspirationThreeProgressSelected"  :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.aspirationThreeProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>


    <!-- Non-Mobile View -->  
    <v-row class="d-none d-sm-flex">
      <v-col cols="12">
      <v-card>
        <v-table>
          <thead>
            <tr>
              <th></th>
              <th v-for="option in exitForm.progressMade.aspirationOneProgressResults" :key="option.id" class="text-center">{{ option.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="exitForm.aspiration1">
              <td>{{ exitForm.aspiration1 }}</td>
              <td v-for="option in exitForm.progressMade.aspirationOneProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.aspirationOneProgressSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationOneProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.aspiration2">
              <td>{{ exitForm.aspiration2 }}</td>
              <td v-for="option in exitForm.progressMade.aspirationTwoProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.aspirationTwoProgressSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationTwoProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.aspiration3">
              <td>{{ exitForm.aspiration3 }}</td>
              <td v-for="option in exitForm.progressMade.aspirationThreeProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.aspirationThreeProgressSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationThreeProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

  <!-- Aspirations Connection Table -->
  <v-row>
    <v-col cols="12">
      <p :class="{'text-custom-red': isAspirationConnectionInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">For each aspiration listed, please pick the option that best describes the connection between your progress and this course.</p>
    </v-col>
  </v-row>

  <!-- Mobile View -->
  <v-row class="d-sm-none">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
            <div v-if="exitForm.aspiration1">
              <div class="font-semibold italic">“{{ exitForm.aspiration1 }}”</div>
              <p class="text-caption text-gray-500">The progress I made towards this aspiration was...</p>
              <v-radio-group v-model="exitForm.progressMade.aspirationOneExperienceConnectionSelected"  :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.aspirationOneExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="exitForm.aspiration2">
              <div class="font-semibold italic">“{{ exitForm.aspiration2 }}”</div>
              <p class="text-caption text-gray-500">The progress I made towards this aspiration was...</p>
              <v-radio-group v-model="exitForm.progressMade.aspirationTwoExperienceConnectionSelected"  :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.aspirationTwoExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="exitForm.aspiration3">
              <div class="font-semibold italic">“{{ exitForm.aspiration3 }}”</div>
              
              <p class="text-caption text-gray-500">The progress I made towards this aspiration was...</p>
              <v-radio-group v-model="exitForm.progressMade.aspirationThreeExperienceConnectionSelected"  :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.aspirationThreeExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>


  <!-- Non-Mobile View -->

  <v-row>
    <v-col cols="12">
      <v-card>
        <v-table class="d-none d-sm-flex">
          <thead>
            <tr>
              <th></th>
              <th v-for="option in exitForm.progressMade.aspirationOneExperienceConnection" :key="option.id" class="text-center">{{ option.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="exitForm.aspiration1">
              <td>{{ exitForm.aspiration1 }}</td>
              <td v-for="option in exitForm.progressMade.aspirationOneExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.aspirationOneExperienceConnectionSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationOneExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.aspiration2">
              <td>{{ exitForm.aspiration2 }}</td>
              <td v-for="option in exitForm.progressMade.aspirationTwoExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.aspirationTwoExperienceConnectionSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationTwoExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.aspiration3">
              <td>{{ exitForm.aspiration3 }}</td>
              <td v-for="option in exitForm.progressMade.aspirationThreeExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.aspirationThreeExperienceConnectionSelected"  :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.aspirationThreeExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

  <!-- Goals Progress Table -->
  <v-row>
    <v-col cols="12">
      <p :class="{'text-custom-red': isGoalProgressInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">At the beginning of the semester, we asked you to share three goals for your participation in this course. Now we would like to know whether you feel you made progress towards these goals and which activities from the course contributed to your progress.</p>

      <p :class="{'text-custom-red': isGoalProgressInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">For each goal listed below, please pick the option that best describes the progress you made.</p>
    </v-col>
  </v-row>
  
  <!-- Mobile View -->
  <v-row class="d-sm-none">
      <v-col cols="12">
        <div v-if="exitForm.goal1">
          <div class="font-semibold italic">“{{ exitForm.goal1 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.goalOneProgressSelected" :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.goalOneProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="exitForm.goal2">
          <div class="font-semibold italic">“{{ exitForm.goal2 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.goalTwoProgressSelected" :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.goalTwoProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="exitForm.goal3">
          <div class="font-semibold italic">“{{ exitForm.goal3 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.goalThreeProgressSelected" :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.goalThreeProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="exitForm.goal4">
          <div class="font-semibold italic">“{{ exitForm.goal4 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.goalFourProgressSelected" :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.goalFourProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
        <div v-if="exitForm.goal5">
          <div class="font-semibold italic">“{{ exitForm.goal5 }}”</div>
          <v-radio-group v-model="exitForm.progressMade.goalFiveProgressSelected" :rules="[requiredRule]">
            <v-radio
              v-for="option in exitForm.progressMade.goalFiveProgressResults"
              :label="option.xs_label"
              :key="option.id"
              :value="option.label"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>

  <!-- Non-Mobile View -->

  <v-row>
    <v-col cols="12">
      <v-card>
        <v-table class="d-none d-sm-flex">
          <thead>
            <tr>
              <th></th>
              <th v-for="option in exitForm.progressMade.goalOneProgressResults" :key="option.id" class="text-center">{{ option.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="exitForm.goal1">
              <td>{{ exitForm.goal1 }}</td>
              <td v-for="option in exitForm.progressMade.goalOneProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalOneProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalOneProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal2">
              <td>{{ exitForm.goal2 }}</td>
              <td v-for="option in exitForm.progressMade.goalTwoProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalTwoProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalTwoProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal3">
              <td>{{ exitForm.goal3 }}</td>
              <td v-for="option in exitForm.progressMade.goalThreeProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalThreeProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalThreeProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal4">
              <td>{{ exitForm.goal4 }}</td>
              <td v-for="option in exitForm.progressMade.goalFourProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalFourProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFourProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal5">
              <td>{{ exitForm.goal5 }}</td>
              <td v-for="option in exitForm.progressMade.goalFiveProgressResults" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalFiveProgressSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFiveProgressSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

  <!-- Goals Connection Table -->
  <v-row>
    <v-col cols="12">
      <p :class="{'text-custom-red': isGoalConnectionInvalid && formSubmitted, 'font-weight-black': true, 'text-h8': true}">For each goal listed, please pick the option that best describes the connection between your progress and this course.</p>
    </v-col>
  </v-row>

  <!-- Mobile View -->
  <v-row class="d-sm-none">
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
            <div v-if="exitForm.goal1">
              <div class="font-semibold italic">“{{ exitForm.goal1 }}”</div>
              <p class="text-caption text-gray-500">The progress I made towards this goal was...</p>
              <v-radio-group v-model="exitForm.progressMade.goalOneExperienceConnectionSelected" :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.goalOneExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="exitForm.goal2">
              <div class="font-semibold italic">“{{ exitForm.goal2 }}”</div>
              <p class="text-caption text-gray-500">The progress I made towards this goal was...</p>
              <v-radio-group v-model="exitForm.progressMade.goalTwoExperienceConnectionSelected" :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.goalTwoExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="exitForm.goal3">
              <div class="font-semibold italic">“{{ exitForm.goal3 }}”</div>
              
              <p class="text-caption text-gray-500">The progress I made towards this goal was...</p>
              <v-radio-group v-model="exitForm.progressMade.goalThreeExperienceConnectionSelected" :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.goalThreeExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="exitForm.goal4">
              <div class="font-semibold italic">“{{ exitForm.goal4 }}”</div>
              
              <p class="text-caption text-gray-500">The progress I made towards this goal was...</p>
              <v-radio-group v-model="exitForm.progressMade.goalFourExperienceConnectionSelected" :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.goalFourExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="exitForm.goal5">
              <div class="font-semibold italic">“{{ exitForm.goal5 }}”</div>
              
              <p class="text-caption text-gray-500">The progress I made towards this goal was...</p>
              <v-radio-group v-model="exitForm.progressMade.goalFiveExperienceConnectionSelected" :rules="[requiredRule]">
                <v-radio
                  v-for="option in exitForm.progressMade.goalFiveExperienceConnection"
                  :label="option.xs_label"
                  :key="option.id"
                  :value="option.label"
                ></v-radio>
              </v-radio-group>
            </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>


  <!-- Non-Mobile View -->

  <v-row>
    <v-col cols="12">
      <v-card>
        <v-table class="d-none d-sm-flex">
          <thead>
            <tr>
              <th></th>
              <th v-for="option in exitForm.progressMade.goalOneExperienceConnection" :key="option.id" class="text-center">{{ option.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="exitForm.goal1">
              <td>{{ exitForm.goal1 }}</td>
              <td v-for="option in exitForm.progressMade.goalOneExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalOneExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalOneExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal2">
              <td>{{ exitForm.goal2 }}</td>
              <td v-for="option in exitForm.progressMade.goalTwoExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalTwoExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalTwoExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal3">
              <td>{{ exitForm.goal3 }}</td>
              <td v-for="option in exitForm.progressMade.goalThreeExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalThreeExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalThreeExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal4">
              <td>{{ exitForm.goal4 }}</td>
              <td v-for="option in exitForm.progressMade.goalFourExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalFourExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFourExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
            <tr v-if="exitForm.goal5">
              <td>{{ exitForm.goal5 }}</td>
              <td v-for="option in exitForm.progressMade.goalFiveExperienceConnection" :key="option.id">
                <v-radio-group v-model="exitForm.progressMade.goalFiveExperienceConnectionSelected" :rules="[requiredRule]" :error-messages="(!exitForm.progressMade.goalFiveExperienceConnectionSelected && formSubmitted) ? 'Please select one.' : ''">
                  <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>

<!-- Goal Barriers List -->
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGoalIssuesInvalid }">Please select which goal(s) you faced barriers to achieving this semester.</p>
      <!-- List of goals from the student's input -->
      <v-list density="compact">
        <v-list-item
          v-for="(goal, index) in existingGoals"
          :key="index"
          density="compact"
          class="ma-0 pa-0"
        >
          <v-checkbox
            v-model="exitForm.goalIssues.goals[index].checked"
            density="compact"
            :disabled="exitForm.goalIssues.goals[5].checked"
            :indeterminate="exitForm.goalIssues.goals[5].checked"
            :label="goal"
            outlined
          ></v-checkbox>
        </v-list-item>
        <v-list-item
          density="compact"
          class="ma-0 pa-0"
        >
          <v-checkbox
            v-model="exitForm.goalIssues.goals[5].checked"
            @change="handleNoneSelected"
            density="compact"
            label="None"
            outlined
            :error-messages="goalIssuesErrorMessage"
          ></v-checkbox>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
  <!-- Dummy text field for Group validation -->
  <v-text-field
    v-show="false"
    :rules="goalIssuesRules"
  ></v-text-field>

  

  <!-- Describe Goal Barriers -->

  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8 mb-2">
        For one of the goals you selected above, please describe what those barriers were and what strategies you employed to overcome those barriers in 3-4 sentences.
      </p>
    </v-col>
  </v-row>
  <v-row dense class="mt-0 pt-0">
    <v-col cols="12">
      <v-textarea
        v-model="exitForm.goalIssues.issuesDescription"
        class="mt-0"
        outlined
        dense
        label="Descriptions/Strategies"
        rows="4"
      ></v-textarea>
    </v-col>
  </v-row>

<!-- Activity Progress -->

<!-- Mobile View -->
<div class="d-sm-none">

  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8 mb-2" :class="{'text-custom-red': isGoalActivityProgressMobileInvalidTitle && formSubmitted}">
        For each activity listed, check the boxes for goals that the activity helped you make progress towards. If the activity did not contribute to any of your goals, select "no goals".
      </p>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <div v-for="activity in exitForm.experienceActivities" :key="activity.activityID">
        <div class="font-weight-black">{{ activity.activityName }}</div>
          <v-checkbox
            v-if="exitForm.goal1"
            :label="`Goal 1: ${exitForm.goal1}`"
            :id="`${activity.activityID}-goal1`"
            :value="activity.activityID"
            v-model="exitForm.activitiesContribution.goalOneContributions"
            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"  
            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
            density="compact"
            
          ></v-checkbox>
          <v-checkbox
            v-if="exitForm.goal2"
            :label="`Goal 2: ${exitForm.goal2}`"
            :id="`${activity.activityID}-goal2`"
            :value="activity.activityID"
            v-model="exitForm.activitiesContribution.goalTwoContributions"
            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
            @change="updateContribution(activity.activityID, 'goalTwoContributions', $event)"
            density="compact"
            
          ></v-checkbox>
          <v-checkbox
            v-if="exitForm.goal3"
            :label="`Goal 3: ${exitForm.goal3}`"
            :id="`${activity.activityID}-goal3`"
            :value="activity.activityID"
            v-model="exitForm.activitiesContribution.goalThreeContributions"
            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
            @change="updateContribution(activity.activityID, 'goalThreeContributions', $event)"
            density="compact"
            
          ></v-checkbox>
          <v-checkbox
            v-if="exitForm.goal4"
            :label="`Goal 4: ${exitForm.goal4}`"
            :id="`${activity.activityID}-goal4`"
            :value="activity.activityID"
            v-model="exitForm.activitiesContribution.goalFourContributions"
            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
            @change="updateContribution(activity.activityID, 'goalFourContributions', $event)"
            density="compact"
            
          ></v-checkbox>
          <v-checkbox
            v-if="exitForm.goal5"
            :label="`Goal 5: ${exitForm.goal5}`"
            :id="`${activity.activityID}-goal5`"
            :value="activity.activityID"
            v-model="exitForm.activitiesContribution.goalFiveContributions"
            :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
            :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
            @change="updateContribution(activity.activityID, 'goalFiveContributions', $event)"
            density="compact"
            
          ></v-checkbox>
          <v-checkbox
            :id="`${activity.activityID}-noGoals`"
            :value="activity.activityID"
            v-model="exitForm.activitiesContribution.noContributions"
            label="No Goals"
            @change="updateContribution(activity.activityID, 'noContributions', $event)"
            density="compact"
            
          ></v-checkbox>
          <!-- Dummy Text Fields for Group Validation -->
          <v-text-field
            v-show="false"
            :rules="[() => validateGoalActivityProgress(activity)]"
          ></v-text-field>
          <p class="text-sm text-custom-red mb-3 pt-0" v-if="!isGoalActivityProgressMobileInvalid[activity.activityID] && formSubmitted">At least one checkbox must be selected per Activity.</p>
      </div>
    </v-col>
  </v-row>
</div>

  <!-- Non-Mobile View -->
  <div class="d-none d-sm-inline">
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8 mb-2">
        Below is a list of your goals from the beginning of the semester:
      </p>
    </v-col>
  </v-row>
  <v-row dense>
    <v-col cols="12">
      <v-list density="compact">
        <template v-for="(goal, index) in [exitForm.goal1, exitForm.goal2, exitForm.goal3, exitForm.goal4, exitForm.goal5]">
          <v-list-item v-if="goal" :key="index">
            <span class="font-weight-black text-center">Goal {{ index + 1 }}: </span>
            {{ goal }}
          </v-list-item>
        </template>
      </v-list>
    </v-col>
  </v-row>

      <v-row>
        <v-col cols="12">
          <p class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isGoalActivityProgressInvalid && formSubmitted }">
            For each activity listed, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".
          </p>
        </v-col>
      </v-row>

  <v-row>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th></th>
              <th v-for="(goal, index) in existingGoals" :key="index">Goal {{ index + 1 }}</th>
              <th>No Goals</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in exitForm.experienceActivities" :key="activity.activityID">
              <td>{{ activity.activityName }}</td>
              <td>
                <v-checkbox
                  :id="`${activity.activityID}-goal1`"
                  :value="activity.activityID"
                  v-model="exitForm.activitiesContribution.goalOneContributions"
                  :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                  :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                  @change="updateContribution(activity.activityID, 'goalOneContributions', $event)"
                  density="compact"
                  
                ></v-checkbox>
              </td>
              <td>
                <v-checkbox
                  :id="`${activity.activityID}-goal2`"
                  :value="activity.activityID"
                  v-model="exitForm.activitiesContribution.goalTwoContributions"
                  :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                  :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                  @change="updateContribution(activity.activityID, 'goalTwoContributions', $event)"
                  density="compact"
                  
                ></v-checkbox>
              </td>
              <td>
                <v-checkbox
                  :id="`${activity.activityID}-goal3`"
                  :value="activity.activityID"
                  v-model="exitForm.activitiesContribution.goalThreeContributions"
                  :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"  
                  :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)" 
                  @change="updateContribution(activity.activityID, 'goalThreeContributions', $event)"
                  density="compact"
                  
                ></v-checkbox>
              </td>
              <td v-show="existingGoals.length >= 4">
                <v-checkbox
                  :id="`${activity.activityID}-goal4`"
                  :value="activity.activityID"
                  v-model="exitForm.activitiesContribution.goalFourContributions"
                  :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                  :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                  @change="updateContribution(activity.activityID, 'goalFourContributions', $event)"
                  density="compact"
                  
                ></v-checkbox>
              </td>
              <td v-show="existingGoals.length >= 5">
                <v-checkbox
                  :id="`${activity.activityID}-goal5`"
                  :value="activity.activityID"
                  v-model="exitForm.activitiesContribution.goalFiveContributions"
                  :indeterminate="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"   
                  :disabled="exitForm.activitiesContribution.noContributions.includes(activity.activityID)"
                  @change="updateContribution(activity.activityID, 'goalFiveContributions', $event)"
                  density="compact"
                  
                ></v-checkbox>
              </td>
              <td>
                <v-checkbox
                  :id="`${activity.activityID}-noGoals`"
                  :value="activity.activityID"
                  v-model="exitForm.activitiesContribution.noContributions"
                  @change="updateContribution(activity.activityID, 'noContributions', $event.target.checked)"
                  density="compact"
                  
                ></v-checkbox>
              </td>
              <!-- Dummy Text Fields for Group Validation -->
              <v-text-field
                v-show="false"
                :rules="[() => validateGoalActivityProgress(activity)]"
              ></v-text-field>
            </tr>
          </tbody>
        </v-table>
        <p class="text-sm text-custom-red" v-if="isGoalActivityProgressInvalid && formSubmitted">At least one checkbox must be selected per Activity.</p>
      </v-col>
    </v-row>

  </div>

  </div>

  <!-- Experience contribution to Graduate/Professional Goals -->
  <v-row class="mt-5">
    <v-col cols="12">
      <p class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red' : isExperienceContributionGradProfInvalid && formSubmitted}">
        How did this experience contribute to your graduate/professional goals?
      </p>
    </v-col>
  </v-row>
  <v-row dense>
    <v-col cols="12">
      <v-textarea
        v-model="exitForm.experienceContributions"
        outlined
        dense
        label="Contribution Description"
        rows="4"
        class="mt-0"
        :rules="[requiredRule]"
      ></v-textarea>
    </v-col>
  </v-row>

      <!-- Data & Society likelihood questions -->

    <!-- If Experience is not Data & Society, hide -->
    <div v-if="dataAndSociety">

    <!-- Mobile View -->
    <div class="d-sm-none">
      <v-row>
        <v-col cols="12">
          <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isLikelihoodInvalid && formSubmitted}"> Use the scale provided to rate your likelihood of taking the actions listed:</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div>
            <div class="font-weight-black">Enroll in another Data & Society Course</div>
            <v-radio-group v-model="exitForm.likelihoodOf.enrollAnotherCourseSelected" :rules="[requiredRule]">
              <v-radio
                v-for="option in exitForm.likelihoodOf.enrollAnotherCourse"
                :label="option.label"
                :key="option.id"
                :value="option.label"
              ></v-radio>
            </v-radio-group>
          </div>
          <div>
            <div class="font-weight-black">Complete the Data & Society minor</div>
            <v-radio-group v-model="exitForm.likelihoodOf.completeMinorSelected" :rules="[requiredRule]">
              <v-radio
                v-for="option in exitForm.likelihoodOf.completeMinor"
                :label="option.label"
                :key="option.id"
                :value="option.label"
              ></v-radio>
            </v-radio-group>
          </div>
          <div>
            <div class="font-weight-black">Complete the Data & Society minor</div>
            <v-radio-group v-model="exitForm.likelihoodOf.recommendCourseSelected" :rules="[requiredRule]">
              <v-radio
                v-for="option in exitForm.likelihoodOf.recommendCourse"
                :label="option.label"
                :key="option.id"
                :value="option.label"
              ></v-radio>
            </v-radio-group>
          </div>
          <div>
            <div class="font-weight-black">Complete the Data & Society minor</div>
            <v-radio-group v-model="exitForm.likelihoodOf.pursueCareerSelected" :rules="[requiredRule]">
              <v-radio
                v-for="option in exitForm.likelihoodOf.pursueCareer"
                :label="option.label"
                :key="option.id"
                :value="option.label"
              ></v-radio>
            </v-radio-group>
          </div>

        </v-col>
      </v-row>
    </div>



      <!-- Non-Mobile View -->  
      <v-row class="d-none d-sm-inline">
        <v-row>
          <v-col cols="12">
            <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isLikelihoodInvalid && formSubmitted}"> Use the scale provided to rate your likelihood of taking the actions listed:</p>
          </v-col>
        </v-row>
        <v-col cols="12">
        <v-card>
          <v-table>
            <thead>
              <tr>
                <th></th>
                <th v-for="option in exitForm.likelihoodOf.enrollAnotherCourse" :key="option.id">{{ option.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Enroll in another Data & Society Course</td>
                <td v-for="option in exitForm.likelihoodOf.enrollAnotherCourse" :key="option.id">
                  <v-radio-group v-model="exitForm.likelihoodOf.enrollAnotherCourseSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.enrollAnotherCourseSelected && formSubmitted) ? 'Please select one.' : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>Complete the Data & Society minor</td>
                <td v-for="option in exitForm.likelihoodOf.completeMinor" :key="option.id">
                  <v-radio-group v-model="exitForm.likelihoodOf.completeMinorSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.completeMinorSelected && formSubmitted) ? 'Please select one.' : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>Recommend this course to a friend</td>
                <td v-for="option in exitForm.likelihoodOf.recommendCourse" :key="option.id">
                  <v-radio-group v-model="exitForm.likelihoodOf.recommendCourseSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.recommendCourseSelected && formSubmitted) ? 'Please select one.' : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>Pursue a career in Data Science</td>
                <td v-for="option in exitForm.likelihoodOf.pursueCareer" :key="option.id">
                  <v-radio-group v-model="exitForm.likelihoodOf.pursueCareerSelected" :rules="[requiredRule]" :error-messages="(!exitForm.likelihoodOf.pursueCareerSelected && formSubmitted) ? 'Please select one.' : ''">
                    <v-radio :value="option.label" class="d-flex justify-center align-center"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <!-- Growth -->
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProblemSolvingInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>problem solving</u>.</p>
      <v-radio-group v-model="exitForm.generalGrowth.problemSolving" :rules="[requiredRule]">
        <v-radio label="No growth" value="No growth"></v-radio>
        <v-radio label="A little growth" value="A little growth"></v-radio>
        <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
        <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEffCommInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>effective communication</u>.</p>
      <v-radio-group v-model="exitForm.generalGrowth.effectiveCommunication" :rules="[requiredRule]">
        <v-radio label="No growth" value="No growth"></v-radio>
        <v-radio label="A little growth" value="A little growth"></v-radio>
        <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
        <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthTeamworkInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>teamwork</u>.</p>
      <v-radio-group v-model="exitForm.generalGrowth.teamwork" :rules="[requiredRule]">
        <v-radio label="No growth" value="No growth"></v-radio>
        <v-radio label="A little growth" value="A little growth"></v-radio>
        <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
        <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthCulHumInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>cultural humility</u>.</p>
      <v-radio-group v-model="exitForm.generalGrowth.culturalHumility" :rules="[requiredRule]">
        <v-radio label="No growth" value="No growth"></v-radio>
        <v-radio label="A little growth" value="A little growth"></v-radio>
        <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
        <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthEthicsInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>ethical decision making</u>.</p>
      <v-radio-group v-model="exitForm.generalGrowth.ethicalDecisionMaking" :rules="[requiredRule]">
        <v-radio label="No growth" value="No growth"></v-radio>
        <v-radio label="A little growth" value="A little growth"></v-radio>
        <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
        <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8" :class="{ 'text-custom-red': isGrowthProfResInvalid && formSubmitted }">Please indicate how much growth you experienced during your program in the area of <u>professional responsibility</u>.</p>
      <v-radio-group v-model="exitForm.generalGrowth.professionalResponsibility" :rules="[requiredRule]">
        <v-radio label="No growth" value="No growth"></v-radio>
        <v-radio label="A little growth" value="A little growth"></v-radio>
        <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
        <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>

  <!-- Biggest Lessons and Key Takeaways -->
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isBiggestLessonsInvalid && formSubmitted }">
        What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?
      </p>
    </v-col>
  </v-row>
  <v-row dense class="mt-0 pt-0">
    <v-col cols="12">
      <v-textarea
        v-model="exitForm.openEnded.biggestLessons"
        class="mt-0"
        outlined
        dense
        label="Lessons/Takeaways"
        rows="4"
        :rules="[requiredRule]"
      ></v-textarea>
    </v-col>
  </v-row>

  <!-- Engage and Support -->
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8 mb-2" :class="{ 'text-custom-red': isSupportOthersInvalid && formSubmitted }">
        Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?
      </p>
    </v-col>
  </v-row>
  <v-row dense class="mt-0 pt-0">
    <v-col cols="12">
      <v-textarea
        v-model="exitForm.openEnded.supportOthers"
        class="mt-0"
        outlined
        dense
        label="Engage/Support"
        rows="4"
        :rules="[requiredRule]"
      ></v-textarea>
    </v-col>
  </v-row>

  <!-- Other Comments/Recommendations -->
  <v-row>
    <v-col cols="12">
      <p class="font-weight-black text-h8 mb-2">
        Use this space to provide any other comments or recommendations you would like to share.
      </p>
    </v-col>
  </v-row>
  <v-row dense class="mt-0 pt-0">
    <v-col cols="12">
      <v-textarea
        v-model="exitForm.openEnded.comments"
        class="mt-0"
        outlined
        dense
        label="Comments/Recommendations"
        rows="4"
      ></v-textarea>
    </v-col>
  </v-row>

  <!-- Submit Button -->
  <v-row>
    <v-col cols="12" md="4">
      <v-btn @click="handleSubmitForm">Submit Form</v-btn>
    </v-col>
  </v-row>

  </v-form>
  </v-container>
</template>
  
<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      specificIDs:[],
      exitForm: {
        semester: "",
        experience: [
          {
            _id: "",
            experienceCategory: "",
            experienceName: ""
          }
        ],
        goalForm:[{
          aspiration1:"",
          aspiration2:"",
          aspiration3:"",
          goal1:"",
          goal2:"",
          goal3:"",
          goal4:"",
          goal5:"",}
        ],
        goalSettingFormID: "",
        experienceActivities:[{
          activityID:"",
          activityName:""}
        ],
        progressMade: {
          aspirationOneProgressResults: [
            { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
          ],
          aspirationTwoProgressResults: [
            { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
          ],
          aspirationThreeProgressResults: [
            { id: 1, label: "I made lots of progress towards this aspiration", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this aspiration", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this aspiration", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this aspiration", xs_label: "No progress", checked: false }
          ],
          aspirationOneProgressSelected: "",
          aspirationTwoProgressSelected:"",
          aspirationThreeProgressSelected: "",
          aspirationOneExperienceConnection: [
            { id: 1, label: "The progress I made towards this aspiration was largely due to this course", xs_label: "Largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this aspiration was partly due to this course", xs_label: "Partly due to this course",  checked: false },
            { id: 3, label: "The progress I made towards this aspiration was not due to this course", xs_label: "Not due to this course",  checked: false }
          ],
          aspirationTwoExperienceConnection: [
            { id: 1, label: "The progress I made towards this aspiration was largely due to this course",  xs_label: "Largely due to this course.", checked: false },
            { id: 2, label: "The progress I made towards this aspiration was partly due to this course",  xs_label: "Partly due to this course.", checked: false },
            { id: 3, label: "The progress I made towards this aspiration was not due to this course",  xs_label: "Not due to this course.", checked: false }
          ],
          aspirationThreeExperienceConnection: [
            { id: 1, label: "The progress I made towards this aspiration was largely due to this course", xs_label: "Largely due to this course.", checked: false },
            { id: 2, label: "The progress I made towards this aspiration was partly due to this course", xs_label: "Partly due to this course.", checked: false },
            { id: 3, label: "The progress I made towards this aspiration was not due to this course", xs_label: "Not due to this course.", checked: false }
          ],
          aspirationOneExperienceConnectionSelected: null,
          aspirationTwoExperienceConnectionSelected: null,
          aspirationThreeExperienceConnectionSelected: null,
          goalOneProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
          ],
          goalTwoProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
          ],
          goalThreeProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
          ],
          goalFourProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
          ],
          goalFiveProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", xs_label: "Lots of progress", checked: false },
            { id: 2, label: "I made some progress towards this goal", xs_label: "Some progress", checked: false },
            { id: 3, label: "I made little progress towards this goal", xs_label: "Little progress", checked: false },
            { id: 4, label: "I did not make progress towards this goal", xs_label: "No progress", checked: false }
          ],
          goalOneProgressSelected: null,
          goalTwoProgressSelected: null,
          goalThreeProgressSelected: null,
          goalFourProgressSelected: null,
          goalFiveProgressSelected: null,
          goalOneExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course", checked: false }
          ],
          goalTwoExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course", checked: false }
          ],
          goalThreeExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course", checked: false }
          ],
          goalFourExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course", checked: false }
          ],
          goalFiveExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", xs_label: "Largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", xs_label: "Partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", xs_label: "Not due to this course", checked: false }
          ],
          goalOneExperienceConnectionSelected: null,
          goalTwoExperienceConnectionSelected: null,
          goalThreeExperienceConnectionSelected: null,
          goalFourExperienceConnectionSelected: null,
          goalFiveExperienceConnectionSelected: null,
        },
        //section to describe obstacles and how it was overcome
        goalIssues: {
          goals: [
            { id: 1, label: "Goal 1", checked: false },
            { id: 2, label: "Goal 2", checked: false },
            { id: 3, label: "Goal 3", checked: false },
            { id: 4, label: "Goal 4", checked: false },
            { id: 5, label: "Goal 5", checked: false },
            { id: 6, label: "No Goals", checked: false },
          ],
          issuesDescription: ""
        },
        //array that includes which activities contributed towards the goals
        activitiesContribution: {
          goalOneContributions: [],
          goalTwoContributions: [],
          goalThreeContributions: [],
          goalFourContributions: [],
          goalFiveContributions: [],
          noContributions: []
        },
        //how experience contributed to goals, net promoter question
        experienceContributions: "",
        //likliehood of doing certain actions based on the experience taken
        likelihoodOf: {
          enrollAnotherCourse: [
            { id: 1, label: "Extremely likely", checked: false },
            { id: 2, label: "Somewhat likely", checked: false },
            { id: 3, label: "Neutral likely/unlikely", checked: false },
            { id: 4, label: "Somewhat unlikely", checked: false },
            { id: 5, label: "Extremely unlikely", checked: false }
          ],
          completeMinor: [
            { id: 1, label: "Extremely likely", checked: false },
            { id: 2, label: "Somewhat likely", checked: false },
            { id: 3, label: "Neutral likely/unlikely", checked: false },
            { id: 4, label: "Somewhat unlikely", checked: false },
            { id: 5, label: "Extremely unlikely", checked: false }
          ],
          recommendCourse: [
            { id: 1, label: "Extremely likely", checked: false },
            { id: 2, label: "Somewhat likely", checked: false },
            { id: 3, label: "Neutral likely/unlikely", checked: false },
            { id: 4, label: "Somewhat unlikely", checked: false },
            { id: 5, label: "Extremely unlikely", checked: false }
          ],
          pursueCareer: [
            { id: 1, label: "Extremely likely", checked: false },
            { id: 2, label: "Somewhat likely", checked: false },
            { id: 3, label: "Neutral likely/unlikely", checked: false },
            { id: 4, label: "Somewhat unlikely", checked: false },
            { id: 5, label: "Extremely unlikely", checked: false }
          ],
          enrollAnotherCourseSelected: "",
          completeMinorSelected: "",
          recommendCourseSelected: "",
          pursueCareerSelected: "",
        },
        //general growth goals and the results after experience
        generalGrowth: {
          problemSolving: "",
          effectiveCommunication: "",
          teamwork: "",
          culturalHumility: "",
          ethicalDecisionMaking: "",
          professionalResponsibility: ""
        },
        //general open-ended
        openEnded: {
          biggestLessons: "",
          supportOthers: "",
          comments: ""
        }
      },
      formSubmitted: false,
      requiredRule: value => {
        // If form has not been submitted, pass validation
        if (!this.formSubmitted) {
          return true;
        }
        // Otherwise, check if the value is present
        return !!value || 'Information is required.';
      },
      dataAndSociety: false,
      goalFormExists: false,
    };
  },
  mounted() {
    this.fetchSemester();
    this.fetchExperienceData();
    this.fetchExperienceActivities();
    this.fetchGoalSettingFormData();
  },
  computed:{
    isAspirationProgressInvalid() {
      // Check the first two aspirations for validity as they are required.
      const isAspirationOneInvalid = !this.exitForm.progressMade.aspirationOneProgressSelected;
      const isAspirationTwoInvalid = !this.exitForm.progressMade.aspirationTwoProgressSelected;
      
      // Check if the third aspiration exists. If it doesn't, don't validate it.
      const isAspirationThreeInvalid = this.exitForm.aspiration3 && !this.exitForm.progressMade.aspirationThreeProgressSelected;

      // The form is invalid if the first two are invalid or if the third one is invalid when it exists.
      return isAspirationOneInvalid || isAspirationTwoInvalid || isAspirationThreeInvalid;
    },
    isAspirationConnectionInvalid() {
      const isAspirationOneConnectionInvalid = !this.exitForm.progressMade.aspirationOneExperienceConnectionSelected;
      const isAspirationTwoConnectionInvalid = !this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected;

      const isAspirationThreeConnectionInvalid = this.exitForm.aspiration3 && !this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected;

      return isAspirationOneConnectionInvalid || isAspirationTwoConnectionInvalid || isAspirationThreeConnectionInvalid;
    },
    isGoalProgressInvalid() {
      const goalProgressProperties = this.existingGoals.map((_, index) => {
        const goalNumber = (index + 1).toString();
        const suffix = goalNumber === '1' ? 'One'
                      : goalNumber === '2' ? 'Two'
                      : goalNumber === '3' ? 'Three'
                      : goalNumber === '4' ? 'Four'
                      : 'Five';
        return `goal${suffix}ProgressSelected`;
      });

      return goalProgressProperties.some(progressProperty => {
        return !this.exitForm.progressMade[progressProperty];
      });
    },
    isGoalConnectionInvalid() {
      const goalConnectionProperties = this.existingGoals.map((_, index) => {
        const goalNumber = (index + 1).toString();
        const suffix = goalNumber === '1' ? 'One'
                      : goalNumber === '2' ? 'Two'
                      : goalNumber === '3' ? 'Three'
                      : goalNumber === '4' ? 'Four'
                      : 'Five';
        return `goal${suffix}ExperienceConnectionSelected`;
      });

      return goalConnectionProperties.some(connectionProperty => {
        return !this.exitForm.progressMade[connectionProperty];
      });
    },
    goalIssuesRules() {
      return [
        () => this.exitForm.goalIssues.goals.some(goal => goal.checked) || 'At least one must be selected.'
      ];
    },
    goalIssuesErrorMessage() {
      const ruleResult = this.goalIssuesRules[0]();
      if (this.formSubmitted && typeof ruleResult === 'string') {
        return ruleResult;
      }
      return '';
    },
    isGoalIssuesInvalid() {
      return this.goalIssuesErrorMessage.length > 0;
    },
    isGoalActivityProgressInvalid() {
      // Generate an array of contribution property names based on existing goals
      const goalContributionProperties = this.existingGoals.map((_, index) => {
        const goalNumber = index + 1;
        const suffix = goalNumber === 1 ? 'One'
                      : goalNumber === 2 ? 'Two'
                      : goalNumber === 3 ? 'Three'
                      : goalNumber === 4 ? 'Four'
                      : 'Five';
        return `goal${suffix}Contributions`;
      });

      return this.exitForm.experienceActivities.some(activity => {
        const activityID = activity.activityID;
        
        // Check if the activity contributes to any of the active goals or "None"
        const isAnyChecked = goalContributionProperties.some(prop => 
          this.exitForm.activitiesContribution[prop].includes(activityID)
        ) || this.exitForm.activitiesContribution.noContributions.includes(activityID);
        
        // If no checkboxes are checked for the activity, return true (invalid)
        return !isAnyChecked;
      });
    },
    isGoalActivityProgressMobileInvalid() {
      let validity = {};
      this.exitForm.experienceActivities.forEach(activity => {
        const activityID = activity.activityID;
        const isAnyChecked = [
          this.exitForm.activitiesContribution.goalOneContributions,
          this.exitForm.activitiesContribution.goalTwoContributions,
          this.exitForm.activitiesContribution.goalThreeContributions,
          this.exitForm.activitiesContribution.goalFourContributions,
          this.exitForm.activitiesContribution.goalFiveContributions,
          this.exitForm.activitiesContribution.noContributions
        ].some(contributions => contributions.includes(activityID));

        // Set the validity for each activity
        validity[activityID] = isAnyChecked;
      });
      return validity;
    },
    isGoalActivityProgressMobileInvalidTitle() {
      // Check if any activity is invalid
      return Object.values(this.isGoalActivityProgressMobileInvalid).includes(false);
    },
    isExperienceContributionGradProfInvalid() {
      return !this.exitForm.experienceContributions || this.exitForm.experienceContributions.trim() === '';
    },
    isLikelihoodInvalid() {
      return !this.exitForm.likelihoodOf.enrollAnotherCourseSelected || !this.exitForm.likelihoodOf.completeMinorSelected || !this.exitForm.likelihoodOf.recommendCourseSelected || !this.exitForm.likelihoodOf.pursueCareerSelected;
    },
    isGrowthProblemSolvingInvalid() {
      return !this.exitForm.generalGrowth.problemSolving;
    },
    isGrowthEffCommInvalid() {
      return !this.exitForm.generalGrowth.effectiveCommunication;
    },
    isGrowthTeamworkInvalid() {
      return !this.exitForm.generalGrowth.teamwork;
    },
    isGrowthCulHumInvalid() {
      return !this.exitForm.generalGrowth.culturalHumility;
    },
    isGrowthEthicsInvalid() {
      return !this.exitForm.generalGrowth.ethicalDecisionMaking;
    },
    isGrowthProfResInvalid() {
      return !this.exitForm.generalGrowth.professionalResponsibility;
    },
    isBiggestLessonsInvalid() {
      return !this.exitForm.openEnded.biggestLessons;
    },
    isSupportOthersInvalid() {
      return !this.exitForm.openEnded.supportOthers;
    },
    existingGoals() {
      // Filter out empty, null, or undefined goals
      return [
        this.exitForm.goal1, 
        this.exitForm.goal2, 
        this.exitForm.goal3, 
        this.exitForm.goal4, 
        this.exitForm.goal5
      ].filter(goal => goal);
    },
  },
  async created() {
  // this.specificIDs = await this.fetchSpecificExperienceIDs();
},
  methods: {
  async fetchSpecificExperienceIDs() {
    try {
      const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/currentSemesterDataSocietyExperiences/`;
      const response = await fetch(apiURL);
      const data = await response.json();
      return data.map(experience => experience._id);
    } catch (error) {
      this.handleError("Error fetching specific experience IDs:", error);
      return [];
    }
  },

  updateContribution(activityId, goal, checked) {
  if (goal === 'noContributions') {
    let newActivitiesContribution = { ...this.exitForm.activitiesContribution };

    if (checked) {
      // Clear the activityId from all other goals
      ['goalOneContributions', 'goalTwoContributions', 'goalThreeContributions', 
      'goalFourContributions', 'goalFiveContributions'].forEach(g => {
        newActivitiesContribution[g] = newActivitiesContribution[g].filter(id => id !== activityId);
      });
    } else {
      // Remove the activityId from 'noContributions' if it's present
      newActivitiesContribution['noContributions'] = newActivitiesContribution['noContributions'].filter(id => id !== activityId);
    }

    // Assign the new object to ensure Vue tracks the update
    this.exitForm.activitiesContribution = newActivitiesContribution;
  }
},

    fetchExperienceData() {
      const experienceID = this.$route.params.id;
      const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/experience/${experienceID}`;

      axios.get(apiURL)
        .then((response) => {
          this.exitForm.experience = response.data;
          if (this.exitForm.experience.experienceCategory === 'Data & Society') {
            this.dataAndSociety = true;
          };
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    fetchExperienceActivities() {
      const experienceID = this.$route.params.id;
      const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/experience/${experienceID}/activities`;

      axios.get(apiURL)
        .then((resp) => {
          // Update experience activities
          this.exitForm.experienceActivities = resp.data.map((activity) => ({
            activityID: activity._id,
            activityName: activity.activityName
          }));
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    fetchGoalSettingFormData() {
      const user = useLoggedInUserStore();
      const token = user.token;
      const experienceID = this.$route.params.id; // Use experienceID from route params

      const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goalForm/${experienceID}`;

      axios.get(apiURL, { headers: { token } })
        .then((resp) => {
          this.goalFormExists = resp.data.goalFormExists;

          if (this.goalFormExists) {
            const goalFormData = resp.data.goalForm;

            // Set the goal setting form ID
            this.exitForm.goalSettingFormID = resp.data._id;

            // Update aspirations
            this.exitForm.aspiration1 = goalFormData.aspirations?.aspirationOne;
            this.exitForm.aspiration2 = goalFormData.aspirations?.aspirationTwo;
            this.exitForm.aspiration3 = goalFormData.aspirations?.aspirationThree;
            // Update goals
            this.exitForm.goal1 = goalFormData.goals?.goalOne;
            this.exitForm.goal2 = goalFormData.goals?.goalTwo;
            this.exitForm.goal3 = goalFormData.goals?.goalThree;
            this.exitForm.goal4 = goalFormData.goals?.goalFour;
            this.exitForm.goal5 = goalFormData.goals?.goalFive;
          }
        })
        .catch((error) => {
          this.handleError(error);
        });
    },

    async fetchSemester() {
      const user = useLoggedInUserStore();
      let token = user.token;
      let apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/goalForms/semester";

      try {
        const response = await axios.get(apiURL, { headers: { token } });
        this.exitForm.semester = response.data.semesterName;
      } catch (error) {
        this.handleError(error);
      }
    },
    async handleSubmitForm() {
      this.formSubmitted = true;
      const validationResponse = await this.$refs.exitForm.validate();
      if (validationResponse.valid) {
        // return;
        const user = useLoggedInUserStore();
        const token = user.token;
        const apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/exitForms/";

        const exitFormData = {
          semester: this.exitForm.semester,
          experienceID: this.exitForm.experience._id,
          goalSettingFormID: this.exitForm.goalSettingFormID,
          exitForm: {
            progressMade: {
              aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected || "No aspiration",
              aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected || "No aspiration",
              aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected || "No aspiration",
              aspirationOneExperienceConnection:this.exitForm.progressMade.aspirationOneExperienceConnectionSelected || "No aspiration",
              aspirationTwoExperienceConnection:this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected || "No aspiration",
              aspirationThreeExperienceConnection:this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected || "No aspiration",
              goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected || "No goal",
              goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected || "No goal",
              goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected || "No goal",
              goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected || "No goal",
              goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected || "No goal",
              goalOneExperienceConnection:this.exitForm.progressMade.goalOneExperienceConnectionSelected || "No goal",
              goalTwoExperienceConnection:this.exitForm.progressMade.goalTwoExperienceConnectionSelected || "No goal",
              goalThreeExperienceConnection:this.exitForm.progressMade.goalThreeExperienceConnectionSelected || "No goal",
              goalFourExperienceConnection:this.exitForm.progressMade.goalFourExperienceConnectionSelected || "No goal",
              goalFiveExperienceConnection:this.exitForm.progressMade.goalFiveExperienceConnectionSelected || "No goal",
            },
            goalIssues: {
              goals: this.exitForm.goalIssues.goals.filter(goal => goal.checked).map(goal => goal.label),
              issuesDescription: this.exitForm.goalIssues.issuesDescription
          },
            activitiesContribution: {
              goalOneContributions: this.exitForm.activitiesContribution.goalOneContributions,
              goalTwoContributions: this.exitForm.activitiesContribution.goalTwoContributions,
              goalThreeContributions: this.exitForm.activitiesContribution.goalThreeContributions,
              goalFourContributions: this.exitForm.activitiesContribution.goalFourContributions,
              goalFiveContributions: this.exitForm.activitiesContribution.goalFiveContributions,
              noContributions:this.exitForm.activitiesContribution.noContributions,
            },
            experienceContributions: this.exitForm.experienceContributions,
            likelihoodOf: {
              enrollAnotherCourse: this.exitForm.likelihoodOf.enrollAnotherCourseSelected,
              completeMinor: this.exitForm.likelihoodOf.completeMinorSelected,
              recommendCourse: this.exitForm.likelihoodOf.recommendCourseSelected,
              pursueCareer: this.exitForm.likelihoodOf.pursueCareerSelected,
          },
            generalGrowth: {
              problemSolving: this.exitForm.generalGrowth.problemSolving,
              effectiveCommunication: this.exitForm.generalGrowth.effectiveCommunication,
              teamwork: this.exitForm.generalGrowth.teamwork,
              culturalHumility: this.exitForm.generalGrowth.culturalHumility,
              ethicalDecisionMaking: this.exitForm.generalGrowth.ethicalDecisionMaking,
              professionalResponsibility: this.exitForm.generalGrowth.professionalResponsibility
            },
            openEnded: {
              biggestLessons: this.exitForm.openEnded.biggestLessons,
              supportOthers: this.exitForm.openEnded.supportOthers,
              comments: this.exitForm.openEnded.comments
            }
          }
        };

        try {
          await axios.post(apiURL, exitFormData, {
            headers: { token }
          });
          this.$router.push({ 
              name: 'exitFormsAvailable',
              params: {
                toastType: 'success',
                toastMessage: 'Exit Form Submitted!',
                toastPosition: 'top-right',
                toastCSS: 'Toastify__toast--create'
            }
          });
        } catch (error) {
          this.handleError(error);
        }
      } else {
        toast.error(this.$t("Oops! Error(s) detected. Please review and try again."), {
            position: 'top-right',
            toastClassName: 'Toastify__toast--delete',
            limit: 1
          });
      };
    },
    handleNoneSelected() {
      if (this.exitForm.goalIssues.goals[5].checked) {
        this.exitForm.goalIssues.goals.forEach((goal, index) => {
          if (index !== 5) {
            goal.checked = false;
          }
        })
      }
    },
    validateGoalActivityProgress(activity) {
      // Check if at least one checkbox is selected for the activity
      const activityID = activity.activityID;
      const isAnyChecked = Object.values(this.exitForm.activitiesContribution).some(contributions => 
        contributions.includes(activityID)
      );
      return isAnyChecked || 'At least one checkbox must be selected for each activity.';
    },
  }
};
</script>

<style>
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 20px;
}

th {
  font-weight: normal;
}

th:first-child,
td:first-child {
  text-align: left;
}

th:not(:first-child),
td:not(:first-child) {
  text-align: center;
}

.radio-button {
  outline: 1px solid #808080;
}

tbody tr:nth-child(even) {
  background-color: #f1f1f1; /* Light gray shade for even rows */
  border-bottom: 1px solid #f1f1f1; /* Matching border color */
}

tbody tr:nth-child(odd) {
  background-color: #f7f7f7; /* Slightly lighter gray shade for odd rows */
  border-bottom: 1px solid #f7f7f7; /* Matching border color */
}

</style>
