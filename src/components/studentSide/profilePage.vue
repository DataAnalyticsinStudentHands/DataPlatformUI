<template>
    <v-row style="margin-top: 1rem;">
      <!-- Empty space (padding) -->
      <v-col cols="4"></v-col>
      
      <!-- Text: Student's Information -->
      <v-col cols="4" class="text-center">
        <p class="font-weight-black text-h5">{{getTranslation("Student's Information")}}</p>
      </v-col>
      
      <!-- Button: Edit Information -->
      <v-col md="3">
        <div v-if="!loading && completedEntryForm">
          <router-link to="/studentEntryFormUpdate">
            <v-btn>{{getTranslation('Edit Information')}}</v-btn>
          </router-link>
        </div>
      </v-col>
      
      <!-- Empty space (padding) -->
      <v-col cols="2"></v-col>
    </v-row>
    <v-form disabled>
      <div v-if="loading" class="loading-container">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else>
      <v-container style="width: 90%; margin: 0 auto;">
        <br><p class="font-weight-black text-h6">{{getTranslation('Basic Information')}}</p>
          <v-row>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('First Name')}}</label>
              <p style="margin: 0;">{{ this.userData.firstName }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Last Name')}}</label>
              <p style="margin: 0;">{{ this.userData.lastName }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Email')}}</label>
              <p style="margin: 0;">{{ this.userData.email }}</p>
            </v-col>
            <v-col cols="12" md="4">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Language Preference')}}</label>
              <p style="margin: 0;">{{ getTranslation(languagePreferenceValue) }}</p>
            </v-col>
          </v-row>
        <br><p class="font-weight-black text-h6">{{getTranslation('Demographics Information')}}</p>
        <v-row>
            <v-col cols="12" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Place of Origin')}}</label>
              <p style="margin: 0;">{{ this.studentData?.cityOrigin }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Primary Language')}}</label>
              <p style="margin: 0;">{{ this.studentData?.primaryLanguage }}</p>
            </v-col>
            <v-col cols="12" md="4">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Other Languages')}}</label>
              <p style="margin: 0;">{{ this.studentData?.otherLanguages }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="11" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Pronouns')}}</label>
              <p style="margin: 0;">{{ getTranslation(checkedPronouns) }}</p>
            </v-col>
            <v-col cols="11" md="6">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Other Pronouns')}}</label>
              <p style="margin: 0;">{{ this.studentData?.otherPronouns }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?')}}</label>
              <p style="margin: 0;">{{ this.studentData?.commentsByStaff }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?')}}</label>
              <p style="margin: 0;">{{ this.studentData?.issuesConcernsTriggers }}</p>
            </v-col>
          </v-row>
          <div v-if="this.studentData?.enrolledUHInfo?.uhStatus == 'Yes'">
            <br><p class="font-weight-black text-h6">{{getTranslation("UH Student's Information")}}</p>
            <v-row>
                <v-col cols="12" md="6">
                  <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('UH Email')}}</label>
                  <p style="margin: 0;">{{ this.studentData?.enrolledUHInfo?.uhEmail }}</p>
                </v-col>
              <v-col cols="12" md="3">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('PeopleSoft ID')}}</label>
                <p style="margin: 0;">{{ this.studentData?.enrolledUHInfo?.peopleSoftID }}</p>
              </v-col>
              <v-col cols="12" md="3">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Expected Graduation Date')}}</label>
                <p style="margin: 0;">{{ this.studentData?.enrolledUHInfo?.expectedGraduationYear }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Do you live on or off campus?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.enrolledUHInfo?.livingOnCampus) }}</p>
              </v-col>
            </v-row>
            <br><p class="font-weight-black text-h7">{{getTranslation('Educational Background and Goals')}}</p>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you currently enrolled in a degree program at the University of Houston?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.enrolledUHInfo?.uhStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you a member of the Honors College?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.enrolledUHInfo?.honorsCollegeStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="10">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?')}}</label>
                <p style="margin: 0;">{{ honorsCollegeAffiliated }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Other Honors College Affiliation Information')}}</label>
                <p style="margin: 0;">{{ this.studentData?.enrolledUHInfo?.honorsCollegeAffiliatedOther }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('What is/are your current major(s)?')}}</label>
                <p style="margin: 0;">{{ majors }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you pursuing, or planning to pursue, any of the following Honors College minors?')}}</label>
                <p style="margin: 0;">{{ honorsMinors }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you pursuing any other minors?')}}</label>
                <p style="margin: 0;">{{ otherMinors }}</p>
              </v-col>
            </v-row>
            <br><p class="font-weight-black text-h7">{{getTranslation('Other Engagement')}}</p>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you a member of Honors in Community Health (HICH)?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.hichInfo?.hichStatus) }}</p>
              </v-col>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.hichInfo?.hichHistoryStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Have you had experience with Community Service?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.communityServiceInfo?.serviceStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</label>
                <p style="margin: 0;">{{ this.studentData?.communityServiceInfo?.serviceHistoryDesc }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you a member of any community organizations outside the University?')}}</label>
                <p style="margin: 0;">{{ this.studentData?.communityServiceInfo?.serviceOrgsOutsideUH }}</p>
              </v-col>
            </v-row>
          </div>
          <div v-if="this.studentData?.enrolledUHInfo?.uhStatus == 'No'">
            <p class="font-weight-black text-h6">{{getTranslation("Non-UH Student's Information")}}</p><br>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Have you had experience with Community Service?')}}</label>
                <p style="margin: 0;">{{ this.studentData?.communityServiceInfo?.serviceStatus }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.')}}</label>
                <p style="margin: 0;">{{ this.studentData?.communityServiceInfo?.serviceHistoryDesc }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" v-if="this.studentData?.communityServiceInfo?.serviceStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you a member of any community organizations outside the University?')}}</label>
                <p style="margin: 0;">{{ this.studentData?.communityServiceInfo?.serviceOrgsOutsideUH }}</p>
              </v-col>
            </v-row>
          </div>
          <br><p class="font-weight-black text-h6">{{getTranslation('Graduate/Professional School Goals')}}</p>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Do you currently plan to pursue graduate or professional (e.g. medical, law) school?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.graduateProfessionalSchool?.programGradProStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="11" v-if="this.studentData?.graduateProfessionalSchool?.programGradProStatus === 'Yes'">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('If you are planning to pursue graduate school, what type of program?')}}</label>
                <p style="margin: 0;">{{ programGradProType }}</p>
              </v-col>
            </v-row>
            <v-row v-if="this.studentData?.graduateProfessionalSchool?.programGradProStatus === 'Yes'">
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('PhD Information')}}</label>
                <p style="margin: 0;">{{ this.studentData?.graduateProfessionalSchool?.phDTextbox }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation("Master's Information")}}</label>
                <p style="margin: 0;">{{ this.studentData?.graduateProfessionalSchool?.masterTextbox }}</p>
              </v-col>
              <v-col cols="11">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Other Professional Schooling Information')}}</label>
                <p style="margin: 0;">{{ this.studentData?.graduateProfessionalSchool?.otherTextbox }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Are you planning to pursue any other kind of specialized degree / certificate program?')}}</label>
                <p style="margin: 0;">{{ getTranslation(this.studentData?.specializedDegCert?.specializedDegCertStatus) }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="this.studentData?.specializedDegCert?.specializedDegCertStatus">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Listed Specialized Degree / Certificate Program')}}</label>
                <p style="margin: 0;">{{ specializedDCType }}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="this.studentData?.specializedDegCert?.specializedDegCertType.find(other => other.id === 6 && other.checked)">
                <label style="font-weight: 500; margin-bottom: 5px; font-size: 0.75rem; color: grey;">{{getTranslation('Other Specialized Degree / Certificate Program')}}</label>
                <p style="margin: 0;">{{ this.studentData?.specializedDegCert?.professionalDesignOther }}</p>
              </v-col>
            </v-row> 
      </v-container>
      </div>
  </v-form>
</template>

<script>
import { ref } from 'vue';
import { useLoggedInUserStore } from "@/stored/loggedInUser";
import axios from "axios";

export default {
setup() {
  const translations = {
    Spanish: {
      "Student's Information": "Información del Estudiante",
      "Edit Information": "Editar Información",
      "Basic Information": "Información Básica",
      "First Name": "Nombre",
      "Last Name": "Apellido",
      "Email": "Correo Electrónico",
      "Language Preference": "Preferencia de Idioma",
      "Demographics Information": "Información Demográfica",
      "Place of Origin": "Lugar de Origen",
      "Primary Language": "Idioma principal",
      "Other Languages": "Otros idiomas",
      "Pronouns": "Pronombres",
      "Other Pronouns": "Otros Pronombres",
      "Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?": "¿Tiene algún comentario sobre la forma en que los instructores/personal utilizan estos pronombres en entornos públicos o privados?",
      "Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?": "¿Hay algún problema, inquietud o desencadenante personal que le gustaría que los instructores tuvieran en cuenta al facilitar lecciones y reuniones?",
      "Issues, Concerns, Triggers": "Problemas, Inquietudes, Desencadenantes",
      "UH Student's Information": "Información del Estudiante de la Universidad de Houston",
      "Non-UH Student's Information": "Información del Estudiante no perteneciente a la Universidad de Houston",
      "UH Email": "Correo Electrónico de UH",
      "Expected Graduation Date": "Fecha Estimada de Graduación",
      "Do you live on or off campus?": "¿Vives dentro o fuera del campus?",
      "Educational Background and Goals": "Antecedentes Educativos y Objetivos",
      "Are you currently enrolled in a degree program at the University of Houston?": "¿Está actualmente inscrito en un programa de estudios en la Universidad de Houston?",
      "Are you a member of the Honors College?": "¿Eres miembro del Honors College?",
      "Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?": "¿Está afiliado al Honors College de alguna otra manera (que no sean cursos de Datos y Sociedad, participar en una especialización con Honores o HICH)?",
      "Other Honors College Affiliation Information": "Información Adicional sobre la Afiliación al Colegio de Honores",
      "What is/are your current major(s)?": "¿Cuál es/son su(s) especialidad(es) actual(es) en la universidad?",
      "Are you pursuing, or planning to pursue, any of the following Honors College minors?": "¿Está cursando o planea cursar alguna de las siguientes asignaturas secundarias del Honors College?",
      "Are you pursuing any other minors?": "¿Está persiguiendo otros programas menores? Por favor enumere.",
      "Other Engagement": "Otras Participaciones",
      "Are you a member of Honors in Community Health (HICH)?": "¿Es usted miembro del Honors in Community Health (HICH)?",
      "Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?": "¿Ha participado en proyectos de HICH (PEERS, Recursos Receptivos, BREATHE, Cuidado Creativo, etc.)?",
      "Have you had experience with Community Service?": "¿Ha tenido otra experiencia con el Servicio Comunitario?",
      "Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.": "Por favor describa brevemente cualquier oportunidad de servicio comunitario en la que participó. Incluya la organización y el alcance del servicio.",
      "Are you a member of any community organizations outside the University?": "¿Es usted miembro de alguna organización comunitaria fuera de la Universidad?",
      "Graduate/Professional School Goals": "Objetivos de Posgrado/Escuela Profesional",
      "Do you currently plan to pursue graduate or professional (e.g. medical, law) school?": "¿Actualmente planea seguir una carrera de posgrado o profesional (por ejemplo, medicina, derecho)?",
      "If you are planning to pursue graduate school, what type of program?": "Si planea seguir una escuela de posgrado, ¿qué tipo de programa?",
      "PhD Information": "Información sobre el PhD",
      "Master's Information": "Información sobre la Maestría",
      "Other Professional Schooling Information": "Información sobre Otros Estudios Profesionales",
      "Are you planning to pursue any other kind of specialized degree / certificate program?": "¿Planea seguir algún otro tipo de programa de grado especializado / certificado?",
      "Listed Specialized Degree / Certificate Program": "Programa de Grado/Especialización/Certificado Enumerado",
      "Other Specialized Degree / Certificate Program": "Otro Programa de Grado/Especialización/Certificado",
      "English": "Inglés",
      "Spanish": "Español",
      "She/her/hers": "Ella",
      "He/him/his": "El",
      "They/them/theirs": "Ellos/Ellas/Elle",
      "Other": "Otro",
      "On-Campus": "Dentro del campus",
      "Off-Campus": "Fuera del campus",
      "Yes": "Si",
      "Other": "Otro",
      "Physician Assistant: PA": "Asistente Medico/a",
      "Nursing: MSN, DNP": "Enfermería: MSN, DNP",
      "Law: JD": "Leyes: JD",
      "Master's: MPH, MBA, MA, MS, MEd, etc": "Maestría: MPH, MBA, MA, MS, MEd, etc",
      "Nursing: PRN, RN, CNA, etc": "Enfermería: PRN, RN, CNA, etc",
      "Social Work: LSW/LCSW": "Trabajo Social: LSW/LCSW",
      "Business: Certified Public Accountant (CPA, Licensed Public Accountant (LPA), Certified Financial Planner (CFP)": "Negocio: Certificado para Contador/a Publico/a (o CPA en inglés), Contador/a Publico/a con Licencia (o LPA en inglés), Certificado para Planificador Financiero (o CFP en inglés)",
      "Engineering/Technology: Professional Engineer (PE), Certified Technology Specialist (CTS), etc": "Ingeniería/Tecnología: Ingeniero Profesional (o PE en inglés), Certificado para Especialistas en Tecnología (o CTS en inglés), etc",
      "Project Management: Certified Associate in Project Management (CAPM), Project Management Professional (PMP)": "Gestión de Proyectos: Certificado Asociado en Gestión de Proyectos (o CAPM en inglés), Profesional en Gestión de Proyectos (o PMP en inglés)",
      "Other Professional Designation": "Otra designación profesional",
    }
  };

    // Reactive State
    const currentLanguage = ref('English'); // default value
    
    const getTranslation = (key) => {
      return (translations[currentLanguage.value] && translations[currentLanguage.value][key]) || key;
    };

    // Lifecycle Hooks or Logic (like the login check)
    if (useLoggedInUserStore().languagePreference === "Spanish") {
        currentLanguage.value = "Spanish";
    }
    
    // Return the reactive properties and methods to access in the template
    return {
      getTranslation,
    };
},
data() {
  return {
      userData: [],
      studentData: [],
  };
},
beforeMount() {
  const user = useLoggedInUserStore();
  let token = user.token;
  let userGivenID = user.userId;
  let url = import.meta.env.VITE_ROOT_API + `/studentSideData/studentInformation`;

  useLoggedInUserStore().startLoading();
  try {
    axios.get(url + `/${userGivenID}`, { headers: { token },})
      .then((resp) => {
        this.userData = resp.data.userData;
        this.studentData = resp.data.studentData?.studentInformation;
        useLoggedInUserStore().stopLoading();
      });
  } catch (error) {
    this.handleError('Error:', error);
    useLoggedInUserStore().stopLoading();
  } 
},

computed: {
  checkedPronouns() {
    if (this.studentData && this.studentData?.pronouns) {
      return this.studentData?.pronouns
        .filter(pronoun => pronoun.checked === true)
        .map(item => this.getTranslation(item.label))
        .join(", ");
    }
    return ""; // Return a default value or handle the case when the data is not available
  },
  honorsCollegeAffiliated() {
    return this.studentData.enrolledUHInfo?.honorsCollegeAffiliated.filter(aff => aff.checked === true).map(aff => aff.label).join(", ");
  },
  majors() {
    const majors = this.studentData?.enrolledUHInfo?.majors;
    return Array.isArray(majors) && majors.length > 0 ? majors.join(", ") : "None";
  },
  honorsMinors() {
    const honorsMinors = this.studentData?.enrolledUHInfo?.honorsMinors;
    return Array.isArray(honorsMinors) && honorsMinors.length > 0 ? honorsMinors.join(", ") : "None";
  },
  otherMinors() {
    const otherMinors = this.studentData?.enrolledUHInfo?.otherMinors;
    return Array.isArray(otherMinors) && otherMinors.length > 0 ? otherMinors.join(", ") : "None";
  },
  programGradProType() {
    return this.studentData?.graduateProfessionalSchool?.programGradProType.filter(program => program.checked === true).map(program => this.getTranslation(program.label)).join(", ");
  },
  specializedDCType() {
    return this.studentData?.specializedDegCert?.specializedDegCertType.filter(program => program.checked === true).map(program => this.getTranslation(program.label)).join(", ");
  },
  languagePreferenceValue() {
      if (this.userData && this.userData.languagePreference) {
          return this.userData.languagePreference;
      } else if (this.studentData && this.studentData.languagePreference) {
          return this.studentData.languagePreference;
      } else {
          return ""; // Default value in case it's not found in both formats
      }
  },
  loading() {
    const store = useLoggedInUserStore();
    return store.loading;
  },
  completedEntryForm() {
    const store = useLoggedInUserStore();
    return store.hasCompletedEntryForm;
  }
},
methods: {
}
}
</script>