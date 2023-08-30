<!-- /exitForm need to connect matrix to data actvititys x contributions-->
<template>
    <v-container>
      <p class="font-weight-black text-h5 text--primary">Exit Form</p>

    <p class="font-weight-black text-h8">Current Semester:</p>
        <v-text-field v-model="exitForm.semester"  readonly></v-text-field>
    <p class="font-weight-black text-h8">Experience:
        </p>
      
      <v-text-field v-model="exitForm.experience.experienceName"  readonly></v-text-field>

    <br>
    <p class="font-weight-black text-h8">At the beginning of the semester, we asked you to share two to three aspirations. Now we would like to know whether you feel you made progress towards these aspirations. Below is a list of your aspirations from the beginning of the semester.</p>
    <!-- make a list of aspirations from the goal setting form HERE -->
    <ul>
      <li>Aspiration 1: {{ exitForm.aspiration1 }} </li>
      <li>Aspiration 2: {{ exitForm.aspiration2 }} </li>
      <li>Aspiration 3: {{ exitForm.aspiration3 }}</li>
    </ul>
    <br>
    <p class="font-weight-black text-h8">For each aspiration listed above, please pick the option that best describes the progress you made.</p>
 <table>
  <thead>
    <tr>
      <th></th>
      <th v-for="option in exitForm.progressMade.aspirationOneProgressResults" :key="option.id">{{ option.label }}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{{ exitForm.aspiration1 }}</td>
      <td v-for="option in exitForm.progressMade.aspirationOneProgressResults" :key="option.id">
        <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.aspirationOneProgressSelected" :checked="option.checked" />
      </td>
    </tr>
    <tr>
      <td>{{ exitForm.aspiration2 }}</td>
      <td v-for="option in exitForm.progressMade.aspirationTwoProgressResults" :key="option.id">
        <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.aspirationTwoProgressSelected" :checked="option.checked" />
      </td>
    </tr>
    <tr>
      <td>{{ exitForm.aspiration3 }}</td>
      <td v-for="option in exitForm.progressMade.aspirationThreeProgressResults" :key="option.id">
        <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.aspirationThreeProgressSelected" :checked="option.checked" />
      </td>
    </tr>
  </tbody>
</table>


    <br>

    <p class="font-weight-black text-h8">For each aspiration listed above, please pick the option that best describes the connection between your progress and this course.</p>
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="option in exitForm.progressMade.aspirationOneExperienceConnection" :key="option.id">{{ option.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ exitForm.aspiration1 }}</td>
          <td v-for="option in exitForm.progressMade.aspirationOneExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.aspirationOneExperienceConnectionSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.aspiration2 }}</td>
          <td v-for="option in exitForm.progressMade.aspirationTwoExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.aspirationTwoExperienceConnectionSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.aspiration3 }}</td>
          <td v-for="option in exitForm.progressMade.aspirationThreeExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.aspirationThreeExperienceConnectionSelected" />
          </td>
        </tr>
      </tbody>
    </table>
    <br>
    <p class="font-weight-black text-h8">At the beginning of the semester, we asked you to share three to give goals for your partcipation in this course. Now we would like to know whether you feel you made progress towards these goals and which activities from the course contribued to your progress. Below is a list of your goals from the beginning of the semester.</p>
    <!-- make a list of goals from the goal setting form HERE -->
    <ul>
      <li>Goal 1: {{ exitForm.goal1 }}</li>
      <li>Goal 2: {{ exitForm.goal2 }}</li>
      <li>Goal 3: {{ exitForm.goal3 }}</li>
      <li>Goal 4: {{ exitForm.goal4 }}</li>
      <li>Goal 5: {{ exitForm.goal5 }}</li>
    </ul>
    <br>
    <p class="font-weight-black text-h8">For each goal listed above, please pick the option that best describes the progress you made.</p>
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="option in exitForm.progressMade.goalOneProgressResults" :key="option.id">{{ option.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ exitForm.goal1 }}</td>
          <td v-for="option in exitForm.progressMade.goalOneProgressResults" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalOneProgressSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal2 }}</td>
          <td v-for="option in exitForm.progressMade.goalTwoProgressResults" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalTwoProgressSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal3 }}</td>
          <td v-for="option in exitForm.progressMade.goalThreeProgressResults" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalThreeProgressSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal4 }}</td>
          <td v-for="option in exitForm.progressMade.goalFourProgressResults" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalFourProgressSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal5 }}</td>
          <td v-for="option in exitForm.progressMade.goalFiveProgressResults" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalFiveProgressSelected" />
          </td>
        </tr>
      </tbody>
    </table>

    <br>

    <p class="font-weight-black text-h8">For each goal listed above, please pick the option that best describes the connection between your progress and this course.</p>
    <table>
      <thead>
        <tr>
          <th></th>
          <th v-for="option in exitForm.progressMade.goalOneExperienceConnection" :key="option.id">{{ option.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ exitForm.goal1 }}</td>
          <td v-for="option in exitForm.progressMade.goalOneExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalOneExperienceConnectionSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal2 }}</td>
          <td v-for="option in exitForm.progressMade.goalTwoExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalTwoExperienceConnectionSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal3 }}</td>
          <td v-for="option in exitForm.progressMade.goalThreeExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalThreeExperienceConnectionSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal4 }}</td>
          <td v-for="option in exitForm.progressMade.goalFourExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalFourExperienceConnectionSelected" />
          </td>
        </tr>
        <tr>
          <td>{{ exitForm.goal5 }}</td>
          <td v-for="option in exitForm.progressMade.goalFiveExperienceConnection" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.progressMade.goalFiveExperienceConnectionSelected" />
          </td>
        </tr>
      </tbody>
    </table>
    <br>

    <p class="font-weight-black text-h8">Please select which goal(s) you faced barriers to achieving this semester.</p>
     <!-- make a list of goals from the goal setting form HERE -->
     <div v-for="goal in exitForm.goalIssues.goals" :key="goal.id">
  <label style="color: #656565;">
    <input type="checkbox" v-model="goal.checked" style="outline: 2px solid gray; margin-right: 5px;">
    {{ goal.label }}
  </label>
