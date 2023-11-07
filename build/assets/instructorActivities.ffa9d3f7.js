import{_ as S,u as l,i as f,a as A,L as g,o as d,c as _,b as r,w as c,g as e,al as w,l as n,t as y,h as p,I as x,B as k,v as I,M as C,F as E,x as V,q as b,z as L,af as T}from"./index.19bf4f6c.js";import{D as O}from"./datetime.a1e71b77.js";const R={data(){return{activityData:[],showInactive:!1,selectedActivities:[],searchQuery:"",hoverId:null}},mounted(){l().startLoading(),this.fetchActivityData().then(()=>{l().stopLoading()}).catch(s=>{this.handleError(s),l().stopLoading()}),window.scrollTo(0,0),this.$route.params.toastType&&f[this.$route.params.toastType](this.$route.params.toastMessage,{position:this.$route.params.toastPosition,toastClassName:this.$route.params.toastCSS})},methods:{async fetchActivityData(){try{let i=l().token,u={BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API+"/instructorSideData/activities/";const h=await A.get(u,{headers:{token:i}});this.activityData=h.data}catch(s){throw this.handleError(s),s}},formatDate(s){return O.fromISO(s).toFormat("MM-dd-yyyy")},editActivity(s){this.$router.push({name:"instructorSpecificActivity",params:{id:s}})},toggleShowInactive(){this.showInactive=!this.showInactive},deactivateActivities(){let i=l().token;const u={activityStatus:!1},h=this.selectedActivities.map(t=>{let a={BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API+`/instructorSideData/activities/${t}`;return A.put(a,u,{headers:{token:i}})});Promise.all(h).then(()=>{const t=(this.selectedActivities.length===1?"Activity":"Activities")+" deactivated!";this.selectedActivities=[],this.fetchActivityData(),f.error(t,{position:"top-right",toastClassName:"Toastify__toast--delete"})}).catch(t=>{this.handleError(t)})},activateActivities(){let i=l().token;const u={activityStatus:!0},h=this.selectedActivities.map(t=>{let a={BASE_URL:"/platform/",MODE:"production",DEV:!1,PROD:!0}.VITE_ROOT_API+`/instructorSideData/activities/${t}`;return A.put(a,u,{headers:{token:i}})});Promise.all(h).then(()=>{const t=(this.selectedActivities.length===1?"Activity":"Activities")+" activated!";this.selectedActivities=[],this.fetchActivityData(),f.success(t,{position:"top-right",toastClassName:"Toastify__toast--create"})}).catch(t=>{this.handleError(t)})}},computed:{filteredActivityData(){const s=this.searchQuery.toLowerCase().trim();return this.showInactive?this.activityData.filter(i=>!i.activityStatus&&i.activityName.toLowerCase().includes(s)):this.activityData.filter(i=>i.activityStatus&&i.activityName.toLowerCase().includes(s))},loading(){return l().loading}}},N={class:""},M={style:{"text-align":"center","margin-top":"2rem","margin-bottom":"2rem"}},P={class:"font-weight-black text-h6"},B=e("br",null,null,-1),U=e("br",null,null,-1),F=e("br",null,null,-1),Q=e("br",null,null,-1),j=e("br",null,null,-1),q=e("br",null,null,-1),z={key:0,justify:"center",align:"center"},G={key:1,style:{display:"flex","justify-content":"center"}},H={style:{"max-height":"400px","overflow-y":"auto"}},J=e("thead",null,[e("tr",null,[e("th",{class:"text-left"}),e("th",{class:"text-left"},"Activity Name"),e("th",{class:"text-left"},"Status"),e("th"),e("th")])],-1),K=["onMouseenter"],W={class:"text-left"},X=["value"],Y=["onClick"],Z=["onClick"],$=e("td",null,null,-1),tt=e("td",null,null,-1);function et(s,i,u,h,t,a){const m=g("router-link"),D=g("center");return d(),_("main",N,[r(D,null,{default:c(()=>[e("h2",M,[r(m,{class:"",to:"/instructorSemesters"},{default:c(()=>[n("Semesters")]),_:1}),n(" | "),r(m,{class:"",to:"/instructorExperiences"},{default:c(()=>[n("Experiences")]),_:1}),n(" | "),r(m,{class:"",to:"/instructorActivities"},{default:c(()=>[n("Activities")]),_:1})]),e("p",P,y(t.showInactive?"Inactive":"Active")+" Activities ",1),B,r(p,{style:{"text-align":"center","margin-right":"2rem"}},{default:c(()=>[r(m,{class:"",to:"/instructorAddActivity"},{default:c(()=>[n("Add New Activity")]),_:1})]),_:1}),r(p,{style:{"text-align":"center"},onClick:a.toggleShowInactive},{default:c(()=>[n(y(t.showInactive?"Show Active Activities":"Show Inactive Activities"),1)]),_:1},8,["onClick"]),U,F,t.selectedActivities.length>0?(d(),x(p,{key:0,style:{"text-align":"center","margin-right":"2rem"},onClick:a.deactivateActivities},{default:c(()=>[n(" Deactivate ")]),_:1},8,["onClick"])):k("",!0),t.selectedActivities.length>0?(d(),x(p,{key:1,style:{"text-align":"center"},onClick:a.activateActivities},{default:c(()=>[n(" Activate ")]),_:1},8,["onClick"])):k("",!0),Q,j,r(I,{modelValue:t.searchQuery,"onUpdate:modelValue":i[0]||(i[0]=o=>t.searchQuery=o),label:"Search by activity name","solo-inverted":"","hide-details":"",outlined:"",dense:""},null,8,["modelValue"]),q]),_:1}),a.loading?(d(),_("div",z,[r(C,{indeterminate:""})])):(d(),_("div",G,[e("div",H,[r(w,{style:{width:"100"}},{default:c(()=>[J,e("tbody",null,[(d(!0),_(E,null,V(a.filteredActivityData,o=>(d(),_("tr",{key:o._id,style:{cursor:"pointer"},class:b({hoverRow:t.hoverId===o._id}),onMouseenter:v=>t.hoverId=o._id,onMouseleave:i[2]||(i[2]=v=>t.hoverId=null)},[e("td",W,[L(e("input",{type:"checkbox","onUpdate:modelValue":i[1]||(i[1]=v=>t.selectedActivities=v),value:o._id,style:{outline:"2px solid #808080","margin-right":"10px"}},null,8,X),[[T,t.selectedActivities]])]),e("td",{class:"text-left",onClick:v=>a.editActivity(o._id)},y(o.activityName),9,Y),e("td",{class:"text-left",onClick:v=>a.editActivity(o._id)},y(o.activityStatus?"Active":"Inactive"),9,Z),$,tt],42,K))),128))])]),_:1})])]))])}const at=S(R,[["render",et]]);export{at as default};
