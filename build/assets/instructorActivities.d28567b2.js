import{_ as S,u as r,i as f,a as A,L as g,o as d,c as _,b as c,w as n,g as e,al as C,l,t as y,h as p,I as k,B as x,v as D,M as b,F as I,x as L,q as N,z as V,af as T}from"./index.ff4761a7.js";import{D as M}from"./datetime.a1e71b77.js";const E={data(){return{activityData:[],showInactive:!1,selectedActivities:[],searchQuery:"",hoverId:null}},mounted(){r().startLoading(),this.fetchActivityData().then(()=>{r().stopLoading()}).catch(i=>{this.handleError(i),r().stopLoading()}),window.scrollTo(0,0),this.$route.params.toastType&&f[this.$route.params.toastType](this.$route.params.toastMessage,{position:this.$route.params.toastPosition,toastClassName:this.$route.params.toastCSS})},methods:{async fetchActivityData(){try{let s=r().token,u="http://1529618mytest.us.reclaim.cloud/backend/instructorSideData/activities/";const h=await A.get(u,{headers:{token:s}});this.activityData=h.data}catch(i){throw this.handleError(i),i}},formatDate(i){return M.fromISO(i).toFormat("MM-dd-yyyy")},editActivity(i){this.$router.push({name:"instructorSpecificActivity",params:{id:i}})},toggleShowInactive(){this.showInactive=!this.showInactive},deactivateActivities(){let s=r().token;const u={activityStatus:!1},h=this.selectedActivities.map(t=>{let a=`http://1529618mytest.us.reclaim.cloud/backend/instructorSideData/activities/${t}`;return A.put(a,u,{headers:{token:s}})});Promise.all(h).then(()=>{const t=(this.selectedActivities.length===1?"Activity":"Activities")+" deactivated!";this.selectedActivities=[],this.fetchActivityData(),f.error(t,{position:"top-right",toastClassName:"Toastify__toast--delete"})}).catch(t=>{this.handleError(t)})},activateActivities(){let s=r().token;const u={activityStatus:!0},h=this.selectedActivities.map(t=>{let a=`http://1529618mytest.us.reclaim.cloud/backend/instructorSideData/activities/${t}`;return A.put(a,u,{headers:{token:s}})});Promise.all(h).then(()=>{const t=(this.selectedActivities.length===1?"Activity":"Activities")+" activated!";this.selectedActivities=[],this.fetchActivityData(),f.success(t,{position:"top-right",toastClassName:"Toastify__toast--create"})}).catch(t=>{this.handleError(t)})}},computed:{filteredActivityData(){const i=this.searchQuery.toLowerCase().trim();return this.showInactive?this.activityData.filter(s=>!s.activityStatus&&s.activityName.toLowerCase().includes(i)):this.activityData.filter(s=>s.activityStatus&&s.activityName.toLowerCase().includes(i))},loading(){return r().loading}}},B={class:""},U={style:{"text-align":"center","margin-top":"2rem","margin-bottom":"2rem"}},F={class:"font-weight-black text-h6"},P=e("br",null,null,-1),Q=e("br",null,null,-1),R=e("br",null,null,-1),j=e("br",null,null,-1),q=e("br",null,null,-1),z=e("br",null,null,-1),O={key:0,justify:"center",align:"center"},G={key:1,style:{display:"flex","justify-content":"center"}},H={style:{"max-height":"400px","overflow-y":"auto"}},J=e("thead",null,[e("tr",null,[e("th",{class:"text-left"}),e("th",{class:"text-left"},"Activity Name"),e("th",{class:"text-left"},"Status"),e("th"),e("th")])],-1),K=["onMouseenter"],W={class:"text-left"},X=["value"],Y=["onClick"],Z=["onClick"],$=e("td",null,null,-1),tt=e("td",null,null,-1);function et(i,s,u,h,t,a){const m=g("router-link"),w=g("center");return d(),_("main",B,[c(w,null,{default:n(()=>[e("h2",U,[c(m,{class:"",to:"/instructorSemesters"},{default:n(()=>[l("Semesters")]),_:1}),l(" | "),c(m,{class:"",to:"/instructorExperiences"},{default:n(()=>[l("Experiences")]),_:1}),l(" | "),c(m,{class:"",to:"/instructorActivities"},{default:n(()=>[l("Activities")]),_:1})]),e("p",F,y(t.showInactive?"Inactive":"Active")+" Activities ",1),P,c(p,{style:{"text-align":"center","margin-right":"2rem"}},{default:n(()=>[c(m,{class:"",to:"/instructorAddActivity"},{default:n(()=>[l("Add New Activity")]),_:1})]),_:1}),c(p,{style:{"text-align":"center"},onClick:a.toggleShowInactive},{default:n(()=>[l(y(t.showInactive?"Show Active Activities":"Show Inactive Activities"),1)]),_:1},8,["onClick"]),Q,R,t.selectedActivities.length>0?(d(),k(p,{key:0,style:{"text-align":"center","margin-right":"2rem"},onClick:a.deactivateActivities},{default:n(()=>[l(" Deactivate ")]),_:1},8,["onClick"])):x("",!0),t.selectedActivities.length>0?(d(),k(p,{key:1,style:{"text-align":"center"},onClick:a.activateActivities},{default:n(()=>[l(" Activate ")]),_:1},8,["onClick"])):x("",!0),j,q,c(D,{modelValue:t.searchQuery,"onUpdate:modelValue":s[0]||(s[0]=o=>t.searchQuery=o),label:"Search by activity name","solo-inverted":"","hide-details":"",outlined:"",dense:""},null,8,["modelValue"]),z]),_:1}),a.loading?(d(),_("div",O,[c(b,{indeterminate:""})])):(d(),_("div",G,[e("div",H,[c(C,{style:{width:"100"}},{default:n(()=>[J,e("tbody",null,[(d(!0),_(I,null,L(a.filteredActivityData,o=>(d(),_("tr",{key:o._id,style:{cursor:"pointer"},class:N({hoverRow:t.hoverId===o._id}),onMouseenter:v=>t.hoverId=o._id,onMouseleave:s[2]||(s[2]=v=>t.hoverId=null)},[e("td",W,[V(e("input",{type:"checkbox","onUpdate:modelValue":s[1]||(s[1]=v=>t.selectedActivities=v),value:o._id,style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,X),[[T,t.selectedActivities]])]),e("td",{class:"text-left",onClick:v=>a.editActivity(o._id)},y(o.activityName),9,Y),e("td",{class:"text-left",onClick:v=>a.editActivity(o._id)},y(o.activityStatus?"Active":"Inactive"),9,Z),$,tt],42,K))),128))])]),_:1})])]))])}const at=S(E,[["render",et]]);export{at as default};
