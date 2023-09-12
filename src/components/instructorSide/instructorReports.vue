<!-- '/instructorReports' -->
<template>
  <div>
    <br>
    <v-btn @click="downloadEntryDataAsCSV">Download Student Entry Forms as CSV</v-btn>
    <br>
    <br>
    <v-btn @click="downloadAllGoalDataAsCSV">Download Student Goal Setting Forms as CSV for <b>All</b> Semesters</v-btn>
    <br>
    <br>
    <v-btn @click="downloadAllExitDataAsCSV">Download Student Exit Forms as CSV for <b>All</b> Semesters</v-btn>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoggedInUserStore } from "@/stored/loggedInUser";

export default {
  data(){
    return{
    queryData:[],
    }
  },
  mounted(){
    const user = useLoggedInUserStore()
    let token = user.token
    let apiURL = import.meta.env.VITE_ROOT_API + `/studentSideData/getExperienceCount/`;
    this.queryData = [];
    axios.get(apiURL,{
        headers: { token },
      }).then((resp) => {
      this.queryData = resp.data;
    });
  },
  methods: {
    async downloadEntryDataAsCSV() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        // Fetch JSON data from the API endpoint
        const response = await axios.get(import.meta.env.VITE_ROOT_API +'/studentSideData/studentInformation/all', { headers: { token } });
        const jsonData = response.data.data;

        // Convert JSON to CSV format
        const csvData = this.convertEntryFormToCSV(jsonData);

        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading data:', error);
      }
    },

    async downloadAllExitDataAsCSV() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        // Fetch JSON data from the API endpoint
        const response = await axios.get(import.meta.env.VITE_ROOT_API +'/studentSideData/exitForms/all', { headers: { token } });
        const jsonData = response.data;

        // Convert JSON to CSV format
        const csvData = this.convertExitFormToCSV(jsonData);

        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading data:', error);
      }
    },

    async downloadAllGoalDataAsCSV() {
      try {
        const user = useLoggedInUserStore();
        let token = user.token;
        // Fetch JSON data from the API endpoint
        const response = await axios.get(import.meta.env.VITE_ROOT_API +'/studentSideData/goalForms/all/', { headers: { token } });
        const jsonData = response.data;

        // Convert JSON to CSV format
        const csvData = this.convertGoalSettingFormToCSV(jsonData);

        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading data:', error);
      }
    },

    convertGoalSettingFormToCSV(jsonData) {
  // Create the CSV header row
  const header = this.getCSVHeader(jsonData[0]);
  const headerRow = header.join(',');

  // Add an extra row with custom text for Aspiration 1 and Aspiration 2
  const customText1 = 'Current Semester';
  const customText2 = 'Which experience are you filling out this form for';
  const customText3 = 'What kind of community engagement experiences, if any, have you had? Check all that apply.';
  const customText4 = 'What kind of community engagement experiences, if any, have you had? Check all that apply. - other - Text';
  const customText5 = 'From your previous community engagement experiences, which of the following activities have you engaged in?';
  const customText6 = 'From your previous community engagement experiences, which of the following activities have you engaged in? - Other - Text';
  const customText7 = 'What, if any, tools have you used for community engagement activities?';
  const customText8 = 'What, if any, tools have you used for community engagement activities? - other - Text';
  const customText9 = 'What kind of research experiences, if any, have you had? Check all that apply.';
  const customText10 = 'What kind of research experiences, if any, have you had? Check all that apply. - Other - Text';
  const customText11 = 'From your previous research experiences, which of the following activities have you engaged in?';
  const customText12 = 'From your previous research experiences, which of the following activities have you engaged in? - Other - Text';
  const customText13 = 'What, if any, tools are you familiar with?';
  const customText14 = 'What, if any, tools are you familiar with? - Other - Text';
  const customText15 = 'What are your research/service interests? Check all that apply.';
  const customText16 = 'What are your research/service interests? Check all that apply - Other - Text';
  const customText17 = 'Are you interested in potentially holding a leadership position?';
  const customText18 = 'Please indicate your expectation of the growth you anticipate to see during your program in the area of problem solving.';
  const customText19 = 'Please indicate your expectation of the growth you anticipate to see during your program in the area of effective communication.';
  const customText20 = 'Please indicate your expectation of the growth you anticipate to see during your program in the area of teamwork.';
  const customText21 = 'Please indicate your expectation of the growth you anticipate to see during your program in the area of cultural humility.';
  const customText22 = 'Please indicate your expectation of the growth you anticipate to see during your program in the area of ethical decision making.';
  const customText23 = 'Please indicate your expectation of the growth you anticipate to see during your program in the area of professional responsibility.';
  const customText24 = 'Please describe 2-3 long-term aspirations you may have.';
  const customText25 = 'Please outline 3-5 goals that you have for this experience.';
  const extraRowCSV = ['"' + customText3+'","'+'","'+'","' + '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ customText4 + '","' + customText5+'","'+'","'+'","' + '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","'+ '","' +'","' + customText6 +'","' + customText7 +'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","' + customText8 +'","' + customText9 +'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","' + customText10 +'","' + customText11 +'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","' + customText12 +'","' + customText13 +'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","' + customText14 +'","' + customText15+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","'+'","' +'","' + customText16 +'","' + customText17 +'","' + customText18 +'","' + customText19 +'","' + customText20 +'","'+ customText21 +'","'+ customText22 +'","'+ customText23 +'","'+ customText24+'","'+'","' +'","'+ customText25+'","'+'","'+'","'+'","'+'","'+'","'+'","' +'","' + customText1 +'","'+'","'+'","' + customText2 +'"'];

  // Create the CSV data rows
  const dataRows = jsonData.map((item) => {
    const values = this.getCSVRowValues(item, header);
    return values.join(',');
  });

  // Combine all rows including the extra row and data rows
  const csvContent = [headerRow, ...extraRowCSV, ...dataRows].join('\n');

  return csvContent;
},

