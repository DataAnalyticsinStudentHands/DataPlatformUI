import{_ as D,a as f,i as E,u as I,o as _,c as x,b as t,w as a,V as g,r as d,s as m,g as s,t as u,j as v,J as S,l as p,ak as k,f as V,H as C,F as N,x as w,q as b,n as F,p as G,h as T,ah as j,ai as M}from"./index.b63c9539.js";import{D as W}from"./datetime.a1e71b77.js";const P={data(){return{queryData:[],firstName:"",lastName:"",dialog:!1,selectedExperience:null,experiences:[],studentsWithoutGoalForm:[],hoverId:null}},mounted(){let e=localStorage.getItem("token"),o="https://node13835-1529618full3.us.reclaim.cloud/backend/userdata/user";f.get(o,{headers:{token:e}}).then(n=>{this.firstName=n.data.user.firstName,this.lastName=n.data.user.lastName},n=>{n&&this.$router.push("/login")}),this.$route.params.toastType&&E[this.$route.params.toastType](this.$route.params.toastMessage,{position:this.$route.params.toastPosition,toastClassName:this.$route.params.toastCSS}),this.fetchExperiences()},watch:{selectedExperience:"fetchStudentsWithoutGoalForm"},computed:{formattedExperiences(){return this.experiences.map(e=>({text:`${e.experienceCategory}: ${e.experienceName}`,value:e.experienceID}))}},methods:{routePush(e){this.$router.push({name:e})},formattedDate(e){return W.fromISO(e).plus({days:1}).toLocaleString()},updateExperienceID(e){if(!e){this.selectedExperience=null;return}this.selectedExperience=e},async fetchExperiences(){let o=I().token,n="https://node13835-1529618full3.us.reclaim.cloud/backend/studentSideData/activeSemesterExperiences/";try{const i=await f.get(n,{headers:{token:o}});this.experiences=i.data.map(l=>({experienceID:l._id,experienceCategory:l.experienceCategory,experienceName:l.experienceName}))}catch(i){this.handleError(i)}},async fetchStudentsWithoutGoalForm(e){let o=localStorage.getItem("token"),n=`https://node13835-1529618full3.us.reclaim.cloud/backend/instructorSideData/studentsWithoutGoalForm?experienceID=${e}`;try{const i=await f.get(n,{headers:{token:o}});this.studentsWithoutGoalForm=i.data}catch(i){this.handleError(i)}},navigateToProfile(e){this.$router.push({name:"instructorSpecificStudent",params:{userID:e}})}}},y=e=>(j("data-v-a19ffd0c"),e=e(),M(),e),U={class:"font-bold text-4xl text-red-700 tracking-widest mt-10"},$=y(()=>s("span",{class:"red-darken-5"},"See a list of students who have registered for an Experience this Semester, but have not completed a Goal Setting Form for that Experience.",-1)),B={style:{display:"flex","justify-content":"center"}},L={style:{width:"95%"}},R=y(()=>s("thead",null,[s("tr",null,[s("th",{class:"text-left"},"Name"),s("th",{class:"text-left"},"Email"),s("th",{class:"text-left"},"Pronouns"),s("th",{class:"text-left"},"Major(s)"),s("th",{class:"text-left"},"Minor"),s("th",{class:"text-left"},"Expected Graduation Date")])],-1)),q=["onMouseenter","onClick"],A={class:"text-left"},z={class:"text-left"},H={class:"text-left"},J={class:"text-left"},O={class:"text-left"},K={class:"text-left"};function Q(e,o,n,i,l,h){return _(),x("main",null,[t(g,null,{default:a(()=>[t(d,null,{default:a(()=>[t(m,{class:"text-center"},{default:a(()=>[s("h1",U," Welcome "+u(l.firstName)+" "+u(l.lastName),1)]),_:1})]),_:1}),t(d,{class:"my-6"},{default:a(()=>[t(m,{cols:12,class:"ml-10"})]),_:1}),t(d,null,{default:a(()=>[t(m,{cols:12},{default:a(()=>[t(v,{onClick:o[0]||(o[0]=r=>l.dialog=!0),class:"mx-auto","max-width":"400"},{default:a(()=>[t(S,{color:"red darken-2"},{default:a(()=>[p(" Goal Form Completion Tracker ")]),_:1}),t(k,{class:"text-wrap"},{default:a(()=>[$]),_:1})]),_:1})]),_:1})]),_:1}),t(V,{modelValue:l.dialog,"onUpdate:modelValue":o[4]||(o[4]=r=>l.dialog=r),persistent:"",width:"1024"},{default:a(()=>[t(v,null,{default:a(()=>[t(S,null,{default:a(()=>[p(" Goal Form Completion Tracker ")]),_:1}),t(k,{class:"text-h6"},{default:a(()=>[p(" Select an Experience ")]),_:1}),t(g,null,{default:a(()=>[t(d,null,{default:a(()=>[t(m,{cols:"12",sm:"8",md:"8"},{default:a(()=>[t(C,{modelValue:l.selectedExperience,"onUpdate:modelValue":[o[1]||(o[1]=r=>l.selectedExperience=r),h.updateExperienceID],items:h.formattedExperiences,label:"Experience","item-title":"text","item-value":"value",clearable:""},null,8,["modelValue","items","onUpdate:modelValue"])]),_:1})]),_:1})]),_:1}),s("div",B,[s("table",L,[R,s("tbody",null,[(_(!0),x(N,null,w(l.studentsWithoutGoalForm,r=>(_(),x("tr",{key:r.userID,class:b({hoverRow:l.hoverId===r.userID}),onMouseenter:c=>l.hoverId=r.userID,onMouseleave:o[2]||(o[2]=c=>l.hoverId=null),onClick:c=>h.navigateToProfile(r.userID)},[s("td",A,u(r.fullName),1),s("td",z,u(r.email),1),s("td",H,u(r.pronouns.map(c=>c.label).join(", ")),1),s("td",J,u(r.majors.join(", ")),1),s("td",O,u(r.honorsMinors.join(", ")),1),s("td",K,u(r.expectedGraduationDate),1)],42,q))),128))])])]),t(F,null,{default:a(()=>[t(G),t(T,{color:"blue-darken-1",text:"",onClick:o[3]||(o[3]=r=>l.dialog=!1)},{default:a(()=>[p(" Close ")]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})])}const Z=D(P,[["render",Q],["__scopeId","data-v-a19ffd0c"]]);export{Z as default};
