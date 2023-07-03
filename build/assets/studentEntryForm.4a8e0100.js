import{_ as H,u as P,a as x,o as r,c,b as l,w as n,V as C,d as w,e as D,F as V,f as i,g as u,W as h,h as g,i as a,l as s,r as y,Y as b,M as I,n as d,X as p,Z as v,j as O,k as A}from"./index.06e63598.js";const _={data(){return{studentInformation:{cityOrigin:"",primaryLanguage:"",otherLanguages:"",languagePreference:"",pronouns:[{id:1,label:"She/her/hers",checked:!1},{id:2,label:"He/him/his",checked:!1},{id:3,label:"They/them/theirs",checked:!1},{id:4,label:"Ze/Zir/Zirs",checked:!1},{id:5,label:"Other",checked:!1},{id:6,label:"Prefer not to answer",checked:!1}],otherPronouns:"",commentsByStaff:"",issuesConcernsTriggers:"",enrolledUHInfo:{uhStatus:null,uhEmail:"",peopleSoftID:"",expectedGraduationYear:"",livingOnCampus:!1,honorsCollegeStatus:!1,honorsCollegeAffiliatedStatus:!1,honorsCollegeAffiliatedHow:"",majors:[],honorsMinors:[],otherMinors:[]},hichInfo:{hichStatus:!1,hichHistoryStatus:!1},communityServiceInfo:{serviceStatus:!1,serviceHistoryDesc:"",serviceOrgsOutsideUH:""},graduateProfessionalSchool:{programGradProStatus:!1,programGradProType:[{id:1,label:"MD/DO",checked:!1},{id:2,label:"Physician Assistant: PA",checked:!1},{id:3,label:"Nursing: MSN, DNP",checked:!1},{id:4,label:"PhD",checked:!1},{id:5,label:"DrPH",checked:!1},{id:6,label:"Law: JD",checked:!1},{id:7,label:"Master's: MPH, MBA, MA, MS, MEd, etc",checked:!1},{id:8,label:"Other",checked:!1}],phDTextbox:"",masterTextbox:"",otherTextbox:""},specializedDegCert:{specializedDegCertStatus:!1,specializedDegCertType:[{id:1,label:"Nursing: PRN, RN, CNA, etc",checked:!1},{id:2,label:"Social Work: LSW/LCSW",checked:!1},{id:3,label:"Business: Certified Public Accountant (CPA, Licensed Public Accountant (LPA), Certified Financial Planner (CFP)",checked:!1},{id:4,label:"Engineering/Technology: Professional Engineer (PE), Certified Technology Specialist (CTS), etc",checked:!1},{id:5,label:"Project Management: Certified Associate in Project Management (CAPM), Project Management Professional (PMP)",checked:!1},{id:6,label:"Other Professional Designation",checked:!1}],professionalDesignOther:""}},majors:[],minors:[]}},mounted(){fetch("../../majorsAndMinors.json").then(f=>f.json()).then(f=>{this.majors=f,this.minors=f}).catch(f=>{console.log("Error:",f)})},computed:{year(){return new Date(this.dateInput).getFullYear()},filteredMajors(){return this.majors.filter(f=>f["Plan Type"]==="MAJ")},filteredMinors(){return this.minors.filter(f=>f["Plan Type"]==="MIN")}},methods:{async handleSubmitForm(){let t=P().token,U="https://cis-4339.herokuapp.com/studentSideData/entryForms/";x.post(U,{studentInformation:this.studentInformation},{headers:{token:t}}).then(()=>{this.$router.push("/studentEntryForm"),this.studentInformation={cityOrigin:"",primaryLanguage:"",otherLanguages:"",languagePreference:"",pronouns:[],otherPronouns:"",commentsByStaff:"",issuesConcernsTriggers:"",enrolledUHInfo:{uhStatus:"",uhEmail:"",peopleSoftID:"",expectedGraduationYear:"",livingOnCampus:"",honorsCollegeStatus:"",honorsCollegeAffiliatedStatus:"",honorsCollegeAffiliatedHow:"",majors:[],honorsMinors:[],otherMinors:[]},hichInfo:{hichStatus:"",hichHistoryStatus:""},communityServiceInfo:{serviceStatus:"",serviceHistoryDesc:"",serviceOrgsOutsideUH:""},graduateProfessionalSchool:{programGradProStatus:"",programGradProType:[],phDTextbox:"",masterTextbox:"",otherTextbox:""},specializedDegCert:{specializedDegCertStatus:"",specializedDegCertType:[],professionalDesignOther:""}}}).catch(k=>{console.log(k)})}}},M=s("p",{class:"font-weight-black text-h5 text--primary"},"Student Entry Form",-1),E=s("p",{class:"text-subtitle-1"},"Fill out the required details and hit the submit button. Don't worry, you'll be able to edit these detail again later.",-1),z=s("p",{class:"font-weight-black text-h6"},"Demographics Information",-1),N=s("p",{class:"font-weight-black"},"What languages do you speak?",-1),G=s("p",{class:"font-weight-black"},"What language do you prefer to receive communication in?",-1),T=s("p",{class:"font-weight-black"},"What are your pronouns? Select all that apply.",-1),j=s("p",{class:"font-weight-black text-h8"},"Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?",-1),L=s("p",{class:"font-weight-black text-h8"},"Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?",-1),F=s("p",{class:"font-weight-black text-h8"},"Are you currently enrolled in a degree program at the University of Houston?",-1),Y={key:0},B=s("p",{class:"font-weight-black text-h6"},"UH Student Only",-1),R=s("p",{class:"font-weight-black text-h8"},"Do you live on or off campus?",-1),q=s("p",{class:"font-weight-black text-h6"},"Educational Background and Goals",-1),W=s("p",{class:"font-weight-black text-h8"},"Are you a member of the Honors College?",-1),Z=s("p",{class:"font-weight-black text-h8"},"Are you affiliated with the Honors College in any other way? If yes, please specify.",-1),J=s("p",{class:"font-weight-black text-h8"},"What is/are your current major(s)?",-1),X=s("p",{class:"font-weight-black text-h8"},"Are you pursuing, or planning to pursue, any of the following Honors College minors?",-1),K=s("p",{class:"font-weight-black text-h8"},"Are you pursuing any other minors? Please list.",-1),Q=s("p",{class:"font-weight-black text-h6"},"Other Engagement",-1),$=s("p",{class:"font-weight-black text-h8"},"Are you a member of Honors in Community Health (HICH)?",-1),ee=s("p",{class:"font-weight-black text-h8"},"Have you participated in HICH Projects (PEERS, Responsive Resourcing, BREATHE, Creative Care, etc)?",-1),oe=s("p",{class:"font-weight-black text-h8"},"Have you had other experience with Community Service?",-1),te={key:0,class:"font-weight-black text-h8"},le={key:2,class:"font-weight-black text-h8"},ne={key:1},se=s("p",{class:"font-weight-black text-h6"},"Non-UH Students Only",-1),ue=s("p",{class:"font-weight-black text-h8"},"Have you had experience with Community Service?",-1),re={key:0,class:"font-weight-black text-h8"},ae={key:0,class:"font-weight-black text-h8"},ie=s("p",{class:"font-weight-black text-h6"},"Graduate/Professional School Goals",-1),de=s("p",{class:"font-weight-black text-h8"},"Do you currently plan to pursue graduate or professional (e.g. medical, law) school?",-1),me=s("p",{class:"font-weight-black text-h8"},"If you are planning to pursue graduate school, what type of program?",-1),fe=s("p",{class:"font-weight-black text-h8"},"Are you planning to pursue any other kind of specialized degree / certificate program?",-1),ce=s("p",{class:"font-weight-black text-h8"},"If you are planning to pursue a specialized degree / certificate program, what type of program?",-1);function he(f,t,U,k,o,S){return r(),c(V,null,[l(C,{style:{width:"90%",margin:"0 auto"}},{default:n(()=>[M,E]),_:1}),l(D,{onSubmit:w(S.handleSubmitForm,["prevent"])},{default:n(()=>[l(C,{style:{width:"90%",margin:"0 auto"}},{default:n(()=>[z,l(i,null,{default:n(()=>[l(u,{cols:"12",md:"6"},{default:n(()=>[l(h,{modelValue:o.studentInformation.cityOrigin,"onUpdate:modelValue":t[0]||(t[0]=e=>o.studentInformation.cityOrigin=e),label:"City of Origin",rules:[e=>!!e||"Information is required"],required:""},null,8,["modelValue","rules"])]),_:1})]),_:1}),N,l(i,null,{default:n(()=>[l(u,{cols:"12",md:"6"},{default:n(()=>[l(h,{modelValue:o.studentInformation.primaryLanguage,"onUpdate:modelValue":t[1]||(t[1]=e=>o.studentInformation.primaryLanguage=e),label:"Primary Language",rules:[e=>!!e||"Information is required"],required:""},null,8,["modelValue","rules"])]),_:1}),l(u,{cols:"12",md:"6"},{default:n(()=>[l(h,{modelValue:o.studentInformation.otherLanguages,"onUpdate:modelValue":t[2]||(t[2]=e=>o.studentInformation.otherLanguages=e),label:"Other Languages"},null,8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[G,l(g,{modelValue:o.studentInformation.languagePreference,"onUpdate:modelValue":t[5]||(t[5]=e=>o.studentInformation.languagePreference=e),rules:[e=>!!e||"Information is required"],required:""},{default:n(()=>[l(a,{label:"English",value:"English",modelValue:o.studentInformation.languagePreference,"onUpdate:modelValue":t[3]||(t[3]=e=>o.studentInformation.languagePreference=e)},null,8,["modelValue"]),l(a,{label:"Spanish",value:"Spanish",modelValue:o.studentInformation.languagePreference,"onUpdate:modelValue":t[4]||(t[4]=e=>o.studentInformation.languagePreference=e)},null,8,["modelValue"])]),_:1},8,["modelValue","rules"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"11",md:"7"},{default:n(()=>[T,s("div",null,[(r(!0),c(V,null,y(o.studentInformation.pronouns,e=>(r(),c("div",{key:e.id},[l(b,{modelValue:e.checked,"onUpdate:modelValue":m=>e.checked=m,label:e.label},null,8,["modelValue","onUpdate:modelValue","label"]),e.id===5&&e.checked?(r(),I(h,{key:0,label:"Other",modelValue:o.studentInformation.otherPronouns,"onUpdate:modelValue":t[6]||(t[6]=m=>o.studentInformation.otherPronouns=m)},null,8,["modelValue"])):d("",!0)]))),128))])]),_:1})]),_:1}),j,l(i,null,{default:n(()=>[l(u,{cols:"12",md:"10"},{default:n(()=>[l(p,{modelValue:o.studentInformation.commentsByStaff,"onUpdate:modelValue":t[7]||(t[7]=e=>o.studentInformation.commentsByStaff=e),label:"Comments"},null,8,["modelValue"])]),_:1})]),_:1}),L,l(i,null,{default:n(()=>[l(u,{cols:"12",md:"10"},{default:n(()=>[l(p,{modelValue:o.studentInformation.issuesConcernsTriggers,"onUpdate:modelValue":t[8]||(t[8]=e=>o.studentInformation.issuesConcernsTriggers=e),label:"Issues, Concerns, Triggers"},null,8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"10"},{default:n(()=>[F,l(g,{modelValue:o.studentInformation.enrolledUHInfo.uhStatus,"onUpdate:modelValue":t[11]||(t[11]=e=>o.studentInformation.enrolledUHInfo.uhStatus=e),rules:[e=>!!e||"Information is required"],required:""},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.enrolledUHInfo.uhStatus,"onUpdate:modelValue":t[9]||(t[9]=e=>o.studentInformation.enrolledUHInfo.uhStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.enrolledUHInfo.uhStatus,"onUpdate:modelValue":t[10]||(t[10]=e=>o.studentInformation.enrolledUHInfo.uhStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue","rules"])]),_:1})]),_:1}),o.studentInformation.enrolledUHInfo.uhStatus=="true"?(r(),c("div",Y,[B,l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[l(h,{modelValue:o.studentInformation.enrolledUHInfo.uhEmail,"onUpdate:modelValue":t[12]||(t[12]=e=>o.studentInformation.enrolledUHInfo.uhEmail=e),label:"UH Email"},null,8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"3"},{default:n(()=>[l(h,{modelValue:o.studentInformation.enrolledUHInfo.peopleSoftID,"onUpdate:modelValue":t[13]||(t[13]=e=>o.studentInformation.enrolledUHInfo.peopleSoftID=e),label:"PeopleSoft ID"},null,8,["modelValue"])]),_:1}),l(u,{cols:"12",md:"2"},{default:n(()=>[l(h,{type:"date",modelValue:o.studentInformation.enrolledUHInfo.expectedGraduationYear,"onUpdate:modelValue":t[14]||(t[14]=e=>o.studentInformation.enrolledUHInfo.expectedGraduationYear=e),label:"Expected Graduation Date",min:"2023-01-01",max:"2099-12-31"},null,8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[R,l(g,{modelValue:o.studentInformation.enrolledUHInfo.livingOnCampus,"onUpdate:modelValue":t[17]||(t[17]=e=>o.studentInformation.enrolledUHInfo.livingOnCampus=e)},{default:n(()=>[l(a,{label:"On-Campus",value:"true",modelValue:o.studentInformation.enrolledUHInfo.livingOnCampus,"onUpdate:modelValue":t[15]||(t[15]=e=>o.studentInformation.enrolledUHInfo.livingOnCampus=e)},null,8,["modelValue"]),l(a,{label:"Off-Campus",value:"false",modelValue:o.studentInformation.enrolledUHInfo.livingOnCampus,"onUpdate:modelValue":t[16]||(t[16]=e=>o.studentInformation.enrolledUHInfo.livingOnCampus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1})]),_:1}),q,l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[W,l(g,{modelValue:o.studentInformation.enrolledUHInfo.honorsCollegeStatus,"onUpdate:modelValue":t[20]||(t[20]=e=>o.studentInformation.enrolledUHInfo.honorsCollegeStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.enrolledUHInfo.honorsCollegeStatus,"onUpdate:modelValue":t[18]||(t[18]=e=>o.studentInformation.enrolledUHInfo.honorsCollegeStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.enrolledUHInfo.honorsCollegeStatus,"onUpdate:modelValue":t[19]||(t[19]=e=>o.studentInformation.enrolledUHInfo.honorsCollegeStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[Z,l(g,{modelValue:o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus,"onUpdate:modelValue":t[24]||(t[24]=e=>o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus,"onUpdate:modelValue":t[21]||(t[21]=e=>o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus=e)},null,8,["modelValue"]),o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus=="true"?(r(),I(h,{key:0,modelValue:o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow,"onUpdate:modelValue":t[22]||(t[22]=e=>o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedHow=e),label:"Please specify"},null,8,["modelValue"])):d("",!0),l(a,{label:"No",value:"false",modelValue:o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus,"onUpdate:modelValue":t[23]||(t[23]=e=>o.studentInformation.enrolledUHInfo.honorsCollegeAffiliatedStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[J,l(v,{modelValue:o.studentInformation.enrolledUHInfo.majors,"onUpdate:modelValue":t[25]||(t[25]=e=>o.studentInformation.enrolledUHInfo.majors=e),items:S.filteredMajors.map(e=>e["Plan Name"]),label:"Select a Major",multiple:"",chips:""},null,8,["modelValue","items"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"11",md:"7"},{default:n(()=>[X,l(v,{modelValue:o.studentInformation.enrolledUHInfo.honorsMinors,"onUpdate:modelValue":t[26]||(t[26]=e=>o.studentInformation.enrolledUHInfo.honorsMinors=e),items:["Data & Society","Medicine & Society","Phronesis","Creative Work","Energy & Sustainability","Leadership Studies","Global Engagement and Research"],label:"Select a Honors Minor",multiple:"",chips:""},null,8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[K,l(v,{modelValue:o.studentInformation.enrolledUHInfo.otherMinors,"onUpdate:modelValue":t[27]||(t[27]=e=>o.studentInformation.enrolledUHInfo.otherMinors=e),items:S.filteredMinors.map(e=>e["Plan Name"]),label:"Select a Minor",multiple:"",chips:""},null,8,["modelValue","items"])]),_:1})]),_:1}),Q,l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[$,l(g,{modelValue:o.studentInformation.hichInfo.hichStatus,"onUpdate:modelValue":t[30]||(t[30]=e=>o.studentInformation.hichInfo.hichStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.hichInfo.hichStatus,"onUpdate:modelValue":t[28]||(t[28]=e=>o.studentInformation.hichInfo.hichStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.hichInfo.hichStatus,"onUpdate:modelValue":t[29]||(t[29]=e=>o.studentInformation.hichInfo.hichStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"7"},{default:n(()=>[ee,l(g,{modelValue:o.studentInformation.hichInfo.hichHistoryStatus,"onUpdate:modelValue":t[33]||(t[33]=e=>o.studentInformation.hichInfo.hichHistoryStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.hichInfo.hichHistoryStatus,"onUpdate:modelValue":t[31]||(t[31]=e=>o.studentInformation.hichInfo.hichHistoryStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.hichInfo.hichHistoryStatus,"onUpdate:modelValue":t[32]||(t[32]=e=>o.studentInformation.hichInfo.hichHistoryStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1})]),_:1}),l(i,null,{default:n(()=>[l(u,{cols:"11"},{default:n(()=>[oe,l(g,{modelValue:o.studentInformation.communityServiceInfo.serviceStatus,"onUpdate:modelValue":t[38]||(t[38]=e=>o.studentInformation.communityServiceInfo.serviceStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.communityServiceInfo.serviceStatus,"onUpdate:modelValue":t[34]||(t[34]=e=>o.studentInformation.communityServiceInfo.serviceStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.communityServiceInfo.serviceStatus,"onUpdate:modelValue":t[35]||(t[35]=e=>o.studentInformation.communityServiceInfo.serviceStatus=e)},null,8,["modelValue"]),o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),c("p",te,"Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.")):d("",!0),o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),I(p,{key:1,modelValue:o.studentInformation.communityServiceInfo.serviceHistoryDesc,"onUpdate:modelValue":t[36]||(t[36]=e=>o.studentInformation.communityServiceInfo.serviceHistoryDesc=e),label:"Please specify"},null,8,["modelValue"])):d("",!0),o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),c("p",le,"Are you a member of any community organizations outside the University? Please list.")):d("",!0),o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),I(h,{key:3,modelValue:o.studentInformation.communityServiceInfo.serviceOrgsOutsideUH,"onUpdate:modelValue":t[37]||(t[37]=e=>o.studentInformation.communityServiceInfo.serviceOrgsOutsideUH=e),label:"Please specify"},null,8,["modelValue"])):d("",!0)]),_:1},8,["modelValue"])]),_:1})]),_:1})])):d("",!0),o.studentInformation.enrolledUHInfo.uhStatus=="false"?(r(),c("div",ne,[se,l(u,{cols:"11"},{default:n(()=>[ue,l(g,{modelValue:o.studentInformation.communityServiceInfo.serviceStatus,"onUpdate:modelValue":t[41]||(t[41]=e=>o.studentInformation.communityServiceInfo.serviceStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.communityServiceInfo.serviceStatus,"onUpdate:modelValue":t[39]||(t[39]=e=>o.studentInformation.communityServiceInfo.serviceStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.communityServiceInfo.serviceStatus,"onUpdate:modelValue":t[40]||(t[40]=e=>o.studentInformation.communityServiceInfo.serviceStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1}),l(u,{cols:"11",md:"10"},{default:n(()=>[o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),c("p",re,"Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.")):d("",!0),o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),I(p,{key:1,modelValue:o.studentInformation.communityServiceInfo.serviceHistoryDesc,"onUpdate:modelValue":t[42]||(t[42]=e=>o.studentInformation.communityServiceInfo.serviceHistoryDesc=e),label:"Please specify"},null,8,["modelValue"])):d("",!0)]),_:1}),l(u,{cols:"11",md:"10"},{default:n(()=>[o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),c("p",ae,"Are you a member of any community organizations outside the University? Please list.")):d("",!0),o.studentInformation.communityServiceInfo.serviceStatus=="true"?(r(),I(i,{key:1},{default:n(()=>[l(p,{modelValue:o.studentInformation.communityServiceInfo.serviceOrgsOutsideUH,"onUpdate:modelValue":t[43]||(t[43]=e=>o.studentInformation.communityServiceInfo.serviceOrgsOutsideUH=e),label:"Please specify"},null,8,["modelValue"])]),_:1})):d("",!0)]),_:1})])):d("",!0),ie,l(u,{cols:"12",md:"10"},{default:n(()=>[de,l(g,{modelValue:o.studentInformation.graduateProfessionalSchool.programGradProStatus,"onUpdate:modelValue":t[46]||(t[46]=e=>o.studentInformation.graduateProfessionalSchool.programGradProStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.graduateProfessionalSchool.programGradProStatus,"onUpdate:modelValue":t[44]||(t[44]=e=>o.studentInformation.graduateProfessionalSchool.programGradProStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.graduateProfessionalSchool.programGradProStatus,"onUpdate:modelValue":t[45]||(t[45]=e=>o.studentInformation.graduateProfessionalSchool.programGradProStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1}),o.studentInformation.graduateProfessionalSchool.programGradProStatus==="true"?(r(),I(u,{key:2,cols:"12",md:"10"},{default:n(()=>[me,s("div",null,[(r(!0),c(V,null,y(o.studentInformation.graduateProfessionalSchool.programGradProType,e=>(r(),c("div",{key:e.id},[l(b,{modelValue:e.checked,"onUpdate:modelValue":m=>e.checked=m,label:e.label},null,8,["modelValue","onUpdate:modelValue","label"]),e.id===4&&e.checked?(r(),I(h,{key:0,label:"Please Specify",modelValue:o.studentInformation.graduateProfessionalSchool.phDTextbox,"onUpdate:modelValue":t[47]||(t[47]=m=>o.studentInformation.graduateProfessionalSchool.phDTextbox=m)},null,8,["modelValue"])):d("",!0),e.id===7&&e.checked?(r(),I(h,{key:1,label:"Please Specify",modelValue:o.studentInformation.graduateProfessionalSchool.masterTextbox,"onUpdate:modelValue":t[48]||(t[48]=m=>o.studentInformation.graduateProfessionalSchool.masterTextbox=m)},null,8,["modelValue"])):d("",!0),e.id===8&&e.checked?(r(),I(h,{key:2,label:"Please Specify",modelValue:o.studentInformation.graduateProfessionalSchool.otherTextbox,"onUpdate:modelValue":t[49]||(t[49]=m=>o.studentInformation.graduateProfessionalSchool.otherTextbox=m)},null,8,["modelValue"])):d("",!0)]))),128))])]),_:1})):d("",!0),l(u,{cols:"12",md:"10"},{default:n(()=>[fe,l(g,{modelValue:o.studentInformation.specializedDegCert.specializedDegCertStatus,"onUpdate:modelValue":t[52]||(t[52]=e=>o.studentInformation.specializedDegCert.specializedDegCertStatus=e)},{default:n(()=>[l(a,{label:"Yes",value:"true",modelValue:o.studentInformation.specializedDegCert.specializedDegCertStatus,"onUpdate:modelValue":t[50]||(t[50]=e=>o.studentInformation.specializedDegCert.specializedDegCertStatus=e)},null,8,["modelValue"]),l(a,{label:"No",value:"false",modelValue:o.studentInformation.specializedDegCert.specializedDegCertStatus,"onUpdate:modelValue":t[51]||(t[51]=e=>o.studentInformation.specializedDegCert.specializedDegCertStatus=e)},null,8,["modelValue"])]),_:1},8,["modelValue"])]),_:1}),o.studentInformation.specializedDegCert.specializedDegCertStatus==="true"?(r(),I(u,{key:3,cols:"12",md:"10"},{default:n(()=>[ce,s("div",null,[(r(!0),c(V,null,y(o.studentInformation.specializedDegCert.specializedDegCertType,e=>(r(),c("div",{key:e.id},[l(b,{modelValue:e.checked,"onUpdate:modelValue":m=>e.checked=m,label:e.label},null,8,["modelValue","onUpdate:modelValue","label"]),e.id===6&&e.checked?(r(),I(h,{key:0,label:"Please Specify",modelValue:o.studentInformation.specializedDegCert.professionalDesignOther,"onUpdate:modelValue":t[53]||(t[53]=m=>o.studentInformation.specializedDegCert.professionalDesignOther=m)},null,8,["modelValue"])):d("",!0)]))),128))])]),_:1})):d("",!0),l(i,null,{default:n(()=>[l(u,{cols:"12",md:"4"},{default:n(()=>[l(O,{type:"submit",methods:"handleSubmitForm",onClick:t[54]||(t[54]=e=>f.showToast()),class:"btn btn-success"},{default:n(()=>[A("Submit Form")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["onSubmit"])],64)}const ge=H(_,[["render",he]]);export{ge as default};
