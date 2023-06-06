<template>
    <v-container>
      <p class="font-weight-black text-h3 text--primary">Exit Form</p>
      <p class="font-weight-black text-h5 text--primary">Experience Selection + General</p>
      <p class="text-subtitle-1">Please confirm the following information is accurate. If any changes need to be made, type them below.</p>
    </v-container>
      <div style="padding: 10px;">
      <input type="checkbox" v-model="firstNameChecked" style="outline: 2px solid gray; margin-right: 10px;">
      <span style="color: gray;">First Name</span><br>
      <input v-if="firstNameChecked" type="text" placeholder="First Name" style="margin-top: 10px;">
      </div>
      <div style="padding: 10px;">
      <input type="checkbox" v-model="lastNameChecked" style="outline: 2px solid gray; margin-right: 10px;">
      <span style="color: gray;">Last Name</span><br>
      <input v-if="lastNameChecked" type="text" placeholder="Last Name" style="margin-top: 10px;">
      </div>
      <div style="padding: 10px;">
      <input type="checkbox" v-model="emailChecked" style="outline: 2px solid gray; margin-right: 10px;">
      <span style="color: gray;">Preferred Email</span><br>
      <input v-if="emailChecked" type="text" placeholder="Preferred Email" style="margin-top: 10px;">
      </div>
      <div style="padding: 10px;">
      <input type="checkbox" v-model="psidChecked" style="outline: 2px solid gray; margin-right: 10px;">
      <span style="color: gray;">PeopleSoft ID</span><br>
      <input v-if="psidChecked" type="text" placeholder="PeopleSoft ID" style="margin-top: 10px;">
      </div>
  <v-container>
    <v-toolbar>
      <v-toolbar-title class="mr-4">Semester of Experience</v-toolbar-title>
    </v-toolbar>
    <v-select
      v-model="selectedSemester"
      :items="semesterOptions"
      label="Select a semester"
      placeholder="Choose a semester"
    ></v-select>
  </v-container>
  <v-container>
    <v-toolbar>
      <v-toolbar-title class="mr-4">Which experience did you set goals for at the start of the semester? </v-toolbar-title>
    </v-toolbar>
    <v-select
      v-model="selectedExperiance"
      :items="experianceOptions"
      label="Select an expiriance"
      placeholder="Choose an expiriance"
    ></v-select>
  </v-container>


  <!-- PROGRESS BLOCK -->


  <v-container>
      <p class="font-weight-black text-h5 text--primary">Progress Block</p>
      <p class="text-subtitle-1">At the beginning of the semester,  we asked you to share two to three aspirations. Now we would like to know whether you feel you made progress towards these aspirations. Below is a list of your aspirations from the beginning of the semester.</p>
    </v-container>
    <v-container>
    <h2>Aspirations</h2>
    <v-list>
      <v-list-item
        v-for="(Aspirations, index) in Aspirations"
        :key="index"
      >
        <v-list-item-title>{{ Aspirations.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
  <v-container>
      <p class="text-subtitle-1">For each aspiration listed above, please pick the option that best describes the progress you made.</p>
    </v-container>
    <v-container>
      <h2>Aspirations</h2>
      <v-list>
        <v-list-item
          v-for="(Aspirations, index) in Aspirations"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>{{ Aspirations.title }}</v-list-item-title>
            <v-radio-group v-model="Aspirations.progress" row>
              <v-radio label="I made lots of progress towards this aspiration (1)" value="1"></v-radio>
              <v-radio label="I made some progress towards this aspiration (2)" value="2"></v-radio>
              <v-radio label="I made little progress towards this aspiration (3)" value="3"></v-radio>
              <v-radio label="I did not make progress towards this aspiration (5)" value="4"></v-radio>
              <v-radio label="No aspiration listed (6)" value="5"></v-radio>
            </v-radio-group>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
    <v-container>
        <p class="text-subtitle-1">For each goal listed above, please pick the option that best describes the connection between your progress and this course.</p>
        </v-container>
        <v-container>
      <h2>Aspirations</h2>
      <v-list>
        <v-list-item
          v-for="(Aspirations, index) in Aspirations"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>{{ Aspirations.title }}</v-list-item-title>
            <v-radio-group v-model="Aspirations.progressConnection" row>
              <v-radio label="The progress I made towards this aspiration was largely due to this course (1)" value="1"></v-radio>
              <v-radio label="The progress I made towards this aspiration was partly due to this course (2)" value="2"></v-radio>
              <v-radio label="The progress I made towards this aspiration was not due to this course (3)" value="3"></v-radio>
              <v-radio label="No aspiration listed (6)" value="4"></v-radio>
            </v-radio-group>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
    <v-container>
      <p class="text-subtitle-1">At the beginning of the semester,  we asked you to share three to five goals for your participation in this course. Now we would like to know whether you feel you made progress towards these goals and which activities from the course contributed to your progress. Below is a list of your goals from the beginning of the semester.</p>
    </v-container>
    <v-container>
    <h2>Goals</h2>
    <v-list>
      <v-list-item
        v-for="(goals, index) in goals"
        :key="index"
      >
        <v-list-item-title>{{ goals.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
  <v-container>
      <p class="text-subtitle-1">For each goal listed above, please pick the option that best describes the progress you made.</p>
    </v-container>
    <v-container>
      <h2>Goals</h2>
      <v-list>
        <v-list-item
          v-for="(goals, index) in goals"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>{{ goals.title }}</v-list-item-title>
            <v-radio-group v-model="goals.progress" row>
              <v-radio label="I made lots of progress towards this goal (1)" value="1"></v-radio>
              <v-radio label="I made some progress towards this goal (2)" value="2"></v-radio>
              <v-radio label="I made little progress towards this goal (3)" value="3"></v-radio>
              <v-radio label="I did not make progress towards this goal (5)" value="4"></v-radio>
              <v-radio label="No goal listed (6)" value="5"></v-radio>
            </v-radio-group>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
    <v-container>
        <p class="text-subtitle-1">For each goal listed above, please pick the option that best describes the connection between your progress and this course.</p>
        </v-container>
        <v-container>
      <h2>Aspirations</h2>
      <v-list>
        <v-list-item
          v-for="(goals, index) in goals"
          :key="index"
        >
          <v-list-item-content>
            <v-list-item-title>{{ goals.title }}</v-list-item-title>
            <v-radio-group v-model="goals.progressConnection" row>
              <v-radio label="The progress I made towards this goal was largely due to this course (1)" value="1"></v-radio>
              <v-radio label="The progress I made towards this goal was partly due to this course (2)" value="2"></v-radio>
              <v-radio label="The progress I made towards this goal was not due to this course (3)" value="3"></v-radio>
              <v-radio label="No goal listed (6)" value="4"></v-radio>
            </v-radio-group>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
    <v-container>
      <h2>Please select which goal(s) you faced barriers to achieving this semester:</h2>
      <v-checkbox
        v-for="(goal, index) in goals"
        :key="index"
        v-model="goal.barrier"
        :label="goal.title"
      ></v-checkbox>
    </v-container>
    <v-container>
      <h2>For one of the goals you selected above, please describe what those barriers were and what strategies you employed to overcome those barriers in 3-4 sentences:</h2>
      <v-textarea
        label="Enter your response here"
        rows="5"
        max-height="200"
        :counter="300"
      ></v-textarea>
    </v-container>

    <!-- HON 3350 Goals -->

    <v-container>
        <p class="font-weight-black text-h5 text--primary">HON 3350 Goals </p>
      <h2>Below is a list of your goals from the beginning of the semester:</h2>
      <v-list>
        <v-list-item v-for="(goal, index) in goals" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ goal.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ goal.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>

    <v-container>
    <h2>For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".</h2>
    <v-divider></v-divider>
    <v-list>
      <v-subheader>Activities</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group>
        <v-list-item v-for="(activity, index) in activities" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ activity.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.content }}
            </v-list-item-subtitle>
            <v-checkbox v-model="activity.checkedGoals" :label="goal.title" v-for="(goal, i) in goals" :key="i" :value="goal.title" hide-details></v-checkbox>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>


  <v-container>
        <p class="font-weight-black text-h5 text--primary">HON 3397: American Crime Story Goals</p>
      <h2>Below is a list of your goals from the beginning of the semester:</h2>
      <v-list>
        <v-list-item v-for="(goal, index) in goals" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ goal.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ goal.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  <v-container>
    <h2>For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".</h2>
    <v-divider></v-divider>
    <v-list>
      <v-subheader>Activities</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group>
        <v-list-item v-for="(activity, index) in activities2" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ activity.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.content }}
            </v-list-item-subtitle>
            <v-checkbox v-model="activity.checkedGoals" :label="goal.title" v-for="(goal, i) in goals" :key="i" :value="goal.title" hide-details></v-checkbox>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>


  <v-container>
        <p class="font-weight-black text-h5 text--primary">HON 4350 Goals</p>
      <h2>Below is a list of your goals from the beginning of the semester:</h2>
      <v-list>
        <v-list-item v-for="(goal, index) in goals" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ goal.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ goal.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  <v-container>
    <h2>For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".</h2>
    <v-divider></v-divider>
    <v-list>
      <v-subheader>Activities</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group>
        <v-list-item v-for="(activity, index) in activities3" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ activity.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.content }}
            </v-list-item-subtitle>
            <v-checkbox v-model="activity.checkedGoals" :label="goal.title" v-for="(goal, i) in goals" :key="i" :value="goal.title" hide-details></v-checkbox>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>


  <v-container>
        <p class="font-weight-black text-h5 text--primary">CHW Certification Goals</p>
      <h2>Below is a list of your goals from the beginning of the semester:</h2>
      <v-list>
        <v-list-item v-for="(goal, index) in goals" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ goal.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ goal.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  <v-container>
    <h2>For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".</h2>
    <v-divider></v-divider>
    <v-list>
      <v-subheader>Activities</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group>
        <v-list-item v-for="(activity, index) in activities4" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ activity.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.content }}
            </v-list-item-subtitle>
            <v-checkbox v-model="activity.checkedGoals" :label="goal.title" v-for="(goal, i) in goals" :key="i" :value="goal.title" hide-details></v-checkbox>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>


  <v-container>
        <p class="font-weight-black text-h5 text--primary">HON 4355 Goals</p>
      <h2>Below is a list of your goals from the beginning of the semester:</h2>
      <v-list>
        <v-list-item v-for="(goal, index) in goals" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ goal.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ goal.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  <v-container>
    <h2>For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".</h2>
    <v-divider></v-divider>
    <v-list>
      <v-subheader>Activities</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group>
        <v-list-item v-for="(activity, index) in activities5" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ activity.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.content }}
            </v-list-item-subtitle>
            <v-checkbox v-model="activity.checkedGoals" :label="goal.title" v-for="(goal, i) in goals" :key="i" :value="goal.title" hide-details></v-checkbox>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>


  <v-container>
        <p class="font-weight-black text-h5 text--primary">Internship</p>
      <h2>Below is a list of your goals from the beginning of the semester:</h2>
      <v-list>
        <v-list-item v-for="(goal, index) in goals" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ goal.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ goal.content }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  <v-container>
    <h2>For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals".</h2>
    <v-divider></v-divider>
    <v-list>
      <v-subheader>Activities</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group>
        <v-list-item v-for="(activity, index) in activities6" :key="index">
          <v-list-item-content>
            <v-list-item-title>
              {{ activity.title }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ activity.content }}
            </v-list-item-subtitle>
            <v-checkbox v-model="activity.checkedGoals" :label="goal.title" v-for="(goal, i) in goals" :key="i" :value="goal.title" hide-details></v-checkbox>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>

  <v-container>
        <p class="font-weight-black text-h5 text--primary">Net Promoter / General Feedback</p>
    </v-container>
  <v-container>
    <v-row>
      <v-col>
        <h3>How did this experience contribute to your graduate/professional goals?</h3>
        <v-text-field v-model="contribution" label="Contribution"></v-text-field>
      </v-col>
    </v-row>
  </v-container>


  <v-container>
    <h3>Use the scale provided to rate your likelihood of taking the actions listed</h3>
    <v-card>
      <v-card-text>
        <div v-for="(action, index) in actions" :key="index">
          <h4>{{ action.title }}</h4>
          <v-radio-group v-model="action.rating" row>
            <v-radio label="Extremely likely (1)" value="1"></v-radio>
            <v-radio label="Somewhat likely (3)" value="2"></v-radio>
            <v-radio label="Neither likely/unlikely (4)" value="3"></v-radio>
            <v-radio label="Somewhat unlikely (5)" value="4"></v-radio>
            <v-radio label="Extremely unlikely (6)" value="5"></v-radio>
          </v-radio-group>
        </div>
      </v-card-text>
    </v-card>
  </v-container>



  <v-container>
        <p class="font-weight-black text-h5 text--primary">Growth</p>
    </v-container>
  <v-container>
    <p>Q15 Please indicate how much growth you experienced during your program in the area of problem solving.</p>
    <v-radio-group  v-model="problemSolvingGrowth">
      <v-radio label="No growth" value="1" ></v-radio>
      <v-radio label="A little growth" value="2"></v-radio>
      <v-radio label="A moderate amount of growth" value="3"></v-radio>
      <v-radio label="A lot of growth" value="4"></v-radio>
    </v-radio-group>
    
    <p>Q16 Please indicate how much growth you experienced during your program in the area of effective communication.</p>
    <v-radio-group  v-model="problemSolvingGrowth">
      <v-radio label="No growth" value="1" ></v-radio>
      <v-radio label="A little growth" value="2"></v-radio>
      <v-radio label="A moderate amount of growth" value="3"></v-radio>
      <v-radio label="A lot of growth" value="4"></v-radio>
    </v-radio-group>
    
    <p>Q17 Please indicate how much growth you experienced during your program in the area of teamwork.</p>
    <v-radio-group  v-model="problemSolvingGrowth">
      <v-radio label="No growth" value="1" ></v-radio>
      <v-radio label="A little growth" value="2"></v-radio>
      <v-radio label="A moderate amount of growth" value="3"></v-radio>
      <v-radio label="A lot of growth" value="4"></v-radio>
    </v-radio-group>
    
    <p>Q18 Please indicate how much growth you experienced during your program in the area of cultural humility.</p>
    <v-radio-group  v-model="problemSolvingGrowth">
      <v-radio label="No growth" value="1" ></v-radio>
      <v-radio label="A little growth" value="2"></v-radio>
      <v-radio label="A moderate amount of growth" value="3"></v-radio>
      <v-radio label="A lot of growth" value="4"></v-radio>
    </v-radio-group>
    
    <p>Q19 Please indicate how much growth you experienced during your program in the area of ethical decision making.</p>
    <v-radio-group  v-model="problemSolvingGrowth">
      <v-radio label="No growth" value="1" ></v-radio>
      <v-radio label="A little growth" value="2"></v-radio>
      <v-radio label="A moderate amount of growth" value="3"></v-radio>
      <v-radio label="A lot of growth" value="4"></v-radio>
    </v-radio-group>
    
    <p>Q20 Please indicate how much growth you experienced during your program in the area of professional responsibility.</p>
    <v-radio-group  v-model="problemSolvingGrowth">
      <v-radio label="No growth" value="1" ></v-radio>
      <v-radio label="A little growth" value="2"></v-radio>
      <v-radio label="A moderate amount of growth" value="3"></v-radio>
      <v-radio label="A lot of growth" value="4"></v-radio>
    </v-radio-group>
  </v-container>


  <v-container>
        <p class="font-weight-black text-h5 text--primary">Looking Forward</p>
    </v-container>


    <v-container>
    <v-row>
      <v-col>
        <h3>What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?</h3>
        <v-text-field v-model="lessons" label="lessons"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <h3>Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?</h3>
        <v-text-field v-model="engage" label="engage"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <h3>Use this space to provide any other comments or recommendations you would like to share.</h3>
        <v-text-field v-model="comments" label="comments"></v-text-field>
      </v-col>
    </v-row>
  </v-container>

