import{_ as M,u as _,i as N,a as I,L as j,o as i,c as p,b as t,g as c,t as d,w as e,V as U,M as q,r as S,s as E,j as b,an as F,ao as m,ap as y,ag as x,l as o,aq as A,m as w,q as g,I as h,B as k,ar as W,as as H,F as V,x as T,f as L,h as C,k as G,n as P,p as B,at as J,J as O,au as z,ah as K,ai as Q}from"./index.b63c9539.js";import{D as X}from"./datetime.a1e71b77.js";const Y={data(){return{queryData:[],firstName:"",lastName:"",allExperiences:[],selectedExperiences:[],registeredExperiences:[],selectedExperience:null,unselectedExperience:null,dialog:!1,graphExpandDialog:!1,items:[{text:"Real-Time",icon:"mdi-clock"},{text:"Audience",icon:"mdi-account"},{text:"Conversions",icon:"mdi-flag"}],selectedListItem:null,shouldShowTooltip:!1,registrationExists:!1}},async mounted(){_().startLoading();try{await this.fetchExperiences(),await this.fetchRegisteredExperiences()}catch(s){this.handleError(s),this.$router.push("/login")}finally{_().stopLoading()}this.$route.params.toastType&&N[this.$route.params.toastType](this.$route.params.toastMessage,{position:this.$route.params.toastPosition,toastClassName:this.$route.params.toastCSS}),this.$route.params.action==="register"&&(this.dialog=!0)},watch:{dialog(s){s&&(this.selectedExperiences=[...this.registeredExperiences])}},computed:{loading(){return _().loading},hasCompletedEntryForm(){return _().hasCompletedEntryForm},goalSettingFormCompletion(){return _().goalSettingFormCompletion},areAllGoalsSet(){return this.goalSettingFormCompletion?this.registeredExperiences.every(s=>this.goalSettingFormCompletion[s._id]):!1},fullName(){const s=_();return s.firstName.trim()+" "+s.lastName.trim()},semesterName(){return _().semesterName}},methods:{async fetchExperiences(){let n=_().token,u="https://node13835-1529618full3.us.reclaim.cloud/backend/studentSideData/experiencesWithActivities/";try{const f=await I.get(u,{headers:{token:n}});this.allExperiences=f.data}catch(f){this.handleError(f)}},routePush(s){this.$router.push({name:s})},formattedDate(s){return X.fromISO(s).plus({days:1}).toLocaleString()},toggleExperienceSelection(s){const n=this.selectedExperiences.findIndex(u=>u._id===s._id);n!==-1?this.selectedExperiences.splice(n,1):this.selectedExperiences.push(s)},removeFromMyExperiences(s){const n=this.selectedExperiences.findIndex(u=>u._id===s._id);n!==-1&&this.selectedExperiences.splice(n,1)},addAllToSelected(){for(const s of this.allExperiences)this.isSelected(s)||this.selectedExperiences.push(s)},removeAllFromSelected(){this.selectedExperiences=[]},clearSelectedExperiences(){this.selectedExperiences=[],this.dialog=!1},isSelected(s){return this.selectedExperiences.some(n=>n._id===s._id)},updateTooltipStatus(){this.$refs.expTooltip&&setTimeout(()=>{this.shouldShowTooltip=!this.shouldShowTooltip},250)},async fetchRegisteredExperiences(){const s=localStorage.getItem("token"),n="https://node13835-1529618full3.us.reclaim.cloud/backend/studentSideData/registeredExperiences";try{const u=await I.get(n,{headers:{token:s}});u.data&&u.data.experienceIDs?(this.registrationExists=!0,this.registeredExperiences=u.data.experienceIDs.map(f=>this.allExperiences.find(a=>a._id===f)).filter(f=>f)):(this.registrationExists=!1,this.registeredExperiences=[])}catch(u){console.log("Error fetching registered experiences: ",u),this.registeredExperiences=[]}},async registerExperiences(){const s=this.registrationExists?"put":"post",n=this.selectedExperiences.map(a=>a._id),u="https://node13835-1529618full3.us.reclaim.cloud/backend/studentSideData/registerExperiences",f=localStorage.getItem("token");try{await I({method:s,url:u,headers:{token:f},data:{experienceIDs:n}}),this.registrationExists=!0,N.success("Experiences Registered!",{position:"top-right",toastClassName:"Toastify__toast--create"}),this.registeredExperiences=[...this.selectedExperiences],this.registeredExperiences.length===0&&(this.goalSettingFormCompletion={}),await _().checkFormCompletion(),this.$nextTick(()=>{this.dialog=!1})}catch(a){this.handleError("Error registering experiences: ",a),N.error("Error registering experiences. Please contact an administrator.",{position:"top-right",toastClassName:"Toastify__toast--delete"})}},isFormCompleted(s){return this.goalSettingFormCompletion&&this.goalSettingFormCompletion[s]}}},D=s=>(K("data-v-0a9dfc00"),s=s(),Q(),s),Z={key:0,class:"loading-container"},$={key:1},ee={class:"font-bold text-4xl text-red-700 tracking-widest text-center mt-10"},te=D(()=>c("span",{class:"font-weight-black text-lg"},"Checklist",-1)),se={class:"flex items-center no-right-margin"},le={key:0,class:"text-red-800 font-weight-black"},re={key:1,class:"text-green-800 font-weight-black"},ae={class:"flex items-center no-right-margin"},ie={key:0},oe={key:1},ne={key:0},de={key:1,class:"text-green-800"},ce={class:"font-weight-black text-base"},ue=D(()=>c("span",{class:"font-weight-black text-base"},"Experiences",-1)),me=D(()=>c("span",null,"Register Here!",-1)),ge={class:"font-weight-black text-xl"};function he(s,n,u,f,a,r){const R=j("router-link");return r.loading?(i(),p("div",Z,[t(q,{indeterminate:""})])):(i(),p("div",$,[c("main",null,[c("h1",ee," Welcome "+d(r.fullName),1),t(U,{fluid:"",style:{width:"90%",margin:"0 auto"}},{default:e(()=>[t(S,null,{default:e(()=>[t(E,{cols:"12",md:"5","offset-md":"1",class:"align-start"},{default:e(()=>[t(b,{class:"mx-auto elevation-12",color:"#385F73",width:"100%"},{default:e(()=>[t(F,null,{default:e(()=>[t(m,null,{default:e(()=>[t(y,{class:"flex-grow-1 text-center"},{default:e(()=>[te,t(x,null,{default:e(()=>[o("mdi-clipboard-check")]),_:1})]),_:1})]),_:1}),t(A,{value:"Entry Form"},{activator:e(({props:l})=>[t(m,w(l,{color:r.hasCompletedEntryForm?"green darken-4":"",class:[r.hasCompletedEntryForm?"light-green-bg":"light-red-bg","font-weight-black text-base"]}),{append:e(()=>[t(x,{class:g(r.hasCompletedEntryForm?"text-green-800":"text-red-800")},{default:e(()=>[o(d(r.hasCompletedEntryForm?"mdi-check-bold":"mdi-alert-circle"),1)]),_:1},8,["class"])]),default:e(()=>[c("span",{class:g(r.hasCompletedEntryForm?"text-green-800":"text-red-800")},d(r.hasCompletedEntryForm?"Student Entry Form":"Complete Student Entry Form"),3)]),_:2},1040,["color","class"])]),default:e(()=>[t(m,{class:g(["list-item-no-padding flex",r.hasCompletedEntryForm?"light-green-bg":"light-red-bg"])},{default:e(()=>[c("div",se,[t(x,{class:g(r.hasCompletedEntryForm?"text-green-800":"text-red-800"),size:"small"},{default:e(()=>[o(d("mdi-door-open"))]),_:1},8,["class"]),c("span",{class:g(r.hasCompletedEntryForm?"text-sm text-green-800":"text-sm text-red-800")},[o(d(r.hasCompletedEntryForm?"Thank you for completing the Student Entry Form!":"Please complete the ")+" ",1),r.hasCompletedEntryForm?k("",!0):(i(),h(R,{key:0,to:"/studentEntryForm",class:"text-blue-500 underline"},{default:e(()=>[o("Student Entry Form")]),_:1}))],2)])]),_:1},8,["class"])]),_:1}),r.hasCompletedEntryForm?(i(),h(A,{key:0,value:"Register Experiences"},{activator:e(({props:l})=>[t(m,w(l,{class:a.registeredExperiences.length===0?"light-red-bg":"light-green-bg",onClick:n[0]||(n[0]=v=>a.registeredExperiences.length===0&&r.updateTooltipStatus())}),{append:e(()=>[a.registeredExperiences.length===0?(i(),h(x,{key:0,class:"text-red-800"},{default:e(()=>[o("mdi-alert-circle")]),_:1})):(i(),h(x,{key:1,class:"text-green-800"},{default:e(()=>[o("mdi-check-bold")]),_:1}))]),default:e(()=>[a.registeredExperiences.length===0?(i(),p("span",le,"Register your Experiences")):(i(),p("span",re,"Experiences Registered"))]),_:2},1040,["class"])]),default:e(()=>[t(m,{class:g(["list-item-no-padding flex",a.registeredExperiences.length===0?"light-red-bg":"light-green-bg"])},{default:e(()=>[c("div",ae,[t(x,{class:g(a.registeredExperiences.length===0?"text-red-800":"text-green-800"),size:"small"},{default:e(()=>[o("mdi-flag-checkered")]),_:1},8,["class"]),c("span",{class:g(a.registeredExperiences.length===0?"text-sm text-red-800":"text-sm text-green-800")},[a.registeredExperiences.length===0?(i(),p("span",ie,'Please use the "Add/Remove Experiences" button to register!')):(i(),p("span",oe,"Congratulations on registering for your experiences! Good luck!"))],2)])]),_:1},8,["class"])]),_:1})):k("",!0),a.registeredExperiences.length?(i(),h(A,{key:1,value:"Goal Form",class:g(r.areAllGoalsSet?"light-green-bg":"light-red-bg")},{activator:e(({props:l})=>[t(m,W(H(l)),{append:e(()=>[t(x,{class:g(r.areAllGoalsSet?"text-green-800":"text-red-800")},{default:e(()=>[o(d(r.areAllGoalsSet?"mdi-check-bold":"mdi-alert-circle"),1)]),_:1},8,["class"])]),default:e(()=>[c("span",{class:g(r.areAllGoalsSet?"text-green-800 font-weight-black":"text-red-800 font-weight-black")},[o(d(r.areAllGoalsSet?"Completed":"Complete")+" Goal Setting Form",1),a.registeredExperiences.length>1?(i(),p("span",ne,"s")):k("",!0)],2)]),_:2},1040)]),default:e(()=>[(i(!0),p(V,null,T(a.registeredExperiences,l=>(i(),h(m,{key:l._id,class:g(r.isFormCompleted(l._id)?"light-green-bg":"light-red-bg")},{default:e(()=>[c("span",{class:g(r.isFormCompleted(l._id)?"text-sm text-green-800":"text-sm text-red-800")},d(r.isFormCompleted(l._id)?"Completed":"Complete")+" Goal Setting Form for ",3),r.isFormCompleted(l._id)?(i(),p("span",de,d(l.experienceName),1)):(i(),h(R,{key:0,to:{name:"goalSettingForm",params:{id:l._id}},class:"text-blue-600 underline hover:text-blue-800"},{default:e(()=>[o(d(l.experienceName),1)]),_:2},1032,["to"]))]),_:2},1032,["class"]))),128))]),_:1},8,["class"])):k("",!0)]),_:1})]),_:1})]),_:1}),t(E,{cols:"12",md:"1"}),r.hasCompletedEntryForm?(i(),h(E,{key:0,cols:"12",md:"5",class:"align-start"},{default:e(()=>[t(b,{class:"mx-auto elevation-12",color:"#385F73",width:"100%"},{default:e(()=>[t(F,null,{default:e(()=>[t(m,{class:"grey lighten-1"},{default:e(()=>[t(y,{class:"flex-grow-1 text-center"},{default:e(()=>[c("span",ce,d(r.semesterName),1)]),_:1})]),_:1}),t(m,null,{default:e(()=>[t(y,{class:"flex-grow-1 text-center"},{default:e(()=>[ue,t(L,{width:"500"},{activator:e(({props:l})=>[t(C,w({size:"x-small",class:"pb-3",variant:"text",icon:"mdi-help-circle-outline",flat:""},l),null,16)]),default:e(({isActive:l})=>[t(b,{title:"Registered Experiences"},{default:e(()=>[t(G,null,{default:e(()=>[o(" Experiences are courses, projects, research, and other opportunities for growth. Select the Experiences you are a part of! ")]),_:1}),t(P,null,{default:e(()=>[t(B),t(C,{text:"Close",onClick:v=>l.value=!1},null,8,["onClick"])]),_:2},1024)]),_:2},1024)]),_:1})]),_:1}),(i(!0),p(V,null,T(a.registeredExperiences,l=>(i(),h(m,{class:"unclickable",key:l._id,value:l},{default:e(()=>[t(y,null,{default:e(()=>[o(d(l.experienceName),1)]),_:2},1024)]),_:2},1032,["value"]))),128)),a.registeredExperiences.length===0?(i(),h(m,{key:0},{default:e(()=>[t(y,null,{default:e(()=>[o(" (No Registered Experiences) ")]),_:1})]),_:1})):k("",!0)]),_:1}),t(m,null,{default:e(()=>[t(S,{class:"justify-center"},{default:e(()=>[t(E,{cols:"auto"},{default:e(()=>[t(J,{ref:"expTooltip",modelValue:a.shouldShowTooltip,"onUpdate:modelValue":n[2]||(n[2]=l=>a.shouldShowTooltip=l),location:s.$vuetify.display.xs||s.$vuetify.display.sm?"bottom":"left",class:"custom-tooltip"},{activator:e(({props:l})=>[t(C,w({color:"grey-lighten-2"},l,{onClick:n[1]||(n[1]=v=>a.dialog=!0)}),{default:e(()=>[o(" Add / Remove Experiences ")]),_:2},1040)]),default:e(()=>[me]),_:1},8,["modelValue","location"]),t(L,{modelValue:a.dialog,"onUpdate:modelValue":n[3]||(n[3]=l=>a.dialog=l),persistent:"","max-width":"100%",scrim:"rgba(0, 0, 0, 0.7)"},{default:e(()=>[t(b,null,{default:e(()=>[t(O,null,{default:e(()=>[c("span",ge,"Add / Remove Experiences - "+d(r.semesterName),1)]),_:1}),t(G,null,{default:e(()=>[t(S,null,{default:e(()=>[t(E,{cols:"12",md:"5"},{default:e(()=>[t(F,{density:"compact"},{default:e(()=>[t(z,null,{default:e(()=>[o("All Experiences")]),_:1}),(i(!0),p(V,null,T(a.allExperiences,l=>(i(),h(m,{key:l._id,onClick:v=>r.toggleExperienceSelection(l),class:g(r.isSelected(l)?"light-red-bg":"")},{append:e(()=>[r.isSelected(l)?(i(),h(x,{key:0},{default:e(()=>[o("mdi-check")]),_:1})):k("",!0)]),default:e(()=>[t(y,null,{default:e(()=>[o(d(l.experienceName),1)]),_:2},1024)]),_:2},1032,["onClick","class"]))),128))]),_:1})]),_:1}),t(E,{cols:"12",md:"2",class:"text-center d-flex align-center justify-center"},{default:e(()=>[c("div",null,[t(S,{class:"mb-2"},{default:e(()=>[t(C,{onClick:r.addAllToSelected},{default:e(()=>[t(x,null,{default:e(()=>[o("mdi-chevron-double-right")]),_:1})]),_:1},8,["onClick"])]),_:1}),t(S,null,{default:e(()=>[t(C,{onClick:r.removeAllFromSelected},{default:e(()=>[t(x,null,{default:e(()=>[o("mdi-chevron-double-left")]),_:1})]),_:1},8,["onClick"])]),_:1})])]),_:1}),t(E,{cols:"12",md:"5"},{default:e(()=>[t(F,{density:"compact"},{default:e(()=>[t(z,null,{default:e(()=>[o("My Experiences")]),_:1}),(i(!0),p(V,null,T(a.selectedExperiences,l=>(i(),h(m,{key:l._id,value:l,onClick:v=>r.removeFromMyExperiences(l)},{default:e(()=>[t(y,null,{default:e(()=>[o(d(l.experienceName),1)]),_:2},1024)]),_:2},1032,["value","onClick"]))),128))]),_:1})]),_:1})]),_:1})]),_:1}),t(P,null,{default:e(()=>[t(B),t(C,{color:"blue-darken-1",variant:"text",onClick:r.clearSelectedExperiences},{default:e(()=>[o(" Close ")]),_:1},8,["onClick"]),t(C,{color:"blue-darken-1",variant:"text",onClick:r.registerExperiences},{default:e(()=>[o(" Save ")]),_:1},8,["onClick"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})):k("",!0)]),_:1})]),_:1})])]))}const xe=M(Y,[["render",he],["__scopeId","data-v-0a9dfc00"]]);export{xe as default};
