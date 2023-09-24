<!-- '/instructorDataProducts' -->
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
              const response = await axios.get(import.meta.env.VITE_ROOT_API + '/studentSideData/studentInformation/all', { headers: { token } });
              const jsonData = response.data.data;
  
              // Convert JSON to CSV format using the renamed headers
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
          console.log("Raw API Data:", jsonData);
  
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
    const originalHeader = this.getGoalFormCSVHeader(jsonData[0]);
  
    // Create the CSV data rows
    const dataRows = jsonData.map((item) => {
      const values = this.getGoalFormCSVRowValues(item, originalHeader);
      return values.join(',');
    });
  
      // Rename headers for CSV output
      const renameMap = {
          // "_id": "",
          // "organizationID": "",
          // "userID": "",
          // "semester": "",
          // "experienceName": "",
          "goalForm.communityEngagement.communityEngagementExperiences.0.checked": "ce_volunteer",
          "goalForm.communityEngagement.communityEngagementExperiences.1.checked": "ce_political",
          "goalForm.communityEngagement.communityEngagementExperiences.2.checked": "ce_faith",
          "goalForm.communityEngagement.communityEngagementExperiences.3.checked": "ce_short",
          "goalForm.communityEngagement.communityEngagementExperiences.4.checked": "ce_mission",
          "goalForm.communityEngagement.communityEngagementExperiences.5.checked": "ce_other",
          "goalForm.communityEngagement.communityEngagementExperiences.6.checked": "ce_none",
          "goalForm.communityEngagement.communityEngagementExperiencesOther": "ce_other_text_entry",
          "goalForm.communityEngagement.previousEngagementExperiences.0.checked": "ce_activities_mentoring",
          "goalForm.communityEngagement.previousEngagementExperiences.1.checked": "ce_activities_volunteering",
          "goalForm.communityEngagement.previousEngagementExperiences.2.checked": "ce_activities_recruitment",
          "goalForm.communityEngagement.previousEngagementExperiences.3.checked": "ce_activities_organizing",
          "goalForm.communityEngagement.previousEngagementExperiences.4.checked": "ce_activities_translation",
          "goalForm.communityEngagement.previousEngagementExperiences.5.checked": "ce_activities_fundraising",
          "goalForm.communityEngagement.previousEngagementExperiences.6.checked": "ce_activities_emergency",
          "goalForm.communityEngagement.previousEngagementExperiences.7.checked": "ce_activities_other",
          "goalForm.communityEngagement.previousEngagementExperiences.8.checked": "ce_activities_none",
          "goalForm.communityEngagement.previousEngagementExperiencesOther": "ce_activities_other_text_entry",
          "goalForm.communityEngagement.engagementActivitiesTools.0.checked": "ce_tools_media",
          "goalForm.communityEngagement.engagementActivitiesTools.1.checked": "ce_tools_scheduling",
          "goalForm.communityEngagement.engagementActivitiesTools.2.checked": "ce_tools_fundraising",
          "goalForm.communityEngagement.engagementActivitiesTools.3.checked": "ce_tools_survey",
          "goalForm.communityEngagement.engagementActivitiesTools.4.checked": "ce_tools_design",
          "goalForm.communityEngagement.engagementActivitiesTools.5.checked": "ce_tools_pm",
          "goalForm.communityEngagement.engagementActivitiesTools.6.checked": "ce_tools_digital",
          "goalForm.communityEngagement.engagementActivitiesTools.7.checked": "ce_tools_other",
          "goalForm.communityEngagement.engagementActivitiesTools.8.checked": "ce_tools_none",
          "goalForm.communityEngagement.engagementActivitiesToolOther": "ce_tools_other_text_entry",
          "goalForm.researchExperience.currentResearchExperience.0.checked": "re_intro",
          "goalForm.researchExperience.currentResearchExperience.1.checked": "re_adv",
          "goalForm.researchExperience.currentResearchExperience.2.checked": "re_here",
          "goalForm.researchExperience.currentResearchExperience.3.checked": "re_surf",
          "goalForm.researchExperience.currentResearchExperience.4.checked": "re_purs",
          "goalForm.researchExperience.currentResearchExperience.5.checked": "re_lab",
          "goalForm.researchExperience.currentResearchExperience.6.checked": "re_other",
          "goalForm.researchExperience.currentResearchExperience.7.checked": "re_none",
          "goalForm.researchExperience.currentResearchExperienceOther": "re_other_text_entry",
          "goalForm.researchExperience.previousResearchExperience.0.checked": "re_activities_design",
          "goalForm.researchExperience.previousResearchExperience.1.checked": "re_activities_lit",
          "goalForm.researchExperience.previousResearchExperience.2.checked": "re_activities_clinical",
          "goalForm.researchExperience.previousResearchExperience.3.checked": "re_activites_lab",
          "goalForm.researchExperience.previousResearchExperience.4.checked": "re_activities_ph",
          "goalForm.researchExperience.previousResearchExperience.5.checked": "re_activities_analysis",
          "goalForm.researchExperience.previousResearchExperience.6.checked": "re_activities_manuscript",
          "goalForm.researchExperience.previousResearchExperience.7.checked": "re_activities_other",
          "goalForm.researchExperience.previousResearchExperience.8.checked": "re_activities_none",
          "goalForm.researchExperience.previousResearchExperienceOther": "res_activities_other_text_entry",
          "goalForm.researchExperience.familiarTools.0.checked": "re_tools_excel",
          "goalForm.researchExperience.familiarTools.1.checked": "re_tools_r",
          "goalForm.researchExperience.familiarTools.2.checked": "re_tools_python",
          "goalForm.researchExperience.familiarTools.3.checked": "re_tools_stata",
          "goalForm.researchExperience.familiarTools.4.checked": "re_tools_gis",
          "goalForm.researchExperience.familiarTools.5.checked": "re_tools_atlas",
          "goalForm.researchExperience.familiarTools.6.checked": "re_tools_nvivo",
          "goalForm.researchExperience.familiarTools.7.checked": "re_tools_tableau",
          "goalForm.researchExperience.familiarTools.8.checked": "re_tools_sas",
          "goalForm.researchExperience.familiarTools.9.checked": "re_tools_other",
          "goalForm.researchExperience.familiarTools.10.checked": "re_tools_none",
          "goalForm.researchExperience.familiarToolOther": "re_tools_other_text_entry",
          "goalForm.researchExperience.interestResearchService.0.checked": "interest_education",
          "goalForm.researchExperience.interestResearchService.1.checked": "interest_community_health",
          "goalForm.researchExperience.interestResearchService.2.checked": "interest_mental_health",
          "goalForm.researchExperience.interestResearchService.3.checked": "interest_incarceration",
          "goalForm.researchExperience.interestResearchService.4.checked": "interest_chronic_disease",
          "goalForm.researchExperience.interestResearchService.5.checked": "interest_environment",
          "goalForm.researchExperience.interestResearchService.6.checked": "interest_govt",
          "goalForm.researchExperience.interestResearchService.7.checked": "interest_other",
          "goalForm.researchExperience.interestResearchService.8.checked": "interest_none",
          "goalForm.researchExperience.interestResearchServiceOther": "interest_other_text_entry",
          "goalForm.researchExperience.leadershipOption": "leadership_interest",
          "goalForm.growthGoal.problemSolvingGoal": "growth_problem_solving",
          "goalForm.growthGoal.effectiveCommunicationGoal": "growth_communication",
          "goalForm.growthGoal.teamworkGoal": "growth_teamwork",
          "goalForm.growthGoal.culturalHumilityGoal": "growth_cultural_humility",
          "goalForm.growthGoal.ethicalDecisionMakingGoal": "growth_ethical_decision",
          "goalForm.growthGoal.professionalResponsibilityGoal": "growth_professional",
          "goalForm.aspirations.aspirationOne": "aspiration_1_text_entry",
          "goalForm.aspirations.aspirationTwo": "aspiration_2_text_entry",
          "goalForm.aspirations.aspirationThree": "aspiration_3_text_entry",
          "goalForm.goals.goalOne": "goal_1_text_entry",
          "goalForm.goals.goalTwo": "goal_2_text_entry",
          "goalForm.goals.goalThree": "goal_3_text_entry",
          "goalForm.goals.goalFour": "goal_4_text_entry",
          "goalForm.goals.goalFive": "goal_5_text_entry",
          // "createdAt": "",
          // "updatedAt": "",
          // "__v": "",
      };
      const renamedHeader = originalHeader.map(h => renameMap[h] || h);
      const headerRow = renamedHeader.join(',');
  
      // Combine all rows to form the final CSV content
      const csvContent = [headerRow, ...dataRows].join('\n');
  
      return csvContent;
  },
  
  
  convertEntryFormToCSV(jsonData) {
      // Extract data using original headers
      const originalHeader = this.getEntryFormCSVHeader(jsonData[0]);
      const dataRows = jsonData.map((item) => {
          const values = this.getEntryFormCSVRowValues(item, originalHeader);
          return values.join(',');
      });
  
      // Rename headers for CSV output
      const renameMap = {
          // "_id": "", // need 
          // "organizationID": "", // need 
          // "userID": "", // need 
          "studentInformation.cityOrigin": "place_of_origin",
          "studentInformation.primaryLanguage": "primary_language",
          "studentInformation.otherLanguages": "other_languages",
          "studentInformation.pronouns.0.checked": "pronouns_she",
          "studentInformation.pronouns.1.checked": "pronouns_he",
          "studentInformation.pronouns.2.checked": "pronouns_they",
          "studentInformation.pronouns.3.checked": "pronouns_ze",
          "studentInformation.pronouns.4.checked": "pronouns_other",
          "studentInformation.pronouns.5.checked": "pronouns_no_answer",
          "studentInformation.otherPronouns": "pronouns_other_text_entry",
          "studentInformation.commentsByStaff": "pronoun_comments_text_entry",
          "studentInformation.issuesConcernsTriggers": "issues_text_entry",
          "studentInformation.enrolledUHInfo.uhStatus": "degree_enrollment",
          // "studentInformation.enrolledUHInfo.uhEmail": "", // need 
          // "studentInformation.enrolledUHInfo.peopleSoftID": "", // need 
          "studentInformation.enrolledUHInfo.expectedGraduationYear": "",
          "studentInformation.enrolledUHInfo.livingOnCampus": "housing_status",
          "studentInformation.enrolledUHInfo.honorsCollegeStatus": "honors_membership",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.0.checked": "h_affiliation_thesis",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.1.checked": "h_affiliation_mentorship",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.2.checked": "h_affiliation_theatre",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.3.checked": "h_affiliation_dodgeball",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.4.checked": "h_affiliation_SGB",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.5.checked": "h_affiliation_bonner",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.6.checked": "h_affiliation_ext_fellow",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.7.checked": "h_affiliation_mellon",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.8.checked": "h_affiliation_debate",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.9.checked": "h_affiliation_model",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.10.checked": "h_affiliation_ambassadors",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.11.checked": "h_affiliation_other",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliatedOther": "h_affiliation_other_text_entry",
          "studentInformation.enrolledUHInfo.majors": "",
          "studentInformation.enrolledUHInfo.honorsMinors": "",
          "studentInformation.enrolledUHInfo.otherMinors": "",
          "studentInformation.hichInfo.hichStatus": "hich_membership",
          "studentInformation.hichInfo.hichHistoryStatus": "hich_participation",
          "studentInformation.communityServiceInfo.serviceStatus": "community_service",
          "studentInformation.communityServiceInfo.serviceHistoryDesc": "service_text_entry",
          "studentInformation.communityServiceInfo.serviceOrgsOutsideUH": "community_org_text_entry",
          "studentInformation.graduateProfessionalSchool.programGradProStatus": "graduate_school",
          "studentInformation.graduateProfessionalSchool.programGradProType.0.checked": "graduate_md_do",
          "studentInformation.graduateProfessionalSchool.programGradProType.1.checked": "graduate_pa",
          "studentInformation.graduateProfessionalSchool.programGradProType.2.checked": "graduate_nursing",
          "studentInformation.graduateProfessionalSchool.programGradProType.3.checked": "graduate_phd",
          // "studentInformation.graduateProfessionalSchool.programGradProType.4.checked": "", // need for DrPH
          "studentInformation.graduateProfessionalSchool.programGradProType.5.checked": "graduate_jd",
          "studentInformation.graduateProfessionalSchool.programGradProType.6.checked": "graduate_masters",
          "studentInformation.graduateProfessionalSchool.programGradProType.7.checked": "graduate_other",
          // "studentInformation.graduateProfessionalSchool.phDTextbox": "", // need
          // "studentInformation.graduateProfessionalSchool.masterTextbox": "", // need
          "studentInformation.graduateProfessionalSchool.otherTextbox": "graduate_other_text entry", 
          "studentInformation.specializedDegCert.specializedDegCertStatus": "certificate_degree",
          "studentInformation.specializedDegCert.specializedDegCertType.0.checked": "certificate_nursing",
          "studentInformation.specializedDegCert.specializedDegCertType.1.checked": "certificate_social_work",
          "studentInformation.specializedDegCert.specializedDegCertType.2.checked": "certificate_business",
          "studentInformation.specializedDegCert.specializedDegCertType.3.checked": "certificate_engineering",
          "studentInformation.specializedDegCert.specializedDegCertType.4.checked": "certificate_pm",
          "studentInformation.specializedDegCert.specializedDegCertType.5.checked": "certificate_other",
          "studentInformation.specializedDegCert.professionalDesignOther": "certificate_other_text_entry",
          // "createdAt": "", // need
          // "updatedAt": "", // need
          // "__v": "", // need
      };
      const renamedHeader = originalHeader.map(h => renameMap[h] || h);
      const headerRow = renamedHeader.join(',');
  
      // Combine all rows to form the final CSV content
      const csvContent = [headerRow, ...dataRows].join('\n');
  
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
  
  
  
  getEntryFormCSVHeader() {
      // Manually ordered headers based on the document structure
      const ordered_headers = [
          "_id",
          "organizationID",
          "userID",
          "studentInformation.cityOrigin",
          "studentInformation.primaryLanguage",
          "studentInformation.otherLanguages",
          "studentInformation.pronouns.0.checked",
          "studentInformation.pronouns.1.checked",
          "studentInformation.pronouns.2.checked",
          "studentInformation.pronouns.3.checked",
          "studentInformation.pronouns.4.checked",
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
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.0.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.1.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.2.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.3.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.4.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.5.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.6.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.7.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.8.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.9.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.10.checked",
          "studentInformation.enrolledUHInfo.honorsCollegeAffiliated.11.checked",
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
          "studentInformation.graduateProfessionalSchool.programGradProType.0.checked",
          "studentInformation.graduateProfessionalSchool.programGradProType.1.checked",
          "studentInformation.graduateProfessionalSchool.programGradProType.2.checked",
          "studentInformation.graduateProfessionalSchool.programGradProType.3.checked",
          "studentInformation.graduateProfessionalSchool.programGradProType.4.checked",
          "studentInformation.graduateProfessionalSchool.programGradProType.5.checked",
          "studentInformation.graduateProfessionalSchool.programGradProType.6.checked",
          "studentInformation.graduateProfessionalSchool.programGradProType.7.checked",
          "studentInformation.graduateProfessionalSchool.phDTextbox",
          "studentInformation.graduateProfessionalSchool.masterTextbox",
          "studentInformation.graduateProfessionalSchool.otherTextbox",
          "studentInformation.specializedDegCert.specializedDegCertStatus",
          "studentInformation.specializedDegCert.specializedDegCertType.0.checked",
          "studentInformation.specializedDegCert.specializedDegCertType.1.checked",
          "studentInformation.specializedDegCert.specializedDegCertType.2.checked",
          "studentInformation.specializedDegCert.specializedDegCertType.3.checked",
          "studentInformation.specializedDegCert.specializedDegCertType.4.checked",
          "studentInformation.specializedDegCert.specializedDegCertType.5.checked",
          "studentInformation.specializedDegCert.professionalDesignOther",
          "createdAt",
          "updatedAt",
          "__v",
      ];
      return ordered_headers;
  },
  
  getEntryFormCSVRowValues(obj, header) {
      const values = [];
      
      header.forEach((field) => {
          let value = obj;
  
          if (field === "languagePreference") {
              value = obj.userData?.languagePreference || obj.studentInformation?.languagePreference || '';
          } else if (field.includes(".checked")) {
              const pathKeys = field.split('.');
              const index = parseInt(pathKeys[pathKeys.length - 2], 10);
              const key = pathKeys[pathKeys.length - 1];
  
              // This navigates through the object using the pathKeys
              for (let i = 0; i < pathKeys.length - 2; i++) {
                  value = value[pathKeys[i]];
              }
  
              // Extracts the 'checked' value and converts it to a binary representation
              if (value && index in value) {
                  value = value[index][key] ? "1" : "0";
              } else {
                  value = '0';
              }
          } else {
              const pathKeys = field.split('.');
              pathKeys.forEach((key) => {
                  if (value && typeof value === 'object' && key in value) {
                      value = value[key];
                  } else {
                      value = undefined;
                  }
              });
  
              // Check if the field is one of the specified ones and transform its value
              const specifiedFields = [
                  "studentInformation.enrolledUHInfo.uhStatus",
                  "studentInformation.enrolledUHInfo.honorsCollegeStatus",
                  "studentInformation.hichInfo.hichStatus",
                  "studentInformation.hichInfo.hichHistoryStatus",
                  "studentInformation.communityServiceInfo.serviceStatus",
                  "studentInformation.graduateProfessionalSchool.programGradProStatus",
                  "studentInformation.specializedDegCert.specializedDegCertStatus"
              ];
  
              if (specifiedFields.includes(field)) {
                  value = this.transformYesNoToBinary(value);
              };
              if (field === "studentInformation.enrolledUHInfo.livingOnCampus") {
                  value = this.transformCampusToBinary(value);
              };
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
  
  getGoalFormCSVHeader() {
      // Base headers
      const ordered_headers = [
          "_id",
          "organizationID",
          "userID",
          "semester",
          "experienceName",
      ];
  
      // For communityEngagementExperiences
      for (let i = 0; i < 7; i++) {
          ordered_headers.push(`goalForm.communityEngagement.communityEngagementExperiences.${i}.checked`);
      }
      ordered_headers.push("goalForm.communityEngagement.communityEngagementExperiencesOther");
  
      // For previousEngagementExperiences
      for (let i = 0; i < 9; i++) {
          ordered_headers.push(`goalForm.communityEngagement.previousEngagementExperiences.${i}.checked`);
      }
      ordered_headers.push("goalForm.communityEngagement.previousEngagementExperiencesOther");
  
      // For engagementActivitiesTools
      for (let i = 0; i < 9; i++) {
          ordered_headers.push(`goalForm.communityEngagement.engagementActivitiesTools.${i}.checked`);
      }
      ordered_headers.push("goalForm.communityEngagement.engagementActivitiesToolOther");
  
      // For currentResearchExperience
      for (let i = 0; i < 8; i++) {
          ordered_headers.push(`goalForm.researchExperience.currentResearchExperience.${i}.checked`);
      }
      ordered_headers.push("goalForm.researchExperience.currentResearchExperienceOther");
  
      // For previousResearchExperience
      for (let i = 0; i < 9; i++) {
          ordered_headers.push(`goalForm.researchExperience.previousResearchExperience.${i}.checked`);
      }
      ordered_headers.push("goalForm.researchExperience.previousResearchExperienceOther");
  
      // For familiarTools
      for (let i = 0; i < 11; i++) {
          ordered_headers.push(`goalForm.researchExperience.familiarTools.${i}.checked`);
      }
      ordered_headers.push("goalForm.researchExperience.familiarToolOther");
  
      // For interestResearchService
      for (let i = 0; i < 9; i++) {
          ordered_headers.push(`goalForm.researchExperience.interestResearchService.${i}.checked`);
      }
      ordered_headers.push("goalForm.researchExperience.interestResearchServiceOther");
  
      // Append the remaining static headers after the dynamic ones
      ordered_headers.push(
          "goalForm.researchExperience.leadershipOption",
          "goalForm.growthGoal.problemSolvingGoal",
          "goalForm.growthGoal.effectiveCommunicationGoal",
          "goalForm.growthGoal.teamworkGoal",
          "goalForm.growthGoal.culturalHumilityGoal",
          "goalForm.growthGoal.ethicalDecisionMakingGoal",
          "goalForm.growthGoal.professionalResponsibilityGoal",
          "goalForm.aspirations.aspirationOne",
          "goalForm.aspirations.aspirationTwo",
          "goalForm.aspirations.aspirationThree",
          "goalForm.goals.goalOne",
          "goalForm.goals.goalTwo",
          "goalForm.goals.goalThree",
          "goalForm.goals.goalFour",
          "goalForm.goals.goalFive",
          "createdAt",
          "updatedAt",
          "__v"
      );
  
      return ordered_headers;
  },
  
  getGoalFormCSVRowValues(obj, header) {
      const values = [];
      
      header.forEach((field) => {
          let value = obj;
  
          if (field === "studentInformation.languagePreference") {
              if (obj.studentInformation && obj.studentInformation.languagePreference !== undefined) {
                  value = obj.studentInformation.languagePreference;
              } else if (obj.languagePreference !== undefined) {
                  value = obj.languagePreference;
              } else {
                  value = '';
              }
          } 
          // Special handling for the nested arrays with 'checked' values
          else if (field.includes(".checked")) {
              const pathKeys = field.split('.');
              const index = parseInt(pathKeys[pathKeys.length - 2], 10);
              const key = pathKeys[pathKeys.length - 1];
  
              // Navigate through the object using the pathKeys
              for (let i = 0; i < pathKeys.length - 2; i++) {
                  value = value[pathKeys[i]];
              }
  
              // Extract the 'checked' value and convert it to a binary representation
              if (value && index in value) {
                  value = value[index][key] ? "1" : "0";
              } else {
                  value = '0';
              }
          } else {
              const pathKeys = field.split('.');
              pathKeys.forEach((key) => {
                  if (value && typeof value === 'object' && key in value) {
                      value = value[key];
                  } else {
                      value = undefined;
                  }
              });
  
              // Handle arrays (for other fields if any)
              if (Array.isArray(value)) {
                  value = value.join(', ');  // Join array items with commas
              } else if (value !== null && value !== undefined) {
                  value = value.toString();
              }
          }

            // Add the transformation for leadership option
            if (field === "goalForm.researchExperience.leadershipOption") {
                value = this.transformLeadershipOption(value);
            }
  
            const growthFields = [
                "goalForm.growthGoal.problemSolvingGoal",
                "goalForm.growthGoal.effectiveCommunicationGoal",
                "goalForm.growthGoal.teamworkGoal",
                "goalForm.growthGoal.culturalHumilityGoal",
                "goalForm.growthGoal.ethicalDecisionMakingGoal",
                "goalForm.growthGoal.professionalResponsibilityGoal"
            ];

            if (growthFields.includes(field)) {
                value = this.transformGrowthValue(value);
            }

          // Replace newlines with spaces
          if (value) {
              value = value.replace(/\r?\n|\r/g, ' ');
          } else {
              value = '';
          }
  
          // Handle quotes and commas in the value
          if (value.includes('"')) {
              value = value.replace(/"/g, '""');
          }
          if (value.includes(',')) {
              value = `"${value}"`;
          }
  
          values.push(value);
      });
  
      return values;
  },
  
  
  transformYesNoToBinary(value) {
      return value === "Yes" ? "1" : (value === "No" ? "0" : value);
  },
  
  transformCampusToBinary(value) {
      return value === "On-Campus" ? "1" : (value === "Off-Campus" ? "0" : value);
  },

  transformLeadershipOption(value) {
        switch (value) {
            case "Yes":
                return "2";
            case "Maybe":
                return "1";
            case "No":
                return "0";
            default:
                return value; // Return original value if it doesn't match any cases
        }
    },

    transformGrowthValue(value) {
        switch (value) {
            case "No growth":
                return "0";
            case "A little growth":
                return "1";
            case "A moderate amount of growth":
                return "2";
            case "A lot of growth":
                return "3";
            default:
                return value; // Return original value if it doesn't match any cases
        }
    },
  
  
  
    },
  };
  </script>
  