import{_ as S,u as m,a as y,P as A,o as d,c as p,b as l,w as a,l as t,U as w,k as o,j as v,t as f,M as k,n as g,W as D,F as b,r as C,m as I,Q as V}from"./index.06e63598.js";import{D as N}from"./datetime.a1e71b77.js";const L={data(){return{activityData:[],showInactive:!1,selectedActivities:[],searchQuery:""}},mounted(){this.fetchActivityData(),window.scrollTo(0,0)},methods:{fetchActivityData(){let e=m().token,u="https://cis-4339.herokuapp.com/instructorSideData/activities/";y.get(u,{headers:{token:e}}).then(n=>{this.activityData=n.data}).catch(n=>{console.log(n)})},formatDate(s){return N.fromISO(s).toFormat("MM-dd-yyyy")},editActivity(s){this.$router.push({name:"instructorSpecificActivity",params:{id:s}})},toggleShowInactive(){this.showInactive=!this.showInactive},deactivateActivities(){let e=m().token;const u={activityStatus:!1},n=this.selectedActivities.map(i=>{let c=`https://cis-4339.herokuapp.com/instructorSideData/activities/${i}`;return y.put(c,u,{headers:{token:e}})});Promise.all(n).then(()=>{this.selectedActivities=[],this.fetchActivityData(),alert("The activities have been deactivated."),this.$router.push("/instructorActivities")}).catch(i=>{console.log(i)})},activateActivities(){let e=m().token;const u={activityStatus:!0},n=this.selectedActivities.map(i=>{let c=`https://cis-4339.herokuapp.com/instructorSideData/activities/${i}`;return y.put(c,u,{headers:{token:e}})});Promise.all(n).then(()=>{this.selectedActivities=[],this.fetchActivityData(),alert("The activities have been activated."),this.$router.push("/instructorActivities")}).catch(i=>{console.log(i)})}},computed:{filteredActivityData(){const s=this.searchQuery.toLowerCase().trim();return this.showInactive?this.activityData.filter(e=>!e.activityStatus&&e.activityName.toLowerCase().includes(s)):this.activityData.filter(e=>e.activityStatus&&e.activityName.toLowerCase().includes(s))}}},T={class:""},U={style:{"text-align":"center","margin-top":"2rem","margin-bottom":"2rem"}},B=t("p",{class:"font-weight-black text-h6"},"Activities",-1),Q=t("br",null,null,-1),F=t("br",null,null,-1),M=t("br",null,null,-1),E=t("br",null,null,-1),P=t("br",null,null,-1),R=t("br",null,null,-1),j={style:{display:"flex","justify-content":"center"}},q={style:{"max-height":"400px","overflow-y":"auto"}},O=t("thead",null,[t("tr",null,[t("th",{class:"text-left"}),t("th",{class:"text-left"},"Activity Name"),t("th",{class:"text-left"},"Status"),t("th"),t("th")])],-1),W={class:"text-left"},z=["value"],G=["onClick"],H=["onClick"],J=t("td",null,null,-1),K=t("td",null,null,-1);function X(s,e,u,n,i,c){const h=A("router-link"),x=A("center");return d(),p("main",T,[l(x,null,{default:a(()=>[t("h2",U,[l(h,{class:"",to:"/instructorSemesters"},{default:a(()=>[o("Semesters")]),_:1}),o(" | "),l(h,{class:"",to:"/instructorExperiences"},{default:a(()=>[o("Experiences")]),_:1}),o(" | "),l(h,{class:"",to:"/instructorActivities"},{default:a(()=>[o("Activities")]),_:1})]),B,Q,l(v,{style:{"text-align":"center","margin-right":"2rem"}},{default:a(()=>[l(h,{class:"",to:"/instructorAddActivity"},{default:a(()=>[o("Add New Activity")]),_:1})]),_:1}),l(v,{style:{"text-align":"center"},onClick:c.toggleShowInactive},{default:a(()=>[o(f(i.showInactive?"Show Active Activities":"Show Inactive Activities"),1)]),_:1},8,["onClick"]),F,M,i.selectedActivities.length>0?(d(),k(v,{key:0,style:{"text-align":"center","margin-right":"2rem"},onClick:c.deactivateActivities},{default:a(()=>[o(" Deactivate ")]),_:1},8,["onClick"])):g("",!0),i.selectedActivities.length>0?(d(),k(v,{key:1,style:{"text-align":"center"},onClick:c.activateActivities},{default:a(()=>[o(" Activate ")]),_:1},8,["onClick"])):g("",!0),E,P,l(D,{modelValue:i.searchQuery,"onUpdate:modelValue":e[0]||(e[0]=r=>i.searchQuery=r),label:"Search by activity name","solo-inverted":"","hide-details":"",outlined:"",dense:""},null,8,["modelValue"]),R]),_:1}),t("div",j,[t("div",q,[l(w,{style:{width:"100"}},{default:a(()=>[O,t("tbody",null,[(d(!0),p(b,null,C(c.filteredActivityData,r=>(d(),p("tr",{key:r._id},[t("td",W,[I(t("input",{type:"checkbox","onUpdate:modelValue":e[1]||(e[1]=_=>i.selectedActivities=_),value:r._id,style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,z),[[V,i.selectedActivities]])]),t("td",{class:"text-left",onClick:_=>c.editActivity(r._id)},f(r.activityName),9,G),t("td",{class:"text-left",onClick:_=>c.editActivity(r._id)},f(r.activityStatus?"Active":"Inactive"),9,H),J,K]))),128))])]),_:1})])])])}const $=S(L,[["render",X]]);export{$ as default};