</div>

<br>
<p class="font-weight-black text-h8" style="margin-bottom: 2px;"> For one of the goals you selected above, please describe what those barriers were and what strategies you employed to overcomes those barriers in 3-4 sentences. </p>
<input type="text" v-model="exitForm.goalIssues.issuesDescription" style="margin-top: 5px; margin-bottom: 2px; border: none; border: 1px solid grey; padding: 5px; border-radius: 0; width: 50vw; height:10vw;">

  <br><br>
  <p class="font-weight-black text-h8">Below is a list of your goals from the beginning of the semester</p>
    <!-- make a list of goals from the goal setting form HERE -->
    <ul>
      <li>Goal 1: {{ exitForm.goal1 }}</li>
      <li>Goal 2: {{ exitForm.goal2 }}</li>
      <li>Goal 3: {{ exitForm.goal3 }}</li>
      <li>Goal 4: {{ exitForm.goal4 }}</li>
      <li>Goal 5: {{ exitForm.goal5 }}</li>
    </ul>
    <br>

    <div>
    <p class="font-weight-black text-h8">
      For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".
      <br>
    </p>

    <table>
      <thead>
        <tr>
          <th></th>
          <th>Goal 1</th>
          <th>Goal 2</th>
          <th>Goal 3</th>
          <th>Goal 4</th>
          <th>Goal 5</th>
          <th>No Goals</th>
        </tr>
      </thead>
      <tbody>
  <tr v-for="activity in exitForm.experienceActivities" :key="activity.activityID">
    <td>{{ activity.activityName }}</td>
    <td>
      <input type="checkbox" :id="`${activity.activityID}-goal1`" :name="`${activity.activityID}-goal1`" :value="activity.activityID" v-model="exitForm.activitiesContribution.goalOneContributions" @change="updateContribution(activity.activityID, 'goalOneContributions', $event.target.checked)" style="outline: 2px solid gray;" />
    </td>
    <td>
      <input type="checkbox" :id="`${activity.activityID}-goal2`" :name="`${activity.activityID}-goal2`" :value="activity.activityID"  v-model="exitForm.activitiesContribution.goalTwoContributions" @change="updateContribution(activity.activityID, 'goalTwoContributions', $event.target.checked)" style="outline: 2px solid gray;" />
    </td>
    <td>
      <input type="checkbox" :id="`${activity.activityID}-goal3`" :name="`${activity.activityID}-goal3`" :value="activity.activityID"  v-model="exitForm.activitiesContribution.goalThreeContributions" @change="updateContribution(activity.activityID, 'goalThreeContributions', $event.target.checked)" style="outline: 2px solid gray;" />
    </td>
    <td>
      <input type="checkbox" :id="`${activity.activityID}-goal4`" :name="`${activity.activityID}-goal4`" :value="activity.activityID"  v-model="exitForm.activitiesContribution.goalFourContributions" @change="updateContribution(activity.activityID, 'goalFourContributions', $event.target.checked)" style="outline: 2px solid gray;" />
    </td>
    <td>
      <input type="checkbox" :id="`${activity.activityID}-goal5`" :name="`${activity.activityID}-goal5`" :value="activity.activityID"  v-model="exitForm.activitiesContribution.goalFiveContributions" @change="updateContribution(activity.activityID, 'goalFiveContributions', $event.target.checked)" style="outline: 2px solid gray;" />
    </td>
    <td>
      <input type="checkbox" :id="`${activity.activityID}-noGoals`" :name="`${activity.activityID}-noGoals`" :value="activity.activityID" v-model="exitForm.activitiesContribution.noContributions" @change="updateContribution(activity.activityID, 'noContributions', $event.target.checked)" style="outline: 2px solid gray;" />
    </td>
  </tr>