</template>
  
  <script>
export default {
  data() {
    return {
        problemSolvingGrowth: null,
      communicationGrowth: null,
      teamworkGrowth: null,
      culturalHumilityGrowth: null,
      ethicalDecisionGrowth: null,
      professionalResponsibilityGrowth: null,
        actions: [
        {
          title: "Enroll in another Data & Society Course ",
          rating: null,
        },
        {
          title: "Complete the Data & Society minor ",
          rating: null,
        },
        {
          title: "Recommend this course to a friend ",
          rating: null,
        },
        {
          title: "Pursue a career in Data Science ",
          rating: null,
        },
      ],
        contribution: "",
        lessons: "",
        engage: "",
        comments: "",
      firstNameChecked: false,
      lastNameChecked: false,
      emailChecked: false,
      psidChecked: false,
      selectedSemester: 'Choose a semester',
      semesterOptions: [
        'Fall 2021',
        'Spring 2022',
        'Summer 2022',
        'Fall 2022',
        'Spring 2023',
        'Summer 2023',
        'Fall 2023',
      ],
      selectedExperiance: 'Choose an experiance',
      experianceOptions: [
        'Experiance 1',
        'Experiance 2022',
        'Experiance 2022',
        'Experiance 2022',
        'Experiance 2023',
        'Experiance 2023',
        'Experiance 2023',
      ],
      Aspirations: [
       {
          title: 'Aspirations 1',
          content: 'This is the content of Aspirations 1.',
          progress: null,
          progressConnection: null,
        },
        {
          title: 'Aspirations 2',
          content: 'This is the content of Aspirations 2.',
          progress: null,
          progressConnection: null,
        },
        {
          title: 'Aspirations 3',
          content: 'This is the content of Aspirations 3.',
          progress: null,
          progressConnection: null,
        },

      ],
      goals: [
       {
          title: 'Goal 1',
          content: 'This is the content of Goal 1.',
          progress: null,
          progressConnection: null,
        },
        {
          title: 'Goal 2',
          content: 'This is the content of Goal 2.',
          progress: null,
          progressConnection: null,
        },
        {
          title: 'Goal 3',
          content: 'This is the content of Goal 3.',
          progress: null,
          progressConnection: null,
        },
        {
          title: 'Goal 4',
          content: 'This is the content of Goal 3.',
          progress: null,
          progressConnection: null,
        },
      ],
      activities: [
        {
          title: 'Project 1',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Project 2',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Assignment #2: Local Foundations ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Art of Data Science Chapters ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Data Feminism ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Florence Nightingale Podcast ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Charles Gaines (Art) Readings ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Library of Babel ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Discussion Facilitation ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
      ],
      activities2: [
        {
          title: 'Mid-term Project ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Final Project ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Homeworks 1-6  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Homework 2',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Homework 3 ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Homework 4 ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Homework  5 ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Module 1: Before there was Criminology - Deviance and moral purity ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Module 2: The Born Criminal - The Science of Homo Criminalis  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Module 3: The Calculating Criminal: Tarde & Neo-Classical Criminology  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Module 4: Biologies of Crime and Criminal Bodies (27)   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Module 5: Criminal Brains  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Module 6: Criminal Spaces   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Module 7: Social Structures and Critical Studies of Crime   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
      ],
      activities3: [
        {
          title: 'Final Presentation  ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Individual Reports 1-5  ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Group Reports 1-5  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Research Questions ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Impactful Research ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Engaging with the Literature  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Datasets  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: DAGs ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Topic: Findings and Results  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        
      ],
      activities4: [
        {
          title: 'End of Semester Project   ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Bread of Life Distribution Events   ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Maternal Health/Purple Crying  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'SDoH/Logic Model  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Motivational Interviewing  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Mapping/Needs Assessment/Grants   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Cultural competency/cultural humility/implicit bias  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Program Evaluation  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Physical activity/mental health  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Presentation skills/advocacy  ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
      ],
      activities5: [
        {
          title: 'Report #1 - Project Plan    ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Class Presentation #2   ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Report #2 - Project update   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Poster   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Peer review of presentation and summary reports   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Class discussion   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Lightning talks   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'One-on-one meetings ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'weekly OneNote check ins   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Assigned reading/topic: "Principle #2 of Data Feminism is to challenge unequal power structures and work toward justice"   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Assigned reading/topic: "Big Data and the Little Bang: An Epistemological (R)evolution"    ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Assigned reading/topic: "Everyone wants to do the model work, not the data work"   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'Assigned reading/topic: "Fisher, Neyman-Pearson, or NHST? A tutorial for teaching data testing"   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'individual reading/exploring done for projects   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
      ],
      activities6: [
        {
          title: 'Individual projects within DPP     ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'Individual projects within Data analysis  ',
          content: 'This is the content of Activity.',
          checkedGoals: [],
        },
        {
          title: 'CHW care coordination training   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'CHW feedback loop meetings    ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
        {
          title: 'CHW shadowing   ',
          content: 'This is the content of Activity .',
          checkedGoals: [],
        },
      ],
    };
  },
};
</script>