<!-- instructorDataProducts - this view allows Instructors to download student data in the form of CSV files:
    - Student Entry Forms
    - Goal Setting Forms
    - Exit Forms
-->
<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-btn text outlined class="mb-2" @click="downloadEntryDataAsCSV">
            <span class="button-text">Download Student Entry Forms as CSV</span>
          </v-btn>
        </v-col>
      </v-row>
  
      <v-row class="mb-2">
        <v-col cols="12">
          <v-btn text outlined @click="downloadAllGoalDataAsCSV">
            <span class="button-text">Download Student Goal Setting Forms as CSV</span>
          </v-btn>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <v-btn text outlined @click="downloadAllExitDataAsCSV">
            <span class="button-text">Download Student Exit Forms as CSV</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <style>
    .button-text {
      white-space: normal; /* Ensures text wraps */
      line-height: 1.4; /* Adjust line height for better readability when text wraps */
    }
  
    @media (max-width: 600px) { /* Adjust this media query as needed for your xs breakpoint */
      .button-text {
        font-size: 0.875rem; /* Smaller font size for xs screens */
      }
    }
  </style>
  
  
  <script>
  import axios from 'axios';
  import { useLoggedInUserStore } from "@/stored/loggedInUser";
  
  export default {
    data(){
      return{
      }
    },
    mounted(){
    },
    methods: {

        // Downloads entry data as a CSV file. Fetches JSON data from the API endpoint and converts it to CSV format. Then, triggers the download of the CSV file.
        async downloadEntryDataAsCSV() {
            try {
                const user = useLoggedInUserStore();
                let token = user.token;
                // Fetch JSON data from the API endpoint
                const response = await axios.get(import.meta.env.VITE_ROOT_API + '/instructorSideData/data-product/entry-forms', { headers: { token } });
                const jsonData = response.data.data;

                // Convert JSON to CSV format using the renamed headers
                const csvData = this.convertEntryFormToCSV(jsonData);

                // Add UTF-8 Byte Order Mark (BOM)
                const bom = '\uFEFF';

                // Create a Blob containing the CSV data with BOM
                const blob = new Blob([bom + csvData], { type: 'text/csv;charset=utf-8;' });

                // Create a download link and trigger the download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'entryData.csv';
                document.body.appendChild(link);
                link.click();

                // Clean up
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
            } catch (error) {
                this.handleError('Error downloading data:', error);
            }
        },
  
        // Downloads all goal data as a CSV file. Fetches JSON data from the API endpoint and converts it to CSV format. Then, triggers the download of the CSV file.
        async downloadAllGoalDataAsCSV() {
            try {
            const user = useLoggedInUserStore();
            let token = user.token;
            // Fetch JSON data from the API endpoint
            const response = await axios.get(import.meta.env.VITE_ROOT_API +'/instructorSideData/data-product/goal-forms/', { headers: { token } });
            const jsonData = response.data;
    
            // Convert JSON to CSV format
            const csvData = this.convertGoalSettingFormToCSV(jsonData);

            // Add UTF-8 Byte Order Mark (BOM)
            const bom = '\uFEFF';
    
            // Create a Blob containing the CSV data
            const blob = new Blob([bom + csvData], { type: 'text/csv;charset=utf-8' });
    
            // Create a download link and trigger the download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'goalData.csv';
            document.body.appendChild(link);
            link.click();
    
            // Clean up
            URL.revokeObjectURL(url);
            document.body.removeChild(link);
            } catch (error) {
            this.handleError('Error downloading data:', error);
            }
        },
  
      // Downloads all exit data as a CSV file. Fetches JSON data from the API endpoint and converts it to CSV format. Then, triggers the download of the CSV file.
      async downloadAllExitDataAsCSV() {
        try {
          const user = useLoggedInUserStore();
          let token = user.token;
          // Fetch JSON data from the API endpoint
          const response = await axios.get(import.meta.env.VITE_ROOT_API +'/instructorSideData/data-product/exit-forms', { headers: { token } });
          const jsonData = response.data;
  
          // Convert JSON to CSV format
          const csvData = this.convertExitFormToCSV(jsonData);

          // Add UTF-8 Byte Order Mark (BOM)
          const bom = '\uFEFF';

          // Create a Blob containing the CSV data
          const blob = new Blob([bom + csvData], { type: 'text/csv;charset=utf-8' });
  
          // Create a download link and trigger the download
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'exitData.csv';
          document.body.appendChild(link);
          link.click();
  
          // Clean up
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        } catch (error) {
          this.handleError(error);
        }
      },
  
      
      // Converts JSON data representing goal-setting forms to CSV format. Renames headers according to the provided map and creates CSV data rows.
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
            "_id": "goal_id",
            "organizationID": "org_id",
            "userID": "user_id",
            "sessionName": "session",
            "experienceID": "experience",
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
            "goalForm.researchExperience.currentResearchExperience.5.checked": "re_reach",
            "goalForm.researchExperience.currentResearchExperience.6.checked": "re_lab",
            "goalForm.researchExperience.currentResearchExperience.7.checked": "re_other",
            "goalForm.researchExperience.currentResearchExperience.8.checked": "re_none",
            "goalForm.researchExperience.currentResearchExperienceOther": "re_other_text_entry",
            "goalForm.researchExperience.previousResearchExperience.0.checked": "re_activities_design",
            "goalForm.researchExperience.previousResearchExperience.1.checked": "re_activities_lit",
            "goalForm.researchExperience.previousResearchExperience.2.checked": "re_activities_clinical",
            "goalForm.researchExperience.previousResearchExperience.3.checked": "re_activites_lab",
            "goalForm.researchExperience.previousResearchExperience.4.checked": "re_activities_ph",
            "goalForm.researchExperience.previousResearchExperience.5.checked": "re_activities_analysis",
            "goalForm.researchExperience.previousResearchExperience.6.checked": "re_activities_manuscript",
            "goalForm.researchExperience.previousResearchExperience.7.checked": "re_activities_public_presentation",
            "goalForm.researchExperience.previousResearchExperience.8.checked": "re_activities_other",
            "goalForm.researchExperience.previousResearchExperience.9.checked": "re_activities_none",
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
            "goalForm.researchExperience.familiarTools.9.checked": "re_tools_omeka",
            "goalForm.researchExperience.familiarTools.10.checked": "re_tools_other",
            "goalForm.researchExperience.familiarTools.11.checked": "re_tools_none",
            "goalForm.researchExperience.familiarToolOther": "re_tools_other_text_entry",
            "goalForm.researchExperience.interestResearchService.0.checked": "interest_education",
            "goalForm.researchExperience.interestResearchService.1.checked": "interest_community_health",
            "goalForm.researchExperience.interestResearchService.2.checked": "interest_mental_health",
            "goalForm.researchExperience.interestResearchService.3.checked": "interest_incarceration",
            "goalForm.researchExperience.interestResearchService.4.checked": "interest_chronic_disease",
            "goalForm.researchExperience.interestResearchService.5.checked": "interest_environment",
            "goalForm.researchExperience.interestResearchService.6.checked": "interest_govt",
            "goalForm.researchExperience.interestResearchService.7.checked": "interest_social_justice",
            "goalForm.researchExperience.interestResearchService.8.checked": "interest_public_history",
            "goalForm.researchExperience.interestResearchService.9.checked": "interest_other",
            "goalForm.researchExperience.interestResearchService.10.checked": "interest_none",
            "goalForm.researchExperience.interestResearchServiceOther": "interest_other_text_entry",
            "goalForm.researchExperience.leadershipOption": "leadership_interest",
            "goalForm.growthGoal.problemSolvingGoal": "growth_problem_solving",
            "goalForm.growthGoal.effectiveCommunicationGoal": "growth_communication",
            "goalForm.growthGoal.teamworkGoal": "growth_teamwork",
            "goalForm.growthGoal.culturalHumilityGoal": "growth_cultural_humility",
            "goalForm.growthGoal.ethicalDecisionMakingGoal": "growth_ethical_decision",
            "goalForm.growthGoal.professionalResponsibilityGoal": "growth_professional",
            "goalForm.growthGoal.socialResponsibilityGoal": "growth_social_responsibility",
            "goalForm.growthGoal.digitalLiteracyGoal": "growth_digital_literacy",
            "goalForm.aspirations.aspirationOne": "aspiration_1_text_entry",
            "goalForm.aspirations.aspirationTwo": "aspiration_2_text_entry",
            "goalForm.aspirations.aspirationThree": "aspiration_3_text_entry",
            "goalForm.goals.goalOne": "goal_1_text_entry",
            "goalForm.goals.goalTwo": "goal_2_text_entry",
            "goalForm.goals.goalThree": "goal_3_text_entry",
            "goalForm.goals.goalFour": "goal_4_text_entry",
            "goalForm.goals.goalFive": "goal_5_text_entry",
            "createdAt": "goal_created_date",
            "updatedAt": "goal_updated_date",
            // "__v": "",
        };
        const renamedHeader = originalHeader.map(h => renameMap[h] || h);
        const headerRow = renamedHeader.join(',');
    
        // Combine all rows to form the final CSV content
        const csvContent = [headerRow, ...dataRows].join('\n');
    
        return csvContent;
    },
  
  
  // Converts JSON data representing entry forms to CSV format. Renames headers according to the provided map and creates CSV data rows.
  convertEntryFormToCSV(jsonData) {
        // Extract data using original headers
        const originalHeader = this.getEntryFormCSVHeader(jsonData[0]);
        const dataRows = jsonData.map((item) => {
            const values = this.getEntryFormCSVRowValues(item, originalHeader);
            return values.join(',');
        });
    
        // Rename headers for CSV output
        const renameMap = {
            "_id": "entry_id", 
            "organizationID": "org_id", 
            "userID": "user_id", 
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
            "studentInformation.enrolledUHInfo.uhEmail": "uh_email", 
            "studentInformation.enrolledUHInfo.peopleSoftID": "peoplesoft_id", 
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
            "studentInformation.graduateProfessionalSchool.programGradProType.4.checked": "graduate_drph", 
            "studentInformation.graduateProfessionalSchool.programGradProType.5.checked": "graduate_jd",
            "studentInformation.graduateProfessionalSchool.programGradProType.6.checked": "graduate_masters",
            "studentInformation.graduateProfessionalSchool.programGradProType.7.checked": "graduate_other",
            "studentInformation.graduateProfessionalSchool.phDTextbox": "graduate_phd_text_entry", 
            "studentInformation.graduateProfessionalSchool.masterTextbox": "graduate_masters_text_entry", 
            "studentInformation.graduateProfessionalSchool.otherTextbox": "graduate_other_text entry", 
            "studentInformation.specializedDegCert.specializedDegCertStatus": "certificate_degree",
            "studentInformation.specializedDegCert.specializedDegCertType.0.checked": "certificate_nursing",
            "studentInformation.specializedDegCert.specializedDegCertType.1.checked": "certificate_social_work",
            "studentInformation.specializedDegCert.specializedDegCertType.2.checked": "certificate_business",
            "studentInformation.specializedDegCert.specializedDegCertType.3.checked": "certificate_engineering",
            "studentInformation.specializedDegCert.specializedDegCertType.4.checked": "certificate_pm",
            "studentInformation.specializedDegCert.specializedDegCertType.5.checked": "certificate_other",
            "studentInformation.specializedDegCert.professionalDesignOther": "certificate_other_text_entry",
            "createdAt": "entry_created_date", 
            "updatedAt": "entry_updated_date", 
            // "__v": "", // need
        };
        const renamedHeader = originalHeader.map(h => renameMap[h] || h);
        const headerRow = renamedHeader.join(',');
    
        // Combine all rows to form the final CSV content
        const csvContent = [headerRow, ...dataRows].join('\n');
    
        return csvContent;
    },
    
  // Converts JSON data representing exit forms to CSV format. Maps JSON variable names to CSV variable names and creates CSV data rows accordingly.
  convertExitFormToCSV(jsonData) {
        // Define the mapping from JSON variable names to CSV variable names
        const renameMap = {
            "_id": "exit_form_id",
            "organizationID": "org_id",
            "userID": "user_id",
            "goalSettingFormID": "goal_id",
            "sessionName": "session",
            "createdAt": "created_at",
            "updatedAt": "updated_at",
            // Default to the original variable names if not provided in the renameMap
        };

        // Extract headers
        const originalHeader = this.getExitFormCSVHeader();
        const renamedHeader = originalHeader.map(h => renameMap[h] || h); // Use renameMap, default to original name if not found
        const headerRow = renamedHeader.join(',');

        // Create the CSV data rows
        const dataRows = jsonData.map(item => {
            const values = this.getExitFormCSVRowValues(item, originalHeader);
            // Directly join the values without mapping to new field names
            return values.join(',');
        });


        // Combine header row and data rows to form the final CSV content
        const csvContent = [headerRow, ...dataRows].join('\n');

        return csvContent;
    },
  
  // Retrieves the CSV header for entry form data. Returns an array of headers ordered based on the document structure.
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
          "h_minor_data_society",
          "h_minor_medicine_society",
          "h_minor_phronesis",
          "h_minor_creative_work",
          "h_minor_energy",
          "h_minor_leadership",
          "h_minor_global",
          "h_minor_none",
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
  
  
  // Retrieves the CSV row values for entry form data based on the provided object and header.
  getEntryFormCSVRowValues(obj, header) {
      const values = [];
      
      header.forEach((field) => {
          let value = obj;
          // Split and encode for the honorsMinors field
          if (field.startsWith('h_minor_')) {   
            // Map the field back to the possible value in the honorsMinors array
            const valueMap = {
                'h_minor_data_society': 'Data & Society',
                'h_minor_medicine_society': 'Medicine & Society',
                'h_minor_phronesis': 'Phronesis',
                'h_minor_creative_work': 'Creative Work',
                'h_minor_energy': 'Energy & Sustainability',
                'h_minor_leadership': 'Leadership Studies',
                'h_minor_global': 'Global Engagement and Research',
                'h_minor_none': 'None'
            };
            // Get the honorsMinors array from the obj
            const minorValues = obj.studentInformation?.enrolledUHInfo.honorsMinors || [];   

            // Set 1 if the value is in the array, 0 otherwise
            value = minorValues.includes(valueMap[field]) ? '1' : '0';

          } else if (field === "languagePreference") {
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
  
  // Retrieves the CSV header for goal form data.
  getGoalFormCSVHeader() {
      // Base headers
      const ordered_headers = [
          "_id",
          "organizationID",
          "userID",
          "sessionName",
          "experienceID",
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
      for (let i = 0; i < 9; i++) {
          ordered_headers.push(`goalForm.researchExperience.currentResearchExperience.${i}.checked`);
      }
      ordered_headers.push("goalForm.researchExperience.currentResearchExperienceOther");
  
      // For previousResearchExperience
      for (let i = 0; i < 10; i++) {
          ordered_headers.push(`goalForm.researchExperience.previousResearchExperience.${i}.checked`);
      }
      ordered_headers.push("goalForm.researchExperience.previousResearchExperienceOther");
  
      // For familiarTools
      for (let i = 0; i < 12; i++) {
          ordered_headers.push(`goalForm.researchExperience.familiarTools.${i}.checked`);
      }
      ordered_headers.push("goalForm.researchExperience.familiarToolOther");
  
      // For interestResearchService
      for (let i = 0; i < 11; i++) {
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
          "goalForm.growthGoal.socialResponsibilityGoal", 
          "goalForm.growthGoal.digitalLiteracyGoal",      
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
  
  // Extracts values from a given object based on the provided header, incorporating special handling for nested fields and 'checked' values. Includes transformations for specific fields like leadership options and growth goals.
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
                "goalForm.growthGoal.professionalResponsibilityGoal",
                "goalForm.growthGoal.socialResponsibilityGoal",
                "goalForm.growthGoal.digitalLiteracyGoal"
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

  // Manually orders headers for the exit form CSV based on document structure.
  getExitFormCSVHeader() {
        // Manually ordered headers based on the exit form document structure
        const ordered_headers = [
            "_id",
            "organizationID",
            "userID",
            "sessionName",
            "experienceID",
            "goalSettingFormID",
            "exitForm.progressMade.aspirationOneProgressResults",
            "exitForm.progressMade.aspirationTwoProgressResults",
            "exitForm.progressMade.aspirationThreeProgressResults",
            "exitForm.progressMade.aspirationOneExperienceConnection",
            "exitForm.progressMade.aspirationTwoExperienceConnection",
            "exitForm.progressMade.aspirationThreeExperienceConnection",
            "exitForm.progressMade.goalOneProgressResults",
            "exitForm.progressMade.goalTwoProgressResults",
            "exitForm.progressMade.goalThreeProgressResults",
            "exitForm.progressMade.goalFourProgressResults",
            "exitForm.progressMade.goalFiveProgressResults",
            "exitForm.progressMade.goalOneExperienceConnection",
            "exitForm.progressMade.goalTwoExperienceConnection",
            "exitForm.progressMade.goalThreeExperienceConnection",
            "exitForm.progressMade.goalFourExperienceConnection",
            "exitForm.progressMade.goalFiveExperienceConnection",
            "exitForm.goalIssues.goals",
            "exitForm.goalIssues.issuesDescription",
            "exitForm.activitiesContribution.goalOneContributions",
            "exitForm.activitiesContribution.goalTwoContributions",
            "exitForm.activitiesContribution.goalThreeContributions",
            "exitForm.activitiesContribution.goalFourContributions",
            "exitForm.activitiesContribution.goalFiveContributions",
            "exitForm.activitiesContribution.noContributions",
            "exitForm.likelihoodOf.enrollAnotherCourse",
            "exitForm.likelihoodOf.completeMinor",
            "exitForm.likelihoodOf.recommendCourse",
            "exitForm.likelihoodOf.pursueCareer",
            "exitForm.generalGrowth.problemSolving",
            "exitForm.generalGrowth.effectiveCommunication",
            "exitForm.generalGrowth.teamwork",
            "exitForm.generalGrowth.culturalHumility",
            "exitForm.generalGrowth.ethicalDecisionMaking",
            "exitForm.generalGrowth.professionalResponsibility",
            "exitForm.openEnded.biggestLessons",
            "exitForm.openEnded.supportOthers",
            "exitForm.openEnded.comments",
            "exitForm.experienceContributions",
            "createdAt",
            "updatedAt",
            "__v",
            // Include any other fields that are relevant for the CSV export
        ];
        return ordered_headers;
    },

    // Extracts values from the given object based on the provided header keys, applying transformations as needed for specific fields. Handles array values, converts to string, and handles special characters for CSV formatting.
    getExitFormCSVRowValues(obj, header) {
        const values = [];
        
        header.forEach((field) => {
            let value = obj;
            const pathKeys = field.split('.');
            pathKeys.forEach((key) => {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    value = value ? value : '';
                }
            });

            // Apply transformation based on fields
            switch(field) {
                case "exitForm.progressMade.aspirationOneProgressResults":
                case "exitForm.progressMade.aspirationTwoProgressResults":
                case "exitForm.progressMade.aspirationThreeProgressResults":
                    value = this.transformAspirationProgress(value);
                    break;
                case "exitForm.progressMade.aspirationOneExperienceConnection":
                case "exitForm.progressMade.aspirationTwoExperienceConnection":
                case "exitForm.progressMade.aspirationThreeExperienceConnection":
                    value = this.transformAspirationConnection(value);
                    break;
                case "exitForm.progressMade.goalOneProgressResults":
                case "exitForm.progressMade.goalTwoProgressResults":
                case "exitForm.progressMade.goalThreeProgressResults":
                case "exitForm.progressMade.goalFourProgressResults":
                case "exitForm.progressMade.goalFiveProgressResults":
                    value = this.transformGoalProgress(value);
                    break;
                case "exitForm.progressMade.goalOneExperienceConnection":
                case "exitForm.progressMade.goalTwoExperienceConnection":
                case "exitForm.progressMade.goalThreeExperienceConnection":
                case "exitForm.progressMade.goalFourExperienceConnection":
                case "exitForm.progressMade.goalFiveExperienceConnection":
                    value = this.transformGoalConnection(value);
                    break;
                case "exitForm.goalIssues.goals":
                    value = this.transformGoalIssues(value);
                    break;
                case "exitForm.generalGrowth.problemSolving":
                case "exitForm.generalGrowth.effectiveCommunication":
                case "exitForm.generalGrowth.teamwork":
                case "exitForm.generalGrowth.culturalHumility":
                case "exitForm.generalGrowth.ethicalDecisionMaking":
                case "exitForm.generalGrowth.professionalResponsibility":
                    value = this.transformGrowthValue(value);
                    break;
                case "exitForm.likelihoodOf.enrollAnotherCourse":
                case "exitForm.likelihoodOf.completeMinor":
                case "exitForm.likelihoodOf.recommendCourse":
                case "exitForm.likelihoodOf.pursueCareer":
                    value = this.transformLikelihoodValue(value);
                    break;
            }

            // Handle arrays
            if (Array.isArray(value)) {
                value = value.join(', ');
            }

            // Convert to string and handle special characters
            if (value) {
                value = value.toString().replace(/\r?\n|\r/g, ' ').replace(/"/g, '""');
                if (value.includes(',')) {
                    value = `"${value}"`;
                }
            }

            values.push(value);
        });

        return values;
    },

  // Converts "Yes" to "1", "No" to "0", and leaves other values unchanged.
  transformYesNoToBinary(value) {
      return value === "Yes" ? "1" : (value === "No" ? "0" : value);
  },
  
  // Converts "On-Campus" to "1", "Off-Campus" to "0", and leaves other values unchanged.
  transformCampusToBinary(value) {
      return value === "On-Campus" ? "1" : (value === "Off-Campus" ? "0" : value);
  },

  // Transforms "Yes" to "2", "Maybe" to "1", "No" to "0", and leaves other values unchanged.
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

    // Transforms growth value descriptions to numerical representations:
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
    
    // Transforms aspiration progress descriptions to numerical representations:
    transformAspirationProgress(value) {
        const map = {
            "I made lots of progress towards this aspiration": "3",
            "I made some progress towards this aspiration": "2",
            "I made little progress towards this aspiration": "1",
            "I did not make progress towards this aspiration": "0"
        };
        return map[value] || value;
    },

    // Transforms aspiration connection descriptions to numerical representations:
    transformAspirationConnection(value) {
        const map = {
            "The progress I made towards this aspiration was largely due to this course": "2",
            "The progress I made towards this aspiration was partly due to this course": "1",
            "The progress I made towards this aspiration was not due to this course": "0"
        };
        return map[value] || value;
    },

    // Transforms goal progress descriptions to numerical representations:
    transformGoalProgress(value) {
        const map = {
            "I made lots of progress towards this goal": "3",
            "I made some progress towards this goal": "2",
            "I made little progress towards this goal": "1",
            "I did not make progress towards this goal": "0"
        };
        return map[value] || value;
    },

    // Transforms goal connection descriptions to numerical representations:
    transformGoalConnection(value) {
        const map = {
            "The progress I made towards this goal was largely due to this course": "2",
            "The progress I made towards this goal was partly due to this course": "1",
            "The progress I made towards this goal was not due to this course": "0"
        };
        return map[value] || value;
    },

    // Transforms goal issues descriptions to numerical representations:
    transformGoalIssues(value) {
        // Map for transforming goal descriptions
        const goalMap = {
            "Goal 1": "1",
            "Goal 2": "2",
            "Goal 3": "3",
            "Goal 4": "4",
            "Goal 5": "5",
            "No Goals": "No Goals"
        };

        // Transform each goal in the array
        return value.map(goal => goalMap[goal] || goal);
    },

    // Transforms likelihood descriptions to numerical representations:
    transformLikelihoodValue(value) {
        const likelihoodMap = {
            "Extremely likely": "4",
            "Somewhat likely": "3",
            "Neutral likely/unlikely": "2",
            "Somewhat unlikely": "1",
            "Extremely unlikely": "0"
        };
        return likelihoodMap[value] || value;
    },
  
    },
  };
  </script>
  