</tbody>
    </table>
  </div>

<br>
  <p class="font-weight-black text-h8" style="margin-bottom: 2px;"> How did this experience contribute to your graduate/progessional goals?</p>
<input type="text" v-model="exitForm.experienceContributions" style="margin-top: 5px; margin-bottom: 2px; border: none; border: 1px solid grey; padding: 5px; border-radius: 0; width: 50vw; height: 10vw;">
  <br><br>
  <p v-if="isSpecificExperience" class="font-weight-black text-h8" style="margin-bottom: 2px;"> Use the scale provided to rate your likelihood of taking the actions listed</p>
  <!-- section for only data and society experiences -->
  <table v-if="isSpecificExperience">
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
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.likelihoodOf.enrollAnotherCourseSelected" />
          </td>
        </tr>
        <tr>
          <td>Complete the Data & Society minor</td>
          <td v-for="option in exitForm.likelihoodOf.completeMinor" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.likelihoodOf.completeMinorSelected" />
          </td>
        </tr>
        <tr>
          <td>Recommend this course to a friend</td>
          <td v-for="option in exitForm.likelihoodOf.recommendCourse" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.likelihoodOf.recommendCourseSelected" />
          </td>
        </tr>
        <tr>
          <td>Pursue a career in Data Science</td>
          <td v-for="option in exitForm.likelihoodOf.pursueCareer" :key="option.id">
            <input class="radio-button" type="radio" :value="option.label" v-model="exitForm.likelihoodOf.pursueCareerSelected" />
          </td>
        </tr>
      </tbody>
    </table>
  <br v-if="isSpecificExperience">
  <!-- growth section -->
  <p class="font-weight-black text-h8">Please indicate how much growth you experienced during your program in the area of <u>problem solving</u>.</p>
  <v-radio-group v-model="exitForm.generalGrowth.problemSolving">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
  <br>
  <p class="font-weight-black text-h8">Please indicate how much growth you experienced during your program in the area of <u>effective communication</u>.</p>
  <v-radio-group v-model="exitForm.generalGrowth.effectiveCommunication">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
  <br>
  <p class="font-weight-black text-h8">Please indicate how much growth you experienced during your program in the area of <u>teamwork</u>.</p>
  <v-radio-group v-model="exitForm.generalGrowth.teamwork">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
  <br>
  <p class="font-weight-black text-h8">Please indicate how much growth you experienced during your program in the area of <u>cultural humility</u>.</p>
  <v-radio-group v-model="exitForm.generalGrowth.culturalHumility">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
  <br>
  <p class="font-weight-black text-h8">Please indicate how much growth you experienced during your program in the area of <u>ethical decision making</u>.</p>
  <v-radio-group v-model="exitForm.generalGrowth.ethicalDecisionMaking">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>
  <br>
  <p class="font-weight-black text-h8">Please indicate how much growth you experienced during your program in the area of <u>professional responsibility</u>.</p>
  <v-radio-group v-model="exitForm.generalGrowth.professionalResponsibility">
    <v-radio label="No growth" value="No growth"></v-radio>
    <v-radio label="A little growth" value="A little growth"></v-radio>
    <v-radio label="A moderate amount of growth" value="A moderate amount of growth"></v-radio>
    <v-radio label="A lot of growth" value="A lot of growth"></v-radio>
  </v-radio-group>

<br>
<p class="font-weight-black text-h8" style="margin-bottom: 2px;"> What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward? </p>
<input type="text" v-model="exitForm.openEnded.biggestLessons" style="margin-top: 5px; margin-bottom: 2px; border: none; border: 1px solid grey; padding: 5px; border-radius: 0; width: 50vw; height:10vw;">

