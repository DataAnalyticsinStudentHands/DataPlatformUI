import{_ as S,u as I,a as v,o as c,I as m,w as e,e as H,b as o,s as a,h as P,l as k,r as l,g as t,t as r,c as z,B as h,V as C}from"./index.b63c9539.js";const U={data(){return{userData:[],studentData:[]}},beforeMount(){(async()=>{try{let d=I().token,u="https://node13835-1529618full3.us.reclaim.cloud/backend/studentSideData/studentInformation";const g=await v.get(u+`/${this.$route.params.userID}`,{headers:{token:d}});this.userData=g.data.userData,this.studentData=g.data.studentData.studentInformation}catch(i){this.handleError("Error fetching student information:",i)}})()},computed:{checkedPronouns(){var i,d;return this.studentData&&((i=this.studentData)==null?void 0:i.pronouns)?(d=this.studentData)==null?void 0:d.pronouns.filter(u=>u.checked===!0).map(u=>u.label).join(", "):""},honorsCollegeAffiliated(){var i;return(i=this.studentData.enrolledUHInfo)==null?void 0:i.honorsCollegeAffiliated.filter(d=>d.checked===!0).map(d=>d.label).join(", ")},majors(){var d,u;const i=(u=(d=this.studentData)==null?void 0:d.enrolledUHInfo)==null?void 0:u.majors;return Array.isArray(i)&&i.length>0?i.join(", "):"None"},honorsMinors(){var d,u;const i=(u=(d=this.studentData)==null?void 0:d.enrolledUHInfo)==null?void 0:u.honorsMinors;return Array.isArray(i)&&i.length>0?i.join(", "):"None"},otherMinors(){var d,u;const i=(u=(d=this.studentData)==null?void 0:d.enrolledUHInfo)==null?void 0:u.otherMinors;return Array.isArray(i)&&i.length>0?i.join(", "):"None"},programGradProType(){var i,d;return(d=(i=this.studentData)==null?void 0:i.graduateProfessionalSchool)==null?void 0:d.programGradProType.filter(u=>u.checked===!0).map(u=>u.label).join(", ")},specializedDCType(){var i,d;return(d=(i=this.studentData)==null?void 0:i.specializedDegCert)==null?void 0:d.specializedDegCertType.filter(u=>u.checked===!0).map(u=>u.label).join(", ")},languagePreferenceValue(){return this.userData&&this.userData.languagePreference?this.userData.languagePreference:this.studentData&&this.studentData.languagePreference?this.studentData.languagePreference:""}},methods:{}},A=t("p",{class:"font-weight-black text-h5"},"Student's Information",-1),O=t("br",null,null,-1),j=t("p",{class:"font-weight-black text-h6"},"Basic Information",-1),N=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"First Name",-1),G={style:{margin:"0"}},T=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Last Name",-1),V={style:{margin:"0"}},B=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Email",-1),M={style:{margin:"0"}},E=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Language Preference",-1),L={style:{margin:"0"}},Y=t("br",null,null,-1),F=t("p",{class:"font-weight-black text-h6"},"Demographics Information",-1),R=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"City of Origin",-1),W={style:{margin:"0"}},q=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Primary Language",-1),J={style:{margin:"0"}},K=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Other Languages",-1),Q={style:{margin:"0"}},X=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Pronouns",-1),Z={style:{margin:"0"}},$=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Other Pronouns",-1),tt={style:{margin:"0"}},et=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Do you have any comments about the way these pronouns are used by faculty/staff in public or private settings?",-1),ot={style:{margin:"0"}},st=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are there any issues, concerns, or personal triggers you would like instructors to be aware of when facilitating lessons and meetings?",-1),nt={style:{margin:"0"}},at={key:0},rt=t("br",null,null,-1),lt=t("p",{class:"font-weight-black text-h6"},"UH Student's Information",-1),it=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"UH Email",-1),dt={style:{margin:"0"}},ut=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"PeopleSoft ID",-1),ct={style:{margin:"0"}},ht=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Expected Graduation Date",-1),mt={style:{margin:"0"}},ft=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Do you live on or off campus?",-1),gt={style:{margin:"0"}},_t=t("br",null,null,-1),yt=t("p",{class:"font-weight-black text-h7"},"Educational Background and Goals",-1),pt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you currently enrolled in a degree program at the University of Houston?",-1),bt={style:{margin:"0"}},Dt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you a member of the Honors College?",-1),wt={style:{margin:"0"}},xt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you affiliated with the Honors College in any other way (other than Data & Society courses, participating in an Honors minor, or HICH)?",-1),zt={style:{margin:"0"}},St=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Other Honors College Affiliation Information",-1),It={style:{margin:"0"}},vt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"What is/are your current major(s)?",-1),Ht={style:{margin:"0"}},Pt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you pursuing, or planning to pursue, any of the following Honors College minors?",-1),kt={style:{margin:"0"}},Ct=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you pursuing any other minors? Please list.",-1),Ut={style:{margin:"0"}},At=t("br",null,null,-1),Ot=t("p",{class:"font-weight-black text-h7"},"Other Engagement",-1),jt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you a member of Honors in Community Health (HICH)?",-1),Nt={style:{margin:"0"}},Gt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Have you participated in HICH Projects?",-1),Tt={style:{margin:"0"}},Vt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Have you had other experience with Community Service?",-1),Bt={style:{margin:"0"}},Mt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.",-1),Et={style:{margin:"0"}},Lt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you a member of any community organizations outside the University? Please list.",-1),Yt={style:{margin:"0"}},Ft={key:1},Rt=t("p",{class:"font-weight-black text-h6"},"Non-UH Students Information",-1),Wt=t("br",null,null,-1),qt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Have you had other experience with Community Service?",-1),Jt={style:{margin:"0"}},Kt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Please briefly describe any community service opportunities you were involved in. Include organization and scope of service.",-1),Qt={style:{margin:"0"}},Xt=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you a member of any community organizations outside the University? Please list.",-1),Zt={style:{margin:"0"}},$t=t("br",null,null,-1),te=t("p",{class:"font-weight-black text-h6"},"Graduate/Professional School Goals",-1),ee=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Do you currently plan to pursue graduate or professional (e.g. medical, law) school?",-1),oe={style:{margin:"0"}},se=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"If you are planning to pursue graduate school, what type of program?",-1),ne={style:{margin:"0"}},ae=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"PhD Information",-1),re={style:{margin:"0"}},le=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Master Information",-1),ie={style:{margin:"0"}},de=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Other Professional Schooling Information",-1),ue={style:{margin:"0"}},ce=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Are you planning to pursue any other kind of specialized degree / certificate program?",-1),he={style:{margin:"0"}},me=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Listed Specialized Degree / Certificate Program",-1),fe={style:{margin:"0"}},ge=t("label",{style:{"font-weight":"500","margin-bottom":"5px","font-size":"0.75rem",color:"grey"}},"Other Specialized Degree / Certificate Program",-1),_e={style:{margin:"0"}};function ye(i,d,u,g,pe,f){return c(),m(H,{disabled:""},{default:e(()=>[o(l,{style:{"margin-top":"1rem"}},{default:e(()=>[o(a,{cols:"3",style:{"padding-left":"3rem"}},{default:e(()=>[o(P,{onClick:d[0]||(d[0]=_=>i.$router.back())},{default:e(()=>[k(" Go Back ")]),_:1})]),_:1}),o(a,{cols:"6",class:"text-center"},{default:e(()=>[A]),_:1}),o(a,{cols:"3"})]),_:1}),o(C,{style:{width:"90%",margin:"0 auto"}},{default:e(()=>{var _,y,p,b,D,w;return[O,j,o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>[N,t("p",G,r(this.userData.firstName),1)]),_:1}),o(a,{cols:"12",md:"6"},{default:e(()=>[T,t("p",V,r(this.userData.lastName),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>[B,t("p",M,r(this.userData.email),1)]),_:1}),o(a,{cols:"12",md:"4"},{default:e(()=>[E,t("p",L,r(f.languagePreferenceValue),1)]),_:1})]),_:1}),Y,F,o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>[R,t("p",W,r(this.studentData.cityOrigin),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12",md:"4"},{default:e(()=>[q,t("p",J,r(this.studentData.primaryLanguage),1)]),_:1}),o(a,{cols:"12",md:"4"},{default:e(()=>[K,t("p",Q,r(this.studentData.otherLanguages),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"11",md:"6"},{default:e(()=>[X,t("p",Z,r(f.checkedPronouns),1)]),_:1}),o(a,{cols:"11",md:"6"},{default:e(()=>[$,t("p",tt,r(this.studentData.otherPronouns),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12"},{default:e(()=>[et,t("p",ot,r(this.studentData.commentsByStaff),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12"},{default:e(()=>[st,t("p",nt,r(this.studentData.issuesConcernsTriggers),1)]),_:1})]),_:1}),((y=(_=this.studentData)==null?void 0:_.enrolledUHInfo)==null?void 0:y.uhStatus)=="Yes"?(c(),z("div",at,[rt,lt,o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>[it,t("p",dt,r(this.studentData.enrolledUHInfo.uhEmail),1)]),_:1}),o(a,{cols:"12",md:"3"},{default:e(()=>[ut,t("p",ct,r(this.studentData.enrolledUHInfo.peopleSoftID),1)]),_:1}),o(a,{cols:"12",md:"3"},{default:e(()=>[ht,t("p",mt,r(this.studentData.enrolledUHInfo.expectedGraduationYear),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>[ft,t("p",gt,r(this.studentData.enrolledUHInfo.livingOnCampus),1)]),_:1})]),_:1}),_t,yt,o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>[pt,t("p",bt,r(this.studentData.enrolledUHInfo.uhStatus),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>{var s,n;return[Dt,t("p",wt,r((n=(s=this.studentData)==null?void 0:s.enrolledUHInfo)==null?void 0:n.honorsCollegeStatus),1)]}),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12",md:"10"},{default:e(()=>[xt,t("p",zt,r(f.honorsCollegeAffiliated),1)]),_:1}),o(a,{cols:"11"},{default:e(()=>{var s,n;return[St,t("p",It,r((n=(s=this.studentData)==null?void 0:s.enrolledUHInfo)==null?void 0:n.honorsCollegeAffiliatedOther),1)]}),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12"},{default:e(()=>[vt,t("p",Ht,r(f.majors),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12"},{default:e(()=>[Pt,t("p",kt,r(f.honorsMinors),1)]),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12"},{default:e(()=>[Ct,t("p",Ut,r(f.otherMinors),1)]),_:1})]),_:1}),At,Ot,o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>{var s,n;return[jt,t("p",Nt,r((n=(s=this.studentData)==null?void 0:s.hichInfo)==null?void 0:n.hichStatus),1)]}),_:1}),o(a,{cols:"12",md:"6"},{default:e(()=>{var s,n;return[Gt,t("p",Tt,r((n=(s=this.studentData)==null?void 0:s.hichInfo)==null?void 0:n.hichHistoryStatus),1)]}),_:1})]),_:1}),o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>{var s,n;return[Vt,t("p",Bt,r((n=(s=this.studentData)==null?void 0:s.communityServiceInfo)==null?void 0:n.serviceStatus),1)]}),_:1})]),_:1}),o(l,null,{default:e(()=>{var s,n;return[(n=(s=this.studentData)==null?void 0:s.communityServiceInfo)!=null&&n.serviceStatus?(c(),m(a,{key:0,cols:"12"},{default:e(()=>[Mt,t("p",Et,r(this.studentData.communityServiceInfo.serviceHistoryDesc),1)]),_:1})):h("",!0)]}),_:1}),o(l,null,{default:e(()=>{var s,n;return[(n=(s=this.studentData)==null?void 0:s.communityServiceInfo)!=null&&n.serviceStatus?(c(),m(a,{key:0,cols:"12"},{default:e(()=>[Lt,t("p",Yt,r(this.studentData.communityServiceInfo.serviceOrgsOutsideUH),1)]),_:1})):h("",!0)]}),_:1})])):h("",!0),((b=(p=this.studentData)==null?void 0:p.enrolledUHInfo)==null?void 0:b.uhStatus)=="No"?(c(),z("div",Ft,[Rt,Wt,o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>{var s,n;return[qt,t("p",Jt,r((n=(s=this.studentData)==null?void 0:s.communityServiceInfo)==null?void 0:n.serviceStatus),1)]}),_:1})]),_:1}),o(l,null,{default:e(()=>{var s,n;return[((n=(s=this.studentData)==null?void 0:s.communityServiceInfo)==null?void 0:n.serviceStatus)==="Yes"?(c(),m(a,{key:0,cols:"12"},{default:e(()=>[Kt,t("p",Qt,r(this.studentData.communityServiceInfo.serviceHistoryDesc),1)]),_:1})):h("",!0)]}),_:1}),o(l,null,{default:e(()=>{var s,n;return[((n=(s=this.studentData)==null?void 0:s.communityServiceInfo)==null?void 0:n.serviceStatus)==="Yes"?(c(),m(a,{key:0,cols:"12"},{default:e(()=>[Xt,t("p",Zt,r(this.studentData.communityServiceInfo.serviceOrgsOutsideUH),1)]),_:1})):h("",!0)]}),_:1})])):h("",!0),$t,te,o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>{var s,n;return[ee,t("p",oe,r((n=(s=this.studentData)==null?void 0:s.graduateProfessionalSchool)==null?void 0:n.programGradProStatus),1)]}),_:1})]),_:1}),o(l,null,{default:e(()=>{var s,n;return[((n=(s=this.studentData)==null?void 0:s.graduateProfessionalSchool)==null?void 0:n.programGradProStatus)==="Yes"?(c(),m(a,{key:0,cols:"11"},{default:e(()=>[se,t("p",ne,r(f.programGradProType),1)]),_:1})):h("",!0)]}),_:1}),((w=(D=this.studentData)==null?void 0:D.graduateProfessionalSchool)==null?void 0:w.programGradProStatus)==="Yes"?(c(),m(l,{key:2},{default:e(()=>[o(a,{cols:"11"},{default:e(()=>{var s,n;return[ae,t("p",re,r((n=(s=this.studentData)==null?void 0:s.graduateProfessionalSchool)==null?void 0:n.phDTextbox),1)]}),_:1}),o(a,{cols:"11"},{default:e(()=>{var s,n;return[le,t("p",ie,r((n=(s=this.studentData)==null?void 0:s.graduateProfessionalSchool)==null?void 0:n.masterTextbox),1)]}),_:1}),o(a,{cols:"11"},{default:e(()=>{var s,n;return[de,t("p",ue,r((n=(s=this.studentData)==null?void 0:s.graduateProfessionalSchool)==null?void 0:n.otherTextbox),1)]}),_:1})]),_:1})):h("",!0),o(l,null,{default:e(()=>[o(a,{cols:"12",md:"6"},{default:e(()=>{var s,n;return[ce,t("p",he,r((n=(s=this.studentData)==null?void 0:s.specializedDegCert)==null?void 0:n.specializedDegCertStatus),1)]}),_:1})]),_:1}),o(l,null,{default:e(()=>{var s,n;return[(n=(s=this.studentData)==null?void 0:s.specializedDegCert)!=null&&n.specializedDegCertStatus?(c(),m(a,{key:0},{default:e(()=>[me,t("p",fe,r(f.specializedDCType),1)]),_:1})):h("",!0)]}),_:1}),o(l,null,{default:e(()=>{var s,n;return[(n=(s=this.studentData)==null?void 0:s.specializedDegCert)!=null&&n.specializedDegCertType.find(x=>x.id===6&&x.checked)?(c(),m(a,{key:0},{default:e(()=>[ge,t("p",_e,r(this.studentData.specializedDegCert.professionalDesignOther),1)]),_:1})):h("",!0)]}),_:1})]}),_:1})]),_:1})}const De=S(U,[["render",ye]]);export{De as default};