convertEntryFormToCSV(jsonData) {
  // Create the CSV header row
  const header = this.getCSVHeader(jsonData[0]);
  const headerRow = header.join(',');

  const numHeaders = header.length;

  // Create an array of empty strings with the same length as the header
  const extraRowArray = new Array(numHeaders).fill("");

  // Map fields to custom texts
  const customTextMapping = {
    "_id": '', 
    "organizationID": '',  
    "userID": '',  
    "studentInformation.cityOrigin": 'City of Origin',
    "studentInformation.primaryLanguage": 'Primary Language',
    "studentInformation.otherLanguages": 'Other Languages',
    "studentInformation.languagePreference": 'What language do you prefer to receive communication in?',
    "studentInformation.pronouns": 'What are your pronouns? Select all that apply (example, if pronouns are she/they select multiple options to reflect this).',
    "studentInformation.otherPronouns": 'What are your pronouns? Select all that apply. - Other - Text',
    "studentInformation.commentsByStaff": 'Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?',
    "studentInformation.issuesConcernsTriggers": 'Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?',
    "studentInformation.enrolledUHInfo.uhStatus": 'Are you currently enrolled in a degree program at the University of Houston?',
    "studentInformation.enrolledUHInfo.uhEmail": 'UH Email',
    "studentInformation.enrolledUHInfo.peopleSoftID": 'PeopleSoft ID',
    "studentInformation.enrolledUHInfo.expectedGraduationYear": 'Expected Graduation Year',
    "studentInformation.enrolledUHInfo.livingOnCampus": 'Do you live on or off campus?',
    "studentInformation.enrolledUHInfo.honorsCollegeStatus": 'Are you a member of the Honors College?',
    "studentInformation.enrolledUHInfo.honorsCollegeAffiliated": 'Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?',
    "studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther": 'If Other, please specify.',
    "studentInformation.enrolledUHInfo.majors": 'What is/are your current major(s)?',
    "studentInformation.enrolledUHInfo.honorsMinors": 'Are you pursuing, or planning to pursue, any of the following Honors College minors?',
    "studentInformation.enrolledUHInfo.otherMinors": 'Are you pursuing any other minors?',
    "studentInformation.hichInfo.hichStatus": 'Are you a member of Honors in Community Health (HICH)?',
    "studentInformation.hichInfo.hichHistoryStatus": 'Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?',
    "studentInformation.communityServiceInfo.serviceStatus": 'Have you had other experience with Community Service?',
    "studentInformation.communityServiceInfo.serviceHistoryDesc": 'Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.',
    "studentInformation.communityServiceInfo.serviceOrgsOutsideUH": 'Are you a member of any community organizations outside the University? Please list.',
    "studentInformation.graduateProfessionalSchool.programGradProStatus": 'Do you currently plan to pursue graduate or professional (e.g. medical, law) school?',
    "studentInformation.graduateProfessionalSchool.programGradProType": 'If you are planning to pursue graduate school, what type of program?',
    "studentInformation.graduateProfessionalSchool.phDTextbox": 'If PhD, please specify.',
    "studentInformation.graduateProfessionalSchool.masterTextbox": 'If Master\'s, please specify.',
    "studentInformation.graduateProfessionalSchool.otherTextbox": 'If Other, please specify.',
    "studentInformation.specializedDegCert.specializedDegCertStatus": 'Are you planning to pursue any other kind of specialized degree / certificate program?',
    "studentInformation.specializedDegCert.specializedDegCertType": 'If you are planning to pursue a specialized degree / certificate program, what type of program?',
  };

  // Programmatically generate keys for pronouns after the initial setup
  const pronounQuestion = 'What are your pronouns? Select all that apply.';
  const maxPronouns = 6;  // Assuming maximum of 6 pronoun options, adjust as necessary
  for (let i = 0; i < maxPronouns; i++) {
    customTextMapping[`studentInformation.pronouns.${i}.id`] = pronounQuestion;
    customTextMapping[`studentInformation.pronouns.${i}.label`] = pronounQuestion;
    customTextMapping[`studentInformation.pronouns.${i}.checked`] = pronounQuestion;
  }

  // Enhancement for programGradProType
  const programGradProQuestion = 'If you are planning to pursue graduate school, what type of program?';
  const maxGradProTypes = 8;  // Assuming maximum of 8 options, adjust as necessary
  for (let i = 0; i < maxGradProTypes; i++) {
    customTextMapping[`studentInformation.graduateProfessionalSchool.programGradProType.${i}.id`] = programGradProQuestion;
    customTextMapping[`studentInformation.graduateProfessionalSchool.programGradProType.${i}.label`] = programGradProQuestion;
    customTextMapping[`studentInformation.graduateProfessionalSchool.programGradProType.${i}.checked`] = programGradProQuestion;
  }

  // Enhancement for specializedDegCertType
  const specializedDegCertQuestion = 'If you are planning to pursue a specialized degree / certificate program, what type of program?';
  const maxDegCertTypes = 6;  // Assuming maximum of 6 options, adjust as necessary
  for (let i = 0; i < maxDegCertTypes; i++) {
    customTextMapping[`studentInformation.specializedDegCert.specializedDegCertType.${i}.id`] = specializedDegCertQuestion;
    customTextMapping[`studentInformation.specializedDegCert.specializedDegCertType.${i}.label`] = specializedDegCertQuestion;
    customTextMapping[`studentInformation.specializedDegCert.specializedDegCertType.${i}.checked`] = specializedDegCertQuestion;
  }

  // Replace the necessary indices with your custom texts
  header.forEach((field, index) => {
    if (customTextMapping[field]) {
      extraRowArray[index] = customTextMapping[field];
    }
  });

  // Join the array into a CSV row
  const extraRowCSV = extraRowArray.map(text => `"${text}"`).join(',');

  // Create the CSV data rows
  const dataRows = jsonData.map((item) => {
    const values = this.getCSVRowValues(item, header);
    return values.join(',');
  });

  // Combine all rows including the extra row and data rows
  const csvContent = [headerRow, extraRowCSV, ...dataRows].join('\n');

  return csvContent;
},








    convertExitFormToCSV(jsonData) {
  // Create the CSV header row
  const header = this.getCSVHeader(jsonData[0]);
  const headerRow = header.join(',');

  // Add an extra row with custom text for Aspiration 1 and Aspiration 2
  const customText1 = 'For each aspiration listed above, please pick the option that best describes the progress you made. - Aspiration 1';
  const customText2 = 'For each aspiration listed above, please pick the option that best describes the progress you made. - Aspiration 2';
  const customText3 = 'For each aspiration listed above, please pick the option that best describes the progress you made. - Aspiration 3';
  const customText4 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Aspiration 1';
  const customText5 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Aspiration 2';
  const customText6 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Aspiration 3';
  const customText7 = 'For each goal listed above, please pick the option that best describes the progress you made. - Goal 1';
  const customText8 = 'For each goal listed above, please pick the option that best describes the progress you made. - Goal 2';
  const customText9 = 'For each goal listed above, please pick the option that best describes the progress you made. - Goal 3';
  const customText10 = 'For each goal listed above, please pick the option that best describes the progress you made. - Goal 4';
  const customText11 = 'For each goal listed above, please pick the option that best describes the progress you made. - Goal 5';
  const customText12 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Goal 1';
  const customText13 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Goal 2';
  const customText14 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Goal 3';
  const customText15 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Goal 4';
  const customText16 = 'For each goal listed above, please pick the option that best describes the connection between your progress and this course. - Goal 5';
  const customText17 = 'For one of the goals you selected above, please describe what those barriers were and what strategies you employed to overcome those barriers in 3-4 sentences.';
  const customText18 = 'Use the scale provided to rate your likelihood of taking the actions listed - Enroll in another Data & Society Course';
  const customText19 = 'Use the scale provided to rate your likelihood of taking the actions listed - Complete the Data & Society minor';
  const customText20 = 'Use the scale provided to rate your likelihood of taking the actions listed - Recommend this course to a friend';
  const customText21 = 'Use the scale provided to rate your likelihood of taking the actions listed - Pursue a career in Data Science';
  const customText22 = 'Please indicate how much growth you experienced during your program in the area of problem solving.';
  const customText23 = 'Please indicate how much growth you experienced during your program in the area of effective communication.';
  const customText24 = 'Please indicate how much growth you experienced during your program in the area of teamwork.';
  const customText25 = 'Please indicate how much growth you experienced during your program in the area of cultural humility.';
  const customText26 = 'Please indicate how much growth you experienced during your program in the area of ethical decision making.';
  const customText27 = 'Please indicate how much growth you experienced during your program in the area of professional responsibility.';
  const customText28 = 'What are the biggest lessons and key takeaways you gained from this class and will carry with you moving forward?';
  const customText29 = 'Considering your answer to the previous question, how do you plan to engage with and support others (pay it forward)?';
  const customText30 = 'Use this space to provide any other comments or recommendations you would like to share.';
  const customText31 = 'How did this experience contribute to your graduate/professional goals?';
  const customText32 = 'Please select which goal(s) you faced barriers to achieving this semester.';
  const customText33 = 'How did this experience contribute to your graduate/professional goals?';
  const customText34 = 'For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals". - Goal 1';
  const customText35 = 'For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals". - Goal 2';
  const customText36 = 'For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals". - Goal 3';
  const customText37 = 'For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals". - Goal 4';
  const customText38 = 'For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals". - Goal 5';
  const customText39 = 'For each activity listed below, if you believe the activity helped you make progress towards your goals, check the boxes for those goals. If the activity did not contribute to any of your goals, select "no goals". - No goals';
  const extraRowCSV = ['"' + customText1 + '","' + customText2 + '","' + customText3 +'","' + customText4 +'","' + customText5 +'","' + customText6 +'","' + customText7 +'","' + customText8 +'","' + customText9 +'","' + customText10 +'","' + customText11 +'","' + customText12 +'","' + customText13 +'","' + customText14 +'","' + customText15 +'","' + customText16 +'","'  +  customText17 +'","'  +customText18 +'","' + customText19 +'","' + customText20 +'","' + customText21 +'","' + customText22 +'","' + customText23 +'","' + customText24 +'","' + customText25 +'","' + customText26 +'","' + customText27 +'","' + customText28 +'","' + customText29 +'","' + customText30 +'","' + customText31  +'","' + '","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' +'","' + customText32 + customText33 +'","' + customText34 +'","' + customText35 +'","' + customText36 +'","' + customText37 +'","' + customText38 +'","'  + customText39 +'","' + '"'];

  // Create the CSV data rows
  const dataRows = jsonData.map((item) => {
    const values = this.getCSVRowValues(item, header);
    return values.join(',');
  });

  // Combine all rows including the extra row and data rows
  const csvContent = [headerRow, ...extraRowCSV, ...dataRows].join('\n');

  return csvContent;
},