<br><br>
<p class="font-weight-black text-h8" style="margin-bottom: 2px;"> Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)? </p>
<input type="text" v-model="exitForm.openEnded.supportOthers" style="margin-top: 5px; margin-bottom: 2px; border: none; border: 1px solid grey; padding: 5px; border-radius: 0; width: 50vw; height:10vw;">

<br><br>
<p class="font-weight-black text-h8" style="margin-bottom: 2px;"> Use this space to provide any other comments or recommendations you would like to share. </p>
<input type="text" v-model="exitForm.openEnded.comments" style="margin-top: 5px; margin-bottom: 2px; border: none; border: 1px solid grey; padding: 5px; border-radius: 0; width: 50vw; height:10vw;">

  </v-container>

  <v-row>
  <v-col cols="12" md="4">
    <v-btn @click="handleSubmitForm">Submit Form</v-btn>
  </v-col>
</v-row>
</template>
  
<script>
import axios from "axios";
import { useLoggedInUserStore } from "@/stored/loggedInUser";

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
            { id: 1, label: "I made lots of progress towards this aspiration", checked: false },
            { id: 2, label: "I made some progress towards this aspiration", checked: false },
            { id: 3, label: "I made little progress towards this aspiration", checked: false },
            { id: 4, label: "I did not make progress towards this aspiration", checked: false },
            { id: 5, label: "No aspiration listed", checked: false }
          ],
          aspirationTwoProgressResults: [
            { id: 1, label: "I made lots of progress towards this aspiration", checked: false },
            { id: 2, label: "I made some progress towards this aspiration", checked: false },
            { id: 3, label: "I made little progress towards this aspiration", checked: false },
            { id: 4, label: "I did not make progress towards this aspiration", checked: false },
            { id: 5, label: "No aspiration listed", checked: false }
          ],
          aspirationThreeProgressResults: [
            { id: 1, label: "I made lots of progress towards this aspiration", checked: false },
            { id: 2, label: "I made some progress towards this aspiration", checked: false },
            { id: 3, label: "I made little progress towards this aspiration", checked: false },
            { id: 4, label: "I did not make progress towards this aspiration", checked: false },
            { id: 5, label: "No aspiration listed", checked: false }
          ],
          aspirationOneProgressSelected: "",
          aspirationTwoProgressSelected:"",
          aspirationThreeProgressSelected: "",
          aspirationOneExperienceConnection: [
            { id: 1, label: "The progress I made towards this aspiration was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this aspiration was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this aspiration was not due to this course", checked: false },
            { id: 4, label: "No aspiration listed", checked: false }
          ],
          aspirationTwoExperienceConnection: [
            { id: 1, label: "The progress I made towards this aspiration was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this aspiration was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this aspiration was not due to this course", checked: false },
            { id: 4, label: "No aspiration listed", checked: false }
          ],
          aspirationThreeExperienceConnection: [
            { id: 1, label: "The progress I made towards this aspiration was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this aspiration was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this aspiration was not due to this course", checked: false },
            { id: 4, label: "No aspiration listed", checked: false }
          ],
          aspirationOneExperienceConnectionSelected: null,
          aspirationTwoExperienceConnectionSelected: null,
          aspirationThreeExperienceConnectionSelected: null,
          goalOneProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", checked: false },
            { id: 2, label: "I made some progress towards this goal", checked: false },
            { id: 3, label: "I made little progress towards this goal", checked: false },
            { id: 4, label: "I did not make progress towards this goal", checked: false },
            { id: 5, label: "No goal listed", checked: false }
          ],
          goalTwoProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", checked: false },
            { id: 2, label: "I made some progress towards this goal", checked: false },
            { id: 3, label: "I made little progress towards this goal", checked: false },
            { id: 4, label: "I did not make progress towards this goal", checked: false },
            { id: 5, label: "No goal listed", checked: false }
          ],
          goalThreeProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", checked: false },
            { id: 2, label: "I made some progress towards this goal", checked: false },
            { id: 3, label: "I made little progress towards this goal", checked: false },
            { id: 4, label: "I did not make progress towards this goal", checked: false },
            { id: 5, label: "No goal listed", checked: false }
          ],
          goalFourProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", checked: false },
            { id: 2, label: "I made some progress towards this goal", checked: false },
            { id: 3, label: "I made little progress towards this goal", checked: false },
            { id: 4, label: "I did not make progress towards this goal", checked: false },
            { id: 5, label: "No goal listed", checked: false }
          ],
          goalFiveProgressResults: [
            { id: 1, label: "I made lots of progress towards this goal", checked: false },
            { id: 2, label: "I made some progress towards this goal", checked: false },
            { id: 3, label: "I made little progress towards this goal", checked: false },
            { id: 4, label: "I did not make progress towards this goal", checked: false },
            { id: 5, label: "No goal listed", checked: false }
          ],
          goalOneProgressSelected: null,
          goalTwoProgressSelected: null,
          goalThreeProgressSelected: null,
          goalFourProgressSelected: null,
          goalFiveProgressSelected: null,
          goalOneExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", checked: false },
            { id: 4, label: "No goal listed", checked: false }
          ],
          goalTwoExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", checked: false },
            { id: 4, label: "No goal listed", checked: false }
          ],
          goalThreeExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", checked: false },
            { id: 4, label: "No goal listed", checked: false }
          ],
          goalFourExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", checked: false },
            { id: 4, label: "No goal listed", checked: false }
          ],
          goalFiveExperienceConnection: [
            { id: 1, label: "The progress I made towards this goal was largely due to this course", checked: false },
            { id: 2, label: "The progress I made towards this goal was partly due to this course", checked: false },
            { id: 3, label: "The progress I made towards this goal was not due to this course", checked: false },
            { id: 4, label: "No goal listed", checked: false }
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
      }
    };
  },
  mounted() {
    this.fetchGoalSettingFormData(),
    this.fetchGoalFormActivities(),
    this.fetchSemester();
    this.fetchExperienceData();
    // this.fetchSpecificExperienceIDs();
    // this.isSpecificExperience(this.experience._id);
  },
  computed:{
    isSpecificExperience() {
    return this.specificIDs.includes(this.exitForm.experience._id);
  },
  },
  async created() {
  this.specificIDs = await this.fetchSpecificExperienceIDs();
},
  methods: {
  async fetchSpecificExperienceIDs() {
    try {
      const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/currentSemesterDataSocietyExperiences/`;
      const response = await fetch(apiURL);
      const data = await response.json();
      return data.map(experience => experience._id);
    } catch (error) {
      console.error("Error fetching specific experience IDs:", error);
      return [];
    }
  },

    updateContribution(activityId, goal, checked) {
  // Update specific goal contributions for the activity
  const contributions = this.exitForm.activitiesContribution[goal];
  const index = contributions.indexOf(activityId);

  if (checked && index === -1) {
    contributions.push(activityId);
  } else if (!checked && index > -1) {
    contributions.splice(index, 1);
  }

  // If all activities are checked for "No Goals," populate noContributions with activity names
  if (goal === 'noContributions' && checked) {
    const allActivitiesChecked = this.exitForm.experienceActivities.every((activity) => {
      return this.exitForm.activitiesContribution.noContributions.includes(activity.activityID);
    });

    if (allActivitiesChecked) {
      this.exitForm.activitiesContribution.noContributions = this.exitForm.experienceActivities.map((activity) => {
        return activity.activityID;
      });
    }
  }

  // Check for other goal contributions
  if (goal === 'goalOneContributions' && checked) {
    const allActivitiesChecked = this.exitForm.experienceActivities.every((activity) => {
      return this.exitForm.activitiesContribution.goalOneContributions.includes(activity.activityID);
    });

    if (allActivitiesChecked) {
      this.exitForm.activitiesContribution.goalOneContributions = this.exitForm.experienceActivities.map((activity) => {
        return activity.activityID;
      });
    }
  }

  if (goal === 'goalTwoContributions' && checked) {
    const allActivitiesChecked = this.exitForm.experienceActivities.every((activity) => {
      return this.exitForm.activitiesContribution.goalTwoContributions.includes(activity.activityID);
    });

    if (allActivitiesChecked) {
      this.exitForm.activitiesContribution.goalTwoContributions = this.exitForm.experienceActivities.map((activity) => {
        return activity.activityID;
      });
    }
  }

  if (goal === 'goalThreeContributions' && checked) {
    const allActivitiesChecked = this.exitForm.experienceActivities.every((activity) => {
      return this.exitForm.activitiesContribution.goalThreeContributions.includes(activity.activityID);
    });

    if (allActivitiesChecked) {
      this.exitForm.activitiesContribution.goalThreeContributions = this.exitForm.experienceActivities.map((activity) => {
        return activity.activityID;
      });
    }
  }

  if (goal === 'goalFourContributions' && checked) {
    const allActivitiesChecked = this.exitForm.experienceActivities.every((activity) => {
      return this.exitForm.activitiesContribution.goalFourContributions.includes(activity.activityID);
    });

    if (allActivitiesChecked) {
      this.exitForm.activitiesContribution.goalFourContributions = this.exitForm.experienceActivities.map((activity) => {
        return activity.activityID;
      });
    }
  }

  if (goal === 'goalFiveContributions' && checked) {
    const allActivitiesChecked = this.exitForm.experienceActivities.every((activity) => {
      return this.exitForm.activitiesContribution.goalFiveContributions.includes(activity.activityID);
    });

    if (allActivitiesChecked) {
      this.exitForm.activitiesContribution.goalFiveContributions = this.exitForm.experienceActivities.map((activity) => {
        return activity.activityID;
      });
    }
  }
},

    fetchExperienceData() {
      const goalFormID = this.$route.params.id;
      const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goalForm/${goalFormID}/experiencedata`;

      axios.get(apiURL)
        .then((response) => {
          this.exitForm.experience = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchGoalFormActivities() {
  const goalFormID = this.$route.params.id;
  const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goalForm/${goalFormID}/activities`;

  axios.get(apiURL)
    .then((resp) => {
      // Update experience activities
      this.exitForm.experienceActivities = resp.data.map((activity) => ({
        activityID: activity._id,
        activityName: activity.activityName
      }));
    })
    .catch((error) => {
      console.log(error);
    });
},

    fetchGoalSettingFormData() {
  const user = useLoggedInUserStore();
  const token = user.token;
  const goalFormID = this.$route.params.id;
  const apiURL = `${import.meta.env.VITE_ROOT_API}/studentSideData/goalForm/${goalFormID}`;

  axios.get(apiURL, { headers: { token } })
    .then((resp) => {
      this.exitForm.goalSettingFormID=resp.data[0]._id;

      const goalFormData = resp.data[0]?.goalForm;

      if (goalFormData) {
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

      } else {
        console.log("Goal form data not found in the response.");
      }
    })
    .catch((error) => {
      console.log(error);
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
        console.log(error);
      }
    },

    async handleSubmitForm() {
  const user = useLoggedInUserStore();
  const token = user.token;
  const apiURL = import.meta.env.VITE_ROOT_API + "/studentSideData/exitForms/";

  const exitFormData = {
    semester: this.exitForm.semester,
    experienceID: this.exitForm.experience._id,
    goalSettingFormID: this.exitForm.goalSettingFormID,
    exitForm: {
      progressMade: {
        aspirationOneProgressResults: this.exitForm.progressMade.aspirationOneProgressSelected,
      aspirationTwoProgressResults: this.exitForm.progressMade.aspirationTwoProgressSelected,
      aspirationThreeProgressResults: this.exitForm.progressMade.aspirationThreeProgressSelected,
      aspirationOneExperienceConnection:this.exitForm.progressMade.aspirationOneExperienceConnectionSelected,
      aspirationTwoExperienceConnection:this.exitForm.progressMade.aspirationTwoExperienceConnectionSelected,
      aspirationThreeExperienceConnection:this.exitForm.progressMade.aspirationThreeExperienceConnectionSelected,
        goalOneProgressResults: this.exitForm.progressMade.goalOneProgressSelected,
        goalTwoProgressResults: this.exitForm.progressMade.goalTwoProgressSelected,
        goalThreeProgressResults: this.exitForm.progressMade.goalThreeProgressSelected,
        goalFourProgressResults: this.exitForm.progressMade.goalFourProgressSelected,
        goalFiveProgressResults: this.exitForm.progressMade.goalFiveProgressSelected,
        goalOneExperienceConnection:this.exitForm.progressMade.goalOneExperienceConnectionSelected,
        goalTwoExperienceConnection:this.exitForm.progressMade.goalTwoExperienceConnectionSelected,
        goalThreeExperienceConnection:this.exitForm.progressMade.goalThreeExperienceConnectionSelected,
        goalFourExperienceConnection:this.exitForm.progressMade.goalFourExperienceConnectionSelected,
        goalFiveExperienceConnection:this.exitForm.progressMade.goalFiveExperienceConnectionSelected,
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
    const response = await axios.post(apiURL, exitFormData, {
      headers: { token }
    });
    alert("Exit form has been successfully submitted.");
    this.$router.push('/exitFormsAvailable');
  } catch (error) {
    console.log(error);
  }
}
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