getCSVHeader() {
    // Manually ordered headers based on the document structure
    const ordered_headers = [
        "_id",
        "organizationID",
        "userID",
        "studentInformation.cityOrigin",
        "studentInformation.primaryLanguage",
        "studentInformation.otherLanguages",
        "studentInformation.languagePreference",
        "studentInformation.pronouns.0.id",
        "studentInformation.pronouns.0.label",
        "studentInformation.pronouns.0.checked",
        "studentInformation.pronouns.1.id",
        "studentInformation.pronouns.1.label",
        "studentInformation.pronouns.1.checked",
        "studentInformation.pronouns.2.id",
        "studentInformation.pronouns.2.label",
        "studentInformation.pronouns.2.checked",
        "studentInformation.pronouns.3.id",
        "studentInformation.pronouns.3.label",
        "studentInformation.pronouns.3.checked",
        "studentInformation.pronouns.4.id",
        "studentInformation.pronouns.4.label",
        "studentInformation.pronouns.4.checked",
        "studentInformation.pronouns.5.id",
        "studentInformation.pronouns.5.label",
        "studentInformation.pronouns.5.checked",
        "studentInformation.otherPronouns",
        "studentInformation.commentsByStaff",
        "studentInformation.issuesConcernsTriggers",
        "studentInformation.enrolledUHInfo.uhStatus",
        "studentInformation.enrolledUHInfo.uhEmail",
        "studentInformation.enrolledUHInfo.peopleSoftID",
        "studentInformation.enrolledUHInfo.expectedGraduationYear",
        "studentInformation.enrolledUHInfo.livingOnCampus",
        "studentInformation.enrolledUHInfo.honorsCollegeStatus",
        "studentInformation.enrolledUHInfo.honorsCollegeAffiliated",
        "studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther",
        "studentInformation.enrolledUHInfo.majors",
        "studentInformation.enrolledUHInfo.honorsMinors",
        "studentInformation.enrolledUHInfo.otherMinors",
        "studentInformation.hichInfo.hichStatus",
        "studentInformation.hichInfo.hichHistoryStatus",
        "studentInformation.communityServiceInfo.serviceStatus",
        "studentInformation.communityServiceInfo.serviceHistoryDesc",
        "studentInformation.communityServiceInfo.serviceOrgsOutsideUH",
        "studentInformation.graduateProfessionalSchool.programGradProStatus",
        "studentInformation.graduateProfessionalSchool.programGradProType.0.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.0.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.0.checked",
        "studentInformation.graduateProfessionalSchool.programGradProType.1.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.1.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.1.checked",
        "studentInformation.graduateProfessionalSchool.programGradProType.2.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.2.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.2.checked",
        "studentInformation.graduateProfessionalSchool.programGradProType.3.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.3.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.3.checked",
        "studentInformation.graduateProfessionalSchool.programGradProType.4.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.4.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.4.checked",
        "studentInformation.graduateProfessionalSchool.programGradProType.5.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.5.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.5.checked",
        "studentInformation.graduateProfessionalSchool.programGradProType.6.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.6.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.6.checked",
        "studentInformation.graduateProfessionalSchool.programGradProType.7.id",
        "studentInformation.graduateProfessionalSchool.programGradProType.7.label",
        "studentInformation.graduateProfessionalSchool.programGradProType.7.checked",
        "studentInformation.graduateProfessionalSchool.phDTextbox",
        "studentInformation.graduateProfessionalSchool.masterTextbox",
        "studentInformation.graduateProfessionalSchool.otherTextbox",
        "studentInformation.specializedDegCert.specializedDegCertStatus",
        "studentInformation.specializedDegCert.specializedDegCertType.0.id",
        "studentInformation.specializedDegCert.specializedDegCertType.0.label",
        "studentInformation.specializedDegCert.specializedDegCertType.0.checked",
        "studentInformation.specializedDegCert.specializedDegCertType.1.id",
        "studentInformation.specializedDegCert.specializedDegCertType.1.label",
        "studentInformation.specializedDegCert.specializedDegCertType.1.checked",
        "studentInformation.specializedDegCert.specializedDegCertType.2.id",
        "studentInformation.specializedDegCert.specializedDegCertType.2.label",
        "studentInformation.specializedDegCert.specializedDegCertType.2.checked",
        "studentInformation.specializedDegCert.specializedDegCertType.3.id",
        "studentInformation.specializedDegCert.specializedDegCertType.3.label",
        "studentInformation.specializedDegCert.specializedDegCertType.3.checked",
        "studentInformation.specializedDegCert.specializedDegCertType.4.id",
        "studentInformation.specializedDegCert.specializedDegCertType.4.label",
        "studentInformation.specializedDegCert.specializedDegCertType.4.checked",
        "studentInformation.specializedDegCert.specializedDegCertType.5.id",
        "studentInformation.specializedDegCert.specializedDegCertType.5.label",
        "studentInformation.specializedDegCert.specializedDegCertType.5.checked",
        "studentInformation.specializedDegCert.professionalDesignOther",
        "createdAt",
        "updatedAt",
        "__v",
    ];
    return ordered_headers;
},


getCSVRowValues(obj, header) {
  const values = [];
  
  header.forEach((field) => {
    let value = obj;

    if (field.startsWith("studentInformation.pronouns.")) {
        const pathKeys = field.split('.');
        const index = parseInt(pathKeys[pathKeys.length - 2], 10);
        const key = pathKeys[pathKeys.length - 1];

        if (obj["studentInformation"]["pronouns"][index]) {
            value = obj["studentInformation"]["pronouns"][index][key];
        } else {
            value = '';
        }
    } else if (field.startsWith("studentInformation.graduateProfessionalSchool.programGradProType.")) {
        const pathKeys = field.split('.');
        const index = parseInt(pathKeys[pathKeys.length - 2], 10);
        const key = pathKeys[pathKeys.length - 1];

        if (obj["studentInformation"]["graduateProfessionalSchool"]["programGradProType"][index]) {
            value = obj["studentInformation"]["graduateProfessionalSchool"]["programGradProType"][index][key];
        } else {
            value = '';
        }
    } else if (field.startsWith("studentInformation.specializedDegCert.specializedDegCertType.")) {
        const pathKeys = field.split('.');
        const index = parseInt(pathKeys[pathKeys.length - 2], 10);
        const key = pathKeys[pathKeys.length - 1];

        if (obj["studentInformation"]["specializedDegCert"]["specializedDegCertType"][index]) {
            value = obj["studentInformation"]["specializedDegCert"]["specializedDegCertType"][index][key];
        } else {
            value = '';
        }
    } else {
        const pathKeys = field.split('.');
        pathKeys.forEach((key, index) => {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            value = undefined;
          }
        });
    }

    // Handle arrays (for other fields if any)
    if (Array.isArray(value)) {
      value = value.join(', ');  // Join array items with commas
    } else if (value !== null && value !== undefined) {
      value = value.toString();
    }

    // Replace newlines with spaces
    if (value) {
      value = value.replace(/\r?\n|\r/g, ' ');
    } else {
      value = '';
    }

    // If the value contains double quotes, replace them with two double quotes
    if (value.includes('"')) {
      value = value.replace(/"/g, '""');
    }

    // If the value contains commas, enclose it in double quotes
    if (value.includes(',')) {
      value = `"${value}"`;
    }

    values.push(value);
  });

  return values;
},


  },
};
</script>
